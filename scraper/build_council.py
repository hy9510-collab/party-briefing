# -*- coding: utf-8 -*-
"""3개 선관위 PDF → council.js 생성.
  광역 지역구  → provList  (도의원)
  기초 지역구  → basicList (시·군의원 지역구)
  기초 비례    → basicList (시·군의원 비례)  ※raw 모드 한 줄 = 한 명
광역 비례(도 전체)는 시군 카드에서 제외.
"""
import subprocess, re, json, sys, importlib.util

spec = importlib.util.spec_from_file_location("pc", "scraper/parse_council.py")
pc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pc)

GWANG = "[제9회_전국동시지방선거]_당선인_명부[시·도의회의원선거][경기도].pdf"
GIGO  = "[제9회_전국동시지방선거]_당선인_명부[구·시·군의회의원선거][경기도].pdf"
BIRYE = "[제9회_전국동시지방선거]_당선인_명부[기초의원비례대표선거][경기도].pdf"

DLET = re.compile(r"([가나다라마바사아자차카타파하])선")


def d_gwang(hdr):
    m = re.search(r"제(\d+)선", hdr)
    return f"{m.group(1)}선거구" if m else "선거구"


def d_gigo(hdr):
    m = DLET.search(hdr)
    return m.group(1) if m else ""


def seats(lst):
    s = {}
    for r in lst:
        if r["p"]:
            s[r["p"]] = s.get(r["p"], 0) + 1
    return s


# --- 광역 지역구 ---
is_gwang = lambda t: pc.starts_city(t) and ("선거구" in t or re.search(r"제\d+", t))
gwang = pc.parse(GWANG, is_gwang)

# --- 기초 지역구 ---
gigo_tail = re.compile(r"[가나다라마바사아자차카타파하]선거?구?$")
is_gigo = lambda t: pc.contains_city(t) and gigo_tail.search(t) and not t.startswith("(")
gigo = pc.parse(GIGO, is_gigo)

# --- 기초 비례 (raw 한 줄) ---
raw = subprocess.run(["pdftotext", "-raw", "-enc", "UTF-8", BIRYE, "-"],
                     capture_output=True).stdout.decode("utf-8", "replace")
cities_re = "|".join(map(re.escape, pc.CITIES))
parties_re = "|".join(map(re.escape, pc.PARTY))
birye_line = re.compile(rf"^({cities_re})\s+({parties_re})\s+(\d+)\s+([가-힣]{{2,5}})$")
birye = []
for line in raw.split("\n"):
    m = birye_line.match(line.strip())
    if m:
        birye.append({"city": m.group(1), "p": pc.PARTY[m.group(2)],
                      "n": m.group(4), "rank": int(m.group(3))})

# --- 시군별 조립 ---
council = {}
for c in pc.CITIES:
    pv = [{"n": r["n"], "p": r["p"], "d": d_gwang(r["hdr"])}
          for r in gwang if r["city"] == c]
    bl = [{"n": r["n"], "p": r["p"], "d": d_gigo(r["hdr"])}
          for r in gigo if r["city"] == c]
    bl += [{"n": r["n"], "p": r["p"], "d": "비례"}
           for r in sorted([r for r in birye if r["city"] == c], key=lambda x: x["rank"])]
    if not pv and not bl:
        continue
    council[c] = {
        "src": "출처: 중앙선거관리위원회 제9회 지방선거 당선인 명부(경기도).",
        "prov": seats(pv), "basic": seats(bl),
        "provList": pv, "basicList": bl,
    }

# --- 검증 출력 ---
rep = []
for c in pc.CITIES:
    if c in council:
        d = council[c]
        miss = sum(1 for r in d["provList"] + d["basicList"] if not r["n"] or not r["p"])
        rep.append(f"{c}: 도{sum(d['prov'].values())}{d['prov']} 기초{sum(d['basic'].values())}{d['basic']}"
                   + (f"  ⚠미완 {miss}" if miss else ""))
rep.append(f"\ncouncil.js 작성 완료: {len(council)} 개 시군")
open("scraper/_report.txt", "w", encoding="utf-8").write("\n".join(rep))

out = "// 시·군 의회 구성(2026-06-03 제9회 지방선거 당선인). 선관위 공식 명부 자동 추출.\n"
out += "// p:정당코드(민/국/진/개/무/기본/사민/정의/녹정/노동)  d:선거구\n"
out += "window.GG_COUNCIL = " + json.dumps(council, ensure_ascii=False, indent=1) + ";\n"
open("council.js", "w", encoding="utf-8").write(out)

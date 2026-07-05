# -*- coding: utf-8 -*-
"""선관위 당선인 명부 PDF → 시군별 의원 명단 추출.
xpdf pdftotext -table 로 표를 정렬 추출한 뒤, 선거구 헤더로 레코드를
끊고, 각 레코드 안에서
  - 이름: 한자 괄호 '(漢字)'(CJK 포함) 토큰 바로 앞의 한글 이름
  - 정당: 알려진 정당명과 '정확히' 일치하는 셀 (경력 텍스트 오탐 방지)
를 뽑는다. pdftotext가 폰트 인코딩을 올바로 디코딩함(PyMuPDF는 깨짐).
"""
import subprocess, sys, re, json, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

CITIES = ["수원시","용인시","화성시","성남시","부천시","평택시","안산시","안양시","시흥시",
    "김포시","광주시","하남시","광명시","오산시","군포시","이천시","안성시","의왕시","양평군",
    "여주시","과천시","고양시","남양주시","파주시","의정부시","양주시","구리시","포천시",
    "동두천시","가평군","연천군"]
PARTY = {"더불어민주당":"민","국민의힘":"국","진보당":"진","개혁신당":"개","무소속":"무",
    "기본소득당":"기본","사회민주당":"사민","정의당":"정의","녹색정의당":"녹정","노동당":"노동"}

CJK = re.compile(r"[一-鿿]")
HANJA_TOK = re.compile(r"^\(.*[一-鿿].*\)$")
KNAME = re.compile(r"^[가-힣]{2,5}$")
SKIP = {"신규","재선","비례대표","더불어민주당","국민의힘","진보당","개혁신당","무소속","남","여"}


def tokens_of(pdf, first=None, last=None):
    cmd = ["pdftotext","-table","-enc","UTF-8"]
    if first: cmd += ["-f",str(first)]
    if last: cmd += ["-l",str(last)]
    cmd += [pdf,"-"]
    out = subprocess.run(cmd, capture_output=True).stdout.decode("utf-8","replace")
    toks = []
    for line in out.split("\n"):
        for t in re.split(r"\s{2,}", line.strip()):
            t = t.strip()
            if t:
                toks.append(t)
    return toks


def split_records(toks, is_header):
    """is_header(token)==True 인 토큰을 레코드 시작으로 본다."""
    idxs = [i for i,t in enumerate(toks) if is_header(t)]
    recs = []
    for k,start in enumerate(idxs):
        end = idxs[k+1] if k+1 < len(idxs) else len(toks)
        recs.append(toks[start:end])
    return recs


def city_of(header):
    for c in CITIES:
        if c in header:
            return c
    return None


NOTNAME = {"경기도"}


def extract_name(block):
    # 성명 열은 성별(남/여) 바로 왼쪽에 온다 → 성별 토큰 앞을 이름으로
    for j,t in enumerate(block):
        if t in ("남","여") and j >= 1:
            cand = block[j-1]
            if KNAME.match(cand) and cand not in SKIP and cand not in NOTNAME \
               and not starts_city(cand):
                return cand
    # 폴백: 헤더 다음 첫 한글 이름
    for cand in block[1:]:
        if KNAME.match(cand) and cand not in SKIP and cand not in NOTNAME \
           and not starts_city(cand):
            return cand
    return None


def extract_party(block):
    for t in block:
        if t in PARTY:
            return PARTY[t]
    # 단일 선거구 등에서 헤더에 정당이 붙는 경우: "과천시선거구 국민의힘"
    for t in block:
        w = t.split()
        if len(w) >= 2 and w[-1] in PARTY:
            return PARTY[w[-1]]
    return None


def starts_city(t):
    return any(t.startswith(c) for c in CITIES)


def contains_city(t):
    return any(c in t for c in CITIES)


def parse(pdf, is_header, pages=None):
    toks = tokens_of(pdf, *(pages or (None,None)))
    out = []
    for block in split_records(toks, is_header):
        out.append({"city": city_of(block[0]),
                    "n": extract_name(block),
                    "p": extract_party(block),
                    "hdr": block[0]})
    return out


if __name__ == "__main__":
    pdf = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else "gwang"
    if mode == "gwang":
        is_header = lambda t: starts_city(t) and ("선거구" in t or re.search(r"제\d+", t))
    else:
        gigo_tail = re.compile(r"[가나다라마바사아자차카타파하]선거?구?$")
        is_header = lambda t: contains_city(t) and gigo_tail.search(t) and not t.startswith("(")
    recs = parse(pdf, is_header)
    by = {}
    for r in recs:
        by.setdefault(r["city"], []).append(r)
    print("총 레코드:", len(recs))
    for c in CITIES:
        if c in by:
            seats = {}
            miss = 0
            for r in by[c]:
                if r["p"]: seats[r["p"]] = seats.get(r["p"],0)+1
                if not r["n"] or not r["p"]: miss += 1
            print(f"{c}: {len(by[c])}명 {seats}" + (f"  ⚠미완 {miss}" if miss else ""))
    if None in by:
        print("[미매칭시군]", len(by[None]), [r["hdr"] for r in by[None][:5]])
    dump = sys.argv[3] if len(sys.argv) > 3 else None
    if dump and dump in by:
        print(f"--- {dump} 명단 ---")
        for r in by[dump]:
            print(f"  {r['n']} ({r['p']})")

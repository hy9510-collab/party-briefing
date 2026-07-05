"""
매일 각 정당·기관 게시판에서 최신 게시물을 가져와
정당정책_오늘내용.md 를 갱신하는 스크립트.
GitHub Actions에서 무료로 실행됩니다.

- 더불어민주당 / 국민의힘: 서버 렌더링 게시판 → 실제 제목·링크 수집
- 조국혁신당(Next.js)/개혁신당/대통령실: JS 렌더링이라 목록 수집이 어려워
  날짜와 함께 공식 게시판 링크를 안내(지어내지 않음)
"""
import sys
import io
import re
import os
from datetime import datetime, timezone, timedelta

import requests
from bs4 import BeautifulSoup

# Windows 콘솔에서도 한글/이모지 출력이 깨지지 않도록
try:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
except Exception:
    pass

KST = timezone(timedelta(hours=9))
TODAY = datetime.now(KST)
TODAY_STR = TODAY.strftime("%Y-%m-%d")
TODAY_LABEL = f"{TODAY.month}월 {TODAY.day}일"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept-Language": "ko-KR,ko;q=0.9",
}


def fetch(url, timeout=12):
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout)
        r.encoding = r.apparent_encoding or "utf-8"
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"  [WARN] fetch 실패 {url}: {e}")
        return None


def clean(text):
    return re.sub(r"\s+", " ", text or "").strip()


def fallback(label, url):
    return [f"- ({TODAY_LABEL} {label} 최신 글은 게시판에서 확인하세요) (원문: {url})"]


# ── 실제 수집 가능한 게시판 ────────────────────────────────────────────────────

def get_minjoo():
    """더불어민주당 논평·브리핑 (서버 렌더링)"""
    base = "https://theminjoo.kr/main/sub/news/"
    list_url = base + "list.php?brd=11&cate=105"
    soup = fetch(list_url)
    items = []
    if soup:
        seen = set()
        for a in soup.find_all("a"):
            href = a.get("href", "")
            if "view.php" in href and "brd=11" in href:
                title = clean(a.get_text())
                if len(title) < 6:
                    continue
                full = href if href.startswith("http") else base + href.lstrip("./")
                key = title[:30]
                if key in seen:
                    continue
                seen.add(key)
                items.append(f"- {title} (원문: {full})")
            if len(items) >= 3:
                break
    return items or fallback("논평", list_url)


def get_ppp():
    """국민의힘 대변인 논평 (서버 렌더링, tbody 표)"""
    base = "https://www.peoplepowerparty.kr"
    list_url = base + "/news/comment/BBSDD0001"
    soup = fetch(list_url)
    items = []
    if soup:
        tb = soup.find("tbody")
        rows = tb.find_all("tr") if tb else []
        for tr in rows[:3]:
            a = None
            for cand in tr.find_all("a"):
                if "comment_view" in cand.get("href", ""):
                    a = cand
                    break
            if not a:
                continue
            title = clean(a.get_text())
            # 맨 앞 글번호 제거
            title = re.sub(r"^\d+\s*", "", title)
            href = a.get("href", "")
            full = href if href.startswith("http") else base + href
            if len(title) > 5:
                items.append(f"- {title} (원문: {full})")
    return items or fallback("논평", list_url)


# ── JS 렌더링이라 목록 수집이 어려운 곳: 날짜 + 게시판 링크 안내 ──────────────────

def get_president():
    url = "https://www.president.go.kr/briefings"
    return [f"- ({TODAY_LABEL} 브리핑은 대통령실 게시판에서 확인하세요) (원문: {url})"]


def get_policy():
    url = "https://www.korea.kr/news/policyNewsList.do"
    return [f"- ({TODAY_LABEL} 정책 자료는 정책브리핑에서 확인하세요) (원문: {url})"]


def get_government():
    return [
        "- [국무조정실] 국무조정실·국무총리비서실 소식(보도자료) (원문: https://www.opm.go.kr/opm/news/press-release.do)",
        "- [정책브리핑] 대한민국 정책브리핑 (원문: https://www.korea.kr/)",
    ]


def get_assembly():
    news = "https://www.naon.go.kr/"
    bill = "https://likms.assembly.go.kr/bill/main.do"
    return [
        f"- ({TODAY_LABEL} 의사일정·안건은 국회뉴스ON에서 확인하세요) (원문: {news})",
        f"- 의안정보시스템 계류 법안 (원문: {bill})",
    ]


def get_jokuk():
    url = "https://rebuildingkoreaparty.kr/news/press-release"
    return fallback("보도자료", url)


def get_reform():
    url = "https://www.reformparty.kr/briefing"
    return fallback("논평·브리핑", url)


# ── md 생성 ───────────────────────────────────────────────────────────────────

def build_md():
    print(f"[{TODAY_STR}] 게시판 수집 시작...")
    sections = [
        ("국회", get_assembly()),
        ("대통령실", get_president()),
        ("정부 (내각)", get_government()),
        ("더불어민주당", get_minjoo()),
        ("조국혁신당", get_jokuk()),
        ("국민의힘", get_ppp()),
        ("개혁신당", get_reform()),
    ]
    body = "\n\n".join(f"## {name}\n" + "\n".join(items) for name, items in sections)

    # 메인 '주요 이슈': 기관별 첫 항목을 태그와 함께(원문 링크 유지) 뽑아온다
    secmap = dict(sections)

    def first(name):
        items = secmap.get(name) or []
        return items[0][2:] if items else None  # 앞의 "- " 제거

    issue_lines = []
    pres = first("대통령실")
    if pres:
        issue_lines.append(f"- [대통령실] {pres}")
    issue_lines.append(f"- [정책브리핑] {get_policy()[0][2:]}")
    asm = first("국회")
    if asm:
        issue_lines.append(f"- [국회] {asm}")
    minj = first("더불어민주당")
    if minj:
        issue_lines.append(f"- [정당] (민주당) {minj}")
    ppp = first("국민의힘")
    if ppp:
        issue_lines.append(f"- [정당] (국민의힘) {ppp}")
    issue_block = "\n".join(issue_lines)

    md = f"""# 오늘의 정당정책·대통령실 브리핑 ({TODAY_STR} 기준)

> 형식: "## 구분" 아래 "- 자료 (원문: 링크)" / 일정은 "- [일정] 내용"
> 매일 자동으로 각 공식 게시판에서 수집합니다. 서버 렌더링 게시판(민주당·국민의힘)은 실제 최신 제목을, JS 게시판은 게시판 링크를 안내합니다.

## 오늘의 이슈
{issue_block}

{body}
"""
    return md.strip()


if __name__ == "__main__":
    md_path = os.path.normpath(
        os.path.join(os.path.dirname(__file__), "..", "정당정책_오늘내용.md")
    )
    content = build_md()
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(content + "\n")
    print(f"[OK] 갱신 완료 -> {md_path}")

"""
매일 각 정당·기관 게시판에서 최신 게시물을 가져와
정당정책_오늘내용.md 를 갱신하는 스크립트.
GitHub Actions에서 무료로 실행됩니다.

- 서버 렌더링 게시판(민주당·국민의힘·개혁신당·국회·경기도청 등): HTML에서 실제 제목·링크 수집
- 대통령실·조국혁신당: JS 렌더링이지만 공개 JSON API가 있어 실제 제목·링크 수집(각 함수 참고)
- 수집 실패 시에만 날짜와 함께 공식 게시판 링크를 안내(지어내지 않음)
"""
import sys
import io
import re
import os
from datetime import datetime, timezone, timedelta

import requests
import urllib3
from bs4 import BeautifulSoup

# 일부 공식 사이트(예: theminjoo.kr)는 인증서 체인이 불완전해 검증이 실패한다.
# 공개 게시판을 '읽기만' 하고 자격정보를 보내지 않으므로 검증을 끄고 경고만 숨긴다.
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

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
        r = requests.get(url, headers=HEADERS, timeout=timeout, verify=False)
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
    """대통령실 브리핑 (JS 목록이지만 게시판 AJAX가 JSON을 반환 → 실제 제목 수집)"""
    url = "https://www.president.go.kr/briefings"
    api = "https://www.president.go.kr/ajaxf/frBoard/bbsViewGalleryList.do"
    payload = {
        "pageNo": "1", "pagePerCnt": "10",
        "MENU_CD": "nFSy219D", "CONTENTS_CD": "vqNUjDNc",
        "pSiteNo": "2", "pBoardSeq": "2",
        "BBS_CD": "", "SHORT_URL": "briefings", "sSearchGbn": "", "sSearchTxt": "",
    }
    try:
        r = requests.post(api, data=payload, timeout=12, verify=False,
                          headers={**HEADERS, "X-Requested-With": "XMLHttpRequest", "Referer": url})
        rows = (r.json().get("data") or {}).get("list") or []
        items = []
        for row in rows:
            title, bbs = clean(row.get("SUBJECT")), row.get("BBS_CD")
            if len(title) < 6 or not bbs:
                continue
            items.append(f"- {title} (원문: {url}/{bbs})")
            if len(items) >= 2:
                break
        if items:
            return items
    except Exception as e:
        print(f"  [WARN] 대통령실 수집 실패: {e}")
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
    """국회뉴스ON 최신 기사 (서버 렌더링, span.main_title)"""
    news = "https://www.naon.go.kr/"
    bill = "https://likms.assembly.go.kr/bill/main.do"
    soup = fetch(news)
    items = []
    if soup:
        seen = set()
        for a in soup.find_all("a"):
            href = a.get("href", "")
            if "storyId" not in href:
                continue
            sp = a.find("span", class_=re.compile("main_title"))
            title = clean(sp.get_text()) if sp else ""
            if len(title) < 8 or title in seen:
                continue
            seen.add(title)
            full = href if href.startswith("http") else "https://www.naon.go.kr" + href
            items.append(f"- {title} (원문: {full})")
            if len(items) >= 2:
                break
    return items or [
        f"- ({TODAY_LABEL} 의사일정·안건은 국회뉴스ON에서 확인하세요) (원문: {news})",
        f"- 의안정보시스템 계류 법안 (원문: {bill})",
    ]


def get_jokuk():
    """조국혁신당 보도자료 (Next.js. 공개 API가 JSON 목록을 반환 → 실제 제목 수집)"""
    url = "https://rebuildingkoreaparty.kr/news/press-release"
    api = "https://api.rebuildingkoreaparty.kr/api/board/list"
    body = {"page": 1, "categoryId": 9, "recordSize": 10, "pageSize": 5, "order": "recent"}
    try:
        r = requests.post(api, json=body, timeout=12, verify=False,
                          headers={**HEADERS, "Origin": "https://rebuildingkoreaparty.kr", "Referer": url})
        rows = r.json().get("list") or []
        # 목록에 고정글이 섞여 있어 실제 최신순으로 다시 정렬
        rows.sort(key=lambda x: x.get("createdAt") or "", reverse=True)
        items = []
        for row in rows:
            title, bid = clean(row.get("title")), row.get("id")
            if len(title) < 6 or not bid:
                continue
            items.append(f"- {title} (원문: {url}/{bid})")
            if len(items) >= 2:
                break
        if items:
            return items
    except Exception as e:
        print(f"  [WARN] 조국혁신당 수집 실패: {e}")
    return fallback("보도자료", url)


def get_ggc_council():
    """경기도의회 의원 보도자료 (서버 렌더링 표)"""
    base = "https://www.ggc.go.kr"
    list_url = base + "/site/main/xb/lwmkr/lawmakerpressrelease"
    soup = fetch(list_url)
    items = []
    if soup:
        for tr in soup.find_all("tr"):
            a = tr.find("a")
            if not a or "lawmakerpressrelease/" not in a.get("href", ""):
                continue
            title = re.sub(r"\s*새글$", "", clean(a.get_text()))
            if len(title) < 6:
                continue
            href = a.get("href", "")
            full = href if href.startswith("http") else base + href
            items.append(f"- {title} (원문: {full})")
            if len(items) >= 2:
                break
    return items or fallback("의원 보도자료", list_url)


def get_gg_province():
    """경기도청 공보 브리핑 (서버 렌더링 표, URL의 세션ID 제거)"""
    base = "https://gnews.gg.go.kr"
    list_url = base + "/briefing/brief_gongbo.do"
    soup = fetch(list_url)
    items = []
    if soup:
        for tr in soup.find_all("tr"):
            a = tr.find("a")
            if not a or "brief_gongbo_view" not in a.get("href", ""):
                continue
            title = clean(a.get_text())
            if len(title) < 6:
                continue
            href = re.sub(r";jsessionid=[^?]*", "", a.get("href", ""))
            full = href if href.startswith("http") else base + href
            items.append(f"- {title} (원문: {full})")
            if len(items) >= 2:
                break
    return items or fallback("보도자료", list_url)


def get_goe():
    """경기도교육청 보도자료 (제목은 서버 렌더링, 개별 글 링크는 JS라 게시판으로 연결)"""
    list_url = "https://www.goe.go.kr/goe/na/ntt/selectNttList.do?mi=10102&bbsId=1922"
    soup = fetch(list_url)
    items = []
    if soup:
        seen = set()
        for a in soup.find_all("a"):
            t = clean(a.get_text())
            if "등록일" not in t:
                continue
            title = re.sub(r"\s*등록일.*$", "", t).strip()
            if len(title) < 6 or title in seen:
                continue
            seen.add(title)
            items.append(f"- {title} (원문: {list_url})")
            if len(items) >= 2:
                break
    return items or fallback("보도자료", list_url)


def get_reform():
    """개혁신당 논평·브리핑 (서버 렌더링, /news/briefing, div.ni-title)"""
    base = "https://www.reformparty.kr"
    list_url = base + "/news/briefing"
    soup = fetch(list_url)
    items = []
    if soup:
        seen = set()
        for a in soup.find_all("a", href=re.compile(r"/news/briefing/\d+")):
            tit = a.find("div", class_="ni-title")
            title = clean(tit.get_text()) if tit else ""
            if len(title) < 6:
                continue
            href = a.get("href", "")
            full = href if href.startswith("http") else base + href
            key = title[:30]
            if key in seen:
                continue
            seen.add(key)
            items.append(f"- {title} (원문: {full})")
            if len(items) >= 2:
                break
    return items or fallback("논평·브리핑", list_url)


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
        ("경기도의회", get_ggc_council()),
        ("경기도청", get_gg_province()),
        ("경기도교육청", get_goe()),
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
> 매일 자동으로 각 공식 게시판에서 수집합니다. 서버 렌더링·공개 API 게시판은 실제 최신 제목을, 수집이 안 되는 곳은 게시판 링크만 안내합니다(지어내지 않음).

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

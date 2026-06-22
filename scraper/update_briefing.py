"""
매일 각 정당·기관 게시판에서 최신 게시물을 가져와
정당정책_오늘내용.md 를 갱신하는 스크립트.
GitHub Actions에서 무료로 실행됩니다.
"""
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone, timedelta
import re
import os
import sys

KST = timezone(timedelta(hours=9))
TODAY = datetime.now(KST)
TODAY_STR = TODAY.strftime("%Y-%m-%d")
TODAY_LABEL = TODAY.strftime("%-m월 %-d일") if sys.platform != "win32" else TODAY.strftime("%m월 %d일").lstrip("0")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
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


# ── 각 게시판 스크래퍼 ────────────────────────────────────────────────────────

def get_president():
    """대통령실 브리핑"""
    url = "https://www.president.go.kr/briefings"
    soup = fetch(url)
    items = []
    if soup:
        # 대통령실 브리핑 목록 (렌더링 방식에 따라 fallback)
        for el in (soup.select(".brf-list li") or soup.select(".news-list li") or soup.select("li.list-item"))[:3]:
            t = clean(el.get_text())
            if t:
                items.append(f"- {t} (원문: {url})")
    if not items:
        items.append(f"- ({TODAY_LABEL} 브리핑 게시판에서 확인하세요) (원문: {url})")
    return items


def get_policy():
    """대한민국 정책브리핑 최신 뉴스"""
    url = "https://www.korea.kr/news/policyNewsView.do"
    list_url = "https://www.korea.kr/news/allNewsView.do"
    soup = fetch(list_url)
    items = []
    if soup:
        for el in (soup.select(".news-list-area li") or soup.select(".board-list li") or soup.select("ul.news li"))[:3]:
            a = el.select_one("a")
            if a:
                title = clean(a.get_text())
                href = a.get("href", "")
                if href and not href.startswith("http"):
                    href = "https://www.korea.kr" + href
                if title:
                    items.append(f"- {title} (원문: {href or list_url})")
    if not items:
        items.append(f"- ({TODAY_LABEL} 정책브리핑 게시판에서 확인하세요) (원문: {list_url})")
    return items


def get_assembly():
    """국회 — 의안정보시스템 + 국회뉴스ON"""
    news_url = "https://www.naon.go.kr/"
    bill_url = "https://likms.assembly.go.kr/bill/main.do"
    items = []
    soup = fetch(news_url)
    if soup:
        for el in (soup.select(".news-list li") or soup.select(".board-list li") or soup.select("ul li"))[:2]:
            t = clean(el.get_text())
            if t and len(t) > 5:
                items.append(f"- {t} (원문: {news_url})")
    if not items:
        items.append(f"- ({TODAY_LABEL} 국회 일정·안건은 아래 링크에서 확인하세요) (원문: {news_url})")
        items.append(f"- 의안정보시스템 계류 법안 (원문: {bill_url})")
    return items


def get_minjoo():
    """더불어민주당 논평·브리핑"""
    url = "https://theminjoo.kr/main/sub/news/list.php?brd=11&cate=105"
    soup = fetch(url)
    items = []
    if soup:
        for el in (
            soup.select("ul.board_list li") or
            soup.select(".bbs_list tr") or
            soup.select("table tr")
        )[1:4]:
            a = el.select_one("a")
            date_el = el.select_one(".date") or el.select_one("td.date") or el.select_one("span.date")
            if a:
                title = clean(a.get_text())
                href = a.get("href", "")
                if href and not href.startswith("http"):
                    href = "https://theminjoo.kr" + href
                date = clean(date_el.get_text()) if date_el else ""
                date_tag = f" [{date}]" if date else ""
                if title and len(title) > 3:
                    items.append(f"- ({date_tag}) {title} (원문: {url})")
    if not items:
        items.append(f"- ({TODAY_LABEL} 최신 논평은 게시판에서 확인하세요) (원문: {url})")
    return items[:3]


def get_jokuk():
    """조국혁신당 보도자료"""
    url = "https://rebuildingkoreaparty.kr/news/press-release"
    soup = fetch(url)
    items = []
    if soup:
        for el in (
            soup.select("ul.press-list li") or
            soup.select(".board-list li") or
            soup.select("article") or
            soup.select(".post-item")
        )[:3]:
            a = el.select_one("a")
            if a:
                title = clean(a.get_text())
                href = a.get("href", "")
                if href and not href.startswith("http"):
                    href = "https://rebuildingkoreaparty.kr" + href
                if title and len(title) > 3:
                    items.append(f"- {title} (원문: {href or url})")
    if not items:
        items.append(f"- ({TODAY_LABEL} 최신 보도자료는 게시판에서 확인하세요) (원문: {url})")
    return items[:3]


def get_ppp():
    """국민의힘 대변인 논평"""
    url = "https://www.peoplepowerparty.kr/news/comment/BBSDD0001"
    soup = fetch(url)
    items = []
    if soup:
        for el in (
            soup.select(".board-list tr") or
            soup.select(".list-item") or
            soup.select("ul.comment-list li")
        )[1:4]:
            a = el.select_one("a")
            if a:
                title = clean(a.get_text())
                href = a.get("href", "")
                if href and not href.startswith("http"):
                    href = "https://www.peoplepowerparty.kr" + href
                if title and len(title) > 3:
                    items.append(f"- {title} (원문: {href or url})")
    if not items:
        items.append(f"- ({TODAY_LABEL} 최신 논평은 게시판에서 확인하세요) (원문: {url})")
    return items[:3]


def get_reform():
    """개혁신당 공지사항"""
    url = "https://www.reformparty.kr/notice"
    soup = fetch(url)
    items = []
    if soup:
        for el in (
            soup.select(".board-list li") or
            soup.select("ul.notice li") or
            soup.select("table tr")
        )[1:4]:
            a = el.select_one("a")
            if a:
                title = clean(a.get_text())
                href = a.get("href", "")
                if href and not href.startswith("http"):
                    href = "https://www.reformparty.kr" + href
                if title and len(title) > 3:
                    items.append(f"- {title} (원문: {href or url})")
    if not items:
        items.append(f"- ({TODAY_LABEL} 최신 공지는 게시판에서 확인하세요) (원문: {url})")
    return items[:3]


# ── md 생성 ───────────────────────────────────────────────────────────────────

def build_md():
    print(f"[{TODAY_STR}] 게시판 수집 시작...")

    print("  대통령실...")
    president = get_president()
    print("  정책브리핑...")
    policy = get_policy()
    print("  국회...")
    assembly = get_assembly()
    print("  더불어민주당...")
    minjoo = get_minjoo()
    print("  조국혁신당...")
    jokuk = get_jokuk()
    print("  국민의힘...")
    ppp = get_ppp()
    print("  개혁신당...")
    reform = get_reform()

    def lines(items):
        return "\n".join(items) if items else "- (자료 없음)"

    md = f"""# 오늘의 정당정책·대통령실 브리핑 ({TODAY_STR} 기준)

> 형식: "## 구분" 아래 "- 자료 (원문: 링크)" / 일정은 "- [일정] 내용"
> 각 공식 게시판에서 자동으로 가져온 자료입니다. 오늘 신규 게시물이 확인되지 않은 게시판은 가장 최근 자료를 표시합니다.

## 오늘의 이슈
- [{TODAY_STR}] 각 기관·정당 최신 자료 자동 수집 완료 — 아래 섹션을 확인하세요.

## 국회
{lines(assembly)}

## 대통령실
{lines(president)}

## 더불어민주당
{lines(minjoo)}

## 조국혁신당
{lines(jokuk)}

## 국민의힘
{lines(ppp)}

## 개혁신당
{lines(reform)}
"""
    return md.strip()


if __name__ == "__main__":
    md_path = os.path.join(os.path.dirname(__file__), "..", "정당정책_오늘내용.md")
    md_path = os.path.normpath(md_path)
    content = build_md()
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(content + "\n")
    print(f"✅ 갱신 완료 → {md_path}")

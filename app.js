// 화면 동작: 메인(정당 카드) ↔ 상세(지도부+오늘 자료+게시판). 해시 라우팅.
const view = document.getElementById("view");
const foot = document.getElementById("foot");
document.getElementById("date").textContent =
  new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

let DAILY = {}; // { 정당명: [항목, ...] }

function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function linkify(s) {
  return esc(s).replace(/(https?:\/\/[^\s]+)/g, '<a class="inline" href="$1">$1</a>');
}
// 개조식(아웃라인) 한 항목: 앞머리 "(날짜/유형)" 태그를 칩으로 빼고, 원문 링크는 "원문 ›" 로 분리
function parseMat(raw) {
  let t = raw, link = "";
  const m = t.match(/\(?\s*원문:\s*(https?:\/\/[^\s)]+)\)?/);
  if (m) { link = m[1]; t = t.replace(m[0], ""); }
  else {
    const u = t.match(/(https?:\/\/[^\s)]+)\)?\s*$/);
    if (u) { link = u[1]; t = t.replace(u[0], ""); }
  }
  t = t.replace(/[\s·.]+$/, "").trim();
  let tag = "";
  const tm = t.match(/^\(([^)]+)\)\s*/);
  if (tm) { tag = tm[1]; t = t.slice(tm[0].length).trim(); }
  return { tag, text: t, link };
}
function outlineItem(raw) {
  const { tag, text, link } = parseMat(raw);
  const tagHtml = tag ? `<span class="bp-tag">${esc(tag)}</span> ` : "";
  const linkHtml = link ? ` <a class="bp-src" href="${esc(link)}">바로가기 ›</a>` : "";
  return `<li class="bp-item">${tagHtml}${esc(text)}${linkHtml}</li>`;
}

// 오늘내용.md 를 정당별 항목으로 파싱 (## 정당명 아래의 "- " 줄)
function parseDaily(md) {
  const out = {}; let cur = null;
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("## ")) { cur = line.slice(3).trim(); out[cur] = []; }
    else if (line.startsWith("- ") && cur) out[cur].push(line.slice(2).trim());
  }
  return out;
}

// 항목을 [일정] 과 자료로 분리
function splitItems(items) {
  const sched = [], mats = [];
  for (const it of (items || [])) {
    if (it.startsWith("[일정]")) sched.push(it.replace(/^\[일정\]\s*/, ""));
    else mats.push(it.replace(/^\[자료\]\s*/, ""));
  }
  return { sched, mats };
}
async function loadDaily() {
  try {
    const res = await fetch("정당정책_오늘내용.md?_=" + Date.now(), { cache: "no-store" });
    if (res.ok) DAILY = parseDaily(await res.text());
  } catch { DAILY = {}; }
}

// ── 메인 화면: 히어로 + 메뉴 타일 ──
function renderHome() {
  const hero = `
    <section class="hero">
      <h2>대한민국 정치, 한 곳에서 봅니다</h2>
      <p>대통령실·정부·국회·정당의 공식 자료와 매일의 브리핑, 그리고 경기도 31개 시·군과 교육지원청 현황까지 — 흩어져 있는 공식 정보를 한 페이지에 모았습니다. 아래에서 보고 싶은 곳을 골라 들어가세요.</p>
    </section>`;

  const tiles = `
    <div class="nav-tiles">
      <a class="nav-tile" style="--c:#2e3b52" onclick="location.hash='#org'">
        <div class="nt-ico">🏛️</div>
        <div class="nt-t">중앙 조직</div>
        <div class="nt-s">대통령실·정부(내각)·국회·정당의 조직과 지도부</div>
      </a>
      <a class="nav-tile" style="--c:#a06a00" onclick="location.hash='#briefings'">
        <div class="nt-ico">📰</div>
        <div class="nt-t">기관별 소식</div>
        <div class="nt-s">각 기관·정당 게시판의 최신 소식을 한눈에</div>
      </a>
      <a class="nav-tile" style="--c:${GYEONGGI.color}" onclick="location.hash='#gyeonggi-org'">
        <div class="nt-ico">🗺️</div>
        <div class="nt-t">경기도 조직</div>
        <div class="nt-s">경기도의회 · 경기도 31개 시·군 · 경기도교육청</div>
      </a>
    </div>`;

  view.innerHTML = hero + tiles;
  foot.innerHTML = "각 메뉴를 누르면 자세한 정보와 그날의 자료가 나옵니다. · 지도부 정보 기준일 2026-06-19";
}

// ── 상세 화면: 한 정당 ──
function renderDetail(p) {
  const { sched, mats } = splitItems(DAILY[p.name]);
  const dailyHtml = mats.length
    ? `<ul class="bp-list">${mats.map(outlineItem).join("")}</ul>`
    : '<p class="empty">등록된 자료가 없습니다.</p>';
  const schedHtml = sched.length
    ? "<ul>" + sched.map(t => `<li class="item">📅 ${linkify(t)}</li>`).join("") + "</ul>"
    : '<p class="empty">등록된 일정이 없습니다.</p>';

  const leadHtml = p.leader ? `
      <div class="sec-title">지도부</div>
      <table class="lead-table">
        <tr><th>당대표</th><td>${esc(p.leader)}</td></tr>
        <tr><th>원내대표</th><td>${esc(p.floorLeader)}</td></tr>
        <tr><th>최고위원</th><td>${esc(p.supremes)}<span class="tag">${esc(p.supremesNote)}</span></td></tr>
      </table>` : "";

  view.innerHTML = `
    <div class="detail" style="--c:${p.color}">
      <button class="back" onclick="location.hash=''">← 전체 보기</button>
      <h2 style="color:${p.color};border-color:${p.color}">${p.home ? `<a class="title-home" href="${p.home}" style="color:${p.color}">${p.name}</a>` : p.name}</h2>
      ${leadHtml}
      <div class="sec-title">최신 자료 요약</div>
      ${dailyHtml}

      <div class="sec-title">주요 일정</div>
      ${schedHtml}
      <button class="reload" onclick="refresh()">새로고침</button>

      <div class="sec-title">소식 게시판 바로가기</div>
      <div class="boards">
        ${p.boards.map(b => `<a href="${b.url}">${esc(b.label)}</a>`).join("")}
      </div>
    </div>`;
  foot.innerHTML = "‘최신 자료 요약’은 정당정책_오늘내용.md 내용입니다. · 게시판 링크는 각 당 공식 사이트로 연결됩니다.";
}

// ── 상세 화면: 정부(내각) ──
function renderGovernment(g) {
  const locKey = loc => loc.startsWith("세종") ? "세종" : loc.startsWith("서울") ? "서울" : loc.startsWith("과천") ? "과천" : "기타";
  const groupDefs = [
    { key: "서울", label: "🔵 서울" },
    { key: "과천", label: "🟤 과천" },
    { key: "세종", label: "🟢 세종" },
    { key: "기타", label: "⚪ 그 외" }
  ];
  const homeOf = url => { try { return new URL(url).origin + "/"; } catch { return url; } };
  const itemHtml = m => `
    <div class="gov-item">
      <div class="dept"><a class="dept-home" href="${homeOf(m.url)}">${esc(m.dept)}</a><span class="loc-tag loc-${locKey(m.loc)}">${esc(m.loc)}</span></div>
      <div class="minister">장관 · ${esc(m.name)}${m.since ? ` <span class="since">취임 ${esc(m.since)}</span>` : ""}</div>
      ${m.prev ? `<div class="prev">${esc(m.prev)}</div>` : ""}
      <div class="vice">차관 · ${esc(m.vice || "확인 필요")}</div>
      <a class="dept-link" href="${m.url}">소식·보도자료 →</a>
    </div>`;
  const pmoHtml = (g.pmOffices || []).map(o => `
    <div class="gov-item">
      <div class="dept"><a class="dept-home" href="${homeOf(o.url)}">${esc(o.dept)}</a><span class="loc-tag loc-${locKey(o.loc)}">${esc(o.loc)}</span></div>
      <div class="prev">${esc(o.role)}</div>
      <a class="dept-link" href="${o.url}">바로가기 →</a>
    </div>`).join("");
  const govGroups = groupDefs.map(gd => {
    const list = g.ministers.filter(m => locKey(m.loc) === gd.key);
    if (!list.length) return "";
    return `
      <div class="gov-group-title gt-${gd.key}">${gd.label} <span class="gt-count">${list.length}곳</span></div>
      <div class="gov-list">${list.map(itemHtml).join("")}</div>`;
  }).join("");
  const { sched, mats } = splitItems(DAILY[g.name]);
  const dailyHtml = mats.length
    ? `<ul class="bp-list">${mats.map(outlineItem).join("")}</ul>`
    : '<p class="empty">등록된 자료가 없습니다.</p>';
  const schedHtml = sched.length
    ? "<ul>" + sched.map(t => `<li class="item">📅 ${linkify(t)}</li>`).join("") + "</ul>"
    : '<p class="empty">등록된 일정이 없습니다.</p>';

  view.innerHTML = `
    <div class="detail" style="--c:${g.color}">
      <button class="back" onclick="location.hash=''">← 전체 보기</button>
      <h2 style="color:${g.color};border-color:${g.color}">${g.name}</h2>
      <div class="sec-title">국무총리</div>
      <table class="lead-table">
        <tr><th>국무총리</th><td>${esc(g.pm)}<span class="tag">${esc(g.pmLoc)}</span>${g.pmPrev ? `<div class="prev">${esc(g.pmPrev)}</div>` : ""}</td></tr>
      </table>
      <div class="sec-title">바로가기</div>
      <div class="boards">
        ${g.boards.map(b => `<a href="${b.url}">${esc(b.label)}</a>`).join("")}
      </div>
      <div class="sec-title">국무총리 직속 기구</div>
      <div class="gov-list">${pmoHtml}</div>
      <div class="sec-title">정부부처 장관 · 소재지 · 소식</div>
      ${govGroups}
      <p class="note">${esc(g.note)}</p>
      <div class="sec-title">최신 자료 요약</div>
      ${dailyHtml}
      <div class="sec-title">주요 일정</div>
      ${schedHtml}
      <button class="reload" onclick="refresh()">새로고침</button>
    </div>`;
  foot.innerHTML = "장관 명단·소재지는 이재명 정부 기준이며 개각 진행 중이라 일부 바뀔 수 있습니다.";
}

// ── 상세 화면: 국회 (회의 일정 + 이슈 안건) ──
function renderAssembly(a) {
  const { sched, mats } = splitItems(DAILY[a.name]);
  const schedHtml = sched.length
    ? "<ul>" + sched.map(t => `<li class="item">📅 ${linkify(t)}</li>`).join("") + "</ul>"
    : '<p class="empty">등록된 회의 일정이 없습니다.</p>';
  const billHtml = mats.length
    ? "<ul>" + mats.map(t => `<li class="item">📌 ${linkify(t)}</li>`).join("") + "</ul>"
    : '<p class="empty">등록된 안건이 없습니다.</p>';

  view.innerHTML = `
    <div class="detail" style="--c:${a.color}">
      <button class="back" onclick="location.hash=''">← 전체 보기</button>
      <h2 style="color:${a.color};border-color:${a.color}">${a.home ? `<a class="title-home" href="${a.home}" style="color:${a.color}">${a.name}</a>` : a.name}</h2>
      <div class="sec-title">회의 일정</div>
      ${schedHtml}
      <div class="sec-title">이슈가 되고 있는 안건</div>
      ${billHtml}
      <button class="reload" onclick="refresh()">새로고침</button>
      <div class="sec-title">바로가기</div>
      <div class="boards">
        ${a.boards.map(b => `<a href="${b.url}">${esc(b.label)}</a>`).join("")}
      </div>
    </div>`;
  foot.innerHTML = "회의 일정·안건은 국회 의사일정/의안정보시스템 기준입니다. 정확한 내용은 게시판 링크에서 확인하세요.";
}

// 모아보기용 공통: 한 기관의 자료/일정 블록
function entitySection(e, opts = {}) {
  const { sched, mats } = splitItems(DAILY[e.name]);
  if (opts.matsOnly && !mats.length) return "";
  const title = e.home
    ? `<a class="title-home" href="${e.home}" style="color:${e.color}">${e.name}</a>`
    : e.name;
  const matsHtml = mats.length
    ? (opts.outline
        ? `<ul class="bp-list">${mats.map(outlineItem).join("")}</ul>`
        : "<ul>" + mats.map(t => `<li class="item">${linkify(t)}</li>`).join("") + "</ul>")
    : '<p class="empty">등록된 자료가 없습니다.</p>';
  const schedHtml = (!opts.matsOnly && sched.length)
    ? "<ul>" + sched.map(t => `<li class="item">📅 ${linkify(t)}</li>`).join("") + "</ul>"
    : "";
  const more = opts.matsOnly ? "" : `<span class="all-more" onclick="location.hash='#${e.id}'">자세히 →</span>`;
  return `<div class="all-sec" style="border-left:4px solid ${e.color}">
      <h3 style="color:${e.color}">${title} ${more}</h3>
      ${matsHtml}${schedHtml}</div>`;
}

// ── 전체 조직 한눈에 (인포그래픽) ──
function locClass(loc) {
  if (loc.includes("세종")) return "세종";
  if (loc.includes("서울")) return "서울";
  if (loc.includes("과천")) return "과천";
  return "기타";
}
function igPanel(name, home, color, leaderHtml, bodyHtml) {
  const head = home
    ? `<a class="ig-home" href="${home}" target="_blank" rel="noopener">${esc(name)} <span class="ig-ext">↗</span></a>`
    : esc(name);
  return `<div class="ig-panel" style="--c:${color}">
      <div class="ig-panel-head">${head}</div>
      ${leaderHtml ? `<div class="ig-leader">${leaderHtml}</div>` : ""}
      ${bodyHtml || ""}
    </div>`;
}
function renderOrg() {
  // 1) 대통령
  const cmteCard = c => `<div class="ig-card" style="--c:${PRESIDENT.color}">
      <div class="ig-card-t">${c.url
        ? `<a class="ig-home" href="${c.url}" target="_blank" rel="noopener">${esc(c.name)} <span class="ig-ext">↗</span></a>`
        : esc(c.name)}</div>
      <div class="ig-card-s">${esc(c.head)}</div>
      ${c.url ? `<a class="ig-news" href="${c.url}" target="_blank" rel="noopener">소식·브리핑 →</a>` : ""}
    </div>`;
  const advCards = (PRESIDENT.advisoryCouncils || []).map(cmteCard).join("");
  const comCardsP = (PRESIDENT.committees || []).map(cmteCard).join("");
  const presBody = `${PRESIDENT.chief
    ? `<div class="ig-sub">비서실장 · ${esc(PRESIDENT.chief)}</div>
       ${PRESIDENT.chiefPrev ? `<div class="ig-note">${esc(PRESIDENT.chiefPrev)}</div>` : ""}`
    : ""}${(advCards || comCardsP)
    ? `<div class="ig-label">직속 자문회의</div>
       <div class="ig-grid ig-grid-2">${advCards}</div>
       <div class="ig-label">직속 위원회</div>
       <div class="ig-grid ig-grid-2">${comCardsP}</div>
       ${PRESIDENT.committeesNote ? `<div class="ig-note">${esc(PRESIDENT.committeesNote)}</div>` : ""}`
    : ""}`;
  const presNode = igPanel(PRESIDENT.name, PRESIDENT.home, PRESIDENT.color,
    `👤 ${esc(PRESIDENT.head)}`, presBody);

  // 2) 정부(내각) — 지역별(서울/과천/세종/그 외)로 묶기
  const homeOf = url => { try { return new URL(url).origin + "/"; } catch { return url; } };
  const minCard = m => {
    const lc = locClass(m.loc);
    return `<div class="ig-card" style="--c:${GOVERNMENT.color}">
      <div class="ig-card-t"><a class="ig-home" href="${homeOf(m.url)}" target="_blank" rel="noopener">${esc(m.dept)} <span class="ig-ext">↗</span></a><span class="loc-tag loc-${lc}">${esc(m.loc)}</span></div>
      <div class="ig-card-s">장관 · ${esc(m.name)}</div>
      ${m.prev ? `<div class="ig-card-v">${esc(m.prev)}</div>` : ""}
      ${m.vice ? `<div class="ig-card-v">차관 · ${esc(m.vice)}</div>` : ""}
    </div>`;
  };
  const govRegionDefs = [
    { key: "서울", label: "🔵 서울" },
    { key: "과천", label: "🟤 과천" },
    { key: "세종", label: "🟢 세종" },
    { key: "기타", label: "⚪ 그 외" }
  ];
  const minGroups = govRegionDefs.map(rd => {
    const list = GOVERNMENT.ministers.filter(m => locClass(m.loc) === rd.key);
    if (!list.length) return "";
    return `<div class="ig-label">${rd.label} <span class="gt-count">${list.length}곳</span></div>
       <div class="ig-grid">${list.map(minCard).join("")}</div>`;
  }).join("");
  const govNode = igPanel(GOVERNMENT.name, "https://www.opm.go.kr/", GOVERNMENT.color,
    `👤 국무총리 · ${esc(GOVERNMENT.pm)} <span class="loc-tag loc-세종">${esc(GOVERNMENT.pmLoc)}</span>`,
    `<div class="ig-label">정부 부처 (${GOVERNMENT.ministers.length}) · 지역별</div>
     ${minGroups}`);

  // 3) 국회
  const blocCards = ASSEMBLY.negoBlocs.map(b => {
    const party = PARTIES.find(p => p.name === b.party);
    const home = b.url || (party && party.home);
    const title = home
      ? `<a class="ig-home" href="${home}" target="_blank" rel="noopener" style="color:${ASSEMBLY.color}">${esc(b.party)} <span class="ig-ext">↗</span></a>`
      : esc(b.party);
    return `
    <div class="ig-card" style="--c:${ASSEMBLY.color}">
      <div class="ig-card-t">${title}</div>
      <div class="ig-card-s">원내대표 · ${esc(b.rep)}</div>
      <div class="ig-card-v">수석부대표 · ${esc(b.deputy)}</div>
    </div>`; }).join("");
  const comChips = ASSEMBLY.committees.map(c =>
    `<a class="ig-chip" href="${c.url}" target="_blank" rel="noopener">${esc(c.name)}${c.head ? ` <span class="ig-chip-h">${esc(c.head)}</span>` : ""}</a>`).join("");
  const asmNode = igPanel(ASSEMBLY.name, ASSEMBLY.home, ASSEMBLY.color,
    `👤 국회의장 · ${esc(ASSEMBLY.speaker)}`,
    `<div class="ig-sub">부의장 · ${esc(ASSEMBLY.viceSpeakers)}</div>
     <div class="ig-label">교섭단체</div>
     <div class="ig-grid ig-grid-2">${blocCards}</div>
     <div class="ig-note">${esc(ASSEMBLY.negoNote)}</div>
     <div class="ig-label">상임위원회 (${ASSEMBLY.committees.length})</div>
     <div class="ig-chips">${comChips}</div>
     <div class="ig-note">${esc(ASSEMBLY.committeesNote)}</div>`);

  // 4) 정당
  const partyCards = PARTIES.map(p => `
    <div class="ig-card" style="--c:${p.color}">
      <div class="ig-card-t"><a class="ig-home" href="${p.home}" target="_blank" rel="noopener" style="color:${p.color}">${esc(p.name)} <span class="ig-ext">↗</span></a></div>
      <div class="ig-card-s">당대표 · ${esc(p.leader)}</div>
      <div class="ig-card-s">원내대표 · ${esc(p.floorLeader)}</div>
      <div class="ig-card-v">최고위원 · ${esc(p.supremes)}</div>
    </div>`).join("");
  const partyNode = `<div class="ig-panel" style="--c:#6b7280">
      <div class="ig-panel-head">정당</div>
      <div class="ig-grid ig-grid-2">${partyCards}</div>
    </div>`;

  view.innerHTML = `<div class="detail">
      <button class="back" onclick="location.hash=''">← 메인으로</button>
      <h2>🏛️ 전체 조직 한눈에</h2>
      <div class="act-row">
        <button class="print-btn" onclick="window.print()">🖨️ 인쇄 / PDF 저장</button>
      </div>
      <div class="ig">
        ${presNode}<div class="ig-link"></div>
        ${govNode}<div class="ig-link"></div>
        ${asmNode}<div class="ig-link"></div>
        ${partyNode}
      </div>
    </div>`;
  foot.innerHTML = [
    "대통령실·정부·국회·정당의 조직 구성을 한 페이지에 모았습니다.",
    "기관·정당 이름을 누르면 공식 홈페이지로 이동합니다.",
    "일부 정보는 개편·원구성 진행으로 변동될 수 있습니다."
  ].map(s => `• ${s}`).join("<br>");
}

// 시장 소속 정당 → 카드 바탕색(흐리게). 민주=파랑, 국힘=빨강, 그 외=기본
function partyTint(party) {
  // 세련된 표현: 카드는 흰 바탕, 왼쪽에 가는 당색 강조선 + 아주 옅은 색조
  if (party === "민") return "background:#fbfdff;border-left:4px solid #2b6cb0";
  if (party === "국") return "background:#fffbfb;border-left:4px solid #c0392b";
  return "";
}

// ── 묶음 화면: 경기도 조직 (경기도의회·경기도 31개 시·군·경기도교육청) ──
function renderGyeonggiOrg() {
  view.innerHTML = `
    <div class="detail">
      <button class="back" onclick="location.hash=''">← 메인으로</button>
      <h2>🗺️ 경기도 조직</h2>
      <div class="nav-tiles">
        <a class="nav-tile" style="--c:#0c4da2" onclick="location.hash='#gg-council'">
          <div class="nt-ico">🏛️</div>
          <div class="nt-t">경기도의회 · 31개 시·군의회</div>
          <div class="nt-s">정당별 의석수 · 의장단 (경기도의회 + 31개 시·군의회)</div>
        </a>
        <a class="nav-tile" style="--c:${GYEONGGI.color}" onclick="location.hash='#gyeonggi'">
          <div class="nt-ico">🗺️</div>
          <div class="nt-t">경기도 31개 시·군</div>
          <div class="nt-s">단체장·시·군의회 구성·공약</div>
        </a>
        <a class="nav-tile" style="--c:${GYEONGGI_EDU.color}" onclick="location.hash='#gyeonggi-edu'">
          <div class="nt-ico">🎓</div>
          <div class="nt-t">경기도교육청</div>
          <div class="nt-s">25개 교육지원청 안내</div>
        </a>
      </div>
    </div>`;
  foot.innerHTML = "경기도 조직은 경기도의회·경기도(31개 시·군)·경기도교육청 세 곳으로 나뉩니다. 항목을 눌러 자세히 보세요.";
}

// ── 상세 화면: 경기도 31개 시·군 ──
function renderGyeonggi() {
  const g = window.GYEONGGI;
  const newTerm = location.search.includes("term=9") || new Date() >= new Date(2026, 6, 1); // 2026-07-01 0시(로컬)부터 true. ?term=9 로 미리보기
  const manStr = n => (n / 10000).toFixed(1) + "만";
  const adminStr = c => {
    const p = [];
    if (c.gu) p.push(c.gu + "구");
    if (c.eup) p.push(c.eup + "읍");
    if (c.myeon) p.push(c.myeon + "면");
    if (c.dong) p.push(c.dong + "동");
    return p.join("·");
  };
  const P = { 민: ["더불어민주당", "#2b6cb0"], 국: ["국민의힘", "#c0392b"], 진: ["진보당", "#b81d3e"], 개: ["개혁신당", "#d97a34"], 무: ["무소속", "#6b7280"], 기본: ["기본소득당", "#16a085"], 사민: ["사회민주당", "#8e44ad"], 정의: ["정의당", "#d4a017"], 녹정: ["녹색정의당", "#2e8b57"], 노동: ["노동당", "#a93226"] };
  const seatStr = obj => Object.entries(obj).map(([p, n]) => `<span style="color:${(P[p] || ["", "#444"])[1]}">${(P[p] || [p])[0]} ${n}</span>`).join(" · ");
  const total = obj => Object.values(obj).reduce((a, b) => a + b, 0);
  const memChips = arr => arr.map(m => `<span class="cm-chip" style="border-color:${(P[m.p] || ["", "#ccc"])[1]}">${esc(m.n)}<small>${esc(m.d || "")}</small></span>`).join("");
  const councilHtml = c => {
    if (!newTerm) return "";
    const d = window.GG_COUNCIL && window.GG_COUNCIL[c.name];
    if (!d) return "";
    return `<details class="gg-council">
      <summary>🏛 의회 구성 · 도의원 ${total(d.prov)} · 시·군의원 ${total(d.basic)}</summary>
      <div class="cm-block"><div class="cm-head">도의원 <span class="cm-seats">${seatStr(d.prov)}</span></div><div class="cm-list">${memChips(d.provList)}</div></div>
      <div class="cm-block"><div class="cm-head">시·군의원 <span class="cm-seats">${seatStr(d.basic)}</span></div><div class="cm-list">${memChips(d.basicList)}</div></div>
      <div class="cm-src">${esc(d.src || "")}</div>
    </details>`;
  };
  const cityCard = c => {
    const changed = !!c.elect;
    const mayorName = newTerm ? (c.elect || c.mayor) : c.mayor;
    const party = newTerm ? c.pElect : c.pNow;       // 표시 중인 시장의 정당으로 색
    const electLine = (!newTerm && changed)
      ? `<div class="gg-elect">→ 7·1 ${esc(c.elect)} (당선)</div>` : "";
    const termLabel = t => t === 1 ? "초선" : t === 2 ? "재선" : `${t}선`;
    const termStr = (newTerm && c.electTerm) ? ` (${termLabel(c.electTerm)})` : "";
    const showSlogan = !!c.slogan;
    const slogan = showSlogan ? `<div class="gg-slogan">“${esc(c.slogan)}”</div>` : "";
    const stat = (c.pop != null)
      ? `<div class="gg-stat">👥 ${manStr(c.pop)} · 📐 ${c.area}㎢</div>
         <div class="gg-stat">🏛 ${adminStr(c)}</div>` : "";
    return `<div class="gg-cell">
      <a class="gg-card" style="${partyTint(party)}" href="${esc(c.url)}" target="_blank" rel="noopener">
        <div class="gg-name">${esc(c.name)} <span class="ig-ext">↗</span></div>
        <div class="gg-mayor">${c.name.endsWith("군") ? "군수" : "시장"} · ${esc(mayorName)}${termStr}</div>
        ${stat}${electLine}${slogan}
      </a>${councilHtml(c)}
    </div>`;
  };
  const ggNote = newTerm
    ? "시장·군수·슬로건은 2026-07-06 기준 민선9기입니다. 재선 단체장은 새 임기의 시정 슬로건을, 새로 취임한 단체장은 취임식에서 밝힌 민선9기 구호를 각 시·군 홈페이지에서 확인해 넣었습니다. 아직 새 슬로건을 공표하지 않은 일부(평택 등)는 비워 두었습니다. 바탕색=단체장 소속 정당(파랑 더불어민주당·빨강 국민의힘)."
    : g.note;
  view.innerHTML = `<div class="detail" style="--c:${g.color}">
      <button class="back" onclick="location.hash='#gyeonggi-org'">← 경기도 조직</button>
      <h2 style="color:${g.color};border-color:${g.color}"><a class="title-home" href="${g.home}" target="_blank" rel="noopener" style="color:${g.color}">경기도 ↗</a></h2>
      <div class="gg-head">👤 도지사 · ${esc(g.gov)}${g.slogan ? ` <span class="gg-org-slogan">“${esc(g.slogan)}”</span>` : ""}</div>
      <div class="sec-title">경기남부 <span class="gt-count">${g.cities.filter(c => c.region === "남").length}곳</span></div>
      <div class="gg-grid">${g.cities.filter(c => c.region === "남").map(cityCard).join("")}</div>
      <div class="sec-title">경기북부 <span class="gt-count">${g.cities.filter(c => c.region === "북").length}곳</span></div>
      <div class="gg-grid">${g.cities.filter(c => c.region === "북").map(cityCard).join("")}</div>
      <p class="note">${esc(ggNote)}</p>
    </div>`;
  foot.innerHTML = "시·군 카드를 누르면 해당 시·군 공식 홈페이지로 이동합니다. · 시장은 2026-07-01부터 민선9기 당선자로 자동 전환됩니다.";
}

// ── 상세 화면: 경기도교육청 교육지원청 ──
function renderGyeonggiEdu() {
  const e = window.GYEONGGI_EDU;
  const chips = e.offices.map(o =>
    `<a class="edu-chip" href="${esc(o.url)}" target="_blank" rel="noopener">${esc(o.name)} <span class="ig-ext">↗</span></a>`).join("");
  view.innerHTML = `<div class="detail" style="--c:${e.color}">
      <button class="back" onclick="location.hash='#gyeonggi-org'">← 경기도 조직</button>
      <h2 style="color:${e.color};border-color:${e.color}"><a class="title-home" href="${e.home}" target="_blank" rel="noopener" style="color:${e.color}">경기도교육청 ↗</a></h2>
      <div class="gg-head">👤 교육감 · ${esc(e.superintendent)}${e.slogan ? ` <span class="gg-org-slogan">“${esc(e.slogan)}”</span>` : ""}</div>
      <div class="sec-title">교육지원청 <span class="gt-count">${e.offices.length}곳</span></div>
      <div class="edu-grid">${chips}</div>
      <p class="note">${esc(e.note)}</p>
    </div>`;
  foot.innerHTML = "교육지원청을 누르면 해당 교육지원청 공식 홈페이지로 이동합니다.";
}

// ── 상세 화면: 경기도의회 + 31개 시·군의회 (정당별 의석수) ──
// 데이터: window.GG_COUNCIL (2026-06-03 제9회 지방선거 당선인, 선관위 명부)
//  - prov: 각 시·군의 '도의원(지역구)' 정당별 수 → 합산 = 경기도의회 지역구 구성
//  - basic: 각 '시·군의회' 정당별 수(지역구+비례 포함) → 시·군의회 전체 구성
function renderGgCouncil() {
  const C = window.GG_COUNCIL || {};
  const g = window.GYEONGGI;
  const PC = { 민: ["더불어민주당", "#2b6cb0"], 국: ["국민의힘", "#c0392b"], 조국: ["조국혁신당", "#0073cf"], 진: ["진보당", "#b81d3e"], 개: ["개혁신당", "#d97a34"], 무: ["무소속", "#6b7280"], 기본: ["기본소득당", "#16a085"], 사민: ["사회민주당", "#8e44ad"], 정의: ["정의당", "#d4a017"], 녹정: ["녹색정의당", "#2e8b57"], 노동: ["노동당", "#a93226"] };
  const total = obj => Object.values(obj || {}).reduce((a, b) => a + b, 0);
  const seatStr = obj => Object.entries(obj || {})
    .sort((a, b) => b[1] - a[1])
    .map(([p, n]) => `<span class="cc-seat" style="color:${(PC[p] || ["", "#444"])[1]}">${esc((PC[p] || [p])[0])} ${n}</span>`)
    .join("");
  const leadLine = lead => lead
    ? `<div class="cc-lead">🏛 ${esc(lead)}</div>`
    : `<div class="cc-lead muted">🏛 의장단 확인 중</div>`;

  // 경기도의회 제12대 공식 구성(지역구 146 + 비례 21 = 167) — 2026-06-03 제9회 지방선거, 언론 다수 교차검증
  const GA_SEATS = { 민: 144, 국: 22, 조국: 1 };
  const topCard = `<div class="cc-top">
      <div class="cc-name">
        <a class="title-home" href="https://www.ggc.go.kr/" target="_blank" rel="noopener" style="color:#0c4da2">경기도의회 ↗</a>
      </div>
      <div class="cc-lead muted">🏛 의장단 미선출 · 제1차 본회의에서 선출 예정</div>
      <div class="cc-total">전체 도의원 ${total(GA_SEATS)}명</div>
      <div class="cc-seats">${seatStr(GA_SEATS)}</div>
      <div class="cc-src">지역구 146 + 비례대표 21 · 2026-06-03 제9회 지방선거 결과(선관위·언론 보도 교차확인).</div>
    </div>`;

  const councilCard = name => {
    const d = C[name];
    const b = d && d.basic;
    const body = b
      ? `<div class="cc-total">총 ${total(b)}명</div><div class="cc-seats">${seatStr(b)}</div>`
      : `<div class="cc-lead muted">의석 자료 확인 중</div>`;
    return `<div class="gg-cell"><div class="cc-card">
        <div class="gg-name">${esc(name)}의회</div>
        ${leadLine("")}
        ${body}
      </div></div>`;
  };
  const grid = region => `<div class="gg-grid">${g.cities.filter(c => c.region === region).map(c => councilCard(c.name)).join("")}</div>`;
  const cnt = region => g.cities.filter(c => c.region === region).length;

  view.innerHTML = `<div class="detail" style="--c:#0c4da2">
      <button class="back" onclick="location.hash='#gyeonggi-org'">← 경기도 조직</button>
      <h2 style="color:#0c4da2;border-color:#0c4da2">🏛 경기도의회 · 31개 시·군의회</h2>
      ${topCard}
      <div class="sec-title">경기남부 시·군의회 <span class="gt-count">${cnt("남")}곳</span></div>
      ${grid("남")}
      <div class="sec-title">경기북부 시·군의회 <span class="gt-count">${cnt("북")}곳</span></div>
      ${grid("북")}
      <p class="note">정당별 의석수는 2026-06-03 제9회 지방선거 당선인(중앙선거관리위원회 명부) 기준입니다. 시·군의회는 지역구+비례 전체, 경기도의회(상단)는 지역구 도의원 합산입니다. 의장단은 각 의회 개원·선출이 확인되는 대로 채웁니다.</p>
    </div>`;
  foot.innerHTML = "정당별 의석수는 선관위 당선인 명부 기준(민선9기). · 의장단은 확정 시 반영합니다.";
}

// ── 브리핑·모두발언 모아보기 ──
// 기관별 오늘 자료 전체 (안내성 '확인 필요' 항목은 제외)
function briefMats(name) {
  const { mats } = splitItems(DAILY[name]);
  const parsed = mats.map(parseMat)
    .filter(m => !/확인\s*필요/.test((m.text || "") + (m.tag || "")));
  const real = parsed.filter(m => m.text);          // 실제 수집된 자료(본문 있음)
  if (real.length) return real;
  // 실제 자료가 없으면 괄호로 감싼 안내문("게시판에서 확인하세요")을 본문으로 노출
  return parsed.filter(m => m.tag).map(m => ({ tag: "", text: m.tag, link: m.link }));
}
function renderBriefings() {
  const order = [PRESIDENT, GOVERNMENT, ASSEMBLY, ...PARTIES];
  const secs = order.map(e => {
    const list = briefMats(e.name);
    if (!list.length) return "";
    const title = e.home
      ? `<a class="title-home" href="${e.home}" target="_blank" rel="noopener" style="color:${e.color}">${esc(e.name)}</a>`
      : esc(e.name);
    const items = list.slice(0, 2).map(m => {
      const chip = m.tag ? `<span class="bp-tag">${esc(m.tag)}</span> ` : "";
      const body = m.link
        ? `<a class="bp-link" href="${esc(m.link)}" target="_blank" rel="noopener">${esc(m.text)}</a>`
        : esc(m.text);
      return `<li class="bp-item">${chip}${body}</li>`;
    }).join("");
    return `<div class="all-sec" style="border-left:4px solid ${e.color}">
        <h3 style="color:${e.color}">${title}</h3>
        <ul class="bp-list">${items}</ul></div>`;
  }).join("");
  const boardLinks = (window.BRIEF_BOARDS || [])
    .map(b => `<a href="${b.url}" target="_blank" rel="noopener" style="color:${b.color}">${esc(b.name)} ↗</a>`)
    .join("");
  const todayStr = new Date().toLocaleDateString("ko-KR",
    { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  view.innerHTML = `<div class="detail">
      <button class="back" onclick="location.hash=''">← 전체 보기</button>
      <div class="brief-date">${todayStr}</div>
      <h2>📰 기관별 소식</h2>
      <div class="act-row">
        <button class="reload" onclick="refresh()">새로고침</button>
      </div>
      <div class="sec-title">기관별 소식 게시판 바로가기</div>
      <div class="boards">${boardLinks}</div>
      ${secs || '<p class="empty">등록된 브리핑이 없습니다.</p>'}
    </div>`;
  foot.innerHTML = "각 기관·정당 게시판에서 확인한 오늘 자료(보도자료·브리핑·모두발언)를 모아 요약했습니다. · ‘한글 문서로 저장’을 누르면 한글/워드에서 열리는 .doc 파일로 내려받습니다.";
}

function route() {
  const id = location.hash.replace("#", "");
  if (id === "org") { renderOrg(); window.scrollTo(0, 0); return; }
  if (id === "gyeonggi") { renderGyeonggi(); window.scrollTo(0, 0); return; }
  if (id === "gyeonggi-edu") { renderGyeonggiEdu(); window.scrollTo(0, 0); return; }
  if (id === "gyeonggi-org") { renderGyeonggiOrg(); window.scrollTo(0, 0); return; }
  if (id === "gg-council") { renderGgCouncil(); window.scrollTo(0, 0); return; }
  if (id === "briefings") { renderBriefings(); window.scrollTo(0, 0); return; }
  if (id === GOVERNMENT.id) { renderGovernment(GOVERNMENT); window.scrollTo(0, 0); return; }
  if (id === ASSEMBLY.id) { renderAssembly(ASSEMBLY); window.scrollTo(0, 0); return; }
  const p = id === PRESIDENT.id ? PRESIDENT
    : PARTIES.find(x => x.id === id);
  if (p) renderDetail(p); else renderHome();
  window.scrollTo(0, 0);
}

async function refresh() { await loadDaily(); route(); }

function showUpdated() {
  const t = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  const el = document.getElementById("updated");
  if (el) el.textContent = `모든 자료 최신으로 불러온 시각: ${t} · 자동 갱신: 매일 오전 9시`;
}

const updateBtn = document.getElementById("updateBtn");
if (updateBtn) {
  updateBtn.addEventListener("click", async () => {
    updateBtn.disabled = true;
    updateBtn.textContent = "불러오는 중…";
    await loadDaily();
    route();
    showUpdated();
    updateBtn.textContent = "🔄 지금 업데이트";
    updateBtn.disabled = false;
  });
}

window.addEventListener("hashchange", route);
(async () => { await loadDaily(); route(); showUpdated(); })();

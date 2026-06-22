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
  const linkHtml = link ? ` <a class="bp-src" href="${esc(link)}">원문 ›</a>` : "";
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
// 카드용 요약(링크 제거, 잘리지 않게 전체 반환 — 길면 줄바꿈됨)
function brief(items) {
  const { mats } = splitItems(items);
  if (!mats.length) return "";
  return mats[0].replace(/\(원문:[^)]*\)/g, "").replace(/https?:\/\/\S+/g, "").trim();
}

async function loadDaily() {
  try {
    const res = await fetch("정당정책_오늘내용.md?_=" + Date.now(), { cache: "no-store" });
    if (res.ok) DAILY = parseDaily(await res.text());
  } catch { DAILY = {}; }
}

// ── 메인 화면: 오늘의 이슈 + 대통령실 + 정당 카드 ──
function renderHome() {
  const board0 = e => (e.boards && e.boards[0] && e.boards[0].url) ? e.boards[0].url : (e.home || "#");
  const issues = DAILY["오늘의 이슈"] || [];
  const issueGroups = [
    { key: "대통령실", label: "🏛️ 대통령실", home: "https://www.president.go.kr/" },
    { key: "정책브리핑", label: "📰 대한민국 정책브리핑", home: "https://www.korea.kr/" },
    { key: "국회", label: "🏛️ 국회", home: "https://www.assembly.go.kr/" },
    { key: "정당", label: "🏳️ 정당", home: "" }
  ];
  const stripTag = t => t.replace(/^\[[^\]]+\]\s*/, "");
  const issueGroupHtml = issueGroups.map(g => {
    const list = issues.filter(t => t.startsWith(`[${g.key}]`)).map(stripTag);
    if (!list.length) return "";
    const title = g.home
      ? `<a class="issue-grp-link" href="${g.home}">${g.label} →</a>`
      : `<span class="issue-grp-link">${g.label}</span>`;
    return `<div class="issue-grp"><div class="issue-grp-title">${title}</div>
      <ul>${list.map(t => `<li class="item">${linkify(t)}</li>`).join("")}</ul></div>`;
  }).join("");
  const issueHtml = `
    <div class="issue-box">
      <div class="issue-head">
        <div class="issue-title">📌 주요 이슈</div>
        <button class="mini-btn" onclick="location.hash='#briefings'">📰 브리핑 모아보기</button>
      </div>
      ${issueGroupHtml
        ? `<div class="issue-grid">${issueGroupHtml}</div>`
        : '<p class="empty">등록된 이슈가 없습니다. (정당정책_오늘내용.md 의 “## 오늘의 이슈”에 [대통령실]/[정책브리핑]/[국회]/[정당] 으로 적어주세요)</p>'}
    </div>`;

  const presBrief = brief(DAILY[PRESIDENT.name]);
  const presCard = `
    <div class="pcard org" style="border-top-color:${PRESIDENT.color}" onclick="location.hash='#${PRESIDENT.id}'">
      <h2 style="color:${PRESIDENT.color}">🏛️ <a class="title-home" href="${PRESIDENT.home}" style="color:${PRESIDENT.color}" onclick="event.stopPropagation()">${PRESIDENT.name}</a></h2>
      <div class="role">대통령실 브리핑·보도자료 등 공식 자료를 모아봅니다.</div>
      ${presBrief ? `<a class="snippet" href="${board0(PRESIDENT)}" onclick="event.stopPropagation()">최신 · ${esc(presBrief)}</a>` : ""}
      <div class="more" style="color:${PRESIDENT.color}">대통령실 자료 보기 →</div>
    </div>`;

  const govBrief = brief(DAILY[GOVERNMENT.name]);
  const govCard = `
    <div class="pcard" style="border-top-color:${GOVERNMENT.color}" onclick="location.hash='#${GOVERNMENT.id}'">
      <h2 style="color:${GOVERNMENT.color}">🏛️ <a class="title-home" href="${GOVERNMENT.home}" style="color:${GOVERNMENT.color}" onclick="event.stopPropagation()">${GOVERNMENT.name}</a></h2>
      <div class="role"><b>국무총리</b> · ${esc(GOVERNMENT.pm)} <span class="tag">${esc(GOVERNMENT.pmLoc)}</span></div>
      <div class="role">국무총리·정부부처 장관 명단과 소재지(서울/세종 등)를 봅니다.</div>
      ${govBrief ? `<a class="snippet" href="${board0(GOVERNMENT)}" onclick="event.stopPropagation()">최신 · ${esc(govBrief)}</a>` : ""}
      <div class="more" style="color:${GOVERNMENT.color}">내각 명단 보기 →</div>
    </div>`;

  const asmBrief = brief(DAILY[ASSEMBLY.name]);
  const asmCard = `
    <div class="pcard" style="border-top-color:${ASSEMBLY.color}" onclick="location.hash='#${ASSEMBLY.id}'">
      <h2 style="color:${ASSEMBLY.color}">🏛️ <a class="title-home" href="${ASSEMBLY.home}" style="color:${ASSEMBLY.color}" onclick="event.stopPropagation()">${ASSEMBLY.name}</a></h2>
      <div class="role">의안·의사일정·국회뉴스 등 공식 자료를 모아봅니다.</div>
      ${asmBrief ? `<a class="snippet" href="${board0(ASSEMBLY)}" onclick="event.stopPropagation()">최신 · ${esc(asmBrief)}</a>` : ""}
      <div class="more" style="color:${ASSEMBLY.color}">국회 자료 보기 →</div>
    </div>`;

  const partyCards = '<div class="grid">' + PARTIES.map(p => {
    const b = brief(DAILY[p.name]);
    return `
    <div class="pcard" style="border-top-color:${p.color}" onclick="location.hash='#${p.id}'">
      <h2 style="color:${p.color}">${p.home ? `<a class="title-home" href="${p.home}" style="color:${p.color}" onclick="event.stopPropagation()">${p.name}</a>` : p.name}</h2>
      <div class="role">
        <div><b>당대표</b> · ${esc(p.leader)}</div>
        <div><b>원내대표</b> · ${esc(p.floorLeader)}</div>
        <div><b>최고위원</b> · ${esc(p.supremes)}</div>
      </div>
      ${b ? `<a class="snippet" href="${board0(p)}" onclick="event.stopPropagation()">최신 · ${esc(b)}</a>` : ""}
      <div class="more" style="color:${p.color}">자료 보기 →</div>
    </div>`; }).join("") + "</div>";

  const orgBtn = `<button class="big-btn" onclick="location.hash='#org'">🏛️ 전체 조직 한눈에 보기 (대통령·정부·국회·정당)</button>`;
  const orgGrid = `<div class="grid" style="margin-bottom:16px">${govCard}${asmCard}</div>`;
  view.innerHTML = orgBtn + issueHtml + presCard + orgGrid + partyCards;
  foot.innerHTML = "카드를 누르면 그날의 자료 요약과 소식 게시판이 한 페이지에 나옵니다. · 지도부 정보 기준일 2026-06-19";
}

// ── 상세 화면: 한 정당 ──
function renderDetail(p) {
  const { sched, mats } = splitItems(DAILY[p.name]);
  const dailyHtml = mats.length
    ? "<ul>" + mats.map(t => `<li class="item">${linkify(t)}</li>`).join("") + "</ul>"
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
    ? "<ul>" + mats.map(t => `<li class="item">${linkify(t)}</li>`).join("") + "</ul>"
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
        <tr><th>국무총리</th><td>${esc(g.pm)}<span class="tag">${esc(g.pmLoc)}</span></td></tr>
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
  const blocCards = ASSEMBLY.negoBlocs.map(b => `
    <div class="ig-card" style="--c:${ASSEMBLY.color}">
      <div class="ig-card-t">${esc(b.party)}</div>
      <div class="ig-card-s">원내대표 · ${esc(b.rep)}</div>
      <div class="ig-card-v">수석부대표 · ${esc(b.deputy)}</div>
    </div>`).join("");
  const comChips = ASSEMBLY.committees.map(c => `<span class="ig-chip">${esc(c)}</span>`).join("");
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

// ── 브리핑·모두발언 모아보기 ──
// 브리핑 모아보기를 개조식 텍스트(.md)로 — 날짜·주체 포함
function buildBriefingText() {
  const order = [PRESIDENT, GOVERNMENT, ASSEMBLY, ...PARTIES];
  const today = new Date().toLocaleDateString("ko-KR",
    { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  let out = `${today}\n# 오늘의 브리핑\n\n`;
  let any = false;
  for (const e of order) {
    const { mats } = splitItems(DAILY[e.name]);
    if (!mats.length) continue;
    any = true;
    out += `## ${e.name}\n`;
    for (const raw of mats) {
      const { tag, text, link } = parseMat(raw);
      const datePart = tag ? `[${tag}] ` : "";
      out += `- ${datePart}${text}${link ? ` (원문: ${link})` : ""}\n`;
    }
    out += "\n";
  }
  if (!any) out += "등록된 브리핑이 없습니다.\n";
  return out;
}
function downloadBriefings() {
  const blob = new Blob([buildBriefingText()], { type: "text/markdown;charset=utf-8" });
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `브리핑모아보기_${date}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}
function renderBriefings() {
  const order = [PRESIDENT, GOVERNMENT, ASSEMBLY, ...PARTIES];
  const secs = order.map(e => entitySection(e, { matsOnly: true, outline: true })).join("");
  const todayStr = new Date().toLocaleDateString("ko-KR",
    { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  view.innerHTML = `<div class="detail">
      <button class="back" onclick="location.hash=''">← 전체 보기</button>
      <div class="brief-date">${todayStr}</div>
      <h2>📰 오늘의 브리핑</h2>
      <div class="act-row">
        <button class="reload" onclick="refresh()">새로고침</button>
        <button class="print-btn" onclick="downloadBriefings()">⬇️ 파일로 저장 (.md)</button>
        <button class="print-btn" onclick="window.print()">🖨️ 인쇄 / PDF 저장</button>
      </div>
      ${secs || '<p class="empty">등록된 브리핑이 없습니다.</p>'}
    </div>`;
  foot.innerHTML = "각 기관·정당의 최신 브리핑·모두발언 요약을 한 곳에 모았습니다. · 날짜·주체가 함께 표기됩니다. · '파일로 저장'으로 개조식 요약본을 내려받을 수 있습니다.";
}

function route() {
  const id = location.hash.replace("#", "");
  if (id === "org") { renderOrg(); window.scrollTo(0, 0); return; }
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

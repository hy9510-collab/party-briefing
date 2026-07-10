// 정당별 고정 정보(지도부·게시판 링크). 지도부 변동 시 이 파일만 고치면 됩니다.
// 기준일: 2026-06-19 (6.3 지방선거 직후 개편기 — 최고위원 명단 변동 잦음)
// 대통령실(정당 아님) — 지도부 표 대신 기관 자료만 보여줍니다.
window.PRESIDENT = {
  id: "president",
  name: "대통령실",
  color: "#1a4f8a",
  home: "https://www.president.go.kr/",
  head: "이재명 (제21대 대통령)",
  chief: "강훈식 (비서실장, 2025-06-04 임명)",
  chiefPrev: "前 국회의원 3선(충남 아산을) · 前 이재명 대선캠프 전략기획본부장",
  // 대통령 직속 위원회·자문기구 (2026-06 기준 총 19개). 아래는 공개 확인된 명단.
  // 자문회의·일부 위원회는 의장/위원장이 대통령이라 실질 수장(부의장·부위원장)을 head로 표기.
  committeesNote: "대통령 직속 기구는 총 19개(자문회의 3 + 위원회 16). 아래는 공개 자료로 확인된 명단이며, 나머지는 확인되는 대로 채웁니다. 자문회의는 의장이 대통령이라 실질 수장(부의장)을 적었습니다.",
  advisoryCouncils: [
    { name: "민주평화통일자문회의", head: "수석부의장 공석 (이해찬 前 수석부의장 2026-01 별세)", url: "https://www.puac.go.kr/" },
    { name: "국민경제자문회의", head: "부의장 김성식 (前 국회의원)", url: "https://www.neac.go.kr/" },
    { name: "국가과학기술자문회의", head: "부의장 이경수 (前 국가핵융합연구소장)", url: "https://www.pacst.go.kr/" }
  ],
  committees: [
    { name: "국가인공지능전략위원회", head: "부위원장 하정우 (前 대통령실 AI미래기획수석)", url: "https://www.aikorea.go.kr/" },
    { name: "기본사회위원회", head: "부위원장 강남훈 (의장=대통령)", url: "" },
    { name: "대중문화교류위원회", head: "공동위원장 최휘영(문체부 장관)·박진영(JYP)", url: "https://www.mcst.go.kr/kor/s_notice/press/pressList.jsp" },
    { name: "경제사회노동위원회", head: "위원장 김지형", url: "https://www.eslc.go.kr/" },
    { name: "저출산고령사회위원회", head: "부위원장 김진오 (前 CBS 사장)", url: "https://www.betterfuture.go.kr/" },
    { name: "국민통합위원회", head: "위원장 이석연", url: "https://www.k-cohesion.go.kr/" }
  ],
  boards: [
    { label: "브리핑 (1순위)", url: "https://www.president.go.kr/briefings" },
    { label: "공개일정", url: "https://www.president.go.kr/schedule" },
    { label: "연설문", url: "https://www.president.go.kr/speeches" },
    { label: "대통령실 홈", url: "https://www.president.go.kr/" }
  ]
};

// 정부(내각) — 국무총리 + 정부부처 장관·소재지. 기준: 이재명 정부(2026-06 개각 진행 중이라 일부 유동적)
window.GOVERNMENT = {
  id: "government",
  name: "정부 (내각)",
  color: "#2e7d5b",
  home: "https://www.opm.go.kr/",
  pm: "한성숙 (국무총리, 2026-07-02 취임)",
  pmPrev: "前 중소벤처기업부 장관 · 前 네이버 대표 · 이재명 정부 2번째 총리(국회 인준 2026-06-30, 20년 만의 두 번째 여성 총리)",
  pmLoc: "세종",
  note: "정부조직 개편 반영: 기획재정부 → 재정경제부+기획예산처 / 환경부 → 기후에너지환경부 / 여성가족부 → 성평등가족부 / 산업통상자원부 → 산업통상부. 개각 진행 중이라 일부 장관·소재지는 바뀔 수 있습니다.",
  // 부처는 아니지만 총리를 보좌하는 핵심 사무기구 — 부처 목록 위에 별도 카드로 표시
  pmOffices: [
    { dept: "국무조정실·국무총리비서실", role: "정부 정책 조정·총괄 / 국무총리 보좌 (한 누리집 운영)", loc: "세종", url: "https://www.opm.go.kr/" }
  ],
  ministers: [
    { dept: "재정경제부", name: "구윤철", prev: "前 국무조정실장", loc: "세종", since: "2026-01-02", vice: [{ r: "1차관", n: "이형일", p: "前 통계청장·기재부 차관보" }, { r: "2차관", n: "허장", p: "前 수출입은행 ESG위원장·IMF 상임이사" }], url: "https://www.moef.go.kr/nw/nes/nesdtaList.do" },
    { dept: "기획예산처", name: "박홍근", prev: "더불어민주당 의원·前 원내대표", loc: "세종", since: "2026-03-25", vice: [{ r: "차관", n: "임기근", p: "前 기획재정부 2차관·조달청장" }], url: "https://www.korea.kr/briefing/pressReleaseList.do" },
    { dept: "과학기술정보통신부", name: "배경훈", prev: "前 LG AI연구원장", loc: "세종", since: "2025-10-01", vice: [{ r: "1차관", n: "구혁채", p: "前 과기정통부 기획조정실장" }, { r: "2차관", n: "류제명", p: "前 과기정통부 네트워크정책실장" }], url: "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=112&mId=113" },
    { dept: "교육부", name: "최교진", prev: "前 세종특별자치시교육감", loc: "세종", since: "2025-10-01", vice: [{ r: "차관", n: "최은옥", p: "前 교육부 고등교육정책실장" }], url: "https://www.moe.go.kr/boardCnts/listRenew.do?boardID=294&m=020402&s=moe" },
    { dept: "외교부", name: "조현", prev: "前 외교부 제1차관", loc: "서울", since: "2025-07-18", vice: [{ r: "1차관", n: "박윤주", p: "前 주아세안대표부 공사" }, { r: "2차관", n: "김진아", p: "前 한국외대 교수·UN 군축자문위원" }], url: "https://www.mofa.go.kr/www/brd/m_4080/list.do" },
    { dept: "통일부", name: "정동영", prev: "前 통일부 장관·5선 의원", loc: "서울", since: "2025-07-25", vice: [{ r: "차관", n: "김남중", p: "前 통일부 남북회담본부 상임위원" }], url: "https://www.unikorea.go.kr/unikorea/news/release/" },
    { dept: "법무부", name: "정성호", prev: "더불어민주당 5선 의원", loc: "과천", since: "2025-07-18", vice: [{ r: "차관", n: "이진수", p: "前 대검 형사부장·서울북부지검장" }], url: "https://www.moj.go.kr/moj/221/subview.do" },
    { dept: "국방부", name: "안규백", prev: "더불어민주당 의원·前 국회 국방위원장", loc: "서울(용산)", since: "2025-07-25", vice: [{ r: "차관", n: "이두희", p: "前 육군 미사일전략사령관·1군단장" }], url: "https://www.mnd.go.kr/cop/kookbangNews/kookbangNewsList.do?siteId=mnd&id=mnd_020500000000" },
    { dept: "행정안전부", name: "윤호중", prev: "더불어민주당 5선 의원·前 원내대표", loc: "세종", since: "2025-07-19", vice: [{ r: "차관", n: "김민재", p: "前 행정안전부 차관보" }, { r: "재난안전관리본부장", n: "김광용", p: "前 행안부 자연재난실장(차관급)" }], url: "https://www.mois.go.kr/frt/bbs/type010/commonSelectBoardList.do?bbsId=BBSMSTR_000000000008" },
    { dept: "국가보훈부", name: "권오을", prev: "前 국회사무총장", loc: "세종", since: "2025-07-25", vice: [{ r: "차관", n: "강윤진", p: "前 대구지방보훈청장(보훈부 첫 여성 국장)" }], url: "https://www.mpva.go.kr/mpva/selectBbsNttList.do?bbsNo=10&key=292" },
    { dept: "문화체육관광부", name: "최휘영", prev: "前 네이버 대표·관광기업 경영인", loc: "세종", since: "2025-07-31", vice: [{ r: "1차관", n: "김영수", p: "前 국립중앙박물관 행정운영단장·국립한글박물관장" }, { r: "2차관", n: "김대현", p: "前 문체부 종무실장" }], url: "https://www.mcst.go.kr/kor/s_notice/press/pressList.jsp" },
    { dept: "농림축산식품부", name: "송미령", prev: "유임(前 농림축산식품부 장관)", loc: "세종", since: "유임", vice: [{ r: "차관", n: "김종구", p: "前 농식품부 식량정책실장" }], url: "https://www.mafra.go.kr/home/5108/subview.do" },
    { dept: "산업통상부", name: "김정관", prev: "前 두산에너빌리티 사장·前 기획재정부 정책기획관", loc: "세종", since: "2025-10-01", vice: [{ r: "차관", n: "문신학", p: "前 산업부 대변인·원전산업정책관" }, { r: "통상교섭본부장", n: "여한구", p: "前 통상교섭본부장·피터슨연구소 선임위원" }], url: "https://www.motie.go.kr/kor/article/ATCLba6cefc8c/list" },
    { dept: "보건복지부", name: "정은경", prev: "前 질병관리청장", loc: "세종", since: "2025-07-21", vice: [{ r: "1차관", n: "현수엽", p: "前 보건복지부 대변인" }, { r: "2차관", n: "이형훈", p: "前 한국공공조직은행장·보건의료정책관" }], url: "https://www.mohw.go.kr/board.es?mid=a10503000000&bid=0027" },
    { dept: "기후에너지환경부", name: "김성환", prev: "더불어민주당 의원", loc: "세종", since: "2025-10-01", vice: [{ r: "1차관", n: "금한승", p: "前 국립환경과학원장" }, { r: "2차관", n: "이호현", p: "前 산업부 2차관·에너지정책실장" }], url: "https://me.go.kr/home/web/board/list.do?menuId=10525&boardMasterId=1" },
    { dept: "고용노동부", name: "김영훈", prev: "前 민주노총 위원장(철도 기관사 출신)", loc: "세종", since: "2025-07-21", vice: [{ r: "차관", n: "권창준", p: "前 고용노동부 기획조정실장" }], url: "https://www.moel.go.kr/news/enews/report/enewsList.do" },
    { dept: "성평등가족부", name: "원민경", prev: "前 민변 여성인권위원장·여성·소수자 인권 변호사", loc: "서울", since: "2025-10-01", vice: [{ r: "차관", n: "정구창", p: "前 여가부 기획조정실장·창원시 제1부시장" }], url: "https://www.mogef.go.kr/nw/enw/nw_enw_s001.do" },
    { dept: "국토교통부", name: "김윤덕", prev: "더불어민주당 의원", loc: "세종", since: "2025-07-31", vice: [{ r: "1차관", n: "이상경", p: "前 가천대 교수(도시계획 전문가)" }, { r: "2차관", n: "홍지선", p: "前 경기도 도시주택실장·남양주 부시장" }], url: "https://www.molit.go.kr/USR/NEWS/m_71/lst.jsp" },
    { dept: "해양수산부", name: "황종우", prev: "前 해양수산부 기획조정실장(행시 38회)", loc: "세종(부산 이전 추진)", since: "2026-03-25", vice: [{ r: "차관", n: "남재헌", p: "前 해수부 북극항로추진본부장·항만국장" }], url: "https://www.mof.go.kr/doc/ko/selectDocList.do?menuSeq=971&bbsSeq=10" },
    { dept: "중소벤처기업부", name: "인선 중", prev: "前 한성숙 장관, 국무총리 임명(2026-07)으로 이동", loc: "세종", since: "", vice: [{ r: "1차관", n: "노용석", p: "前 중기부 중소기업정책실장" }, { r: "2차관", n: "이병권", p: "前 서울지방중소벤처기업청장" }], url: "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=86" }
  ],
  boards: [
    { label: "국무조정실·국무총리비서실", url: "https://www.opm.go.kr/" },
    { label: "대한민국 정책브리핑", url: "https://www.korea.kr/" }
  ]
};

// 국회 — 의안·의사일정·뉴스 등 공식 자료를 모아봅니다.
window.ASSEMBLY = {
  id: "assembly",
  name: "국회",
  color: "#6b5b95",
  home: "https://www.assembly.go.kr/",
  speaker: "조정식 (더불어민주당·경기 시흥시을, 2026-06-05 선출)",
  viceSpeakers: "남인순(더불어민주당)·박덕흠(국민의힘)",
  // 17개 상임위원회. 22대 후반기 원구성(2026-06-30) 반영. 명칭 일부 개편, 위원장 11곳 확정(모두 민주당)
  committeesNote: "22대 후반기 원구성 완료(2026-06-30, 더불어민주당 주도 단독 선출). 위원장 11곳(예산결산특별위 이광재 포함)은 모두 민주당 소속이며, 교육·외교통일·산업통상자원중소벤처기업·보건복지·국토교통·정보·성평등가족위원장은 여야 배분 미합의로 미확정입니다. 상임위 명칭도 일부 개편(재정경제기획·기후에너지환경노동·성평등가족).",
  committees: [
    { name: "국회운영위원회", head: "위원장 한병도", url: "https://steering.na.go.kr:444/steering/index.do" },
    { name: "법제사법위원회", head: "위원장 서영교", url: "https://legislation.na.go.kr:444/legislation/index.do" },
    { name: "정무위원회", head: "위원장 유동수", url: "https://policy.na.go.kr:444/policy/index.do" },
    { name: "재정경제기획위원회", head: "위원장 조승래", url: "https://finance.na.go.kr:444/finance/index.do" },
    { name: "교육위원회", head: "위원장 미확정", url: "https://edu.na.go.kr:444/edu/index.do" },
    { name: "과학기술정보방송통신위원회", head: "위원장 송기헌", url: "https://science.na.go.kr:444/science/index.do" },
    { name: "외교통일위원회", head: "위원장 미확정", url: "https://uft.na.go.kr:444/uft/index.do" },
    { name: "국방위원회", head: "위원장 진성준", url: "https://defense.na.go.kr:444/defense/index.do" },
    { name: "행정안전위원회", head: "위원장 김영진", url: "https://adminhom.na.go.kr:444/adminhom/index.do" },
    { name: "문화체육관광위원회", head: "위원장 이재정", url: "https://cst.na.go.kr:444/cst/index.do" },
    { name: "농림축산식품해양수산위원회", head: "위원장 서삼석", url: "https://agri.na.go.kr:444/agri/index.do" },
    { name: "산업통상자원중소벤처기업위원회", head: "위원장 미확정", url: "https://industry.na.go.kr:444/industry/index.do" },
    { name: "보건복지위원회", head: "위원장 미확정", url: "https://health.na.go.kr:444/health/index.do" },
    { name: "기후에너지환경노동위원회", head: "위원장 김정호", url: "https://environment.na.go.kr:444/environment/index.do" },
    { name: "국토교통위원회", head: "위원장 미확정", url: "https://ltc.na.go.kr:444/ltc/index.do" },
    { name: "정보위원회", head: "위원장 미확정", url: "https://intelligence.na.go.kr:444/intelligence/index.do" },
    { name: "성평등가족위원회", head: "위원장 미확정", url: "https://women.na.go.kr:444/women/index.do" }
  ],
  // 교섭단체(의석 20석 이상). 대표=원내대표, 부대표=원내수석부대표
  negoBlocs: [
    { party: "더불어민주당", rep: "한병도 (원내대표)", deputy: "확인 필요 (원내수석부대표)", url: "https://www.assembly.go.kr/portal/na/naComm/naAssmPoly.do?menuNo=600155" },
    { party: "국민의힘", rep: "정점식 (원내대표)", deputy: "확인 필요 (원내수석부대표)", url: "https://www.assembly.go.kr/portal/na/naComm/naAssmPoly.do?menuNo=600155" }
  ],
  negoNote: "조국혁신당·개혁신당 등은 비교섭단체. 후반기 원구성·인선에 따라 변동 가능.",
  boards: [
    { label: "국회 홈", url: "https://www.assembly.go.kr/" },
    { label: "의안정보시스템", url: "https://likms.assembly.go.kr/bill/main.do" },
    { label: "국회뉴스ON", url: "https://www.naon.go.kr/" },
    { label: "열린국회정보", url: "https://open.assembly.go.kr/" }
  ]
};

window.PARTIES = [
  {
    id: "minjoo",
    name: "더불어민주당",
    color: "#0050a0",
    home: "https://theminjoo.kr/",
    leader: "정청래 (서울 마포구을)",
    floorLeader: "한병도 (전북 익산시을)",
    supremes: "황명선(비례대표) 외 전임 최고위원 유임 — 차기 전당대회 2026-08-17 예정",
    supremesNote: "부분 확정",
    boards: [
      { label: "논평·브리핑 (1순위)", url: "https://theminjoo.kr/main/sub/news/list.php?brd=11&cate=105" },
      { label: "일정", url: "https://theminjoo.kr/main/sub/news/schedule.php" },
      { label: "중앙당 홈", url: "https://theminjoo.kr/" },
      { label: "경기도당", url: "https://www.minjookg.kr/" }
    ]
  },
  {
    id: "jokuk",
    name: "조국혁신당",
    color: "#0073cf",
    home: "https://rebuildingkoreaparty.kr/",
    leader: "공석 (조국 前 대표 2026-06-04 사퇴) — 신장식 권한대행",
    floorLeader: "김준형 (비례대표)",
    supremes: "신장식(권한대행·수석최고위원) — 차기 전당대회 2026-07-25 예정",
    supremesNote: "유동적",
    boards: [
      { label: "보도자료", url: "https://rebuildingkoreaparty.kr/news/press-release" },
      { label: "공지사항", url: "https://rebuildingkoreaparty.kr/news/notice" },
      { label: "경기도당 페이스북", url: "https://www.facebook.com/p/조국혁신당-경기도당-100065036857471/" }
    ]
  },
  {
    id: "ppp",
    name: "국민의힘",
    color: "#e61e2b",
    home: "https://www.peoplepowerparty.kr/",
    leader: "장동혁 (충남 보령시·서천군)",
    floorLeader: "정점식 (경남 통영시·고성군)",
    supremes: "신동욱(서울 서초구을), 김민수(원외), 양향자(원외), 김재원(원외), 우재준(대구 북구갑·청년최고위원)",
    supremesNote: "확정 (제6차 전대 2025-08-22)",
    boards: [
      { label: "대변인 논평", url: "https://www.peoplepowerparty.kr/news/comment/BBSDD0001" },
      { label: "대변인 브리핑", url: "https://www.peoplepowerparty.kr/renewal/news/briefing_delegate.do" },
      { label: "중앙당 홈", url: "https://www.peoplepowerparty.kr/" },
      { label: "경기도당 (visiongg)", url: "http://visiongg.com/" }
    ]
  },
  {
    id: "reform",
    name: "개혁신당",
    color: "#ff7920",
    home: "https://www.reformparty.kr/",
    leader: "이준석 (경기 화성시을)",
    floorLeader: "천하람 (비례대표)",
    supremes: "제2차 전당대회(2025-07-27) 선출 — 공식 명단 확인 필요",
    supremesNote: "확인 필요",
    boards: [
      { label: "공지사항", url: "https://www.reformparty.kr/notice" },
      { label: "중앙당 홈", url: "https://www.reformparty.kr/" }
    ]
  }
];

// ── 오늘의 브리핑 페이지 '소식 게시판 바로가기' 링크 (각 기관 공식 소식/보도자료 게시판) ──
// URL은 2026-07-06 각 기관 공식 사이트에서 접속 확인. 게시판이 바뀌면 여기만 고치면 됩니다.
window.BRIEF_BOARDS = [
  { name: "대통령실", color: "#1a4f8a", url: "https://www.president.go.kr/briefings" },
  { name: "정부 (국무총리실)", color: "#2e7d5b", url: "https://www.opm.go.kr/opm/news/press-release.do" },
  { name: "국회", color: "#6b5b95", url: "https://www.naon.go.kr/" },
  { name: "더불어민주당", color: "#0050a0", url: "https://theminjoo.kr/main/sub/news/list.php?brd=11&cate=105" },
  { name: "국민의힘", color: "#e61e2b", url: "https://www.peoplepowerparty.kr/news/comment/BBSDD0001" },
  { name: "조국혁신당", color: "#0073cf", url: "https://rebuildingkoreaparty.kr/news/press-release" },
  { name: "개혁신당", color: "#ff7920", url: "https://www.reformparty.kr/news/briefing" },
  { name: "경기도의회", color: "#0c4da2", url: "https://www.ggc.go.kr/site/main/xb/lwmkr/lawmakerpressrelease" },
  { name: "경기도청", color: "#0c4da2", url: "https://gnews.gg.go.kr/briefing/brief_gongbo.do" },
  { name: "경기도교육청", color: "#00843d", url: "https://www.goe.go.kr/goe/na/ntt/selectNttList.do?mi=10102&bbsId=1922" }
];

// ── 오늘의 브리핑 '기관별 소식'에 섹션으로 함께 노출할 경기 기관 (md의 ## 헤더명과 일치) ──
window.GG_ORGS = [
  { name: "경기도의회", color: "#0c4da2", home: "https://www.ggc.go.kr/site/main/xb/lwmkr/lawmakerpressrelease" },
  { name: "경기도청", color: "#0c4da2", home: "https://gnews.gg.go.kr/briefing/brief_gongbo.do" },
  { name: "경기도교육청", color: "#00843d", home: "https://www.goe.go.kr/goe/na/ntt/selectNttList.do?mi=10102&bbsId=1922" }
];

// ── 경기도 31개 시·군 (시장: 민선8기 현직 2022 / →표시는 2026-06-03 당선자 7-1 취임) ──
window.GYEONGGI = {
  name: "경기도",
  color: "#0c4da2",
  home: "https://www.gg.go.kr/",
  gov: "추미애 (민선9기·제37대)",
  govParty: "민",
  slogan: "다함께 시작, 당당한 경기",
  note: "권역 안에서 인구 많은 순. 인구는 행정안전부 주민등록인구 2026년 5월 기준(KOSIS), 면적·행정구역은 각 시군 공식·위키 기준. ‘→’ 뒤는 2026-06-03 당선자(7-1 취임), 바탕색=시장 소속 정당(파랑 더불어민주당·빨강 국민의힘). 슬로건은 공식 확인된 곳만 표기.",
  // 권역(남부/북부)으로 구분, 각 권역 내에서는 주민등록 인구 많은 순(행정안전부·경기통계 최신 기준)
  cities: [
    // ── 경기남부 (21) · 인구순(2026-05) ──
    { region: "남", name: "수원시", mayor: "이재준", pNow: "민", elect: "", pElect: "민", electTerm: 2, slogan: "수원을 새롭게, 시민을 빛나게", pop: 1186120, area: 121.0, gu: 4, eup: 0, myeon: 0, dong: 44, url: "https://www.suwon.go.kr/" },
    { region: "남", name: "용인시", mayor: "이상일", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "시민과 함께 완성하는 미래, 용인 르네상스 시즌2", pop: 1089693, area: 591.2, gu: 3, eup: 4, myeon: 3, dong: 32, url: "https://www.yongin.go.kr/" },
    { region: "남", name: "화성시", mayor: "정명근", pNow: "민", elect: "", pElect: "민", electTerm: 2, slogan: "모두의 행복, 더 큰 화성", pop: 997713, area: 700.0, gu: 4, eup: 4, myeon: 9, dong: 16, url: "https://www.hscity.go.kr/" },
    { region: "남", name: "성남시", mayor: "신상진", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "희망도시 성남", pop: 903747, area: 141.6, gu: 3, eup: 0, myeon: 0, dong: 50, url: "https://www.seongnam.go.kr/" },
    { region: "남", name: "부천시", mayor: "조용익", pNow: "민", elect: "", pElect: "민", electTerm: 2, slogan: "다시 함께, 더 큰 부천", pop: 756037, area: 53.4, gu: 3, eup: 0, myeon: 0, dong: 37, url: "https://www.bucheon.go.kr/" },
    { region: "남", name: "평택시", mayor: "정장선", pNow: "민", elect: "최원용", pElect: "민", electTerm: 1, slogan: "", pop: 618234, area: 458.1, gu: 0, eup: 4, myeon: 5, dong: 16, url: "https://www.pyeongtaek.go.kr/" },
    { region: "남", name: "안산시", mayor: "이민근", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "이음의 시정", pop: 609712, area: 155.2, gu: 2, eup: 0, myeon: 0, dong: 25, url: "https://www.ansan.go.kr/" },
    { region: "남", name: "안양시", mayor: "최대호", pNow: "민", elect: "", pElect: "민", electTerm: 4, slogan: "시민과 함께하는 스마트 행복도시 안양", pop: 562341, area: 58.5, gu: 2, eup: 0, myeon: 0, dong: 31, url: "https://www.anyang.go.kr/" },
    { region: "남", name: "시흥시", mayor: "임병택", pNow: "민", elect: "", pElect: "민", electTerm: 3, slogan: "행복한 변화, 새로운 시흥", pop: 514804, area: 139.1, gu: 0, eup: 0, myeon: 0, dong: 20, url: "https://www.siheung.go.kr/" },
    { region: "남", name: "김포시", mayor: "김병수", pNow: "국", elect: "이기형", pElect: "민", electTerm: 1, slogan: "시민과 함께 김포 대도약", pop: 484047, area: 276.6, gu: 0, eup: 3, myeon: 3, dong: 8, url: "https://www.gimpo.go.kr/" },
    { region: "남", name: "광주시", mayor: "방세환", pNow: "국", elect: "박관열", pElect: "민", electTerm: 1, slogan: "바로 통하는 나의 삶, 직통 광주", pop: 398250, area: 431.0, gu: 0, eup: 2, myeon: 4, dong: 10, url: "https://www.gjcity.go.kr/" },
    { region: "남", name: "하남시", mayor: "이현재", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "살고 싶은 도시, 도약하는 하남", pop: 327571, area: 93.1, gu: 0, eup: 0, myeon: 0, dong: 14, url: "https://www.hanam.go.kr/" },
    { region: "남", name: "광명시", mayor: "박승원", pNow: "민", elect: "", pElect: "민", electTerm: 3, slogan: "함께하는 시민, 웃는 광명", pop: 303479, area: 38.5, gu: 0, eup: 0, myeon: 0, dong: 19, url: "https://www.gm.go.kr/" },
    { region: "남", name: "오산시", mayor: "이권재", pNow: "국", elect: "조용호", pElect: "민", electTerm: 1, slogan: "시민과 함께 여는 성장도시 오산", pop: 252414, area: 42.7, gu: 0, eup: 0, myeon: 0, dong: 8, url: "https://www.osan.go.kr/" },
    { region: "남", name: "군포시", mayor: "하은호", pNow: "국", elect: "한대희", pElect: "민", electTerm: 2, slogan: "시민주권 군포", pop: 249770, area: 36.4, gu: 0, eup: 0, myeon: 0, dong: 12, url: "https://www.gunpo.go.kr/" },
    { region: "남", name: "이천시", mayor: "김경희", pNow: "국", elect: "성수석", pElect: "민", electTerm: 1, slogan: "미래가 모이는 도시 이천", pop: 223635, area: 461.4, gu: 0, eup: 2, myeon: 8, dong: 4, url: "https://www.icheon.go.kr/" },
    { region: "남", name: "안성시", mayor: "김보라", pNow: "민", elect: "", pElect: "민", electTerm: 3, slogan: "안성맞춤도시 안성", pop: 198631, area: 553.4, gu: 0, eup: 1, myeon: 11, dong: 3, url: "https://www.anseong.go.kr/" },
    { region: "남", name: "의왕시", mayor: "김성제", pNow: "국", elect: "", pElect: "국", electTerm: 4, slogan: "예스! 의왕 (YES! 의왕)", pop: 163071, area: 54.0, gu: 0, eup: 0, myeon: 0, dong: 6, url: "https://www.uiwang.go.kr/" },
    { region: "남", name: "양평군", mayor: "전진선", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "희망과 감동이 흐르는 매력양평", pop: 126746, area: 877.8, gu: 0, eup: 1, myeon: 11, dong: 0, url: "https://www.yp21.go.kr/" },
    { region: "남", name: "여주시", mayor: "이충우", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "시민과 함께 다시 뛰는 여주", pop: 113541, area: 608.3, gu: 0, eup: 1, myeon: 8, dong: 3, url: "https://www.yeoju.go.kr/" },
    { region: "남", name: "과천시", mayor: "신계용", pNow: "국", elect: "", pElect: "국", electTerm: 3, slogan: "시민이 만드는 행복도시 과천", pop: 80384, area: 35.9, gu: 0, eup: 0, myeon: 0, dong: 7, url: "https://www.gccity.go.kr/" },
    // ── 경기북부 (10) · 인구순(2026-05) ──
    { region: "북", name: "고양시", mayor: "이동환", pNow: "국", elect: "민경선", pElect: "민", electTerm: 1, slogan: "다시 뛰는 고양", pop: 1057471, area: 268.1, gu: 3, eup: 0, myeon: 0, dong: 44, url: "https://www.goyang.go.kr/" },
    { region: "북", name: "남양주시", mayor: "주광덕", pNow: "국", elect: "최현덕", pElect: "민", electTerm: 1, slogan: "시민주권시대 남양주 대전환", pop: 727717, area: 458.1, gu: 0, eup: 6, myeon: 3, dong: 7, url: "https://www.nyj.go.kr/" },
    { region: "북", name: "파주시", mayor: "김경일", pNow: "민", elect: "손배찬", pElect: "민", electTerm: 1, slogan: "평화도, 경제도, 파주로!", pop: 532124, area: 672.8, gu: 0, eup: 4, myeon: 9, dong: 10, url: "https://www.paju.go.kr/" },
    { region: "북", name: "의정부시", mayor: "김동근", pNow: "국", elect: "김원기", pElect: "민", electTerm: 1, slogan: "시민의 뜻으로, 새로운 의정부", pop: 461816, area: 81.5, gu: 0, eup: 0, myeon: 0, dong: 15, url: "https://www.ui4u.go.kr/" },
    { region: "북", name: "양주시", mayor: "강수현", pNow: "국", elect: "정덕영", pElect: "민", electTerm: 1, slogan: "시민주권 양주", pop: 296976, area: 310.4, gu: 0, eup: 1, myeon: 4, dong: 7, url: "https://www.yangju.go.kr/" },
    { region: "북", name: "구리시", mayor: "백경현", pNow: "국", elect: "신동화", pElect: "민", electTerm: 1, slogan: "즐거운 변화, 더 행복한 구리시", pop: 187463, area: 33.3, gu: 0, eup: 0, myeon: 0, dong: 8, url: "https://www.guri.go.kr/" },
    { region: "북", name: "포천시", mayor: "백영현", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "내 삶이 더 행복한 도시, 프라이드 포천", pop: 140464, area: 826.5, gu: 0, eup: 1, myeon: 11, dong: 2, url: "https://www.pocheon.go.kr/" },
    { region: "북", name: "동두천시", mayor: "박형덕", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "매일 활기찬 도시 동두천", pop: 86243, area: 95.7, gu: 0, eup: 0, myeon: 0, dong: 8, url: "https://www.ddc.go.kr/" },
    { region: "북", name: "가평군", mayor: "서태원", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "힐링과 행복, 하나되는 가평특별군", pop: 62044, area: 843.6, gu: 0, eup: 1, myeon: 5, dong: 0, url: "https://www.gp.go.kr/" },
    { region: "북", name: "연천군", mayor: "김덕현", pNow: "국", elect: "", pElect: "국", electTerm: 2, slogan: "담대한 도전, 새로운 연천", pop: 42868, area: 676.3, gu: 0, eup: 2, myeon: 8, dong: 0, url: "https://www.yeoncheon.go.kr/" }
  ]
};

// ── 경기도교육청 산하 25개 교육지원청 ──
window.GYEONGGI_EDU = {
  name: "경기도교육청",
  color: "#00843d",
  home: "https://www.goe.go.kr/",
  superintendent: "안민석 (민선9기 교육감)",
  slogan: "경기교육 대전환, 크게 제대로!",
  note: "경기도교육청 산하 교육지원청 25곳입니다. 일부는 2개 시·군을 묶은 통합 교육지원청입니다.",
  offices: [
    { name: "가평교육지원청", url: "https://www.goegp.kr/" },
    { name: "고양교육지원청", url: "https://www.goegy.kr/" },
    { name: "광명교육지원청", url: "https://www.goegm.kr/" },
    { name: "광주하남교육지원청", url: "https://www.goegh.kr/" },
    { name: "구리남양주교육지원청", url: "https://www.goegn.kr/" },
    { name: "군포의왕교육지원청", url: "https://www.goegu.kr/" },
    { name: "김포교육지원청", url: "https://www.gpoe.kr/" },
    { name: "동두천양주교육지원청", url: "https://www.goedy.kr/" },
    { name: "부천교육지원청", url: "https://www.goebc.kr/" },
    { name: "성남교육지원청", url: "https://www.goesn.kr/" },
    { name: "수원교육지원청", url: "https://www.goesw.kr/" },
    { name: "시흥교육지원청", url: "https://www.goesh.kr/" },
    { name: "안산교육지원청", url: "https://www.goeas.kr/" },
    { name: "안성교육지원청", url: "https://www.goean.kr/" },
    { name: "안양과천교육지원청", url: "https://www.goeay.kr/" },
    { name: "양평교육지원청", url: "https://www.goeyp.kr/" },
    { name: "여주교육지원청", url: "https://www.goeyj.kr/" },
    { name: "연천교육지원청", url: "https://www.goeyc.kr/" },
    { name: "용인교육지원청", url: "https://www.goeyi.kr/" },
    { name: "의정부교육지원청", url: "https://www.goeujb.kr/" },
    { name: "이천교육지원청", url: "https://www.goeic.kr/" },
    { name: "파주교육지원청", url: "https://www.goepj.kr/" },
    { name: "평택교육지원청", url: "https://www.goept.kr/" },
    { name: "포천교육지원청", url: "https://www.goepc.kr/" },
    { name: "화성오산교육지원청", url: "https://www.goehs.kr/" }
  ]
};

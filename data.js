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
  home: "https://www.gov.kr/",
  pm: "김민석 (국무총리, 2025-07-03 취임)",
  pmLoc: "세종",
  note: "정부조직 개편 반영: 기획재정부 → 재정경제부+기획예산처 / 환경부 → 기후에너지환경부 / 여성가족부 → 성평등가족부 / 산업통상자원부 → 산업통상부. 개각 진행 중이라 일부 장관·소재지는 바뀔 수 있습니다.",
  // 부처는 아니지만 총리를 보좌하는 핵심 사무기구 — 부처 목록 위에 별도 카드로 표시
  pmOffices: [
    { dept: "국무조정실·국무총리비서실", role: "정부 정책 조정·총괄 / 국무총리 보좌 (한 누리집 운영)", loc: "세종", url: "https://www.opm.go.kr/" }
  ],
  ministers: [
    { dept: "재정경제부", name: "구윤철", prev: "前 국무조정실장", loc: "세종", since: "2026-01-02", vice: "이형일(1차관)·임기근(2차관)", url: "https://www.moef.go.kr/nw/nes/nesdtaList.do" },
    { dept: "기획예산처", name: "박홍근", prev: "더불어민주당 의원·前 원내대표", loc: "세종", since: "2026-03-25", url: "https://www.korea.kr/briefing/pressReleaseList.do" },
    { dept: "과학기술정보통신부", name: "배경훈", prev: "前 LG AI연구원장", loc: "세종", since: "2025-10-01", url: "https://www.msit.go.kr/bbs/list.do?sCode=user&mPid=112&mId=113" },
    { dept: "교육부", name: "최교진", prev: "前 세종특별자치시교육감", loc: "세종", since: "2025-10-01", url: "https://www.moe.go.kr/boardCnts/listRenew.do?boardID=294&m=020402&s=moe" },
    { dept: "외교부", name: "조현", prev: "前 외교부 제1차관", loc: "서울", since: "2025-07-18", vice: "박윤주(1차관)·김진아(2차관)", url: "https://www.mofa.go.kr/www/brd/m_4080/list.do" },
    { dept: "통일부", name: "정동영", prev: "前 통일부 장관·5선 의원", loc: "서울", since: "2025-07-25", url: "https://www.unikorea.go.kr/unikorea/news/release/" },
    { dept: "법무부", name: "정성호", prev: "더불어민주당 5선 의원", loc: "과천", since: "2025-07-18", url: "https://www.moj.go.kr/moj/221/subview.do" },
    { dept: "국방부", name: "안규백", prev: "더불어민주당 의원·前 국회 국방위원장", loc: "서울(용산)", since: "2025-07-25", url: "https://www.mnd.go.kr/cop/kookbangNews/kookbangNewsList.do?siteId=mnd&id=mnd_020500000000" },
    { dept: "행정안전부", name: "윤호중", prev: "더불어민주당 5선 의원·前 원내대표", loc: "세종", since: "2025-07-19", url: "https://www.mois.go.kr/frt/bbs/type010/commonSelectBoardList.do?bbsId=BBSMSTR_000000000008" },
    { dept: "국가보훈부", name: "권오을", prev: "前 국회사무총장", loc: "세종", since: "2025-07-25", url: "https://www.mpva.go.kr/mpva/selectBbsNttList.do?bbsNo=10&key=292" },
    { dept: "문화체육관광부", name: "최휘영", prev: "前 네이버 대표·관광기업 경영인", loc: "세종", since: "2025-07-31", url: "https://www.mcst.go.kr/kor/s_notice/press/pressList.jsp" },
    { dept: "농림축산식품부", name: "송미령", prev: "유임(前 농림축산식품부 장관)", loc: "세종", since: "유임", url: "https://www.mafra.go.kr/home/5108/subview.do" },
    { dept: "산업통상부", name: "김정관", prev: "前 두산에너빌리티 사장·前 기획재정부 정책기획관", loc: "세종", since: "2025-10-01", vice: "문신학(1차관)·여한구(통상교섭본부장)", url: "https://www.motie.go.kr/kor/article/ATCLba6cefc8c/list" },
    { dept: "보건복지부", name: "정은경", prev: "前 질병관리청장", loc: "세종", since: "2025-07-21", url: "https://www.mohw.go.kr/board.es?mid=a10503000000&bid=0027" },
    { dept: "기후에너지환경부", name: "김성환", prev: "더불어민주당 의원", loc: "세종", since: "2025-10-01", url: "https://me.go.kr/home/web/board/list.do?menuId=10525&boardMasterId=1" },
    { dept: "고용노동부", name: "김영훈", prev: "前 민주노총 위원장(철도 기관사 출신)", loc: "세종", since: "2025-07-21", url: "https://www.moel.go.kr/news/enews/report/enewsList.do" },
    { dept: "성평등가족부", name: "원민경", prev: "前 민변 여성인권위원장·여성·소수자 인권 변호사", loc: "서울", since: "2025-10-01", url: "https://www.mogef.go.kr/nw/enw/nw_enw_s001.do" },
    { dept: "국토교통부", name: "김윤덕", prev: "더불어민주당 의원", loc: "세종", since: "2025-07-31", url: "https://www.molit.go.kr/USR/NEWS/m_71/lst.jsp" },
    { dept: "해양수산부", name: "황종우", prev: "前 해양수산부 기획조정실장(행시 38회)", loc: "세종(부산 이전 추진)", since: "2026-03-25", url: "https://www.mof.go.kr/doc/ko/selectDocList.do?menuSeq=971&bbsSeq=10" },
    { dept: "중소벤처기업부", name: "한성숙", prev: "前 네이버 대표이사", loc: "세종", since: "2025-07-23", url: "https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=86" }
  ],
  boards: [
    { label: "정부24", url: "https://www.gov.kr/" },
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
  // 17개 상임위원회. 후반기 위원장은 원구성 협상 중이라 대부분 미확정
  committeesNote: "22대 후반기 상임위원장은 원구성 협상 중(2026-06-18 시한)이라 대부분 미확정. 확정되는 대로 채워집니다.",
  committees: [
    "국회운영위원회", "법제사법위원회", "정무위원회", "기획재정위원회",
    "교육위원회", "과학기술정보방송통신위원회", "외교통일위원회", "국방위원회",
    "행정안전위원회", "문화체육관광위원회", "농림축산식품해양수산위원회",
    "산업통상자원중소벤처기업위원회", "보건복지위원회", "환경노동위원회",
    "국토교통위원회", "정보위원회", "여성가족위원회"
  ],
  // 교섭단체(의석 20석 이상). 대표=원내대표, 부대표=원내수석부대표
  negoBlocs: [
    { party: "더불어민주당", rep: "한병도 (원내대표)", deputy: "확인 필요 (원내수석부대표)" },
    { party: "국민의힘", rep: "정점식 (원내대표)", deputy: "확인 필요 (원내수석부대표)" }
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

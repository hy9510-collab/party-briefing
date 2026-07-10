// ── 17개 광역시·도 조직 (제9회 전국동시지방선거 2026-06-03 결과 / 2026-07-01 취임) ──
// ※ 광주광역시 + 전라남도는 2026-07-01 '전남광주통합특별시'로 통합(특별법 제21446호, 40년 만의 재통합)
//    → 광역단체가 17개에서 16개로 재편되었습니다.
// 데이터 기준: 시·도지사·교육감·의회 원구성은 지역 언론 및 각 의회 공식 보도 교차확인.
//   정당 코드: 민=더불어민주당, 국=국민의힘, 조국=조국혁신당, 진=진보당, 무=무소속.
//   교육감은 정당이 없는 선출직이라 색을 넣지 않습니다.
//   일부 미확정 항목(부산 제2부의장·강원 부의장·전남광주통합 공식 홈 등)은 '확인 중'으로 표기.
window.METRO = [
  { name: "서울특별시", home: "https://www.seoul.go.kr", gov: "오세훈", govP: "국",
    edu: "정근식", eduUrl: "https://www.sen.go.kr",
    council: { name: "서울특별시의회", home: "https://www.smc.seoul.kr", chair: ["임만균", "민"],
      vice: [["성흠제", "민"], ["이성배", "국"]], committees: 11, seats: { 민: 80, 국: 38 } } },

  { name: "부산광역시", home: "https://www.busan.go.kr", gov: "전재수", govP: "민",
    edu: "김석준", eduUrl: "https://www.pen.go.kr",
    council: { name: "부산광역시의회", home: "https://council.busan.go.kr", chair: ["강무길", "국"],
      vice: [["송상조", "국"]], viceNote: "제2부의장 선출 예정", committees: 7, seats: { 국: 37, 민: 11 } } },

  { name: "대구광역시", home: "https://www.daegu.go.kr", gov: "추경호", govP: "국",
    edu: "강은희", eduUrl: "https://www.dge.go.kr",
    council: { name: "대구광역시의회", home: "https://council.daegu.go.kr", chair: ["임인환", "국"],
      vice: [["이태손", "국"], ["김재용", "국"]], committees: 6, seats: { 국: 34, 민: 2 } } },

  { name: "인천광역시", home: "https://www.incheon.go.kr", gov: "박찬대", govP: "민",
    edu: "도성훈", eduUrl: "https://www.ice.go.kr",
    council: { name: "인천광역시의회", home: "https://www.icouncil.go.kr", chair: ["박종혁", "민"],
      vice: [["이순학", "민"], ["윤재상", "국"]], committees: 6, seats: { 민: 38, 국: 7 } } },

  { name: "대전광역시", home: "https://www.daejeon.go.kr", gov: "허태정", govP: "민",
    edu: "오석진", eduUrl: "https://www.dje.go.kr",
    council: { name: "대전광역시의회", home: "https://council.daejeon.go.kr", chair: ["조성칠", "민"],
      vice: [["김영미", "민"], ["류수열", "민"]], committees: 5, seats: { 민: 20, 국: 2 } } },

  { name: "울산광역시", home: "https://www.ulsan.go.kr", gov: "김상욱", govP: "민",
    edu: "조용식", eduUrl: "https://www.use.go.kr",
    council: { name: "울산광역시의회", home: "https://www.council.ulsan.kr", chair: ["이영해", "국"],
      vice: [["홍성우", "국"], ["손근호", "민"]], committees: 5, seats: { 국: 15, 민: 6, 진: 1 } } },

  { name: "세종특별자치시", home: "https://www.sejong.go.kr", gov: "조상호", govP: "민",
    edu: "강미애", eduUrl: "https://www.sje.go.kr",
    council: { name: "세종특별자치시의회", home: "https://council.sejong.go.kr", chair: ["안신일", "민"],
      vice: [["유인호", "민"], ["김학서", "국"]], committees: 5, seats: { 민: 18, 국: 3 } } },

  { name: "경기도", home: "https://www.gg.go.kr", gov: "추미애", govP: "민",
    edu: "안민석", eduUrl: "https://www.goe.go.kr",
    council: { name: "경기도의회", home: "https://www.ggc.go.kr", chair: ["남종섭", "민"],
      vice: [["고은정", "민"], ["김미숙", "민"]], committees: 13, seats: { 민: 144, 국: 22, 조국: 1 } } },

  { name: "강원특별자치도", home: "https://state.gwd.go.kr", gov: "우상호", govP: "민",
    edu: "강삼영", eduUrl: "https://www.gwe.go.kr",
    council: { name: "강원특별자치도의회", home: "https://council.gangwon.kr", chair: ["김시성", "국"],
      vice: [], viceNote: "부의장 명단 확인 중", committees: 6, seats: { 국: 30, 민: 24 } } },

  { name: "충청북도", home: "https://www.chungbuk.go.kr", gov: "신용한", govP: "민",
    edu: "윤건영", eduUrl: "https://www.cbe.go.kr",
    council: { name: "충청북도의회", home: "https://council.chungbuk.kr", chair: ["이상식", "민"],
      vice: [["심기보", "민"], ["이태훈", "국"]], committees: 6, seats: { 민: 27, 국: 11 } } },

  { name: "충청남도", home: "https://www.chungnam.go.kr", gov: "박수현", govP: "민",
    edu: "이병도", eduUrl: "https://www.cne.go.kr",
    council: { name: "충청남도의회", home: "https://council.chungnam.go.kr", chair: ["조철기", "민"],
      vice: [["장승재", "민"], ["박기영", "국"]], committees: 7, seats: { 민: 33, 국: 17 } } },

  { name: "전북특별자치도", home: "https://www.jeonbuk.go.kr", gov: "이원택", govP: "민",
    edu: "천호성", eduUrl: "https://www.jbe.go.kr",
    council: { name: "전북특별자치도의회", home: "https://www.jbstatecouncil.jeonbuk.kr", chair: ["김희수", "민"],
      vice: [["이병도", "민"], ["박정규", "민"]], committees: 6, seats: { 민: 42, 국: 1, 진: 1 } } },

  { name: "전남광주통합특별시", home: "", gov: "민형배", govP: "민",
    edu: "김대중", eduUrl: "",
    note: "2026-07-01 광주광역시와 전라남도가 통합해 출범(특별법 제21446호). 인구 약 316만. 공식 홈페이지·통합의회 세부는 확인 중.",
    council: { name: "전남광주통합특별시의회", home: "", chair: ["송형곤", "민"],
      vice: [["조석호", "민"], ["김문수", "민"]], committees: 11, seats: { 민: 83, 진: 5, 조국: 2, 국: 1 } } },

  { name: "경상북도", home: "https://www.gb.go.kr", gov: "이철우", govP: "국",
    edu: "임종식", eduUrl: "https://www.gbe.kr",
    council: { name: "경상북도의회", home: "https://council.gb.go.kr", chair: ["김희수", "국"],
      vice: [["이춘우", "국"], ["박순범", "국"]], committees: 7, seats: { 국: 58, 민: 3, 무: 3 } } },

  { name: "경상남도", home: "https://www.gyeongnam.go.kr", gov: "박완수", govP: "국",
    edu: "권순기", eduUrl: "https://www.gne.go.kr",
    council: { name: "경상남도의회", home: "https://council.gsnd.net", chair: ["박준", "국"],
      vice: [["신종철", "국"], ["이찬호", "국"]], committees: 7, seats: { 국: 44, 민: 23, 무: 1 } } },

  { name: "제주특별자치도", home: "https://www.jeju.go.kr", gov: "위성곤", govP: "민",
    edu: "고의숙", eduUrl: "https://www.jje.go.kr",
    council: { name: "제주특별자치도의회", home: "https://www.council.jeju.kr", chair: ["송영훈", "민"],
      vice: [["김승준", "민"], ["김황국", "국"]], committees: 8, seats: { 민: 34, 국: 8, 진: 1, 조국: 1, 무: 1 } } }
];

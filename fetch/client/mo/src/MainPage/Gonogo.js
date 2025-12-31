// src/MainPage/Gonogo.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainNab } from '../MainPage/MainPage';
import './Gonogo.css'

const Gonogo = () => {
 // regionsData.js (이제 RegionSelectBar.js 내부에 통합될 내용)
const regionsData = [
  {
    name: "전국",
    value: "all",
    subRegions: [{ name: "전체 구", value: "all-gu", dongs: [{ name: "전체 동", value: "all-dong" }] }]
  },
  {
    name: "서울특별시",
    value: "seoul",
    subRegions: [
      { name: "전체 구", value: "seoul-all-gu", dongs: [{ name: "전체 동", value: "seoul-all-dong" }] },
      {
        name: "강남구",
        value: "gangnam",
        dongs: [
          { name: "전체 동", value: "gangnam-all-dong" },
          { name: "개포동", value: "gaepo-dong" },
          { name: "논현동", value: "nonhyeon-dong" },
          { name: "대치동", value: "daechi-dong" },
          { name: "도곡동", value: "dogok-dong" },
          { name: "삼성동", value: "samseong-dong" },
          { name: "신사동", value: "sinsa-dong" },
          { name: "압구정동", value: "apgujeong-dong" },
          { name: "역삼동", value: "yeoksam-dong" },
          { name: "청담동", value: "cheongdam-dong" }
        ]
      },
      { name: "마포구", value: "mapo", dongs: [{ name: "전체 동", value: "mapo-all-dong" }, { name: "공덕동", value: "gongdeok-dong" }, { name: "상암동", value: "sangam-dong" }] },
      // ... 서울의 다른 구/동도 필요시 추가
    ]
  },
  {
    name: "대구광역시",
    value: "daegu",
    subRegions: [
      { name: "전체 구", value: "daegu-all-gu", dongs: [{ name: "전체 동", value: "daegu-all-dong" }] },
      { name: "중구", value: "jung-gu-daegu", dongs: [{ name: "전체 동", value: "jung-gu-daegu-all-dong" }, { name: "동성로1가", value: "dongseongro1ga" }, { name: "반월당", value: "banwoldang" }] },
      { name: "동구", value: "dong-gu-daegu", dongs: [{ name: "전체 동", value: "dong-gu-daegu-all-dong" }, { name: "신암동", value: "sinam-dong" }, { name: "지저동", value: "jijeo-dong" }] },
      { name: "서구", value: "seo-gu-daegu", dongs: [{ name: "전체 동", value: "seo-gu-daegu-all-dong" }, { name: "평리동", value: "pyeongni-dong" }, { name: "비산동", value: "bisan-dong" }] },
      { name: "남구", value: "nam-gu-daegu", dongs: [{ name: "전체 동", value: "nam-gu-daegu-all-dong" }, { name: "대명동", value: "daemyeong-dong" }, { name: "봉덕동", value: "bongdeok-dong" }] },
      {
        name: "북구", // 윤여원님 계신 북구 동들입니다!
        value: "buk-gu-daegu",
        dongs: [
          { name: "전체 동", value: "buk-gu-daegu-all-dong" },
          { name: "고성동", value: "goseong-dong" }, { name: "노곡동", value: "nogok-dong" }, { name: "노원동", value: "nowon-dong" },
          { name: "대현동", value: "daehyeon-dong" }, { name: "도남동", value: "donam-dong" }, { name: "동변동", value: "dongbyeon-dong" },
          { name: "동천동", value: "dongcheon-dong" }, { name: "복현동", value: "bokhyeon-dong" }, { name: "산격동", value: "sangyeok-dong" },
          { name: "서변동", value: "seobyeon-dong" }, { name: "읍내동", value: "eupnae-dong" }, { name: "연경동", value: "yeonngyeong-dong" },
          { name: "조야동", value: "joya-dong" }, { name: "칠성동", value: "chilsung-dong" }, { name: "침산동", value: "chimsan-dong" },
          { name: "태전동", value: "taejeon-dong" }, { name: "학정동", value: "hakjeong-dong" }, { name: "국우동", value: "gukwu-dong" },
          { name: "관음동", value: "gwanum-dong" }, { name: "구암동", value: "guam-dong" }, { name: "금호동", value: "geumho-dong" },
          { name: "팔달동", value: "paldal-dong" }, { name: "사수동", value: "sasu-dong" },
          // ... 더 많은 동을 추가할 수 있습니다.
        ]
      },
      { name: "수성구", value: "suseong-gu", dongs: [{ name: "전체 동", value: "suseong-gu-all-dong" }, { name: "범어동", value: "beomeo-dong" }, { name: "황금동", value: "hwanggeum-dong" }] },
      { name: "달서구", value: "dalseo-gu", dongs: [{ name: "전체 동", value: "dalseo-gu-all-dong" }, { name: "상인동", value: "sangin-dong" }, { name: "월성동", value: "wolseong-dong" }] },
      { name: "달성군", value: "dalseong", dongs: [{ name: "전체 동", value: "dalseong-all-dong" }, { name: "화원읍", value: "hwawon-eup" }, { name: "다사읍", value: "dasa-eup" }] },
      { name: "군위군", value: "gunwi", dongs: [{ name: "전체 동", value: "gunwi-all-dong" }, { name: "군위읍", value: "gunwi-eup" }] }
    ]
  },
  {
    name: "인천광역시",
    value: "incheon",
    subRegions: [
      { name: "전체 구", value: "incheon-all-gu", dongs: [{ name: "전체 동", value: "incheon-all-dong" }] },
      { name: "부평구", value: "bupyeong", dongs: [{ name: "전체 동", value: "bupyeong-all-dong" }, { name: "부평동", value: "bupyeong-dong" }, { name: "산곡동", value: "sangok-dong" }] },
      // ... 다른 구/동 추가
    ]
  },
  {
    name: "경기도",
    value: "gyeonggi",
    subRegions: [
      { name: "전체", value: "gyeonggi-all-gu", dongs: [{ name: "전체 동", value: "gyeonggi-all-dong" }] },
      { name: "수원시", value: "suwon", dongs: [{ name: "전체 동", value: "suwon-all-dong" }, { name: "팔달구", value: "paldal-gu-suwon" }] },
      // ...
    ]
  },
  {
    name: "제주특별자치도",
    value: "jeju",
    subRegions: [
      { name: "전체", value: "jeju-all-gu", dongs: [{ name: "전체 동", value: "jeju-all-dong" }] },
      { name: "제주시", value: "jeju-city", dongs: [{ name: "전체 동", value: "jeju-city-all-dong" }, { name: "연동", value: "yeon-dong" }, { name: "노형동", value: "nohyeong-dong" }] },
      { name: "서귀포시", value: "seogwipo", dongs: [{ name: "전체 동", value: "seogwipo-all-dong" }, { name: "서귀동", value: "seogwi-dong" }] }
    ]
  }
  // 다른 시/도는 예시를 위해 최소한으로만 포함했습니다.
  // 필요에 따라 광역시/도 및 그 안의 구/군/동을 추가할 수 있습니다.
];
    // 지역 선택 상태
  const [selectedMainRegionValue, setSelectedMainRegionValue] = useState("all");
  const [selectedSubRegionValue, setSelectedSubRegionValue] = useState("all-gu");
  const [selectedDongValue, setSelectedDongValue] = useState("all-dong");

  // 메뉴 확장 상태 (어떤 메뉴가 펼쳐져 있는지)
  const [expandedMainRegionValue, setExpandedMainRegionValue] = useState(null); // 시/도 펼침
  const [expandedSubRegionValue, setExpandedSubRegionValue] = useState(null); // 구/군 펼침

  // --- 이벤트 핸들러 ---
  const handleMainRegionClick = (mainRegion) => {
    // 이미 펼쳐진 시/도를 다시 클릭하면 닫히도록 토글
    setExpandedMainRegionValue(prev => prev === mainRegion.value ? null : mainRegion.value);
    setExpandedSubRegionValue(null); // 대분류 변경 시 소분류 펼침 상태 초기화

    // 선택된 값 업데이트
    setSelectedMainRegionValue(mainRegion.value);
    setSelectedSubRegionValue(mainRegion.subRegions[0].value); // 해당 시/도의 '전체 구'로 기본 선택
    setSelectedDongValue(mainRegion.subRegions[0].dongs[0].value); // 해당 시/도의 '전체 동'으로 기본 선택

    // TODO: 부모 컴포넌트에 선택 값 전달 (필요시)
    // onRegionSelected(mainRegion.value, mainRegion.subRegions[0].value, mainRegion.subRegions[0].dongs[0].value);
  };

  const handleSubRegionClick = (subRegion) => {
    // 이미 펼쳐진 구/군을 다시 클릭하면 닫히도록 토글
    setExpandedSubRegionValue(prev => prev === subRegion.value ? null : subRegion.value);

    // 선택된 값 업데이트
    setSelectedSubRegionValue(subRegion.value);
    setSelectedDongValue(subRegion.dongs[0].value); // 해당 구/군의 '전체 동'으로 기본 선택

    // TODO: 부모 컴포넌트에 선택 값 전달 (필요시)
    // const mainRegion = regionsData.find(r => r.subRegions.some(sr => sr.value === subRegion.value));
    // onRegionSelected(mainRegion.value, subRegion.value, subRegion.dongs[0].value);
  };

  const handleDongClick = (dong) => {
    setSelectedDongValue(dong.value); // 선택된 동 업데이트
    setExpandedMainRegionValue(null); // 동까지 선택되면 모든 메뉴 닫기
    setExpandedSubRegionValue(null);

    // TODO: 부모 컴포넌트에 선택 값 전달 (필요시)
    // const mainRegion = regionsData.find(r => r.subRegions.some(sr => sr.dongs.some(d => d.value === dong.value)));
    // const subRegion = mainRegion.subRegions.find(sr => sr.dongs.some(d => d.value === dong.value));
    // onRegionSelected(mainRegion.value, subRegion.value, dong.value);
  };

  // --- 현재 선택된 지역을 웹에 표시하는 함수 ---
  const getSelectedRegionDisplayName = () => {
    const main = regionsData.find(r => r.value === selectedMainRegionValue);
    if (!main) return "지역을 선택해주세요.";

    const sub = main.subRegions.find(sr => sr.value === selectedSubRegionValue);
    const dong = sub?.dongs.find(d => d.value === selectedDongValue);

    let display = main.name;

    if (sub && sub.value !== "all-gu" && sub.value !== main.value + "-all-gu") { // '전체 구'가 아니면 구/군 이름 추가
      display += ` > ${sub.name}`;
      if (dong && dong.value !== "all-dong" && dong.value !== sub.value + "-all-dong") { // '전체 동'이 아니면 동 이름 추가
        display += ` > ${dong.name}`;
      } else if (sub.dongs.length > 1) { // 해당 구에 동이 여러개 있다면 '전체 동' 표시
        display += ` > ${sub.dongs[0].name}`;
      }
    } else if (main.subRegions.length > 1) { // 해당 시/도에 구/군이 여러개 있다면 '전체 구' 표시
      display += ` > ${main.subRegions[0].name}`;
    }

    return display;
  };

    // 1. 구인글 데이터를 저장할 state
    const [allJobPostings, setAllJobPostings] = useState([]); // 모든 구인글 데이터
    const [currentJobPostings, setCurrentJobPostings] = useState([]); // 현재 페이지에 보여줄 구인글 데이터
    const [isLoading, setIsLoading] = useState(true);

    // 2. 페이지네이션 관련 state
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (기본값 1)
    const itemsPerPage = 20; // 한 페이지에 보여줄 아이템 수 (4열 * 5행 = 20개)

    useEffect(() => {
        // ✨ Mock Data: 20개 이상이 되어 페이지네이션 테스트를 할 수 있도록 더 많은 데이터를 추가합니다.
        const mockJobPostings = [
            { id: 1, companyName: "행복베이커리", jobTitle: "새벽 베이커리 포장/정리 알바", location: "대구광역시 북구", wage: "시급 11,000원", workType: "단기/평일/8시간", postedDate: "방금 전", views: 245 },
            { id: 2, companyName: "스터디카페 고요", jobTitle: "주말 마감 매니저", location: "대구광역시 동구", wage: "시급 10,500원", workType: "주말/파트타임", postedDate: "1일 전", views: 567 },
            { id: 3, companyName: "피자나라 치킨공주", jobTitle: "배달 라이더 모집", location: "대구광역시 달서구", wage: "월 280만원 이상", workType: "정규직/배달", postedDate: "3일 전", views: 890 },
            { id: 4, companyName: "XYZ 키즈카페", jobTitle: "어린이 놀이 보조 선생님", location: "대구광역시 수성구", wage: "시급 12,000원", workType: "평일/오후", postedDate: "5일 전", views: 312 },
            { id: 5, companyName: "스마트 PC방", jobTitle: "야간 카운터 및 관리", location: "대구광역시 서구", wage: "시급 10,000원", workType: "평일/야간", postedDate: "1주 전", views: 180 },
            { id: 6, companyName: "우리동네 빨래방", jobTitle: "셀프빨래방 관리 및 청소", location: "대구광역시 중구", wage: "시급 9,860원", workType: "주 2회", postedDate: "2일 전", views: 95 },
            { id: 7, companyName: "꽃보다 꽃집", jobTitle: "꽃다발 제작 및 배달", location: "대구광역시 남구", wage: "시급 10,500원", workType: "평일/풀타임", postedDate: "4일 전", views: 300 },
            { id: 8, companyName: "맘스키친", jobTitle: "급식 보조 조리원", location: "대구광역시 북구", wage: "시급 11,500원", workType: "단기/평일/점심", postedDate: "6일 전", views: 400 },
            { id: 9, companyName: "프렌즈 서점", jobTitle: "책 정리 및 고객 응대", location: "대구광역시 수성구", wage: "시급 10,000원", workType: "주말", postedDate: "2주 전", views: 150 },
            { id: 10, companyName: "하이마트", jobTitle: "가전제품 판매 보조", location: "대구광역시 동구", wage: "시급 13,000원", workType: "주말/특별행사", postedDate: "1일 전", views: 500 },
            { id: 11, companyName: "모던 카페", jobTitle: "오전 바리스타 및 홀 서빙", location: "대구광역시 중구", wage: "시급 11,000원", workType: "평일/오전", postedDate: "3일 전", views: 280 },
            { id: 12, companyName: "굿모닝 마트", jobTitle: "물류 및 진열 관리", location: "대구광역시 북구", wage: "시급 10,500원", workType: "평일/종일", postedDate: "5일 전", views: 320 },
            { id: 13, companyName: "미스터 피자", jobTitle: "주방 보조", location: "대구광역시 달서구", wage: "시급 10,000원", workType: "주말/저녁", postedDate: "1일 전", views: 450 },
            { id: 14, companyName: "크린토피아", jobTitle: "세탁물 접수 및 포장", location: "대구광역시 서구", wage: "시급 9,900원", workType: "평일/오후", postedDate: "2일 전", views: 110 },
            { id: 15, companyName: "더조은 학원", jobTitle: "학원 차량 도우미", location: "대구광역시 남구", wage: "시급 12,000원", workType: "평일/등하원", postedDate: "4일 전", views: 90 },
            { id: 16, companyName: "드림 독서실", jobTitle: "총무 및 시설 관리", location: "대구광역시 수성구", wage: "월 200만원", workType: "정규직", postedDate: "3주 전", views: 600 },
            { id: 17, companyName: "명문 골프연습장", jobTitle: "연습장 안내 및 용품 정리", location: "대구광역시 동구", wage: "시급 11,500원", workType: "주말/오후", postedDate: "6일 전", views: 170 },
            { id: 18, companyName: "파워 헬스클럽", jobTitle: "회원 관리 및 청결 유지", location: "대구광역시 북구", wage: "시급 10,000원", workType: "평일/오전", postedDate: "1일 전", views: 220 },
            { id: 19, companyName: "에이스 당구장", jobTitle: "카운터 및 테이블 정리", location: "대구광역시 중구", wage: "시급 9,860원", workType: "평일/저녁", postedDate: "2일 전", views: 70 },
            { id: 20, companyName: "나눔 복지관", jobTitle: "어르신 식사 배식 도우미", location: "대구광역시 남구", wage: "봉사활동", workType: "평일/점심", postedDate: "5일 전", views: 50 },
            { id: 21, companyName: "우리동네 공원", jobTitle: "환경 미화원 보조", location: "대구광역시 서구", wage: "일급 80,000원", workType: "단기/오전", postedDate: "1일 전", views: 30 },
            { id: 22, companyName: "IT 스타트업", jobTitle: "사무 보조 및 자료 입력", location: "대구광역시 수성구", wage: "시급 12,000원", workType: "평일/파트", postedDate: "3일 전", views: 120 },
            { id: 23, companyName: "초록 은행", jobTitle: "은행 ATM 관리 및 순회", location: "대구광역시 동구", wage: "시급 11,000원", workType: "주말/종일", postedDate: "4일 전", views: 90 },
            { id: 24, companyName: "건강 약국", jobTitle: "약국 정리 및 재고 관리", location: "대구광역시 중구", wage: "시급 10,500원", workType: "평일/오후", postedDate: "5일 전", views: 150 },
            { id: 25, companyName: "행복 어린이집", jobTitle: "등원/하원 도우미", location: "대구광역시 북구", wage: "시급 11,800원", workType: "평일/짧은 시간", postedDate: "1주 전", views: 80 },
        ];

        setTimeout(() => {
            setAllJobPostings(mockJobPostings); // 전체 데이터 저장
            setIsLoading(false);
        }, 500);
    }, []);

    // 3. 페이지가 변경될 때마다 현재 페이지에 보여줄 아이템을 계산
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentJobPostings(allJobPostings.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, allJobPostings]); // currentPage나 allJobPostings가 변경될 때마다 실행

    // 4. 총 페이지 수 계산
    const totalPages = Math.ceil(allJobPostings.length / itemsPerPage);

    // 5. 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // 페이지 상단으로 스크롤 이동 (사용자 편의성)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 6. 페이지 번호 배열 생성 (예: 1, 2, 3...)
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <body className='Mainbody'>
            <MainNab />
    <div className="region-select-bar-container">
      <div className="selected-region-display">
        현재 선택: <strong>{getSelectedRegionDisplayName()}</strong>
      </div>

      <div className="region-filter-bar">
        <h3>지역 선택</h3>
        <div className="region-list-container">
          {regionsData.map((mainRegion) => (
            <div key={mainRegion.value} className="main-region-item">
              <button
                className={`main-region-button ${selectedMainRegionValue === mainRegion.value ? 'active' : ''}`}
                onClick={() => handleMainRegionClick(mainRegion)}
              >
                {mainRegion.name}
              </button>
              {/* 시/도 하위의 구/군 목록 표시 (expandedMainRegionValue에 따라) */}
              {expandedMainRegionValue === mainRegion.value && mainRegion.subRegions && mainRegion.subRegions.length > 0 && (
                <div className="sub-region-list">
                  {mainRegion.subRegions.map((subRegion) => (
                    <div key={subRegion.value} className="sub-region-item">
                      <button
                        className={`sub-region-button ${selectedSubRegionValue === subRegion.value ? 'active' : ''}`}
                        onClick={() => handleSubRegionClick(subRegion)}
                      >
                        {subRegion.name}
                      </button>
                      {/* 구/군 하위의 동 목록 표시 (expandedSubRegionValue에 따라) */}
                      {expandedSubRegionValue === subRegion.value && subRegion.dongs && subRegion.dongs.length > 0 && (
                        <div className="dong-list">
                          {subRegion.dongs.map((dong) => (
                            <button
                              key={dong.value}
                              className={`dong-button ${selectedDongValue === dong.value ? 'active' : ''}`}
                              onClick={() => handleDongClick(dong)}
                            >
                              {dong.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>


            <section className="job-postings-list-container">
                <h2>✨ 최신 알바 공고 ✨</h2>

            
                {isLoading ? (
                    <p>구인글을 불러오는 중입니다...</p>
                ) : (
                    <>
                        {currentJobPostings.length === 0 && !isLoading ? ( // 로딩이 끝났는데도 구인글이 없는 경우
                            <p>현재 등록된 구인글이 없습니다. 😥</p>
                        ) : (
                            <div className="job-postings-grid">
                                {currentJobPostings.map((post) => (
                                    <Link key={post.id} to={`/job-detail/${post.id}`} className="job-posting-item-link">
                                        <div className="job-posting-item">
                                            <div className="item-header">
                                                <h3 className="job-title">{post.jobTitle}</h3>
                                                <span className="posted-date">{post.postedDate}</span>
                                            </div>
                                            <p className="company-name">{post.companyName}</p>
                                            <div className="item-details">
                                                <span className="location">📍 {post.location}</span>
                                                <span className="wage">💰 {post.wage}</span>
                                                <span className="work-type">⏰ {post.workType}</span>
                                            </div>
                                            <div className="item-footer">
                                                <span className="views">👁️‍🗨️ {post.views}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* ✨ 페이지네이션 컨트롤 UI ✨ */}
                        {totalPages > 1 && ( // 총 페이지가 1개보다 많을 때만 페이지네이션을 보여줍니다.
                            <div className="pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="page-button"
                                >
                                    이전
                                </button>
                                {pageNumbers.map(number => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className={`page-button ${currentPage === number ? 'active' : ''}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="page-button"
                                >
                                    다음
                                </button>
                            </div>
                        )}

                        <div className="action-buttons">
                            {/* <button className="create-job-button">새 알바 공고 등록</button> */}
                        </div>
                    </>
                )}
            </section>

        </body>
    );
};

export default Gonogo;
import React, { useState, useEffect } from 'react';
import { MainNab } from '../MainPage/MainPage';
import './Notice.css';
import { useNavigate } from 'react-router-dom'; // 👈 1. useNavigate 임포트

// 대한민국 행정구역 데이터 정의 (이전과 동일)
const koreaAdministrativeDivisions = {
    "서울특별시": {
        "종로구": ["청운효자동", "사직동", "평창동", "무악동", "교남동", "가회동"],
        "중구": ["소공동", "회현동", "명동", "필동", "장충동", "광희동"],
        "강남구": ["신사동", "논현동", "압구정동", "청담동", "삼성동", "대치동", "역삼동", "도곡동"],
        "서초구": ["서초동", "잠원동", "반포동", "방배동", "양재동", "내곡동"],
    },
    "부산광역시": {
        "해운대구": ["우동", "중동", "좌동", "송정동", "반송동", "재송동", "반여동"],
        "부산진구": ["부전동", "범전동", "연지동", "초읍동", "양정동", "전포동"],
    },
    "대구광역시": {
        "수성구": ["범어동", "만촌동", "수성동", "황금동", "중동", "상동"],
    },
    "경기도": {
        "수원시": {
            "장안구": ["파장동", "율천동", "정자동", "영화동", "송죽동", "조원동"],
            "권선구": ["세류동", "평동", "서둔동", "구운동", "금곡동", "호매실동"],
        },
        "고양시": {
            "일산동구": ["식사동", "중산동", "정발산동", "장항동", "마두동", "백석동"],
            "덕양구": ["주교동", "원당동", "흥도동", "성사동", "고양동", "관산동"],
        },
        "성남시": {
            "수정구": ["신흥동", "태평동", "수진동", "단대동"],
            "분당구": ["분당동", "수내동", "정자동", "금곡동"],
        }
    },
    "강원특별자치도": {
        "춘천시": ["효자동", "석사동", "퇴계동", "신북읍", "동면", "서면"],
        "원주시": ["원동", "개운동", "명륜동", "문막읍", "판부면", "지정면"],
    },
};

const topLevelRegions = Object.keys(koreaAdministrativeDivisions);

function Board() {
    const [title, setTitle] = useState('');
    const [boardText, setBoardText] = useState({ text: '' });
    const [selectedJob, setSelectedJob] = useState('');
    const [workingHours, setWorkingHours] = useState('');
    const [storeName, setStoreName] = useState('');
    const [hourlyWage, setHourlyWage] = useState('');
    const [employmentType, setEmploymentType] = useState('');

    const [selectedTopRegion, setSelectedTopRegion] = useState('');
    const [selectedMiddleRegion, setSelectedMiddleRegion] = useState('');
    const [selectedDongRegion, setSelectedDongRegion] = useState('');

    const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성 상태

    const jobOptions = ['개발', '디자인', '기획', '마케팅', '영업', '경영', '교육', '의료', '기타'];
    const employmentOptions = ['정규직', '비정규직'];

    // 핸들러 함수들
    const onChangeText = (e) => { setBoardText({ ...boardText, text: e.target.value }); };
    const handleJobChange = (e) => { setSelectedJob(e.target.value); };
    const handleWorkingHoursChange = (e) => { setWorkingHours(e.target.value); };
    const handleStoreNameChange = (e) => { setStoreName(e.target.value); };
    const handleHourlyWageChange = (e) => { setHourlyWage(e.target.value); };
    const handleEmploymentTypeChange = (e) => { setEmploymentType(e.target.value); };
    const navigate = useNavigate();
    const handleTopRegionChange = (e) => {
        setSelectedTopRegion(e.target.value);
        setSelectedMiddleRegion('');
        setSelectedDongRegion('');
    };
    const handleMiddleRegionChange = (e) => {
        setSelectedMiddleRegion(e.target.value);
        setSelectedDongRegion('');
    };
    const handleDongRegionChange = (e) => {
        setSelectedDongRegion(e.target.value);
    };

    // useEffect를 사용하여 폼 유효성 실시간 체크 (버튼 스타일 변경용)
    useEffect(() => {
        const checkValidity = () => {
            return (
                title.trim() !== '' &&
                boardText.text.trim() !== '' &&
                selectedJob !== '' &&
                workingHours.trim() !== '' &&
                storeName.trim() !== '' &&
                hourlyWage.trim() !== '' &&
                employmentType !== '' &&
                selectedTopRegion !== '' &&
                selectedMiddleRegion !== '' &&
                selectedDongRegion !== ''
            );
        };
        setIsFormValid(checkValidity());
    }, [title, boardText.text, selectedJob, workingHours, storeName, hourlyWage, employmentType, selectedTopRegion, selectedMiddleRegion, selectedDongRegion]);


    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        // --- 유효성 검사 로직 (이제 이 부분이 항상 호출됩니다) ---
        const missingFields = [];

        if (title.trim() === '') missingFields.push('게시글 제목');
        if (boardText.text.trim() === '') missingFields.push('게시글 내용');
        if (selectedJob === '') missingFields.push('직종');
        if (workingHours.trim() === '') missingFields.push('근무시간');
        if (storeName.trim() === '') missingFields.push('가게이름');
        if (hourlyWage.trim() === '') missingFields.push('시급');
        if (employmentType === '') missingFields.push('고용 형태');
        if (selectedTopRegion === '') missingFields.push('시/도');
        if (selectedMiddleRegion === '') missingFields.push('구/시/군');
        if (selectedDongRegion === '') missingFields.push('동/읍/면');

        if (missingFields.length > 0) {
            alert(`게시글 작성을 위해 다음 내용을 모두 채워주세요:\n\n- ${missingFields.join('\n- ')}`);
            return; // 유효성 검사 실패 시 fetch 요청 실행하지 않고 함수 중단
        }
        // --- 유효성 검사 로직 끝 ---

        // 유효성 검사를 통과했을 경우에만 서버로 데이터 전송
        const postData = {
            title: title,
            content: boardText.text,
            job: selectedJob,
            workingHours: workingHours,
            storeName: storeName,
            hourlyWage: hourlyWage,
            employmentType: employmentType,
            topRegion: selectedTopRegion,
            middleRegion: selectedMiddleRegion,
            dongRegion: selectedDongRegion,
        };

        console.log('전송할 데이터:', postData);

        const API_URL = 'http://localhost:10001/NoticeStore'; // 🚨 중요: 실제 백엔드 API 주소로 변경하세요!

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP 오류! 상태 코드: ${response.status}, 메시지: ${errorData.message || '알 수 없는 오류'}`);
            }

            const result = await response.json();
            console.log('게시글 작성 성공:', result);
            alert('게시글이 성공적으로 작성되었습니다!');
             navigate('/'); 

        } catch (error) {
            console.error('게시글 작성 중 오류 발생:', error);
            alert('게시글 작성에 실패했습니다. 오류: ' + error.message);
        }
    };

    return (
        <main className='BoardMain'>
            <form className='BoardForm' onSubmit={handleSubmit}>
                <input
                    id="BoardName" type={'text'} placeholder="게시글 제목"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className='BoardMaion'
                    placeholder='여기에 게시글 내용을 적어주세요'
                    onChange={onChangeText}
                    value={boardText.text}
                ></textarea>

                <input type="text" id="workingHours" placeholder="근무시간 (예: 평일 9시-6시, 주 5일)" value={workingHours} onChange={handleWorkingHoursChange} />
                <input type="text" id="storeName" placeholder="가게이름" value={storeName} onChange={handleStoreNameChange} />
                <input type="text" id="hourlyWage" placeholder="시급 (예: 9,860원)" value={hourlyWage} onChange={handleHourlyWageChange} />

                <div className='selectContainer'>
                    <label htmlFor="jobSelect">직종 선택: </label>
                    <select id="jobSelect" onChange={handleJobChange} value={selectedJob}>
                        <option value="">직종을 선택하세요</option>
                        {jobOptions.map((job) => (<option key={job} value={job}>{job}</option>))}
                    </select>
                </div>

                <div className='selectContainer'>
                    <label htmlFor="employmentTypeSelect">고용 형태: </label>
                    <select id="employmentTypeSelect" onChange={handleEmploymentTypeChange} value={employmentType}>
                        <option value="">고용 형태를 선택하세요</option>
                        {employmentOptions.map((type) => (<option key={type} value={type}>{type}</option>))}
                    </select>
                </div>

                <div className='regionSelectGroup'>
                    <div className='selectContainer'>
                        <label htmlFor="topRegionSelect">시/도: </label>
                        <select id="topRegionSelect" onChange={handleTopRegionChange} value={selectedTopRegion}>
                            <option value="">시/도 선택</option>
                            {topLevelRegions.map((region) => (<option key={region} value={region}>{region}</option>))}
                        </select>
                    </div>

                    {selectedTopRegion && (
                        <div className='selectContainer'>
                            <label htmlFor="middleRegionSelect">구/시/군: </label>
                            <select id="middleRegionSelect" onChange={handleMiddleRegionChange} value={selectedMiddleRegion}>
                                <option value="">구/시/군 선택</option>
                                {Object.keys(koreaAdministrativeDivisions[selectedTopRegion] || {}).map((middleRegion) => (
                                    <option key={middleRegion} value={middleRegion}>{middleRegion}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedMiddleRegion && (
                        <div className='selectContainer'>
                            <label htmlFor="dongRegionSelect">동/읍/면: </label>
                            <select id="dongRegionSelect" onChange={handleDongRegionChange} value={selectedDongRegion}>
                                <option value="">동/읍/면 선택</option>
                                {(koreaAdministrativeDivisions[selectedTopRegion] &&
                                  koreaAdministrativeDivisions[selectedTopRegion][selectedMiddleRegion] || []).map((dong) => (
                                    <option key={dong} value={dong}>{dong}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {((selectedJob && selectedJob !== "") || (employmentType && employmentType !== "") || (selectedTopRegion || selectedMiddleRegion || selectedDongRegion)) && (
                    <div className="selectedInfoDisplay">
                        {selectedJob && selectedJob !== "" && (<p>선택하신 직종: <span style={{ color: '#5b5bd6' }}>{selectedJob}</span></p>)}
                        {employmentType && employmentType !== "" && (<p>선택하신 고용 형태: <span style={{ color: '#5b5bd6' }}>{employmentType}</span></p>)}
                        {(selectedTopRegion || selectedMiddleRegion || selectedDongRegion) && (
                            <p>선택하신 지역: <span style={{ color: '#5b5bd6' }}>{selectedTopRegion} {selectedMiddleRegion} {selectedDongRegion}</span></p>
                        )}
                    </div>
                )}

                {/* '작성하기' 버튼의 disabled 속성 제거! 대신 isFormValid에 따라 클래스를 추가 */}
                <button type='submit' className={`BoardSubmit ${isFormValid ? '' : 'disabled-look'}`} id='BdSubmit'>작성하기</button>
            </form>
        </main>
    );
}

export function NoticeBoard() {
    return (
        <div>
            <MainNab></MainNab>
            <Board></Board>
        </div>
    );
}

export default NoticeBoard;
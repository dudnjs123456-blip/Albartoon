import React, { useEffect } from 'react'; // useEffect와 React를 import 합니다.
import { useLocation, useParams, useNavigate } from 'react-router-dom'; // useLocation, useParams, useNavigate를 import 합니다.
import { useSelector } from "react-redux"; // 사용되지 않아도 임포트는 유지
import { MainNab } from './MainPage'; // MainNab 컴포넌트 경로 확인 필요. './MainPage'가 맞는지 확인해주세요.

import './NewStoreC.css'; // CSS 파일은 그대로 유지합니다.

function NewStoreC() {
    const location = useLocation(); // 현재 URL 및 state 정보를 가져옵니다.
    const params = useParams(); // URL 파라미터 (예: /NewStoreC/:location)를 가져옵니다.
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅을 가져옵니다.

    // 1. Link의 state로 전달받은 job 객체를 추출합니다.
    // 이전 페이지에서 { jobDetails: job } 형태로 보냈으므로, jobDetails로 접근합니다.
    const jobDetails = location.state?.jobDetails;

    // 2. URL 파라미터로 전달받은 지역 정보를 추출합니다.
    const { location: jobLocationParam } = params; 

    // 컴포넌트가 처음 마운트될 때 (로딩될 때) 한 번만 실행되며, 콘솔에 데이터를 출력합니다.
    useEffect(() => {
        console.log("---------- NewStoreC 컴포넌트 로드됨 ----------");
        console.log("URL 파라미터로 받은 지역 (pathname에서 추출):", jobLocationParam);
        console.log("Link의 state로 받은 job 상세 정보 (jobDetails):", jobDetails);
        console.log("----------------------------------------------");

        if (!jobDetails) {
            console.warn("jobDetails 데이터가 Link state를 통해 전달되지 않았거나 존재하지 않습니다. URL로 직접 접근했거나 새로고침했을 수 있습니다.");
            // 선택 사항: 데이터가 없을 경우 이전 페이지로 돌아가거나, 특정 메시지를 보여줄 수 있습니다.
            // alert('채용 공고 정보를 찾을 수 없습니다. 이전 페이지로 돌아갑니다.');
            // navigate('/'); // 예시: 홈으로 리다이렉트
        }
    }, [jobDetails, jobLocationParam]); // 의존성 배열에 jobDetails와 jobLocationParam을 넣어 데이터 변경 시 재실행되도록 합니다.

    // 데이터가 없는 경우를 처리합니다 (예: 직접 URL로 접근했거나, 새로고침한 경우)
    if (!jobDetails) {
        return (
            <body className='Mainbody'>
                <MainNab />
                <div className="detail-container">
                    <h2 className="detail-title">채용 공고 정보를 찾을 수 없습니다.</h2>
                    <p>이전 페이지를 통해 다시 접근해 주시거나, 메인 페이지로 돌아가주세요.</p>
                    <div className="apply-button-container">
                        <button className="apply-button" onClick={() => navigate('/')}>메인으로 돌아가기</button>
                    </div>
                </div>
            </body>
        );
    }

    // '나가기' 버튼 클릭 시 이전 페이지로 돌아갑니다.
    const handleExit = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    const handleApply = () => {
        alert(`${jobDetails.storeName || '해당 채용공고'}에 지원하기 버튼 클릭!`);
        // 예: 지원 폼으로 이동 또는 모달 띄우기
    };

    // jobDetails에서 데이터를 추출하여 사용합니다.
    // jobDetails 객체에 없는 속성일 경우 기본값을 제공하거나, 렌더링하지 않도록 처리합니다.
    const title = jobDetails.title || `${jobDetails.job || '직종 미정'} ${jobDetails.storeName || ''} 채용 공고`;
    const content = jobDetails.content || "상세 내용이 제공되지 않았습니다.";
    const job = jobDetails.job || '정보 없음'; // 기존 '직종'
    const workingHours = jobDetails.workTime || '정보 없음'; // 기존 '근무시간'
    const storeName = jobDetails.storeName || '정보 없음'; // 기존 '가게이름'
    const hourlyWage = jobDetails.salary || '정보 없음'; // 기존 '시급' (salary로 가정)
    const employmentType = jobDetails.type || '정보 없음'; // 기존 '고용 형태' (type으로 가정)

    // 지역 정보는 jobDetails.location 또는 jobLocationParam을 활용할 수 있습니다.
    // 만약 jobDetails에 topRegion, middleRegion, dongRegion이 있다면 그를 사용하고,
    // 없다면 jobDetails.location을 통째로 사용하거나 jobLocationParam을 사용합니다.
    const displayRegion = jobDetails.topRegion && jobDetails.middleRegion && jobDetails.dongRegion
        ? `${jobDetails.topRegion} ${jobDetails.middleRegion} ${jobDetails.dongRegion}`
        : jobDetails.location || jobLocationParam || '정보 없음';
    
    const createdAt = jobDetails.createdAt || jobDetails.created_at || '작성일 정보 없음'; // created_at 또는 createdAt으로 가정

    return (
        <body className='Mainbody'>
            <MainNab />
            <div className="detail-container">
                {/* '나가기' 버튼과 '작성일자'를 묶는 컨테이너 */}
                <div className="top-right-elements">
                    <button className="exit-button" onClick={handleExit}>나가기</button>
                    {createdAt && ( 
                        <div className="post-timestamp">
                            {/* 날짜 형식에 따라 new Date() 변환이 필요 없을 수도 있습니다. */}
                            {new Date(createdAt).toLocaleString()}
                        </div>
                    )}
                </div>
                
                <h2 className="detail-title">{title}</h2>
                <p className="detail-content">{content}</p>

                <div className="detail-info-group">
                    <div className="detail-info-item">
                        <span className="label">직종:</span> <span className="value">{job}</span>
                    </div>
                    <div className="detail-info-item">
                        <span className="label">근무시간:</span> <span className="value">{workingHours}</span>
                    </div>
                    <div className="detail-info-item">
                        <span className="label">가게이름:</span> <span className="value">{storeName}</span>
                    </div>
                    <div className="detail-info-item">
                        <span className="label">시급:</span> <span className="value">{hourlyWage}</span>
                    </div>
                    <div className="detail-info-item">
                        <span className="label">고용 형태:</span> <span className="value">{employmentType}</span>
                    </div>
                    <div className="detail-info-item">
                        <span className="label">지역:</span> <span className="value">{displayRegion}</span>
                    </div>
                </div>

                {/* 맨 밑에 '지원하기' 버튼 */}
                <div className="apply-button-container">
                    <button className="apply-button" onClick={handleApply}>지원하기</button>
                </div>
            </div>
        </body>
    )
}

export default NewStoreC;
import React, { useState, useRef } from 'react';
import { MainNab } from '../MainPage'; // MainNab 컴포넌트 경로. 경로가 다를 경우 수정해주세요.
import './Mypage.css';
import { useSelector, useDispatch } from "react-redux"; // import 해주세요.

function Mypage() {
    // 1. 상세내역 및 사용자 이름 편집 모드를 관리하는 상태 (true: 편집 모드, false: 보기 모드)
    const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);

        const dispatch = useDispatch();
    const User_Store = useSelector((state) => state.StoreName);
        const UserIDtext = useSelector((state) => state.UserID);
        console.log(UserIDtext.UserID.ID)
        const usId= UserIDtext.UserID.ID;
        
    // 2. 사용자 이름을 관리하는 상태
    const [userName, setUserName] = useState('김코딩'); // 초기 사용자 이름
    const [tempUserName, setTempUserName] = useState(userName); // 편집 중 임시 사용자 이름

    // 3. 상세내역의 내용을 관리하는 상태 (초기값은 예시입니다)
    const [privacyDetails, setPrivacyDetails] = useState([
        '나의 계정 정보',
        '결제 내역 관리',
        '개인정보 변경',
        '로그아웃'
    ]);
    const [tempPrivacyDetails, setTempPrivacyDetails] = useState(privacyDetails); // 편집 중 임시 상세내역

    // 4. 사용자 이미지 URL을 관리하는 상태
    const [userImageUrl, setUserImageUrl] = useState(null); // 초기에는 이미지 없음

    // 파일 입력(input type="file")에 접근하기 위한 ref
    const imageInputRef = useRef(null);

    // 상세내역 및 사용자 이름 편집 모드 토글 핸들러
    const toggleEditMode = () => {
        setIsEditingPrivacy(prev => {
            if (!prev) { // 편집 모드로 진입 시
                setTempPrivacyDetails([...privacyDetails]); // 현재 상세내역을 임시 상태에 복사
                setTempUserName(userName); // 현재 사용자 이름을 임시 상태에 복사
            }
            // 편집 모드 종료 시에는 temp 상태를 굳이 원상복구하지 않아도 됩니다.
            // isEditingPrivacy가 false가 되면 화면에는 원본 userName, privacyDetails가 렌더링되니까요.
            return !prev; // 모드 토글
        });
    };

    // 상세내역 내용 변경 핸들러
    const handleDetailChange = (index, value) => {
        const newDetails = [...tempPrivacyDetails];
        newDetails[index] = value;
        setTempPrivacyDetails(newDetails);
    };

    // 사용자 이름 변경 핸들러 (input 값이 바뀔 때마다 tempUserName 업데이트)
    const handleUserNameChange = (e) => {
        setTempUserName(e.target.value);
    };

    // 모든 변경사항 저장 핸들러
    const saveAllChanges = () => {
        setPrivacyDetails([...tempPrivacyDetails]); // 임시 상세내역을 실제 상세내역에 반영
        setUserName(tempUserName); // 임시 사용자 이름을 실제 사용자 이름에 반영
        setIsEditingPrivacy(false); // 편집 모드 종료
        console.log("저장되었습니다!"); // 콘솔 확인용
    };

    // 이미지 클릭 시 파일 선택 창 열기
    const handleImageClick = () => {
        imageInputRef.current.click(); // 숨겨진 input[type="file"]을 강제로 클릭
    };

    // 이미지 파일 선택 시 미리보기 설정
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImageUrl(reader.result); // 파일 읽기가 끝나면 Data URL 형태로 URL 상태 업데이트
            };
            reader.readAsDataURL(file); // 파일을 Data URL 형태로 읽기 시작
        }
    };

    return(
        <body>
            {/* 네비게이션 바 */}
            <MainNab></MainNab>
            
            {/* 메인 섹션: 사이드바와 메인 콘텐츠 */}
            <section className='First_section'>
                {/* 마이페이지 사이드바 */}
                <div className='Mypage_section'>
                    <footer className='UserFeature'>
                        <div className='MyPage_First'>My Page</div>

                        {/* 사용자 이미지 영역 (클릭 시 파일 선택) */}
                        <div className='User_image_container' onClick={handleImageClick}>
                            {userImageUrl ? (
                                <img src={userImageUrl} alt="사용자 프로필" className="User_profile_image" />
                            ) : (
                                <span className='User_image_placeholder'>
                                    사진을<br/>추가하세요
                                </span>
                            )}
                            {/* 실제 파일 선택 input (숨겨져 있음) */}
                            <input
                                type="file"
                                ref={imageInputRef}
                                onChange={handleImageChange}
                                accept="image/*" // 이미지 파일만 선택 가능하도록 설정
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* 사용자 이름 영역 (편집 모드 시 input으로 변경) */}
                        {isEditingPrivacy ? (
                            <input
                                type="text"
                                className="Mypage_name_input"
                                value={tempUserName} // 임시 사용자 이름 상태와 바인딩
                                onChange={handleUserNameChange} // 변경 핸들러 연결
                            />
                        ) : (
                            <div className='Mypage_name'>{userName}</div> // 현재 사용자 이름 표시
                        )}

                        {/* 상세내역 목록 및 편집/저장/취소 버튼 */}
                        <ul className='User_Privacy'>
                            {isEditingPrivacy ? ( // 편집 모드일 때: input 필드와 저장/취소 버튼
                                <>
                                    {tempPrivacyDetails.map((detail, index) => (
                                        <li key={index}>
                                            <input
                                                type="text"
                                                value={detail}
                                                onChange={(e) => handleDetailChange(index, e.target.value)}
                                                className="privacy-input-field"
                                            />
                                        </li>
                                    ))}
                                    <li>
                                        <button onClick={saveAllChanges} className="save-button">저장</button>
                                        <button onClick={toggleEditMode} className="cancel-button">취소</button> {/* 취소 시 모드만 전환, 변경사항 적용 안 됨 */}
                                    </li>
                                </>
                            ) : ( // 보기 모드일 때: 텍스트와 편집 버튼
                                <>
                                    {privacyDetails.map((detail, index) => (
                                        <li key={index}>{detail}</li>
                                    ))}
                                    <li>
                                        <button onClick={toggleEditMode} className="edit-button">내 정보 편집</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </footer>
                </div>

                {/* 마이페이지 메인 콘텐츠 */}
                <div className='Mypage_Mainsection'>
                    <h1 className='Mypage_Mainsection_title'>나의 이력서</h1>
                    <section className='Mypage_Mainsection_FirstSection' >
                        <h1>알바경력 사항</h1>
                        <ul>
                            <li>알바이름</li>
                            <li>알바이름</li>
                        </ul>
                        <ul>
                            <li>기간1</li>
                            <li>기간2</li>
                        </ul>
                        <ul>
                            <li>직종1</li>
                            <li>직종2</li>
                        </ul>
                    </section>
                    <section className='Mypage_Mainsection_SecondSection' ></section>
                </div>
            </section>
        </body>
    )
}

export default Mypage;
import './MainPage.css'
import React, { useState, useRef, useEffect,useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Cookies from 'js-cookie';

//react icons
import { AiFillHome } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaExclamationCircle, FaBell } from 'react-icons/fa'; // 느낌표 아이콘과 알람 아이콘
//bootstrap modal
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Ma Ui
import Card from '@mui/material/Card';  
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoginPage from '../LoginPage/LoginPage';
import { display, style } from '@mui/system';
import Mypage from './Mypage/Mypage';

// 리덕스
import { persistor } from '../redux/config/configstore';
import { createSlice } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import store from '../redux/config/configstore';
import { useSelector, useDispatch } from "react-redux"; // import 해주세요.


export const MainCopyrigh = styled.div`
    position: absolute;
    width: 100%;
    height: 400px;
    top: ${Mainprops => Mainprops.top}; 
    background-color: rgba(15, 35, 79, 0.709);
`;


export function MainNab() {
    // 디스패치 작업들
    const dispatch = useDispatch();
    const Loginstate = useSelector((state) => state.stateLogin.stateLogin.value);
    const Loginstatestate = useSelector((state) => state.stateLogin);
    const User_Store = useSelector((state) => state.StoreName);
    const UserIDtext = useSelector((state) => state.UserID);

    
    const [alarmMessage, setAlarmMessage] = useState('');
    const [hasNotification, setHasNotification] = useState(false); // 알림 상태
    const [showAlarm, setShowAlarm] = useState(false);
    const [Alamldata, setAlamldata] = useState([]);

    



    function MypageClickEvent(){
        if(Loginstate =='Login'){
            handleShow();
        }else if(Loginstate != 'Login' && (User_Store.StoreName.User_Store==undefined)||(User_Store.StoreName.User_Store=="")){
            alert('등록된 가게가 없습니다. 가게를 등록하시겠습니까?')
            window.location.href = "/NewStore";
        }else if(Loginstate != 'Login' && User_Store.StoreName.User_Store!=undefined){
            window.location.href = "/OurStore"; 
        }
    }

  
  /*  persistor.persist();


    const persistorstate = persistor.flush();
    console.log(Loginstate);    
    console.log(persistorstate);*/
    // console.log(window.localStorage.getItem(persist))

    const handleClick = () => {
         window.location.href = "/Mypage";
      };
    //로그인 UI상태변경
    useEffect(()=>{
        const Loginout = document.getElementById('Loginout');
        const loginicon = document.getElementById('loginicon');
        const loginicona = document.getElementById('loginicona')
        const Login_before = document.getElementById('Login_before');

        if(Loginstate=='Login'){
            Loginout.style.display = 'none';
            loginicon.style.display = 'block';
            loginicona.style.left = 125 +'px';
            Login_before.addEventListener(('click'),()=>{
                handleShow();    
            })   
            Login_before.removeEventListener('click', handleShow);
        }else{
            Login_before.removeEventListener('click', handleShow);
            Loginout.style.display = 'block'; 
            loginicon.style.display = 'none';  
            loginicona.style.left = 25 +'px';
        }
    },[Loginstate])

    // 모달 상태정리
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // 로그인 포커스 함수
    useEffect(() => {
        if (show) {
          const idInput = document.getElementById('loginid');
          if (idInput) {
            idInput.focus();
          }
        }
      }, [show]);

   /*
    const LoginTrue = useSelector((state) => state.counter.LoginTrue);
    const Loginfalse = useSelector((state) => state.counter.Loginfalse);
    useEffect(()=>{
        const Login_Clear = document.getElementById('Login_Clear');
        const Login_before = document.getElementById('Login_before');
        if(Loginfalse == false){
            Login_Clear.display ="block";
            Login_before.display.opcity = "none";
        }else if(LoginTrue == true){
            Login_before.display.opcity = "block";
            Login_Clear.display.opcity = "none";
        }
    })
    */
    const[User_Id,setUser_Id] = useState('')

const onSetsetUserId = useCallback(e=>{
    setUser_Id(e.target.value);
},[])

const[User_password,setUser_password] = useState('')

const onSetsetUserpassword = useCallback(e=>{
    setUser_password(e.target.value);
},[]);

function useUserLoginSubmitHander(e) {
    e.preventDefault();
    
    fetch('http://localhost:10001/userLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        User_Id, // 실제 사용자 ID로 대체
        User_password, // 실제 비밀번호로 대체
      }),
      credentials: 'include' // 쿠키를 포함시키기 위한 옵션
    })
      .then((response) => {
        console.log('응답 상태:', response.status); // 응답 상태 코드 출력
        return response.json();
      })
      .then((data) => {
        console.log('서버 응답 데이터:', data); // 서버 응답 데이터 출력
        
        // 쿠키 정보 확인
        console.log('현재 쿠키 정보:', document.cookie);
        
        if (data.token) {
          // 로그인 성공
          const token = data.token;
          console.log('Token:', token); // 토큰 콘솔 출력
          localStorage.setItem('token', token); // 토큰 저장
          dispatch({ type: 'stateLogin/up', step: data.User_Name });
          dispatch({ type: 'StoreName/Login', LoginDATA: data.User_StoreName });
          dispatch({ type: 'UserID/Login', ChangeID: data.User_Id });
          handleClose();
  
          // 30초 후에 자동으로 로그아웃
          const logoutTimer = setTimeout(() => {
            localStorage.removeItem('token');
            dispatch({ type: "StoreName/up", LoginDATA: '' });
            dispatch({ type: "stateLogin/Loginout", step: 'hi' });
            dispatch({ type: "UserID/Login", ChangeID: '' });
  
            alert('자동 로그아웃되었습니다.');
          }, 300000000); // 300초로 수정 (5분)
  
          // 페이지 이동 시 타이머 해제
          window.addEventListener('beforeunload', () => {
            clearTimeout(logoutTimer);
          });
        } else {
          // 로그인 실패
          console.log('로그인 실패 메시지:', data.message); // 실패 메시지 출력
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('오류 발생:', error); // 오류 발생 시 콘솔 출력
      });
}


  useEffect(() => {
    // 모든 쿠키 정보 가져오기
    const allCookies = Cookies.get();
    console.log('현재 쿠키 정보:', allCookies);
  }, []);

  const handleLogout = () => {
    // 로그아웃 관련 상태 업데이트
    // 로그아웃 API 호출 전에 쿠키 정보 출력
    console.log('현재 쿠키 정보:', document.cookie);
    dispatch({ type: "StoreName/up", LoginDATA: '' });
    dispatch({ type: "stateLogin/Loginout", step: 'hi' });
    dispatch({ type: "UserID/Login", ChangeID: '' });

    // 로그아웃 API 호출
    fetch('http://localhost:10001/userLogout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // 쿠키를 포함하여 요청
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        // 알림 표시
        alert(data.message);
        console.log("로그아웃 되었습니다.");
        
        // 페이지 새로 고침
        // window.location.reload();
      }
    })
    .catch(error => {
      console.error('로그아웃 중 오류 발생:', error);
    });
};

// 알림 수신 함수 (예시)
const receiveNotification = () => {
    setHasNotification(true);
};





// usId 변수에 UserIDtext.UserID.ID의 값을 할당
const usId = UserIDtext.UserID.ID;


useEffect(() => {
    const fetchData = () => {
        fetch('http://localhost:10001/UserCheck1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usId }) // usId를 JSON으로 변환하여 전송
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // 서버로부터 받은 응답을 콘솔에 출력
            setAlamldata(data); // 응답 데이터를 Alamldata 상태에 저장
        })
        .catch(error => {
            console.error('Error:', error); // 오류가 발생한 경우 콘솔에 출력
        });
    };

    fetchData(); // 컴포넌트가 마운트될 때 fetchData 호출
}, []); // 빈 배열을 의존성으로 전달하여 처음 마운트될 때만 실행

const [isAlarmVisible, setIsAlarmVisible] = useState(false);
const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);


const handleAccept = async () => {
    // 수락 버튼 클릭 시 처리 로직
    setIsConfirmationVisible(false);

    try {
        const response = await fetch('http://localhost:10001/UserCheck3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usId }) // usId를 JSON으로 변환하여 전송
        });

        // 응답이 성공적일 경우
        if (response.ok) {
            const resData = await response.json(); // 응답 데이터를 JSON으로 변환
            console.log('서버 응답:', resData); // 응답 데이터를 콘솔에 출력
            alert(resData.message); // 알림으로 띄우기 (서버에서 반환한 메시지 사용)

            // 상태 업데이트 (필요한 경우)
            // 예: setData(resData.newData); // 새로 렌더링할 데이터가 있다면 상태 업데이트
        } else {
            // 오류 처리
            const errorData = await response.json();
            alert(`오류: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Fetch 오류:', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
    }
};


const handleReject = () => {
    // 거부 버튼 클릭 시 처리 로직
    console.log('거부되었습니다.');
    setIsConfirmationVisible(false);
    fetch('http://localhost:10001/UserCheck2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usId }) // usId를 JSON으로 변환하여 전송
        
    })

};

const [isAlarmTextVisible, setIsAlarmTextVisible] = useState(false);

const MaintoggleAlarm = () => {
    setIsAlarmTextVisible(!isAlarmTextVisible);
    
};

console.log(UserIDtext.UserID.ID)
  
const toggleAlarm = () => {
    // 알람 상태가 'wait'일 때만 알람 창을 열 수 있도록 함
    if (Alamldata.state === 'wait') {
        setIsConfirmationVisible(true);
    }
};



    
     return (
        <div className="MainNav">
            <ul className='MainUl' >
                {/* <div className='MainUlbefore'></div> */}
             <Link to={'/'}>  
             <h1 className='Mainname'> 알바 toon</h1></Link>
                <li onClick={MypageClickEvent}>우리 가게 Page</li>

                <Link to={'/Schedule'}>
                <li>알바 출근부</li>
                </Link>
                <Link to={'/callender'}>
                <li>알바 스케줄</li>
                </Link>
                <Link to={'/chatt'}>
                <li>알바 채팅방</li>
                </Link>
                <Link to={'/MainNoticeBoard'}>
                <li>알바 게시판</li>
                </Link>
                <Link to={'/SchduleSearch'}>
                <li>스케줄 검색</li>
                </Link>
            </ul>

            <div className='ListHover'>

                 <ul className='List1' style={{display:'none'}}>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                </ul>
            </div>
            


            <form className='searchbox'>
                <input id='search1' type={'text'}></input>
                <input id='submit' type={'submit'} value='알바 찾아보기'></input>
            </form>

            <div className='login'>
                <ul> 
                     <li variant="primary" id='Login_before'><BsFillPeopleFill id='loginicon' className='loginicon'></BsFillPeopleFill><a id='loginicona'>{Loginstate}</a></li>
                     <li id='Loginout' onClick={handleLogout}>
                     <a id='lgout'>Log Out</a>
                     </li>
                     <Modal show={show} onHide={handleClose} animation={false}>
                         <Modal.Header closeButton>
                         </Modal.Header>
                         <Modal.Body className='b1'>
                             <div className='a2'>알바 toon</div>
                                <h2 className='a3'>알바의 모든 것을 모은 단 하나의 앱</h2>
                            <form onSubmit={useUserLoginSubmitHander}>
                             <input id='loginid' type={'text'} name="" placeholder='아이디'
                             value={User_Id} onChange={onSetsetUserId}></input>
                             <input id='loginpassword' type={'password'} name="" placeholder='비밀번호'
                             value={User_password} onChange={onSetsetUserpassword}></input>
                             <button id='loginsubmit' type={'submit'} name="" 
                             value={'로그인'}>로그인</button>
                             <ul className='loginui'>
                                 <li id="login">아이디찾기</li>
                                 <li id="password">비밀번호찾기</li>
                                 <Link to={'/3'}><li id="sign" style={{ color: 'black' }}>회원가입</li></Link>
                             </ul>
                             </form>
                             <h2 className='a1'>간편로그인</h2>
                             <section className='naver'>
                                 <div id="naver">Naver</div>
                                 <div id="google">Google</div>
                                 <div id="kakao">KaKao</div>
                                 <div id="instagram">instagram</div>
                             </ section>
                         </Modal.Body>
                     </Modal>
                     <Link to={'/Mypage'}>
                 <li id='Login_Myapage'>
                 <AiFillHome className='pageicon'></AiFillHome>
                     My page
                 </li>
                 </Link>
                         {/* 알람 버튼과 느낌표 아이콘 */}
                         <div>
                         <li
            id='alarmButton'
            onClick={MaintoggleAlarm}
            style={{
                position: 'relative',
                marginRight: '5px',
                cursor: Alamldata.state === 'wait' ? 'pointer' : 'default',
                // 마우스 오버 시 포인터 스타일 적용
                ':hover': {
                    cursor: 'pointer'
                }
            }}
        >
            <FaBell style={{ marginRight: '5px' }} />
            {Alamldata.state === 'wait' && (
            <FaExclamationCircle style={{
                position: 'absolute',
                top: '-0px',
                right: '0px',
                color: 'red',
                fontSize: '10px',
            }} />
            )}
        </li>

        {isAlarmTextVisible && (
                <div className='alarmtext'>
                     {Alamldata.state === 'wait' && (
    <div className='alarmtext'>
    <ul>
        <li
        onClick={toggleAlarm }
        >{Alamldata.userName}님께서 {Alamldata.userStoreName}로 초대하셨습니다.</li>
    </ul>
</div>

    )}
                </div>
            )}
            {/* 알람 확인 창 */}
            {isConfirmationVisible && (
                <div style={{
                    position: 'absolute',
                    top: '330px',
                    right: '0px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                }}>
                    <p>수락하시겠습니까?</p>
                    <button onClick={handleAccept}>예</button>
                    <button onClick={handleReject}>아니오</button>
                </div>
            )}
        </div>
                </ul>
            </div>
        </div>
    )
}

function Mainteam() {
    const swiperRef = useRef(null)
    return (
        <div
            // onMouseEnter={() => swiperRef.current.swiper.autoplay.stop()}
            // onMouseLeave={() => swiperRef.current.swiper.autoplay.start()}
        >
            <Swiper
                // install Swiper modules
                ref={swiperRef}
                allowTouchMove={false}
                modules={[Navigation, Pagination, Scrollbar, A11y, /*Autoplay*/]}
                spaceBetween={0}
                slidesPerView={1}
                speed={1500}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                /*
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                */
            >
                <SwiperSlide>
                    <main className='maintema'>
                        <div className='textbox'>
                            <p id='textbox1'>알바의 모든 것을 단 하나로<br></br>
                                알바의 혁신 알바 toon
                            </p>
                            <p>
                                가장 가까운 동네 알바, 당신이 원하는 사람들과 함께.<br></br>
                                즐겁게 일바 생활을 해봐요!
                            </p>
                            <Link to={'/JobPosting'}>
                            <div className='nextbox'>
                                동네 알바 찾기
                            </div>
                            </Link>
                        </div>

                        <div className='mainteamaction'></div>
                    </main>
                </SwiperSlide>
                <SwiperSlide></SwiperSlide>
                {/* <SwiperSlide>Slide 3</SwiperSlide> */}
                {/* <SwiperSlide>Slide 4</SwiperSlide> */}
            </Swiper>
        </div>
    );
}

export function Mainteam2() {
  const UserIDtext = useSelector((state) => state.UserID);
  console.log(UserIDtext.UserID.ID);
  const usMainId = UserIDtext.UserID.ID;

  const [showBoardPlusButton, setShowBoardPlusButton] = useState(false);

  // API 호출 useEffect: 이 부분은 변경 없음
  useEffect(() => {
    console.log('✨ useEffect가 실행되었어요! API 호출을 시작합니다... ✨');

    fetch('http://localhost:10001/MainCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usMainId: usMainId })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('API 응답 데이터를 받았습니다:', data.isRepresentIdMatching);
      setShowBoardPlusButton(data.isRepresentIdMatching);
    })
    .catch(error => {
      console.error('API 호출 중 오류가 발생했습니다:', error);
    });
  }, [usMainId]);

  const mockJobsData = [
    {
      id: 1,
      title: "친절한 미소의 카페 알바 구해요!",
      location: "대구광역시 북구 태전동 현대전원 101동 606호",
      workTime: "월~금 10:00~18:00 (시간 협의 가능)",
      salary: "시급 11,000원",
      type: "정규직"
    },
    {
      id: 2,
      title: "주말 웹사이트 관리 보조 모집",
      location: "서울 강남구 역삼동 스타트업 빌딩",
      workTime: "토, 일 12:00~17:00",
      salary: "시급 12,500원",
      type: "비정규직"
    },
    {
      id: 3,
      title: "급여 좋은 편의점 야간 알바!",
      location: "부산 해운대구 마린시티",
      workTime: "매일 22:00~06:00",
      salary: "시급 13,000원 (심야수당 포함)",
      type: "정규직"
    },
    {
      id: 4,
      title: "데이터 라벨링 재택 근무자 모집",
      location: "전국 (재택)",
      workTime: "자유롭게 시간 선택 (건당 지급)",
      salary: "건당 500원 ~ 1,000원",
      type: "비정규직"
    },
    {
      id: 5,
      title: "레스토랑 홀 서빙 구인",
      location: "경기도 성남시 분당구",
      workTime: "주 5일 11:00~20:00 (브레이크 타임 있음)",
      salary: "월 220만원",
      type: "정규직"
    },
    {
      id: 6,
      title: "쇼핑몰 상품 등록 및 CS 보조",
      location: "제주 제주시 연동",
      workTime: "평일 09:00~18:00",
      salary: "시급 10,000원",
      type: "비정규직"
    },
    {
      id: 7,
      title: "문구점 판매 알바",
      location: "대구광역시 동구 신암동",
      workTime: "주말 14:00~20:00",
      salary: "시급 10,500원",
      type: "비정규직"
    },
    {
      id: 8,
      title: "개발 프로젝트 보조 (프론트엔드 경험자 우대)",
      location: "서울 서초구 서초동",
      workTime: "주 3일 9:00~18:00",
      salary: "협의 후 결정",
      type: "정규직"
    },
    {
      id: 9,
      title: "이벤트 행사 스태프 모집",
      location: "인천광역시 연수구",
      workTime: "행사 일정에 따라 유동적",
      salary: "일당 10만원",
      type: "비정규직"
    },
    {
      id: 10,
      title: "사무 보조 및 서류 정리",
      location: "대전 유성구 봉명동",
      workTime: "평일 13:00~17:00",
      salary: "시급 9,860원",
      type: "비정규직"
    },
    {
      id: 11,
      title: "파트타임 영어 강사",
      location: "수원시 영통구",
      workTime: "월, 수, 금 오후",
      salary: "시급 25,000원",
      type: "비정규직"
    },
    {
      id: 12,
      title: "단기 데이터 입력",
      location: "온라인 (재택)",
      workTime: "자유",
      salary: "건당 300원",
      type: "비정규직"
    },
    {
      id: 13,
      title: "IT 사무보조",
      location: "판교 테크노밸리",
      workTime: "주 4일 10:00~17:00",
      salary: "월 180만원",
      type: "정규직"
    }
];

    const [jobs, setJobs] = useState([]); // 서버에서 받아올 알바 데이터
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (슬라이드 인덱스)
    const [itemsPerPage, setItemsPerPage] = useState(3); // 한 화면에 표시될 카드 개수
    
    // DOM 요소에 접근하기 위한 ref
    const trackRef = useRef(null);
    const wrapperRef = useRef(null);
    const cardRefs = useRef([]); // 각 카드에 대한 ref (필요시 사용)

    // 페이지별 알바 데이터 그룹화
    const pages = [];
    for (let i = 0; i < jobs.length; i += itemsPerPage) {
        pages.push(jobs.slice(i, i + itemsPerPage));
    }
    const totalPages = pages.length;

    // 현재 윈도우 크기에 따라 itemsPerPage를 동적으로 설정
    const updateItemsPerPage = useCallback(() => {
        const width = window.innerWidth;
        if (width >= 992) {
            setItemsPerPage(3);
        } else if (width >= 600) { // 모바일 가로 또는 태블릿 세로
            setItemsPerPage(2);
        } else { // 모바일 세로
            setItemsPerPage(1);
        }
    }, []);

    // 캐러셀 슬라이드 위치 업데이트
    const updateCarouselPosition = useCallback(() => {
        if (trackRef.current && wrapperRef.current) {
            // wrapper의 너비를 기준으로 각 "페이지"의 너비를 계산
            // `wrapperRef.current.offsetWidth`는 버튼 공간을 확보한 `job-carousel-wrapper`의 실제 보이는 너비가 됨
            const wrapperWidth = wrapperRef.current.offsetWidth; 
            const transformX = -currentPage * wrapperWidth; // 현재 페이지만큼 이동

            trackRef.current.style.transform = `translateX(${transformX}px)`;
        }
    }, [currentPage]);

    // 데이터 로딩 및 초기화
    useEffect(() => {
        // 실제로는 API 호출을 통해 데이터를 가져옵니다.
        // fetch('/api/jobs')
        //   .then(res => res.json())
        //   .then(data => setJobs(data));
        setJobs(mockJobsData); // 가상 데이터 사용
        updateItemsPerPage(); // 초기 itemsPerPage 설정
    }, [updateItemsPerPage]);

    // itemsPerPage 또는 currentPage가 변경될 때마다 슬라이드 위치 업데이트
    useEffect(() => {
        updateCarouselPosition();
        // itemsPerPage 변경 시, 현재 페이지가 유효한 범위 내에 있도록 조정
        // 예를 들어 3개 보다가 1개씩 보면 페이지 수가 늘어나서 현재 페이지가 너무 멀리 갈 수 있음
        const newTotalPages = Math.ceil(jobs.length / itemsPerPage);
        if (currentPage >= newTotalPages) {
            setCurrentPage(newTotalPages - 1 < 0 ? 0 : newTotalPages - 1);
        }
    }, [itemsPerPage, currentPage, updateCarouselPosition, jobs.length]);

    // 윈도우 리사이즈 이벤트 리스너
    useEffect(() => {
        const handleResize = () => {
            updateItemsPerPage();
            // 리사이즈 시 현재 위치 재조정을 위해 updateCarouselPosition 호출
            // 이 effect가 currentPage 또는 itemsPerPage 변화에 반응하므로 updateCarouselPosition은 자동으로 호출됨
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateItemsPerPage]); // 의존성 배열에 useCallback으로 감싼 함수 포함

    // '이전' 버튼 핸들러
    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // '다음' 버튼 핸들러
    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // 페이지네이션 점 클릭 핸들러
    const handleDotClick = (index) => {
        setCurrentPage(index);
    };


    // 임시 데이터 (실제로는 서버에서 데이터를 가져옵니다.)
const initialRankingData = [
  { id: 'job1', name: '음료수 상하차', score: 95, rank: 1, prevRank: 1 },
  { id: 'job2', name: '공장 야간 근무', score: 92, rank: 2, prevRank: 2 },
  { id: 'job3', name: '카페 바리스타', score: 88, rank: 3, prevRank: 3 },
  { id: 'job4', name: '편의점 야간', score: 85, rank: 4, prevRank: 4 },
  { id: 'job5', name: '식당 서빙', score: 80, rank: 5, prevRank: 5 },
];

const generateNewRankingData = (currentRankings) => {
  const newRankings = [...currentRankings];
  
  newRankings.forEach(job => {
    job.score = Math.max(0, job.score + Math.floor(Math.random() * 11) - 5);
  });
  newRankings.sort((a, b) => b.score - a.score);

  return newRankings.map((job, index) => ({
    ...job,
    prevRank: job.rank, // 이전 순위 저장
    rank: index + 1     // 새 순위 적용
  }));
};

  const [ranking, setRanking] = useState(initialRankingData);
  const animationDuration = 500; // 애니메이션 지속 시간 (ms)

  // 주기적으로 랭킹 업데이트 (실시간처럼 보이게)
  useEffect(() => {
    const interval = setInterval(() => {
      setRanking(prevRanking => {
        const newRankings = generateNewRankingData(prevRanking);
        return newRankings;
      });
    }, 3000); // 3초마다 랭킹 업데이트

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);


 return (
    <main className='maintema2'>
      <section className='leftbox'>
        {/* 기존 h1과 새로 추가할 버튼을 감싸는 div */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> {/* flexbox를 사용하여 h1과 버튼을 가로로 정렬합니다. */}
          <h1 id='leftname'>동네 알바</h1>
          {/* '동네알바 구경하러가기' 버튼 추가 */}
          <Link to={'/Gonogo'}> {/* <== 여기에 원하는 경로를 입력하세요. 예를 들어, 메인 페이지라면 '/' */}
              <button className='modern-alba-button'> {/* 여기에 클래스 이름 추가 */}
              동네알바 구경하러가기
            </button>
          </Link>
        </div>

        <div className="job-listing-container">
            <h2>최근 올라온 알바 모집</h2>

            <div ref={wrapperRef} className="job-carousel-wrapper">
    <div ref={trackRef} className="job-list-track">
        {jobs.map((job, index) => (
            // 각 job-card를 개별적인 Link로 감싸서 동적으로 이동하도록 합니다.
            <Link 
            key={job.id} // map 내부에서는 Link에 key를 넣어주세요.
            to={{
                // 1. pathname: 이동할 URL 경로 (기존과 동일하게 job.location을 활용)
                pathname: `/NewStoreC/${job.location}`, 
                // 2. state: 다음 페이지로 전달할 데이터 (job 객체 전체를 jobDetails라는 이름으로 전달)
                state: { jobDetails: job } 
            }}
            className="job-card-link" // 각 카드 링크에 필요한 스타일이 있다면 여기에 추가하세요.
                                      // 아니면 이 클래스는 제거해도 무방합니다.
        >
                {/* 기존 job-card div는 그대로 Link의 자식으로 둡니다. */}
                <div ref={el => cardRefs.current[index] = el} className="job-card">
                    <div className="job-card-header">
                        {/* 기존 헤더 내용 */}
                    </div>
                    <div className="job-card-body">
                        <p className="job-area"><strong>근무지역:</strong> {job.location}</p>
                        <p className="job-time"><strong>근무시간:</strong> {job.workTime}</p>
                        <p className="job-salary"><strong>급여:</strong> {job.salary}</p>
                        <p className="job-type"><strong>고용형태:</strong> {job.type}</p>
                    </div>
                </div>
            </Link>
        ))}
    </div>
                <button className="nav-button prev-button" onClick={handlePrev} disabled={currentPage === 0}>
                    이전
                </button>
                <button className="nav-button next-button" onClick={handleNext} disabled={currentPage >= totalPages - 1}>
                    다음
                </button>
            </div>

            <div className="carousel-pagination">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <span 
                        key={index} 
                        className={`dot ${index === currentPage ? 'active' : ''}`} 
                        onClick={() => handleDotClick(index)}
                    ></span>
                ))}
            </div>
        </div>
        {showBoardPlusButton && (
          <Link to={'/4'}>
            <button id='BoardPlus'>알바 공고</button>
          </Link>
        )}
      </section>

        <section className='rightbox'>
      <h1 id='rightname'>🔥 실시간 인기 알바 순위</h1>
      <ul className='realtime-ranking-list'>
        {ranking.map((job, index) => {
          // 순위 변동 감지
          const isRankUp = job.rank < job.prevRank;
          const isRankDown = job.rank > job.prevRank;
          const hasRankChanged = job.rank !== job.prevRank;

          return (
            <li 
              key={job.id} 
              className={`ranking-item ${isRankUp ? 'rank-up' : ''} ${isRankDown ? 'rank-down' : ''} ${hasRankChanged ? 'rank-change' : ''}`}
              // style={{'--animation-duration': `${animationDuration}ms`}} // CSS 변수로 애니메이션 시간 전달
            >
              <span className="rank-number">{job.rank}</span>
              <span className="rank-change-indicator">
                {isRankUp && <span className="arrow-up">▲</span>}
                {isRankDown && <span className="arrow-down">▼</span>}
                {!hasRankChanged && <span className="dash">-</span>}
              </span>
              <span className="job-name">{job.name}</span>
              <span className="job-score">{job.score}점</span>
            </li>
          );
        })}
      </ul>
    </section>
    </main>
  );
}




export function MainCopyright(Mainprops) {
    return (
        <MainCopyrigh top='230.5%'>
            <section className='MainCopyrightSection'>
            </section>

            <section className='MainCopyrightSection2'>
            </section>
        </MainCopyrigh>
    )
}


function MainPage() {
    return (
        <body className='Body'>
            <MainNab onChangeMode={function () { alert('Hello'); }}></MainNab>
            <Mainteam></Mainteam>
            <Mainteam2></Mainteam2>
            {/* <MainCopyright></MainCopyright> */}
        </body>
    )
}
export default MainPage ;
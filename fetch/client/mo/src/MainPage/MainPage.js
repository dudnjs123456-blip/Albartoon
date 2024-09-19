import './MainPage.css'
import React, { useState, useRef, useEffect,useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

//react icons
import { AiFillHome } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";

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
        User_Id,
        User_password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
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
                dispatch({type:"StoreName/up", LoginDATA : ''}) 
                dispatch({type:"stateLogin/Loginout", step : 'hi' })
                dispatch({type:"UserID/Login", ChangeID : ''})  
      
                alert('자동 로그아웃되었습니다.');
              }, 3000000);
      
              // 페이지 이동 시 타이머 해제
              window.addEventListener('beforeunload', () => {
                clearTimeout(logoutTimer);
              });
        } else {
          // 로그인 실패
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  





     return (
        <div className="MainNav">
            <Link to={'/'}>  <h1 className='Mainname'> 알바 toon</h1></Link>
            <ul className='MainUl' >
                {/* <div className='MainUlbefore'></div> */}

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
                     <li id='Loginout'
                     onClick = {() =>{
            dispatch({type:"StoreName/up", LoginDATA : ''}) 
          dispatch({type:"stateLogin/Loginout", step : 'hi' })
          dispatch({type:"UserID/Login", ChangeID : ''})  
        }}              
                     ><a id='lgout'>Log Out</a></li>
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
                </ul>
            </div>
        </div>
    )
}

function Mainteam() {
    const swiperRef = useRef(null)
    return (
        <div
            onMouseEnter={() => swiperRef.current.swiper.autoplay.stop()}
            onMouseLeave={() => swiperRef.current.swiper.autoplay.start()}
        >
            <Swiper
                // install Swiper modules
                ref={swiperRef}
                allowTouchMove={false}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                speed={1500}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
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
    useEffect(()=>{
        {
       const listelement = document.getElementById('leftul');
       const deletbutton = document.getElementById('leftname');
       listelement.addEventListener('click',()=>{
       const baseList = document.createElement("li");
       listelement.append(baseList);
       deletbutton.addEventListener(('click'),()=>{
           listelement.removeChild(baseList);
       })  
   })
}})
    return (
        <main className='maintema2'>
            <section className='leftbox'>
                <h1 id='leftname'>동네 알바</h1>
                <ul id='leftul'>
                    <li><a id='liMain'>알바 모집</a>
                    <a>근무지역</a>
                    <a>근무시간</a>
                    <a>급여</a>
                    <li className='leftList'>
                        <span>
                          대구광역시 북구 태전동
                          현대전원 101동 606호
                        </span>
                        <span>
                            몇 시간 어디서 무엇을 어떤 살마을 구함
                        </span>
                        <span>
                           근무시간
                        </span>
                        <span>
                           급여
                        </span>
                    </li>
                    </li>
                </ul>
                <Link to={'/4'}><button id='BoardPlus'>알바 공고</button>
                </Link>
                </section>
            

            <section className='rightbox'>
                <h1 id='rightname'>Best 알바 후기</h1>
                <ul className='MainPage_abla_review'>
                 <ul>
                    <li>여기 가게</li>
                    <li> 알바 후기</li>
                 </ul>
                </ul>
            </section>
        </main>
    )
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
            <MainCopyright></MainCopyright>
        </body>
    )
}
export default MainPage ;
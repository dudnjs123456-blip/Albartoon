import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { MainNab } from "../MainPage/MainPage";
import "./StudySearch.css"

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable, DropArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";


import { Swiper, SwiperSlide } from "swiper/react"; // basic
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css"; //basic
import "swiper/css/navigation";
import "swiper/css/pagination";

import { createSlice } from '@reduxjs/toolkit';

//bootstrap modal
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

// 리덕스
import { useSelector, useDispatch } from "react-redux"; // import 해주세요.
SwiperCore.use([Navigation, Pagination]);

function StudySearch(){
  useEffect(()=>{
    const bt4 = document.getElementById('bt4');
    bt4.addEventListener(('click'),()=>{
      console.log('bt4');
      handleShow();    
    })
  })

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // 모달상태관리


  const dispatch = useDispatch();
  const number2 = useSelector((state) => state.stateLogin.stateLogin.User_Store);
  const User_Store = useSelector((state) => state.StoreName);
  // console.log(User_Store)
  // console.log(number2);
    const buttonId = useRef();
    let QRCode = require('qrcode')
    const [onfalse,setfalse] = useState(false);
        if(onfalse === true){
            console.log(1)
        }    
    const [minutes, setMinutes] = useState(10);
    const [seconds, setSeconds] = useState(0);

    const [adbt,forbt] = useState(false);
    if(adbt === true){
      console.log(1);
      const bt = document.getElementById('bt');

    }

    if(adbt === false){
      const bt = document.getElementById('bt');
    
    }
    
    const [btd,conbtf] = useState(false);
    
    if(btd === false){
      const rightmenu = document.getElementById('rightmenu');
    }
    function useTimer(){
    useEffect(() => {
             const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
              setSeconds(parseInt(seconds) - 1);
            }
            if (parseInt(seconds) === 0) {
              if (parseInt(minutes) === 0) {
                clearInterval(countdown);
              } else {
                setMinutes(parseInt(minutes) - 1);
                setSeconds(59);
              }
            }
          }, 1000);
          return () => clearInterval(countdown); 
    },[minutes, seconds]);
  }
  useTimer();
    //리스트 true/false 판별 
    const[liststate,setliststate] = useState(true);
    function useBt(){
      useEffect(()=>{
        const clockbutton = document.getElementById('clockbutton');
        // 메뉴바 색 변경 기능
        const rightmenu = document.getElementById('rightmenu');
        const rightsc = document.getElementById('rightsc'); 
        const NewLi = document.getElementById('rightsc').getElementsByTagName('li');
        const swp = document.getElementById('swp');
        for(let i = 0; i < NewLi.length; i++ ){
          let li = NewLi[i];   
           NewLi[0].addEventListener(('click'),()=>{
            NewLi[0].style.background = 'red';
            if(liststate === false){
              swp.style.display = 'block';
            }
            if(liststate === true){
              swp.style.display = 'none';
            }
          })
          NewLi[1].addEventListener('click',()=>{
            NewLi[1].style.background = 'blue';

          })
          
        } 
          /*
            배열을 받을 때 item으로 받으면 객체로 처리 되기에 li => for문 배열 할때는 그냥 배열 안에 담아야한다
            배열을 받을 때는 function[i]로 받아야하고 item을 받을 때는 funciton.item(i)로 받아야한다
          */
          /*
            usestate를 useEffect안에서 true/false 상태로 할려면 
            usestate를 외부에서 정의해준뒤 useEffect 배열안에 state를 넣어줘야한다 -> 렌더링 되는 기준을 정해줘야 가능하다는소리
            그리고 그 해당 부분 element에 onClick={() => { setliststate(!liststate);} 이런식의 기능을 넣어줘야한다 
          */
    })}
    useBt()

    function useValue(){
      const[doList,setdolist] = useState('');
      const doData = () =>{
        fetch("http://localhost:4004/api")
        .then((response) => response.json())
        .then((data)=> setdolist(data));
    }}
  
    useValue()

    const eventsArray = [
      { title: 'event 1', date: '2024-06-01' },
      { title: 'event 2', date: '2024-06-02' }
    ];
    
    function handleDateClick(arg) {
      console.log(arg.dateStr);
    }
    
    function handleEventClick(arg) {
      console.log(arg.event.title);
    }

    const dataTrasn =(e)=>{
      e.preventDefault();
      const logname= e.target.logname.value;
      const passwordname= e.target.passwordname.value;
      const passwordcheck = e.target.passwordcheck.value;
      try{
        if(passwordname != passwordcheck){
          throw('비밀번호가 일치하지 않습니다'),
          alert('비밀번호가 일치하지 않습니다');
        }
        if(passwordname === passwordcheck){
          let logvalue =  {
            'text' : logname
          };
          console.log(logname)
              fetch("http://localhost:4004/api",{
              method : "post",
              headers : {
                "Content-Type" : "application/json",
              },
              body : JSON.stringify({
                  name : logvalue,
                  passwordname : passwordname,
                  passwordcheck : passwordcheck
              }),
            }).then((data) => console.log(data));
        }
      }catch{
        
      }

      /*addEventListener(('click'),()=>{
        window.localStorage.setItem(logvalue,logvalue);
        localStorage.getItem()
      })*/
  } 

  const[onname,setonname] = useState('')

    const onSetOnName = useCallback(e=>{
      setonname(e.target.value)
    },[])

    const[onpassword,setonpassword] = useState('')

    const onSetOnpassword = useCallback(e=>{
      setonpassword(e.target.value)
    },[])

    const[onpasswordcheck,setonpasswordcheck] = useState('')

    const onSetOnpasswordcheck = useCallback(e=>{
      setonpasswordcheck(e.target.value)
    },[])
    
    function useListPlust(){
      useEffect(()=>{
           //  누르면 li 추가되는 기능
           const atlistButton = document.getElementById('atlistButton');
           const atlist = document.getElementById('atlist');
           const atul = document.getElementById('atul');
           atlistButton.addEventListener('click',()=>{
            const dd = document.createElement('ul');
             dd.id = "uldd";
            const uldd = document.getElementById('uldd');
            
            // document.getElementById('uldd').appendChild(ddd);
            let i =0;
            let atliArray = new Array();
           for(i=1; i<3; i++){
            atliArray.push(i);
            const ddd= document.createElement('li');
            dd.append(ddd);
            }
            atlist.append(dd);
      })
      const twoPage = document.getElementById('twoPage');
      window.addEventListener("scroll", (e) => {
        console.log(window.pageYOffset);
        setTimeout(() => {
          if(window.pageYOffset>= 450){
            twoPage.style.opacity = 100 + '%';
          }else if(window.pageYOffset< 450){
            twoPage.style.opacity = 0 + '%';
          }
        }, 2000);
    });
      },[])
    }
    useListPlust()
    // console.log(number2);

    /* 웹에서 서버로 데이터 보내는 방법
      일단 submit 작업을 할 땐 form에서 onsubmit을 넣고 그 함수를
        e.preventDefault();

           const text = e.target.logname.value; 
           <-logname = input에서 name으로 지정하면 값을 가져올 수 있음

          fetch("http://localhost:4001/api",{
          method : "post",
          headers : {
            "Content-Type" : "application/josn",
          },
          body : JSON.stringify({
            user : {
              name : onname,
            },
          }),
        }).then((data) => console.log(data));
        이런식으로 데이터를 보낼 함수를 onsubmit에 넣어준다

        여기서 문제는 input에 value 값을 가져오는 것 !!

     const[onname,setonname] = useState('')
        이것은 input에 넣을 값을 지정
     
    const onSetOnName = useCallback(e=>{
      setonname(e.target.value)
    },[])
    이런식으로 value값을 가져온후 

    onchange에 onsetonname을 넣어 변화 되는 값을 감지
    value엔 onname으로 초기 값을 지정

    */

    return(
        <>
            {/* <MainNab></MainNab> */}
            <div>
            <button id="bt4">4</button>
            <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body className="ModalInput"></Modal.Body>
              </Modal>
    	{number2}
        <button onClick = {() =>{
          dispatch({type:"stateLogin/up", Loginstep : 'hi' })
        }}>
        +1
        </button>
    </div>;

    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={eventsArray}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
    />
  
        
          <section className="rightmenu" id="rightmenu" style={{ left : btd ? 70+'%' : 100+'%'}}>
            <ul className="rightsc" id="rightsc" onClick={() => { setliststate(!liststate);}}>
              <li>ds</li>
              <li>ds</li>
              <li>ds</li>
              <li>ds</li>
              <li>ds</li>
            </ul>

            <button style={{ background : adbt ? "#BB363F" : "#000"}} className="bt" id="bt" onClick={() => { forbt(!adbt);}} ></button>
            {/* 슬라이드 메뉴 */}
            <Swiper className="swp" id="swp"
      spaceBetween={50}
      slidesPerView={3}
      scrollbar={{ draggable: true }}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      speed={800}
      modules={[Navigation, Pagination,Autoplay]}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    }}
    >
      <SwiperSlide className="swpli"><a>안녕하세요</a></SwiperSlide>
      <SwiperSlide className="swpli"><a>안녕하세요 이번 생은 처음인지라입니다.</a></SwiperSlide>
      <SwiperSlide className="swpli">Slide 3</SwiperSlide>
      <SwiperSlide className="swpli">Slide 4</SwiperSlide>
      <SwiperSlide className="swpli">Slide 3</SwiperSlide>
      <SwiperSlide className="swpli">Slide 4</SwiperSlide>
      ...
    </Swiper>
          </section>

          <form>
              <input type='text'></input>
            </form>
          <div className="atlist" id="atlist">  
            <button id="atlistButton" className="atlist_Button">
              게시글 추가
            </button>
              <ul className="atul" id="atul">
                <li>Q. 정규리그 땐 연습 과정마저 좋지 않아 고민을 털어놓지 않았나. 이번 대회는 조금 달랐나?</li>
                <li>
                  <p>
                    <a>
                  연습 과정이 좋다가 안 좋았다. 
                  팀원들은 어떤 생각이었는지는 모르겠다. 
                  나는 롤드컵 안에서도, 
                  우리가 다 승리하긴 했지만 위기 상황이 되게 많았다고 생각한다. 
                  연습 과정에서 우리가 대회에 임하듯이 전력을 다해 게임을 하고 있는 게 맞나, 라는 생각을 자주 했다. 정말로 대회처럼 하고 있어도 문제고, 그게 아니라면 무척 심각하다는 얘기를 팀원들과 했다. 그 상황 안에서 감독님이 주도해 중재를 되게 잘 해주셨다. 많은 위기를 겪었지만 그 과정 속에서 다들 더 단단해졌다. 
                  </a>
                  </p>
                </li>
              </ul>

              <ul className="atul">
                <li>Q. 결승전 상대였던 T1과 연습 경기에서 자주 패하면서 사기가 저하됐다고도 들었다. </li>
                <li>
                  <p>
               
이게 아무래도 팀 게임이다 보니까 결국 다섯 명이 다 자기 역할을 해줘야 게임을 이길 수 있다. 그런데 한 명씩 계속 어긋나는 느낌을 받았다. 처음에는 한 명만 똑바로 하고, 두 번째는 두 명만, 세 번째는 세 명만 똑바로 했다. 돌이켜보면 스크림 하는 과정에서 T1이 아니었더라도 당시엔 다 패배했을 만한 경기력이었던 것 같다. 
                  </p>
                </li>
              </ul>


              </div>

          <div className="clock"  onClick={() => { conbtf(!btd);}}> 
            <div className="clocknumber">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
            <button className="clockbutton" id="clockbutton" ref={buttonId} onClick={() => { setfalse(!onfalse);}}>Start!</button>
            <button className="clockstopbutton">stop!</button>
          </div>

          <section className="twoPage" id="twoPage">
            <section className="twoPage_mainSection"></section>
          <div className="qr">
          <form method="post" action="/" onSubmit={dataTrasn}>
              <ul>
                <li>
                    <input type='text'  id="loginvalue" name="logname" 
                      value={onname}
                      onChange={onSetOnName}
                    ></input>
                    <input type='submit' id="logSubmit" value='submit'></input>
              
                </li>
              </ul>
              <ul>
                <li>
                <input type='password'  id="passowrdvalue" name="passwordname" 
                      value={onpassword}
                      onChange={onSetOnpassword}
                    ></input>
                </li>
              </ul>
              <ul>
                <li>
                <input type='password'  id="passwordcheck" name="passwordcheck" 
                      value={onpasswordcheck}
                      onChange={onSetOnpasswordcheck}
                    ></input>
                </li>
              </ul>
              </form>
          </div>
          </section>

         </>
    )
}



export default StudySearch; 
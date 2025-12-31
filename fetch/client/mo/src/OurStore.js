import React, { useState,useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MainNab } from './MainPage/MainPage';
import { useNavigate } from 'react-router-dom';
import './OurStore.css';
import Carousel from 'react-bootstrap/Carousel';
// 리덕스
import { useSelector } from "react-redux"; // import 해주세요.

//bootstrap modal
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';


const {kakao} =window;
const KaKao = () => {
    useEffect(() => {
        // kakao.maps 객체가 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
            const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
            const options = { // 지도를 생성할 때 필요한 기본 옵션
                center: new window.kakao.maps.LatLng(35.910764822289316, 128.80805620294856), // 지도의 중심좌표.
                level: 3 // 지도의 레벨(확대, 축소 정도)
            };

            const map = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

            // 만약 마커나 다른 오버레이를 추가하고 싶다면 이 아래에 추가
            // var markerPosition  = new window.kakao.maps.LatLng(35.910764822289316, 128.80805620294856);
            // var marker = new window.kakao.maps.Marker({
            //     position: markerPosition
            // });
            // marker.setMap(map);

        } else {
            console.warn("Kakao Maps SDK가 로드되지 않았습니다.");
            // SDK가 로드될 때까지 기다리거나 사용자에게 안내할 수 있습니다.
        }
    }, []); // 컴포넌트가 마운트될 때 한 번만 실행

    return (
        // ✨ id='map' div에 직접 스타일을 적용합니다. ✨
        // 지도 정보 오버레이를 추가하려면 이 div 안에 다른 div를 만들 수 있습니다.
        <div id='map'>
            {/* ✨ (선택 사항) 지도 정보 오버레이 예시 - 이 정보는 서버에서 가져올 수도 있습니다. */}
            <div className="map-info-overlay">
                <h3>우리 가게</h3>
                <p>대구광역시 북구 어디어디동 123-45</p>
                <p>문의: 053-1234-5678</p>
                <a href="https://map.kakao.com/" target="_blank" rel="noopener noreferrer" className="view-larger">
                    크게 보기
                </a>
            </div>
        </div>
    );
}


function OurStore(){
    // 가게 모달
    useEffect(()=>{
        const MemberPlus = document.getElementById('MemberPlus');
        MemberPlus.addEventListener(('click'),()=>{
          handleShow();    
        })
      })
        //모달 상태정리
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

    //모달 input값 처리
    const[StoreUserInputPlus,setStoreUserInputPlus] = useState('')
            
    const onSetStoreUserInputPlus = useCallback(e=>{
        setStoreUserInputPlus(e.target.value);
    },[]);

    // 유저 ID 데이터 받기    
    const UserIDtext = useSelector((state) => state.UserID);
    const UserFullID= UserIDtext.UserID.ID;
    // 모달 인풋값 fetch
    function MemberIDPlus(e){
        e.preventDefault();
        fetch("http://localhost:10001/StoreMemberPlus",{
            method : "post",
            headers : {
              "Content-Type" : "application/json",
            },
            body : JSON.stringify({
             MemberID :  StoreUserInputPlus,
             UserFullID : UserFullID
            }), 
          })
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            alert(data.message)
            alert(data[data.length - 1].text);
            window.location.href = "/OurStore";
          });
    }
   

    // DB데이터 가져오기
    const Loginstate = useSelector((state) => state.stateLogin.stateLogin.value);
    const UserFullName = Loginstate.replace('님  반갑습니다!', '');
    const UserIDtext1 = useSelector((state) => state.UserID);
    const UserFullID1= UserIDtext1.UserID.ID;
    // 데이터값 갱신
    const [storeName, setStoreName] = useState('');
    const [representativeUser, setrepresentativeUser] = useState('');
    const [representativeNumber, setrepresentativeNumber] = useState('');
    const [representativeTel, setrepresentativeTel] = useState('');
    const [Stroelocation, setStroelocation] = useState('');
    const [userNames, setUserNames] = useState([]); // userNames 상태 초기화
  
    // ✨ 1. 현재 활성화된 캐러셀 아이템의 인덱스를 저장할 상태를 만들어! ✨
    const [index, setIndex] = useState(0); // 맨 처음에는 첫 번째 아이템(인덱스 0)이 보이게!

    // ✨ 2. 사용자가 캐러셀 네비게이션(점 또는 화살표)을 클릭했을 때 호출될 함수를 만들어! ✨
    const handleSelect = (selectedIndex, e) => {
        // selectedIndex는 사용자가 클릭한 아이템의 인덱스 번호야!
        setIndex(selectedIndex); // 상태를 업데이트! 이제 캐러셀이 이 인덱스에 해당하는 아이템을 보여줄 거야!
        console.log('캐러셀 인덱스 변경:', selectedIndex); // 확인용 로그
    
      };
    useEffect(() => {
        // 데이터를 받아오는 비동기 함수 호출
        fetchData();
    }, []);
    function fetchData(){
    fetch('http://localhost:10001/StoreDB2',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            UserFullID1
        })
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data.
          userNames
          )
          setUserNames(data.userNames);
        // console.log(data[data.length-1])
        const storeName = data.storeStates[data.storeStates.length - 1].User_StoreName;
        const representativeUser =  data.
        storeStates[data.storeStates.length - 1].representative_User;
        const representativeNumber =  data.
        storeStates[data.storeStates.length - 1].representative_Number;
        const representativeTel = data.
        storeStates[data.storeStates.length - 1].representativeTel;
        const Stroelocation = data.
        storeStates[data.storeStates.length - 1].Stroe_location;
        setStoreName(storeName);
        setrepresentativeUser(representativeUser);
        setrepresentativeNumber(representativeNumber);
        setrepresentativeTel(representativeTel);
        setStroelocation(Stroelocation);
    
        })  
    }
    const navigate = useNavigate();

    useEffect(() => {
      // 로그인 상태 확인을 위한 API 호출
      const checkSession = async () => {
        try {
          const response = await axios.get('http://localhost:10001/checkSession'); // API 호출
          console.log("로그인 상태 확인 결과:", response.data);
          
          if (response.data.loggedIn) {
            console.log("현재 로그인 상태:", response.data.user);
          } else {
            console.log("현재 로그인 상태: 없음");
            alert("로그인을 하셔야 합니다."); // 팝업 메시지
            navigate('/'); // 메인 페이지로 이동
          }
        } catch (error) {
          console.error("세션 확인 중 오류 발생:", error);
        }
      };
  
      checkSession(); // 세션 확인 함수 호출
  
    }, [navigate]);

    

    return (
      <body>
    
    <MainNab></MainNab>
    <header className='Store_Name'>
        <h1>{storeName}</h1>
     </header>
    <aside className='aside'>
        {/* <button id='MemberPlus'>멤버 추가하기</button> */}
        <button class="btn-8" id='MemberPlus'><span>인원 추가하기</span></button>
        <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className='MemberPlusModal'>
        <h2 className='aside_storeName'>{storeName}</h2>
            <a>
                가게에 인원을 추가하고 싶으시다면 <br></br>
                해당 인원을 아이디를 적고 추가하기를 눌러주세요
            </a>
            <form className='MemberPlusUI' onSubmit={MemberIDPlus}>
                <input type={'text'} value={StoreUserInputPlus} 
                onChange={onSetStoreUserInputPlus}></input>
                <button>추가하기</button>
            </form>
        </Modal.Body>
            </Modal>
        <ul className='Memberul'>
            <a>가게 멤버들</a>
<ul>
  {userNames.map((userName, index) => (
    <li key={index}>{userName}</li>
  ))}
</ul>

        </ul>
    </aside>
     <KaKao></KaKao>
     <main className='Store_Main'>
     <Carousel 
                className='Carousel_list'
                activeIndex={index}      // 지금 몇 번째 아이템을 보여줄지 activeIndex 상태 값을 연결!
                onSelect={handleSelect}  // 네비게이션이 클릭되면 handleSelect 함수를 호출해!
                // 혹시 자동 슬라이드를 멈추고 싶으면 여기에 interval={null} 을 추가할 수도 있어!
                // indicators={true} // 점 네비게이션을 보이게 하려면 (기본값이라 보통 없어도 보이긴 해!)
                // controls={true} // 화살표 네비게이션을 보이게 하려면 (기본값이라 보통 없어도 보이긴 해!)
            >
                {/* 이미지 경로 수정하고 alt 속성도 꼭 넣어줘! */}
                <Carousel.Item>
                    <img src='/메이플1.jpeg' alt='메이플 이미지 1' /* 이미지 스타일 조정 CSS 클래스를 여기에 넣거나 별도 CSS 파일에 정의해줘! */ />
                </Carousel.Item>
                <Carousel.Item>
                    <img src='/메이플2.png' alt='메이플 이미지 2' /* 이미지 스타일 조정 CSS 클래스를 여기에 넣거나 별도 CSS 파일에 정의해줘! */ />
                </Carousel.Item>
                 <Carousel.Item>
                 <img src='/메이플4.jpg' alt='메이플 이미지 2' /* 이미지 스타일 조정 CSS 클래스를 여기에 넣거나 별도 CSS 파일에 정의해줘! */ />
                </Carousel.Item>
                {/* Carousel.Item 개수만큼 네비게이션 점이 자동으로 생길 거야! */}

            </Carousel>
      {/* <span className='Store_Mainbox'></span> */}
            <div className='Store_Mn'>
                <ul>
                    <li>가게내용</li>
                     <li>대표님 : {representativeUser}</li>
                     <li>대표님 전화번호 : {representativeTel}</li>
                     <li>가게위치 : {Stroelocation}</li>
                     <li>사업자번호 : {representativeNumber}</li>
                </ul>
            </div>
        </main>
        </body>
    )
}
  export default OurStore;
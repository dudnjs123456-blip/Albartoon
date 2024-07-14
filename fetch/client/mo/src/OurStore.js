import React, { useState,useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MainNab } from './MainPage/MainPage';
import './OurStore.css';
import Carousel from 'react-bootstrap/Carousel';
// 리덕스
import { useSelector } from "react-redux"; // import 해주세요.

//bootstrap modal
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const {kakao} =window;
function KaKao(){
    useEffect(()=>{
        const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        const options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(35.910764822289316, 128.80805620294856), //지도의 중심좌표.
            level: 3 //지도의 레벨(확대, 축소 정도)
        };
        
        const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        
    },[]);
    return(
        <div id='map'></div>
    )
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
    const [UserList, setUserList] = useState([]);
    console.log(UserList);
    // UserList.splice(UserList.length - 1, 1); // 마지막 요소 제거

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
        // console.log(data[data.length-1])
        const storeName = data[data.length - 1].User_StoreName;
        const representativeUser =  data[data.length - 1].representative_User;
        const representativeNumber =  data[data.length - 1].representative_Number;
        const representativeTel = data[data.length - 1].representativeTel;
        const Stroelocation = data[data.length - 1].Stroe_location;
        setStoreName(storeName);
        setrepresentativeUser(representativeUser);
        setrepresentativeNumber(representativeNumber);
        setrepresentativeTel(representativeTel);
        setStroelocation(Stroelocation);
        const filteredDataArray = data.map(obj => {
            return Object.keys(obj)
              .filter(key => key.startsWith('가게 멤버들'))
              .reduce((newObj, key) => {
                newObj[key] = obj[key];
                return newObj;
              }, {});
          });
        // Object.keys()와 filter를 사용하여 특정 패턴을 가진 키만 추출
        const keysSorted = Object.keys(filteredDataArray[0]).filter(key => key.startsWith('가게 멤버들')).sort();
     // 추출된 키를 사용하여 값을 순서대로 출력
        keysSorted.forEach(key => {
        const UserList = filteredDataArray[0][key]; 
        // setUserList를 사용하여 UserList에 user 추가
        setUserList(prevUserList => [...prevUserList, UserList]);
            });
        })  
    }

    return (
        <body>
    <MainNab></MainNab>
    <header className='Store_Name'>
        <h1>{storeName}</h1>
     </header>
    <aside className='aside'>
        <button id='MemberPlus'>멤버 추가하기</button>
        <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className='MemberPlusModal'>
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
            {UserList.map((UserList, index) => (
        <li key={index}>{UserList}</li>
      ))}
        </ul>
    </aside>
     <KaKao></KaKao>
     <main className='Store_Main'>
        <Carousel className='Carousel_list'>
            <Carousel.Item><img src='홍대.jpeg'></img></Carousel.Item>
             <Carousel.Item></Carousel.Item>
             <Carousel.Item></Carousel.Item>
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
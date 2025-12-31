import { QRCodeCanvas } from 'qrcode.react';
import React, { useState,useEffect ,useRef} from 'react';
import { MainNab } from './MainPage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // css import
import { Modal, Button } from 'antd'; // 모달과 버튼을 Ant Design으로 사용
import { useTable } from 'react-table';
// 리덕스
import { useSelector } from "react-redux"; // import 해주세요.
import './Schedule.css';

function Schedule(){

    const [buttonState, setButtonState] = useState('출근'); // 초기 상태는 '출근'
    const [StartTime, setStartTime] = useState([]);

  
    const extractHour = (timeString) => {
      // 시간 문자열에서 시간 부분만 추출 (예: "10:2:16" -> "10")
      return timeString.split(':')[0];
    };
    
    const extractIntervalHour = (interval) => {
      // interval 문자열에서 시작 시간 부분만 추출 (예: "03:00 ~ 04:00" -> "03")
      return interval.split(' ~ ')[0].split(':')[0];
    };
       // DB데이터 가져오기
       const Loginstate = useSelector((state) => state.stateLogin.stateLogin.value);
       const UserFullName = Loginstate.replace('님  반갑습니다!', '');
       const UserIDtext1 = useSelector((state) => state.UserID);
       const UserFullID1= UserIDtext1.UserID.ID;
       // 데이터값 갱신
       const [storeName, setStoreName] = useState('');
       const [DateUserName, setDateUserName] = useState('');
       const [representativeUser, setrepresentativeUser] = useState('');
       const [representativeNumber, setrepresentativeNumber] = useState('');
       const [representativeTel, setrepresentativeTel] = useState('');
       const [Stroelocation, setStroelocation] = useState('');
       const [UserList, setUserList] = useState([]);
       const [scheduleData, setScheduleData] = useState(null);

// 현재 날짜를 "YYYY-MM-DD" 형식으로 얻기
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
const day = String(today.getDate()).padStart(2, '0'); // 일자
const [closestTime, setClosestTime] = useState(null); // closestTime 상태 추가
const formattedDate = `${year}-${month}-${day}`;
const [SubformattedDiff, setSubformattedDiff] = useState('');


const [buttontest, setbuttontest] = useState(false);


useEffect(() => {
    // buttontest가 true일 때 buttonState를 업데이트
            // useEffect가 실행될 때 콘솔에 메시지 출력
            console.log('useEffect가 실행되었습니다. 현재 buttontest:', buttontest);
    if (buttontest) {
        updateButtonState();
    }
}, [buttontest]);

const updateButtonState = () => {
    // buttonState가 '출근'이 아닐 경우에만 상태를 새로 설정
    if (buttonState === '출근') {
        setButtonState('멈춤'); // '출근'에서 '멈춤'으로 변경
    } else if (buttonState === '멈춤') {
        setButtonState('다시시작'); // '멈춤'에서 '다시시작'으로 변경
    } else if (buttonState === '다시시작') {
        setButtonState('퇴근'); // '다시시작'에서 '퇴근'으로 변경
    } else {
        setButtonState('출근'); // '퇴근'에서 다시 '출근'으로 변경
    }
};
const handleWorkToggle = () => {
  if (buttonState === '출근') {
    setButtonState('멈춤');
    setbuttontest(true);
    handleStartStop();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}:${seconds}`;


    setCurrentTime(currentTimeString);
    console.log(`버튼 클릭 시간: ${currentTimeString}`);
    // setStartTime([...StartTime, currentTimeString]);
    // localStorage.setItem('workStartTime', now);
  
    fetch('http://localhost:10001/schduleStart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time: currentTimeString,
        storeName: storeName,
        userId: UserFullID1,
        userName: UserFullName,
        isRunning: false,
        today: formattedDate
      })
    })
    .then(response => {
      // 응답이 JSON 형식일 경우
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // JSON으로 변환
    })
    .then(data => {
      const updatedScheduleData = [...scheduleData]; // 기존 데이터를 복사
updatedScheduleData[0] = data.retrievedData[0]; // 0번 인덱스를 새로운 데이터로 덮어쓰기

// 상태에 저장
setScheduleData(updatedScheduleData);
      console.log(data.retrievedData[0]); // 받아온 데이터를 콘솔에 출력
      // setScheduleData(data.retrievedData[0]); // 데이터를 상태에 저장
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
    
  } 
 
  
  if (buttonState === '멈춤') {
    setButtonState('다시 시작');
    handleStartStop();
    setbuttontest(false);
    // Fetch로 데이터 전송
    fetch('http://localhost:10001/RunState', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isRunning: true,
        userId: UserFullID1,
        currentTime: new Date().toISOString().split('.')[0] + 'Z' // 밀리초 제거
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json(); // 응답을 JSON으로 변환
      }
      throw new Error('Network response was not ok'); // 오류 처리
    })
    .then(data => {
      console.log(data); // 서버로부터 받은 데이터를 콘솔에 출력
  
      // StartTime 값을 다른 변수에 저장
      if (data.length > 0) {
        const startTimeValue = data[0].StartTime; // 첫 번째 요소의 StartTime 값
        console.log('StartTime:', startTimeValue); // StartTime 값을 콘솔에 출력
        // 필요한 다른 작업을 수행할 수 있습니다.
      } else {
        console.log('No data found'); // 데이터가 없을 경우
      }
  
      setButtonState('다시 시작');
    })
    .catch(error => {
      console.error('Error:', error); // 오류를 콘솔에 출력
    });
  }
  
  
  if (buttonState === '다시 시작') {
    handleStartStop();
    setButtonState('멈춤');
    setbuttontest(true);
    console.log(closestTime)
    console.log('멈춤');
    fetch('http://localhost:10001/RunState', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: UserFullID1,
        isRunning: false
      })
    })
    .then(response => {
      // 첫 번째 .then: 응답 객체 자체를 받습니다.
      console.log('Fetch 응답 객체 (메타데이터):', response);
  
      if (!response.ok) {
        // 응답 상태가 성공(2xx)이 아니면 오류를 던져서 .catch 블록으로 넘어가게 합니다.
        // 이렇게 하면 오류가 발생했을 때도 응답 본문(오류 상세 정보 등)을 읽을 수 있습니다.
        // response.json() 또는 response.text()를 호출하여 오류 응답의 본문을 얻을 수 있습니다.
        return response.json().then(errorData => { // 오류 응답 본문이 JSON이라고 가정
          throw new Error(`서버 오류: ${response.status} ${response.statusText}`, { cause: errorData });
        });
      }
  
      // 응답이 성공적이면, 응답 본문을 JSON으로 파싱하여 다음 .then으로 넘깁니다.
      // response.json() 메서드는 JSON 파싱이 완료된 데이터를 담은 Promise를 반환합니다.
      return response.json();
    })
    .then(data => {
      // 두 번째 .then: response.json()이 파싱한 실제 데이터가 여기에 전달됩니다.
      console.log('서버에서 받은 실제 데이터 (JSON):', data);
  
      // 여기에서 받은 'data' 객체를 가지고 setButtonState 등의 로직을 수행합니다.
      // 예: 만약 서버 응답 데이터에 { status: 'success' } 이런 내용이 있다면...
      // if (data && data.status === 'success') {
         setButtonState('멈춤');
         setScheduleData(data)
      // } else {
         // 서버 응답 데이터로 다른 처리를 할 수 있습니다.
      // }
  
    })
    .catch(error => {
      // fetch 요청 자체 오류 또는 첫 번째 .then에서 던진 오류를 처리합니다.
      console.error('Fetch 요청 또는 응답 처리 중 오류 발생:', error);
      // 오류 객체에 cause 속성이 있다면 더 상세한 오류 정보를 볼 수 있습니다.
      if (error.cause) {
        console.error('오류 상세 정보:', error.cause);
      }
      // 사용자에게 오류 메시지를 보여주는 등의 처리를 할 수 있습니다.
    });
  
  }
};
    const [finishTime, setfinishTime] = useState([]);
    const [savedSeconds, setSavedSeconds] = useState(0);
    const handleLeave = () => {
      const now = new Date();
      // setbuttontest('');
      const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      // 현재 시간을 콘솔에 출력
      console.log(`퇴근 시간: ${currentTimeString}`, isRunning);
      setCurrentTime(currentTimeString);
      setfinishTime([...finishTime, currentTimeString]); // 퇴근 시간 저장
      setSavedSeconds(savedSeconds + seconds); // 현재 초를 저장
  
      setSeconds(0);
      // localStorage.setItem('timerSeconds', 0);
      executeRemainingCode();
  
      fetch('http://localhost:10001/schdulefinish', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              UserFullName: UserFullName,
              isRunning: '2',
              finishTime: currentTimeString, // 두 자리 형식으로 포맷된 시간 전송
          })
      })
      .then(response => response.json()) // 응답을 JSON으로 변환
      .then(data => {
          // 응답 데이터 콘솔에 출력
     // scheduleData의 0번 인덱스를 data.selectResult[0]로 덮어쓰기
const updatedScheduleData = [...scheduleData]; // 기존 데이터를 복사
updatedScheduleData[0] = data.selectResult[0]; // 0번 인덱스를 새로운 데이터로 덮어쓰기

// 상태에 저장
setScheduleData(updatedScheduleData);

// 콘솔 로그로 확인
console.log(updatedScheduleData);
console.log('서버 응답:', data.selectResult[0]);
    
      })
      .catch(error => {
          console.error('Error:', error);
      });
  
      setButtonState('출근'); // '퇴근' 버튼 클릭 시 상태를 '출근'으로 변경
      setIsRunning('2'); // isRunning을 초기 상태로 설정
  };
  
  
      

      function convertSecondsToMinutesAndHours(savedSeconds){
        const minutes = Math.floor(savedSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingSeconds = savedSeconds % 60;
        const remainingMinutes = minutes % 60;
      
        return `${hours}시 ${remainingMinutes}분 ${remainingSeconds}초`
      }

      const result = convertSecondsToMinutesAndHours(savedSeconds);


      function executeRemainingCode() {
        if (StartTime.length === 0 || finishTime.length === 0) {
          console.error("StartTime 또는 finishTime 배열이 비어 있습니다.");
          return;
        }
      
        const startTime1 = StartTime[0];
        const endTime1 = finishTime[0];
      
        // startTime1과 endTime1이 정의되어 있는지 확인
        if (!startTime1 || !endTime1) {
          console.error("startTime1 또는 endTime1이 정의되어 있지 않습니다.");
          return;
        }
      
        const [startHours, startMinutes, startSeconds] = startTime1.split(':').map(Number);
        const [endHours, endMinutes, endSeconds] = endTime1.split(':').map(Number);
      
        const totalStartSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
        const totalEndSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;
        const diff = totalEndSeconds - totalStartSeconds;
      
        console.log(diff);
      }  

    const [currentTime, setCurrentTime] = useState('');
/*
  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 저장소에서 출근 시간 불러오기
    const storedTime = localStorage.getItem('workStartTime');
    if (storedTime) {
      setCurrentTime(storedTime);
    }
  }, []);
*/


    let [seconds, setSeconds] = useState(
        // 로컬 스토리지에서 초 상태를 불러오거나 기본값 0을 사용
        Number(localStorage.getItem('timerSeconds')) || 0
      );
      const [lastTime, setLastTime] = useState(()=>{
        const saved = localStorage.getItem('lastTime');
        const initialValue = JSON.parse(saved);
        return initialValue || 0;
      }); // 마지막 시간 저장을 위한 상태 추가
 
       // 컴포넌트가 마운트될 때 로컬 스토리지에서 마지막 시간을 불러옴
        useEffect(() => {
            const lastTimeFromStorage = localStorage.getItem('lastTime');
            if (lastTimeFromStorage) {
            setLastTime(parseInt(lastTimeFromStorage, 10));
             }
         }, []);
      const [isRunning, setIsRunning] = useState(
        // 로컬 스토리지에서 실행 상태를 불러오거나 기본값 false를 사용
        localStorage.getItem('timerIsRunning') === 'true'
      );
    

      useEffect(() => {
        let interval = null;
        if (isRunning) {
          interval = setInterval(() => {
            setSeconds((prevSeconds) => {
              const newSeconds = prevSeconds + 1;
              // 초 상태를 로컬 스토리지에 저장
              localStorage.setItem('timerSeconds', newSeconds);
              return newSeconds;
            });
          }, 1000);
        }
        return () => clearInterval(interval);
      }, [isRunning]);
    
      
    
      const handleStartStop = () => {
        setIsRunning(!isRunning);
      };
 
    
      // 초를 시간, 분, 초로 변환
      const trRefs = useRef([]);



    // 시간 tr  만들기
    const [intervals, setIntervals] = useState([]);
    useEffect(() => {
        const timeIntervals = createTimeIntervals();
        setIntervals(timeIntervals);
      }, []);
    
const createTimeIntervals = () => {
  const intervals = [];
  for (let hour = 0; hour < 24; hour++) {
    const startTime = hour.toString().padStart(2, '0') + ":00";
    const endTime = (hour + 1).toString().padStart(2, '0') + ":00";
    intervals.push(`${startTime} ~ ${endTime}`);
  }
  return intervals;
};
// 현재 시간
function getTimeSlot(hour) {
    // 숫자를 문자열로 변환하고, padStart()를 사용하여 두 자리 숫자 형식으로 만듦
    const hourStr = String(hour).padStart(2, '0');
    const nextHourStr = String(hour + 1).padStart(2, '0');
  
    // 시간대 문자열 생성
    return `${hourStr}:00 ~ ${nextHourStr}:00`;
  }
  
//   console.log(getTimeSlot(currentHour)); // '09:00 ~ 10:00'
const [currentHour, setCurrentHour] = useState(new Date().getHours());

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentHour(new Date().getHours());
  }, 1000); // 매 1초마다 현재 시간의 '시' 업데이트

  return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
}, []);

    // 시간 만들기  
    const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000); // 매 1초마다 현재 날짜와 시간 업데이트

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);
    

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
             UserFullID1,
             today: formattedDate
         })
     })
     .then(response => response.json())
     .then(data =>{
         console.log(data.userNames)
         const storeName = data.storeStates[0].User_StoreName;
         const representativeUser =  data.storeStates[0].representative_User;
         const representativeNumber =  data.storeStates[0].representative_Number;
         const representativeTel = data.storeStates[0].representativeTel;
         const Stroelocation = data.storeStates[0].Stroe_location;
         setStoreName(storeName);
         setrepresentativeUser(representativeUser);
         setrepresentativeNumber(representativeNumber);
         setrepresentativeTel(representativeTel);
         setStroelocation(Stroelocation);
         setUserList(data.userNames)
         })

         console.log(UserList)
        }

         
         useEffect(() => {
          // 버튼 상태를 콘솔에 출력
          console.log(`useEffect 실행됨 - 현재 버튼 상태: ${buttonState}`);
      
          if (!UserFullID1 || !formattedDate) {
              console.warn('UserFullID1 또는 formattedDate가 설정되지 않았습니다.');
              return;
          }
      
          // 서버에서 저장된 데이터 불러오기
          fetch('http://localhost:10001/schduleLoding', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  UserFullID1, 
                  today: formattedDate
              })
          })
          .then(response => response.json())
          .then(data => {
              console.log(data); // 서버에서 가져온 데이터를 콘솔에 출력
              setScheduleData(data); // 데이터를 상태에 저장
              console.log(scheduleData)

              const now = new Date();
              let closestDiff = Infinity; // 무한대 값으로 초기화
              let foundClosestTime = null;
      
              // 현재 시간과 가장 가까운 StartTime 찾기
              data.forEach(item => {
                  if (item.MemberId === UserFullID1) { // MemberId가 UserFullID1과 일치하는 경우
                      const [hours, minutes, seconds] = item.StartTime.split(':').map(Number);
                      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
                      
                      // 현재 시간과의 차이 계산
                      const timeDifference = Math.abs(now - startTime); // 밀리초 단위
      
                      // 가장 가까운 시간을 찾기
                      if (timeDifference < closestDiff) {
                          closestDiff = timeDifference;
                          foundClosestTime = item; // 해당 아이템 저장
                      }
                  } 
              });
      
              // closestTime 상태 업데이트
              console.log(foundClosestTime);
              if (foundClosestTime) {
                  setClosestTime(foundClosestTime);
                  console.log(isRunning)
                  console.log(`현재 시간과 가장 가까운 StartTime: ${foundClosestTime.StartTime}, MemberName: ${foundClosestTime.MemberName}, runningState: ${foundClosestTime.runningState}, finishTime: ${foundClosestTime.finishTime}`);
      
                  // formattedDiff 계산
                  const startTimeStr = foundClosestTime.StartTime;
                  const [startHours, startMinutes, startSeconds] = startTimeStr.split(':').map(Number);
                  const startTime = new Date();
                  startTime.setHours(startHours, startMinutes, startSeconds);
      
                  // 현재 시간과의 차이 계산
                  const timeDifference = Math.abs(now - startTime); // 밀리초 단위
      
                  // 시간, 분, 초로 변환
                  const differenceInSeconds = Math.floor(timeDifference / 1000); // 초 단위로 변환
                  const diffHours = Math.floor(differenceInSeconds / 3600); // 시간
                  const diffMinutes = Math.floor((differenceInSeconds % 3600) / 60); // 분
                  const diffSeconds = differenceInSeconds % 60; // 초
                  const calculatedSubformattedDiff = `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`;
      
                  setSubformattedDiff(calculatedSubformattedDiff); // 상태 업데이트
      
                  // 콘솔에 경과 시간 출력 
                  console.log(`경과 시간: ${calculatedSubformattedDiff}`);
                  // buttonState 결정 및 설정
                  if (foundClosestTime.finishTime === null && foundClosestTime.runningState === '1') {
                      setButtonState("다시 시작");
                  } else if (foundClosestTime.finishTime !== null && foundClosestTime.runningState === '0') {
                      setButtonState("출근");
                  } else {
                      setButtonState("멈춤");
                  }
      
                  // foundClosestTime.finishTime 값이 바뀔 때마다 콘솔에 출력
                  console.log(`현재 finishTime: ${foundClosestTime.finishTime}`);
      
                  // buttonState 상태 확인
                  console.log(`최종 버튼 상태: ${buttonState}`);
              } else {
                  console.log('일치하는 MemberId가 없습니다.');
              }
          })
          .catch(error => {
              console.error('Error fetching data:', error);
          });
      }, [buttontest]);
      
        
      useEffect(() => {
        console.log(`최종 버튼 상태: ${buttonState}`);
        console.log('scheduleData 상태:', scheduleData);
      }, [buttonState]);

      


    return (
        <body className='Mainbody'>
        <MainNab />
        {/* <h1 className="qrCodeH">우리가게 QR코드</h1> */}
        
        <section className='qrPage_MainSextion'>
          <div className='qrPage_Schedule'>
            <div className='currentDateTime'>
              현재 날짜와 시간: {currentDateTime}
            </div>
            <h1 className='storeName'>{storeName}</h1>
            <table className='schduleTable'>
              <thead>
                <tr>
                  <th></th>
                  {UserList.map((user, index) => (
                    <th key={index}>{user}</th> 
                  ))}
                </tr>
              </thead>
              <tbody> 
  {intervals.map((interval, index) => (
    <tr key={index} id={`tr-${index}`} ref={(el) => (trRefs.current[index] = el)}>
      <td>
        {interval}
      </td>
      {UserList.map((user, userIndex) => (
        <td key={userIndex} className='User_td' style={{ 
          backgroundColor: scheduleData.some(item => 
            item.MemberName === user && 
            extractHour(item.StartTime) === extractIntervalHour(interval)
          ) ? 'gray' : 'transparent' 
        }}>
          {(() => {
            const currentDate = new Date();
            const currentDay = new Date(currentDate.getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];

            const foundItem = scheduleData.find(item => {
              const itemToday = new Date(new Date(item.today).getTime() + (9 * 60 * 60 * 1000));
              const itemFormattedDay = itemToday.toISOString().split('T')[0];
              
              return (
                item.MemberName === user && 
                extractHour(item.StartTime) === extractIntervalHour(interval) &&
                itemFormattedDay === currentDay // 오늘 날짜와 비교
              );
            });

            if (!foundItem) {
              return null; // foundItem이 없으면 null 반환
            }

                 // 여기부터 시간을 "HH:MM:SS" 형태로 바꿀 거야!
                 const day = new Date(foundItem.today).getDate(); // 이건 그대로!
                 const formattedDay = String(day).padStart(2, '0'); // 이것도 그대로!
                 const now = new Date(); // 현재 시간 가져오기!
     
                 const [startHours, startMinutes, startSeconds] = foundItem.StartTime.split(':').map(Number);
                 // 일단 원래 StartTime 시점을 만들어!
                 const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes, startSeconds);
             
                 // --- 여기서부터 빼고 싶은 시간을 적용할 거야! ---
     
                 // 빼고 싶은 시간 (예: "00:34:23")이 들어있는 변수라고 가정!
                 // 이 변수 이름은 네 코드에 맞게 바꿔야 해!
                 const timeToSubtractStr = foundItem.TotalStopTime; // <<< --- 여기에 빼고 싶은 시간 문자열 넣어줘!
     
                 // 1. 빼고 싶은 시간 문자열을 '총 몇 초'인지 숫자로 바꿔주는 함수 (아까 그 함수 재활용!)
                 function parseHHMMSSStringToSeconds(timeString) {
                     if (!timeString) return 0; 
                     const parts = timeString.split(':').map(Number);
                     if (parts.length === 3) {
                         return parts[0] * 3600 + parts[1] * 60 + parts[2];
                     }
                     console.error("시간 형식이 이상해요:", timeString);
                     return 0;
                 }
     
                 // 2. 빼고 싶은 시간 (HH:MM:SS)을 초 단위로 변환
                 const secondsToSubtract = parseHHMMSSStringToSeconds(timeToSubtractStr);
     
                 // 3. 초 단위를 밀리초 단위로 변환 (Date 객체는 밀리초로 계산하니까!)
                 const millisecondsToSubtract = secondsToSubtract * 1000;
     
                 // 4. 원래 startTime 시점의 밀리초 값에서 빼고 싶은 시간 밀리초를 빼!
                 const adjustedStartTimeMs = startTime.getTime() - millisecondsToSubtract;
     
                 // 5. 계산된 새로운 밀리초 값으로 '조정된 시작 시점' Date 객체를 새로 만들어!
                 const adjustedStartTime = new Date(adjustedStartTimeMs);
     
                 // 이제 startTime 대신 adjustedStartTime을 사용해서 계산하면 돼!
                 // 예: adjustedStartTime부터 현재까지의 시간 차이 계산
                 // 아까 코드에서 now와 startTime의 차이를 구했던 부분 👇
                 // let diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                 // 이 부분을 요렇게 바꿔! 👇
                 let diffInSeconds = Math.floor((now.getTime() - adjustedStartTime.getTime()) / 1000);
     
     
                 // --- 시간 차이 계산 및 포맷팅은 아까 코드랑 똑같아! ---
             
                 // 시, 분, 초로 변환
                 const hoursDiff = Math.floor(diffInSeconds / 3600);
                 const minutesDiff = Math.floor((diffInSeconds % 3600) / 60);
                 const secondsDiff = diffInSeconds % 60;
             
                 // 각 부분을 두 자릿수로 포맷팅 (예: 5 -> 05)
                 const formattedHours = String(hoursDiff).padStart(2, '0');
                 const formattedMinutes = String(minutesDiff).padStart(2, '0');
                 const formattedSeconds = String(secondsDiff).padStart(2, '0');
     
                 // "HH:MM:SS" 형태로 합치기
                 const formattedNaturalDiff = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
                 
                 // 이제 formattedNaturalDiff 변수에 '조정된 시작 시점'부터 현재까지의 시간 차이가 "HH:MM:SS" 형태로 잘 들어가 있을 거야!
     
                 // ... (나머지 코드) ...
     
      


            if (foundItem.runningState === '0' && foundItem.finishTime === null) {
              return (
                <>
                  { <p>멈춤시간 {foundItem.TotalStopTime}</p> }
                  <p>({formattedDay}) 근무시작 시간 : {foundItem.StartTime}</p>
                  <p>경과 시간: { formattedNaturalDiff}</p>
                  <p>근무 상태: 진행</p> {/* '0'일 경우 보여줄 내용 */}
                </>
              );
            } else if (foundItem.runningState === '1') {
              return (
                <>
                  <p>({formattedDay}) 근무시작 시간 : {foundItem.StartTime}</p>
                  <p>추가 시간: {SubformattedDiff}</p>
                  <p>근무 상태: 멈춤</p> {/* '0'일 경우 보여줄 내용 */}
                </>
              );
            }

            return null; // 어떤 경우에도 해당하지 않으면 null 반환
          })()}
        </td>
      ))}
    </tr>
  ))}
</tbody>

            </table>
            <div>
              <h2 className='formattedDay'>근무시간: {convertSecondsToMinutesAndHours(savedSeconds)}</h2>
            </div>
            {buttonState !== '퇴근' ? ( 
              <button className='Startbutton'  onClick={handleWorkToggle}>{buttonState}</button>
            ) : (
              <button className='Startbutton' onClick={handleLeave}>퇴근</button>
            )}
            {buttonState !== '출근' && <button  className='Startbutton' onClick={handleLeave}>퇴근</button>}
          </div>
        </section>
      </body>
    )
}

  export default Schedule;


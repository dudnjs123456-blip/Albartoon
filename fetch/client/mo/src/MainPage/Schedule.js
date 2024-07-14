import { QRCodeCanvas } from 'qrcode.react';
import React, { useState,useEffect ,useRef} from 'react';
import { MainNab } from './MainPage';
// 리덕스
import { useSelector } from "react-redux"; // import 해주세요.
import './Schedule.css';

function Schedule(){
    const [buttonState, setButtonState] = useState('출근'); // 초기 상태는 '출근'
    const [StartTime, setStartTime] = useState([]);
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
       const [scheduleData, setScheduleData] = useState(null);

// 현재 날짜를 "YYYY-MM-DD" 형식으로 얻기
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
const day = String(today.getDate()).padStart(2, '0'); // 일자

const formattedDate = `${year}-${month}-${day}`;

const handleWorkToggle = () => {
  if (buttonState === '출근') {
    setButtonState('멈춤');
    handleStartStop();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}:${seconds}`;

    setCurrentTime(currentTimeString);
    console.log(`버튼 클릭 시간: ${currentTimeString}`);
    setStartTime([...StartTime, currentTimeString]);
    localStorage.setItem('workStartTime', now);
  
      // Fetch로 데이터 전송
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
      });
  } 
  
  else if (buttonState === '멈춤') {
    setButtonState('다시 시작');
    handleStartStop();
        // Fetch로 데이터 전송
        fetch('http://localhost:10001/schduleState', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            isRunning: true
          })
        });
  } else if (buttonState === '다시 시작') {
    handleStartStop();
    setButtonState('멈춤');
          // Fetch로 데이터 전송
          fetch('http://localhost:10001/schduleState', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              isRunning: false
            })
          });
  }
};


    const [finishTime, setfinishTime] = useState([]);
    const [savedSeconds, setSavedSeconds] = useState(0);
    const handleLeave = () => {
      setButtonState('출근'); // '퇴근' 버튼 클릭 시 상태를 '출근'으로 변경
      setIsRunning(false); // isRunning을 초기 상태로 설정


      const timeIndex = document.getElementById('timeIndex');

      const now = new Date();
      const currentTimeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      setCurrentTime(currentTimeString);
      console.log(`버튼 클릭 시간: ${currentTimeString}`);
      const p = document.createElement('p');
      p.textContent = `퇴근 시간: ${currentTimeString}`;
        timeIndex.appendChild(p); // 새로운 셀에 <p> 태그 추가
          // asds 배열에 currentTimeString 추가
          setfinishTime([...finishTime, currentTimeString]);
            // seconds 변수의 값을 savedSeconds 변수에 저장
            setSavedSeconds(savedSeconds + seconds);

      setSeconds(0);
      localStorage.setItem('timerSeconds', 0);
      executeRemainingCode();

         // Fetch로 데이터 전송
         fetch('http://localhost:10001/schdulefinish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            isRunning: true , finishTime : currentTimeString
          })
        });


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

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 저장소에서 출근 시간 불러오기
    const storedTime = localStorage.getItem('workStartTime');
    if (storedTime) {
      setCurrentTime(storedTime);
    }
  }, []);



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
    
      useEffect(() => {
        // 실행 상태를 로컬 스토리지에 저장
        localStorage.setItem('timerIsRunning', isRunning);
      }, [isRunning]);
      
      
      const handleStartStop = () => {
        setIsRunning(!isRunning);
      };
    
      const handleReset = () => {
        setLastTime(prevLastTime => prevLastTime + seconds); // 초기화 시 현재 시간을 마지막 시간에 더함
        setSeconds(0);
        setIsRunning(false);
        // 초기화 시 로컬 스토리지도 업데이트
        localStorage.setItem('timerSeconds', 0);
        localStorage.setItem('timerIsRunning', false);
      };
    

      // 초를 시간, 분, 초로 변환
      const trRefs = useRef([]);
      const formatTime = () => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = `${Math.floor(seconds / 60)}`;
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
        if (seconds === 0) {
          return '근무중 0시 0분 0초';
        } else {
          return `근무중 ${getHours}시 ${getMinutes}분 ${getSeconds}초`;
        }
      };



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
const filteredTimeSlot = intervals.filter(timeSlot => timeSlot === getTimeSlot(currentHour));




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
         console.log(data[data.length-1])
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
         })}


     useEffect(() => {
      console.log('useEffect 실행됨', UserFullID1, formattedDate);
      
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
        if (data.length > 0) {
          setCurrentTime(data[0].StartTime); // 첫 번째 항목의 StartTime을 currentTime에 설정
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }, [UserFullID1, formattedDate,buttonState]);

    const extractHour = (timeString) => {
      // 시간 문자열에서 시간 부분만 추출 (예: "10:2:16" -> "10")
      return timeString.split(':')[0];
    };
    
    const extractIntervalHour = (interval) => {
      // interval 문자열에서 시작 시간 부분만 추출 (예: "03:00 ~ 04:00" -> "03")
      return interval.split(' ~ ')[0].split(':')[0];
    };
  

    
    
  
 
    

    return (
      <body>
      <MainNab />
      <h1 className="qrCodeH">우리가게 QR코드</h1>
      <section className='qr'>
        <QRCodeCanvas
          value="/" 
          includeMargin
          fgColor="#393E46"
          size={400}
        />
      </section>  

      <section className='qrPage_MainSextion'>
        <div className='qrPage_Schedule'>
          <div className='currentDateTime'>
            현재 날짜와 시간: {currentDateTime}
          </div>
          <h1>우리 가게 스케줄</h1>
          <table>
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
                  <td style={{ color: interval === getTimeSlot(currentHour) ? 'red' : 'black' }}>
                    {interval}
                  </td>
                  {UserList.map((user, userIndex) => (
                    <td key={userIndex} className='User_td' style={{ 
                      backgroundColor: scheduleData.some(item => 
                        item.MemberName === user && 
                        extractHour(item.StartTime) === extractIntervalHour(interval)
                      ) ? 'red' : 'transparent' 
                    }}>
                      {scheduleData.some(item => 
                        item.MemberName === user && 
                        extractHour(item.StartTime) === extractIntervalHour(interval)
                      ) && (
                  <>
      {(() => {
        const foundItem = scheduleData.find(item => 
          item.MemberName === user && 
          extractHour(item.StartTime) === extractIntervalHour(interval)
        );

        if (!foundItem) return null;

        const day = new Date(foundItem.today).getDate(); // '일' 부분 추출
        const formattedDay = String(day).padStart(2, '0'); // 두 자리 숫자로 포맷
        const today = new Date().getDate();
        const dayDifference = today - day;

        const now = new Date();
        const [hours, minutes, seconds] = foundItem.StartTime.split(':').map(Number);
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);

        let diffInSeconds = Math.floor((now - startTime) / 1000);
        if (dayDifference === 1) {
          diffInSeconds += 24 * 3600; // 1일 차이일 경우
        } else if (dayDifference > 1) {
          diffInSeconds += 24 * 3600 * dayDifference; // 2일 이상 차이일 경우
        }

        const hoursDiff = Math.floor(diffInSeconds / 3600);
        const minutesDiff = Math.floor((diffInSeconds % 3600) / 60);
        const secondsDiff = diffInSeconds % 60;

        const formattedDiff = `${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;

        return (
          <>
            <p>({formattedDay}) 근무시작 시간 : {foundItem.StartTime}</p>
            <p>경과 시간: {formattedDiff}</p>
          </>
        );
      })()}
    </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <h2>근무시간: {convertSecondsToMinutesAndHours(savedSeconds)}</h2>
          </div>
          {buttonState !== '퇴근' ? (
            <button onClick={handleWorkToggle}>{buttonState}</button>
          ) : (
            <button onClick={handleLeave}>퇴근</button>
          )}
          {buttonState !== '출근' && <button onClick={handleLeave}>퇴근</button>}
        </div>
      </section>
    </body>
    )
}

  export default Schedule;


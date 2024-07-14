import React, { useState, useEffect } from 'react';
import { MainNab } from '../MainPage/MainPage';
import "./Callender.css";
import MemoModal from './MemoModal';  // 모달 컴포넌트 import
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';  // 한글 로케일 데이터 import

// 리덕스
import { useSelector } from "react-redux"; // import 해주세요.

function Callender() {
// DB데이터 가져오기
const Loginstate = useSelector((state) => state.stateLogin.stateLogin.value);
const UserFullName = Loginstate.replace('님  반갑습니다!', '');
const UserIDtext1 = useSelector((state) => state.UserID);
const UserFullID1 = UserIDtext1.UserID.ID;
const [storeName, setStoreName] = useState('');  // storename 상태 추가

console.log(UserFullName);
useEffect(() => {
  // 데이터를 받아오는 비동기 함수 호출
  fetchData();
}, []);

function fetchData() {
  fetch('http://localhost:10001/callender2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      UserFullID1
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Fetched data:', data); // 로그 추가
      displayData(data);
      setStoreName(data[0].StoreName);  // storename 값을 상태로 저장
    })
    .catch(error => {
      console.error('Error fetching data:', error); // 에러 로그 추가
    });
}

function displayData(data) {
  // 데이터가 배열인지 확인하고, 배열이 아니라면 배열로 변환
  const dataArray = Array.isArray(data) ? data : [data];

  const formattedEvents = dataArray.map(item => ({
    title: `${item.TextUserName}: ${item.Text}`,
    date: item.TextDay
  }));

  setEvents(formattedEvents);
}

const [events, setEvents] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState('');
const [selectedEvent, setSelectedEvent] = useState(null);


const handleDateClick = (arg) => {
  setSelectedDate(arg.dateStr);
  const existingEvent = events.find(event => event.date === arg.dateStr);
  setSelectedEvent(existingEvent ? existingEvent : null);
  setIsModalOpen(true);
};

const handleEventClick = (arg) => {
  setSelectedDate(arg.event.startStr);
  setSelectedEvent(arg.event);  // 클릭한 이벤트를 직접 설정
  setIsModalOpen(true);
};

const handleSaveMemo = async (date, memo) => {
  const formattedMemo = `${UserFullName}: ${memo}`;

  // 기존 메모를 삭제하지 않고 새로운 메모를 추가
  const newEvents = [...events, { title: formattedMemo, date }];
  setEvents(newEvents);

  // 서버로 메모 전송
  try {
    const response = await fetch('http://localhost:10001/callender', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, memo: formattedMemo, userId: UserFullID1 }),
    });

    if (!response.ok) {
      throw new Error('서버 응답이 올바르지 않습니다.');
    }

    const responseData = await response.json();
    console.log('서버 응답 데이터:', responseData);
  } catch (error) {
    console.error('메모 저장 중 에러 발생:', error);
  }

  setIsModalOpen(false); // 저장 후 모달 닫기
};

const handleDeleteMemo = async (date, memo) => {
  console.log('Deleting memo for date:', date); // 디버깅용 로그
  const formattedMemo = `${UserFullName}: ${memo}`;
  const newEvents = events.filter(event => event.date !== date);
  setEvents(newEvents);
  setIsModalOpen(false);

  // 서버로 메모 삭제 요청
  try {
    const response = await fetch('http://localhost:10001/callender', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, userId: UserFullID1, memo: formattedMemo }), // formattedMemo를 올바르게 포함
    });

    if (!response.ok) {
      throw new Error('서버 응답이 올바르지 않습니다.');
    }

    const responseData = await response.json();
    console.log('서버 응답 데이터:', responseData);
  } catch (error) {
    console.error('메모 삭제 중 에러 발생:', error);
  }
};

const renderEventContent = (eventInfo) => {
  return (
    <div className="event-content">
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </div>
  );
};

const extractMemoContent = (memo) => {
  const colonIndex = memo.indexOf(':');
  return colonIndex !== -1 ? memo.slice(colonIndex + 2) : memo;
};

const calendarStyle = {
  width: '80%',  // 원하는 너비
  height: '600px',  // 원하는 높이
  margin: '0 auto'  // 중앙 정렬
};

return (
  <body>
  <MainNab />
  <section className='callenderMain' style={calendarStyle}>
    <div>{storeName ? storeName : 'Store name not set'}</div> {/* 로그 추가 */}
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
      locale={koLocale}  // 로케일 설정 
      eventContent={renderEventContent}  // 커스텀 이벤트 콘텐츠 렌더링
    />
    <MemoModal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      onSave={handleSaveMemo}
      onDelete={handleDeleteMemo}
      selectedDate={selectedDate}
      existingMemo={selectedEvent ? extractMemoContent(selectedEvent.title) : ''}
    />
  </section>
</body>
);
}export default Callender;
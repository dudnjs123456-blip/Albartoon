import React, { useState, useEffect, useRef } from 'react';
import './Chatting.css';
import { MainNab } from '../MainPage/MainPage';
import io from 'socket.io-client';
import { useSelector } from "react-redux"; 
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatInTimeZone } from 'date-fns-tz';
import { faBars, faL } from '@fortawesome/free-solid-svg-icons';
const socket = io('http://localhost:10004');

const Chatting = () => {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [username, setUsername] = useState('');
    const [isSending, setIsSending] = useState(false); // 전송 상태 관리
    const [Users, setUsers] = useState([]);

    const Loginstate = useSelector((state) => state.stateLogin.stateLogin.value);
    const UserFullName = Loginstate.replace('님  반갑습니다!', '');
    const UserIDtext1 = useSelector((state) => state.UserID);
    const UserFullID1 = UserIDtext1.UserID.ID;
    const [formattedDates, setFormattedDates] = useState([]); // 형식 변환된 날짜 상태
    // 
    const location = useLocation();


 

    useEffect(() => {
        if (location.pathname === '/chatt') {        
            // 세션 노드를 콘솔에 띄웁니다.
            const sessionData = sessionStorage.getItem('yourSessionKey'); // 'yourSessionKey'를 실제 키로 변경하세요.
            // console.log("세션 데이터:", sessionData);
        
            fetch('http://localhost:10001/LoginCheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionData: sessionData }), // 세션 데이터를 JSON 형식으로 변환하여 전송
                credentials: 'include' // 쿠키를 포함시키기 위한 옵션₩ㅗ
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답이 좋지 않습니다.');
                }
                return response.json();
            })
            .then(data => {
                console.log('서버 응답:', data.session.user);
                if(data.session.user !==undefined){
                    // alert('로그인했습니다');
                }else{
                    alert('로그인을 해야합니다');
                    window.location.href = "/";
                }
                // 추가적인 동작을 여기에 작성할 수 있습니다.
            })
            .catch(error => {
                console.error('문제가 발생했습니다:', error);
            });
        }
        
    }, [location]);

    useEffect(() => {
        setUsername(UserFullName);
    }, [UserFullName]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:10001/ChatLoading', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userID: UserFullID1 }),
                });
    
                if (!response.ok) {
                    throw new Error('네트워크 응답이 좋지 않습니다.');
                }
    
                const data = await response.json();
                console.log('서버 응답:', data); // 서버 응답 전체 출력
    
                if (data.success) {
                    console.log('Store Names:', data.User_StoreName); // StoreNames 출력
                    console.log('Chat Results:', data.chatResults); // ChatResults 출력
                    console.log('User Names:', data.userNames); // UserNames 출력
    
                    setUsers(data.userNames)
                    setRooms(data.User_StoreName); // Room 상태 업데이트
                    // setChat(data.chatResults); // 채팅 메시지 상태 업데이트
                }
            } catch (error) {
                console.error('데이터 전송 오류:', error);
            }
        };
    
        // UserFullID1이 변경될 때마다 데이터를 불러옵니다.
        if (UserFullID1) {
            fetchData();
        }
    }, [UserFullID1]); // UserFullID1이 변경될 때마다 호출
    

    useEffect(() => {
        socket.emit('getRooms');
        socket.on('rooms', (rooms) => {
            setRooms((prevRooms) => [...new Set([...prevRooms, ...rooms])]); // 중복 제거
        });

        return () => {
            socket.off('rooms'); // 이벤트 정리
        };
    }, []);

    useEffect(() => {
        if (currentRoom) {
            socket.emit('joinRoom', currentRoom); // 현재 방에 입장

            // 방의 채팅 메시지 로딩
            fetchChatData(currentRoom); // 현재 방의 채팅 데이터 요청

            const messageHandler = (message) => {
                // 항상 새 메시지 추가
                setChat((prevChat) => [...prevChat, message]);
            };

            socket.on('receiveMessage', messageHandler);

            return () => {
                socket.emit('leaveRoom', currentRoom); // 방을 떠날 때
                socket.off('receiveMessage', messageHandler); // 특정 핸들러 정리
            };
        }
    }, [currentRoom]); // currentRoom이 변경될 때마다 호출

    const fetchChatData = async (roomId) => {
        try {
            const response = await fetch('http://localhost:10001/ChatLoading', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: UserFullID1, roomId }), // 필요한 데이터 추가
            });
    
            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다.');
            }
    
            const data = await response.json();
            console.log('서버 응답:', data); // 서버 응답 전체 출력
    
            if (data.success) {
                console.log('Store Names:', data.earliestChatResults); // StoreNames 출력
                console.log('Chat Results:', data.chatResults); // ChatResults 출력
    
                setChat(data.chatResults); // 채팅 메시지 상태 업데이트
    
                const formattedDates = data.earliestChatResults.map(result => {
                    const dateString = result.chatDate; // 원본 날짜 문자열
                    const utcDate = new Date(dateString); // UTC 날짜 객체 생성
                    const kstDate = formatInTimeZone(utcDate, 'Asia/Seoul', 'yyyy-MM-dd'); // KST로 변환
                    const formattedDate = kstDate.replace(/-/g, '-'); // '-'를 '--'로 변경
                    console.log(formattedDate); // 변환된 날짜 출력
                    return formattedDate; // 변환된 날짜를 반환하여 배열에 담기
                });
    
                setFormattedDates(formattedDates); // 형식 변환된 날짜 상태 업데이트
            }
        } catch (error) {
            console.error('데이터 전송 오류:', error);
        }
    };


    const sendMessage = async () => {
        if (message.trim() && !isSending) {
            setIsSending(true); // 전송 시작
    
            // 현재 시간을 KST로 설정
            const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // KST는 UTC+9시간
            const currentTimeKST = new Date(Date.now() + KR_TIME_DIFF).toISOString(); // KST 기준으로 현재 시간
    
            const userMessage = { 
                room: currentRoom, 
                UserName: username, // UserName 속성으로 설정
                chatText: message, // chatText 속성으로 설정
                userID: UserFullID1, 
                UserId: UserFullID1, // UserId 속성 추가
                ChatTime: currentTimeKST // KST 기준으로 현재 시간 추가
            };
    

    
            try {
                // 서버에 메시지를 전송하기 위한 fetch 요청
                const response = await fetch('http://localhost:10001/sendMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userMessage), // 메시지를 포함하여 요청
                });
    
                if (!response.ok) {
                    throw new Error('네트워크 응답이 좋지 않습니다.');
                }
    
                const data = await response.json();
                console.log('서버 응답:', data); // 서버 응답 콘솔 출력
    
                // 서버 응답이 성공적일 경우에만 상태 업데이트
                if (data.success) {
                    console.log('메시지가 성공적으로 서버에 전송되었습니다.');
                    
                    // 소켓을 통해 메시지 전송
                    socket.emit('sendMessage', userMessage); // 소켓을 통해 메시지 전송
                } else {
                    console.error('메시지 전송 실패:', data.message);
                }
            } catch (error) {
                console.error('데이터 전송 오류:', error);
            }
    
            setIsSending(false); // 전송 완료
        }
                    // 메시지 입력창 초기화
                    setMessage('');
    };
    

    const chatEndRef = useRef(null); // 채팅 끝 부분을 참조할 ref 추가

    const handleRoomClick = (room) => {
        setCurrentRoom(room);
        setChat([]);
    };

    const handleLeaveRoom = () => {
        setCurrentRoom(null);
        setChat([]);
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleLeaveRoom(); // ESC 키가 눌리면 방 나가기 함수 호출
            }
        };

        // 키 다운 이벤트 리스너 추가
        window.addEventListener('keydown', handleKeyDown);

        // 컴포넌트 언마운트 시 리스너 제거
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    };

    useEffect(() => {
        // 채팅이 업데이트될 때마다 스크롤을 가장 아래로 이동
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat]); // chat이 변경될 때마다 호출

    
    const [hoverBarVisible, setHoverBarVisible] = useState(false);
    const [hoverBarOpacity, setHoverBarOpacity] = useState(0); // 초기 투명도
    const [hoverBarPosition, setHoverBarPosition] = useState(50); // 초기 위치
    const [isModalActive, setIsModalActive] = useState(false); // 모달 활성화 상태

    const handleIconClick = () => {
        // 호버 바의 상태를 토글
        if (hoverBarVisible) {
            // 현재 보이는 경우, 투명도와 위치를 초기화
            setHoverBarOpacity(0);
            setHoverBarPosition(50);
        } else {
            // 현재 보이지 않는 경우, 투명도와 위치를 설정
            setHoverBarOpacity(1); // 투명도 100%
            setHoverBarPosition(87); // 위치 100
        }
        // 호버 바의 가시성 상태를 토글
        setHoverBarVisible(!hoverBarVisible);
    };

    if (!currentRoom) {
        return (
            <div>
                <MainNab />
                <section className='firstpage'>
                    <div className='chatting'>
                                   {/* ✨✨✨ 바로 여기에 홈버튼 div를 추가할 거야! ✨✨✨ */}
                    <div className='ipad-home-button'></div>

                            {/* ✨✨✨ 스피커 구멍 (그릴) 추가! ✨✨✨ */}
        <div className='ipad-speaker-grill'></div>
        
        {/* ✨✨✨ 앞면 카메라 추가! ✨✨✨ */}
        <div className='ipad-front-camera'></div>

                        <div className='main_screen'>
                            <h2>채팅방 목록</h2>
                            <ul>
                                {rooms.map((room, index) => (
                                    <li key={index} onClick={() => handleRoomClick(room)}>
                                        {room}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div>
        <MainNab />
        <section className='firstpage'>
            <div className='chatting'>
                           {/* ✨✨✨ 바로 여기에 홈버튼 div를 추가할 거야! ✨✨✨ */}
                           <div className='ipad-home-button'></div>

                                   {/* ✨✨✨ 스피커 구멍 (그릴) 추가! ✨✨✨ */}
        <div className='ipad-speaker-grill'></div>
        
        {/* ✨✨✨ 앞면 카메라 추가! ✨✨✨ */}
        <div className='ipad-front-camera'></div>

                <div className='main_screen'>
                    <h2>{currentRoom} 채팅방</h2>
                    <div className="menu-icon" onClick={handleIconClick}>
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </div>
                    <button className="leave-button" onClick={handleLeaveRoom}>나가기</button>
                    <div className="chat-log" style={{ position: 'relative' }}> {/* 채팅 메시지를 표시하는 부분 */}
                    <div>
                    {formattedDates.map((date, index) => {
    // 해당 날짜에 맞는 메시지를 필터링
    const messagesForDate = chat.filter(msg => {
        const messageTime = msg.ChatTime ? msg.ChatTime.slice(0, 10) : ''; // 날짜 부분만 가져오기
        return messageTime === date; // 날짜가 일치하는 메시지 찾기
    });

    // 날짜를 Date 객체로 변환
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
    const day = dateObject.getDate();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[dateObject.getDay()]; // 요일 가져오기

    return (
        <div key={index}>
            <h1>{`${year}년 ${month}월 ${day}일 ${weekday}`}</h1> {/* 날짜 표시 */}
            {messagesForDate.map((msg, msgIndex) => {
                const chatTime = msg.ChatTime ? new Date(msg.ChatTime) : null;
                const hours = chatTime ? chatTime.getHours() : 0;
                const minutes = chatTime ? chatTime.getMinutes() : 0;
                const ampm = hours >= 12 ? '오후' : '오전';
                const formattedTime = chatTime ? `${ampm} ${String(hours % 12 || 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` : '시간 없음';

                return (
                    <div
                        key={msgIndex}
                        className={`chat-message ${msg.UserId === UserFullID1 ? 'self' : 'other'}`}
                    >
                        <div className="message-container">
                            <span className="username">{msg.UserName}: </span>
                            <span className="text">{msg.chatText}</span>
                            <span className="time">{formattedTime}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
})}
</div>
                        <div ref={chatEndRef} /> {/* 스크롤을 이동할 위치 */}
                        <div className="hover-bar" style={{ 
                            opacity: hoverBarOpacity, 
                            left: hoverBarPosition, 
                            position: 'fixed', // 고정 위치 설정
                            transition: 'opacity 0.5s, left 0.5s',
                            bottom: '140px', // 원하는 위치로 조정
                            zIndex: 1 // 다른 요소 위에 표시
                        }}>
                            <ul>
                                <h7>가게 멤버들</h7>
                                {Users.map((User, index) => (
                                    <li key={index}>{User}</li> // 방 이름 출력
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="input-container">
    <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                sendMessage(); // 엔터 키가 눌리면 메시지 전송
            }
        }}
    />
    <button onClick={sendMessage} disabled={isSending}>전송</button>
</div>


                </div>
            </div>
        </section>
    </div>
    );
};

export default Chatting;
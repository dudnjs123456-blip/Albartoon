import React, { useState, useEffect } from 'react';
import './Chatting.css';
import { MainNab } from '../MainPage/MainPage';
import io from 'socket.io-client';
import { useSelector } from "react-redux"; // import 해주세요.

const socket = io('http://localhost:10004');

const Chatting = () => {
    const [rooms, setRooms] = useState(['대가대']);  // 초기 방 목록에 "대가대" 추가
    const [currentRoom, setCurrentRoom] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [username, setUsername] = useState(''); // 사용자 이름 상태 추가

    // DB 데이터 가져오기
    const Loginstate = useSelector((state) => state.stateLogin.stateLogin.value);
    const UserFullName = Loginstate.replace('님  반갑습니다!', '');
    const UserIDtext1 = useSelector((state) => state.UserID);
    const UserFullID1 = UserIDtext1.UserID.ID;

    useEffect(() => {
        // username 상태를 UserFullName으로 설정
        setUsername(UserFullName);
    }, [UserFullName]);

    useEffect(() => {
        // 서버로부터 채팅방 목록을 받아오는 로직
        socket.emit('getRooms');
        socket.on('rooms', (rooms) => {
            setRooms([...rooms, '대가대']);  // 서버로부터 받은 방 목록에 "대가대" 추가
        });

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (currentRoom) {
            socket.emit('joinRoom', currentRoom);

            socket.on('receiveMessage', (message) => {
                setChat((prevChat) => [...prevChat, message]);
            });

            return () => {
                socket.emit('leaveRoom', currentRoom);
                socket.off('receiveMessage');
            };
        }
    }, [currentRoom]);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('sendMessage', { room: currentRoom, username, text: message });
            setMessage('');
        }
    };

    const handleRoomClick = (room) => {
        setCurrentRoom(room);
        setChat([]);
    };

    const handleLeaveRoom = () => {
        setCurrentRoom(null);
        setChat([]);
    };

    if (!currentRoom) {
        return (
            <div>
                <MainNab />
                <section className='firstpage'>
                    <div className='chatting'>
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
                    <div className='main_screen'>
                        <h2>{currentRoom} 채팅방</h2>
                        <button onClick={handleLeaveRoom}>나가기</button>
                        <div>
                            {chat.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${msg.username === username ? 'self' : 'other'}`}
                                >
                                    <div className="message-container">
                                        <span className="username">{msg.username}: </span>
                                        <span className="text">{msg.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input
                            type='text'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={sendMessage}>전송</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Chatting;

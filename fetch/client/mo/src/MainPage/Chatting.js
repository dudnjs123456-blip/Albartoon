import React, { useState, useEffect } from 'react';
import './Chatting.css';
import { MainNab } from '../MainPage/MainPage';
import io from 'socket.io-client';
import { useSelector } from "react-redux"; 
import axios from 'axios'; // axios 추가

const socket = io('http://localhost:10004');

const Chatting = () => {
    const [rooms, setRooms] = useState(['대가대']);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [username, setUsername] = useState('');

    const Loginstate = useSelector((state) => state.stateLogin.stateLogin.value);
    const UserFullName = Loginstate.replace('님  반갑습니다!', '');
    const UserIDtext1 = useSelector((state) => state.UserID);
    const UserFullID1 = UserIDtext1.UserID.ID;

    useEffect(() => {
        setUsername(UserFullName);
    }, [UserFullName]);

    useEffect(() => {
        socket.emit('getRooms');
        socket.on('rooms', (rooms) => {
            setRooms([...rooms, '대가대']);
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

    const getAIResponse = async (userMessage) => {
        try {
            const response = await axios.post('YOUR_OPENAI_API_URL', {
                prompt: userMessage,
                max_tokens: 50, // 원하는 응답 길이에 따라 조정
            }, {
                headers: {
                    'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.choices[0].text.trim();
        } catch (error) {
            console.error('AI 응답 오류:', error);
            return '죄송합니다, 응답을 받을 수 없습니다.';
        }
    };

    const sendMessage = async () => {
        if (message.trim()) {
            const userMessage = { room: currentRoom, username, text: message };
            socket.emit('sendMessage', userMessage);
            setChat((prevChat) => [...prevChat, userMessage]);
            
            const aiResponseText = await getAIResponse(message);
            const aiMessage = { room: currentRoom, username: 'AI', text: aiResponseText };
            setChat((prevChat) => [...prevChat, aiMessage]);

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

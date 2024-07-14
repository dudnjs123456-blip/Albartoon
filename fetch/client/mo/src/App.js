import MainPage from './MainPage/MainPage';
import {Route,Routes} from'react-router-dom';
import React from 'react';
import LoginPage from './LoginPage/LoginPage';
import SignUpPage from './SignUpPage/SignUpPage';
import SignUpPageNext from './SignUpPage/SignUpPageNext/SignUpPageNext';
import NoticeBoard from './Notice Board/Notice Board';
import LoginPopup from './MainPage/LoginPopUp/LoginPopUp';
import StudySearch from './StudySearch/StudySearch';
import Callender from './StudySearch/Callender';
import Chatting from './MainPage/Chatting';
import Mypage from './MainPage/Mypage/Mypage';
import JobPosting from './MainPage/JobPosting';
import OurStore from './OurStore';
import Schedule from './MainPage/Schedule';
import MainNoticeBoard from './MainNoticeBoard';
import Loding from './MainPage/Loding';
import NewStore from './NewStore';


function App() {
  return (
    <body>
    <Routes>
      <Route path='/' element={<MainPage />}/>
      <Route path='/1' element={<LoginPage/>}/>
      <Route path='/2' element={<SignUpPage/>}/>
      <Route path='/3' element={<SignUpPageNext/>}/>
      <Route path='/4' element={<NoticeBoard/>}/>
      <Route path='/6' element={<LoginPopup/>}/>
      <Route path='/7' element={<StudySearch/>}/>
      <Route path='/callender' element={<Callender/>}/>
      <Route path='/chatt' element={<Chatting/>}/>
      <Route path='/Mypage' element={<Mypage/>}/>
      <Route path='/JobPosting' element={<JobPosting/>}/>
      <Route path='/OurStore' element={<OurStore/>}/>
      <Route path='/Schedule' element={<Schedule/>}/>
      <Route path='Loding' element={<Loding/>}/>
      <Route path='/MainNoticeBoard' element={<MainNoticeBoard/>}/>
      <Route path='/NewStore' element={<NewStore/>}/>
    </Routes> 
    </body>
  )
}

export default App;
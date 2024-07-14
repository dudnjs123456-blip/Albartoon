import React, {useCallback, useEffect, useRef, useState } from 'react';
import { MainCopyrigh, MainCopyright, MainNab } from '../MainPage';
import './Mypage.css';


     function Mypage(){
     

    return(
        <body> 
            <MainNab></MainNab>
            <section className='Fist_section'>
                <div className='Mypage_section'>
                    <footer className='UserFeature'>
                     <div className='MyPage_First'>My Page</div>   
                    <span className='User_image'></span>
                    <div className='Mypage_name'>User_Name</div>
                    <ul className='User_Privacy'>
                        <li>상세내역들</li>
                        <li>상세내역들</li>
                    </ul>
                    </footer>
                </div>

                <div className='Mypage_Mainsection'>
                    <h1 className='Mypage_Mainsection_title'>나의 이력서</h1>
                    <section className='Mypage_Mainsection_FirstSection' >
                    <h1>알바경력 사항</h1>
                        <ul>
                            <li>알바이름</li>
                            <li>알바이름</li>
                        </ul>
                        <ul>
                            <li>기간1</li>
                            <li>기간2</li>
                        </ul>
                        <ul>

                            <li>직종1</li>
                            <li>직종2</li>
                        </ul>
                    </section>
                    <section className='Mypage_Mainsection_SecondSection' ></section>
                </div>
            </section>
        </body>
    )
}

export default Mypage;
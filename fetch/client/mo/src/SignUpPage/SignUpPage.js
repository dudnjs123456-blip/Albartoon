import React, { useState } from 'react';
import './SignUpPage.css';
import { MainNab } from '../MainPage/MainPage';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


function SignUpPage(){
    return(
        <body>
            <MainNab></MainNab>
            <div className='SignUpMain'>
                <h1 id='Signh1'>회원가입</h1>
                <section className='SignBox1'></section>
                <section className='SignBox2'></section>
                <section className='Signbutton'>
                <input type={'checkbox'} id='d1'></input>
                <div className='b2'>동의합니다</div>
                </section>
                <section className='Signbutton2'>
                <input type={'checkbox'} id='d1'></input>
                <div className='b2'>동의합니다</div>
                </section>
                <Link to={'/3'}><div className='nextbutton'>Next</div></Link>
            </div>
        </body>
    )
}

export default SignUpPage;
import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    return (
        <body>
            <main className='mainbox'>
                 <h1 className='mainname'>Mody</h1>
                 <section className='mainui'>
                    <input id='loginid' type={'text'} name="" placeholder='아이디'></input>
                    <input id='loginpassword' type={'password'} name="" placeholder='비밀번호'></input>
                    <input id='loginsubmit' type={'submit'} name="" value={'로그인'}></input>
                    <ul className='loginui'>
                        <li id="login">아이디찾기</li>
                        <li id="password">비밀번호찾기</li>
                        <Link to={'/3'}><li id="sign" style={{ color: 'black' }}>회원가입</li></Link>
                    </ul>
                    <h2 className='a1'>또는</h2>
                    <section className='naver'>
                        <div id="naver">Naver</div>
                        <div id="google">Google</div>
                        <div id="kakao">KaKao</div>
                        <div id="instagram">instagram</div>
                    </section>
                </section>
            </main>
        </body>
    )
}





  export default LoginPage;
import React, {useCallback, useEffect, useRef, useState } from 'react';
import { MainCopyrigh, MainCopyright, MainNab } from '../../MainPage/MainPage';
import './SignUpPageNext.css';
import { useForm } from "react-hook-form";
import styled from 'styled-components';
import ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom';
// 리덕스

     function SignUpPageNext(){
        const { register,watch } = useForm({mode:'onChange'}); 
        const Idtext = watch('text');
        useEffect(() => {
           //  const textcheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힝]/;
            const spacebar = /\s/g;
            const specialtext = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
           //  const errerspecial = document.getElementById('errerspecial');
            const space =  document.getElementById('space');
            const specialtt = document.getElementById('specialtt');
            const iderrorlist = document.getElementById('iderrorlist');
            if(spacebar.test(Idtext)){
               space.style.display='block';
               if( specialtt.style.display='block'){
                   iderrorlist.style.left= 10+ '%';
               }
            }
            else if(!spacebar.test(Idtext)){
               space.style.display='none';
               iderrorlist.style.left= 25+ '%';
            }
          
            if(specialtext.test(Idtext)){
               specialtt.style.display='block';
            }
            else if(!specialtext.test(Idtext)){
               specialtt.style.display='none';
               iderrorlist.style.left= 25+ '%';
            }        
        })
        console.log(Idtext)

        const [isDisabled, setIsDisabled] = useState(false);
        const useOnSubmitHandler = (e) =>{
            e.preventDefault();
            const text = e.target.text.value;
            const krtest = /^[ㄱ-ㅎ|가-힣]+$/;
            const spacebar = /\s/g;
            const specialtext = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

            try{
                if(spacebar.test(text)){
                    throw('스페이스는 넣을 수 없습니다'),   
                    alert('공백은 넣을 수 없습니다')
                 }
    
                if(specialtext.test(text)){
                    throw('특수문자는 사용할 수 없습니다'),
                    alert('특수문자는 사용할 수 없습니다')
                 }
    
                if(text.length >=1 && text.length < 4 ){
                    throw('어이디 양식을 맞춰주세요'),
                    alert('어이디 양식을 맞춰주세요')
                }
                
                if(text.length == 0){
                    throw('어이디 양식을 채워주세요'),
                    alert('어이디 양식을 맞춰주세요')
    
                }
                 if(krtest.test(text)){
                    throw ('한글은 사용 할 수 없습니다'),
                    alert ('한글은 사용 할 수 없습니다')
                 }
                }
                catch{
                    
                }  
               // promise는 바로 실행 
               fetch('http://localhost:10001/user',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text
                })
            }).then((response) => response.json())
            .then((data)=> {
                console.log(data.cnt);
                if(data.cnt==1){
                    alert('아이디가 중복됩니다');
                }else{
                    alert('아이디를 생성하실 수 있습니다!');
                    setIsDisabled(true);
                }
            });

            console.log(text);
        }


// 회원가입 비밀번호
    const[onpassword,setpassword] = useState({
        password : ''
    })

    const onChangepassword = (e) =>{
        setpassword({
            ...onpassword,  
            password: e.target.value
        })
    }
    
    const [reonpassword, resetpassword] = useState({
        password: ''
    })

    const reonChangepassword =  useCallback((e) => {
        resetpassword({
            ...onpassword,
            password: e.target.value
         
        })
    },[onpassword])

    //유저 회원기입 이름
    const [User_Name, reUser_Name] = useState({
        Name: ''
    })

    const reonUser_Name =  useCallback((e) => {
        reUser_Name({
            ...User_Name,
            Name: e.target.value
        })
    },[User_Name])
    // 회원가입 성별
    const Manbuttoncheck = (e) =>{
        let result = '';
        if(e.target.checked) {
          result = e.target.value;
          console.log(result)
        }else {
            result = '';
          }
    }

    const Womanbuttoncheck = (e) =>{
        let result = '';
        if(e.target.checked) {
          result = e.target.value;
          console.log(result)
        }else {
            result = '';
          }
    }

    // 회원가입 주민번호
    const [User_Fs_security, reUser_Fs_security] = useState({
        Frontsecurity: '' 
    })

    const [User_Back_security, reUser_Back_security] = useState({
        Backsecurity: '' 
    })
    const reonUser_Fs_security =  useCallback((e) => {
        reUser_Fs_security({
            ...User_Fs_security,
            Frontsecurity: e.target.value,
        })
    },[User_Fs_security])

    const reonUser_Back_security=  useCallback((e) => {
        reUser_Back_security({
            ...User_Back_security,
            Backsecurity: e.target.value,
        })
    },[User_Back_security])


    useEffect(()=>{
        let cards = '';
        for (cards = 1980; cards < 2023; cards++) {
            const rootElement = document.getElementById("years");
            const element = document.createElement("option");
            rootElement.append(element);
            element.textContent = cards ;
            element.className = 'card';
        }

        let month = [];
        for (let m = 1; m <= 12; m += 1){
            if (m < 10) {
                month.push("0" + m.toString());
              } else {
                month.push(m.toString());
              }
            }
    },[])       

    const LoginDaTa = (e)=>{
        e.preventDefault(); 
        const LoginDBpust = ()=>{
            return new Promise((resolve,reject)=>{
                if(onpassword.password === reonpassword.password && (onpassword.password != '' || reonpassword.password != '')){
                    fetch("http://localhost:10001/userDB",{
                        method : "post",
                        headers : {
                          "Content-Type" : "application/json",
                        },
                        body : JSON.stringify({
                            passwordname : onpassword,
                            passwordcheck : reonpassword,
                            Idtext,
                            User_Name : User_Name,
                            User_Fs_security : User_Fs_security ,
                            User_Back_security :  User_Back_security
                        }),
                      }).then(response => response.json())
                      .then(responseData => {
                        // 응답 데이터 처리
                        if(responseData.User_Name == ''){
                            alert('다시 가입을 해주세요')
                        }else{
                            alert('회원가입이 완료 되었습니다!')
                             window.location.href = "/";
                        }
                        console.log(responseData);
                      })
                      .catch(error => {
                        console.error(error);
                      });
                      resolve('hi');
                    console.log('hi');
                }else if(onpassword.password == '' || reonpassword.password == ''){
                    alert('비밀번호를 입력해주세요')
                }else{
                    alert('비밀번호가 일치하지 않습니다.')
                }
            })
        }

      
      async function LoginDBList(){
          await LoginDBpust();
          console.log('보내는중입니다');
      }
        LoginDBList();
    }

    return(
        <body> 
            <MainNab></MainNab>
            <section className='Mainsec1'> 
                <h1 id='c1'>알바 toon</h1>
                <h2 id='c2'>알바의 모든 것을 모은 단 하나의 앱</h2>
                <form className='MainsecInner'  onSubmit={useOnSubmitHandler}>
                    <table className='MainTable'>
                        <tr>
                            <td width={200} height={30}>아이디</td>
                            <td><input
                            id='MainTable'
                            disabled={isDisabled}
                            maxlength='12'
               
                            type='text'
                            // disabled
                            className='TableId' 
                            placeholder='아이디는 4-12자의 영문, 숫자만 사용이 가능'
                            {...register("text")}/>
                                <button id='TableButton' type='submit'>중복확인</button>
                                <ul id='iderrorlist'>
                                <li id='specialtt'>특수문자는 사용 할 수 없습니다.</li>
                                <li id='space'>공백은 넣을 수 없습니다.</li>
                                </ul>

                            </td>
                        </tr>

                        <tr height={20} >
                            <td >비밀번호</td>
                            <td><input 
                            autoComplete="new-password"
                            className='TablePassword'
                            value={onpassword.password}
                            type={'password'}
                            onChange={onChangepassword}
                            pattern='hi'></input>
                            </td>
                        </tr>

                        <tr height={20}>
                            <td>비밀번호 확인</td>
                            <td><input className='TablePassword'
                             value={reonpassword.password}
                             type={'password'}
                             onChange={reonChangepassword}
                             pattern={'hi'}
                             ></input>
                             </td>
                        </tr>

                        <tr height={20}>
                            <td>이름</td>
                            <td><input className='TableName'
                              value={User_Name.Name}
                              onChange={reonUser_Name}
                                 type={'text'}>
                                </input></td>
                        </tr>

                        <tr height={20}>
                            <td>생일/성별</td>
                            <td>
                                <select className='years' id='years'>
                                    <option>생년월일</option>
                                </select>
                             <div id='man'>   
                             <input id='manbutton' 
                                name='man'
                                type={'radio'} 
                                value='man'
                                onClick={Manbuttoncheck}
                                >    
                                </input>
                             <label for='manbutton'>남</label>
                             <input id='womanbutton' 
                             name='man' 
                            type={'radio'} 
                            value='woman'
                            onClick={Womanbuttoncheck}
                            ></input>
                             <label for='womanbutton'>여</label>
                             </div>
                             </td>
                        </tr>

                        <tr height={5}>
                            <td>주민번호</td>
                            <td>
                                <div className='CustomNumberTable'>
                                <input className='CustomNumber' 
                                 value={User_Fs_security.Frontsecurity}
                                 onChange={reonUser_Fs_security}
                                type={'text'}></input>
                                <input className='CustomNumber1' 
                                onChange={reonUser_Back_security}
                                value={User_Back_security.Backsecurity}
                                type={'password'}></input>
                                </div>
                            </td>
                        </tr>
                        
                        {/* <tr height={5}> */}
                            {/* <td>휴대폰 번호</td> */}
                            {/* <td>  */}
                            {/* <input className='PhoneNumber' type={'text'}></input> */}
                            {/* <button id='PhoneButton'>인증번호 전송</button> */}
                            {/* </td> */}
                        {/* </tr> */}

                        {/* <tr height={5}> */}
                            {/* <td>인증번호 확인</td> */}
                            {/* <td> */}
                            {/* <input className='PhoneNumberCheck' type={'text'}></input> */}
                            {/* <button id='PhoneNumberCheck1'>인증번호 확인</button> */}
                            {/* </td> */}
                        {/* </tr> */}

                        {/* <tr height={10}> */}
                        {/* <td>이메일</td> */}
                            {/* <td> */}
                                {/* <section className='EmailSection'> */}
                                 {/* <input className='Email' type={'text'} name={'Email'}></input> */}
                                 {/* <div className='Email2'>@</div> */}
                                {/* <input className='Email1' type={'text'}></input> */}
                                {/* </section> */}
                            {/* </td> */}
                        {/* </tr> */}



                    </table>
                </form>
    
                {/* <main className='MainInnier2'> */}
                    {/* <div className='FirstBox'> */}
                    {/* <h1> */}
                        {/* 필수동의 항목 및 개인정보 수집 및 이용 동의(선택), 광고성 정보 수신 */}
                        {/* <br></br>(선택)에 모두 동의합니다 */}
                        {/* <input type={'checkbox'}></input> */}
                    {/* </h1> */}
                    {/* </div> */}
                {/* </main> */}

                <form className='MainInnier3' onSubmit={LoginDaTa}>
                    <input id='MainInnierSubmit' type={'submit'} value='가입하기'
                    ></input>
                </form>

                {/* <main className='MainInnier4'> */}
                    {/* <h2>간편 회원가입</h2> */}
                    {/* <ul className='MainLogo'> */}
                        {/* <li></li> */}
                        {/* <li></li> */}
                        {/* <li></li> */}
                        {/* <li></li> */}
                    {/* </ul> */}
                {/* </main> */}

                <MainCopyrigh top='100%'>
                    <section className='MainCopyrightSection'>
                        
                    </section>

                    <section className='MainCopyrightSection2'>
                    </section>
                </MainCopyrigh>

            </section>
        </body>
    )
}

export default SignUpPageNext;
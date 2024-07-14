import { Link } from 'react-router-dom';
import React, {useCallback, useEffect, useRef, useState } from 'react';
import { MainNab } from './MainPage/MainPage';
import './NewStore.css'

//리덕스 
import { useSelector, useDispatch } from "react-redux"; // import 해주세요.

function NewStore(){
        // 유저 이름 객체
        const dispatch = useDispatch();
        const UserIDtext = useSelector((state) => state.UserID);
        const UserFullID= UserIDtext.UserID.ID;
        
        // console.log(UserFullID)
        //유저 회원기입 이름
        const [Store_Name, reStore_Name] = useState({
            Name: ''
        })
    
        const reonStore_Name =  useCallback((e) => {
            reStore_Name({
                ...Store_Name,
                Name: e.target.value
            })
        },[Store_Name])
        

        const [representativeName, OnrepresentativeName] = useState({
            representativeName: ''
        })
        const reonStore_representativeName =  useCallback((e) => {
            OnrepresentativeName({
                ...representativeName,
                representativeName: e.target.value
            })
        },[representativeName])


        const [representativeTel, OnrepresentativeTel] = useState({
            Tel: ''
        })

        const reonStore_representativeTel =  useCallback((e) => {
            OnrepresentativeTel({
                ...representativeTel,
                Tel: e.target.value
            })
        },[representativeTel])



        const [BusinessNumber, OnBusinessNumber] = useState({
            BusinessNum: ''
        })
        const reonBusinessNumber =  useCallback((e) => {
            OnBusinessNumber({
                ...BusinessNumber,
                BusinessNum: e.target.value
            })
        },[BusinessNumber])

        const [StoreLocation, OnStoreLocation] = useState({
            StoreLocation: ''
        })

        const reonStoreLocation =  useCallback((e) => {
            OnStoreLocation({
                ...StoreLocation,
                StoreLocation: e.target.value
            })
        },[StoreLocation])



        const StoreDB_Post = (e)=>{
            e.preventDefault(); 
            fetch('http://localhost:10001/StoreDB',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Store_Name : Store_Name,
                    UserFullID : UserFullID,
                    representativeName : representativeName,
                    representativeTel : representativeTel,
                    BusinessNumber : BusinessNumber,
                    StoreLocation : StoreLocation
                })
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                alert('등록이 완료되었습니다.')
                window.location.href = "/OurStore";
            })
        }
    return(
        <body>
            <MainNab></MainNab>
            <div className='NewStore_MainPage'>
            <div className='Maindiv'>
                        <span>알바 toon</span>
                </div>
                <a>가게를 등록하기 위해 가게에 대한 정보를 입력해주세요</a>
                <form className='NewStore_List' onSubmit={StoreDB_Post}>
                    <table className='NewStore_Table'>
                        <tr>
                            <td width={200} height={50}>
                            <span>가게이름</span>
                            </td>

                            <td>
                            <input type={'text'}  
                            value={Store_Name.Name}     
                            onChange={reonStore_Name}
                            className='NewStore_StoreName'></input> 
                            </td>
                        </tr>

                        <tr>
                            <td height={50}>사업자 대표명</td>

                            <td>
                            <input type={'text'}
                            value={representativeName.Name}
                            onChange={reonStore_representativeName}
                            className='NewStore_StoreName'></input> 
                            </td>
                        </tr>

                        <tr>
                            <td height={50}>사업자 대표 전화번호</td>

                            <td>
                            <input type={'text'} 
                            value={representativeTel.Tel}
                            onChange={reonStore_representativeTel}
                            className='NewStore_StoreName'></input> 
                            </td>
                        </tr>

                        <tr>
                            <td height={50}>사업자 번호</td>

                            <td>
                            <input type={'text'} 
                            value={BusinessNumber.BusinessNum}
                            onChange={reonBusinessNumber}
                            className='NewStore_StoreName'></input> 
                            </td>
                        </tr>

                        <tr>
                            <td height={50}>가게 위치</td>

                            <td>
                            <input type={'text'}
                            value={StoreLocation.StoreLocation}
                            onChange={reonStoreLocation}
                            className='NewStore_StoreName'></input> 
                            </td>
                        </tr>
                        <input type={'submit'} height={50} className='Listsubmit' value='등록하기'>
                        </input>
                    </table>
                </form>
            </div>
        </body>
    )
}

export default NewStore;
import React, { useState} from 'react';
import { MainNab } from '../MainPage/MainPage';
import './Notice.css'

function Borad(){
      const[BoradText,setBoardText] = useState({
          text : ''
      });
       
    const onChangText = (e) =>{
        setBoardText({
            ...BoradText,  
            text: e.target.value
        })
    }
   
    const [Plus,setPluse] = useState(1)
     let Plus1 = ()=>{
         setPluse(Plus + 1 )
     }

  
    return(
        <main className='BoardMain'>
            <form className='BoardForm'>
                <input id="BoardName" type={'text'} placeholder="제목"></input>
                <textarea className='BoardMaion' 
                placeholder='여기에 적어주세요'
                onChange={onChangText}
                ></textarea>
                <div className='seq' onClick={Plus1}>{Plus}</div>
                <button type='subimt' className='BoardSubmit' id='BdSubmit' >작성하기</button>
            </form>
        </main>
    )
}

export function NoticeBoard(){
    return(
        <div>
            <MainNab></MainNab>
            <Borad></Borad>
        </div>
    )
        
}

export default NoticeBoard;
/*
// src/modules/counter.js
import { useState } from "react";

// 초기 상태값
// const [ddd,estt] = useState('hi');

const initialState = {
    LoginTrue: true,
    Loginfalse : false,
  };
  
//   const [value, setValue] = useState(0);
  // 리듀서
  const counter = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
      case "Login_true":
        return {LoginTrue: state.LoginTrue};
        case "Login_false":
            return {Loginfalse: state.Loginfalse};
      default:
        return state;
    }
  };
  
  // 모듈파일에서는 리듀서를 export default 한다.
  export default counter;
  */
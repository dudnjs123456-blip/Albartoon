import { createStore } from "redux";
import { combineReducers } from "redux";
import counter from "../modules/counter";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from 'redux-logger';
import { enableBatching } from 'redux-batched-actions';


const LoginsuccessCheck = createSlice({
    name : 'stateLogin',
    initialState:{
        value : 'Login',
},
    reducers:{
        up:(state, action)=>{
           state.value = action.step + '님  반갑습니다!';
        },
        Loginout:(state, action)=>{
            state.value = 'Login';
         },
    },
})

const UserIDCheck = createSlice({
  name : 'UserID',
  initialState:{
      Id : '',
},
  reducers:{
      Login:(state, action)=>{
         state.ID = action.ChangeID;
      },
      Loginout:(state, action)=>{
          state.ID = '';
       },
  },
})

const UserStoreState = createSlice({
    name: 'StoreName',
    initialState: {
        User_Store : 'hi',
    },
    reducers: {
      Login:(state,action)=>{
        state.User_Store = action.LoginDATA;
      },
      Loginout:(state,action)=>{
        state.User_Store = '';
      }
    },
  });

const persistConfig = {
    key : 'root',
    storage,
    whitelist : ['stateLogin','StoreName' ,'UserID']
}

const rootreducers = combineReducers({
    stateLogin: LoginsuccessCheck.reducer,
    StoreName: UserStoreState.reducer, 
    UserID : UserIDCheck.reducer,
    });

 const persistedReducer = persistReducer(persistConfig, rootreducers)



// 리듀서 부분
const store = configureStore({
    reducer:{
        // 리덕스 batch
        stateLogin : enableBatching(persistedReducer),
        StoreName : enableBatching(persistedReducer),
        UserID :  enableBatching(persistedReducer),
    },  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
    /*.concat(logger), 로거 사용 콘솔방법*/
    // 기본 값이 true지만 배포할때 코드를 숨기기 위해서 false로 변환하기 쉽게 설정에 넣어놨다.
    devTools: true,
})

export const persistor = persistStore(store);

export default store;
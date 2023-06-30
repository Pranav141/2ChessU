import React, { createContext, useContext } from 'react'
import { useReducer } from 'react';

export const userDataContext=createContext();
const initialState={
    username:"",
    room:"",
    isPlayer:false,
    isSpectator:false,
    boardOrientation:""
}
export const UserContext = ({children}) => {
    const reducer=(state,action)=>{
    switch (action.type) {
        case "CREATE_ROOM":
            return {...state,username:action.payload.username,room:action.payload.room,isPlayer:true,isSpectator:false};
        case "JOIN_ROOM":
            return {...state,isPlayer:action.payload.isPlayer,isSpectator:action.payload.isSpectator,boardOrientation:action.payload.boardOrientation};
        case "disable_me":
            if(state.isSpectator===true){
                return state;
            }
            return {...state,isPlayer:false}
        case "enable_me":
            if(state.isSpectator===true){
                return state;
            }
            return {...state,isPlayer:true}
        default:
            break;
        }
    }
    
    const [state,dispatch]=useReducer(reducer,initialState);

    const data={state,dispatch}
    return (
        <userDataContext.Provider value={data}>
            {children}
        </userDataContext.Provider>
        )
}

export const useUserData= ()=>{

    return useContext(userDataContext)
} 
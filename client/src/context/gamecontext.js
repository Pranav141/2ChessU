import React, { createContext, useContext, useReducer } from 'react'

const gameContext=createContext();
const reducer=(state,action)=>{
    switch (action.type) {
        case "GAME_PLAYABLE":
            console.log(state);
            return {...state,gamePlayable:true};
        // case "SET_PLAYER_1"://for player 1 only
        //     console.log(state);

        //     return {...state,player1:action.username,isPlayer1:true}
        // case "SET_PLAYER_2":
        //     console.log(state);

        //     return {...state,player2:action.username,isPlayer2:true,gamePlayable:true}
        // case "SET_PALYER1_NAME":
        //     console.log(state);
            
        //     return {...state,player1:action.username,gamePlayable:state.gamePlayable};
        // case "SET_PALYER2_NAME":
        //     console.log(state);
        //     if(state.isPlayer1){
        //         return {...state,player2:action.username,gamePlayable:true}
        //     }
        //     return {...state,player2:action.username,gamePlayable:state.gamePlayable};
        default:
            break;
    }
}
export const GameContext = ({children}) => {
    const initialState={
        gamePlayable:false,
        // player1:'',
        // player2:'',
        // isPlayer1:false,
        // isPlayer2:false,

    }
    const [state,dispatch]=useReducer(reducer,initialState);
    return (
        <gameContext.Provider value={{state,dispatch}}>
            {children}
        </gameContext.Provider>
    )
}
export const useGameContext=()=>{return useContext(gameContext)}


//gameplayable (done)
//show turns (done)
//sound on move, error, message, room joined, capture, victory and defeat based on checkmate,  check ,initially game joined (done)
//add player names so thast it is visible to all the players in the server
//red on check
//edge case when user disconnects handle those


//player join a game then game_joined is triggered in chats-> we can use this socket to emit data by player 1 and player 2 and every one else can listen to this 
//socket message
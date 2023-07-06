import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/usercontext';
import Swal from 'sweetalert2'
import windowErrorSound from '../assets/audio/windows_error.mp3'
import gameJoinSound from '../assets/audio/game_join.mp3';
import { useGameContext } from '../context/gamecontext';


const MainMenu = ({socket}) => {
    const audioWindowsError = new Audio(windowErrorSound);
    const audioGameJoined = new Audio(gameJoinSound);
    

    const gameData=useGameContext();
    const gameState=gameData.state;
    const gameDispatch=gameData.dispatch;
    const navigate=useNavigate();
    const data=useUserData();
    const dispatch=data.dispatch;
    const [username,setUsername]=useState("");
    const [room,setRoom]=useState("");    
    
    const createRoom=()=>{
        if(username!==""){
            let roomID = Math.random().toString(36).substring(2, 13);
            setRoom(roomID);
            const payload={username,room,boardOrientation:"white"}
            dispatch({type:"CREATE_ROOM",payload:payload})
            // gameDispatch({type:"SET_PLAYER_1",username:username})
            socket.emit("create_room",{roomID,username});
            audioGameJoined.play();
            navigate(`/room/${roomID}`)
        }
        else{
          audioWindowsError.play();
            return (
                Swal.fire({
                    title: 'Username Error',
                    text: 'Please Enter a Username',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
            )
        }
    }
    const joinRoom=()=>{
        if(room!=="" && username!==""){
            const payload={username,room}
            dispatch({type:"CREATE_ROOM",payload:payload})
            socket.emit("check_room",({
                room:room,
                username:username
            }));
        }
        else{
            if(username===""){
                audioWindowsError.play();
                Swal.fire({
                    title: 'Username Error',
                    text: 'Please Enter a Username',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
            }
            else{
                audioWindowsError.play();
                return (
                    Swal.fire({
                        title: 'Room ID Error',
                        text: `Please Enter a Valid Room ID ${username}` ,
                        icon: 'error',
                        confirmButtonText: 'OK'
                      })
                    )
                }
            }
        }

        useEffect(() => {
          
            socket.on("check_room_1",(data)=>{
                if(data.exist===1){
                    socket.emit("join_room",({room:data.room,username:data.username,time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()}))
                    const payload={
                        isPlayer:false,
                        isSpectator:false,
                        boardOrientation:"black"
                    }
                    dispatch({type:"JOIN_ROOM",payload:payload})    
                    // gameDispatch({type:"SET_PLAYER_2",username:data.username})
                    audioGameJoined.play();
                    navigate(`/room/${data.room}`)
                }
                else if(data.exist>1){
                    socket.emit("join_room",({room:data.room,username:data.username,time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()}))
                    const payload={
                        isPlayer:false,
                        isSpectator:true
                    }
                    dispatch({type:"JOIN_ROOM",payload:payload})     
                    audioGameJoined.play();
                    navigate(`/room/${data.room}`)
                }
                else{
                    audioWindowsError.play();
                    Swal.fire({
                        title: 'Room ID Error',
                        text: `Please Enter a Valid Room ID ` ,
                        icon: 'error',
                        confirmButtonText: 'OK'
                      })
                }
            })
        }, [socket,navigate])
  return (
    <div className="h-screen flex items-center justify-center ">

        <div className="lg:w-2/5 w-4/5 h-4/5  lg:h-2/4 justify-center flex flex-col border-2 border-solid rounded-xl items-center">
          <div className="relative h-10 mb-5 w-2/4">
            <input
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Enter Your Name
            </label>
          </div>

          <button
            className="middle my-4 none center w-2/4 text-sm rounded-lg active:bg-blue-800 bg-blue-500 py-3 px-6 font-sans  font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={createRoom}
          >
            Create  Room
          </button>
          <p className='font-bold'>

          OR
          </p>

          <button
            className="middle none center my-4  w-2/4 rounded-lg active:bg-green-800 bg-green-500 py-3 px-6 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
            onClick={joinRoom}
          >
            Join Room
          </button>
          <div className="relative h-10 mt-5  w-2/4">
            <input
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-green-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={room}
              onChange={(e)=>setRoom(e.target.value)}

            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-green-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Enter Room ID
            </label>
          </div>
        </div>
      </div>

  )
}

export default MainMenu
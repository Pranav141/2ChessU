import { useEffect, useState } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import { useUserData } from "../context/usercontext";
import Swal from 'sweetalert2'
import { useGameContext } from "../context/gamecontext";
// audio files imports
import moveSound from '../assets/audio/move-self.mp3';
import wrongMoveSound from '../assets/audio/error.mp3';
import captureSound from '../assets/audio/capture.mp3'
import victorySound from '../assets/audio/victory.mp3'
import lostSound from '../assets/audio/lost.mp3'
import checkSound from '../assets/audio/move-check.mp3'
import promoteSUI from '../assets/audio/promoteSUIII.mp3'
export default function ChessBoard({socket,room}) {
  
  //audio files
  const audioMove=new Audio(moveSound);
  const audioWrongMove=new Audio(wrongMoveSound);
  const audioCapture=new Audio(captureSound);
  const audioVictory=new Audio(victorySound);
  const audioLost=new Audio(lostSound);
  const audioCheck=new Audio(checkSound);
  const audioSUIII=new Audio(promoteSUI);

  const [game, setGame] = useState(new Chess());
  const data=useUserData();
  const dispatch=data.dispatch;
  const gameContext=useGameContext();
  const gameState=gameContext.state;
  const gameDispatch=gameContext.dispatch;
  useEffect(()=>{
    socket.on("piece_move_recieve",(move)=>{
      makeAMove(move);
      if(move.flags==='c'){
        audioCapture.play();
      }
      else if(move.flags==='p' || move.flags==='pc' || move.flags==='np'){
        audioSUIII.play()
      }
      else{
        console.log(game.KING);
        audioMove.play();
      }
      dispatch({type:"enable_me"})
      if(game.in_checkmate()){
        audioLost.play();
        Swal.fire({
          title: 'You lost',
          text: 'L guy chal shana ban',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
      else if(game.in_check()){
        audioCheck.play();
        alert("Check");
      }
      else if(game.in_draw()){
        Swal.fire({
          title: 'Game Draw',
          text: 'L guy chal shana ban',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
      }
    })
   
    socket.on("GAME_PLAYABLE",()=>{
      gameDispatch({type:"GAME_PLAYABLE"})
    })
    },[socket])
  
  const state=data.state;
  function makeAMove(move) {//used to move chess pieces in the 'game' state
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    // console.log(game);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare, targetSquare) {//when the player moves this function is called
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
       promotion:'q'// always promote to a queen for example simplicity
      });
      // illegal move
      if (move === null) {
        //error sound
        audioWrongMove.play();
        return false;}
        // setTimeout(makeRandomMove, 200);
        console.log(move);
        
        if(move.flags==='c'){
          audioCapture.play();
        }
        else if(move.flags==='p' || move.flags==='pc'|| move.flags==='np'){
          audioSUIII.play()
        }
        else{
          audioMove.play();
        }
      socket.emit("piece_moved",{move,room:room});
      dispatch({type:"disable_me"})
      if(game.in_checkmate()){
        audioVictory.play()
        Swal.fire({
          title: 'You Won',
          text: 'Jeet gaya mera bhai',
          icon: 'success',
          confirmButtonText: 'OK'
        })

      }
      else if(game.in_check()){
        audioCheck.play();
        alert("Check");
        
      }
      else if(game.in_draw()){
        Swal.fire({
          title: 'Game Draw',
          text: 'L guy chal shana ban',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
      }

      return true;
    }
    const findPiecesDraggable=()=>{
  return state.isPlayer && gameState?.gamePlayable;
 }
  return(
    <div className="w-4/5">

  <Chessboard position={game.fen()} getPositionObject={(cur)=>{console.log("cur")}} onPieceDrop={onDrop} arePiecesDraggable={findPiecesDraggable()} boardOrientation={state.boardOrientation} showPromotionDialog={true} promotionDialogVariant="modal" customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(255,0,0,0.75)' }}/>
  
  {
  gameState?.gamePlayable?
  state.isPlayer?
  <button className="p-3 bg-gray-300 rounded-full" disabled>
      Your Turn
    </button>
:  

    <button className="p-3 border text-gray-300 rounded-full" disabled>
      Your Turn
    </button>
:
<p>
  waiting for second player
  </p>}
</div>
    ) 
  }
  // function makeRandomMove() {//easy level bot
  //   const possibleMoves = game.moves();
  //   if (game.in_draw()) 
  //   {
  //     console.log("game draw");
  //     return;
  //   }
  //   if(game.game_over()){
  //     console.log("game_over");
  //   } // exit if the game is over
  //   const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  //   makeAMove(possibleMoves[randomIndex]);
  // }
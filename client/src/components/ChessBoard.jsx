import { useEffect, useState } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import { useUserData } from "../context/usercontext";
import Swal from 'sweetalert2'

export default function ChessBoard({socket,room}) {
  const [game, setGame] = useState(new Chess());
  const data=useUserData();
  const dispatch=data.dispatch;
  useEffect(()=>{
    socket.on("piece_move_recieve",(move)=>{
      makeAMove(move);
      dispatch({type:"enable_me"})
      if(game.in_checkmate()){
        Swal.fire({
          title: 'You lost',
          text: 'L guy chal shana ban',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
      else if(game.in_check()){
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
       // always promote to a queen for example simplicity
      });
      
      // illegal move
      if (move === null) return false;
      // setTimeout(makeRandomMove, 200);
      console.log(move);
      socket.emit("piece_moved",{move,room:room});
      dispatch({type:"disable_me"})
      if(game.in_checkmate()){
        Swal.fire({
          title: 'You Won',
          text: 'Jeet gaya mera bhai',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }
      else if(game.in_check()){
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
      console.log(state.isPlayer);
  return state.isPlayer;
 }
  return(
    <div className="w-4/5">

  <Chessboard position={game.fen()} getPositionObject={(cur)=>{console.log(cur)}} onPieceDrop={onDrop} arePiecesDraggable={findPiecesDraggable()} boardOrientation={state.boardOrientation} showPromotionDialog={true} promotionDialogVariant="modal"/>;
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
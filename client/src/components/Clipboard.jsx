import React from 'react'
import copy from 'copy-to-clipboard'
import Swal from 'sweetalert2'
const Clipboard = ({roomID}) => {
    const copyToClipBoard=()=>{
        copy(roomID)
        Swal.fire(
            'Copied Succesfully!',
            "",
            'success'
          )
    }
  return (
    <div className='border border-gray-300 flex items-center justify-center rounded-lg rounded-t-2xl '>
        <div className='my-2'>
            Room ID:-
            <input type="text" className='bg-gray-300 text-base p-2 rounded-3xl ps-3' value={roomID} disabled/>
        </div>
        <div className='my-2'>
            <button onClick={copyToClipBoard} className='bg-orange-300 p-2 rounded-full active:bg-orange-500 hover:shadow-md hover:shadow-orange-400'>
                Copy to ClipBoard
            </button>
        </div>
    </div>
  )
}

export default Clipboard
import MainMenu from "./components/MainMenu";
import io from "socket.io-client";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Rooms from "./pages/Rooms";
import { UserContext } from "./context/usercontext";
import { GameContext } from "./context/gamecontext";
const socket=io.connect("https://two-chess-u.onrender.com")//https://two-chess-u.onrender.com
function App() {
  return (
    <div className="App " >
      <UserContext>
      <GameContext>
      <Router>
        <Routes>
          <Route exact path='/' element={<MainMenu socket={socket}/>}/>
          <Route exact path='/room/:roomID' element={<Rooms socket={socket}/>}/>
        </Routes>
      </Router>
</GameContext>
      </UserContext>
      
    </div>
  );
}

export default App;

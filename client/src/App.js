import MainMenu from "./components/MainMenu";
import io from "socket.io-client";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Rooms from "./pages/Rooms";
import { UserContext } from "./context/usercontext";
const socket=io.connect("https://2-chess-u.vercel.app")
function App() {
  return (
    <div className="App " >
      <UserContext>

      <Router>
        <Routes>
          <Route exact path='/' element={<MainMenu socket={socket}/>}/>
          <Route exact path='/room/:roomID' element={<Rooms socket={socket}/>}/>
        </Routes>
      </Router>
      </UserContext>
      
    </div>
  );
}

export default App;

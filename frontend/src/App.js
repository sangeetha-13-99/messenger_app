import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


import Register from './components/Register';
import Login from './components/Login';
import Messenger from "./components/Messenger";
import IsAuthenticated from "./common/IsAuthenticated";
import SocketContextProvider from "./store/socketContext";

function App() {

  const router=createBrowserRouter([
    {
      path:'/',
      children:[
        {index:true,element:
        <IsAuthenticated>
          <SocketContextProvider>
            <Messenger/>
          </SocketContextProvider>
        </IsAuthenticated>},
        {path:'login',element:<Login/>},
        {path:'register',element:<Register/>},
      ]
    }
  ]);

  return (
    <div className="App">
      <ToastContainer/>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;

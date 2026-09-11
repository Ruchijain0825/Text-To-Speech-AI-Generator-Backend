import Header from "./layout/Header";
import MainLayout from "./layout/MainLayout";
import Sidebar from "./layout/Sidebar";
import UserAuth from './auth/UserAuth.jsx';
import { Toaster, toast } from "react-hot-toast";

function App()
{
  return(
    <> 
    <Toaster/>
   <UserAuth/>
   <MainLayout/>
   </>
  )
}
export default App;
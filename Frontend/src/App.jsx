import Header from "./layout/Header";
import MainLayout from "./layout/MainLayout";
import Sidebar from "./layout/Sidebar";
import UserAuth from './auth/UserAuth.jsx';
import { Toaster, toast } from "react-hot-toast";

import TextToSpeechInput from "./components/TextToSpeechInput.jsx";
import GeneratedAudio from "./components/GeneratedAudio.jsx";
function App()
{
  return(
    <> 

    <Toaster/>
     <div className="flex h-screen overflow-hidden bg-[#fafbff]">

      {/* SIDEBAR */}

      <Sidebar />


      {/* RIGHT SIDE */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}

        <Header />


        {/* MAIN */}

        <main className="min-h-0 flex-1 overflow-y-auto">
          <TextToSpeechInput/>
          <GeneratedAudio/>

         

        </main>

      </div>

    </div>
   
   </>
  )
}
export default App;
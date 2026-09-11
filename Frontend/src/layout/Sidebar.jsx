import {logo,robot} from '../assets/assests.js';
import {
  Bot,
  Volume2,
  Settings,
  Bookmark,
  History,
   UserRound, 
   User
} from "lucide-react";

const Sidebar = () =>
{
    return(
        <aside  className='bg-white-200 w-64 min-h-screen shadow-lg'>
            <header>
          
               <img src = {logo} width = "90px" className='text-lg'/>
            </header>
            <nav className= "flex flex-col gap-2 p-4 text-sm">
                <a  href ="#" className='shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900'>
                 <Volume2 size ='20'/>  <span>Text to Speech</span>
                </a>
                <a  href ="#" className='shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900'>
                    <Bot size ='20'/>  <span>AI Conversation</span>
                </a>
                <a  href ="#" className='shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900'>
                   <UserRound size = '20'/> <span> Live Conversation </span>
                </a>
                <a  href ="#" className='shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900'>
                  <History size ="20"/> <span> History </span>
                </a>
                <a  href ="#" className='shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900'>
                   <Bookmark size = "20"/> <span>Saved Conversation</span>
                </a>
                <a  href ="#" className='shadow-sm flex items-center gap-3 px-4 py-3 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900'>
                   <Settings size = "20"/> <span> setting </span>
                </a>
               
               
            </nav>
            <section>
                  <img src = {robot} className='mx-auto mt-1 w-40' alt ="robot-img"/>
                 <div className='flex items-center gap-3 px-4 py-3 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900'>
                    Upgarde to pro
                </div>
            </section>

            <footer>

                  <div className='flex items-center gap-3 px-4 py-3 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-[#635BFF] hover:text-gray-900'>
                    Profile
                </div>
            </footer>
        </aside>
    )
}
export default Sidebar;



import { useState } from "react";
import HelpModal from './HelpModal.jsx'
import AccountModal from "./AccountModal.jsx";
const Header = ()=>
{
    const[showHelp,setShowHelp]=useState(false);
    const[showBlack,setShowBlack]=useState(false);
    const[showAccountDetails,setShowAccountDetails]=useState(false)
   

     const toggleTheme = ()=>
     {
        setShowBlack(!showBlack);
        document.body.style.backgroundColor= !showBlack ? "white":"black"
     }
    return(
        <>
        
         <header className = "h-16 w-full border-b border-gray-100 bg-white px-6 shadow-lg">
         <div className="flex h-full items-center justify-end gap-6">

            <button onClick = {toggleTheme} type ="button" className= "text-gray-200 transition hover:text-gray-800 " arial-label="Toggle theme">☾</button>

            <button onClick={()=>{setShowHelp(true);setShowAccountDetails(false)}} type ="button" className="text-gray-500 transition hover:text-gray-800">Help</button>

            <button onClick = {()=>{setShowAccountDetails(true);setShowHelp(false)}} type = "button" className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white" aria-label = "profile">R

            </button>
         </div>

         </header>

         {showHelp && (
            <HelpModal onClose = {()=>setShowHelp(false)}/>
         )}
         {showAccountDetails && (<AccountModal/>)}
         </>
    )

}
export default Header;
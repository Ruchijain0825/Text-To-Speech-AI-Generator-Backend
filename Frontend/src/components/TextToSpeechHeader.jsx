import { Volume1,Volume2,VolumeX } from "lucide-react";
 const TextToSpeechHeader = () =>
 {

    return(
         <> 
         <div className="flex items-center gap-2">



        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600"> 


        
        <Volume1 size ={17} className="text-white"/>
        </div>
        <div> 
        <h2 className="text-sm font-bold text-gray-800">Text to Speech</h2>
       
       
        <p className="text-[9px] text-gray-400">
            Convert your text into natural AI speech
        </p>
        </div>
        </div>
        </>
    )
 }
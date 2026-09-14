import { useState,useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Copy,Sparkles } from "lucide-react";
import {TranslateSpeechGenerator,VoiceGenerator} from "../apis/TranslateSpeech.jsx"
const TextToSpeechInput =()=>
    
{
    const[input,setINput]=useState("");
    const[language,setLanguage]=useState("english");
    const[voiceId,setVoiceId]=useState("");
    const [voices, setVoices] = useState([]);
      useEffect(() => {

        const fetchVoices = async () => {
            try {
                const result = await VoiceGenerator();
                console.log("VOICE RESULT:", result);
console.log("VOICE DATA:", result.voices);


                console.log("Voices:", result.voices);

                setVoices(result.voices);

            } catch (error) {
                console.error(error.message);
                toast.error(error.message);
            }
        };

        fetchVoices();

    }, []);
    const handleGenerate = async()=>
    {
        try{
            const data = {
                text:input,
                language:language,
                voiceId:voiceId
            }
           
              const audioBlob = await TranslateSpeechGenerator(data);

            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioUrl);

            audio.play();
        }
        catch(error)
        {
            console.error(error.message);
           toast.error(error.message)
        }
    }
    return (

    
    <div className="w-[95%] rounded-xl shadow-sm bg-white p-4">
    <div className="flex items-center justify-between">
        <h2 className="text-[11px] text-gray-700 font-bold">

        </h2>
        <p className="text-[9px] font-medium text-gray-400">{input.length}/500</p>
    </div>

        <div className="relative mt-2"> 
        <textarea value ={input} onChange = {(e)=>setINput(e.target.value)} className="mt-2 w-full h-20 rounded-lg border border-gray-200 bg-[#f8f9ff] p-3 text-xs text-gray-700 outline-none resize-none" placeholder="hello world , how are you?"/>
        <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
            <Copy size ={14}/>

        </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
                <label className="text-[10px] font-bold text-gray-700">
                    language
                </label>
                <select value ={language} onChange={(e)=>setLanguage(e.target.value)} className="mt-1 h-8 w-full rounded-lg border border-gray-200 bg-[#f8f9ff] px-2 text-[10px] text-gray-600 outline:none">
                    <option value="english">🇬🇧 English</option>
                    <option value="hindi">🇮🇳 Hindi</option>
                    <option value="spanish">🇪🇸 Spanish</option>
                </select>
            </div>
            <div>
                <label className="text-[10px] font-bold text-gray-700">
                    Voice
                </label>
                <select value ={voiceId} onChange={(e)=>setVoiceId(e.target.value)} className="mt-1 h-8 w-full rounded-lg border border-gray-200 bg-[#f8f9ff] px-2 text-[10px] text-gray-600 outline-none">
                    <option value ="">Select voice</option>
                    {voices.map((voice)=>(<option key ={voice.voice_id} value = {voice.voice_id}>{voice.name}</option>))}
                </select>
            </div>
        </div>

        <button onClick = {handleGenerate} 
        
        
        className="mx-auto mt-3 flex h-8 w-45 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-medium text-white shadow-sm">

  

  <Sparkles size={12} />
  Generate Speech
</button>
    </div>
    )
}
export default TextToSpeechInput;
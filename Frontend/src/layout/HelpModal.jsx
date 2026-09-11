import { X } from "lucide-react";
const HelpModal = ({onClose})=>
{
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 ">
              <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl"> 

             <div className="mt-10 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Frequently Asked Question
                </h1>
                <p className="text-xl text-gray-500">Everything you need about the product</p>
                <button onClick = {onClose} className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-800 hover:text-gray-600">
                    <X size ={20}></X>
                </button>
                
             </div>
             <div className="mt-10 space-y-3">

                <details className="rounded-lg border border-gray-200 p-4">
                    <summary className="cursor-pointer font-medium text-gray-700">
                         How does Text to Speech work?
                    </summary>
                    < p className="mt-2 text-sm text-gray-500">
                     Enter your text and VoiceCraft will convert it
                     into natural-sounding speech.
                    </p>
                </details>
                <details className="rounded-lg border border-gray-200 p-4">
                    <summary className="cursor-pointer font-medium text-gray-700">
                         How does AI Conversation work? ?
                    </summary>
                    < p className="mt-2 text-sm text-gray-500">
                     AI Conversation allows you to interact with the
                     AI and receive spoken responses.
                    </p>
                </details>
                <details className="rounded-lg border border-gray-200 p-4">
                    <summary className="cursor-pointer font-medium text-gray-700">
                          Can I save my conversations?
                         
                    </summary>
                    < p className="mt-2 text-sm text-gray-500">
                    Yes, you can save conversations and access them
                    later from Saved Conversation.
                    </p>
                </details>
                <details className="rounded-lg border border-gray-200 p-4">
                    <summary className="cursor-pointer font-medium text-gray-700">
                        Where can I find my history?
                    </summary>
                    < p className="mt-2 text-sm text-gray-500">
                     Your previous conversations can be accessed from
                    the History section.
                    </p>
                </details>
               
             </div>
        </div>
        </div>
    )
}
export default HelpModal;
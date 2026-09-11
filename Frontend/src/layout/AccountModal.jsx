
const AccountModal = ()=>
{
    return(
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
           <div className="mt-16 w-72  rounded-2xl bg-white p-4 shadow-xl"> 
             
                <div className="border-b border-gray pb-4">
                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-lg font-semibold text-white">
                            R
                        </div>
                        <div> 
                        <h1 className="font-semibold text-gray-800">
                            UserName
                        </h1>
                        <p className="font-semibold text-gray-400">
                            Text-to-speech convertor
                        </p>
                    </div>

                    </div>

                </div>
                <div className="mt-3 space-y-1">
                    <button className="flex w-full items-center gap-4 rounded-lg px-2 y-3 text-left hover:bg-gray-50">
                        <span>👤</span>
                        <div>
                            <p className="text-sm text-gray-700">
                                username@gamil.com
                            </p>
                            <p className="text-xs text-gray-400">
                                Signed in
                            </p>
                        </div>
                    </button>
                  
                    <button className="flex w-full items-center gap-4 rounded-lg px-2 y-3 text-left hover:bg-gray-50">
                        <span>⚙️</span>
                          <span className="text-sm text-gray-700">
                            Account
                        </span>
                    </button>
                    <button className="flex w-full items-center gap-4 rounded-lg px-2 y-3 text-left hover:bg-gray-50">
                        <span>🚪</span>
                          <span className="text-sm text-gray-700">
                            Logout
                        </span>
                    </button>
                </div>
            
            </div>
        </div>
    )
}
export default AccountModal;
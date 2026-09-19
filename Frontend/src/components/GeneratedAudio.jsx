import { Pause, RotateCcw, Volume2, Minus, Plus, Download, Trash2, Circle, Globe, Zap } from "lucide-react";

const GeneratedAudio = () => {
  return (
    <>
      <div className="w-[95%] rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[11px] font-bold text-gray-700">Generated Audio</h2>
            <p className="mt-1 text-[9px] text-gray-400">Listen and control your generated speech</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1">
              <Circle size={7} className="fill-green-500 text-green-500" />
              <span className="text-[9px] font-medium text-green-600">Ready</span>
            </div>
            <span className="text-[9px] font-medium text-gray-500">0:12</span>
          </div>
        </div>

        <div className="mt-3 w-full rounded-xl bg-[#f8f9ff] p-3">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 shadow-sm">
              <Pause size={16} className="fill-white text-white" />
            </button>

            <span><h1 className="text-gray-500">0:04/0:12</h1></span>

            <div className="min-w-0 flex-1">
              <input className="w-full accent-indigo-500" type="range" min="0" max="100" defaultValue="50" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="flex h-8 w-25 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 shadow-sm">
                <RotateCcw size={12} />
                Restart
              </button>

              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm">
                <Minus size={14} />
              </button>

              <Volume2 size={13} className="text-indigo-500" />

              <input type="range" min="0" max="100" defaultValue="50" className="w-28 accent-indigo-500" />

              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm">
                <Plus size={14} />
              </button>

              <button className="flex h-8 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-[9px] text-gray-500 shadow-sm">
                70%
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <button className="flex h-8 w-55 items-center justify-center gap-1 rounded-lg border border-green-200 bg-white text-xs text-green-600 shadow-sm">
              <Download size={10} />
              Download Audio
            </button>

            <button className="flex h-8 w-55 items-center justify-center gap-1 rounded-lg border border-red-200 bg-white text-xs text-red-600 shadow-sm">
              <Trash2 size={10} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 grid w-[95%] grid-cols-3 gap-3">
        <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50">
            <Globe size={15} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-700">Multiple Languages</h3>
            <p className="mt-1 text-[8px] text-gray-400">Convert text into different languages</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50">
            <Volume2 size={15} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-700">Natural Voices</h3>
            <p className="mt-1 text-[8px] text-gray-400">AI-powered natural speech</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50">
            <Zap size={15} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-700">Fast Generation</h3>
            <p className="mt-1 text-[8px] text-gray-400">Generate audio in seconds</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneratedAudio;
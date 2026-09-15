import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";

import { Toaster } from "react-hot-toast";

import TextToSpeechInput from "./components/TextToSpeechInput.jsx";
import GeneratedAudio from "./components/GeneratedAudio.jsx";
import AIConversation from "./components/AiConversation.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster />

      <div className="flex h-screen overflow-hidden bg-[#fafbff]">

        {/* SIDEBAR */}
        <Sidebar />

        {/* RIGHT SIDE */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* HEADER */}
          <Header />

          {/* MAIN */}
          <main className="min-h-0 flex-1 overflow-y-auto">

            <Routes>

              {/* TEXT TO SPEECH */}
              <Route
                path="/"
                element={
                  <>
                    <TextToSpeechInput />
                    <GeneratedAudio />
                  </>
                }
              />

              {/* AI CONVERSATION */}
              <Route
                path="/ai-conversation"
                element={<AIConversation />}
              />

            </Routes>

          </main>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import UserAuth from "./auth/UserAuth";
import Dashboard from "./pages/Dashboard";

import TextToSpeechInput from "./components/TextToSpeechInput";
import AIConversation from "./components/AiConversation";
import LiveConversation from "./components/LiveConversation";

import History from "./layout/History";
import SavedConversation from "./layout/SavedConversation";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
     <Toaster position="top-right" />
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<UserAuth />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        >

          {/* /dashboard */}
          <Route
            index
            element={
              <Navigate
                to="text-to-speech"
                replace
              />
            }
          />

          {/* TEXT TO SPEECH */}
          <Route
            path="text-to-speech"
            element={<TextToSpeechInput />}
          />

          {/* AI CONVERSATION */}
          <Route
            path="ai-conversation"
            element={<AIConversation />}
          />

          {/* LIVE CONVERSATION */}
          <Route
            path="live-conversation"
            element={<LiveConversation />}
          />

          {/* HISTORY */}
          <Route
            path="history"
            element={<History />}
          />

          {/* SAVED CONVERSATION */}
          <Route
            path="saved"
            element={<SavedConversation />}
          />

        </Route>

        {/* UNKNOWN ROUTE */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
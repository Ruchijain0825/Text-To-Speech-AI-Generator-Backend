import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import UserAuth from "./auth/UserAuth";
import Dashboard from "./pages/Dashboard";

import TextToSpeechInput from "./components/TextToSpeechInput";
import AIConversation from "./components/AiConversation";
import LiveConversation from "./components/LiveConversation";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<UserAuth />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>

          {/* Default → Text to Speech */}
          <Route
            index
            element={
              <Navigate
                to="/dashboard/text-to-speech"
                replace
              />
            }
          />

          {/* Text to Speech */}
          <Route
            path="text-to-speech"
            element={<TextToSpeechInput />}
          />

          {/* AI Conversation */}
          <Route
            path="ai-conversation"
            element={<AIConversation />}
          />

          {/* Live Conversation */}
          <Route
            path="live-conversation"
            element={<LiveConversation />}
          />

        </Route>

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
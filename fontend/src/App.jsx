import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ChatPage from "./pages/ChatPage.jsx";
function App() {


  return (
    <>
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router>
    </>
  )
}

export default App

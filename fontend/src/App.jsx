import './App.css'
import {  Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ChatPage from "./pages/ChatPage.jsx";
function App() {


  return (
    <>
        <div className="App">

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>

        </div>
    </>
  )
}

export default App

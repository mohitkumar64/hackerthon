import {Routes , Route} from "react-router-dom"
import { Login } from "./pages/LoginPage"
import { Register } from "./pages/Register"
import ProtectedRoute from "./protectedRouter"
import { ProfilePage } from "./pages/Profile"

import {HomePage} from './pages/HomePage'
import Automation from './pages/Automation'
import { N8n } from "./pages/N8n"
import './App.css'

function App() {
 

  return (
    <>
     <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/automation" element={<Automation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accessibility" element={<N8n />} />
        
        <Route 
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage/>
                </ProtectedRoute>
              }
/>
     </Routes>
    </>
  )
}

export default App

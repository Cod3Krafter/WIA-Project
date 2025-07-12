import { Route, Routes } from 'react-router'
import AuthPage from "../pages/AuthPage.jsx"
import HomePage from "../pages/HomePage.jsx"


function App() {
  return (
    <div className="relative h-full w-full"> 
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24" />
          <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/auth' element={<AuthPage/>}></Route>
          </Routes>
      </div>
  )
}

export default App
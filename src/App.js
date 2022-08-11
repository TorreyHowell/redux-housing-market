import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import { useDispatch } from 'react-redux'
import PrivateRoute from './components/PrivateRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Explore from './pages/Explore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { getUser } from './features/auth/authSlice'
import Category from './pages/Category'

function App() {
  const dispatch = useDispatch()
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      dispatch(getUser(user))
    })
  }, [dispatch, auth])

  return (
    <>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <Nav />
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

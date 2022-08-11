import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Profile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    return () => {
      dispatch(reset())
    }
  }, [dispatch, user, navigate])
  const onLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div>
      <button onClick={onLogout}>Logout</button>
      <p>{user.displayName}</p>
    </div>
  )
}
export default Profile

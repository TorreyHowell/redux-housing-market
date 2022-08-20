import googleIcon from '../assets/svg/googleIcon.svg'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { oauth } from '../features/auth/authSlice'
import { useEffect } from 'react'

function OAuth() {
  const location = useLocation()
  const dispatch = useDispatch()

  const onGoogleClick = () => {
    dispatch(oauth())
  }
  return (
    <div
      style={{
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <p>Sign {location.pathname === '/register' ? 'up' : 'in'} with</p>
      <button
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.75rem',
          margin: '.5rem',
          width: '3rem',
          height: '3rem',
          backgroundColor: '#1d1d1d',
          borderRadius: '50%',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        }}
        onClick={onGoogleClick}
      >
        <img
          style={{
            width: '100%',
          }}
          src={googleIcon}
          alt="google"
        />
      </button>
    </div>
  )
}
export default OAuth

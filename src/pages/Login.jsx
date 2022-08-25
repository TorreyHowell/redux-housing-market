import Vertical from '../tui/Vertical'
import Horizontal from '../tui/Horizontal'
import FormInput from '../tui/FormInput'
import styles from '../styles/FormInput.module.css'
import Button from '../tui/Button'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { password, email } = formData

  const { isError, isSuccess, message, user } = useSelector(
    (state) => state.auth
  )

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/')
    }

    if (isError) {
      toast.error(message)
      dispatch(reset())
    }
  }, [navigate, isSuccess, message, isError, dispatch, user])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(login(formData))
  }

  return (
    <>
      <main>
        <Vertical>
          <Horizontal>
            <form onSubmit={onSubmit} className={styles.formGroup}>
              <div className="pageHeader">Login</div>
              <FormInput
                type="email"
                id="email"
                name="email"
                placeholder={'Email'}
                value={email}
                onChange={onChange}
                required={true}
              />
              <FormInput
                id="password"
                value={password}
                type={'password'}
                placeholder={'Password'}
                onChange={onChange}
                required={true}
              />

              <Button type="submit" width={40} mt="10">
                Login
              </Button>
              <Link className="signInLink" to={'/register'}>
                Sign-up instead
              </Link>
            </form>
            <OAuth />
          </Horizontal>
        </Vertical>
      </main>
    </>
  )
}
export default Login

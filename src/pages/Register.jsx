import { useState } from 'react'
import Vertical from '../tui/Vertical'
import FormInput from '../tui/FormInput'
import { useDispatch, useSelector } from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../tui/Button'
import styles from '../styles/FormInput.module.css'
import Horizontal from '../tui/Horizontal'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { errors, isSuccess, user } = useSelector((state) => state.auth)

  const { passwordMessage, nameMessage } = errors

  const { name, email, password, password2 } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/')
    }
    return () => {
      dispatch(reset())
    }
  }, [dispatch, isSuccess, navigate, user])

  const onSubmit = (e) => {
    e.preventDefault()

    dispatch(register(formData))
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  return (
    <main>
      <Vertical>
        <Horizontal>
          <p className="pageHeader">Register</p>

          <form onSubmit={onSubmit} className={styles.formGroup}>
            <FormInput
              placeholder="Name"
              type="text"
              id="name"
              value={name}
              onChange={onChange}
            />
            {nameMessage && (
              <div className="formErrorContainer">
                <p className="formErrorText">*{nameMessage}</p>
              </div>
            )}

            <FormInput
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
              required={true}
            />
            <FormInput
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />
            <FormInput
              type="password"
              placeholder="Confirm Password"
              id="password2"
              value={password2}
              onChange={onChange}
            />
            {passwordMessage && (
              <div className="formErrorContainer">
                <p className="formErrorText">*{passwordMessage}</p>
              </div>
            )}

            <Button mt="10" type="submit" width={40}>
              Submit
            </Button>
            <Link className="signInLink" to={'/login'}>
              Login instead
            </Link>
          </form>
        </Horizontal>
      </Vertical>
    </main>
  )
}
export default Register

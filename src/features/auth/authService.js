import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase.config'

const register = async ({ name, email, password }) => {
  const auth = getAuth()

  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  const user = userCredentials.user

  updateProfile(auth.currentUser, {
    displayName: name,
  })

  await setDoc(doc(db, 'users', user.uid), {
    name,
    email,
    timestamp: serverTimestamp(),
  })

  return {
    displayName: name,
    email: user.email,
    photoURL: user.photoURL,
  }
}

const login = async ({ email, password }) => {
  const auth = getAuth()

  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  const { user } = userCredentials

  const userData = {
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
  }

  localStorage.setItem('user', JSON.stringify(userData))

  return userData
}

const logout = () => {
  const auth = getAuth()

  auth.signOut()

  localStorage.clear('user')
}

const registerValidation = ({ name, password, password2 }) => {
  const messages = {
    nameMessage: '',
    passwordMessage: '',
  }

  let errors = false

  if (name.length < 1) {
    errors = true
    messages.nameMessage = 'Name is required'
  }

  if (name.length < 3 && name.length > 0) {
    errors = true
    messages.nameMessage = 'Name is too short'
  }

  if (password.length < 1) {
    errors = true
    messages.passwordMessage = 'Password is required'
  } else if (password.length < 6) {
    errors = true
    messages.passwordMessage = 'Password too short'
  }

  if (password !== password2) {
    errors = true
    messages.passwordMessage = 'Passwords do not match'
  }

  return {
    errors,
    messages,
  }
}

const authService = {
  registerValidation,
  login,
  logout,
  register,
}

export default authService

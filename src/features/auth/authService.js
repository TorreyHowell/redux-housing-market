import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import {
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from 'firebase/firestore'
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

const update = async ({ name, email }) => {
  const auth = getAuth()

  if (auth.currentUser.displayName !== name) {
    await updateProfile(auth.currentUser, {
      displayName: name,
    })
  }

  const userRef = doc(db, 'users', auth.currentUser.uid)

  await updateDoc(userRef, {
    name,
  })

  return {
    name,
    email,
  }
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

const oauth = async () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  const docRef = doc(db, 'users', user.uid)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName,
      email: user.email,
      timestamp: serverTimestamp(),
    })
  }

  return {
    id: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  }
}

const authService = {
  registerValidation,
  login,
  logout,
  register,
  update,
  oauth,
}

export default authService

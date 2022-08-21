// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDFyqVq7KQPh5jWELt_Oo3X9tuizzgoLbI',
  authDomain: 'housing-market-91051.firebaseapp.com',
  projectId: 'housing-market-91051',
  storageBucket: 'housing-market-91051.appspot.com',
  messagingSenderId: '961339855020',
  appId: '1:961339855020:web:44bbbf00374ed876fb4f09',
  measurementId: 'G-9B0H5B9J14',
}

// Initialize Firebase
initializeApp(firebaseConfig)

export const db = getFirestore()

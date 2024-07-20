// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import firebase from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
import { getMessaging, getToken } from 'firebase/messaging'
import { getStorage } from 'firebase/storage'
// import { initializeApp } from 'firebase-admin/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD79M89HGlUGS1ytNN1eLgvQl19XjoOX14",
    authDomain: "eventmanagement-6e9dc.firebaseapp.com",
    projectId: "eventmanagement-6e9dc",
    storageBucket: "eventmanagement-6e9dc.appspot.com",
    messagingSenderId: "416889387779",
    appId: "1:416889387779:web:fece1160b340a061658736",
    measurementId: "G-3SQD5HFSRN"
  };

const settings = {
  experimentalForceLongPolling: true,
}
// Initialize Firebase

const app = initializeApp(firebaseConfig)
// initializeFirestore(app, settings)

// firebase.firestore().settings({ experimentalForceLongPolling: true });
// const db = getFirestore(app)
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
})
const storage = getStorage()
// const messagingF = messaging()
const messaging = getMessaging(app)

// export const auth = app.auth()
const auth = getAuth()
const analytics = getAnalytics(app)

export { auth, db, storage, messaging, getToken }

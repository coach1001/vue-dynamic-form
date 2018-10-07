import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
  apiKey: 'AIzaSyC9pCDrLe3hVi_LePQ80BOoAqOgTuJI98Q',
  authDomain: 'optijot-dev.firebaseapp.com',
  databaseURL: 'https://optijot-dev.firebaseio.com',
  projectId: 'optijot-dev',
  storageBucket: 'optijot-dev.appspot.com',
  messagingSenderId: '787640792646'
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const optometristsCollection = db.collection('optometrists')
const patientsCollection = db.collection('patients')
const practicesCollection = db.collection('practices')
const uiLayoutCollection = db.collection('uiLayout')
const testsCollection = db.collection('tests')

export {
  db,
  auth,
  currentUser,
  optometristsCollection,
  patientsCollection,
  practicesCollection,
  uiLayoutCollection,
  testsCollection
}
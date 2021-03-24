import Vue from 'vue'
import firebase from 'firebase/app'

// Add the Firebase services that you want to use
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'

import firebaseConfig from '../../firebaseConfig'
firebase.initializeApp(firebaseConfig)

Vue.prototype.$firebase = firebase

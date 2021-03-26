import Vue from 'vue'
import firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import store from '../store'
console.log('store', store)

// Add the Firebase services that you want to use
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'

import firebaseConfig from '../../firebaseConfig'
firebase.initializeApp(firebaseConfig)

Vue.prototype.$firebase = firebase
Vue.prototype.$ui = firebaseui

firebase.auth().onAuthStateChanged(async (user) => {
  let result = null
  if (user) {
    result = await firebase.firestore().collection('users').doc(user.uid).get()
    result = result.data()
  }
  store().commit('user/updateUser', result)
})

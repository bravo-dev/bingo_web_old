import Vue from 'vue'
import firebase from '@/plugins/firebase'

Vue.prototype.$signIn = (callback) => {
    firebase.auth().onAuthStateChanged(function(user) {
        callback(user)
    })
    firebase.auth().anonymously().catch(function(error) {
        console.log(error)
    })
}
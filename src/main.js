import Vue from 'vue'
Vue.config.devtools = true
import App from './App.vue'
import router from './router'
import VeeValidate from 'vee-validate'
import vSelect from 'vue-select'
import BootstrapVue from 'bootstrap-vue'

import { store } from './store/store.js'
import { VueMaskDirective } from 'v-mask'
import { fieldUtils, objectUtils } from './utilities/Utilities'

const firebase = require('./firebase/firebaseConfig.js')

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './styles.css'
import './assets/hawcons.css'

Vue.use(VeeValidate, {
  inject: true, 
  fieldsBagName: '$veeFields'
})
Vue.use(BootstrapVue)
Vue.component('v-select', vSelect)
Vue.directive('mask', VueMaskDirective)

Vue.config.productionTip = false
Vue.prototype.$fieldUtils = fieldUtils
Vue.prototype.$objectUtils = objectUtils

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
}

let app
firebase.auth.onAuthStateChanged((user) => {
  if(user) {    
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')  
  }
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})

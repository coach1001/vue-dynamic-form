import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import TestsPage from '../components/TestsPage'
import UserAccessPage from '../components/UserAccessPage'
import SearchPage from '../components/SearchPage'

Vue.use(Router)

const router = new Router ({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'UserAccessPage',
      component: UserAccessPage,
      meta: {
        requiresUnauth: true
      }      
    },   
    {
      path: '/search',
      name: 'SearchPage',
      component: SearchPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tests/:patientId',
      name: 'TestsPage',
      component: TestsPage,
      meta: {
        requiresAuth: true
      }      
    },
    {
      path: '/tests',
      redirect: '/search'
    },
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const requiresUnauth = to.matched.some(x => x.meta.requiresUnauth)  
  const currentUser = firebase.auth().currentUser
  if (requiresAuth && !currentUser ) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else if (requiresUnauth && currentUser) {
    next('/search')
  } else {
    next()
  }
})

export default router

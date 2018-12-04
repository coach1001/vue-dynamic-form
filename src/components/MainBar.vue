<template>
  <b-navbar toggleable="md" type="dark" variant="primary" class="shadow">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand @click="pushRoute('/search')">
      <img src="../assets/optijotIcon.svg" width="50" height="50" alt="">
      <span>Optijot</span>
    </b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item v-if="currentUser" @click="pushRoute('/search')">Search</b-nav-item>        
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item class="d-none d-md-block" v-if="currentUser">
          <b-col class="mr-1 nav-info-text">          
            <b-col class="text-right">{{currentUser.email || ''}}</b-col>
            <b-col class="text-right">{{`${userProfile.firstName || ''} ${userProfile.lastName || ''}`}}</b-col>
            <b-col class="text-right">{{practice.name || ''}}</b-col>
          </b-col>
        </b-nav-item>          
        <b-nav-item v-if="currentUser" @click="logout">Logout</b-nav-item>
        <b-nav-item v-if="!currentUser" @click="pushRoute('/login')">Login</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
const firebase = require('../firebase/firebaseConfig.js')
import to from 'await-to-js'
import { mapState } from 'vuex'

export default {
  name: "MainBar",
  computed: {
    ...mapState(['currentUser', 'userProfile', 'practice'])
  },
  methods: {
    async logout() {
      let err
      [err] = await to(firebase.auth.signOut())
      if(err) {
        this.$store.commit('setBackendError', err)
      } else {        
        this.$store.dispatch('clearData')        
        this.$router.push('/login')
      }
    },
    pushRoute(route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped>
.nav-info-text{
  font-size: .7rem;
  color: rgba(255, 255, 255, 0.75);    
}

.align-self-center {
  align-self: center;
}

</style>
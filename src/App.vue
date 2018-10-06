<template>
  <div id="app">
    <loading :show="showLoader"></loading>
    <div class="mb-5">
      <main-bar></main-bar>
    </div>
    <b-container>
      <router-view></router-view>
    </b-container>  
  </div>  
</template>

<script>
import loading from 'vue-full-loading'
import MainBar from './components/MainBar'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    loading,
    MainBar
  },
  computed: {
    ...mapGetters({
      showLoader: 'getShowLoader'
    })
  },
}
</script>

<style scoped>
</style>

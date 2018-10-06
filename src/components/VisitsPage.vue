<template>
  <div v-if="!$objectUtils.isEmpty(mainUiLayout)" class="mb-3">
    <b-card no-body>
      <b-tabs card @input="tabShown">
        <b-tab v-for="(screen, sIndex) in mainUiLayout.screens" :key="sIndex" :title="screen.label" class="p-4">        
          <form-generator 
                          :schema="screen.schema" 
                          v-model="screenData[screen.name]" 
                          :name="screen.name">
          </form-generator>        
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import FormGenerator from '../components/dynamicFormComponents/FormGenerator'
import { mapState } from 'vuex'
import UserAccessPage from './UserAccessPage'

export default {
  name: 'VisitsPage',
  components: { FormGenerator, UserAccessPage },
  computed: {
    ...mapState(['mainUiLayout', 'setReferenceId', 'screenData'])
  },
  methods: {
    tabShown(tIndex) {           
      this.$store.dispatch('fetchDataFromLocation', { 
        location: this.mainUiLayout.screens[tIndex].dataLocation,
        screenName: this.mainUiLayout.screens[tIndex].name
      })
    }
  },
  created() {
    Object.keys(this.$route.params).map((key) => {        
      this.$store.commit('setReferenceId', {ref: key, val: this.$route.params[key]})      
    });    
  }
}
</script>

<style scoped>
</style>
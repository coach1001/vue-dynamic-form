<template>
  <b-table
          @row-clicked="rowClick" 
          stacked="sm" 
          bordered head-variant="light" 
          hover 
          :items="patientSearchResults" 
          :fields="fields"></b-table>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SearchPage', 
  computed: {
    ...mapState(['patientSearchResults', 'practice'])
  },
  methods: {
    rowClick(item) {            
      this.$router.push(`/visits/${item.patientId}`)
    }
  },
  data() {
    return {
      fields: [ 'firstName', 'lastName', 'identityNumber', 'contactNumber' ]
    }    
  },
  watch: {
    practice() {
      if(this.patientSearchResults.length === 0) {
        this.$store.dispatch('fetchLastTenPatients');
      }            
    }
  },
  created() {
    if(this.patientSearchResults.length === 0) {    
      this.$store.dispatch('fetchLastTenPatients');
    }
  }
}
</script>

<style scoped>
</style>
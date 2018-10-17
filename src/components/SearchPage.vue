<template>
  <div>                  
    <b-btn variant="primary mb-3" @click.prevent="create">New Patient</b-btn>      
    <b-input-group class="mb-3">
      <b-input-group-prepend> 
        <b-btn variant="outline-primary" @click.prevent="search">Search</b-btn>
      </b-input-group-prepend>
      <b-form-input type="text"
                    label="Search"
                    v-model="searchTerm"                    
                    :placeholder="'I.D. Number, Contact Number, First Name, Last Name'">
      </b-form-input>   
    </b-input-group>    
    <b-table
            @row-clicked="rowClick" 
            stacked="sm" 
            bordered head-variant="light" 
            hover            
            :per-page="perPage"
            :current-page="currentPage" 
            :items="patientSearchResults" 
            :fields="fields">
    </b-table>  
    <b-pagination :total-rows="patientSearchResults.length" :per-page="perPage" v-model="currentPage" />
  </div>
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
      this.$store.commit('setPatientTests', [])
      this.$store.commit('setScreenData', { ref: 'personalDetails', val: item.personalDetails })                 
      this.$router.push(`/tests/${item.patientId}`)
    },
    async search() {
      await this.$store.dispatch('searchForPatienceInPractice', this.searchTerm)
    },
    async create() {
      this.$store.commit('setScreenData', { ref: 'personalDetails', val: {} })
      this.$router.push(`/tests/new`)
    }
  },
  data() {
    return {
      fields: [ 
        { key: 'personalDetails.patientDetails.firstName', label: 'First Name' }, 
        { key: 'personalDetails.patientDetails.lastName', label: 'Last Name' }, 
        { key: 'personalDetails.patientDetails.identityNumber', label: 'I.D. Number' },
        { key: 'personalDetails.patientDetails.contactNumber', label: 'Contact Number'} 
      ],
      currentPage: 1,
      perPage: 10,
      searchTerm: null
    }    
  },
  watch: {
    practice() {
      if(this.patientSearchResults.length === 0) {
        this.$store.dispatch('fetchPracticePatients');
      }            
    }
  },
  created() {    
    this.$store.dispatch('fetchPracticePatients');
  }
}
</script>

<style scoped>
.input-group > .input-group-prepend > .btn {
  width: 100px;
}
</style>
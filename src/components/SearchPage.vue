<template>
  <div>            
    <!-- <b-input-group class="mb-2">
      <b-input-group-prepend>
        <b-btn variant="outline-primary" @click.prevent="search">Search</b-btn>
      </b-input-group-prepend>
      <b-form-input type="text"
                    label="Search"
                    v-model="searchTerm"                    
                    :placeholder="'I.D. Number, Contact Number, First Name, Last Name'">
      </b-form-input>   
    </b-input-group>     -->
    <b-form-group class="mb-3" label="Filter Patients">
      <b-form-input type="text"
                    label="Search"
                    v-model="filterTerm">
      </b-form-input>   
    </b-form-group>    

    <b-table
            @row-clicked="rowClick" 
            stacked="sm" 
            bordered head-variant="light" 
            hover
            :filter="filterTerm"
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
      this.$router.push(`/visits/${item.patientId}`)
    },
    async search() {
      await this.$store.dispatch('searchForPatienceInPractice', this.searchTerm)
    }
  },
  data() {
    return {
      fields: [ 'firstName', 'lastName', 'identityNumber', 'contactNumber' ],
      currentPage: 1,
      perPage: 10,
      searchTerm: null,
      filterTerm: null
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
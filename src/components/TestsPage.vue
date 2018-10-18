<template>
  <div v-if="!$objectUtils.isEmpty(mainUiLayout)">
    <b-row v-if="referenceIds.patientId !== 'new'">         
      <b-col class="col-md-4">
        <b-form-group label="Select Previous Test">     
          <v-select 
                    label="dateOfTest" 
                    v-model="selectedTest"                   
                    :options="patientTestsResults"
                    :on-change="(selected) => testSelected(selected)">
          </v-select>
        </b-form-group>        
      </b-col>         
      <b-col class="new-test-button mb-3">        
        <b-btn variant="primary" @click.prevent="openNewTestDateModal" class="icon-button-before">
          <span class="h-icon icon-icon-105-folder-add"></span>
          <span style="font-family: 'Poppins', sans-serif;">New Test</span>
        </b-btn> 
      </b-col>
    </b-row>
    <div class="mb-3">
      <b-card no-body>
        <b-tabs card @input="tabShown">
          <b-tab 
                  v-for="(screen, sIndex) in mainUiLayout.screens" 
                  v-if="$fieldUtils.checkForRequiredIds(screen.requiredIds, referenceIds)"
                  :key="sIndex" 
                  :title="screen.label" class="p-4">        
            <form-generator 
                            :dataLocation="screen.dataLocation"
                            :schema="screen.schema" 
                            :value="screenData[screen.name]"
                            :name="screen.name">
            </form-generator>        
          </b-tab>
        </b-tabs>
      </b-card>
    </div>  
  <b-modal 
          ref="newTestDateModal" 
          :centered="true" 
          title="New Test" 
          @ok="createTest"
          :ok-disabled="!newTestDate">
    <b-form-group label="Select new test date">
      <datepicker                      
                  format="yyyy-MM-dd"
                  v-mask="'####-##-##'" 
                  :bootstrap-styling="true" 
                  :typeable="true"                                    
                  v-model="newTestDate"                  
                  placeholder="eg. 1999-01-01">      
      </datepicker>
    </b-form-group>
  </b-modal>
  </div>
</template>

<script>
import FormGenerator from '../components/dynamicFormComponents/FormGenerator'
import { mapState } from 'vuex'
import UserAccessPage from './UserAccessPage'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'TestsPage',  
  components: { FormGenerator, UserAccessPage, Datepicker },
  computed: {
    ...mapState(['mainUiLayout', 'setReferenceId', 'screenData', 'referenceIds', 'patientTestsResults'])
  },  
  data() {
    return {
      showNewTestModal: false,
      newTestDate: null,
      firstLoad: true,
      selectedTest: null,
      currentIndex: null      
    }
  },
  methods: {
    async testSelected(selected) {
      const testId = selected ? selected.testId : null
      this.$store.commit('setReferenceId', { ref: 'testId', val: testId })      
      await this.$store.dispatch('fetchTestData')                
    },
    async tabShown(tIndex) {          
      this.currentIndex = tIndex
      if(this.firstLoad) { 
        if( this.$objectUtils.isEmpty(this.screenData.personalDetails) 
            && this.referenceIds.patientId !== 'new') {                          
            await this.$store.dispatch('fetchDataFromLocation', { 
              location: this.mainUiLayout.screens[tIndex].dataLocation, 
              screenName: this.mainUiLayout.screens[tIndex].name
            }
          )
        }                           
        this.$store.commit('copyCurrentScreenData', this.mainUiLayout.screens[tIndex].name)        
        await this.$store.dispatch('fetchPatientTests')        
        this.selectedTest = this.patientTestsResults[0]
        this.firstLoad = false
      }             
      this.$store.commit('copyCurrentScreenData', this.mainUiLayout.screens[tIndex].name)       
    },
    checkForIds(requiredIds) {
      const requiredIdcount = requiredIds.length
      let count = 0
      requiredIds.forEach((rId) => {
        if(this.referenceIds[rId]) {
          count += 1
        }
      })
      if(requiredIdcount === count) {
        return true
      } else {
        return false
      }      
    },
    async createTest() {  
      await this.$store.dispatch('createPatientTest', this.newTestDate)
      this.selectedTest = this.patientTestsResults[this.patientTestsResults.length - 1]
    },
    openNewTestDateModal() {
      this.newTestDate = null      
      this.$refs.newTestDateModal.show()
    }
  },  
  async created() {
    this.$store.commit('setReferenceId', { ref: 'testId', val: null }) 
    let keyVal = null
      Object.keys(this.$route.params).map((key) => {           
      keyVal = this.$route.params[key]
      this.$store.commit('setReferenceId', {ref: key, val: keyVal})
    });
  }
}
</script>

<style scoped>
.new-test-button {
  align-self: flex-end;
}
</style>
<template>
  <div v-if="!$objectUtils.isEmpty(mainUiLayout)">
    <b-row>         
      <b-col class="col-md-4">
        <b-form-group label="Select Previous Test">     
          <!-- <v-select :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                  :value="value"
                  :options="options"              
                  :on-change="(selected) => updateOnInput(selected)">
          </v-select>          -->
          <v-select></v-select>
        </b-form-group>        
      </b-col>         
      <b-col class="new-test-button mb-3">
        <b-button variant="primary" v-b-modal="'newTestDateModal'">New Test</b-button>              
      </b-col>
    </b-row>
    <div class="mb-3">
      <b-card no-body>
        <b-tabs card @input="tabShown">
          <b-tab 
                  v-for="(screen, sIndex) in mainUiLayout.screens" 
                  v-if="checkForIds(screen.requiredIds)"
                  :key="sIndex" 
                  :title="screen.label" class="p-4">        
            <form-generator 
                            :dataLocation="screen.dataLocation"
                            :schema="screen.schema" 
                            v-model="screenData[screen.name]" 
                            :name="screen.name">
            </form-generator>        
          </b-tab>
        </b-tabs>
      </b-card>
    </div>  
  <b-modal 
          id="newTestDateModal" 
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
                  placeholder="eg. 2018-12-12">      
      </datepicker>
    </b-form-group>
  </b-modal>
  </div>
</template>

<script>
import FormGenerator from '../components/dynamicFormComponents/FormGenerator'
import { mapState } from 'vuex'
import UserAccessPage from './UserAccessPage'
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'TestsPage',
  components: { FormGenerator, UserAccessPage, Datepicker },
  computed: {
    ...mapState(['mainUiLayout', 'setReferenceId', 'screenData', 'referenceIds'])
  },  
  data() {
    return {
      showNewTestModal: false,
      newTestDate: null
    }
  },
  methods: {
    async tabShown(tIndex) {           
      await this.$store.dispatch('fetchDataFromLocation', { 
        location: this.mainUiLayout.screens[tIndex].dataLocation,
        screenName: this.mainUiLayout.screens[tIndex].name
      })      
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
    createTest() {
      console.log(this.newTestDate)
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
.new-test-button {
  align-self: flex-end;
}
</style>
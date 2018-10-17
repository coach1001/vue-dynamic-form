<template>
  <div>        
    <b-row class="ml-01 mb-3">      
      <b-button variant="outline-primary" @click="save">Save</b-button>
      <b-button variant="outline-info ml-2" @click="reset">Reset</b-button>      
    </b-row>        
    <b-row align-h="center">  
      <b-col>                          
        <b-form @submit.prevent="onSubmit"> 
          <b-row>             
            <component v-for="(field, index) in schema"                
                      :name="field.name"
                      :key="index"
                      :is="field.fieldType"
                      :value="formData[field.name]"
                      @input="updateForm(field.name, $event)"
                      :refData="formData"                      
                      v-bind="field"
                      :mask="field.fieldMask"                      
                      :class="$fieldUtils.getInputClass(field.fieldType, field.fullWidth)">
            </component>
          </b-row>           
        </b-form>
      </b-col>  
    </b-row>
  </div>
</template>

<script>
import NumberInput from './NumberInput'
import SelectList from './SelectList'
import TextInput from './TextInput'
import TextAreaInput from './TextAreaInput'
import ArrayInput from './ArrayInput'
import ObjectInput from './ObjectInput'
import DatePickerInput from './DatePickerInput'
import BooleanYesNoInput from './BooleanYesNoInput'
import ModalInput from './ModalInput'
// import isEqual from 'lodash-es/isEqual'

export default {
  name: 'FormGenerator',
  components: { NumberInput, SelectList, TextInput, ArrayInput, ObjectInput, DatePickerInput, BooleanYesNoInput, ModalInput, TextAreaInput },
  props: ['schema', 'value', 'name', 'dataLocation'],  
  data() {
    return {
      formData: this.value || {}
    }
  },
  watch: {
    value(newValue) {
      this.formData = newValue || {}
    }
  },
  methods: {
    updateForm(fieldName, value) {      
      this.$set(this.formData, fieldName, value)           
    },
    reset() {
      this.$store.commit('resetCurrentScreenData', this.name)                         
    },
    async save() {            
      this.formData = this.$fieldUtils.removeEmpty(this.formData)            
      this.$store.commit('setScreenData', { ref: this.name, val: this.formData })
      await this.$store.dispatch('updateCreateDataInLocation', {
        location: this.dataLocation,
        screenName: this.name        
      })
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)" class="mt-2 mb-2">    
    <b-card border-variant="info" :header="label">  
      <b-row>
        <component v-for="(field, index) in schema"
                  :key="index"
                  :is="field.fieldType"
                  :value="formData[field.name]"
                  :refData="formData"
                  @input="updateForm(field.name, $event)"
                  v-bind="field"
                  :mask="field.fieldMask"                  
                  :class="$fieldUtils.getInputClass(field.fieldType, field.fullWidth)">
        </component>        
      </b-row>
    </b-card>    
  </div>
</template>

<script>
import NumberInput from './NumberInput'
import SelectList from './SelectList'
import TextInput from './TextInput'
import TextAreaInput from './TextAreaInput'
import DatePickerInput from './DatePickerInput'
import BooleanYesNoInput from './BooleanYesNoInput'

export default {
  name: 'ObjectInput',
  components: { 
    ModalInput: () => import('./ModalInput'),  
    ArrayInput: () => import('./ArrayInput'),
    ObjectInput: () => import('./ObjectInput'),
    NumberInput, SelectList, TextInput, DatePickerInput, BooleanYesNoInput, TextAreaInput },
  props: [
    'schema', 'label', 'name', 'value','refData', 
    'visibleWhen', 'visibleWhenValue', 
    'clearWhen', 'clearWhenValue'        
  ],
  data() {
    return {
      formData: this.value || {},
      dataCleared: false
    }
  },
  watch: {
    refData:{ 
      handler() {
        if(this.$fieldUtils.canClear(this.refData, this.clearWhen, this.clearWhenValue) && !this.$objecUtils.isEmpty(this.formData)) {
          this.formData = {}
          this.$emit('input', this.formData)
        }
      },
      deep: true
    },
    value:{ 
      handler(newValue, oldValue) {
        if(newValue === undefined) {
          this.formData = {}
          this.$emit('input', this.formData)          
        } else if(newValue !== oldValue) {
          this.formData = newValue
          this.$emit('input', this.formData)
        }
      },
      deep: true
    }    
  },
  methods: {
    updateForm(fieldName, value) {
      this.$set(this.formData, fieldName, value)
      this.$emit('input', this.formData)      
    }
  }  
}
</script>

<style scoped>
</style>
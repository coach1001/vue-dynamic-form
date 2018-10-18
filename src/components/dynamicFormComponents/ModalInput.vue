<template>
  <b-modal :id="name" :size="size" centered>
    <div slot="modal-header" class="w-100" >      
        <b-row>
          <b-col cols="12" md="auto"><strong>{{label}}</strong></b-col>                    
        </b-row>
        <b-row v-if="subTitle">
          <b-col cols="12" md="auto">{{subTitle}}</b-col>
        </b-row>      
    </div>
    <b-row>
      <component v-for="(field, index) in schema" 
                :name="`${$fieldUtils.parentName(parentName)}${field.name}`"                
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
  </b-modal>
</template>

<script>
import NumberInput from './NumberInput'
import SelectList from './SelectList'
import TextInput from './TextInput'
import TextAreaInput from './TextAreaInput'
import DatePickerInput from './DatePickerInput'
import BooleanYesNoInput from './BooleanYesNoInput'

export default {
  name: 'ModalInput',
  inject: ['$validator'],
  components: { 
    ModalInput: () => import('./ModalInput'),  
    ArrayInput: () => import('./ArrayInput'),
    ObjectInput: () => import('./ObjectInput'),
    NumberInput, SelectList, TextInput, DatePickerInput, BooleanYesNoInput, TextAreaInput },
  props: [
    'schema', 'label', 'name', 'value', 'refData', 'size', 'subTitle', 'parentName',
    'clearWhen','clearWhenValue'
  ],
  data() {
    return {
      formData: this.value || {}
    }
  },
  watch: {
    value(newValue) {
      this.formData = newValue || {}
    },
    refData: {
      handler() {
        if (this.$fieldUtils.canClear(this.refData,this.clearWhen,this.clearWhenValue) && !this.$objectUtils.isEmpty(this.formData)) {
          this.formData = {}
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
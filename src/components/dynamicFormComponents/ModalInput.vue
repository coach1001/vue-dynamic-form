<template>
  <b-modal :id="name" :size="size" :title="label" centered>
    <b-row>
      <component v-for="(field, index) in schema"                
                :name="field.name"
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
  components: { 
    ModalInput: () => import('./ModalInput'),  
    ArrayInput: () => import('./ArrayInput'),
    ObjectInput: () => import('./ObjectInput'),
    NumberInput, SelectList, TextInput, DatePickerInput, BooleanYesNoInput, TextAreaInput },
  props: [
    'schema', 'label', 'name', 'value', 'refData', 'size',
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
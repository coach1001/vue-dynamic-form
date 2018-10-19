<template>
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">  
    <b-form-group :label="label"
                  :invalid-feedback="errors.first(`${$fieldUtils.parentName(parentName)}${name}`)"
                  :state="$fieldUtils.checkErrors(`${$fieldUtils.parentName(parentName)}${name}`, errors, $veeFields)">
      <datepicker
                  :data-vv-as="label"
                  :state="$fieldUtils.checkErrors(`${$fieldUtils.parentName(parentName)}${name}`, errors, $veeFields)"      
                  format="yyyy-MM-dd"
                  :bootstrap-styling="true" 
                  :typeable="true"
                  :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                  :name="`${$fieldUtils.parentName(parentName)}${name}`"
                  :value="value || defaultValue"
                  @input="(val) => $emit('input', val ? val.toISOString().substr(0,10) : null)"
                  :placeholder="placeholder"
                  v-validate="validation">
      </datepicker>
    </b-form-group>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'DatePickerInput',
  inject: ['$validator'],  
  props: [
    'placeholder', 'label', 'name', 'value', 'refData', 'defaultValue', 'validation', 'parentName',
    'visibleWhen', 'visibleWhenValue', 
    'clearWhen', 'clearWhenValue',      
    'enabledWhen', 'enabledWhenValue'      
  ],
  components: { Datepicker },
  watch: {
    refData:{ 
      handler() {
      if(this.$fieldUtils.canClear(this.refData, this.clearWhen, this.clearWhenValue)  && this.value !== undefined) {
          this.$emit('input', undefined);
        }
      },
      deep: true
    }
  }
}
</script>

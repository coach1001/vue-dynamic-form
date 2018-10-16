<template>
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">  
    <b-form-group :label="label">
      <datepicker
                  format="yyyy-MM-dd"
                  v-mask="'####-##-##'" 
                  :bootstrap-styling="true" 
                  :typeable="true"
                  :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                  :name="name"
                  :value="value || defaultValue"
                  @input="(val) => $emit('input',val.toISOString().substr(0,10))"
                  :placeholder="placeholder">
      </datepicker>
    </b-form-group>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'DatePickerInput',
  props: [
    'placeholder', 'label', 'name', 'value', 'refData', 'defaultValue',
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

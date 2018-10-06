<template>
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">  
    <b-form-group :label="label">
      <datepicker :bootstrap-styling="true" :typeable="true"
            :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
            :name="name"
            v-model="dataValue"
            @input="updateOnInput(dataValue)"
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
  data() {
    return {
      dataValue: null
    }
  },
  methods: {
    updateOnInput(changeValue) {
      this.dataValue = changeValue;
      this.$emit('input', this.dataValue);
    }
  },
  watch: {
    refData:{ 
      handler() {
      if(this.$fieldUtils.canClear(this.refData, this.clearWhen, this.clearWhenValue)) {
          this.dataValue = null
          this.$emit('input', null);
        }
      },
      deep: true
    },
    value:{ 
      handler(newValue, oldValue) {
        if(newValue === undefined) {
          this.dataValue = null
          this.$emit('input', this.dataValue)
        } else if(newValue !== oldValue) {
          this.dataValue = newValue
          this.$emit('input', this.dataValue)
        }
      },
      deep: true
    }    
  },
  created () {          
    this.dataValue = this.$fieldUtils.checkDefaultValue(this.defaultValue, this.value);
    if(this.dataValue) {
      this.$emit('input', this.dataValue);
    }
  }
}
</script>

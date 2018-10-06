<template>
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">
    <b-form-group :label="label">     
      <v-select :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
              :value="value"
              :options="options"              
              :on-change="(selected) => updateOnInput(selected)">
      </v-select>         
    </b-form-group>    
  </div>
</template>
<script>
export default {
  name: 'SelectList',
  props: [
    'multi', 'options', 'label', 'name', 'value', 'refData', 'defaultValue',
    'visibleWhen', 'visibleWhenValue', 
    'clearWhen', 'clearWhenValue',      
    'enabledWhen', 'enabledWhenValue'
  ],
  methods: {
    updateOnInput(value) {  
      this.dataValue = value
      this.$emit('input', this.dataValue)
    }
  },
  data() {
    return {
      dataValue: null
    }
  },  
  watch: {
    refData:{
      handler() {
        if(this.$fieldUtils.canClear(this.refData, this.clearWhen, this.clearWhenValue)) {
          this.dataValue = null
          this.$emit('input', null)
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
  created() {
    this.dataValue = this.$fieldUtils.checkDefaultValue(this.defaultValue, this.value)
    if(this.dataValue) {
      this.$emit('input', this.dataValue)
    }
  }
}
</script>
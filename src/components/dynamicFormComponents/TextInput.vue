<template>  
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">        
    <b-form-group :label="label">
      <b-form-input type="text"
                    :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                    :name="name"
                    :value="value"                    
                    @input="(value) => updateOnInput(value)"
                    v-mask="mask || ''"
                    :placeholder="placeholder">
      </b-form-input>
    </b-form-group>    
  </div>  
</template>

<script>
export default {
  name: 'TextInput',
  props: [
    'placeholder', 'label', 'name', 'value', 'refData', 'defaultValue', 'mask',
    'visibleWhen', 'visibleWhenValue', 
    'clearWhen', 'clearWhenValue',      
    'enabledWhen', 'enabledWhenValue'    
  ],
  data() {
    return {
      dataValue: null
    }
  },
  methods: {
    updateOnInput(changeValue) {
      this.dataValue = changeValue
      this.$emit('input', this.dataValue)
    }
  },
  watch: {
    refData:{ 
      handler() {        
        if(this.$fieldUtils.canClear(this.refData, this.clearWhen, this.clearWhenValue)) {          
          this.dataValue = undefined
          this.$emit('input', undefined)
        }
      },
      deep: true
    },
    value:{ 
      handler(newValue, oldValue) {
          if(newValue === undefined) {
            this.dataValue = null
            this.$emit('input', this.dataValue)
          if(newValue !== oldValue) {
            this.dataValue = newValue
            this.$emit('input', this.dataValue)
          }
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

<style scoped>
</style>

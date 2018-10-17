<template>  
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">        
    <b-form-group :label="label">
      <b-form-input type="text"
                    :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                    :name="name"
                    :value="value || defaultValue"                    
                    @change="(val) => $emit('input',val)"
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
  watch: {
    refData:{ 
      handler() {        
        if(this.$fieldUtils.canClear(this.refData, this.clearWhen, this.clearWhenValue) && this.value !== undefined) {                    
          this.$emit('input', undefined)
        }
      },
      deep: true
    }         
  }
}
</script>

<style scoped>
</style>

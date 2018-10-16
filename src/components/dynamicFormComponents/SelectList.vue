<template>
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">
    <b-form-group :label="label">     
      <v-select :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
              :value="value || defaultValue"
              :options="options"              
              :on-change="(val) => $emit('input',val)">
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

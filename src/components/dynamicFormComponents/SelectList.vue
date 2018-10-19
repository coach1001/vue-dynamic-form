<template>
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">
    <b-form-group :label="label"     
                  :invalid-feedback="errors.first(`${$fieldUtils.parentName(parentName)}${name}`)"
                  :state="$fieldUtils.checkErrors(`${$fieldUtils.parentName(parentName)}${name}`, errors, $veeFields)">      
      <v-select 
                :data-vv-as="label"                    
                v-model="value"                
                :name="`${$fieldUtils.parentName(parentName)}${name}`"
                :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                :value="value || defaultValue"
                :options="options"              
                :on-change="(val) => {$emit('input',val)}"
                v-validate="validation">
      </v-select>         
    </b-form-group>    
  </div>
</template>

<script>
export default {
  name: 'SelectList',
  inject: ['$validator'],
  props: [
    'multi', 'options', 'label', 'name', 'value', 'refData', 'defaultValue', 'parentName', 'validation',
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
.select.dropdown .dropdown-toggle {
    border: 1px solid red;
    height: 38px;
}
</style>

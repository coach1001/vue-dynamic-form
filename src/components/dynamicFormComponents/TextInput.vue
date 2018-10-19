<template>  
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">        
    <b-form-group :label="label"
                  :invalid-feedback="errors.first(`${$fieldUtils.parentName(parentName)}${name}`)"
                  :state="$fieldUtils.checkErrors(`${$fieldUtils.parentName(parentName)}${name}`, errors, $veeFields)">
      <b-form-input type="text"
                    :data-vv-as="label"                    
                    :state="$fieldUtils.checkErrors(`${$fieldUtils.parentName(parentName)}${name}`, errors, $veeFields)"
                    :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                    :name="`${$fieldUtils.parentName(parentName)}${name}`"
                    :value="value || defaultValue"                                  
                    @change="(val) => $emit('input', val)"  
                    @blur.native="$validator.validate(`${$fieldUtils.parentName(parentName)}${name}`)"                                     
                    :placeholder="placeholder"
                    v-validate="validation">
      </b-form-input>
    </b-form-group> 
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  inject: ['$validator'],
  props: [
    'placeholder', 'label', 'name', 'value', 'refData', 'defaultValue', 'mask', 'validation', 'parentName', 
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

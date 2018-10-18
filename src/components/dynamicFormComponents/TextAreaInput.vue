<template>  
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">    
    <b-form-group :label="label">
      <b-form-textarea 
                      :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                      :name="name"
                      :value="value || defaultValue"
                      @input="(val) => $emit('input',val)"
                      :placeholder="placeholder"                      
                      :rows="5"                      
                      :max-rows="6"
                      v-validate="'required'">
      </b-form-textarea>    
    </b-form-group>
  </div>  
</template>

<script>
export default {
  name: 'TextAreaInput',
  inject: ['$validator'],
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

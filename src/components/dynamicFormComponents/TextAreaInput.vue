<template>  
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">    
    <b-form-group :label="label">
      <b-form-textarea 
                      :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                      :name="name"
                      :value="value"
                      @input="(value) => updateOnInput(value)"
                      :placeholder="placeholder"
                      v-mask="mask || ''"                      
                      :rows="5"
                      :max-rows="6">
      </b-form-textarea>    
    </b-form-group>
  </div>  
</template>

<script>
export default {
  name: 'TextAreaInput',
  props: [
    'placeholder', 'label', 'name', 'value', 'refData', 'defaultValue', 'mask',
    'visibleWhen', 'visibleWhenValue', 
    'clearWhen', 'clearWhenValue',      
    'enabledWhen', 'enabledWhenValue'    
  ],
  methods: {
    updateOnInput(changeValue) {
      this.dataValue = changeValue
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

<style scoped>
</style>

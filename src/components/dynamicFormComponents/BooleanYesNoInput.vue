<template>  
  <div v-if="$fieldUtils.isVisible(refData, visibleWhen, visibleWhenValue)">    
    <b-form-group :label="label">      
      <b-button-group>
        <b-button :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                  :variant="valueClass('YES')"
                  @click="setTrue()">Yes</b-button>
        <b-button :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                  :variant="valueClass('NO')"
                  @click="setFalse()">No</b-button>          
        <b-button :disabled="$fieldUtils.isEnabled(refData, enabledWhen, enabledWhenValue)"
                  variant="secondary"
                  v-if="value && openModal !== undefined" @click="checkOpenModal()"                      
                  >Details</b-button>
        <input 
              hidden :value="value"
              :name="`${$fieldUtils.parentName(parentName)}${name}`"
              v-validate="'required'"/>
      </b-button-group>              
    </b-form-group>
  </div>  
</template>

<script>
export default {
  name: 'BooleanYesNoInput', 
  inject: ['$validator'],   
  props: [
    'label', 'name', 'value', 'refData', 'openModal', 'defaultValue', 'parentName',
    'visibleWhen', 'visibleWhenValue', 
    'clearWhen', 'clearWhenValue',      
    'enabledWhen', 'enabledWhenValue'      
  ],
  watch: {
    value(newValue, oldValue) {
      if(newValue !== oldValue) {        
        if(newValue === undefined) {
          this.$emit('input', this.defaultValue === 'true' ? true : false)
        }
      }
    }, 
    refData:{ 
      handler() {
        if(this.$fieldUtils.canClear(this.refData, this.clearWhen, this.clearWhenValue) && this.value !== undefined) {                    
          this.$emit('input', undefined)
        }
      },
      deep: true
    }
  },
  methods: {
    valueClass(button) {
      if(this.value === undefined) {
        return 'outline-primary'
      } else if (button === 'YES' && this.value === true) {
        return 'primary'
      } else if (button === 'NO' && this.value === false) {
        return 'primary'        
      } else {
        return 'outline-primary'
      }
    },
    setTrue() {      
      this.$emit('input', true)
      this.checkOpenModal()
    },
    setFalse() {      
      this.$emit('input', false)
    },
    checkOpenModal() {
      if(this.openModal !== undefined) {
        this.$root.$emit('bv::show::modal', this.openModal)
      }
    }
  },
  created() {    
    if(this.value === undefined) {
      this.$emit('input', this.defaultValue === 'true' ? true : false)
    }
  }
}
</script>

<style scoped>
</style>

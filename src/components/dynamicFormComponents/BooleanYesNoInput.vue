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
                  v-if="dataValue && openModal !== undefined" @click="checkOpenModal()"                      
                  >Edit</b-button>
      </b-button-group>              
    </b-form-group>
  </div>  
</template>

<script>
export default {
  name: 'BooleanYesNoInput',
  props: [
    'label', 'name', 'value', 'refData', 'openModal', 'defaultValue',
    'visibleWhen', 'visibleWhenValue', 
    'clearWhen', 'clearWhenValue',      
    'enabledWhen', 'enabledWhenValue'      
  ],
  data() {
    return {
      dataValue: null,
      addTopMarginToEdit: false
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
        } else if(newValue !== oldValue) {
          this.dataValue = newValue
          this.$emit('input', this.dataValue)
        }
      },
      deep: true
    }
  },
  methods: {
    valueClass(button) {
      if(this.dataValue === null) {
        return 'outline-primary'
      } else if (button === 'YES' && this.dataValue === true) {
        return 'primary'
      } else if (button === 'NO' && this.dataValue === false) {
        return 'primary'        
      } else {
        return 'outline-primary'
      }
    },
    setTrue() {
      this.dataValue = true
      this.$emit('input', this.dataValue)
      this.checkOpenModal()
    },
    setFalse() {
      this.dataValue = false
      this.$emit('input', this.dataValue)
    },
    checkOpenModal() {
      if(this.openModal !== undefined) {
        this.$root.$emit('bv::show::modal', this.openModal)
      }
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

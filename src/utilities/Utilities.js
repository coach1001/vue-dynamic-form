const fieldUtils = {
  getInputClass(fieldType, full) {
    if(full === true) {
      return 'col-12'
    } else if(fieldType === 'ArrayInput' || fieldType === 'ObjectInput') {
      return 'col-12'
    } else {
      return 'col-12 col-sm-12	col-md-6 col-lg-6 col-xl-6'
    }
  },
  checkErrors(field, errors, $veeFields) { 
    if($veeFields[field] !== undefined) {
      if($veeFields[field].dirty) {
        return !errors.has(field)
      } else {
        return null
      }
    }
    return null
  },
  markAllFiedsAsDirty($veeFields) {
    if(!objectUtils.isEmpty($veeFields)) {
      for(var key in $veeFields) {
        $veeFields[key].dirty = true
      }  
    }
  },
  isVisible(data, property, value) {
    if (property) {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          if (data[property] === value[i]) {
            return true
          }
        }
      } else {
        if (data[property]) {
          return true
        }
      }
      return false
    }
    return true
  },
  isEnabled(data, property, value) {
    if (property) {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          if (data[property] === value[i]) {
            return false
          }
        }
      } else {
        if (data[property]) {
          return false
        }
      }
      return true
    }
    return false
  },
  canClear(data, property, value) {
    if (property) {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          if (data[property] === value[i]) {
            return false
          }
        }
      } else {
        if (data[property]) {
          return false
        }
      }
      return true
    }
    return false
  },
  addBottomMargin(currField, nextField) {
    if (nextField === undefined) {
      return false
    } else {
      if (
        (currField.fieldType === 'ArrayInput' ||
          currField.fieldType === 'ObjectInput') &&
        (nextField.fieldType !== 'ArrayInput' &&
          nextField.fieldType !== 'ObjectInput')
      ) {
        return true
      } else {
        return false
      }
    }
  },
  checkDefaultValue(defaultValue, formValue) {
    if (formValue !== undefined) {
      return formValue
    } else if (defaultValue !== undefined) {
      return defaultValue
    }
    return null
  }
}

const objectUtils = {
  isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false
      }
    return true
  }
}

module.exports = { fieldUtils, objectUtils }

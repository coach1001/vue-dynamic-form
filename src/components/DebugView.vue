<template>  
  <div class="mb-3">
    <b-card no-body>
      <b-tabs card @input="tabShown">
        <b-tab                                 
                v-for="(screen, sIndex) in screens"                 
                :key="sIndex" 
                :title="screen.label" class="p-4">        
          <form-generator                           
                          v-if="currentIndex === sIndex"
                          :schema="screen.schema" 
                          @input="setFormData"
                          :value="screenData[currentIndex]"
                          :name="screen.name">
          </form-generator>        
        </b-tab>
      </b-tabs>
    </b-card>
  </div>  
  
</template>

<script>
import FormGenerator from '../components/dynamicFormComponents/FormGenerator'

export default {
  name: 'DebugView',
  inject: ['$validator'],  
  components: { FormGenerator },
  methods: {
    tabShown(val) {
      this.currentIndex = val
    },
    setFormData(val) {      
      this.screenData[this.currentIndex] = val
    },
  },
  data() {
    return {
      currentIndex: 0,
      screens: [
        {
          label: 'Screen 1',
          name: 'screen1',
          schema: [
            {
              fieldType: 'TextInput',
              label: 'Test Text Input 1',
              name: 'testTextInput1',
              validation: 'required'                
            },
            {
              fieldType: 'BooleanYesNoInput',
              name: 'modalOpener',
              label: 'Modal Opener',
              openModal: 'testModal',
              fullWidth: true
            },
            {
              fieldType: 'ModalInput',
              name: 'testModal',
              label: 'Test Modal',
              schema: [
                {
                  fieldType: 'TextInput',
                  label: 'Modal Text Input',
                  name: 'modalTextInput',
                  validation: 'required',
                  fullWidth: true             
                }
              ]
            },
            {
              fieldType: 'BooleanYesNoInput',
              name: 'kids',
              label: 'Kids',
              openModal: 'kidsModal',
              fullWidth: true
            },
            {
              fieldType: 'ModalInput',
              name: 'kidsModal',
              label: 'Kids Modal',
              size: 'lg',
              schema: [
                {
                  fieldType: 'ArrayInput',
                  label: 'Kids',
                  name: 'kidsList',
                  schema: [
                    {
                      fieldType: 'TextInput',
                      name: 'firstName',
                      label: 'First Name',
                      validation: 'required'
                    },
                    {
                      fieldType: 'TextInput',
                      name: 'lastName',
                      label: 'Last Name',
                      validation: 'required'
                    }
                  ]           
                }
              ]
            }
          ],
        },
        {
          label: 'Screen 2',
          name: 'screen2',
          schema: [
              {
                fieldType: 'TextInput',
                label: 'Test Text Input 2',
                name: 'testTextInput2',
                validation: 'required'                
              }
          ]
        },
        {
          label: 'Screen 3',
          name: 'screen3',
          schema: [
              {
                fieldType: 'TextInput',
                label: 'Test Text Input 3',
                name: 'testTextInput3',
                validation: 'required'                
              }
          ]
        }
      ],
      screenData: []
    }
  }
}
</script>
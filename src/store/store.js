import Vue from 'vue'
import Vuex from 'vuex'
import to from 'await-to-js'
import cloneDeep from 'lodash-es/cloneDeep';
const firebase = require('../firebase/firebaseConfig.js')
const format = require("string-template")
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    showLoader: false,
    backendError: {},
    mainUiLayout: {},    
    practice: {},
    referencesIds: {},
    patientSearchResults: [],
    screenData: {},
    currentScreenDataCopy: {}
  },
  getters: {
    getShowLoader: state => state.showLoader,
    getBackendError: state => state.backendError
  },
  actions: {    
    clearData({commit}) {
      commit('clearPracticeData')
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
    },
    async fetchUserProfile({ commit, state, dispatch }) {
      let err, qResults           
      [err, qResults] = await to(firebase.optometristsCollection.where('emailAddress', '==', state.currentUser.email).get())            
      if(err) {        
        commit('setBackendError', err)
        commit('setShowLoader', false)
      } else {                  
        qResults.forEach((doc) => {                                            
          commit('setReferenceId', {ref: 'practiceId', val: doc.data().practiceId })
          commit('setUserProfile', doc.data())
          dispatch('fetchPractice')
          commit('setShowLoader', false)          
        })        
      }
    },
    async fetchPractice({ commit, state, dispatch }) {
      let err, qResult
      [err, qResult] = await to(firebase.practicesCollection.doc(state.referencesIds.practiceId).get())      
      if(err) {        
        commit('setBackendError', err)
        commit('setShowLoader', false)
      } else {                                  
        commit('setReferenceId', {ref: 'uiMainLayoutId', val: qResult.data().mainUiLayoutId})        
        commit('setPractice', qResult.data())        
        await dispatch('fetchMainUiLayout')   
      }    
    },
    async fetchMainUiLayout({ commit, state }) {
      let err, qResult
      [err, qResult] = await to(firebase.uiLayoutCollection.doc(state.referencesIds.uiMainLayoutId).get())      
      if(err) {        
        commit('setBackendError', err)
        commit('setShowLoader', false)
      } else {           
        commit('setMainUiLayout', qResult.data())
        commit('setShowLoader', false)        
      }  
    },
    async fetchPracticePatients({ commit, state }) {
      if(state.referencesIds.practiceId) {
        commit('setShowLoader', true)
        let patientSearchResults = []
        let err, qResults      
        [err, qResults] = await to(
          firebase.patientsCollection.where('practiceId', '==', state.referencesIds.practiceId || '').get())      
        if(err) {
          commit('setBackendError', err)        
          commit('setShowLoader', false)
        } else {        
          qResults.forEach((doc) => {           
            patientSearchResults.push({patientId: doc.id, ...doc.data().personalDetails.patientDetails})
          })    
          commit('setPatientSearchResults', patientSearchResults)
          commit('setShowLoader', false)      
        }
      }
    },
    async fetchDataFromLocation({ commit, state }, info) {                  
      commit('setShowLoader', true)
      let tokens = [];
      let replaceTokenObject = {};
      info.location.replace(/\{(.*?)}/g, function(a, b) { tokens.push(b) })
      tokens.forEach((token) => {        
        replaceTokenObject[token] = state.referencesIds[token]          
      })            
      const docPath = format(info.location, replaceTokenObject)                        
      let err, qResult
      [err, qResult] = await to(firebase.db.doc(docPath).get())            
      if(err) {
        commit('setBackendError', err)        
        commit('setShowLoader', false)
      } else {   
        const data = qResult.data()        
        commit('setScreenData', {ref: info.screenName, val: data[info.screenName]})
        commit('setShowLoader', false)
      }            
    },
    async updateDataInLocation({ commit, state }, info) {
      commit('setShowLoader', true)      
      let updateObj = {}
      let tokens = [];
      let replaceTokenObject = {};
      info.location.replace(/\{(.*?)}/g, function(a, b) { tokens.push(b) })
      tokens.forEach((token) => {        
        replaceTokenObject[token] = state.referencesIds[token]          
      })            
      const docPath = format(info.location, replaceTokenObject)                        
      updateObj[info.screenName] = state.screenData[info.screenName]
      let err
      [err] = await to(firebase.db.doc(docPath).update(updateObj))      
      
      if(err) {
        commit('setBackendError', err)        
        commit('setShowLoader', false)
      } else {           
        commit('copyCurrentScreenData', info.screenName)
        commit('setShowLoader', false)        
      }            
    },
    async searchForPatienceInPractice({ state }, searchTerm) {
      console.log('referenceIds', state.referencesIds)
      console.log('search term', searchTerm)
    }     
  },
  mutations: {
    clearPracticeData(state) {
      state.backendError = {},
      state.mainUiLayout = {},
      state.practice = {},
      state.referencesIds = {},
      state.patientSearchResults = [],
      state.screenData = {},
      state.currentScreenDataCopy = {}
    },
    resetCurrentScreenData(state, val) {
      Vue.set(state.screenData, val, cloneDeep(state.currentScreenDataCopy))
    },
    copyCurrentScreenData(state, val) {
      state.currentScreenDataCopy = cloneDeep(state.screenData[val])      
    },
    setScreenData(state, val) {
      Vue.set(state.screenData, val.ref, val.val)         
    },
    setPatientSearchResults(state, val) {
      state.patientSearchResults = val
    },
    setReferenceId(state, val) {
      Vue.set(state.referencesIds, val.ref, val.val)
    },
    setMainUiLayout(state, val) {
      state.mainUiLayout = val
    },
    setPractice(state, val) {
      state.practice = val
    },
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setUserProfile(state, val) {
      state.userProfile = val            
    },
    setShowLoader(state, val) {
      state.showLoader = val
    },
    setBackendError(state, val) {
      console.log(val)
      state.backendError = val
    }
  }
})
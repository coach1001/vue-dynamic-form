import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
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
    referenceIds: {},
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
      [err, qResult] = await to(firebase.practicesCollection.doc(state.referenceIds.practiceId).get())      
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
      [err, qResult] = await to(firebase.uiLayoutCollection.doc(state.referenceIds.uiMainLayoutId).get())      
      if(err) {        
        commit('setBackendError', err)
        commit('setShowLoader', false)
      } else {           
        commit('setMainUiLayout', qResult.data())
        commit('setShowLoader', false)        
      }  
    },
    async fetchPracticePatients({ commit, state }) {
      if(state.referenceIds.practiceId) {
        commit('setShowLoader', true)
        let patientSearchResults = []
        let err, qResults      
        [err, qResults] = await to(
          firebase.patientsCollection.where('practiceId', '==', state.referenceIds.practiceId || '').limit(100).get())      
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
      let isNew  = {
        new: false,
        token: null
      }
      commit('setShowLoader', true)      
      let tokens = [];
      let replaceTokenObject = {};
      info.location.replace(/\{(.*?)}/g, function(a, b) { tokens.push(b) })
      tokens.forEach((token) => {        
        replaceTokenObject[token] = state.referenceIds[token]          
        if(replaceTokenObject[token] === 'new') {
          isNew.new = true
          isNew.token = token
        }
      })          
      
      const docPath = format(info.location, replaceTokenObject)          
      let err, qResult, data            
      if(!isNew.new) {        
        [err, qResult] = await to(firebase.db.doc(docPath).get())                    
        data = qResult.data() || {}
      }  else {
        data = {}
      } 
      if(err) {
        commit('setBackendError', err)        
        commit('setShowLoader', false)
      } else {                    
        commit('setScreenData', {ref: info.screenName, val: data[info.screenName]})
        commit('setShowLoader', false)
      }            
    },
    async updateCreateDataInLocation({ commit, state }, info) {
      let isNew  = {
        new: false,
        token: null
      }
      commit('setShowLoader', true)      
      let updateObj = {}
      let tokens = [];
      let replaceTokenObject = {};
      info.location.replace(/\{(.*?)}/g, function(a, b) { tokens.push(b) })
      tokens.forEach((token) => {        
        replaceTokenObject[token] = state.referenceIds[token]
        if(replaceTokenObject[token] === 'new') {
          isNew.new = true
          isNew.token = token
        }          
      })
      let docPath = format(info.location, replaceTokenObject)     
      updateObj[info.screenName] = state.screenData[info.screenName]
      let err, result      
      if(isNew.new)  {
        docPath = docPath.replace('/new', '')    
        updateObj.createdAt = new Date().toISOString()
        updateObj.createdBy = state.currentUser.email        
        const screenDef = state.mainUiLayout.screens.filter(obj => {
          return obj.name === info.screenName
        }) 
        const createWithIds = screenDef[0].createWithIds || []                
        createWithIds.forEach((id) => {
          updateObj[id] = state.referenceIds[id]
        });
        [err, result] = await to(firebase.db.collection(docPath).add(updateObj))
      } else {        
        updateObj.lastUpdated = new Date().toISOString()
        updateObj.updatedBy = state.currentUser.email;
        [ err ] = await to(firebase.db.doc(docPath).update(updateObj))
      }                             
      if(err) {
        commit('setBackendError', err)        
        commit('setShowLoader', false)
      } else {           
        if(isNew.new) {          
          commit('setReferenceId', {ref: isNew.token, val: result.id })                    
          commit('copyCurrentScreenData', info.screenName)          
          const screenDef = state.mainUiLayout.screens.filter(obj => {
            return obj.name === info.screenName
          }) 
          if(screenDef[0].reloadRouteOnCreate) {
            router.push(router.currentRoute.path.replace('new', result.id))
          }          
        }else {
          commit('copyCurrentScreenData', info.screenName)
        }
        commit('setShowLoader', false)
      }            
    },
    async searchForPatienceInPractice({ state }, searchTerm) {
      console.log('referenceIds', state.referenceIds)
      console.log('search term', searchTerm)
    },
    async fetchPatientTests({ commit }) {
      console.log('fetchTest', commit)
    }
  },
  mutations: {
    clearPracticeData(state) {
      state.backendError = {},
      state.mainUiLayout = {},
      state.practice = {},
      state.referenceIds = {},
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
      Vue.set(state.referenceIds, val.ref, val.val)
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
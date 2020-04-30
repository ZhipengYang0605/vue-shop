import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from './state'
import mutations from './mutations'
import mutationsType from './mutations-type'
import actions from './actions'

export default new Vuex.Store({
  state,
  mutations,
  actions
})

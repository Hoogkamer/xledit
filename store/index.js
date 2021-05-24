import Vuex from 'vuex'
import apiModule from './fetchapi'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      api: apiModule,
    },
  })
}

export default createStore

import { importExcel } from '@/assets/io_functions'
import Vue from 'vue'

const api = {
  namespaced: true,
  state: {
    types: ['term', 'property', 'group', 'label'],
    milestones: [],
    deliverables: [],
    milestoneSchema: [],
    deliverSchema: [],
    workbook: {},
    editMilestone: null,
  },
  actions: {
    getExcel: function ({ state, commit, dispatch, getters }) {
      importExcel(null).then((workbook) => {
        state.workbook = workbook
        let obj = {}
        workbook.miletypes.forEach((prop) => {
          obj[prop.name] = {
            ...prop,
          }
        })
        state.milestoneSchema = {
          type: 'object',
          properties: obj,
          filters: ['Planning Status'],
        }
        let obj1 = {}
        workbook.delivertypes.forEach((prop) => {
          obj1[prop.name] = {
            ...prop,
          }
        })
        state.deliverSchema = {
          type: 'object',
          properties: obj,
        }
        state.milestones = workbook.Milestones

        state.milestones.forEach((ms) => {
          console.log('[[[', ms)
          workbook.miletypes.forEach((mt) => {
            if (mt.format === 'date') {
              let dt = ms[mt.name].split('/')
              ms[mt.name] = dt[2] + '-' + dt[0] + '-' + dt[1]
            }
            ms.__id = guid()
          })
          Vue.set(
            ms,
            'cardInfo',
            getMilestoneCard(ms, state.workbook.miletypes)
          )
        })
        console.log(state.milestones)

        state.deliverables = workbook.Deliverables
      })
    },
    writeCollection() {},
  },
  mutations: {
    setMilestone: function (state, value) {
      let index = state.milestones.findIndex(
        (e) => e.__id === value.__id
      )
      console.log(index, value)

      Vue.set(state.milestones, index, {
        ...value,
        cardInfo: getMilestoneCard(value, state.workbook.miletypes),
      })
    },
    setEditMilestone: function (state, value) {
      state.editMilestone = value
      console.log(state.editMilestone)
    },
  },
}
function getMilestoneCard(ms, types) {
  let card = {}
  types.forEach((mt) => {
    if (mt['y-card'] === 'name') card.name = ms[mt.name]
    if (mt['y-card'] === 'description') card.description = ms[mt.name]
    if (mt['y-card'] === 'info') {
      if (card.infos)
        card.infos.push({ val: ms[mt.name], title: mt.name })
      else card.infos = [{ val: ms[mt.name], title: mt.name }]
    }
  })
  return card
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  )
}
export default api

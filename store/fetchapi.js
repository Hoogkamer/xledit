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
  },
  actions: {
    getExcel: function ({ state, commit, dispatch, getters }) {
      importExcel(null).then((workbook) => {
        let obj = {}
        workbook.miletypes.forEach((prop) => {
          obj[prop.name] = {
            ...prop,
          }
        })
        state.milestoneSchema = {
          type: 'object',
          properties: obj,
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
          workbook.miletypes.forEach((mt) => {
            if (mt.format === 'date') {
              let dt = ms[mt.name].split('/')
              ms[mt.name] = dt[2] + '-' + dt[0] + '-' + dt[1]

              console.log(ms[mt.name])
            }
          })
        })

        state.deliverables = workbook.Deliverables
      })
    },
    writeCollection() {},
  },
  mutations: {
    setMilestone: function (state, { index, value }) {
      console.log(value)
      Vue.set(state.milestones, index, value)
    },
  },
}
export default api

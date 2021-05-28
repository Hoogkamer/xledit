import { importExcel } from '@/assets/io_functions'
import Vue from 'vue'

const api = {
  namespaced: true,
  state: () => ({
    types: ['term', 'property', 'group', 'label'],
    workbook: {},
    editItem: null,
    sheets: [],
  }),
  getters: {
    getSheet: (state, getters) => (sheet) => {
      return state[sheet]
    },
  },
  actions: {
    getExcel: function ({ state, commit, dispatch, getters }) {
      importExcel(null).then((workbook) => {
        state.workbook = workbook
        var sheets = Object.keys(workbook)
        sheets.forEach((sheet) => {
          if (sheet.indexOf('#MD') == -1) {
            processData(state, workbook, sheet)
          } else {
            processMetadata(state, workbook, sheet)
          }
        })
      })
    },
    writeCollection() {},
  },
  mutations: {
    setItem: function (state, { value, sheet }) {
      let index = state[sheet].findIndex((e) => e.__id === value.__id)

      Vue.set(state[sheet], index, {
        ...value,
        cardInfo: getItemCard(value, state.workbook[sheet + '#MD']),
      })
    },
    setEditItem: function (state, value) {
      state.editItem = value
    },
  },
}
function getItemCard(ms, types) {
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
function processData(state, workbook, sheet) {
  Vue.set(state, sheet, workbook[sheet])
  state.sheets.push(sheet)

  state[sheet].forEach((ms) => {
    workbook[sheet + '#MD'].forEach((mt) => {
      if (mt.format === 'date') {
        let dt = ms[mt.name].split('/')
        ms[mt.name] = dt[2] + '-' + dt[0] + '-' + dt[1]
      }
      ms.__id = guid()
    })
    Vue.set(
      ms,
      'cardInfo',
      getItemCard(ms, state.workbook[sheet + '#MD'])
    )
  })
}
function processMetadata(state, workbook, sheet) {
  let obj = {}
  workbook[sheet].forEach((prop) => {
    obj[prop.name] = {
      ...prop,
    }
  })
  Vue.set(state, sheet, {
    type: 'object',
    properties: obj,
  })
}
export default api

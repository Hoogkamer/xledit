import { importExcel, exportExcel } from '@/assets/io_functions'
import Vue from 'vue'

const api = {
  namespaced: true,
  state: () => ({
    types: ['term', 'property', 'group', 'label'],
    workbook: [],
    editItem: null,
    sheets: [],
    Deliverables: [],
  }),
  getters: {
    getSheet: (state, getters) => (sheet) => {
      return state[sheet]
    },
    workbook: (state) => state.workbook,
  },
  actions: {
    putExcel: function ({ state, commit, dispatch, getters }) {
      exportExcel(state.workbook)
    },
    getExcel: function ({ state, commit, dispatch, getters }) {
      importExcel(null).then((workbook) => {
        console.log(workbook)
        state.workbook = workbook
        return
        let sheets = Object.keys(workbook)
        var nsheet, ncol

        sheets
          .filter((s) => s.indexOf('#MD') > 0)
          .forEach((sheet) => {
            workbook[sheet].data.forEach((col) => {
              if (col['y-parent']) {
                nsheet = col['y-parent'].split('/')[0]
                ncol = col['y-parent'].split('/')[1]
                workbook[nsheet + '#MD'].data.find(
                  (col) => col.name === ncolsheets
                )['y-child'] =
                  sheet.split('#')[0] + '/' + col.name + '/' + ncol
              }
            })
          })
        console.log(workbook)
        sheets.forEach((sheet) => {
          if (sheet.indexOf('#MD') == -1) {
            processData(state, workbook, sheet)
          } else {
            processMetadata(state, workbook, sheet)
          }
        })
      })
    },
  },
  mutations: {
    setItem: function (state, { value, sheet }) {
      let index = state[sheet].findIndex((e) => e.__id === value.__id)
      console.log('SSSeet', value, index)
      let newob = {
        ...value,
        cardInfo: getItemCard(value, state.workbook[sheet + '#MD']),
      }

      Vue.set(state[sheet], index, newob)
      // state.editItem = state[sheet][index]
      // console.log(state[sheet])
    },
    setEditItem: function (state, value) {
      console.log('edititem', value)
      state.editItem = value
    },
    setEditItemData: function (state, data) {
      state.editItem.data = data
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
    if (mt['y-child']) {
      card.child = {
        sheet: mt['y-child'].split('/')[0],
        col: mt['y-child'].split('/')[1],
        val: ms[mt['y-child'].split('/')[2]],
      }
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
        if (typeof ms[mt.name].getMonth !== 'function') {
          let dt = ms[mt.name].split('/')
          ms[mt.name] = dt[2] + '-' + dt[0] + '-' + dt[1]
        } else {
          ms[mt.name] =
            ms[mt.name].getFullYear() +
            '-' +
            (ms[mt.name].getMonth() + 1) +
            '-' +
            (ms[mt.name].getDate() + 1)
        }
      }

      Vue.set(ms, '__id ', guid())
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

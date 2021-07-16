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
    fixDates: function ({ state }) {
      state.workbook.forEach((wb) => {
        console.log(wb)
        if (wb.metaData) {
          let dateColumns = wb.metaData.filter(
            (c) => c.type === 'date'
          )
          console.log('datecolumns', dateColumns)
          dateColumns.forEach((dc) => {
            wb.data.forEach((row) => {
              row[dc.name] = col2date(row[dc.name])
            })
          })
        }
      })
      function col2date(col) {
        let retval = ''
        if (!col) return retval
        if (typeof col.getMonth === 'function') {
          retval =
            col.getFullYear() +
            '-' +
            (col.getMonth() + 1) +
            '-' +
            (col.getDate() + 1)
        } else if (col.indexOf('T')) {
          let dt = col.split('T')
          retval = dt[0]
        } else {
          let dt = col.split('/')
          retval = dt[2] + '-' + dt[0] + '-' + dt[1]
        }
        console.log('>>retval>>', retval)
        return retval
      }
    },
    getExcel: function ({ state, commit, dispatch, getters }) {
      importExcel(null).then((workbook) => {
        console.log(workbook)
        state.workbook = workbook
        dispatch('fixDates')
      })
    },
  },
  mutations: {
    setItem: function (state, { value, sheet, id }) {
      console.log(state.workbook, value, sheet, id)
      let wbSheet = state.workbook.find((x) => x.name === sheet)
      let index = wbSheet.data.findIndex((e) => e.__id === id)
      console.log('index', index)
      if (index > -1) {
        let newob = {
          ...wbSheet.data[index],
          ...value,
        }
        Vue.set(wbSheet.data, index, newob)
      } else {
        let newob = {
          ...getEmptyObject(wbSheet.metaData),
          __id: wbSheet.maxKey++,
          ...value,
        }
        wbSheet.data.push(newob)
      }

      function getEmptyObject(metaData) {
        let retObj = {}
        metaData.forEach((c) => {
          retObj[c] = ''
        })
        return retObj
      }

      // state.editItem = state[sheet][index]
      // console.log(state[sheet])
    },
    deleteItem: function (state, { sheet, id }) {
      let wbSheet = state.workbook.find((x) => x.name === sheet)
      let index = wbSheet.data.findIndex((e) => e.__id === id)
      if (index > -1) {
        wbSheet.data.splice(index, 1)
      }
    },
    setEditItem: function (state, value) {
      console.log('edititem', value)
      state.editItem = value
    },
    setEditItemData: function (state, data) {
      state.editItem.data = data
      console.log(state.editItem, state.workbook)
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

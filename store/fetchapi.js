import { importExcel, exportExcel } from '@/assets/io_functions'

import Vue from 'vue'

const api = {
  namespaced: true,
  state: () => ({
    workbook: [],
    editItem: null,
    editMetadata: null,
  }),
  getters: {
    getSheet: (state, getters) => (sheet) => {
      return state[sheet]
    },
    editMetadata: (state) => state.editMetadata,
    workbook: (state) => state.workbook,
    defaultMetadata: (state) => {
      return {
        name: c,
        type: 'string',
        width: 6,
        filter: false,
        cardField: 'none',
        parent: 'none',
        order: i,

        lookup: [],
      }
    },
  },
  actions: {
    putExcel: function ({ state, commit, dispatch, getters }) {
      exportExcel(state.workbook)
    },
    setEditMetadata({ state }, val) {
      state.editMetadata = val
    },
    addSheetToWorkbook: function ({ state }, sheetName) {
      state.workbook.push({
        name: sheetName,
        data: [],
        metaData: [],
        maxKey: 0,
      })
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
    addItem: function (state, { item, sheet }) {
      console.log(state.workbook, item, sheet)
      let wbSheet = state.workbook.find((x) => x.name === sheet)

      let newob = {
        ...getEmptyObject(wbSheet.metaData),
        __id: wbSheet.maxKey++,
        ...item,
      }
      wbSheet.data.push(newob)

      function getEmptyObject(metaData) {
        let retObj = {}
        metaData.forEach((c) => {
          retObj[c] = ''
        })
        return retObj
      }
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
  },
}

export default api

import { fileOpen, fileSave } from 'browser-fs-access'
import XLSX from 'xlsx'
var tab1 = 'test'
function prepareExport(sheet) {
  let sheetChanged = JSON.parse(JSON.stringify(sheet))
  sheetChanged.metaData.forEach((col) => {
    col.lookup = col.lookup.join(' _,_ ')
  })
  sheetChanged.data.forEach((row) => delete row.__id)
  return sheetChanged
}
function exportExcel(workbook) {
  var wb = XLSX.utils.book_new()

  workbook.forEach((sheet) => {
    let exportSheet = prepareExport(sheet)
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(exportSheet.data),
      sheet.name
    )
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(exportSheet.metaData),
      sheet.name + '#MD'
    )
  })

  var wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  fileSave(
    new Blob([wbout], { type: 'application/xlsx' }),
    {
      fileName: 'xledit.xlsx',
      description: 'xledit',
      extensions: ['.xlsx'],
    },
    window.openBlob ? window.openBlob.handle : null
  )
}

function importExcel(that) {
  return new Promise((resolve, reject) => {
    fileOpen()
      .then((blob) => {
        window.openBlob = blob
        var reader = new FileReader()
        reader.onload = function (e) {
          var data = e.target.result
          var workbook = XLSX.read(data, {
            type: 'binary',
            cellDates: true,
          })
          var sheetDatas = []

          workbook.SheetNames.filter(
            (s) => s.indexOf('#MD') === -1
          ).forEach((sheet) => {
            let sheetData = XLSX.utils.sheet_to_json(
              workbook.Sheets[sheet],
              {
                defval: '',
                range: 0,
              }
            )
            let sheetMetadata = XLSX.utils.sheet_to_json(
              workbook.Sheets[sheet + '#MD'],
              {
                defval: '',
                range: 0,
              }
            )

            let shData = []
            sheetData.forEach((d, i) => {
              let o = d
              o.__id = i
              shData.push(o)
            })

            sheetDatas.push({
              name: sheet,
              maxKey: sheetData.length,
              data: getSheetData(shData),
              metaData: getSheetMetadata(sheetData, sheetMetadata),
            })
          })

          resolve(sheetDatas)
        }
        reader.readAsBinaryString(blob)
      })
      .catch((e) => {
        // this.errors.push(e)
      })
  })
}
function getSheetData(sheetData) {
  return sheetData
  //return sheetData.map((v, i) => ({ ...v, __id: i }))
}
function getSheetMetadata(data, metadata) {
  console.log(data, metadata)
  metadata.forEach((md, i) => {
    md.lookup = md.lookup.split(' _,_ ')
    if ((md.lookup.length === 1) & !md.lookup[0]) md.lookup = []
    md.order = i
  })

  let columns = Object.keys(data[0])
  let retval = columns.map((c, i) => {
    let rv = {
      name: c,
      type: 'string',
      width: 6,
      filter: false,
      cardField: 'none',
      parent: 'none',
      order: i,
      lookup: [],
    }
    return { ...rv, ...metadata.find((nm) => nm.name === c) }
  })
  console.log('md', metadata, 'rv', retval)
  retval.sort((a, b) => a.order - b.order)
  return retval
}

export { importExcel, exportExcel }

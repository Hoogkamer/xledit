import { fileOpen, fileSave } from 'browser-fs-access'
import XLSX from 'xlsx'
var tab1 = 'test'
function prepareExport(sheet) {
  sheet.metaData.forEach((col) => {
    col.lookup = col.lookup.join(' _,_ ')
  })
  return sheet
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

          workbook.SheetNames.forEach((sheet) => {
            let sheetData = XLSX.utils.sheet_to_json(
              workbook.Sheets[sheet],
              {
                defval: '',
                range: 0,
              }
            )

            sheetDatas.push({
              name: sheet,
              data: sheetData,
              metaData: getSheetMetadata(Object.keys(sheetData[0])),
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
function getSheetMetadata(columns) {
  return columns.map((c, i) => {
    return {
      name: c,
      type: 'dropdown',
      width: 6,
      filter: false,
      cardField: 'none',
      parent: 'none',
      order: i,
      lookup: ['car', 'house', 'garden'],
    }
  })
}

export { importExcel, exportExcel }

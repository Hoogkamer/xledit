import {
  fileOpen /*directoryOpen, fileSave*/,
} from 'browser-fs-access'
import XLSX from 'xlsx'
var tab1 = 'test'

function importExcel(that) {
  return new Promise((resolve, reject) => {
    fileOpen()
      .then((blob) => {
        window.openBlob = blob
        var reader = new FileReader()
        reader.onload = function (e) {
          var data = e.target.result
          var workbook = XLSX.read(data, { type: 'binary' })
          var result = {}

          workbook.SheetNames.forEach((sheet) => {
            result[sheet] = XLSX.utils.sheet_to_json(
              workbook.Sheets[sheet],
              {
                defval: '',
                range: 1,
              }
            )
          })

          resolve(result)
        }
        reader.readAsBinaryString(blob)
      })
      .catch((e) => {
        // this.errors.push(e)
      })
  })
}

export { importExcel }

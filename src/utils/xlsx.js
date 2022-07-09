const XLSX = require('xlsx')
import FileSaver from 'file-saver'
import { transformImage } from './trans-image'

/**
 * 异步读取Excel文件的sheet表为json数据
 * 不支持合并单元格
 * @param {File对象} file
 */
export function readExcelToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      //  console.log('workbook: ', workbook)

      // 将Excel 第一个sheet内容转为json格式
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(worksheet)
      //   console.log('jsonExcel:', jsonExcel)
      resolve(json)
    }

    reader.readAsArrayBuffer(file.raw)
  })
}

/**
 * 保存json为Excel文件
 * @param {*} data
 * @param {*} filename  文件名后缀为.xlsx
 */
export function saveJsonToExcel(data, filename) {
  const sheet = XLSX.utils.json_to_sheet(transSheetData(data))

  const workbook = {
    SheetNames: ['sheet1'],
    Sheets: {
      sheet1: sheet
    }
  }

  const wbout = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })

  FileSaver.saveAs(
    new Blob([wbout], { type: 'application/octet-stream' }),
    filename
  )
}

export async function generateCharacterData(sheets, imageList) {
  const data = {}
  for (var c of sheets) {
    var c_info = {}
    c_info['first_word'] = Object.keys(c).includes('首字母') ? c['首字母'] : ''
    c_info['id'] = Object.keys(c).includes('序号') ? c['序号'] : ''
    c_info['name'] = Object.keys(c).includes('干员姓名') ? c['干员姓名'] : ''
    c_info['anothername'] = Object.keys(c).includes('干员别名') ? c['干员别名'].split(',') : []
    c_info['nickname'] = Object.keys(c).includes('干员昵称') ? c['干员昵称'].split(',') : []
    c_info['falsename'] = Object.keys(c).includes('干员错名') ? c['干员错名'].split(',') : []
    c_info['quanpin'] = Object.keys(c).includes('姓名全拼') ? c['姓名全拼'].split(',') : []
    c_info['painting'] = Object.keys(c).includes('立绘') ? c['立绘'] : ''
    c_info['card'] = Object.keys(c).includes('角色卡') ? c['角色卡'] : ''
    c_info['colors'] = Object.keys(c).includes('颜色') ? JSON.parse(c['颜色']) : []
    c_info['class'] = Object.keys(c).includes('职业') ? c['职业'] : ''
    c_info['rarity'] = Object.keys(c).includes('稀有度') ? c['稀有度'] : ''
    for (var i of imageList) {
      if ((c_info.name.toLowerCase() + '.png') === i.name.toLowerCase()) {
        try {
          c_info['colors'] = await transImage(i.raw)
        } catch (e) {
          console.debug(i.name + ' image load failed!')
          c_info['colors'] = []
        }
      }
    }
    data[c_info['name']] = c_info
  }
  return data
}

export async function transImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => resolve(transformImage(reader.result))
    reader.onerror = error => reject(error)
  })
}

function transSheetData(data) {
  const sheets = []
  for (var c of data) {
    var newc = {}
    newc['首字母'] = Object.keys(c).includes('first_word') ? c['first_word'] : ''
    newc['序号'] = Object.keys(c).includes('id') ? c['id'] : ''
    newc['干员姓名'] = Object.keys(c).includes('name') ? c['name'] : ''
    newc['干员昵称'] = Object.keys(c).includes('anothername') ? c['anothername'].join(',') : ''
    newc['干员错名'] = Object.keys(c).includes('falsename') ? c['falsename'].join(',') : ''
    newc['姓名全拼'] = Object.keys(c).includes('quanpin') ? c['quanpin'].join(',') : ''
    newc['立绘'] = Object.keys(c).includes('painting') ? c['painting'] : ''
    newc['角色卡'] = Object.keys(c).includes('card') ? c['card'] : ''
    newc['颜色'] = Object.keys(c).includes('colors') ? JSON.stringify(c['colors']) : ''
    newc['职业'] = Object.keys(c).includes('class') ? c['class'] : ''
    newc['稀有度'] = Object.keys(c).includes('rarity') ? c['rarity'] : ''
    sheets.push(newc)
  }
  return sheets
}

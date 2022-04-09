import { getLodop } from './LodopFuncs'
import html2canvas from 'html2canvas';
import axios from 'axios'

// base64编码
function getBASE64 (dataArray) {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var strData = "";
  for (var i = 0, ii = dataArray.length; i < ii; i += 3) {
    if (isNaN(dataArray[i])) break;
    var b1 = dataArray[i] & 0xFF, b2 = dataArray[i + 1] & 0xFF, b3 = dataArray[i + 2] & 0xFF;
    var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
    var d3 = i + 1 < ii ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
    var d4 = i + 2 < ii ? (b3 & 0x3F) : 64;
    strData += digits.substring(d1, d1 + 1) + digits.substring(d2, d2 + 1) + digits.substring(d3, d3 + 1) + digits.substring(d4, d4 + 1);
  }
  return strData;
}
function demoDownloadPDF (url) {
  if (!(/^https?:/i.test(url))) return
  if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false); // false同步方式，需要设置同步，因为按照表格顺序发送请求
  if (xhr.overrideMimeType)
    try {
      xhr.responseType = 'arraybuffer';
      var arrybuffer = true;
    } catch (err) {
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }
  xhr.send(null);
  var data = xhr.response || xhr.responseBody;
  if (typeof Uint8Array !== 'undefined') {
    if (arrybuffer) {
      var dataArray = new Uint8Array(data)
    } else {
      var dataArray = new Uint8Array(data.length);
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i] = data.charCodeAt(i)
      }
    }
  }
  return getBASE64(dataArray);
}
async function axiosDownloadPDF (url) {
  if (!(/^https?:/i.test(url))) return
  const res = await axios.get(url, {
    responseType: 'arraybuffer'
  })
  const dataArray = new Uint8Array(res.data)
  return getBASE64(dataArray);
}

function new_eval (str) {
  var fn = Function;
  return new fn(str)();
}

var LODOP = getLodop()
// 检查是否安装C-Lodop或Lodop控件
export function CheckIsInstall () {
  const LODOP = getLodop()
  try {
    if (LODOP.VERSION) {
      if (LODOP.CVERSION)
        alert("当前有WEB打印服务C-Lodop可用!\n C-Lodop版本:" + LODOP.CVERSION + "(内含Lodop" + LODOP.VERSION + ")");
      else
        alert("本机已成功安装了Lodop控件！\n 版本号:" + LODOP.VERSION);
    };
  } catch (err) {
  }
};
// 创建一个
function CreatePage () {
  const LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
  LODOP.PRINT_INITA(0, 0, 665, 600, "打印控件功能演示_Lodop功能_演示文档式模板生成和使用");
  LODOP.ADD_PRINT_TEXTA("jj_xm", 83, 78, 75, 20, "寄件人姓名");
  LODOP.ADD_PRINT_TEXTA("jj_dz", 134, 90, 238, 35, "寄件人的详细地址");
  LODOP.ADD_PRINT_TEXTA("jj_dh", 83, 212, 100, 20, "寄件人电话");
  LODOP.ADD_PRINT_TEXTA("sj_xm", 85, 391, 75, 20, "收件人姓名");
  LODOP.ADD_PRINT_TEXTA("sj_dz", 137, 403, 244, 35, "收件人详细地址");
  LODOP.ADD_PRINT_TEXTA("sj_dh", 80, 554, 75, 20, "收件人电话");
};

// 打印设计
export function printDesign () {
  const LODOP = getLodop()
  LODOP.PRINT_INIT()
  // CreatePage();
  // LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);
  LODOP.PRINT_DESIGN();
};
// 保存模板
export function getProgramData () {
  const LODOP = getLodop()
  // LODOP.GET_VALUE("ProgramData", 1) // 文档式模板，base64
  LODOP.GET_VALUE("ProgramCodes", 1) // 明文模板，获得语句组式模板（程序代码），在打印设计或打印维护界面显示或关闭后通过本语句获得，本模板为js语句格式。
  if (LODOP.CVERSION) LODOP.On_Return = function (TaskID, Value) {
    // 这里将Value发送给后端保存
    // 暂用sessionStorage保存
    sessionStorage.setItem('template', Value)
    console.log(Value);
  };
};
// 加载模板
export function DesignByPRGData () {
  const LODOP = getLodop()
  LODOP.GET_VALUE("ProgramData", 1)	//获得文档式模板
  if (LODOP.CVERSION) LODOP.On_Return = function (TaskID, Value) {
    LODOP.ADD_PRINT_DATA("ProgramData", Value); //装载模板
    LODOP.PRINT_DESIGN()
    // LODOP.PREVIEW()
  };
};
// 打印包含样式
export function printWithStyle () {
  const LODOP = getLodop()
  // LODOP.ADD_PRINT_HTM(88, 50, '100%', '100%', 'URL:https://img0.baidu.com/it/u=2151136234,3513236673&fm=26&fmt=auto&gp=0.jpg'); // 打印图片，宽度和高度设置100%
  // LODOP.ADD_PRINT_HTM(88, 50, '100%', '100%', '<img id="i1" src="https://img0.baidu.com/it/u=2151136234,3513236673&fm=26&fmt=auto&gp=0.jpg" alt="" />'); // 打印图片，宽度和高度设置100%
  // 可以使用 dom-to-image 这个包
  html2canvas(document.getElementById('t1')).then(canvas => {
    const img = new Image()
    img.src = canvas.toDataURL('image/png')
    // 打印图片都用ADD_PRINT_HTM或ADD_PRINT_HTML，因为可以设置长宽
    LODOP.ADD_PRINT_HTM(88, 50, '100%', '100%', `<img src=${canvas.toDataURL('image/png')} alt="" />`); // 打印图片，宽度和高度设置100%
    LODOP.PREVIEW()
  })
}
// 分页打印
export function createAllPage ({ dataList, meta }) {
  const LODOP = getLodop()
  // 不能在每个循环中初始化语句，否则只会预览一页或打印一页
  LODOP.PRINT_INIT()
  // 获取纸张宽高
  let width, height
  LODOP.GET_VALUE('PRINTSETUP_PAGE_WIDTH', 0)
  if (LODOP.CVERSION) {
    LODOP.On_Return = function (taskId, value) {
      width = value / 10
      LODOP.GET_VALUE('PRINTSETUP_PAGE_HEIGHT', 0)
      LODOP.On_Return = function (taskId, value) {
        height = value / 10
        const template = sessionStorage.getItem('template')
        for (let i = 0; i < dataList.length; i++) {
          new_eval(template) // 执行明文模板js语句
          meta.forEach((item, index) => {
            // 如果LODOP.SET_PRINT_STYLEA('类名', "CONTENT", value)的类名是相同的话
            // 那么最后一次SET_PRINT_STYLEA设置的值会覆盖掉前面SET_PRINT_STYLEA所设置的值
            // 因此我们要通过 ItemName 的方式在每一次循环中将类名改造为唯一的，然后再设置值
            LODOP.SET_PRINT_STYLEA(item, "ItemName", item + i + index);
            LODOP.SET_PRINT_STYLEA(item + i + index, "CONTENT", dataList[i][index]);
          })
          LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', true) // 设置非逐份打印（自动分页）11,22,33，打印机默认逐份打印（非自动分页）123,123,123
          LODOP.NEWPAGE()
        }
        console.log(LODOP.GET_PAGESIZES_LIST('Microsoft Print to PDF', ','));
        LODOP.SET_PRINTER_INDEXA('Microsoft Print to PDF')
        LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "B5 (JIS)");
        LODOP.SET_PRINT_COPIES(2)
        LODOP.PREVIEW()
        LODOP.On_Return = function (taskId, value) {
          console.log(1);
        }
      }
    }
  }
}
// 获取打印机名称
export function getPrinters () {
  const LODOP = getLodop()
  const count = LODOP.GET_PRINTER_COUNT()
  const printers = []
  for (let i = 0; i < count; i++) {
    const name = LODOP.GET_PRINTER_NAME(i)
    console.log(LODOP.GET_PRINTER_NAME('0:PaperLength'), 'PaperLength')
    printers.push(name)
  }
  sessionStorage.setItem('printers', JSON.stringify(printers))
}
// 指定打印机
export function setPrinter () {
  const printers = JSON.parse(sessionStorage.getItem('printers'))
  const LODOP = getLodop()
  console.log(LODOP.SET_PRINTER_INDEXA(printers[2]));
}
// 打印pdf
export async function printPDF () {
  // Https方式需先下载好再打印，Http可以直接预览打印
  let httpsUrl = 'https://saasdev.fastlion.cn/lion-saas/app_heywind_retail/api/v1/download/file/ED35FC9020646FFBD583A61B0D085471?fileName=%E6%98%93%E5%8F%AF%E8%BE%BE-ide20210719000008.pdf&namefield=LOGISTICS_FILE_ID&md5Field=ED35FC9020646FFBD583A61B0D085471&down=allow&online=true'
  // const res = await axios.get(httpsUrl)
  // return console.log(res.data);
  const LODOP = getLodop()
  LODOP.PRINT_INIT("测试PDF打印功能");
  // demoDownloadPDF 解决 https协议的pdf地址加载
  LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", demoDownloadPDF(httpsUrl));
  // LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", await axiosDownloadPDF(httpsUrl));
  LODOP.SET_PRINT_STYLEA(0, "PDFScalMode", 1);
  LODOP.PREVIEW()
}

// 指定份数打印
export async function printPDFCount () {
  for (let i = 0; i < 5; i++) {
    const LODOP = getLodop()
    LODOP.PRINT_INIT()
    LODOP.NEWPAGEA()
    LODOP.ADD_PRINT_TEXT(100, 100, 100, 100, `${i}`)
    LODOP.SET_PRINT_COPIES(i)
    LODOP.PRINT()
  }
}

// 模板赋值图片链接
export function templateOfImg () {
  const tempUrl = 'http://bpic.588ku.com/element_origin_min_pic/16/10/29/2ac8e99273bc079e40a8dc079ca11b1f.jpg'
  const url = "https://trial.fastlion.cn/lion-saas/app_heywind_retail/api/v1/download/img/06258614d1014d2499762037d143c22d?fileName=TIJN.png&namefield=LOGO_PICTURE&md5Field=4B9EBB4766E303E29850BCD57FD04678"
  const template = sessionStorage.getItem('template')
  const LODOP = getLodop()
  LODOP.PRINT_INIT()
  new_eval(template) // 执行明文模板js语句
  LODOP.SET_PRINT_STYLEA('img', 'CONTENT', `<img style="width:100%;" src=${tempUrl} alt="" />`)
  // LODOP.SET_PRINT_STYLEA('img', 'CONTENT', tempUrl)
  // LODOP.ADD_PRINT_IMAGE(0, 0, '100%', '100%', `<img src=${url} />`)
  // LODOP.ADD_PRINT_URL(0, 0, '100%', '100%', url)
  LODOP.PREVIEW()
}

// HTML方式加载图片（style控制样式）
export function HTMLImg () {
  const imgUrl = 'https://img.zcool.cn/community/0147e86243ff520002c3290f77f99d.jpg@1280w_1l_2o_100sh.jpg'
  const LODOP = getLodop()
  LODOP.PRINT_INIT()
  // 需要按照图片的比例来设置宽高
  LODOP.ADD_PRINT_HTM(10, 10, 178, 100, `<img style="width:100%;" src=${imgUrl} alt="" />`);
  LODOP.SET_PRINT_STYLEA(0, "ItemName", "img");
  LODOP.PREVIEW()
}

// 设置纸张
export function setPageSize () {
  const LODOP = getLodop()
  LODOP.PRINT_INIT()
  LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
  LODOP.SET_PRINTER_INDEXA('Microsoft Print to PDF')
  LODOP.PREVIEW()
}

// 获取设置纸张宽高
export function getPaperSize () {
  const LODOP = getLodop()
  LODOP.PRINT_INIT()
  if (LODOP.blOneByone == true) {
    console.log('有窗口已打开');
    return
  }
  // 获取纸张宽高
  let width, height;
  // LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
  // LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "B5 (JIS)");
  LODOP.GET_VALUE('PRINTSETUP_PAGE_WIDTH', 0)
  if (LODOP.CVERSION) {
    LODOP.On_Return = function (taskId, value) {
      width = value / 10
      LODOP.GET_VALUE('PRINTSETUP_PAGE_HEIGHT', 0)
      LODOP.On_Return = function (taskId, value) {
        height = value / 10
        console.log(width, 'width');
        console.log(height, 'height');
      }
    }
  }
}

// 重复输出
// 注意单、双引号
let sentence = "LODOP.ADD_PRINT_TEXT(100,100,50,10,'单号：');\nLODOP.SET_PRINT_STYLEA(0,'FontSize',8);\nLODOP.ADD_PRINT_TEXTA('aaa',100,130,100,100,1);\nLODOP.ADD_PRINT_TEXTA('bbb',100,160,100,100,2);\nLODOP.ADD_PRINT_TEXT(100,190,50,10,'货仓');\nLODOP.SET_PRINT_STYLEA(0,'FontSize',8);\nLODOP.ADD_PRINT_BARCODEA('code',120,100,100,50,'128A','123456789012');\nLODOP.ADD_PRINT_BARCODEA('code1',120,200,100,50,'128A','123456789012');\nLODOP.ADD_PRINT_HTM(180, 100, 178, 100,'123');\nLODOP.SET_PRINT_STYLEA(0,'ItemName','img');"
// sentence = 'LODOP.ADD_PRINT_TEXT(100,100,50,10,"单号：");\nLODOP.SET_PRINT_STYLEA(0,"FontSize",8);\nLODOP.ADD_PRINT_TEXTA("aaa",100,130,100,100,1);\nLODOP.ADD_PRINT_TEXTA("bbb",100,160,100,100,2);\nLODOP.ADD_PRINT_TEXT(100,190,50,10,"货仓");\nLODOP.SET_PRINT_STYLEA(0,"FontSize",8);\nLODOP.ADD_PRINT_BARCODEA("code",120,100,100,50,"128A","123456789012");\nLODOP.ADD_PRINT_BARCODEA("code1",120,200,100,50,"128A","123456789012");\nLODOP.ADD_PRINT_HTM(180, 100, 178, 100,"123");\nLODOP.SET_PRINT_STYLEA(0,"ItemName","img");'


export function repeat () {
  const LODOP = getLodop()
  // LODOP.SET_PRINT_MODE('WINDOW_DEFPAGESIZE', "A3");
  LODOP.ADD_PRINT_TEXT(33, 13, 625, 35, "本弹窗仅用作加载纸张大小，无需您任何操作，请点击右上角关闭按钮");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
  LODOP.SET_PRINT_STYLEA(0, "FontColor", "#0080FF");
  LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
  LODOP.SET_PREVIEW_WINDOW(1, 3, 0, 1000, 200)
  LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
  LODOP.PREVIEW()
  if (LODOP.CVERSION) {
    LODOP.On_Return = function (taskId, value) {
      repeat1()
    }
  }
}

export function repeat1 () {
  let pageWidth, pageHeight;
  // 单位 mm
  let width = 50, height = 50
  const LODOP = getLodop()
  LODOP.GET_VALUE('PRINTSETUP_SIZE_WIDTH', 0) // 获取可打印宽度
  if (LODOP.CVERSION) {
    LODOP.On_Return = function (taskId, value) {
      // value 单位是 0.1mm
      pageWidth = value / 10
      LODOP.GET_VALUE('PRINTSETUP_SIZE_HEIGHT', 0) // 获取可打印高度
      LODOP.On_Return = function (taskId, value) {
        // value 单位是 0.1mm
        pageHeight = value / 10
        if (!pageWidth || !pageHeight || width > pageWidth || height > pageHeight) return
        const maxCol = Math.floor(pageWidth / width)
        const maxRow = Math.floor(pageHeight / height)
        const maxCountPerPage = maxCol * maxRow // 每页最大的数量

        const printData = Array.from({ length: 32 })
        // 以2页为一个任务
        const sliceArr = [];
        const sliceCount = Math.ceil(printData.length / (maxCountPerPage * 2));
        for (let j = 0; j < sliceCount; j++) {
          sliceArr.push(printData.slice(j * (maxCountPerPage * 2), (j + 1) * (maxCountPerPage * 2)));
        }
        for (let i = 0; i < sliceArr.length; i++) {
          const currentPrintData = sliceArr[i]
          new Promise(rs => {
            rs()
          }).then(() => {
            multiTasks({ LODOP, maxCol, maxRow, maxCountPerPage, width, height, printData: currentPrintData })
          })
        }
      }
    }
  }
}

function multiTasks (params) {
  const { LODOP, maxCol, maxRow, maxCountPerPage, width, height, printData } = params
  LODOP.PRINT_INIT();
  // const templateSentences = [] // 保存排列每一项的模板语句
  const keyIndex = {} // 用来保存正则匹配到key时的索引,以便下次从该位置开始搜索
  let indexOnPage = 0 // 当前页内的index
  // console.log(maxCol, maxRow);
  printData.forEach((v, i) => {
    if (i % maxCountPerPage === 0) {
      LODOP.NEWPAGEA();
      indexOnPage = 0
    }
    const keyValue = {
      'aaa': "aaa",
      "bbb": "bbb",
      'code': '123456789012',
      'code1': null,
      'img': {
        url: 'https://img.zcool.cn/community/0147e86243ff520002c3290f77f99d.jpg@1280w_1l_2o_100sh.jpg'
      }
    }
    const keys = Object.keys(keyValue)

    // 标签模板设计对象时必须使用px
    // lodop 单位换算 1in(英寸)=2.54cm(厘米)=25.4mm(毫米)=72pt(磅)=96px
    // 1mm = 3.78
    const marginLeft = (indexOnPage % maxCol) * width * 3.78
    const marginHeight = (Math.floor(indexOnPage / maxCol)) * height * 3.78
    // console.log(marginLeft, marginHeight);
    let templateSentences = sentence
    let hideSentence = '' // 隐藏语句，用来隐藏内容为空的对象

    // 对没有设置类名的打印项设置间隔距离
    const replaceObj = {}
    const reg = /(\((.[0-9]+,){4})/g
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      const res = reg.exec(templateSentences)
      const search = res?.[0] // 匹配的结果如："(100,190,50,10,"  Top,Left,Width,Height
      if (search) {
        const params = search.slice(1, search.length - 1).split(',')  //  ['100', '100', '50', '10']
        params[0] = Number(params[0]) + marginHeight
        params[1] = Number(params[1]) + marginLeft
        replaceObj[search] = `(${params.join(',')},`
      } else {
        break
      }
    }
    for (let k in replaceObj) {
      templateSentences = templateSentences.replace(k, replaceObj[k])
    }

    keys.forEach(key => {
      if (!keyValue[key]) {
        // 数据为null时，将其宽高设置为0（不显示）
        hideSentence = hideSentence + `LODOP.SET_PRINT_STYLEA('${key}', 'Width', 0);LODOP.SET_PRINT_STYLEA('${key}', 'Height', 0);LODOP.SET_PRINT_STYLEA('${key}', 'Content', null);LODOP.SET_PRINT_STYLEA('${key}', 'Top', -30);`
        return
      }
      let s = templateSentences;
      if (keyValue[key]?.url) { // 对HTML项语句进行处理
        const regAdd = new RegExp(`(ADD_PRINT_HTM[\\s\\S]*?${key}{1}('|"))`) // LODOP.ADD_ 语句
        const res = regAdd.exec(keyIndex[key] ? s.slice(keyIndex[key]) : s)
        const search = res?.[0] // 匹配到的语句
        const searchIndex = res?.['index'] // 匹配到的语句的索引
        if (search) {
          // [Top, Left, Width, Height,..., 值); ]
          const paramsString = /[0-9]+,(.*?);/.exec(search)?.[0] // 获取ADD_PRINT_HTM的参数
          const params = paramsString?.split(',')

          if (params) {
            !keyIndex[key] && (keyIndex[key] = searchIndex)
            // 更改位置参数和内容值
            // params[0] = Number(params[0]) + marginHeight
            // params[1] = Number(params[1]) + marginLeft
            params[params.length - 1] = `'<img style="width:100%;" src=${keyValue[key].url} />');`
            // key.length + 2中的2是两个引号
            let replacement = search.slice(0, -(key.length + 2)) + search.slice(-(key.length + 2)).replace(key, `${key + i}abc`) // 更改类名
            replacement = replacement.replace(paramsString, params.join(','))
            templateSentences = s.replace(search, replacement)
          }
        }
      } else { // 其它类型项
        const regAdd = new RegExp(`(('|")${key}('|").*?;{1})`) // LODOP.ADD_ 语句
        const res = regAdd.exec(keyIndex[key] ? s.slice(keyIndex[key]) : s)
        // const res = regAdd.exec(s)
        const search = res?.[0] // 匹配到的语句
        const searchIndex = res?.['index'] // 匹配到的语句的索引
        if (search) {
          !keyIndex[key] && (keyIndex[key] = searchIndex)
          // [类名, Top, Left, Width, Height,..., 值); ]
          const params = search.split(',')
          params[0] = `'${key + i}abc'`
          params[1] = Number(params[1]) + marginHeight
          params[2] = Number(params[2]) + marginLeft
          params[params.length - 1] = `'${keyValue[key] + i}');`
          templateSentences = s.replace(search, params.join(','))
        }
      }
    })
    new_eval(templateSentences)
    hideSentence && new_eval(hideSentence)
    indexOnPage++
  })

  LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
  LODOP.PRINT()
}

export function test () {
  let s = "LODOP.ADD_PRINT_TEXT(100,100,50,10,'单号：');LODOP.ADD_PRINT_TEXT(100,190,50,10,'货仓');"
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
  // 匹配的结果如："(100,190,50,10,"  Top,Left,Width,Height
  const reg = /(\((.[0-9]+,){4})/g
  for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    const res = reg.exec(s)
    if (res) {
      console.log(res);
      console.log(reg.lastIndex);
    } else {
      break
    }
  }
}
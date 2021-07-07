import { getLodop } from './LodopFuncs'
import html2canvas from 'html2canvas';
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
  LODOP.GET_VALUE("ProgramCodes", 1) // 明文模板
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
  html2canvas(document.getElementById('t1')).then(canvas => {
    const img = new Image()
    img.src = canvas.toDataURL('image/png')
    LODOP.ADD_PRINT_HTM(88, 50, '100%', '100%', `<img src=${canvas.toDataURL('image/png')} alt="" />`); // 打印图片，宽度和高度设置100%
    LODOP.PREVIEW()
  })
}
// 分页打印
export function createAllPage ({ dataList, meta }) {
  const LODOP = getLodop()
  LODOP.PRINT_INIT()
  const template = sessionStorage.getItem('template')
  for (let val of dataList) {
    //装载模板
    LODOP.ADD_PRINT_DATA("ProgramData", template); // 装载密文模板
    // eval(template) // 执行明文模板js语句
    meta.forEach((item, index) => {
      LODOP.SET_PRINT_STYLEA(item, "CONTENT", val[index]);
    })
    LODOP.PRINT()
  }
}
// 分页打印1
export function createAllPage1 ({ dataList, meta }) {
  const LODOP = getLodop()
  // 不能在每个循环中初始化语句，否则只会预览一页或打印一页
  LODOP.PRINT_INIT()
  const template = sessionStorage.getItem('template')
  for (let i = 0; i < dataList.length; i++) {
    eval(template) // 执行明文模板js语句
    meta.forEach((item, index) => {
      // 如果LODOP.SET_PRINT_STYLEA('类名', "CONTENT", value)的类名是相同的话
      // 那么最后一次SET_PRINT_STYLEA设置的值会覆盖掉前面SET_PRINT_STYLEA所设置的值
      // 因此我们要通过 ItemName 的方式在每一次循环中将类名改造为唯一的，然后再设置值
      LODOP.SET_PRINT_STYLEA(item, "ItemName", item + i + index);
      LODOP.SET_PRINT_STYLEA(item + i + index, "CONTENT", dataList[i][index]);
    })
    LODOP.NEWPAGE()
  }
  LODOP.PREVIEW()
}
// 获取打印机名称
export function getPrinters () {
  const LODOP = getLodop()
  const count = LODOP.GET_PRINTER_COUNT()
  const printers = []
  for (let i = 0; i < count; i++) {
    console.log(LODOP.GET_PRINTER_NAME(i), 'name')
    console.log(LODOP.GET_PRINTER_NAME('PaperSize'), 'PaperSize')
    printers.push(LODOP.GET_PRINTER_NAME(i))
  }
  sessionStorage.setItem('printers', JSON.stringify(printers))
}
// 指定打印机
export function setPrinter () {
  const printers = JSON.parse(sessionStorage.getItem('printers'))
  const LODOP = getLodop()
  console.log(LODOP.SET_PRINTER_INDEXA(printers[2]));
}
// 循环打印
export function cyclePrint () {
  const LODOP = getLodop()
  console.log(LODOP.GET_VALUE('ItemContent ', 'name'));
  if (LODOP.CVERSION) LODOP.On_Return = function (TaskID, Value) {
    console.log(Value);
  };
  // LODOP.PRINT_INIT()
  // const template = sessionStorage.getItem('template')
  // for (let val of dataList) {
  //   //装载模板
  //   // LODOP.ADD_PRINT_DATA("ProgramData", template); // 装载密文模板
  //   eval(template) // 执行明文模板js语句
  //   meta.forEach((item, index) => {
  //     LODOP.SET_PRINT_STYLEA(item, "CONTENT", val[index]);
  //   })
  //   LODOP.PRINT()
  // }
}
export function printPDF () {
  let url = 'https://trial.fastlion.cn/lion-saas/app_heywind_retail/api/v1/download/file/B9161FA5E45130FEA075074CE6E14405?fileName=%E4%BA%91%E9%80%94-ide20210527000004.pdf&namefield=LOGISTICS_FILE_ID&md5Field=B9161FA5E45130FEA075074CE6E14405'
  const LODOP = getLodop()
  LODOP.PRINT_INIT("测试PDF打印功能");
  LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", url);
  // LODOP.ADD_PRINT_PDF(0, 0, '100%', '100%', 'https://trial.fastlion.cn/lion-saas/app_heywind_retail/api/v1/download/file/B9161FA5E45130FEA075074CE6E14405?fileName=%E4%BA%91%E9%80%94-ide20210527000004.pdf&namefield=LOGISTICS_FILE_ID&md5Field=B9161FA5E45130FEA075074CE6E14405&down=allow')
  LODOP.SET_PRINT_STYLEA(0, "PDFScalMode", 1);
  LODOP.SET_PRINT_PAGESIZE(3, 0, 0, "");
  LODOP.PREVIEW()
}

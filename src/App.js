import './App.css';
import { ConfigProvider, Button } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import {
  CheckIsInstall, printDesign, getProgramData, DesignByPRGData, printWithStyle, getPrinters, setPrinter,
  printPDF, createAllPage, templateOfImg, HTMLImg, printPDFCount, getPaperSize, setPageSize, repeat, test
} from './print'
import { data } from './data'
moment.locale('zh-cn');

function App () {
  return (
    <ConfigProvider locale={zhCN}>
      ·现在测试一下: <a href="" onClick={(e) => {
        e.preventDefault()
        CheckIsInstall()
      }}>查看本机是否安装(控件或web打印服务)</a>
      <div id="t1" style={{ width: 200, height: 200, backgroundColor: 'pink' }}>
        123
      </div>
      <div>
        <Button onClick={printDesign}>设计新模板</Button>
        <Button onClick={getProgramData}>保存模板</Button>
        <Button onClick={DesignByPRGData}>加载模板</Button>
        <Button onClick={printWithStyle}>打印包含样式</Button>
        <Button onClick={createAllPage.bind(null, data)}>遍历数组分页打印</Button>
        <Button onClick={getPrinters}>获取打印机设备和对应的纸张列表</Button>
        <Button onClick={setPrinter}>指定打印机</Button>
        <Button onClick={printPDF}>打印PDF</Button>
        <Button onClick={templateOfImg}>模板赋值图片链接</Button>
        <Button onClick={HTMLImg}>HTML加载图片</Button>
        <Button onClick={printPDFCount}>指定份数打印</Button>
        <Button onClick={setPageSize}>设置纸张</Button>
        <Button onClick={getPaperSize}>获取设置纸张宽高</Button>
        <Button onClick={repeat}>重复输出</Button>
        <Button onClick={test}>test</Button>
      </div>
    </ConfigProvider>
  );
}

export default App;

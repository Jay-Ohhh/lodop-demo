import logo from './logo.svg';
import { useState } from 'react'
import './App.css';
import { ConfigProvider, Button } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import {
  CheckIsInstall, printDesign, getProgramData, DesignByPRGData, printWithStyle, createAllPage, getPrinters, setPrinter,
  cyclePrint,
} from './print'
import { data } from './data'
moment.locale('zh-cn');

function App () {
  const [examValue, setExamValue] = useState('')
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
        <Button onClick={getPrinters}>获取打印机设备</Button>
        <Button onClick={setPrinter}>指定打印机</Button>
        <Button onClick={cyclePrint}>循环打印</Button>
      </div>
    </ConfigProvider>
  );
}

export default App;

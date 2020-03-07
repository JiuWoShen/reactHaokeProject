import React from 'react';
import './App.css';

//  导入虚拟化长列表样式
import 'react-virtualized/styles.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入路由组件-----写最外层路由---app.js--------整个页面都会换的路由
import {HashRouter as Router,Route,Switch,Redirect} from 'react-router-dom'

// 导入子组件
import Layout from './views/Layout'
import Login from './views/Login'
import NotFound from './views/NotFound'

import CityList from './views/CityList'

// 函数组件
function App() {
  return (
    <Router>
      {/* 设置路由规则-----第一层路由 */}
      <div style={{height:'100%'}}>
        {/* 使用重定向必须用Switch包裹 */}
        <Switch>
          <Route path='/citylist' component={CityList} />
          <Route path='/layout' component={Layout} />
          <Route path='/login' component={Login} />
          {/* 重定向要写在已有路径之后 */}
          <Redirect exact from='/' to='/layout' />
          {/* 404写在最后 */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

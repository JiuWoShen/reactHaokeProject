import React,{Component} from 'react'

import styles from './index.module.scss'

// 导入路由-----这里是第二层路由--不需要HashRouter
import {Route,Switch,Redirect,Link} from 'react-router-dom'

// 导入子组件
import Home from '../Home'
import HouseList from '../HouseList'
import My from '../My'
import News from '../News'
import NotFound from '../NotFound'

export default class Layout extends Component{
    render(){
        return (
            <div className={styles.test}>
                {/* 内容部分 */}
                <div style={{height:500}}>
                    <Switch>
                        <Route path='/layout/index' component={Home} />
                        <Route path='/layout/houselist' component={HouseList} />
                        <Route path='/layout/news' component={News} />
                        <Route path='/layout/my' component={My} />

                        <Redirect exact from='/layout' to='/layout/index' />
                        {/* 404写在最后 */}
                        <Route component={NotFound} />
                    </Switch>
                </div>

                {/* tabBar */}
                <div style={{position:'fixed',bottom:0,left:0}}>
                    <Link to='/layout/index'>首页</Link>&nbsp;&nbsp;&nbsp;
                    <Link to='/layout/houselist'>找房</Link>&nbsp;&nbsp;&nbsp;
                    <Link to='/layout/news'>咨询</Link>&nbsp;&nbsp;&nbsp;
                    <Link to='/layout/my'>我的</Link>&nbsp;&nbsp;&nbsp;
                </div>
            </div>
        )
    }
}
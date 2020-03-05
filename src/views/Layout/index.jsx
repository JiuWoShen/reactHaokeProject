import React, { Component } from 'react'

import styles from './index.module.scss'

// 导入路由-----这里是第二层路由--不需要HashRouter
import { Route, Switch, Redirect } from 'react-router-dom'

// 导入子组件
import Home from '../Home'
import HouseList from '../HouseList'
import My from '../My'
import News from '../News'
import NotFound from '../NotFound'

import { TabBar } from 'antd-mobile';

export default class Layout extends Component {
    constructor(props) {
        super()
        this.state = {
            selectedPath: props.location.pathname
        }
    }
    // tabs数组
    TABS = [
        {
            title: "首页",
            icon: "icon-index",
            path: "/layout/index"
        },
        {
            title: "找房",
            icon: "icon-findHouse",
            path: "/layout/houselist"
        },
        {
            title: "资讯",
            icon: "icon-info",
            path: "/layout/news"
        },
        {
            title: "我的",
            icon: "icon-my",
            path: "/layout/my"
        }
    ];
    renderTabBar = () => {
        return (
            <TabBar tintColor="#21B97A" noRenderContent={true}>
                {
                    // 遍历数据生成tab项
                    this.TABS.map(item => {
                        return (
                            <TabBar.Item
                            title={item.title}
                            key={item.path}
                            icon={<i className={`iconfont ${item.icon}`} />}
                            selectedIcon={<i className={`iconfont ${item.icon}`} />}
                            selected={this.state.selectedPath === item.path}
                            onPress={() => {
                                this.setState({
                                    selectedPath: item.path
                                });

                                // 编程式导航切换页面-----之前是通过Link
                                if(this.state.selectedPath !== item.path){
                                    this.props.history.push(item.path)
                                }
                            }}
                        ></TabBar.Item>
                        )
                    })
                }
            </TabBar>
        )
    }

    render() {
        return (
            <div className={styles.layout}>
                {/* 内容部分 */}
                <div>
                    {/* layout的路由是tabbar不会切换 */}
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
                {this.renderTabBar()}
            </div>
        )
    }
}
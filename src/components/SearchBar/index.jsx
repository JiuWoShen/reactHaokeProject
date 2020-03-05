import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'

import { withRouter } from 'react-router-dom'

// import { Link } from 'react-router-dom'

// 拿到上一级的history
function SearchBar ({cityname,history}){
    return (
        <Flex className={styles.root}>
            <Flex className={styles.searchLeft}>
                <div onClick={() => {history.push('/citylist')}} className={styles.location}>
                    {/* 声明式导航 */}
                    {/* <Link to='/citylist'> */}
                        <span>{cityname}</span>
                        <i className='iconfont icon-arrow'></i>
                    {/* </Link> */}
                </div>
                <div className={styles.searchForm}>
                    <i className='iconfont icon-search'></i>
                    <span>请输入小区地址</span>
                </div>
            </Flex>
            <i className='iconfont icon-map'></i>
        </Flex>
    )
}

// 父组件传过来的值校验
SearchBar.propTypes = {
    cityname: PropTypes.string
}

// 高阶组件/函数------ 使不是路由渲染的组件也拥有history等对象
export default withRouter(SearchBar)
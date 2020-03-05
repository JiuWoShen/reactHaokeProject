import React from 'react'
import PropTypes from 'prop-types'
import { NavBar } from 'antd-mobile'
import styles from './index.module.scss'
import {withRouter} from 'react-router-dom'

function MyNavBar({title,history}){
    return (
        <div className={styles.navBar}>
            <NavBar
                mode="light"
                icon={<i className='iconfont icon-back' />}
                onLeftClick={() => history.goBack()}
            >{title}</NavBar>
        </div>
    )
}

// 传值约束
NavBar.protoTypes={
    title:PropTypes.string.isRequired
}

export default withRouter(MyNavBar)
import React,{Component} from 'react'

// 模块化导入
import styles from './index.module.scss'

//  module会将样式的名进行重命名------各个文件的哈希值------解决样式私有
console.log('--------NotFound--------',styles) 

export default class NotFound extends Component{
    render(){
        return (
            <div>
                <img className={ styles.test } src='https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3957922266,335237093&fm=26&gp=0.jpg' alt='404' />
            </div>
        )
    }
}
import React,{Component} from 'react'

// 按需引入
import { Button } from 'antd-mobile'

export default class News extends Component{
    render(){
        return (
            <div>
                <Button type="primary">按钮</Button>
                News
            </div>
        )
    }
}
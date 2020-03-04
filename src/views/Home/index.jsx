import React,{Component} from 'react'

import styles from './index.module.scss'

import { Carousel } from 'antd-mobile';
import {BASE_URL} from '../../utils/utils'

export default class Home extends Component{
    constructor(props) {
        super(props);
        this.state={
            swipers:null//轮播图
        }
    }
    
    // 发请求获取轮播图数据
    componentDidMount(){
        this.getSwipperData()
    }

    getSwipperData=async()=>{
        const result = await this.axios.get('/home/swiper')
        
        if(result.data.status === 200){
            this.setState({
                swipers:result.data.body
            })
        }
    }

    // 渲染轮播图
    renderSwiper=()=>{
        return (
            <Carousel autoplay infinite>
                {this.state.swipers.map(item => (
                    <a
                    key={item.id}
                    href="http://www.alipay.com"
                    style={{ display: 'inline-block', width: '100%', height: 212 }}
                    >
                    <img
                        src={`${BASE_URL}${item.imgSrc}`}
                        alt=""
                        style={{ width: '100%', verticalAlign: 'top' }}
                        onLoad={() => {
                        // fire window resize event to change height
                        // window.dispatchEvent(new Event('resize'));
                        // this.setState({ imgHeight: 'auto' });
                        }}
                    />
                    </a>
                ))}
            </Carousel>
        )
    }

    render(){
        const { swipers } = this.state
        return (
            <div className={styles.root}>
                {/* 渲染轮播图 */}
                {swipers && this.renderSwiper()}
            </div>
        )
    }
}
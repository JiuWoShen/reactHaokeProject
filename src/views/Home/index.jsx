import React,{Component} from 'react'

import styles from './index.module.scss'

import { Flex,Carousel,Grid,WingBlank } from 'antd-mobile';
import {BASE_URL} from '../../utils/utils'
import { Link } from 'react-router-dom'
import { getCurrentCity } from '../../utils/citys.js'

// 导入子组件
import SearchBar from '../../components/SearchBar'

// 导入导航图片
import image1 from '../../assets/images/nav-1.png'
import image2 from '../../assets/images/nav-2.png'
import image3 from '../../assets/images/nav-3.png'
import image4 from '../../assets/images/nav-4.png'

export default class Home extends Component{
    constructor(props) {
        super(props);
        this.state={
            swipers:null, //轮播图
            groups:null, //租房小组
            news:null, //最新资讯
            currentCity:'深圳'
        }
    }

    // 定义实例属性----导航
    navs=[
        {icon:image1,text:'整租',path:'/layout/houselist'},
        {icon:image2,text:'合租',path:'/layout/houselist'},
        {icon:image3,text:'地图找房',path:'/map'},
        {icon:image4,text:'去出租',path:'/rent/add'},
    ]
    
    // 发请求获取数据
    async componentDidMount(){
        // 获取当前城市-----返回到额是Promise对象
        const city =await getCurrentCity()
        // 赋值给模型值
        this.setState({
            currentCity:city.label
        })

        // 轮播图
        this.getSwipperData()
        // 租房小组
        this.getGroupData()
        // 最新资讯
        this.getNewsData()
    }

    getSwipperData=async()=>{
        const result = await this.axios.get('/home/swiper')
        
        if(result.data.status === 200){
            this.setState({
                swipers:result.data.body
            })
        }
    }

    getGroupData=async ()=>{
        const result = await this.axios.get('/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
        
        if(result.data.status === 200){
            this.setState({
                groups:result.data.body
            })
        }
    }

    // 最新资讯数据获取
    getNewsData=async ()=>{
        const result = await this.axios.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
        
        if(result.data.status === 200){
            this.setState({
                news:result.data.body
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

    // 渲染导航
    renderNavs=()=>{
        return (
            <Flex className={styles.nav}>
                {this.navs.map(item=>{
                    return (
                        <Flex.Item key={item.text}>
                            <Link to={item.path}>
                                <img src={item.icon} alt=""/>
                                <p>{item.text}</p>
                            </Link>
                        </Flex.Item>
                    )
                })}
            </Flex>
        )
    }

    // 渲染租房小组
    renderGroup=()=>{
        return (
            <div className={styles.groups}>
                <Flex justify='between'>
                    <Flex.Item style={{fontSize:18,fontWeight:'bold'}}>租房小组</Flex.Item>
                    <Flex.Item align='end'>更多</Flex.Item>
                </Flex>
                <Grid  data={this.state.groups}
                    hasLine={false}
                    square={false}
                    columnNum={2}
                    renderItem={item => (
                        <div className={styles.navItem}>
                            <div className={styles.left}>
                                <p>{item.title}</p>
                                <p>{item.desc}</p>
                            </div>
                            <div className={styles.right}>
                                <img src={`${BASE_URL}${item.imgSrc}`} />
                            </div>
                            <div></div>
                        </div>
                    )}
                    />
                <Grid/>
            </div>
        )
    }

    // 渲染最新资讯
    renderNews=()=>{
        return (
            <div className={styles.news}>
                <h3 className={styles.groupTitle}>最新资讯</h3>
                {/* 两翼留白 */}
                <WingBlank size='md'>
                    {this.state.news.map(item=>{
                        return (
                            <div key={item.id} className={styles.newsItem}>
                                <div className={styles.imgWrap}>
                                    <img alt='' src={`${BASE_URL}${item.imgSrc}`} className={item.img} />
                                </div>
                                <Flex justify='between' className={styles.content} direction='column'>
                                    <h3 className={styles.title}>{item.title}</h3>
                                    <Flex className={styles.info} justify='between'>
                                        <span>{item.from}</span>
                                        <span>{item.date}</span>
                                    </Flex>
                                </Flex>
                            </div>
                        )
                    })}
                </WingBlank>
            </div>
        )
    }

    render(){
        const { swipers,groups,news } = this.state
        return (
            <div className={styles.root}>
                <SearchBar cityname={this.state.currentCity} />
                {/* 渲染轮播图 */}
                {swipers && this.renderSwiper()}
                {/* 渲染导航栏 */}
                {this.renderNavs()}
                {/* 租房小组的渲染 */}
                {groups && this.renderGroup()}
                {/* 最新资讯的渲染 */}
                {news && this.renderNews()}
            </div>
        )
    }
}
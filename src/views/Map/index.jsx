import React,{Component} from 'react'
import styles from './index.module.scss'

import HouseItem from '../../components/HouseItem'
import { Toast } from 'antd-mobile';

// 用来获取当前城市的地址解析
import { getCurrentCity } from '../../utils/citys.js'

import MyNavBar from '../../components/MyNavBar'

const BMap=window.BMap
// 圆形覆盖物的样式：
const labelStyle = {
    cursor: "pointer",
    border: "0px solid rgb(255, 0, 0)",
    padding: "0px",
    whiteSpace: "nowrap",
    fontSize: "12px",
    color: "rgb(255, 255, 255)",
    textAlign: "center"
  }
export default class Map extends Component{
    constructor(){
        super()
        this.state={
            houseList:[],
            isShow:false
        }
    }
    render(){
        return (
            <div className={styles.map}>
                <MyNavBar title='地图找房' />
                {/* 地图容器 */}
                <div id='container'></div>
                {/* 点击三级覆盖物显示房屋列表 */}
                {this.renderHouseList()}
            </div>
        )
    }

    async componentDidMount(){
        const city = await getCurrentCity()
        this.id=city.value
        
        this.initMap(city.label) //传参是为了解析地址
    }

    renderHouseList=()=>{
        return (
            <div className={[styles.houseList,this.state.isShow?styles.show:''].join(' ')}>
                <div className={styles.titleWrap}>
                    <h1 className={styles.listTitle}>房屋列表</h1>
                    <a className={styles.titleMore} href="/layout/houselist">更多房源</a>
                </div>
                <div className={styles.houseItems}>
                   {this.state.houseList.map(item=>{
                      return <HouseItem key={item.houseCode} {...item} />
                   })}
                </div>
            </div>
        )
    }

    // 初始化地图
    initMap=(cityname)=>{
        // 1.创建地图实例-----实例属性---直接赋值给Map实例，方便后面使用
        this.map = new BMap.Map("container")
        // 监听地图是否移动---移动隐藏列表
        this.map.addEventListener('touchstart',()=>{
            this.setState({
                isShow:false
            })
        })
        // // 2.中心点坐标
        // var point = new BMap.Point(116.404, 39.915);
        // // 3.地图展示级别
        // this.map.centerAndZoom(point, 11);  

        // 2.通过地址解析获取地图     
        // 创建地址解析器实例     
        var myGeo = new BMap.Geocoder()     
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(cityname, point=>{      
            if (point) {  
                //  设置中心点和地图展示级别 
                this.map.centerAndZoom(point, 11);   
                // 添加覆盖物的方法   
                this.renderOverlay(this.id);      
            }      
        }, cityname)

        
    }

    /**
     * 根据当前地图的缩放级别--getZoom()获取当前缩放级别    来决定当前渲染什么形状的覆盖物
     * 以及点击后我们要放大的级别
     */
    getTypeAddNextZoom=()=>{
        let type='circle'//默认要渲染的形状
        let nextZoom = 13
        const zoom = this.map.getZoom()

        if(zoom >=10 && zoom <=12){
            type='circle'
            nextZoom = 13
        }else if(zoom >=12 && zoom <=14){
            type='circle'
            nextZoom = 15
        }else if(zoom >14){
            type='rect'
        }
        return { type,nextZoom }
    }

    // 添加覆盖物
    /**
     * 该方法的作用：
     * 发送请求获取数据
     * 根据当前实际情况决定渲染方法（一二级圆形还是三级方形）
     */
    renderOverlay=async id=>{
        Toast.loading('房源加载中。。。')
        // 先获取每个城市的房源信息
        let res =await this.axios.get(`/area/map?id=${id}`)
        Toast.hide()

        // 调用getTypeAddNextZoom获取当前渲染形状及下一个缩放级别
        const {type,nextZoom} = this.getTypeAddNextZoom()

        // 显示一级覆盖物-----有多少城市有房源就显示多少覆盖物
        res.data.body.forEach(item=>{
            if(type === 'circle'){//渲染一二级覆盖物
                this.renderCircleOverlay(item,nextZoom)
            }else{
                this.renderRectOverlay(item)
            }
        })
    }

    // 添加一二级覆盖物
    // 每调用一次方法便创建并添加一个圆形覆盖物到地图上
    /**
     * item是每次渲染一个覆盖物需要的数据
     * nextZoom 13--显示第二级覆盖物  15---显示第三级覆盖物
     */
    renderCircleOverlay=(item,nextZoom)=>{
        // 解构赋值及重命名
        console.log('请求的数据',item,nextZoom)
        const {count,label:name,coord:{longitude,latitude},value} = item

        // 创建坐标点
        var point = new BMap.Point(longitude,latitude)
        // 指定覆盖物所在的坐标点
        var opts = {
            position : point,    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(30, -30)    //设置文本偏移量
        }
        // 创建文本标注对象
        var label = new BMap.Label('', opts)  
        // 设置覆盖物内容
        label.setContent(
            `<div class=${styles.bubble}>
            <p class=${styles.name}>${name}</p>
            <p class=${styles.name}>${count}</p>
            </div>`
        )
        // 设置覆盖物样式
        label.setStyle(labelStyle)
        // 不要忘记把覆盖物添加到地图上
        this.map.addOverlay(label)

        // 给一级覆盖物添加点击事件
        label.addEventListener('click',()=>{
            // 1.先清除一级覆盖物
            setTimeout(()=>{
                this.map.clearOverlays()
            },0)
            // 2.更改地图中心点
            this.map.centerAndZoom(point, nextZoom)

            // 3、根据点击的一级覆盖物的value，去请求一级覆盖物下面二级覆盖物的数据
            // 点击二级覆盖物，请求下面的三级覆盖物的数据
            this.renderOverlay(value)
        })
    }

    // 添加三级方形覆盖物
    /**
     * item是每次渲染一个覆盖物需要的数据
     */
    renderRectOverlay=(item)=>{
        const {count,label:name,coord:{longitude,latitude},value} = item
        var point = new BMap.Point(longitude,latitude)
        var opts = {
            position : point,    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(-50, -20)    //设置文本偏移量
        }
        // 创建文本标注对象
        var label = new BMap.Label('', opts)  
        // 设置覆盖物内容
        label.setContent(
            `<div class=${styles.rect}>
            <span class=${styles.housename}>${name}</span>
            <span class=${styles.housenum}>${count}</span>
            <i class=${styles.arrow}></i>
          </div>`
        )
        // 设置覆盖物样式
        label.setStyle(labelStyle)
        // 不要忘记把覆盖物添加到地图上
        this.map.addOverlay(label)

        // 点击事件-----将该点移至中心并且显示房屋列表
        label.addEventListener('click',e=>{
            console.log(e.changedTouches)
            const { clientX,clientY } = e.changedTouches[0]
            const PanX = window.screen.width/2 - clientX
            const PanY = window.screen.height/2 - clientY - 330/2
            this.map.panBy(PanX,PanY)

            this.fetchHouseListData(value)
        })
    }
    // 点击三级覆盖物获取房源数据
    fetchHouseListData=async(id)=>{
        Toast.loading('查询房源中...')
        const house = await this.axios.get(`/houses?cityId=${id}`)
        console.log(house)
        Toast.hide()

        this.setState({
            isShow:true,
            houseList:house.data.body.list
        })
    }
}
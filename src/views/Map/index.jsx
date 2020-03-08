import React,{Component} from 'react'
import styles from './index.module.scss'

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
    render(){
        return (
            <div className={styles.map}>
                <MyNavBar title='地图找房' />
                {/* 地图容器 */}
                <div id='container'></div>
            </div>
        )
    }

    async componentDidMount(){
        const city = await getCurrentCity()
        this.id=city.value

        this.initMap(city.label)
    }

    // 初始化地图
    initMap=(cityname)=>{
        // 1.创建地图实例-----实例属性---直接赋值给Map实例，方便后面使用
        this.map = new BMap.Map("container")
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
                this.addOverlay(this.id);      
            }      
        }, cityname)
    }
    // 添加覆盖物
    addOverlay=async id=>{
        // 先获取每个城市的房源信息
        let res =await this.axios.get(`/area/map?id=${id}`)
        // console.log(res.data.body)
        // 显示一级覆盖物-----有多少城市有房源就显示多少覆盖物
        res.data.body.forEach(item=>{
            // 解构赋值及重命名
            const {count,label:name,coord:{longitude,latitude}} = item

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
        })
    }
}
import React, { Component } from 'react';
import MyNavBar from '../../components/MyNavBar'
import styles from './index.module.scss'
// 导入长列表渲染数据
import {AutoSizer, List} from 'react-virtualized'

import { getCurrentCity } from '../../utils/citys'

// 标题的高度
const TITLEHEIGHT = 36
// 每一行的高度
const ROWHEIGHT = 50

class CityList extends Component {
    constructor(){
        super()
        this.state={
            cityListObj:null,  // 左边城市列表对象
            cityIndexList:null  // 右边索引
        }
    }

    componentDidMount(){
        // 获取城市数据
        this.getCityData()
    }

    getCityData=async()=>{
        const result=await this.axios.get('/area/city?level=1')

        console.log(result.data.body)
        
        // 处理数据
        this.dealWithCity(result.data.body)
    }

    // 处理城市列表数据
    dealWithCity=async cityList=>{
        // 升维后的城市数据数组
        const tempObj = {}
        cityList.forEach(city => {
            const letter = city.short.substr(0,1)

            // 数组升维-----往对象里按照字母添加数据
            if(tempObj[letter]){
                tempObj[letter].push(city)
            }else{
                tempObj[letter]=[city]
            }
        });
        // console.log('tempObj',tempObj)
        // 对数组进行排序------按字母顺序排序后的数据数组
        const tempIndexList = Object.keys(tempObj).sort()
        // console.log(tempIndexList)

        // 2.处理热门城市数据
        const result=await this.axios('/area/hot')
        console.log('热门城市',result)
        tempObj['hot']=result.data.body
        // 向数组开始位置添加数据
        tempIndexList.unshift('hot')

        // 3.处理定位城市-----并且添加到城市数据
        const currentCity=await getCurrentCity()
        tempObj["#"]=[currentCity]
        tempIndexList.unshift("#")


        // 将处理后的数据赋值给模型
        this.setState({
            cityListObj:tempObj,
            cityIndexList:tempIndexList
        })
    }

    // 动态计算每单位行的高度
    calRowHeight=({index})=>{
        const letter = this.state.cityIndexList[index];
        const list = this.state.cityListObj[letter];

        return TITLEHEIGHT + list.length * ROWHEIGHT
    }

    // 格式化标题数据
    formatTitle=letter=>{
        switch (letter) {
            case '#':
                return '定位城市'
            case 'hot':
                return '热门城市'
            default:
                return letter.toUpperCase()
        }
    }

    // 单位行数据的渲染
    rowRenderer=({key, index, style}) => {
        const letter = this.state.cityIndexList[index]
        const list = this.state.cityListObj[letter]

        return (
        // 通过style来实现复用
          <div key={key} style={style} className={styles.city}>
            {/* 渲染标题----通过索引数据 */}
            <div className={styles.title}>{this.formatTitle(letter)}</div>
            {
                // 渲染城市列表
                list.map(item=>{
                    return <div className={styles.name} key={item.value}>{item.label}</div>
                })
            }
          </div>
        );
    }

    render() {
        const { cityListObj,cityIndexList }=this.state
        return (
            <div className={styles.citylist}>
                <MyNavBar title='城市选择' />
                {/* 渲染列表 */}
                {cityListObj && <AutoSizer>
                    {({height, width}) => (
                    <List
                        height={height}
                        // 渲染多少行
                        rowCount={cityIndexList.length}
                        // 每行高度----可以是个方法
                        rowHeight={this.calRowHeight}
                        // 行数据的渲染
                        rowRenderer={this.rowRenderer}
                        width={width}
                    />
                    )}
                </AutoSizer>}
            </div>
        );
    }
}

export default CityList;
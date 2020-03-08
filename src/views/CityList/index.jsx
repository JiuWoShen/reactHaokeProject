import React, { Component, createRef } from 'react';
import MyNavBar from '../../components/MyNavBar'
import styles from './index.module.scss'
// 导入长列表渲染数据
import {AutoSizer, List} from 'react-virtualized'

import { getCurrentCity } from '../../utils/citys'
import { Toast } from 'antd-mobile'

import {setCity} from '../../utils/citys.js'

// 标题的高度
const TITLEHEIGHT = 36
// 每一行的高度
const ROWHEIGHT = 50
// 有房源的城市
const HASRESOURCECITYS = ["北京", "上海", "广州", "深圳"]

class CityList extends Component {
    // 创建一个能够取到LIst对象的ref
    ListRef = React.createRef()

    constructor(){
        super()
        this.state={
            cityListObj:null,  // 左边城市列表对象
            cityIndexList:null,  // 右边索引
            selectIndex:0  //右边默认选中索引
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

    // 点击切换定位城市
    toggleCity=({label,value})=>{
        if(HASRESOURCECITYS.includes(label)){//有房源的城市
            // 将城市保存至本地
            setCity({label,value})
            // 返回到首页
            this.props.history.goBack()

        }else{//无房源的城市
            Toast.info('该城市目前无房源哦~', 1);
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
                    {/* 点击切换定位城市 */}
                    return <div onClick={()=>this.toggleCity(item)} className={styles.name} key={item.value}>{item.label}</div>
                })
            }
          </div>
        );
    }

    // 右边城市索引的渲染
    renderCityIndexList=()=>{
        const { cityIndexList,selectIndex} = this.state
        return (
            <div className={styles.cityIndex}>
                {cityIndexList.map((item,index)=>{
                    return (
                        <div key={item} className={styles.cityIndexItem}>
                            <span onClick={()=>this.cliskIndexList(index)} className={index===selectIndex?styles.indexActive:''}>
                                {item==='hot'?'热': item.toUpperCase()}
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    // 点击索引左边联动滚动
    cliskIndexList=(index)=>{
        // console.log(index)
        // 首先得拿到List,然后使用List滚动方法
        // console.log(this.ListRef.current)
        this.ListRef.current.scrollToRow(index)
    }

    //  左边滚动右边联动高亮
    onRowsRendered=({startIndex})=>{
        // console.log(startIndex)
        if(this.state.selectIndex!==startIndex){
            // console.log(startIndex)
            this.setState({
                selectIndex:startIndex
            })
        }
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
                        ref={this.ListRef}
                        height={height}
                        // 渲染多少行
                        rowCount={cityIndexList.length}
                        // 每行高度----可以是个方法
                        rowHeight={this.calRowHeight}
                        // 行数据的渲染---可以是数据也可以是方法
                        rowRenderer={this.rowRenderer}
                        width={width}
                        onRowsRendered={this.onRowsRendered}
                        scrollToAlignment='start'//滚动的对齐方式不对
                    />
                    )}
                </AutoSizer>}
                {/* 右边城市索引的渲染 */}
                { cityIndexList && this.renderCityIndexList() }
            </div>
        );
    }
}

export default CityList;
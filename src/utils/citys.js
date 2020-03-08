// 只有组件中才可以通过this.axios发送请求
import { axios } from './axios'

const getCity=()=>{
    return window.localStorage.getItem('my_city')
}

/**
 * 保存city到本地
 */
const setCity=city=>{
    window.localStorage.setItem('my_city',JSON.stringify(city))
}

/**
 * 获取定位城市
 */
// ------react中不可以直接放文window下的属性
const BMap=window.BMap

// 返回一个Promise对象
const getCurrentCity=()=>{
    const city=getCity()
    if(city){//缓存中有
        return Promise.resolve(JSON.parse(city))
    }else{
        return new Promise((resolve,reject)=>{
            //缓存中没有
            // 1.利用百度地图定位API获取经纬度和城市名
            var myCity = new BMap.LocalCity()
            myCity.get(async result=>{
                console.log(result)
                // 2.利用城市名调用后台接口，获取到城市对象信息（对象中的value主要是用来发送请求的）
                const res =await axios.get(`/area/info?name=${result.name}`)
                console.log('获取的城市信息',res)
                // 3.缓存到本地
                setCity(res.data.body)

                // 4.resolve吧结果返回出去
                resolve(res.data.body)
            })
        })
    }
}

export { getCurrentCity,setCity }
import axios from 'axios'
// 将axios挂在到Component上这样每个组件都通过继承以this.axios的形式访问
import {Component} from 'react'
import { BASE_URL } from './utils'

axios.defaults.baseURL = BASE_URL
// axios.defaults.baseURL = 'http://183.237.67.218:3001'

// 将axios实例挂在到component原型上
Component.prototype.axios = axios

export { axios } 
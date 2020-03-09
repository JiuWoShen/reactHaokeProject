import React from 'react'
import styles from './index.module.scss'
import { BASE_URL } from '../../utils/utils.js'

function HouseItem({desc,houseCode,houseImg,title,price,tags}){
    return (
        <div className={styles.house}>
            <div className={styles.imgWrap}>
                <img className={styles.img} src={`${BASE_URL}${houseImg}`} alt=""/>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.desc}>{desc}</div>
                <div>
                    {
                        tags.map((item,index)=>{
                            const tagName = `tag${(index+1)}`
                            return <span key={item} className={[styles.tag,styles[tagName]].join(' ')}>{item}</span>
                        })
                    }
                </div>
                <div className={styles.price}>
                    <span className={styles.priceNum}>{price}</span>元/月
                </div>
            </div>
        </div>
    )
}

export default HouseItem
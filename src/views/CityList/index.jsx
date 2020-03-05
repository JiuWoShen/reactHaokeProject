import React, { Component } from 'react';
import MyNavBar from '../../components/MyNavBar'
import styles from './index.module.scss'

class CityList extends Component {
    render() {
        return (
            <div className={styles.citylist}>
                <MyNavBar title='城市选择' />
            </div>
        );
    }
}

export default CityList;
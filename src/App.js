import React, {Component} from 'react';
import BHSelector from './selector/bh_selector.js';
import './App.css';
import datas from './city.json';

class App extends Component {

    selectorCallback(indexes) {
        console.log(indexes);
    }

    // 转换成selector需要的数据格式
    _getProvinces() {
        let provinces = [];
        for (let i=0; i<datas.length; i++) {
            let cities = [];
            let provice = datas[i];
            for (let j=0; j<provice.city.length; j++) {
                let city = provice.city[j];
                let areas = [];
                for (let x=0; x<city.area.length; x++) {
                    let area = city.area[x];
                    areas.push({text: area});
                }
                cities.push({
                    datas: areas,
                    text: city.name
                });
            }
            provinces.push({
                datas: cities,
                text: provice.name
            });
        }

        return provinces;
    }

    render() {
        return (
            <div className="App">
                <div className='selectorContainer'>
                    <BHSelector itemCount={3}
                                datas={this._getProvinces()}
                                handler={this.selectorCallback.bind(this)} />
                </div>
            </div>
        );
    }
}

export default App;

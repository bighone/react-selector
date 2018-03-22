
import React, { Component } from 'react';
import './bh_selector.css';
import IScroll from "../vendor/iscroll";

const bh_item_name = "bh_selector_item";
const bh_cell_height = 37;
const bh_item_null = "未设置";

// iScroll，用来常亮滚动条，如无此需求，可移除
var _myScroll;

// 如果项目配合FastClick使用，iOS手机会出现双击才会有效的问题，需将以下注释掉的代码放出来
function iScrollClick(){
    return true;
    // if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    // if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    // if (/Silk/i.test(navigator.userAgent)) return false;
    // if (/Android/i.test(navigator.userAgent))
    // {
    //     var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
    //     return parseFloat(s[0]+s[3]) < 44 ? false : true
    // }
    // return false;
}

class BHSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: []
        };

        this.handlerItemClick = this.handlerItemClick.bind(this);
        this.handlerShadowClick = this.handlerShadowClick.bind(this);
        this._configItems();
    }

    componentDidMount() {
        this._reloadDatas(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this._reloadDatas(nextProps);
    }

    componentDidUpdate() {
        // 清理掉，在需要的时候再加
        if(_myScroll) {
            _myScroll.destroy();
            _myScroll = null;
        }

        let wrapper = document.getElementById('wrapper');
        if (wrapper) {
            let isClick = iScrollClick();
            _myScroll = new IScroll('#wrapper', {
                mouseWheel: true,
                scrollbars: true,
                //滚动时显示滚动条，默认影藏，并且是淡出淡入效果
                // 需要常亮，设为false即可
                // fadeScrollbars: true,
                tap: isClick,
                click: isClick,
            });

            // 滚动到选择的cell位置
            let tableH = window.innerHeight / 2.0;
            let offset = 0;
            this.state.items.forEach(item => {
                if (item.isOpen) {
                    let totalH = _myScroll.maxScrollY * -1;
                    let v = item.sindex * bh_cell_height;
                    if (v > tableH / 2) {
                        v = v - tableH/2;
                        let r = v > totalH ? totalH : v;
                        offset = r * -1;
                    }
                }
            });
            _myScroll.scrollTo(0, offset, 500, IScroll.utils.ease.back);
        }
    }

    // 点击事件
    handlerItemClick(e) {
        let item = this._getSelectorItem(e);
        if (!item) return;
        if (item.isOpen) {
            this._closeSelectorItem(item);
        } else {
            this._openSelectorItem(item);
        }
    }

    handlerShadowClick() {
        this._closeAllSelectorItems();
    }

    handlerCellClick(t, e) {
        t.sindex = parseInt(e.target.id, 10);
        // 把下面的索引更新为0
        let item = t.nextItem;
        while (item) {
            item.sindex = 0;
            item = item.nextItem;
        }

        this._selectSelectorItem(t);

        // 避免穿透，在穿透的地方做判断即可
        document.prevent = true;
        setTimeout(() => {
            document.prevent = false;
        }, 100);
    }

    _configItems() {
        let {itemCount} = this.props;

        let lastItem = null;
        for (let i = 0; i < itemCount; i++) {
            let selectorItem = {
                isOpen: false,
                sindex: 0,
                datas: [],
                lastItem: lastItem,
                nextItem: null,
                text: '',
                id: bh_item_name + i,
                tag: i
            };

            this.state.items.push(selectorItem);
            lastItem = selectorItem;
        }

        for (let i = 0; i < itemCount; i++) {
            let selectorItem = this.state.items[i];
            selectorItem.nextItem = this.state.items[i + 1];
        }
    }

    _updateState() {
        this.setState({
            items: this.state.items
        });
    }

    _openSelectorItem(t) {
        if (!t.datas || t.datas.length === 0) return;

        this.state.items.forEach(item => {
            if (item.id !== t.id) {
                this._closeSelectorItem(item);
            } else {
                item.isOpen = true;
            }
        });

        this._updateState();
    }

    _closeSelectorItem(t) {
        if (!t.isOpen) return;
        t.isOpen = false;
        this._updateState();
    }

    _closeAllSelectorItems() {
        this.state.items.forEach(item => {
            item.isOpen = false;
        });
        this._updateState();
    }

    // 加载数据
    _reloadDatas(props) {
        this._closeAllSelectorItems();
        let {datas, indexes} = props;
        if (datas.length === 0) return;

        this.state.items.forEach((item, index) => {
            item.sindex = indexes[index] || 0;
        })
        let firItem = this.state.items[0];
        firItem.datas = datas;
        this._selectSelectorItem(firItem);
    }

    _getSelectorItem(e) {
        let id = e.target.id;
        for (let i = 0; i < this.state.items.length; i++) {
            let t = this.state.items[i];
            if (t.id === id) {
                return t;
            }
        }
        return null;
    }

    _getSelectorIndexes() {
        var indexes = [];
        for (var i = 0; i < this.state.items.length; i++) {
            var item = this.state.items[i];
            indexes.push(parseInt(item.sindex, 10));
        }
        return indexes;
    }

    _recursionSelectItem(t) {
        if (!t.nextItem) {
            this._updateState();
            return;
        }

        if (t.datas && t.datas.length > 0) {
            let info = t.datas[t.sindex];
            t.nextItem.datas = info.datas;
        }

        if (t.nextItem.datas && t.nextItem.datas.length > 0) {
            let curInfo = t.nextItem.datas[t.nextItem.sindex];
            t.nextItem.text = curInfo.text;
        } else {
            t.nextItem.text = '';
        }
        this._recursionSelectItem(t.nextItem);
    }

    _selectSelectorItem(t) {
        let info = t.datas[t.sindex];
        t.text = info.text;
        this._recursionSelectItem(t);
        this._closeSelectorItem(t);
        this.props.handler(this._getSelectorIndexes());
    }

    _getItemElements() {
        let {itemCount} = this.props;
        let items = this.state.items;
        let itemElements = [];
        for (let i = 0; i < itemCount; i++) {
            let item = items[i];
            let id = bh_item_name + i;
            let bhline = i !== itemCount - 1 ? ' bh_selector_line' : '';
            let hide = item.text.length > 0 ? '' : ' bh_hide';
            let itemW = 100 / this.props.itemCount + '%';
            let ele = (<div key={id} id={id}
                            className={'bh_selector_box' + bhline}
                            style={{maxWidth: itemW}}
                            onClick={this.handlerItemClick}>
                <div className={'text ' + (item.isOpen ? 'bh_select' : 'bh_normal')}>{item.text || bh_item_null}</div>
                <div className={'triangle ' + (item.isOpen ? 'up' : 'down') + hide}/>
            </div>)
            itemElements.push(ele);
        }
        return itemElements;
    }

    _getTableElement(t) {
        let selector = this.refs.selector;
        let rect = selector.getBoundingClientRect();
        let y = rect.bottom + 'px';
        let w = rect.width;
        let width = w / this.props.itemCount + 'px';
        let marginLeft = w / this.props.itemCount * t.tag + 'px';

        let shadow = <div className="bh_selector_shadow" style={{marginTop: y}}
                          onClick={this.handlerShadowClick}
                          onTouchMove={(e)=> {e.preventDefault();}} />;

        let tableHeight = (t.datas.length * bh_cell_height + 1) + 'px';
        let cellHeight =  bh_cell_height + 'px';
        let list = t.datas.map((item, index) => {
            return (<li id={index}
                        key={index}
                        style={{height: cellHeight, lineHeight: cellHeight}}
                        className={'cell ' + (index === t.sindex ? 'bh_select' : 'bh_normal')}
                        onClick={this.handlerCellClick.bind(this, t)}
            >{item.text}</li>)
        });
        let table = (<div id="wrapper" className="bh_selector_table"
                          style={{width: width, height: tableHeight,
                              marginTop: y, marginLeft: marginLeft}}>
            <ul>{list}</ul>
        </div>);
        return [shadow, table];
    }

    render() {
        let itemElements = this._getItemElements();

        let tableElements = null;
        this.state.items.forEach(item => {
            if (item.isOpen) {
                tableElements = this._getTableElement(item);
            }
        })

        return (
            <div ref='selector' className='bh_selector'>
                {itemElements}
                {tableElements && tableElements[0]}
                {tableElements && tableElements[1]}
            </div>
        );
    }
}

BHSelector.defaultProps = {
    itemCount: 2,
    datas: [],
    indexes: [0, 0],
    handler: null
}

export default BHSelector;
# react-selector
基于移动webapp，制作的一款下拉联动选择器。

### 效果图

![](screenshots/1.png)

### Demo运行步骤

```
git clone https://github.com/bighone/react-selector
cd react-selector
npm install
npm start
```

### API

| 属性 | 类型 | 默认值 | 描述 |
| :-------------: |:-------------:| :-----:| :-----: |
| itemCount | Number | 2| 总共有多少列，默认两列 |
| datas | Array | [] | 联动数据，数据格式固定[{text: 'aaa', datas:[{text: 'bbb', datas: ...}]}, {text: 'ccc', datas:[{text: 'ddd', datas: ...}]}] |
| indexes | Array | [0, 0] | 初始选择的位置，如果越界，索引自动设置为0 |
| handler | Function | 无 | 选择后的回调，返回一个indexes索引集合，例如 [0,1,5] |

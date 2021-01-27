# miniprogram-asyncdata
小程序异步数据

## 使用场景
app.js与页面间或者页面与页面间异步数据的传递，使用getState可以确保获取到准确的数据

## 使用

```javascript
// app.js
import AsyncData from 'miniprogram-asyncdata'

App({
  onLaunch() {
    // 异步赋值
    this.store.setState('A', new Promise((resolve) => {
      setTimeout(() => {
        resolve(8)
      }, 5000);
    }))
    // 函数返回
    this.store.setState('B', () => {
      return 9 + 9 + 8
    })
    // 直接赋值
    this.store.setState('C', 9999)
  },
  store: new AsyncData({
    A: 1,
    B: 2,
    C: 3,
    D: 4
  })
})

// index.js
const app = getApp()
Page({
  data: {},
  async onLoad() {
  	// 取值
  	const A = await app.store.getState('A')
    console.log(A)
    const B = await app.store.getState('B')
    console.log(B)
    // 批量取值
    const {A,B,C,D} = await app.store.stateMap(['A', 'B', 'C', 'D'])
    console.log(A,B,C,D)
  },
})
```
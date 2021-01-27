/*
 * @Author: rkm
 * @Date: 2021-01-27 11:52:30
 * @LastEditTime: 2021-01-27 11:52:46
 * @FilePath: \miniprogram-asyncdata\index.js
 * @LastEditors: rkm
 */
class AsyncData {
    constructor(state = {}) {
        this.state = state
        this._stateStatus = {}
        this._resolveList = {}
        this.init()
    }
    init() {
        Object.keys(this.state).map(key => {
            this._stateStatus[key] = {
                _s: 1
            }
            this._resolveList[key] = []
        })
    }
    _getStatus(name) {
        return this._stateStatus[name]._s
    }
    _setStatus(name, status) {
        this._stateStatus[name]._s = status
    }
    setState(name, handle) {
        this._setStatus(name, 0)
        return new Promise(async (resolve) => {
            if (handle instanceof Promise) {
                this.state[name] = await handle
            } else if (handle instanceof Function) {
                this.state[name] = handle()
            } else {
                this.state[name] = handle
            }
            this._setStatus(name, 1)
            this._resolveList[name].map(othorResolve => {
                othorResolve(this.state[name])
            })
            resolve(this.state[name])
        })
    }
    getState(name) {
        return new Promise(async (resolve) => {
            if (this._getStatus(name)) {
                resolve(this.state[name])
            } else {
                this._resolveList[name].push(resolve)
            }
        })
    }
    async stateMap(mapList) {
        let list = mapList.map(name => {
            return this.getState(name)
        })
        const valList = await Promise.all(list)
        let res = {}
        mapList.map((name, idx) => {
            res[name] = valList[idx]
        })
        return res
    }
}
export default AsyncData  
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    btnNext:cc.Node = null
    // LIFE-CYCLE CALLBACKS:

    private _curIndex = 4
    onLoad() {
        this.btnNext.on(cc.Node.EventType.TOUCH_END,this.next,this)

    }

    start () {

    }
    next() {
        this.node.getChildByName("shader"+this._curIndex).active =false
        this._curIndex++
        if (this._curIndex > 10) {
            this._curIndex =1
        }
        this.node.getChildByName("shader"+this._curIndex).active =true
    }
    // update (dt) {}
}

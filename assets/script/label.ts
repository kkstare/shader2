// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

 
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getComponent(cc.Label).getMaterial(0).setProperty("rows", Math.floor( this.node.height / this.node.getComponent(cc.Label).lineHeight )  )
        this.node.getComponent(cc.Label).getMaterial(0).setProperty("width", Math.floor( this.node.width  ) )
    }

    start () {
        

    }

    beginTextRun(){
        this.node.getComponent(cc.Label).getMaterial(0).setProperty("isBegin", true  )
        this.node.getComponent(cc.Label).getMaterial(0).setProperty("beginTime", cc.director.getTotalTime()  )
    }

    // update (dt) {}
}

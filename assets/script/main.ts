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
    bg:cc.Node = null

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        // console.log(this.node.getContentSize())
        let size = this.node.getContentSize()
        console.log(size)
        this.bg.getComponent(cc.Sprite).getMaterial(0).setProperty("size", size.width,size.height)
        
        this.bg.on(cc.Node.EventType.TOUCH_START,(event)=>{
            console.log(event.getLocation())
        })
    }

    start () {

    }

    // update (dt) {}
}

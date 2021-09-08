// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    private beginPos;
    private curPos;

  
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.on(cc.Node.EventType.TOUCH_START,(Event)=>{
        //     // console.log(Event.getLocation())
        //     this.beginPos = this.node.convertToNodeSpaceAR(Event.getLocation())
        // })

        // this.node.on(cc.Node.EventType.TOUCH_MOVE,(Event)=>{
        //     this.curPos = this.node.convertToNodeSpaceAR(Event.getLocation())
        //     this.reRender()
        // })

    }
    reRender(){
        let dex = this.curPos.x - this.beginPos.x
        let dey = this.curPos.y - this.beginPos.y
        console.log(dex,dey)
        
        if(dex < 0 && dey > 0 ){
        //   console.log( Math.atan( Math.abs(dey/dex) ) )
            let angle =  90-(180*Math.atan( Math.abs(dey/dex))/3.141592654 )
            let distance = Math.sqrt( dex*dex+dey*dey ) / 700
            console.log(angle,distance)
            
            if(distance>0.5){
                distance = 0.5
            }
            if(angle<=45){
                angle = 45.001
            }
            if(angle>=90){
                angle = 90
            }

            this.node.getComponent(cc.Sprite).getMaterial(0).setProperty("length",distance)

            this.node.getComponent(cc.Sprite).getMaterial(0).setProperty("angle",angle)
        }else{
            console.log("只支持向下翻页")
        }
    }
    start () {
        let a = {name:1,funa:this.test1}
        console.log("start")

        a.funa(666,()=>{
            console.log(this)
        })
        
    }
    test1(A,cb ){
        
    }
    test2(a,b,c){

    }

    // update (dt) {}
}

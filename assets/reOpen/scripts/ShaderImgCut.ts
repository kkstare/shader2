// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


// export const E_ImgCutType = cc.Enum({
//     circle,
//     rect,
// })

var E_ImgCutType = cc.Enum({
    无: - 1,
    圆形: -1,
    矩形: -1
});

enum E_CutType {
    圆形 = 0.5,
    矩形 = 1.5,
}

@ccclass
export default class ShaderImgCut extends cc.Component {


    private _cutType = E_ImgCutType.圆形;
    private _isCut: Boolean = true;
    private _radio: number = 0.5;



    @property({ type: Boolean })
    public get isCut(): Boolean {
        return this._isCut;
    }
    public set isCut(value: Boolean) {
        if (value == false) {
            this.cutType = E_ImgCutType.无
        }
        this._isCut = value;
    }

    @property({ type: cc.Enum(E_ImgCutType), visible() { return this.isCut == true } })
    public get cutType() {
        return this._cutType;
    }
    public set cutType(value) {
        this._cutType = value;
        this.reSetValue()
    }


    @property({ type: Number, visible() { return this.cutType == E_ImgCutType.圆形 } })
    public get radio(): number {
        return this._radio;
    }
    public set radio(value: number) {
        this._radio = value;
        this.reSetValue()
    }


    @property({ type: cc.v2, visible() { return this.cutType == E_ImgCutType.矩形 } })
    size = cc.v2(0, 0)


    reSetIsCut() {
        this.node.getComponent(cc.Sprite).getMaterial(0).setProperty
    }

    reSetValue() {
        this.node.getComponent(cc.Sprite).getMaterial(0).setProperty("cutType", E_CutType.圆形)
        if (this.cutType == E_ImgCutType.圆形) {
            this.node.getComponent(cc.Sprite).getMaterial(0).setProperty("cutType", E_CutType.圆形)
            this.node.getComponent(cc.Sprite).getMaterial(0).setProperty("cutRadio", this.radio)

        } else if (this.cutType == E_ImgCutType.矩形) {
            this.node.getComponent(cc.Sprite).getMaterial(0).setProperty("cutType", E_CutType.矩形)
        }

    }

    start() {

    }

    // update (dt) {}
}

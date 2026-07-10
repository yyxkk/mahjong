import {    
    _decorator,
    Component,
    Node,
    Vec2,
    EventTouch,
    sp,
    Label,
    Slider} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Touch')
export class Touch extends Component {
 
    private startPos = new Vec2();

    currentProgress = 0;

    private logicTime = 0;

    private maxLogicTime = 0.6;     // 以工具动画长度作为玩家可控制时间

// 最大推动距离
    private maxDistance = 2000;

// 当前是否正在操作
    private touching = false;

    private playback = false;

    private playbackSpeed = 1;

    @property (sp.Skeleton)
    public toolSpine:sp.Skeleton = null;
    private toolEntry: sp.spine.TrackEntry = null!;
    @property (sp.Skeleton)
    public pimpleSpine:sp.Skeleton = null;
    private pimpleEntry: sp.spine.TrackEntry = null!;

    private pimpleAnimationName = "pop";
    private toolAnimationName = "pop";

    private toolAnimationDuration = 0;
    private pimpleAnimationDuration = 0;

    private inputProgress = 0;

    private animationProgress = 0;

    @property(Label)
    private progressLabel:Label = null!;

    private isFail = false;

    @property(Label)
    private failLabel:Label = null!;
    @property(Slider)
    failSlider: Slider = null!;
    private tierFail = 0.2;

    @property(Label)
    private perfectLabel:Label = null!;
    @property(Slider)
    perfectSlider: Slider = null!;
    private tierPerfect = 0.18;

    @property(Label)
    private goodLabel:Label = null!;
    @property(Slider)
    goodSlider: Slider = null!;
    private tierGood = 0.16;

    @property(Label)
    private okayLabel:Label = null!;
    @property(Slider)
    okaySlider: Slider = null!;
    private tierOkay = 0.14;

    @property(Label)
    private pimpleDurationLabel:Label = null!;

    start()
    {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.toolEntry = this.toolSpine.setAnimation(0, this.toolAnimationName, false);
        this.pimpleEntry = this.pimpleSpine.setAnimation(0, this.pimpleAnimationName, false);

        this.toolEntry.timeScale = 0;
        this.pimpleEntry.timeScale = 0;

        this.toolAnimationDuration = this.toolEntry.animationEnd;
        this.pimpleAnimationDuration = this.pimpleEntry.animationEnd;

        this.maxLogicTime = this.pimpleAnimationDuration;
        this.pimpleDurationLabel.string = this.maxLogicTime.toFixed(2);

        this.failSlider.progress = this.tierFail;
        this.perfectSlider.progress = this.tierPerfect;
        this.goodSlider.progress = this.tierGood;
        this.okaySlider.progress = this.tierOkay;

        this.failSlider.node.on('slide', this.onFailSliderChanged, this);
        this.perfectSlider.node.on('slide', this.onPerfectSliderChanged, this);
        this.goodSlider.node.on('slide', this.onGoodSliderChanged, this);
        this.okaySlider.node.on('slide', this.onOkaySliderChanged, this);

        this.failLabel.string = this.tierFail.toFixed(2);
        this.perfectLabel.string = this.tierPerfect.toFixed(2);
        this.goodLabel.string = this.tierGood.toFixed(2);
        this.okayLabel.string = this.tierOkay.toFixed(2);
    }

    private onFailSliderChanged(slider: Slider)
    {
        this.tierFail = slider.progress;

        this.updateFailLabel();
    }

    private updateFailLabel()
    {
        this.failLabel.string =
            this.tierFail.toFixed(2);
    }

    private onPerfectSliderChanged(slider: Slider)
    {
        this.tierPerfect = slider.progress;

        this.updatePerfectLabel();
    }

    private updatePerfectLabel()
    {
        this.perfectLabel.string =
            this.tierPerfect.toFixed(2);
    }

    private onGoodSliderChanged(slider: Slider)
    {
        this.tierGood = slider.progress;

        this.updateGoodLabel();
    }

    private updateGoodLabel()
    {
        this.goodLabel.string =
            this.tierGood.toFixed(2);
    }

    private onOkaySliderChanged(slider: Slider)
    {
        this.tierOkay = slider.progress;

        this.updateOkayLabel();
    }

    private updateOkayLabel()
    {
        this.okayLabel.string =
            this.tierOkay.toFixed(2);
    }

    onTouchStart(event: EventTouch)
    {
        this.touching = true;

        this.startPos = event.getUILocation();

        this.isFail = false;

        // ⭐关键：重新锁回手动控制模式
        this.toolEntry.timeScale = 0;
        this.pimpleEntry.timeScale = 0;

        this.currentProgress = 0;

        // 重置动画到初始帧
        this.updateSpine(0, this.toolSpine, this.toolEntry, this.toolAnimationDuration);
        this.updateSpine(0, this.pimpleSpine, this.pimpleEntry, this.pimpleAnimationDuration);
    }

    onTouchMove(event: EventTouch)
    {
        if(!this.touching || this.isFail)
            return;

        const pos = event.getUILocation();

        let delta = pos.y - this.startPos.y;

        delta = Math.max(0, delta);

        this.currentProgress = delta / this.maxDistance;

        this.currentProgress = Math.min(this.currentProgress, 1);

        this.updateSpine(this.currentProgress,this.toolSpine,this.toolEntry,this.toolAnimationDuration);
        this.updateSpine(this.currentProgress,this.pimpleSpine,this.pimpleEntry,this.pimpleAnimationDuration);

        if(this.currentProgress >= this.tierFail)
        {
            this.playFail();

            return;
        }

        this.updateDebug();
    }

    private onTouchEnd(event: EventTouch)
    {
        this.touching = false;

        if(this.currentProgress < this.tierOkay)
        {
            this.playback = true;
            console.log("取消");
        }
        else if(this.currentProgress < this.tierGood)
        {
            this.playForward(this.pimpleEntry);
            this.playForward(this.toolEntry);
            console.log("第三档");
        }
        else if(this.currentProgress < this.tierPerfect)
        {
            this.playForward(this.pimpleEntry);
            this.playForward(this.toolEntry);
            console.log("第二档");
        }
        else if(this.currentProgress < this.tierFail)
        {
            this.playForward(this.pimpleEntry);
            this.playForward(this.toolEntry);
            console.log("第一档");
        }
    }

    update(dt:number)
    {
        if(this.playback)
        {
            this.currentProgress -= dt * this.playbackSpeed;

            if(this.currentProgress <=0)
            {
                this.currentProgress=0;

                this.playback=false;
            }

            this.updateSpine(this.currentProgress,this.toolSpine,this.toolEntry,this.maxLogicTime);
            this.updateSpine(this.currentProgress,this.pimpleSpine,this.pimpleEntry,this.maxLogicTime)
        }
    }

    private updateSpine(progress: number,skeleton: sp.Skeleton,entry : sp.spine.TrackEntry,animationDuration: any)
    {
        progress = Math.max(0, Math.min(progress, 1));

        entry.trackTime =
            animationDuration * progress;

        skeleton.updateAnimation(0);
    }

    playFail()
    {
        this.isFail = true;
        this.touching = false;
        this.pimpleEntry = this.pimpleSpine.setAnimation(0,"worse",false);
        this.toolEntry = this.toolSpine.setAnimation(0,"pop_fail",false);
        this.pimpleEntry.timeScale = 1;
        this.toolEntry.timeScale = 1;
        const duration = Math.max(
            this.pimpleEntry.animation.duration,
            this.toolEntry.animation.duration
            );

        this.scheduleOnce(() =>
        {
            this.currentProgress = 0;
            this.isFail = false;

            this.pimpleEntry = this.pimpleSpine.setAnimation(0, this.pimpleAnimationName, false);
            this.toolEntry = this.toolSpine.setAnimation(0, this.toolAnimationName, false);

            this.pimpleEntry.timeScale = 0;
            this.toolEntry.timeScale = 0;

            this.updateSpine(0, this.toolSpine, this.toolEntry, this.toolAnimationDuration);
            this.updateSpine(0, this.pimpleSpine, this.pimpleEntry, this.pimpleAnimationDuration);
        }, duration);
    }

    playForward(entry: sp.spine.TrackEntry)
    {
        entry.timeScale = 1;
    }

    private updateDebug()
    {
        this.progressLabel.string =
    `Progress : ${this.currentProgress.toFixed(2)}
`;
    }


}
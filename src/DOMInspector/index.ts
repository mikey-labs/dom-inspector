import { assignObjectFilterSource } from "../Util/AssignObjectFilterSource";
import {isMobile, useEventListener} from "@zhengxy/use";

export interface DOMInspectorProps {
  enable: boolean;
  overlayZIndex: string;
  onDid(target: HTMLElement): void;
}
export interface AbstractDOMInspector {
    isMobile:boolean;
    overlay:HTMLElement;
    options:DOMInspectorProps;
    touchActionStyle:HTMLStyleElement;
    enable():boolean;
    disable():boolean;
    createOverLay():HTMLElement[];
    touchAction(enable:boolean):void;
}
export class DOMInspector implements AbstractDOMInspector{
    isMobile = isMobile;
    overlay:HTMLElement;
    mask:HTMLElement;
    currentTarget:HTMLElement | undefined;
    stopper:Function | undefined;
    touchActionStyle: HTMLStyleElement = (()=>{
        const style = document.createElement('style')
        document.head.appendChild(style);
        return style;
    })();
    options = {
        enable:false,
        overlayZIndex:"9999",
        onDid(target?:HTMLElement):void {
            return
        }
    };
    constructor(options:DOMInspectorProps) {
        this.options = assignObjectFilterSource(this.options,options || {});
        const [overlay,mask] = this.createOverLay();
        this.overlay = overlay;
        this.mask = mask;
        if(options.enable){
            this.enable();
        }
    }
    handleMove(){
        const { stop } = useEventListener(window,'mousemove',(e:Event)=>{
           const target = this.getTouchMouseTargetElement(e);
           if(!target)return;
           if(this.overlay.contains(target as Node))return;
           this.addMask(target as HTMLElement);
           this.currentTarget = target as HTMLElement;
        });
        this.stopper = stop;
    }
    addMask(el:HTMLElement){
        const rect = el.getBoundingClientRect();
        this.mask.style.width = rect.width+"px";
        this.mask.style.height = rect.height+"px";
        this.mask.style.top = rect.top+"px";
        this.mask.style.left = rect.left+"px";
    }
    enable(): boolean {
        isMobile &&  this.touchAction(true);
        this.handleMove();
        this.addBodyEventListener();
        return true;
    }
    addBodyEventListener(){
        const {stop} = useEventListener(document.body,'click',(e:Event)=>{
           if(this.options.enable){
               e.preventDefault();
               e.stopPropagation();
               stop();
               this.stopper?.()
               this.options.onDid(this.currentTarget);
           }
        },{capture:true})
    }

    disable(): boolean {
        isMobile && this.touchAction(false);
        return false;
    }
    touchAction(enable:boolean){
        this.touchActionStyle.innerHTML = enable
          ? `* {touch-action: none;}`
          : "";
    }
    getTouchMouseTargetElement(e:Event):EventTarget | null{
        if(e instanceof TouchEvent && e.touches){
            const changeTouch = e.changedTouches[0];
            return document.elementFromPoint(changeTouch.clientX,changeTouch.clientY)
        }
        return e.target;
    }


    createOverLay(): HTMLElement[] {
        const {overlayZIndex} = this.options;
        const html = document.querySelector('html');
        const overlay  = document.createElement('div');
        overlay.style.zIndex = overlayZIndex;
        overlay.style.position = 'fixed';
        overlay.style.borderInline = "2px solid rgba(182, 200, 120, 0.75)";

        const mask = document.createElement('div');
        mask.style.zIndex = overlayZIndex;
        mask.style.position = 'fixed';
        mask.style.background = 'rgba(81, 101, 255, 0.75)';
        mask.style.pointerEvents = "none";
        mask.style.cursor = "default";
        useEventListener(mask,'click',(e:Event)=>{
            console.log("c")
            e.stopPropagation();
            e.preventDefault();
        },{capture:false})
        overlay.appendChild(mask)

        html?.appendChild(overlay);

        return [overlay,mask];
    }

}
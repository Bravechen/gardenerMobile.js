/**
 * 具有交互功能的Part
 * Created by admin on 2016/1/6.
 * @version alpha v0.0.1 增加针对当事件目标对象不存在的容错提示。
 */
gardener.GNInteractivePart = (function(window,Hammer,gn,undefined){
    "use strict";

    function GNInteractivePart(){
        gn.GNPart.call(this);
        this.className = "gardener.GNInteractivePart";
        this.superClass = gn.GNPart.prototype;
        this.elementH = null;
    }
    gn.Core.inherits(gn.GNPart,GNInteractivePart);   //实现继承
    /**
     * 初始化
     * @param element {HTMLElement} DOM对象
     */
    GNInteractivePart.prototype.initialize = function(element){
        var success = gn.GNPart.prototype.initialize.call(this,element);
        if(success){
            this.elementH = new Hammer(element);       //Hammer
        }else{
            console.log("GNInteractivePart===>The param of element is null.");
            return false;
        }
        return true;
    };
    /**
     * 最终清理
     * @param usePool {Boolean}
     */
    GNInteractivePart.prototype.terminalClear = function(usePool){
        //清除对象订阅的所有事件侦听
        this.offAllEvents();
        this.elementH = null;
        gn.GNPart.prototype.terminalClear.call(this,usePool);
    };
    /**
     * 添加触摸事件
     * @param type {String} 事件类型
     * @param handler {Function} 事件处理器。在最终的处理器中，this指向订阅事件的GN对象，event.target指向发生事件目标的dom对象。event.gnTarget指向事件目标的GN对象
     * @param data {Object} 附加对象，该对象会随着事件对象返回到事件处理其中，属性名为gnData
     * @returns {boolean} 报错/处理失败
     */
    GNInteractivePart.prototype.addTouchEvent = function(type,handler,data){
        if(!this.elementH || handler == null){
            console.log("addTouchEvent's param is error",this.elementH,handler);
            return false;
        }
        gn.GNEventManager.addEventFrom(type,this.gnId,handler,data);
        this.elementH.on(type,onTouchEventHandler);
    };
    /**
     * 移除触摸事件
     * @param type 事件类型
     * @param handler 事件处理器
     * @returns {boolean} 报错/处理失败
     */
    GNInteractivePart.prototype.removeTouchEvent = function(type,handler){
        if(!this.elementH || handler == null){
            console.log("removeTouchEvent's param is error",this.elementH,handler);
            return false;
        }
        gn.GNEventManager.removeEventFrom(type,this.gnId,handler);
        this.elementH.off(type,onTouchEventHandler);
    };
    /**
     * 解绑一个GNObject上所有订阅的事件侦听
     * @param gnId {String}
     * @return {Boolean}
     */
    GNInteractivePart.prototype.offAllEvents = function(){
        var list = gn.GNEventManager.getEventFromList(this.gnId);
        if(!list)
            return;
        for(var i= 0,item;(item=list[i])!=null;i++){
            this.removeTouchEvent(item.type,item.gnId,item.handler);
        }
    };
    /**
     * 触摸事件处理器
     * @param e
     * @returns {boolean}
     */
    function onTouchEventHandler(e){
        var target = e.target;
        var srcTarget = e.srcEvent.currentTarget;
        var domTarget = target === srcTarget || !srcTarget?target:srcTarget;
        if(!domTarget){
            console.log("onTouchEventHandler:","The domTarget in event is error",domTarget);
            return false;
        }
        var gnId = domTarget.getAttribute("data-gnId");
        var from = gn.GNEventManager.getEventFrom(e.type,gnId);
        if(!from){
            console.log("onTouchEventHandler is error.",from,gnId+"_"+ e.type);
            return false;
        }
        var fromTarget = gn.GNObjectManager.getGNObject(gnId);
        //当target是一个GNObject时，事件的gnTarget指向他，否则为空
        if(target.hasAttribute('data-gnId')){
            try{
                e.gnTarget = gn.GNObjectManager.getGNObject(target.getAttribute('data-gnId'));
            }catch(error){
                console.log(error);
            }
        }
        //如果有需要传递给事件处理器的数据，则传入。
        if(from.data){
            e.gnData = from.data;
        }
        from.handler.call(fromTarget,e);
    }

})(window,Hammer,gardener);
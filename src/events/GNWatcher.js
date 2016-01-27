/**
 * 观察者对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNWatcher = (function(window,gn){
    "use strict";

    function GNWatcher(){
        gn.GNObject.call(this);
        this.className = "gardener.GNWatcher";
        this.superClass = gn.GNObject.prototype;
    }

    gn.Core.inherits(gn.GNObject,GNWatcher);
    /**
     * 添加一个事件类型的侦听
     * @param type [necessary]
     * @param handler [necessary]
     * @param subscriberId [necessary]
     * @param data  [optional]
     */
    GNWatcher.prototype.addWatch = function(type,handler,subscriberId,data){
        if(typeof type !== "string" || typeof handler !== "function" || typeof subscriberId !== "string"){
            console.log("At watcher's addEventListener(),the params are error.");
            return;
        }
        var eventData = {};
        eventData.scope = subscriberId;
        eventData.data = data;
        gn.GNEventManager.addEventFrom(type,this.gnId,handler,eventData);
    };
    /**
     * 移除一个事件类型的侦听
     * Remove a listener for an event listener.
     * @param type [necessary]
     * @param handler [necessary]
     */
    GNWatcher.prototype.removeWatch = function(type,handler){
        if(typeof type !== "string" || typeof handler !== "function"){
            return;
        }
        gn.GNEventManager.removeEventFrom(type,this.gnId,handler);
    };
    /**
     * 是否在侦听一个事件类型
     * Whether in listening for an event type.
     * @param type [necessary] 事件类型
     */
    GNWatcher.prototype.hasWatch = function(type){
        if(typeof type !== "string"){
            console.log("At GNWatcher's hasEvent,the params are error." );
            return;
        }
        return !!gn.GNEventManager.getEventFrom(type,this.gnId);
    };
    /**
     * 派发一个会被监视的情况
     * @param type {String} [necessary]
     * @param data {Object} [optional]
     * @param outputListeners {Array} [optional]
     */
    GNWatcher.prototype.dispatchEvent = function(type,data,outputListeners){
        if(!this.hasWatch(type)){
            return false;
        }
        var from = gn.GNEventManager.getEventFrom(type,this.gnId);
        var list = from.handlers;
        var dataList = from.datas;
        var itemData,sendEvent,gnEvent;
        for(var i= 0,item;(item=list[i])!=null;i++){
            gnEvent = {};
            if(data.isDOMEvent){
                gnEvent.srcEvent = data;
            }else{
                gnEvent.data = data;
            }
            gnEvent.type = type;
            itemData = dataList[i];
            if(itemData.data){
                gnEvent.gnData = itemData.data;
            }
            gnEvent.subscriberId = itemData.scope;
            if(itemData.scope){
                var gnObj = gn.GNObjectManager.getGNObject(itemData.scope);
                if(gnObj){
                    gnEvent.target = gnObj;
                    item.call(gnObj,gnEvent); //调整事件处理器中的this指向订阅时指向的scope
                    continue;
                }
            }
            item(gnEvent);
        }
        item = null;
        itemData = null;
        if(outputListeners){

        }
    };

    return GNWatcher;

})(window,gardener);

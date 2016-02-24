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
     * @param type [necessary] 事件类型
     * @param handler [necessary] 处理器
     * @param subscriberId [necessary] 订阅者的gnId
     * @param data  [optional] 附加对象，会被传递到处理器当中
     */
    GNWatcher.prototype.addWatch = function(type,handler,subscriberId,data){
        if(typeof type !== "string" || typeof handler !== "function" || typeof subscriberId !== "string"){
            console.log("At watcher's addEventListener(),the params are error.");
            return;
        }
        var eventData = {};
        eventData.scope = subscriberId;
        eventData.data = data;
        gn.EM.addEventFrom(type,this.gnId,handler,eventData); //加入事件管理对象
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
        gn.EM.removeEventFrom(type,this.gnId,handler);
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
        return !!gn.EM.getEventFrom(type,this.gnId);
    };
    /**
     * 派发一个会被监视的事件
     * @param type {String} [necessary] 事件类型
     * @param data {Object} [optional] 事件中包含的数据
     * @param outputListeners {Array} [optional] 输出订阅者的id 默认false，不输出.
     * 当需要知道派发的此次事件将会被传播到那些订阅者的时候，可以使用此返回的列表。
     */
    GNWatcher.prototype.dispatchEvent = function(type,data,outputListeners){
        if(!this.hasWatch(type)){
            return false;
        }
        var from = gn.EM.getEventFrom(type,this.gnId);
        var list = from.handlers;
        var dataList = from.datas;

        if(outputListeners){
            var scopeList = [];
        }

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
                var gnObj = gn.OM.getGNObject(itemData.scope);
                if(gnObj){
                    if(outputListeners){
                        scopeList.push(itemData.scope);
                    }
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
            return scopeList;
        }
    };

    return GNWatcher;

})(window,gardener);

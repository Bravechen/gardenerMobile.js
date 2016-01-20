/**
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
     * 添加事件侦听
     * @param type [必须]
     * @param handler [必须]
     * @param scope [可选]
     * @param data  [可选]
     */
    GNWatcher.prototype.addEventListener = function(type,handler,scope,data){
        if(typeof type !== "string" || typeof handler !== "function" || !scope){
            return;
        }
        var eventData = {};
        eventData.scope = scope;
        eventData.data = data;
        gn.GNEventManager.addEventFrom(type,this.gnId,handler,eventData);
    };

    GNWatcher.prototype.removeEventListener = function(type,handler){
        if(typeof type !== "string" || typeof handler !== "function"){
            return;
        }
        gn.GNEventManager.removeEventFrom(type,this.gnId,handler);
    };

    GNWatcher.prototype.hasEvent = function(type){
        
    };

    GNWatcher.prototype.dispatchEvent = function(type,data){
        
    };
    
    //======================
    var watcher;

    return {
        /**
         * 返回一个GNWatcher实例
         */
        getInstance:function(){
            if(watcher){
                watcher = new GNWatcher();
            }
            return watcher;
        }
    };

})(window,gardener);

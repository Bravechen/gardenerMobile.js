/**
 * @author Brave Chen on 2015.12.10
 * @version alpha v0.0.0 开发各项功能
 * @dependence jQuery v2.1.4,Hammer v2.0.4
 */
gardener.GNObject = (function(window,gardener,undefined){
    "use strict";
    /**
     * 顶级类
     * @constructor
     */
    function GNObject(){
        this.className = "gardener.GNObject";
        this.superClass = null;
        this.gnId = gardener.Core.getUUID();
        this._gnId = this.gnId;
        this.initialized = false;
        gardener.GNObjectManager.addGNObject(this);
    }
    /**
     * 输出对象字符串表示
     * @returns {string}
     */
    GNObject.prototype.output = function(){
        return this.className;
    };
    /**
     * 最终清理。会将对象清理至可回收状态。可根据需要重写覆盖。
     * @param usePool {Boolean} 对象是否使用了对象池，使用对象池的对象，会进行属性重置，然后返回对象池。
     * 在对象池清理时间到来时，对象会被最终清空。默认为false.
     * @return {void}
     */
    GNObject.prototype.terminalClear = function(usePool){
        //如果使用了对象池，则重置后返回对象池。
        if(!!usePool){
            this.initialized = false;
            gardener.GNObjectManager.changeGNId(this._gnId,this.gnId);
            var pool = gardener.GNPoolManager.getPool(this.className);
            if(!pool){
                console.log("don't go back to pool");
            }
            return;
        }
        //从对象列表中清除改对象。首先使用gnId清除，不成功则使用_gnId清除
        var success = gardener.GNObjectManager.removeGNObject(this.gnId);
        if(!success){
            success = gardener.GNObjectManager.removeGNObject(this._gnId);
            if(!success){
                console.log("This GNObject is cleaned or not in GNObjectManager's list.",this.gnId,this._gnId);
            }
        }
        this.className = null;
        this.superClass = null;
        this.gnId = null;
        this._gnId = null;
        this.initialized = null;
    };
    return GNObject;
})(window,gardener);


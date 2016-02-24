/**
 * 适用于GNObject体系的对象池
 * Created by admin on 2016/1/6.
 */
gardener.GNObjectPool = (function(window,gn,undefined){
    "use strict";
    /**
     * 适用于GNObject体系的对象池
     * @param ClassName {String} 类名全名称，来自于对象的className属性或者其它
     * @param option {Object} 配置信息
     * @return {Object}
     */
    function GNObjectPool(ClassName,option){
        gn.GNObject.call(this);
        this.className  = "gardener.GNObjectPool";
        this.superClass = gn.GNObject.prototype;
        if(!ClassName || typeof ClassName !== "string"){
            console.log("init objectPool is error.");
            return null;
        }
        this.classItemName = ClassName;
        this.ClassItem = gn.Core.getDefinitionByName(this.classItemName);
        this.objectList = [];
        this.initialize = true;
    }

    gn.Core.inherits(gn.GNObject,GNObjectPool);

    var opp = GNObjectPool.prototype;
    /**
     * 输出信息
     * @returns {*}
     */
    opp.output = function(){
        return "[ObjectPool:"+!!this.classItemName?this.classItemName:"undefined"+"]";
    };
    /**
     * 最终清理
     */
    opp.terminalClear = function(){
        gn.GNObject.prototype.terminalClear.call(this,false);
    };

    /**
     * 从对象池中获取一个对象
     * @returns {*}
     */
    opp.gainFromPool = function(){
        if(!this.initialize)
            return false;
        if(this.hasObjectIn()){
            return this.objectList.pop();
        }
        return new this.ClassItem();
    };
    /**
     * 把一个对象返还回池子中
     * @param gnObject
     * @returns {boolean}
     */
    opp.goBackToPool = function(gnObject){
        if(!this.initialized)
            return false;
        if(gnObject.className === this.classItemName){
            this.objectList.push(gnObject);
        }else{
            console.log("The param is not belong in this pool.");
        }
    };
    /**
     * 创建指定个数的对象
     * @param sum
     */
    opp.createInstance = function(sum){
        if(!sum>0)
            return;
        var item;
        while(sum--){
            item = new this.ClassItem();
            this.objectList.push(item);
        }
    };
    /**
     * 池子中是否还有对象
     * @returns {boolean}
     */
    opp.hasObjectIn = function(){
        return this.objectList.length>0;
    };
    /**
     * 当前池子中对象总数
     * @returns {*}
     */
    opp.sumOfObject = function(){
        return this.objectList.length;
    };
    /**
     * 清空对象池，并决定是否要销毁对象。
     * 当选择销毁对象时，不仅会主动调用对象的终极清理方法terminalClear()，还会从全局对象管理池中删除对象。
     * 即希望尽可能的去除对池中对象的所有引用。
     * @param isDelete {boolean} 是否需要销毁对象.
     * @returns {boolean}
     */
    opp.clearPool = function(isDelete){
        if(!this.objectList.length>0){
            return false;
        }
        var len = this.objectList.length;
        while(len--){
            var obj = this.objectList.pop();
            if(isDelete){
                if(obj.hasOwnProperty("initialized") && obj.initialized === true){
                    obj.terminalClear();
                }
                gn.OM.removeGNObject(obj);
            }
        }
    };
    return GNObjectPool;

})(window,gardener);
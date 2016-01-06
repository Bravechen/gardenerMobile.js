/**
 * @author Brave Chen on 2015.12.10
 * @version alpha v0.0.0 开发各项功能
 * @dependence jQuery v2.1.4,Hammer v2.0.4
 */
window.gardener = (function(window,undefined){
    "use strict";
    /**
     * 私有类，提供不公开的工具方法
     */
    var PrivateClass = {
        /**
         * 利用寄生的方式创建对象
         * @param  {Function} original ԭ原型
         * @return {Object} 利用寄生方式创建的对象实例
         */
        createObject:function(original){
            var T = function T(){};
            T.prototype = original;
            return new T();
        }
    };
    //========================UUID=============================
    var UUID = {};
    /**
     * Returns an unsigned x-bit random integer.
     * @param {int} x A positive integer ranging from 0 to 53, inclusive.
     * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
     */
    UUID._getRandomInt = function(x) {
        if (x <0) return NaN;
        if (x <= 30) return (0 | Math.random() * (1 << x));
        if (x <= 53) return (0 | Math.random() * (1 << 30))
            + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
        return NaN;
    };
    /**
     * Returns a function that converts an integer to a zero-filled string.
     * @param {int} radix
     * @returns {Function}
     */
    UUID._getIntAligner = function(radix) {
        return function(num, length) {
            var str = num.toString(radix), i = length - str.length, z = "0";
            for (; i > 0; i >>>= 1, z += z) { if (i & 1) { str = z + str; } }
            return str;
        };
    };
    UUID._hexAligner = UUID._getIntAligner(16);
    //============================Core================================================
    /**
     * 核心类，提供一些基础方法
     */
    var Core = {
        /**
         * 实现继承
         * @param  {Object} SuperClass 超类
         * @param  {Object} SubClass   子类
         * @return {void}
         */
        inherits:function(SuperClass,SubClass){
            if(!SuperClass || !SubClass)
                return;
            var prototype = Object.create?Object.create(SuperClass.prototype):PrivateClass.createObject(SuperClass.prototype);
            prototype.constructor = SubClass;
            SubClass.prototype = prototype;
        },
        /**
         * 根据全名称创建实例
         * @param  {String} className 类的全名称
         * @return {Object}
         */
        createInstance:function(className){
            var ary = className.split('.');
            var ClassItem = window[ary[0]];
            for(var i=1,len=ary.length;i<len;i++){
                ClassItem = ClassItem[ary[i]];
            }
            return new ClassItem();
        },
        /**
         * 返回 name 参数指定的类的类对象引用
         * @param name 类的名称
         * @returns {*}
         */
        getDefinitionByName:function(name){
            var ary = name.split('.');
            var ClassItem = window[ary[0]];
            for(var i=1,len=ary.length;i<len;i++){
                ClassItem = ClassItem[ary[i]];
            }
            return typeof ClassItem === "function"?ClassItem:null;
        },
        /**
         * 获得一个UUID
         * @return {String} UUID
         */
        getUUID:function(){
            var rand = UUID._getRandomInt, hex = UUID._hexAligner;
            return  hex(rand(32), 8)          // time_low
                + "-"
                + hex(rand(16), 4)          // time_mid
                + "-"
                + hex(0x4000 | rand(12), 4) // time_hi_and_version
                + "-"
                + hex(0x8000 | rand(14), 4) // clock_seq_hi_and_reserved clock_seq_low
                + "-"
                + hex(rand(48), 12);        // node
        }
    };
    return {
        Core:Core
    };
})(window);
//============================GNObjectManager===================================
/**
 * GN对象管理类
 */
gardener.GNObjectManager = (function(undefined){
    "use strict";
    /**
     * 私有对象类
     */
    var PrivateClass = {
        gnObjList:{length:0}
    };
    /**
     * 添加GNObject
     * @param gnObject
     * @returns {boolean}
     */
    function addGNObject(gnObject){
        if(!gnObject || inGNList(gnObject.gnId)) {
            return false;
        }
        PrivateClass.gnObjList[gnObject.gnId] = gnObject;
        PrivateClass.gnObjList.length++;
        return true;
    }
    /**
     * 删除GNObject
     * @param gnId {String} GNObject的gnId
     * @returns {boolean}
     */
    function removeGNObject(gnId){
        if(!gnId || !inGNList(gnId)){
            return false;
        }
        delete PrivateClass.gnObjList[gnId];
        PrivateClass.gnObjList.length--;
        return true;
    }
    /**
     * 获取一个GNObject
     * @param gnId
     * @returns {*}
     */
    function getGNObject(gnId){
        return PrivateClass.gnObjList[gnId];
    }
    /**
     * 修改对象的gnId
     * @param newId
     * @param oldId
     * @returns {boolean}
     */
    function changeGNId(newId,oldId){
        if(!newId || !oldId || !inGNList(oldId)){
            return false;
        }
        var tempGN = PrivateClass.gnObjList[oldId];
        tempGN.gnId = newId;
        delete PrivateClass.gnObjList[oldId];
        PrivateClass.gnObjList[newId] = tempGN;
        return true;
    }
    /**
     * 是否在列表中
     * @param gnId
     * @returns {boolean}
     */
    function inGNList(gnId){
        return PrivateClass.gnObjList[gnId]!=null;
    }
    return {
        addGNObject:addGNObject,
        removeGNObject:removeGNObject,
        getGNObject:getGNObject,
        changeGNId:changeGNId,
        inGNList:inGNList
    };
})();
//============================TouchEvent========================================
/**
 * 移动触摸事件类型
 */
gardener.TouchEvent = {
    TAP:"tap",
    SWIPE:"swipe",
    SWIPE_LEFT:"swipeleft",
    SWIPE_RIGHT:"swiperight",
    SWIPE_UP:"swipeup",
    SWIPE_DOWN:"swipedown"
};
//============================GNEventManager====================================
/**
 * 事件管理对象
 */
gardener.GNEventManager = (function(undefined){
    var PrivateClass = {
        eventFromList:{}
    };
    /**
     * 接口：
     * IFrom{
     *  type, //事件类型
     *  gnObj, //gn对象
     *  handler, //事件处理器
     *  data //自定义对象，会随着参数发送至事件处理器
     * }
     */
    /**
     * 添加一个事件源对象
     * @param type {String}
     * @param gnId {String}
     * @param handler {Function}
     * @param data {Object}
     */
    function addEventFrom(type,gnId,handler,data){
        var id = gnId+"_"+type;
        var list = PrivateClass.eventFromList;
        var item = list[id];
        if(item){
            item.handler = handler;
        }else{
            item = {
                type:type,
                gnId:gnId,
                handler:handler
            };
            list[id] = item;
        }
        if(data){
            list[id].data = data;
        }
    }
    /**
     * 移除一个事件源对象
     * @param type
     * @param gnId
     * @param handler
     * @returns {boolean}
     */
    function removeEventFrom(type,gnId,handler){
        var id = gnId+"_"+type;
        var list = PrivateClass.eventFromList;
        var from = list[id];
        if(!from){
            return false;
        }
        from.type = null;
        from.gnId = null;
        from.handler = null;
        from.data = null;
        delete PrivateClass.eventFromList[id];
        return true;
    }
    /**
     * 获取一个事件源对象
     * @param type
     * @param gnId
     * @returns {*}
     */
    function getEventFrom(type,gnId){
        return PrivateClass.eventFromList[gnId+"_"+type];
    }
    return {
        addEventFrom:addEventFrom,
        removeEventFrom:removeEventFrom,
        getEventFrom:getEventFrom
    };
})();
//==============================GNFrameManager==================================
/**
 * 帧渲染对象
 */
gardener.GNFrameManager = (function(window,undefined){
    "use strict";
    var initialized = false,frameRate = 60,handlerList,animateElement,animateRequest;
    /**
     * 初始化
     */
    function initialize(){
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if(!window.requestAnimationFrame){
            window.requestAnimationFrame = function (callBack) {
                return setTimeout(callBack, 1000 / frameRate);
            }
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
        handlerList = [];
        initialized = true;
    }
    /**
     * 添加帧更新监听
     * @param handler   {Function} 处理器回调
     * @param element   {HTMLElement} DOM元素
     */
    function addFrameListener(handler,element){
        if (typeof handler !== "function" || !element instanceof HTMLElement) {
            console.log("The params are error.",handler,element);
            return;
        }
        if(!initialized){
            initialize();
        }
        animateElement = element;
        handlerList.push(handler);
        animateRequest = window.requestAnimationFrame(drawFrame,element);
    }
    /**
     * 移除帧更新监听
     */
    function removeFrameListener(handler){
        var index = handlerList.indexOf(handler);
        if(index!==-1){
            handlerList.splice(index,1);
        }
        if(handlerList.length<=0){
            window.cancelAnimationFrame(animateRequest);
        }
    }
    /**
     * @private
     * 提交帧更新请求
     * **/
    function drawFrame() {
        animateRequest = window.requestAnimationFrame(drawFrame, animateElement);
        for(var i= 0,item;(item=handlerList[i])!=null;i++){
            item();
        }
    }
    return {
        frameRate:frameRate,
        addFrameListener:addFrameListener,
        removeFrameListener:removeFrameListener
    };
})(window);
//============================GNPoolManager=====================================
/**
 * 对象池管理对象
 */
gardener.GNPoolManager = (function(window,undefined){
    "use strict";
    var PrivateClass = {
        poolList:{}
    };
    /**
     * 是否在对象池列表中
     * @param classItemName {String}
     */
    function inPoolList(classItemName){
        return PrivateClass.poolList.hasOwnProperty(classItemName);
    }
    /**
     * 获得列表中的一个对象池
     * @param classItemName
     * @returns {gardener.GNObjectPool}
     */
    function getPool(classItemName){
        return PrivateClass.poolList[classItemName];
    }
    /**
     * 从列表中移除一个对象池对象
     * @param classItemName {String}
     */
    function removePool(classItemName){
        if(inPoolList(classItemName)){
            delete PrivateClass.poolList[classItemName];
        }
    }
    return {
        getPool:getPool,
        removePool:removePool,
        inPoolList:inPoolList
    };
})(window);
//============================GNLogManager======================================
/**
 * 日志管理对象
 */
gardener.GNLogManager = (function(window,undefined){
    "use strict";
})(window);

/**
 * @author Brave Chen on 2015.12.10
 * @version alpha v0.0.0 开发各项功能
 * @dependence jQuery v2.1.4,Hammer v2.0.4
 */
window.gardener = (function(window,$,Hammer,undefined){
    "use strict";
    //=======================PrivateClass=====================
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
        },
        /**gn对象列表**/
        gnObjList:{length:0},
        /**事件订阅对象列表**/
        eventFromList:{},
        /**对象池列表**/
        poolList:{}
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
    //============================GNObjectManager================================================
    /**
     * 对象管理类
     */
    var GNObjectManager = {
        /**
         * 添加GNObject
         * @param gnObject
         * @returns {boolean}
         */
        addGNObject:function(gnObject){
            if(!gnObject || inGNList(gnObject.gnId)) {
                return false;
            }
            PrivateClass.gnObjList[gnObject.gnId] = gnObject;
            PrivateClass.gnObjList.length++;
            return true;
        },
        /**
         * 删除GNObject
         * @param gnId {String} GNObject的gnId
         * @returns {boolean}
         */
        removeGNObject:function(gnId){
            if(!gnId || !inGNList(gnId)){
                return false;
            }
            delete PrivateClass.gnObjList[gnId];
            PrivateClass.gnObjList.length--;
            return true;
        },
        /**
         *
         * @param gnId
         * @returns {*}
         */
        getGNObject:function(gnId){
            return PrivateClass.gnObjList[gnId];
        },
        /**
         * 修改对象的gnId
         * @param newId
         * @param oldId
         * @returns {boolean}
         */
        changeGNId:function(newId,oldId){
            if(!newId || !oldId || !inGNList(oldId)){
                return false;
            }
            var tempGN = PrivateClass.gnObjList[oldId];
            tempGN.gnId = newId;
            delete PrivateClass.gnObjList[oldId];
            PrivateClass.gnObjList[newId] = tempGN;
            return true;
        },
        /**
         * 是否在列表中
         * @param gnId
         * @returns {boolean}
         */
        inGNList:inGNList
    };
    /**
     * 是否在列表中
     * @param gnId
     * @returns {boolean}
     */
    function inGNList(gnId){
        return PrivateClass.gnObjList[gnId]!=null;
    }
    //============================GNPoolManager=======================================
    /**
     * 对象池管理对象
     */
    var GNPoolManager = {
        /**
         * 创建一个对象池对象，并把它加入到对象池管理列表中
         */
        createPool:function(classItemName,option){
            return GNPoolManager.inPoolList(classItemName)?PrivateClass.poolList[classItemName]:new GNObjectPool(classItemName,option);
        },
        getPool:function(classItemName){

        },
        /**
         * 从列表中移除一个对象池对象
         * @param classItemName {String}
         */
        removePool:function(classItemName){

        },
        /**
         * 是否在对象池列表中
         * @param classItemName {String}
         */
        inPoolList:function(classItemName){
            return PrivateClass.poolList.hasOwnProperty(classItemName);
        }

    };

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
         * @return {void}
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
    //============================GNEventManager====================================
    /**
     * 接口：
     * IFrom{
     *  type,
     *  gnObj,
     *  handler,
     *  data
     * }
     */
    /**事件管理对象**/
    var GNEventManager = {
        /**
         * 添加一个事件源对象
         * @param type {String}
         * @param gnId {String}
         * @param handler {Function}
         * @param data {Object}
         */
        addEventFrom:function(type,gnId,handler,data){
            var id = gnId+"_"+type;
            var list = PrivateClass.eventFromList;
            if(list[id]){
                list[id].handler = handler;
            }else{
                list[id] = {
                    type:type,
                    gnId:gnId,
                    handler:handler
                };
            }
            if(data){
                list[id].data = data;
            }
        },
        /**
         * 移除一个事件源对象
         * @param type
         * @param gnId
         * @param handler
         * @returns {boolean}
         */
        removeEventFrom:function(type,gnId,handler){
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
        },
        /**
         * 解绑一个GNObject上所有订阅的事件侦听
         * @param gnId {String}
         * @return {Boolean}
         */
        offAllEvents:function(gnId){
            if(!gnId){
                console.log("The param of gnId is error.");
                return false;
            }
            var list = PrivateClass.eventFromList;
            var i = 0;
            for(var key in list){
                if(list.hasOwnProperty(key) && key.indexOf(gnId)!=-1){
                    if(GNEventManager.removeEventFrom(gnId)){
                        i++;
                    }
                }
            }
            return i>0;
        },
        /**
         * 获取一个事件源对象
         * @param type
         * @param gnId
         * @returns {*}
         */
        getEventFrom:function(type,gnId){
            return PrivateClass.eventFromList[gnId+"_"+type];
        }
    };

    //==============================帧渲染==================================
    var frameHandler, animateElement, animateRequest;
    /**
     * 帧渲染管理对象
     */
    var GNFrameManager = {
        frameRate:60,
        /**
         * 添加帧更新监听
         * @param handler   {Function} 处理器回调
         * @param element   {HTMLElement} DOM元素
         */
        addFrameListener:function(handler,element){
            if (typeof handler !== "function" || !element instanceof HTMLElement) {
                console.log("The params are error.",handler,element);
                return;
            }
            if(handler!=null){
                frameHandler = handler;
            }
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
                function (callBack) {
                    return setTimeout(callBack, 1000 / GNFrameManager.frameRate);
                });
            }
            drawFrame();
        },
        /**
         * 移除帧更新监听
         */
        removeFrameListener:function () {
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = (window.webkitCancelAnimationFrame||
                    window.webkitCancelRequestAnimationFrame ||
                    window.clearTimeout
                );
            }
            window.cancelAnimationFrame(animateRequest);
        }
    };
    /**
     * @private
     * 提交帧更新请求
     * **/
    function drawFrame() {
        animateRequest = window.requestAnimationFrame(drawFrame, animateElement);
        frameHandler();
    }

    //======================GardenerObject============================
    /**
     * 顶级类
     * @constructor
     */
    function GNObject(){
        this.className = "gardener.GNObject";
        this.superClass = null;
        this.gnId = Core.getUUID();
        this._gnId = this.gnId;
        this.initialized = false;
        GNObjectManager.addGNObject(this);
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
            //reset and go back to pool
            this.initialized = false;
            GNObjectManager.changeGNId(this._gnId,this.gnId);
            return;
        }
        //从对象列表中清除改对象。首先使用gnId清除，不成功则使用_gnId清除
        var success = GNObjectManager.removeGNObject(this.gnId);
        if(!success){
            success = GNObjectManager.removeGNObject(this._gnId);
            if(!success){
                console.log("This GNObject is cleaned or not in GNObjectManager's list.",this.gnId,this._gnId);
            }
        }
        this.superClass = null;
        this.gnId = null;
        this._gnId = null;
        this.initialized = null;
    };

    //============================GNPart=====================================
    /**
     * 零件类，所有的显示层对象均继承此对象
     * @constructor
     */
    function GNPart(){
        GNObject.call(this);
        this.className = "gardener.GNPart";
        this.superClass = GNObject.prototype;   //超类原型
        this.element = null;    //HTMLElement
        this.element$ = null;   //jQuery
    }
    Core.inherits(GNObject,GNPart); //实现继承
    /**
     * 输出对象字符串表示
     * @returns {String}
     */
    GNPart.prototype.output = function(){
        return "["+this.className+","+((!!this.gnId)?this.gnId:"not initialized")+"]";
    };
    /**
     * 初始化
     * @param element {HTMLElement} DOM对象
     */
    GNPart.prototype.initialize = function(element){
        if(this.initialized)
            return false;
        if(element){
            var id = element.getAttribute('data-gnId');
            if(!!id){
                GNObjectManager.changeGNId(id,this.gnId);
            }
            this.element = element;         //HTMLElement
            this.element$ = $(element);     //jQuery
        }else{
            console.log("The param of element is null.");
            return false;
        }
        return true;
    };
    /**
     * 最终清理
     * @param usePool {Boolean}
     */
    GNPart.prototype.terminalClear = function(usePool){
        this.element = null;
        this.element$ = null;
        GNObject.prototype.terminalClear.call(this,usePool);
    };

    GNPart.prototype.getBounds = function(coordinateType){
        
    };
    //======================Events==========================================
    /**
     * 移动触摸事件类型
     * @type {{TAP: string}}
     */
    var TouchEvent = {
        TAP:"tap",
        SWIPE:"swipe",
        SWIPE_LEFT:"swipeleft",
        SWIPE_RIGHT:"swiperight",
        SWIPE_UP:"swipeup",
        SWIPE_DOWN:"swipedown"
    };

    //============================GNInteractivePart=====================================
    /**
     * 具有交互功能的Part
     * @constructor
     */
    function GNInteractivePart(){
        GNPart.call(this);
        this.className = "gardener.GNInteractivePart";
        this.superClass = GNPart.prototype;
        this.elementH = null;
    }
    Core.inherits(GNPart,GNInteractivePart);   //实现继承
    /**
     * 初始化
     * @param element {HTMLElement} DOM对象
     */
    GNInteractivePart.prototype.initialize = function(element){
        var success = GNPart.prototype.initialize.call(this,element);
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
        //GNEventManager.offAllEvents(this.gnId);
        this.elementH = null;
        GNPart.prototype.terminalClear.call(this,usePool);
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
        GNEventManager.addEventFrom(type,this.gnId,handler,data);
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
        GNEventManager.removeEventFrom(type,this.gnId,handler);
        this.elementH.off(type,onTouchEventHandler);
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
        var gnId = domTarget.getAttribute("data-gnId");
        var from = gardener.GNEventManager.getEventFrom(e.type,gnId);
        if(!from){
            console.log("onTouchEventHandler is error.",from,gnId+"_"+ e.type);
            return false;
        }
        var fromTarget = GNObjectManager.getGNObject(gnId);
        //当target是一个GNObject时，事件的gnTarget指向他，否则为空
        if(target.hasAttribute('data-gnId')){
            try{
                e.gnTarget = GNObjectManager.getGNObject(target.getAttribute('data-gnId'));
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
    //=========================GNObjectPool==============================================
    /**
     * 适用于GNObject体系的对象池
     * @param ClassName {String} 类名全名称，来自于对象的className属性或者其它
     * @param option {Object} 配置信息
     * @constructor
     * @return {Object}
     */
    function GNObjectPool(ClassName,option){
        gardener.GNObject.call(this);
        this.className  = "gardener.GNObjectPool";
        this.superClass = gardener.GNObject.prototype;
        if(!ClassName || typeof ClassName !== "string"){
            console.log("init objectPool is error.");
            return null;
        }
        this.classItemName = ClassName;
        this.ClassItem = gardener.Core.getDefinitionByName(this.classItemName);
        this.objectList = [];
    }

    gardener.Core.inherits(gardener.GNObject,GNObjectPool);

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
        GNObject.prototype.terminalClear.call(this,false);
    };

    opp.initialize = function(option){


    };

    /**
     * 从对象池中获取一个对象
     * @returns {*}
     */
    opp.gainFromPool = function(){
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
                obj.terminalClear();
                gardener.GNObjectManager.removeGNObject(obj);
            }
        }
    };

    //=================================================================
    return {
        Core:Core,
        GNEventManager:GNEventManager,
        GNObjectManager:GNObjectManager,
        GNFrameManager:GNFrameManager,
        TouchEvent:TouchEvent,
        GNObject:GNObject,
        GNPart:GNPart,
        GNInteractivePart:GNInteractivePart
    };
})(window,jQuery,Hammer);
//===========================GNButton==================================
/**
 * GNButton类
 */
gardener.GNButton = (function(window,$,Hammer,gardener,undefined){
    "use strict";
    /**
     * 按钮类
     * @constructor
     */
    function GNButton(){
        gardener.GNInteractivePart.call(this);
        this.className = "gardener.GNButton";
        this.superClass = gardener.GNInteractivePart.prototype;
    }
    gardener.Core.inherits(gardener.GNInteractivePart,GNButton);
    /**
     *
     * @param usePool
     */
    GNButton.prototype.terminalClear = function(usePool){
        gardener.GNInteractivePart.prototype.terminalClear.call(this,usePool);
    };

    return GNButton;

})(window,jQuery,Hammer,gardener);
//====================GNContainer=================================================
/**
 * 具有交互功能的容器类
 */
gardener.GNContainer = (function(window,$,Hammer,gardener,undefined){
    "use strict";
    /**
     * 具有交互功能的容器类
     * @constructor
     */
    function GNContainer(){
        gardener.GNInteractivePart.call(this);
        this.className = "gardener.GNContainer";
        this.superClass = gardener.GNInteractivePart.prototype;
    }
    gardener.Core.inherits(gardener.GNInteractivePart,GNContainer);
    /**
     *
     * @param usePool
     */
    GNContainer.prototype.terminalClear = function(usePool){
        gardener.GNInteractivePart.prototype.terminalClear.call(this,usePool);
    };

    return GNContainer;

})(window,jQuery,Hammer,gardener);


gardener.GNObjectPool = (function(window,gardener,undefined){
    "use strict";

})(window,gardener);
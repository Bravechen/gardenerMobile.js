/**
 * stage对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNStage = (function(window,$,gn,undefined){
    "use strict";

    var PrivateClass = {
        useKey:"gnStageCanUse"
    };

    var StageEvent = gn.StageEvent;

    function GNStage(useKey){
        if(useKey!==PrivateClass.useKey){
            return;
        }
        gn.GNObject.call(this);
        this.className = "gardener.GNStage";
        this.superClass = gn.GNObject.prototype;

        this.win$ = null;
        this.doc$ = null;
        this.bodyElement = null;
        this.viewW = 0;
        this.viewH = 0;
        this.viewX = 0;
        this.viewY = 0;

        this.docInitialized = false;
        this.winCompleted = false;

        /*@private use key*/
        this._useKey = useKey;
        /*@private executeList*/
        this._executeList = null;
    }

    gn.Core.inherits(gn.GNObject,GNStage);

    /**
     * 初始化
     */
    GNStage.prototype.initialize = function(){
        if(this.initialized)
            return;

        this._addExecuteHandler(gn.StageEvent.DOC_INIT,addInitEvent);
        this._addExecuteHandler(gn.StageEvent.WIN_COMPLETE,addWinLoadEvent);
        this._addExecuteHandler(gn.StageEvent.RESIZE,addResizeEvent);
        this._addExecuteHandler(gn.StageEvent.SCROLL,addScrollEvent);

        this.win$ = $(window);
        $(document).ready(docInitialize);
        this.win$.on(StageEvent.WIN_COMPLETE,winComplete);
        this.initialized = true;
    };
    /**
     * 添加事件侦听
     * @param type {String} [necessary] 事件类型
     * @param handler {Function} [necessary] 处理函数
     * @param subscriberId {String} [necessary] 处理函数作用域绑定的this指向的GN对象
     * @param data {Object} [optional] 希望会发送至处理函数中的对象
     */
    GNStage.prototype.addEventListener = function(type,handler,subscriberId,data){
        if(typeof type !== "string" || handler==null || typeof handler !== "function" || typeof subscriberId !== "string"){
            console.log("At GNStage's addEventListener,the params are error.");
            return;
        }
        this._executeList = this._executeList || {};
        var canAddEvent = this._executeList[type].call(this,type);
        if(canAddEvent){
            gn.EM.addEventFrom(type,this.gnId,handler,{scope:subscriberId,data:data});
        }else{
            //add log
        }
    };
    /**
     * 移除事件侦听
     * @param type {String} [necessary] 事件类型
     * @param handler {Function} [necessary] 处理函数
     */
    GNStage.prototype.removeEventListener = function(type,handler){
        if(gn.EM.hasEventFrom(type,this.gnId)){
            gn.EM.removeEventFrom(type,this.gnId,handler);
        }
        if(!gn.EM.hasEventFrom(type,this.gnId)){
            if(type === StageEvent.SCROLL){
                this.win$.off(StageEvent.SCROLL);
            }
            if(type === StageEvent.RESIZE){
                this.win$.off(StageEvent.RESIZE);
            }
        }
    };

    //==================private====================

    /**
     * 添加执行方法
     * @param type {String} [necessary] 事件类型
     * @param handler {Function} [necessary] 处理函数
     * @param useKey {String} [necessary] 内部使用验证标识
     * @private
     */
    GNStage.prototype._addExecuteHandler = function(type,handler,useKey){
        if(useKey!==PrivateClass.useKey){
            return;
        }
        this._executeList[type] = handler;
    };

    /**
     * 处理添加滚动事件
     * @param type {String} [necessary] 事件类型
     */
    function addScrollEvent(type){
        if(!gn.EM.hasEventFrom(type,stage.gnId)){
            stage.win$.on(StageEvent.SCROLL,onWinScroll);
        }
        return true;
    }

    /**
     * 处理添加初始化事件
     * @param type {String} [necessary] 事件类型
     * @returns {boolean}
     */
    function addInitEvent(type){
        return !stage.initialized;
    }

    /**
     * 处理添加win加载完毕事件
     * @param type {String} [necessary] 事件类型
     * @returns {boolean}
     */
    function addWinLoadEvent(type){
        return !stage.winCompleted;
    }

    /**
     * 处理添加改变尺寸事件
     * @param type {String} [necessary] 事件类型
     * @returns {boolean}
     */
    function addResizeEvent(type){
        if(!gn.EM.hasEventFrom(type,stage.gnId)){
            stage.win$.on(StageEvent.RESIZE,onWinResize);
        }
        return true;
    }

    //======================================
    /**
     * 文档初始化事件
     */
    function docInitialize(){
        stage.bodyElement = window.document.body;
        stage.doc$ = $(document);
        stage.docInitialized = true;

        doDispatchEvent(StageEvent.DOC_INIT,stage.gnId,true);
        gn.EM.removeEventFrom(StageEvent.DOC_INIT,stage.gnId);
    }

    /**
     * 资源加载完成事件
     * @param e
     */
    function winComplete(e){
        stage.viewW = window.screen.width;
        stage.viewH = window.screen.height;
        stage.winCompleted = true;

        doDispatchEvent(StageEvent.WIN_COMPLETE,stage.gnId,true,e);
        gn.EM.removeEventFrom(StageEvent.WIN_COMPLETE,stage.gnId);
        stage.win$.off(StageEvent.WIN_COMPLETE);
    }

    /**
     * 屏幕滚动事件
     * @param e
     */
    function onWinScroll(e){
        stage.viewX = document.body.scrollLeft;
        stage.viewY = document.body.scrollTop;
        doDispatchEvent(StageEvent.SCROLL,stage.gnId,false,e);
    }

    /**
     * 尺寸改变事件
     * @param e
     */
    function onWinResize(e){
        stage.viewW = window.screen.width;
        stage.viewH = window.screen.height;
        doDispatchEvent(StageEvent.SCROLL,stage.gnId,false,e);
    }

    /**
     * 执行分派事件
     * @param type {String} [necessary] 事件类型
     * @param gnId {String} [necessary] 注册事件的gn对象id
     * @param isOnce {Boolean} [optional] 是否只触发一次
     * @param srcEvent {Object} [optional] dom事件
     */
    function doDispatchEvent(type,gnId,isOnce,srcEvent){
        var from = gn.EM.getEventFrom(type,gnId);
        if(!from){
            //add log
            return;
        }
        isOnce = !!isOnce;
        var len = from.handlers.length;
        var item,itemData,event;
        while(len>0){
            itemData = isOnce?from.datas.pop():from.datas[len-1];
            item = isOnce?from.handlers.pop():from.handlers[len-1];
            len--;
            event = {};
            event.srcEvent = srcEvent;
            event.type = type;
            event.target = gn.OM.getGNObject(itemData.scope);
            event.data = itemData.data;
            if(event.target){
                item.call(event.target,event);
            }else{
                item(event);
            }
        }
    }

    //======================================

    var stage;

    return {
        /**
         * 获取GNStage对象的单例
         * @returns {*}
         */
        getInstance:function(){
            if(!stage){
                stage = new GNStage(PrivateClass.useKey);
            }
            return stage;
        }
    }

})(window,jQuery,gardener);

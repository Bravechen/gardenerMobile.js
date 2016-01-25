/**
 * stage对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNStage = (function(window,$,gn,undefined){
    "use strict";

    var PrivateClass = {
        useKey:"gnStageCanUse",
        initList:null,
        winLoadList:null,
        scrollList:null,
        resizeList:null
    };


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
     *
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
        this.win$.on('load',winComplete);
        this.initialized = true;
    };
    /**
     *
     * @param type
     * @param handler
     * @param subscriberId
     * @param data
     */
    GNStage.prototype.addEventListener = function(type,handler,subscriberId,data){
        if(typeof type !== "string" || handler==null || typeof handler !== "function" || typeof subscriberId !== "string"){
            console.log("At GNStage's addEventListener,the params are error.");
            return;
        }
        this._executeList = this._executeList || {};
        this._executeList[type].call(this,true,type,handler,subscriberId,data);
    };

    GNStage.prototype.removeEventListener = function(type,handler){

    };

    /**
     * 添加执行方法
     * @param type
     * @param handler
     * @param useKey
     * @private
     */
    GNStage.prototype._addExecuteHandler = function(type,handler,useKey){
        if(useKey!==PrivateClass.useKey){
            return;
        }
        this._executeList[type] = handler;
    };

    //======================================

    /**
     *
     */
    function addScrollEvent(addOrRemove,type,handler,subscriberId,data){

    }

    /**
     *
     */
    function addInitEvent(addOrRemove,type,handler,subscriberId,data){

    }

    /**
     *
     */
    function addWinLoadEvent(addOrRemove,type,handler,subscriberId,data){
        if(stage.winCompleted){
            return;
        }

    }

    /**
     *
     */
    function addResizeEvent(addOrRemove,type,handler,subscriberId,data){

    }


    //======================================
    /**
     *
     */
    function docInitialize(){
        stage.bodyElement = window.document.body;
        stage.doc$ = $(document);
        stage.dispatchEvent(gn.StageEvent.DOC_INIT);
        stage.docInitialized = true;
    }

    /**
     *
     */
    function winComplete(e){
        stage.viewW = window.screen.width;
        stage.viewH = window.screen.height;
        e.isDOMEvent = true;
        stage.dispatchEvent(gn.StageEvent.WIN_COMPLETE,e);
        stage.winCompleted = true;
    }

    function onWinScroll(e){

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

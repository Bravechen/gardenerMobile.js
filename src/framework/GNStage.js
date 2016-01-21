/**
 * stage对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNStage = (function(window,$,gn,undefined){
    "use strict";

    var PrivateClass = {
        useKey:"gnStageCanUse"
    };

    function GNStage(useKey){
        if(useKey!==PrivateClass.useKey){
            return;
        }
        gn.GNWatcher.call(this);
        this.className = "gardener.GNStage";
        this.superClass = gn.GNWatcher.prototype;

        this.win$ = null;
        this.doc$ = null;
        this.bodyElement = null;
        this.viewW = 0;
        this.viewH = 0;
        this.viewX = 0;
        this.viewY = 0;

        this.scrollList = null;
        this.resizeList = null;

        this.docInitialized = false;
        this.winCompleted = false;
        /*@private use key*/
        this._useKey = useKey;
    }

    gn.Core.inherits(gn.GNWatcher,GNStage);

    /**
     *
     */
    GNStage.prototype.initialize = function(){
        if(this.initialized)
            return;
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
    GNStage.prototype.addWatch = function(type,handler,subscriberId,data){
        if(type === gn.StageEvent.SCROLL){
            this.scrollList = this.scrollList || [];
            if(this.scrollList.indexOf(handler)<0){
                this.scrollList.push({id:subscriberId,callback:handler});
            }
        }

        if(type === gn.StageEvent.RESIZE){

        }

        gn.GNWatcher.prototype.addWatch.call(this,type,handler,subscriberId,data);
    };

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

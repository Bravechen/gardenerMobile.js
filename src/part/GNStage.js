/**
 * stage对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNStage = (function(window,gn,undefined){
    "use strict";

    function GNStage(){
        gn.GNContainer.call(this);
        this.className = "gardener.GNStage";
        this.superClass = gn.GNContainer.prototype;

        this.viewW = 0;
        this.viewH = 0;
        this.viewX = 0;
        this.viewY = 0;
    }

    gn.Core.inherits(gn.GNContainer,GNStage);

    var win$,doc$;
    var sp = GNStage.prototype;

    sp.initialize = function(){
        var body = window.document.body;
        gn.GNContainer.prototype.initialize.call(this,body);
        win$ = $(window);
        doc$ = this.element$;
    };

    sp.addEventListener = function(type,handler,useCapture){

        if(type===gn.StageEvent.INIT){

        }

        if(type===gn.StageEvent.WIN_COMPLETE){

        }

    };

    sp.removeEventListener = function(type,handler,useCapture){

    };

    //======================================

    var stage;

    return {
        /**
         * 获取一个GNStage对象
         * @returns {GNStage}
         */
        getInstance:function(){
            if(!stage){
                stage = new GNStage();
            }
            return stage;
        }
    };

})(window,gardener);

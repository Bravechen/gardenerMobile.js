/**
 * 全局管理对象。<br />
 * 使用全局管理对象可以作为框架的根级入口文件。并且集成了有关Window和document等对象信息。
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNGlobalManager = (function(window,$,gn,undefined){
    "use strict";

    var gnStage = gn.GNStage.getInstance();


    window.gardener.GM = {
        stage:gnStage
    };

    return window.gardener.GM;

})(window,jQuery,gardener);

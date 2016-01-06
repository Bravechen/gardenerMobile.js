/**
 * 具有交互功能的容器类
 * Created by admin on 2016/1/6.
 */
gardener.GNContainer = (function(window,gn,undefined){
    "use strict";
    /**
     * 具有交互功能的容器类
     * @constructor
     */
    function GNContainer(){
        gn.GNInteractivePart.call(this);
        this.className = "gardener.GNContainer";
        this.superClass = gn.GNInteractivePart.prototype;
    }
    gn.Core.inherits(gn.GNInteractivePart,GNContainer);
    /**
     * 终极清理
     * @param usePool
     */
    GNContainer.prototype.terminalClear = function(usePool){
        gn.GNInteractivePart.prototype.terminalClear.call(this,usePool);
    };

    return GNContainer;

})(window,gardener);
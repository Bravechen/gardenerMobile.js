/**
 * GNButton类
 * Created by admin on 2016/1/6.
 */
gardener.GNButton = (function(window,$,gn,undefined){
    "use strict";

    function GNButton(){
        gn.GNInteractivePart.call(this);
        this.className = "gardener.GNButton";
        this.superClass = gn.GNInteractivePart.prototype;
    }
    gn.Core.inherits(gn.GNInteractivePart,GNButton);
    /**
     * 终极清理
     * @param usePool
     */
    GNButton.prototype.terminalClear = function(usePool){
        gn.GNInteractivePart.prototype.terminalClear.call(this,usePool);
    };

    return GNButton;

})(window,jQuery,gardener);

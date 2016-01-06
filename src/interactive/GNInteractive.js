/**
 * 交互类基类
 * Created by admin on 2016/1/6.
 */
gardener.GNInteractive = (function(window,gn,undefined){
    "use strict";

    function GNInteractive(){
        gn.GNObject.call(this);
        this.className = "gardener.GNInteractive";
        this.superClass = gn.GNObject.prototype;
    }

    gn.Core.inherits(gn.GNObject,GNInteractive);

    return GNInteractive;

})(window,gardener);
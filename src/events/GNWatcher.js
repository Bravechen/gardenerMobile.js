/**
 * Created by admin on 2016/1/15.
 */
gardener.GNWatcher = (function(window,gn){
    "use strict";

    function GNWatcher(){
        gn.GNObject.call(this);
        this.className = "gardener.GNWatcher";
        this.superClass = gn.GNObject.prototype;
    }

    gn.Core.inherits(gn.GNObject,GNWatcher);

    GNWatcher.prototype.addEventListener = function(type,handler){

    };

    GNWatcher.prototype.removeEventListener = function(){

    };

    GNWatcher.prototype.hasEvent = function(){

    };

    GNWatcher.prototype.dispatchEvent = function(){

    };

    return GNWatcher;

})(window,gardener);

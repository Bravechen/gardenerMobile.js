/**
 * Created by admin on 2016/1/15.
 */
gardener.GNEventDispatcher = (function(window,gn){
    "use strict";

    function GNEventDispatcher(){
        gn.GNObject.call(this);
        this.className = "gardener.GNEventDispatcher";
        this.superClass = gn.GNObject.prototype;
    }

    gn.Core.inherits(gn.GNObject,GNEventDispatcher);

    GNEventDispatcher.addEventListener = function(type,handler){

    };

    GNEventDispatcher.removeEventListener = function(){

    };

    GNEventDispatcher.hasEvent = function(){

    };

    GNEventDispatcher.dispatchEvent = function(){

    };

    return GNEventDispatcher;

})(window,gardener);

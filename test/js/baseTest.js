/**
 * Created by admin on 2016/2/24.
 */
this.test = this.test || {};

test.Box = (function(window,$,gn){
    "use strict";

    function Box(){
        gn.GNObject.call(this);
        this.className = "test.Box";
        this.superClass = gn.GNObject.prototype;
    }

    gn.Core.inherits(gn.GNObject,Box);

    Box.prototype.initialize = function(){
        createChildren();
        childrenCreated();
    };

    function createChildren(){

    }

    function childrenCreated(){

    }

    return Box;

})(window,jQuery,gardener);

(function(window,$,gn){
    "use strict";

})(window,jQuery,gardener);
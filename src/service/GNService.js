/**
 * 服务类基类
 * Created by admin on 2016/1/6.
 */
gardener.GNService = (function(window,gn,undefined){

    function GNService(){
        gn.GNObject.call(this);
        this.className = "gardener.GNService";
        this.superClass = gn.GNObject.prototype;
    }

    gn.Core.inherits(gn.GNObject,GNService);

    return GNService;

})(window,gardener);
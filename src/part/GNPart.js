/**
 * 零件类，所有的显示层对象均继承此对象
 * Created by Brave on 16/1/2.
 */
gardener.GNPart = (function(window,$,gn,undefined){
    "use strict";

    function GNPart(){
        gn.GNObject.call(this);
        this.className = "gardener.GNPart";
        this.superClass = gn.GNEventDispatcher.prototype;   //超类原型
        this.element = null;    //HTMLElement
        this.element$ = null;   //jQuery
        this.stage = null;      //本域的全局GNStage对象
    }
    gn.Core.inherits(gn.GNObject,GNPart); //实现继承
    /**
     * 输出对象字符串表示
     * @returns {String}
     */
    GNPart.prototype.output = function(){
        return "["+this.className+","+((!!this.gnId)?this.gnId:"not initialized")+"]";
    };
    /**
     * 初始化
     * @param element {HTMLElement} DOM对象
     */
    GNPart.prototype.initialize = function(element){
        if(this.initialized)
            return false;
        if(element){
            var id = element.getAttribute('data-gnId');
            if(!!id){
                gn.GNObjectManager.changeGNId(id,this.gnId);
            }
            this.element = element;         //HTMLElement
            this.element$ = $(element);     //jQuery
            this.stage = gn.GNGlobalManager.stage;
        }else{
            console.log("The param of element is null.");
            return false;
        }
        return true;
    };
    /**
     * 最终清理
     * @param usePool {Boolean}
     */
    GNPart.prototype.terminalClear = function(usePool){
        this.element = null;
        this.element$ = null;
        gn.GNObject.prototype.terminalClear.call(this,usePool);
    };
    /**
     *
     * @param coordinateType
     */
    GNPart.prototype.getBounds = function(coordinateType){

    };
    return GNPart;
})(window,jQuery,gardener);

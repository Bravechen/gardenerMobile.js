
/**
 * 帧渲染对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNFrameManager = (function(window,undefined){
    "use strict";

    var PrivateClass = {
        handlerList:[]
    };

    var initialized = false,frameRate = 60,animateElement,animateRequest;
    /**
     * 初始化
     */
    function initialize(){
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if(!window.requestAnimationFrame){
            window.requestAnimationFrame = function (callBack) {
                return setTimeout(callBack, 1000 / frameRate);
            }
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
        initialized = true;
    }
    /**
     * 添加帧更新监听
     * @param handler   {Function} 处理器回调
     * @param element   {HTMLElement} DOM元素
     */
    function addFrameListener(handler,element){
        if (typeof handler !== "function" || !element instanceof HTMLElement) {
            console.log("The params are error.",handler,element);
            return;
        }
        if(!initialized){
            initialize();
        }
        animateElement = element;
        PrivateClass.handlerList.push(handler);
        animateRequest = window.requestAnimationFrame(drawFrame,element);
    }
    /**
     * 移除帧更新监听
     */
    function removeFrameListener(handler){
        var list = PrivateClass.handlerList;
        var index = list.indexOf(handler);
        if(index!==-1){
            list.splice(index,1);
        }
        if(list.length<=0 && !!animateRequest){
            window.cancelAnimationFrame(animateRequest);
        }
    }
    /**
     * @private
     * 提交帧更新请求
     * **/
    function drawFrame() {
        animateRequest = window.requestAnimationFrame(drawFrame, animateElement);
        for(var i= 0,item;(item=PrivateClass.handlerList[i])!=null;i++){
            item();
        }
    }
    return {
        frameRate:frameRate,
        addFrameListener:addFrameListener,
        removeFrameListener:removeFrameListener
    };
})(window);
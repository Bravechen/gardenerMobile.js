
/**
 * 帧渲染对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNFrameManager = (function(window,undefined){
    "use strict";

    var PrivateClass = {
        handlerList:{length:0}
    };
    /**
     * IFrameFrom{
     *  id:String,
     *  handler:Function
     *  data:Object
     * }
     *
     **/

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
    //============================public=======================================
    /**
     * 添加帧更新监听
     * @param handler {Function} [necessary] 处理器回调
     * @param element {HTMLElement} [optional] DOM元素
     * @param data {Object} [optional] 需要发送到针处理器中的数据集合
     */
    function addFrameListener(handler,element,data){
        if (typeof handler !== "function" || !element instanceof HTMLElement) {
            console.log("The params are error.",handler,element);
            return;
        }
        if(!initialized){
            initialize();
        }
        animateElement = element instanceof HTMLElement?element:document.body;
        var id,frameFrom;
        if(!handlerInList(handler)){
            frameFrom = {};
            frameFrom.id = (new Date().getTime())+Math.toFixed(Math.random()*1000,2);
            frameFrom.handler = handler;
            frameFrom.data = data;
            PrivateClass.handlerList[frameFrom.id] = frameFrom;
        }else{
            return;
        }

        if(!animateRequest){
            animateRequest = window.requestAnimationFrame(drawFrame,element);
        }

        return frameFrom.id;
    }
    /**
     * 移除帧更新监听
     * @param handler {Function} [necessary] 被注册过的处理器
     */
    function removeFrameListener(handler){
        var list = PrivateClass.handlerList;
        var key = handlerInList(handler);
        if(!!key){
            var frameFrom = list[key];
            frameFrom.id = null;
            frameFrom.handler = null;
            frameFrom.data = null;
            delete PrivateClass.handlerList[key];
        }
        if(list.length<=0 && !!animateRequest){
            window.cancelAnimationFrame(animateRequest);
            animateRequest = null;
            animateElement = null;
        }
    }

    /**
     * 暂停对一个处理器的帧监听
     * @param handlerId {String} [necessary]
     */
    function pauseFrameListener(handlerId){

    }

    function continueFrameListener(handlerId){

    }

    //============================================================
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

    /**
     * 处理器是否已被注册在列表中
     * @param handler
     * @returns {boolean}
     */
    function handlerInList(handler){
        var list = PrivateClass.handlerList;
        for(var key in list){
            if(list.hasOwnProperty(key) && list[key].handler === handler){
                return key;
            }
        }
        return false;
    }

    //=========================================
    return {
        frameRate:frameRate,
        addFrameListener:addFrameListener,
        removeFrameListener:removeFrameListener
    };
})(window);
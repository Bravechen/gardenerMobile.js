/**
 * 事件管理对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNEventManager = (function(undefined){
    "use strict";

    var PrivateClass = {
        eventFromList:{}
    };
    /**
     * 接口：事件源对象
     * IFrom{
     *  type,       //事件类型
     *  gnObj,      //gn对象
     *  handler,    //事件处理器
     *  data        //自定义对象，会随着参数发送至事件处理器
     * }
     */

    /**
     * 添加一个事件源对象
     * @param type {String}
     * @param gnId {String}
     * @param handler {Function}
     * @param data {Object}
     */
    function addEventFrom(type,gnId,handler,data){
        var id = gnId+"_"+type;
        var list = PrivateClass.eventFromList;
        var item = list[id] || {has:false};
        item.type = type;
        item.gnId = gnId;
        item.handler = handler;
        item.data = data;
        if(!item.has){
            list[id] = item;
            item.has = true;
        }
    }
    /**
     * 移除一个事件源对象
     * @param type
     * @param gnId
     * @param handler
     * @returns {boolean}
     */
    function removeEventFrom(type,gnId,handler){
        var id = gnId+"_"+type;
        var list = PrivateClass.eventFromList;
        var from = list[id];
        if(!from){
            return false;
        }
        from.type = null;
        from.gnId = null;
        from.handler = null;
        from.data = null;
        from.has = null;
        delete PrivateClass.eventFromList[id];
        return true;
    }
    /**
     * 获取一个事件源对象
     * @param type
     * @param gnId
     * @returns {*}
     */
    function getEventFrom(type,gnId){
        return PrivateClass.eventFromList[gnId+"_"+type];
    }

    return {
        addEventFrom:addEventFrom,
        removeEventFrom:removeEventFrom,
        getEventFrom:getEventFrom
    };
})();

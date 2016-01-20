/**
 * 事件管理对象
 * Created by Brave Chen on 2016/1/15.
 */
gardener.GNEventManager = (function (undefined) {
    "use strict";

    var PrivateClass = {
        eventFromList: {}
    };
    /**
     * 接口：事件源对象
     * IFrom{
     *  type,           //事件类型
     *  gnId,           //gn对象的id
     *  handlerList,    //事件处理器队列
     *  dataList        //自定义对象队列，会随着参数发送至事件处理器。
     * }
     */

    /**
     * 添加一个事件源对象
     * @param type {String}
     * @param gnId {String}
     * @param handlers {Function}
     * @param datas {Object}
     */
    function addEventFrom(type, gnId, handler, data) {
        var id = gnId + "_" + type;
        var list = PrivateClass.eventFromList;
        var item = list[id] || { has: false };
        var handlers,datas,index;
        if(!item.has){
            item.type = type;
            item.gnId = gnId;
            item.handlers = [];
            item.handlers.push(handler);
            item.datas = [];
            item.datas.push(!data?false:data);
        }else{
            handlers = item.handlers;
            datas = item.datas;
            if(handlers.indexOf(handler)>-1){
                index = handlers.indexOf(handler);
                if(data){
                    datas[index] = data;
                }
            }else{
                handlers.push(handler);
                datas.push(!data?false:data);
            }
        }
    }
    /**
     * 移除一个事件源对象
     * @param type
     * @param gnId
     * @param handler
     * @returns {boolean}
     */
    function removeEventFrom(type, gnId, handler) {
        var id = gnId + "_" + type;
        var list = PrivateClass.eventFromList;
        var from = list[id];
        if (!from) {
            return false;
        }
        var list = from.handlers;
        var dataList = from.datas;
        var index = list.indexOf(handler);
        if(index>-1){
            list.splice(index,1);
            dataList.splice(index,1);
        }else{
            return false;
        }
        if(list.length===0){
            from.type = null;
            from.gnId = null;
            from.handlers = null;
            from.datas = null;
            from.has = null;
            delete PrivateClass.eventFromList[id];
        }        
        return true;
    }
    /**
     * 获取一个事件源对象
     * @param type
     * @param gnId
     * @returns {*}
     */
    function getEventFrom(type, gnId) {
        return PrivateClass.eventFromList[gnId + "_" + type];
    }

    return {
        addEventFrom: addEventFrom,
        removeEventFrom: removeEventFrom,
        getEventFrom: getEventFrom
    };
})();

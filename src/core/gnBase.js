/**
 * @author Brave Chen on 2015.12.10
 * @version alpha v0.0.0 开发各项功能
 * @dependence jQuery v2.1.4,Hammer v2.0.4
 */
window.gardener = (function(window,undefined){
    "use strict";
    /**版本号 */
    var version = "alpha 0.0.0";
    
    /**
     * 私有类，提供不公开的工具方法
     */
    var PrivateClass = {
        /**
         * 利用寄生的方式创建对象
         * @param  {Function} original ԭ原型
         * @return {Object} 利用寄生方式创建的对象实例
         */
        createObject:function(original){
            var T = function T(){};
            T.prototype = original;
            return new T();
        }
    };
    //========================UUID=============================
    var UUID = {};
    /**
     * Returns an unsigned x-bit random integer.
     * @param {int} x A positive integer ranging from 0 to 53, inclusive.
     * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
     */
    UUID._getRandomInt = function(x) {
        if (x <0) return NaN;
        if (x <= 30) return (0 | Math.random() * (1 << x));
        if (x <= 53) return (0 | Math.random() * (1 << 30))
            + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
        return NaN;
    };
    /**
     * Returns a function that converts an integer to a zero-filled string.
     * @param {int} radix
     * @returns {Function}
     */
    UUID._getIntAligner = function(radix) {
        return function(num, length) {
            var str = num.toString(radix), i = length - str.length, z = "0";
            for (; i > 0; i >>>= 1, z += z) { if (i & 1) { str = z + str; } }
            return str;
        };
    };
    UUID._hexAligner = UUID._getIntAligner(16);
    //============================Core================================================
    /**
     * 核心类，提供一些基础方法
     */
    var Core = {
        /**
         * 实现继承
         * @param  {Object} SuperClass 超类
         * @param  {Object} SubClass   子类
         * @return {void}
         */
        inherits:function(SuperClass,SubClass){
            if(!SuperClass || !SubClass)
                return;
            var prototype = Object.create?Object.create(SuperClass.prototype):PrivateClass.createObject(SuperClass.prototype);
            prototype.constructor = SubClass;
            SubClass.prototype = prototype;
        },
        /**
         * 根据全名称创建实例
         * @param  {String} className 类的全名称
         * @return {Object}
         */
        createInstance:function(className){
            var ary = className.split('.');
            var ClassItem = window[ary[0]];
            for(var i=1,len=ary.length;i<len;i++){
                ClassItem = ClassItem[ary[i]];
            }
            return new ClassItem();
        },
        /**
         * 返回 name 参数指定的类的类对象引用
         * @param name 类的名称
         * @returns {*}
         */
        getDefinitionByName:function(name){
            var ary = name.split('.');
            var ClassItem = window[ary[0]];
            for(var i=1,len=ary.length;i<len;i++){
                ClassItem = ClassItem[ary[i]];
            }
            return typeof ClassItem === "function"?ClassItem:null;
        },
        /**
         * 获得一个UUID
         * @return {String} UUID
         */
        getUUID:function(){
            var rand = UUID._getRandomInt, hex = UUID._hexAligner;
            return  hex(rand(32), 8)          // time_low
                + "-"
                + hex(rand(16), 4)          // time_mid
                + "-"
                + hex(0x4000 | rand(12), 4) // time_hi_and_version
                + "-"
                + hex(0x8000 | rand(14), 4) // clock_seq_hi_and_reserved clock_seq_low
                + "-"
                + hex(rand(48), 12);        // node
        }
    };

    return {
        Core:Core,
        VERSION:version,
        /**debug模式 */
        debug:false
    };
})(window);
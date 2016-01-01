# gardenerMobile.js
为teacherfans.com移动版开发的JS组件库

## 依赖库
- JQuery.js v2.1.4
- Hammer.js v2.0.4

## 五个机制
1.  **对象管理机制**

    由GNObjectManager实现
    
2. **事件管理机制**

    由GNEventManager实现
    
3. **对象池管理机制**

    由GNPoolManager实现
    
4. **日志管理机制**

    由GNLogManager实现

5. **清理链条机制**

    由各个GN对象的`terminalClear()`实现
    

## 继承架构
    GNObject
    |-----------|-----------------|------------|
    GNPart      GNInteractive     GNService    GNObjectPool
    |
    GNInteractivePart
    |-------------|
    GNContainer   GNButton

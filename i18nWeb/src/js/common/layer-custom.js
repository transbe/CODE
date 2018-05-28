/**
 * @file
 * @author  lizhenzhen
 * @desc 自定义layer弹框配置
 * @date  2017-04-02
 * @last modified by lizhenzhen
 * @last modified time 2017-06-14 14:03:08
 */

// iframe弹窗的样式
layer.config({
    skin: 'self-iframe'
});
// 一般提示
layer.config({
    skin: 'self'
});
// 成功提示
layer.config({
    skin: 'self-msg'
});
// 失败提示
layer.config({
    skin: 'self-alert'
});


/*
 * 使用方式:
 * 1、引入common.css
 * 2、引入jQuery
 * 3、引入layer.js
 * 4、引入layer-custom.js
 * 5、在需要的地方设置皮肤的skin
 */
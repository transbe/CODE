/**
 * @file
 * @author: lizz
 * @desc: 自定义tab切换
 * @date: 2017-11-12 13:07:38
 * @last modified by: lizz
 * @last modified time: 2017-11-12 13:07:45
 */

$(function(){
    changePageStyle("../.."); // 切换主题
    
    setHeight();
    $(window).bind("resize", setHeight);
})
/**
 * @desc 设置tab切换内容的高度
 */
function setHeight(){
    // var contentBoxPadding = parseInt($(".content-box").css("padding"));
    var winH = $("body").height();
    $(".iframe-box").height(winH-10);
    var iframeBoxH = $(".iframe-box").height(),
        navTabsH = $(".nav-tabs").height();
        // navTabsBorder = parseInt($(".nav-tabs").css("border-bottom"));
    $(".tab-content").height(iframeBoxH-navTabsH -1);
}
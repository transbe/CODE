/**
 * @file
 * @author  gaohui
 * @desc 查看PDF
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:25:15
 */
var fileId = getParameter('fileId'); //获取文件ID
var layerHeight = getParameter('layerHeight'); // 当前弹出层高度
var layerWidth = getParameter('layerWidth'); // 当前弹出层宽度
var HEIGHT_SPACING = 100; // 初始化内容高度间距
var WIDTH_SPACING = 20; // 初始化内容宽度间距
var WINDOW_SPACING = 20; // 窗口最大化时高度间距
var staticIframeWidth; // 内容iframe宽度
$(function () {
    getPdfUrl();
});

/**
 * @desc 获取报告URL
 */
function getPdfUrl() {
    $.ajax({
        url: '/cloudlink-core-file/file/getUrlByFileId?fileId=' + fileId,
        method: 'get',
        success: function (res) {
            if (res.success == 1) {
                var pdfUrl = res.rows[0].fileUrl;
                document.getElementById("viewPdf").href = pdfUrl;
                setSize();
            }
        },

    });
}

/**
 * @desc 设置iframe大小
 */
function setSize() {
    var contentHeight = layerHeight - HEIGHT_SPACING;
    var contentWidth = layerWidth - WIDTH_SPACING;
    var windowWidth = $(window).width();
    if (layerWidth == windowWidth) {
        contentHeight = layerHeight - HEIGHT_SPACING;
        contentWidth = layerWidth - WIDTH_SPACING;
    } else {
        contentHeight = $(window).height() - WINDOW_SPACING;
        contentWidth = $("#containerBox").width();
    }
    $('a.media').media({
        'width': contentWidth + 'px',
        'height': contentHeight + 'px',
    });
    staticIframeWidth = $('iframe').width();
    $(window).on('resize', function () {
        var iframeWidth = $('iframe').width();
        var boxWidth = $("#containerBox").width();
        var windowHeight = $(window).height();
        if (iframeWidth >= staticIframeWidth) {
            $('iframe').css({
                'width': boxWidth + 'px',
                'height': windowHeight - WINDOW_SPACING + 'px'
            });
        } else {
            $('iframe').css({
                'width': contentWidth + 'px',
                'height': contentHeight + 'px'
            });
        }
    });
}
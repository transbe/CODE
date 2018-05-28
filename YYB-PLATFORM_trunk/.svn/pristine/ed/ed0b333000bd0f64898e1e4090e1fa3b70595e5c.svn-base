/**
 * @file
 * @author: zhangyi
 * @desc 查看报告
 * @date: 2017-03-13
 * @last modified by: zhangyi
 * @last modified time: 2017-06-13 10:19:35
 */

var fileId = getParameter('fileId'); // 文件ID
var layerHeight = getParameter('layerHeight'); // 当前弹出层高度
var layerWidth = getParameter('layerWidth'); // 当前弹出层宽度
var HEIGHT_SPACING = 100; // 初始化内容高度间距
var WIDTH_SPACING = 20; // 初始化内容宽度间距
var WINDOW_SPACING = 20; // 窗口最大化时高度间距
var staticIframeWidth; // 内容iframe宽度

$(function () {
    var contentHeight = "";
    var contentWidth = "";
    var windowWidth = $(window).width();
    var href = getReportURL();
    document.getElementById("viewReport").href = href;

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
});

/**
 * @desc 获取报告URL
 * @return {string} reportURL
 */
function getReportURL() {
    var reportURL = "";
    $.ajax({
        url: '/cloudlink-core-file/file/getUrlByFileId',
        type: 'get',
        async: false,
        dataType: 'json',
        data: {
            'fileId': fileId
        },
        success: function (result) {
            if (result.success == 1) {
                reportURL = result.rows[0].fileUrl;
            } else {
                parent.layer.alert('加载报告出错！', {
                    title: '提示',
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: '提示',
                skin: 'self-alert'
            });

        }
    });
    return reportURL;
}

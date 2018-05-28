/**
 * @author: gaohui
 * @date: 2017-3-13
 * @last modified by: zhangyi
 * @last modified time: 2017-5-20
 * @file 查看报告
 */

var reportId = getParameter('objectId'); // 申请报告ID
var reportType = getParameter('reportType'); // 报告类型 1 阴保有效性报告 2阴保完整性报告
var fileId = getParameter('fileId'); // 文件ID
var token = lsObj.getLocalStorage("token");
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
 * @desc 接收报告
 * @method receiveReport
 * @return {*boolean} flag
 */
function receiveReport() {
    var flag = false;
    $.ajax({
        url: '/cloudlink-corrosionengineer/report/audit?token=' + token,
        type: 'post',
        dataType: 'json',
        async: false,
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify({
            "reportType": reportType,
            'reportId': reportId,
            "action": 5,
            'fileId': fileId,
        }),
        success: function (result) {
            if (result.success == 1) {
                parent.layer.msg('接收报告成功！', {
                    time: MSG_DISPLAY_TIME,
                    skin: 'self-success'
                });
                flag = true;
            } else {
                parent.layer.confirm('接收报告失败！', {
                    title: ['提示'],
                    skin: 'self',
                    btn: ['确定']
                });
                flag = false;
            }
        },
        error: function (result) {
            parent.layer.confirm('接收报告失败！', {
                skin: 'self',
                btn: ['确定']
            });
            flag = false;
        }
    });
    return flag;
}

/**
 * @desc 获取报告URL
 * @method getReportURL
 * @return {*String} 文件实际url
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
            }
        }
    });
    return reportURL;
}
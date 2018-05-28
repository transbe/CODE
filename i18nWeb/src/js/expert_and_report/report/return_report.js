/**
 * @file
 * @author: zhangyi
 * @desc 退回报告js
 * @date: 2017-05-20
 * @last modified by: zhangyi
 * @last modified time: 2017-06-12 18:18:15
 */

var reportId = getParameter("objectId"); //报告ID
var reportType = getParameter("reportType"); //报告类型
var fileId = getParameter("fileId"); //文件ID
var reportName = decodeURI(getParameter("reportName")); //报告名称
var token = lsObj.getLocalStorage("token"); //token

$(function() {
    changePageStyle("../../../../src");
    $("#reportName").html(reportName);
    // 表单校验
    $('#reasonForm').bootstrapValidator({
        fields: {
            'opinion': {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        max: 1024
                    }
                }
            }
        }
    });
});

/**
 * @desc 退回报告
 * @returns {boolean} true 成功 false 失败
 */
function returnReport() {
    var result = false;
    var bootstrapValidator = $("#reasonForm").data('bootstrapValidator');
    bootstrapValidator.validate();
    if (bootstrapValidator.isValid()) {
        $.ajax({
            url: '/cloudlink-corrosionengineer/report/audit?token=' + token,
            type: 'post',
            dataType: 'json',
            async: false,
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                "reportType": reportType,
                "reportId": reportId,
                "action": 4,
                "opinion": $("#opinion").val(),
                'fileId': fileId
            }),
            success: function(successResult) {
                if (successResult.success == 1) {
                    parent.layer.msg(getLanguageValue("successful"), {
                        time: MSG_DISPLAY_TIME, // common.js中定义好的layer弹框消失的时间
                        skin: "self-msg"
                    });
                    result = true;
                } else {
                    parent.layer.alert(getLanguageValue("Failure"), {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                    result = false;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                parent.layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                result = false;
            }
        });
    }
    return result;
}
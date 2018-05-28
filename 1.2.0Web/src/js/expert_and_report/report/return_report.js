/**
 * @author: zhangyi
 * @date: 2017-5-20
 * @last modified by: zhangyi
 * @last modified time: 2017-5-20
 * @file 退回报告js
 */

var reportId = getParameter("objectId"); //报告ID
var reportType = getParameter("reportType"); //报告类型
var fileId = getParameter("fileId"); //文件ID
var reportName = decodeURI(getParameter("reportName")); //报告名称
var token = lsObj.getLocalStorage("token"); //token

$(function () {
    $("#reportName").html(reportName);
    // 表单校验
    $('#reasonForm').bootstrapValidator({
        fields: {
            'opinion': {
                validators: {
                    notEmpty: {}
                }
            }
        }
    });
});

/**
 * @desc 退回报告
 * @method returnReport
 * @returns {*Boolean} true 成功 false 失败
 */
function returnReport() {
    var flag = false;
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
            success: function (result) {
                if (result.success == 1) {
                    parent.layer.msg('退回成功！', {
                        time: MSG_DISPLAY_TIME, // common.js中定义好的layer弹框消失的时间
                        skin: "self-success"
                    });
                    flag = true;
                } else {
                    parent.layer.confirm('退回失败！', {
                        btn: ['确定'],
                        skin: 'self'
                    });
                    flag = false;
                }
            },
            error: function (result) {
                parent.layer.confirm('退回失败！', {
                    btn: ['确定'],
                    skin: 'self'
                });
                flag = false;
            }
        });
    }
    return flag;
}
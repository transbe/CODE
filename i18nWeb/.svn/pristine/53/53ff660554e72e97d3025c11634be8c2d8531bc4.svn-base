/**  
 * @file
 * @author: lujingrui
 * @desc: 专家资质信息新增或修改
 * @date: 2017-05-04
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:26:17
 */

var token;
//专家id
var expertId;
//操作类型 新增 或 修改
var operateType;

/**
 * @desc 初始化
 */
$(function () {
    changePageStyle("../..");
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    token = lsObj.getLocalStorage("token")
    expertId = userBo.objectId;
    operateType = getParameter('operateType');
    //修改时，回填数据
    if (operateType == "edit") {
        var objectId = getParameter('objectId');

        var qualificationName = decodeURI(getParameter('qualificationName'));
        var qualificationGrade = decodeURI(getParameter('qualificationGrade'));
        var certificateNum = decodeURI(getParameter('certificateNum'));
        $("#objectId").val(objectId);
        $("#qualificationName").val(qualificationName);
        $("#qualificationGrade").val(qualificationGrade);
        $("#certificateNum").val(certificateNum);
    }
    // addEventForField("qualificationName");
    // addEventForField("qualificationGrade");
    // addEventForField("certificateNum");
});

/**
 * @desc 添加监听事件，当字段为空时不验证，不为空时验证
 * @param {string} field
 */
// function addEventForField(field) {
//     $("#" + field).on("keyup", function(event) {
//         var isEmpty = $(this).val() == '';
//         $('#addExpertCertification').bootstrapValidator('enableFieldValidators', field, !isEmpty)
//             // Revalidate the field when user start typing in the field
//         if ($(this).val().length > 0) {
//             $('#addExpertCertification').bootstrapValidator('validateField', field)
//         }
//     });
// }

/**
 * @desc 表单校验
 */
$('#addExpertCertification').bootstrapValidator({
    fields: {
        qualificationName: {
            // enabled: false,
            validators: {
                notEmpty: {},
                stringLength: {
                    max: 100,
                    min: 1
                },
            }
        },
        qualificationGrade: {
            // enabled: false,
            validators: {
                stringLength: {
                    max: 38
                },
            }
        },
        certificateNum: {
            // enabled: false,
            validators: {
                stringLength: {
                    max: 38
                },
            }
        }
    }
});

/**
 * @desc 新增专家资质
 */
function add() {
    var check = $('#addExpertCertification').data('bootstrapValidator');
    check.validate();
    //保存数据
    if (check.isValid()) {
        var flag = false;
        $.ajax({
            method: "post",
            url: "/cloudlink-corrosionengineer/expert/addQualification?expertId=" + expertId + "&token=" + lsObj.getLocalStorage('token'),
            // contentType: "application/json",
            data: $("#addExpertCertification").serialize(),
            dataType: "json",
            async: false,
            success: function (result) {
                if (result.success == 1) {
                    flag = true;
                } else {
                    layer.alert(result.msg, {
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        });
        return flag;
    } else {
        return false
    }
}

/**
 * @desc 修改专家资质信息
 */
function edit() {
    var check = $('#addExpertCertification').data('bootstrapValidator');
    check.validate();
    //保存数据
    if (check.isValid()) {
        var flag = false;
        $.ajax({
            method: "post",
            url: "/cloudlink-corrosionengineer/expert/updateQualification?expertId=" + expertId + "&token=" + lsObj.getLocalStorage('token'),
            // contentType: "application/json",
            data: $("#addExpertCertification").serialize(),
            dataType: "json",
            async: false,
            success: function (result) {
                if (result.success == 1) {
                    flag = true;
                    layer.msg("修改成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                } else {
                    layer.alert(result.msg, {
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        });
        return flag;
    } else {
        return false
    }
}


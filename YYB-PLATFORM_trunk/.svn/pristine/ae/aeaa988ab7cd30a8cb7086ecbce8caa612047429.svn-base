/**
 * @file 
 * @author: rongfeiyu
 * @desc: 邀请专家的js
 * @Date: 2017-06-12 09:40:41
 * @Last Modified by: rongfeiyu
 * @Last Modified time: 2017-06-12 09:49:36
 */

var token = lsObj.getLocalStorage('token');
// var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));

$(function() {
    $('.form-group input').keydown(function() {
        // console.log(this);
        detectInput();
    });
});

/**
 * @desc 专家的邀请操作
 * @return {*Boolean} true||false
 */
function inviteExpert() {
    var _data = {
        "inviteMode": "1",
        "enterpriseId": ZYAXenterpriseId,
        "orgId": expertsOrgId
    }
    var roleIds = $(".role").val(); //获取角色
    var userName = $("#name").val().trim(); //获取用户名
    var mobileNum = $("#phone").val().trim(); //获取手机号
    var result = false; //判断邀请后layer弹出层是否关闭
    _data.mobileNum = mobileNum;
    _data.signName = "阴保管家";
    _data.roleIds = roleIds;
    _data.userName = userName;
    _data.appId = appId;
    detectInput();
    var check = $('#addForm').data('bootstrapValidator');
    check.validate(); //更新验证的内容
    if (check.isValid()) { //当表单验证无误后，邀请专家
        // alert(roleIds);
        $.ajax({
            url: "/cloudlink-core-framework/invite/inviteUser?token=" + token,
            async: false,
            contentType: "application/json",
            data: JSON.stringify(_data),
            type: "post",
            dataType: "json",
            success: function(data, status) {
                if (data.success == 1) {
                    $("#phone").val("");
                    $("#name").val("");
                    layer.msg("邀请成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: 'self-msg'
                    });
                    result = true;
                } else if (data.code == "PU03039") { //用户已加入该企业
                    $("#tel").val("");
                    $("#addname").val("");
                    getUserId(_data.mobileNum);
                    result = true;
                } else {
                    $("#phone").val("");
                    $("#name").val("");
                    layer.alert("参数异常！", {
                        title: "提示",
                        skin: 'self-alert'
                    });
                    result = false;
                }
            },
            error: function() {
                // console.log(XMLHttpRequest);
                // console.log(textStatus);
                // console.log(errorThrown);
                layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        });
        return result;
    } else { //表单验证不成功，弹出层不关闭
        return false;
    }
};

/**
 * @desc 获取企业应用下被邀请用户ID
 * @param {*String} mobileNum
 */
function getUserId(mobileNum) {
    var _data = {
        "orgId": expertsOrgId,
        "enterpriseId": ZYAXenterpriseId,
        "appId": appId,
        "mobileNum": mobileNum
    };
    $.ajax({
        url: '/cloudlink-core-framework/user/getIdsByEnterpriseApp?token=' + token,
        data: _data,
        type: "get",
        async: false,
        dataType: "json",
        success: function(result) {
            if (result.success == 1) {
                var data = result.rows[0].userIds;
                assignRole(data);
            } else {
                layer.alert("参数异常！", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function() {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });

        }
    });
}


/**
 * @desc 创建专家角色
 * @param {*String} objectId 
 */
function assignRole(objectId) {
    var _data = {
        "userId": objectId,
        "enterpriseId": ZYAXenterpriseId,
        "appId": appId,
        "roleIds": expertRoleId
    };
    $.ajax({
        url: '/cloudlink-core-framework/user/assignRoles?token=' + token,
        contentType: "application/json",
        data: JSON.stringify(_data),
        type: "post",
        dataType: "json",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                layer.msg("专家邀请成功！", {
                    time: MSG_DISPLAY_TIME,
                    skin: 'self-msg'
                });
            } else {
                layer.alert("参数异常！", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function() {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });

        }
    });
}

/**
 * @desc 输入验证
 */
function detectInput() {
    $('#addForm').bootstrapValidator({
        fields: {
            userName: {
                validators: {
                    notEmpty: { /*非空提示*/ },
                    stringLength: { /*长度提示*/
                        min: 2,
                        max: 10
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: { /*非空提示*/ },
                    mobilePhone: {}
                }
            }
        },
        verbose: false //默认显示第一条提示信息
    });
}
$(function() {
    relaodEnterprise(); // 根据用户ID获取当前用户的所有企业
});

// 单选框选择
$("body").on("click", ".radio", function() {
    $(".radio").removeClass("on_check");
    $(this).addClass("on_check");
    $(this).find("input[type='radio']").prop("checked", true);
});

// 根据用户ID获取当前用户的所有企业
function relaodEnterprise() {
    var defaultHtml = ""; //默认企业;
    var loginnow = ""; //当前登录企业；
    var allHtml = ""; //所有企业
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    var status = '0,1';
    var _data = {
       "userId": userBo.objectId,
        "status": status,
        "appCode": appCode
    }
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-framework/user/getEnterpriseList?token=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: _data,
        dataType: "json",
        success: function(data) {
            if (data.success == 1) {
                var dataList = data.rows;
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i].objectId == userBo.enterpriseId) {
                        loginnow = '<div class="row"><div class = "col-md-2" ></div> ' +
                            '<div class = "col-md-8"><div class = "radio on_check"><label>' +
                            '<input type = "radio"  name = "optionEnterprise"   id = "loginnowId" value = "' + dataList[i].objectId + '" checked >' +
                            '<span>' + dataList[i].enterpriseName + '（默认登录）</span> </label > </div></div > <div class = "col-md-2" ></div></div > ';
                    } else {
                        if (dataList[i].status == "0") {
                            allHtml += '<div class="row"><div class = "col-md-2" ></div> ' +
                                '<div class = "col-md-8"><div class = "radio"><label>' +
                                '<input type = "radio"  name = "optionEnterprise"   id = "nojoin' + i + '" value = "' + dataList[i].objectId + '"  >' +
                                '<span>' + dataList[i].enterpriseName + '（ 受邀企业)</span> </label > </div></div > <div class = "col-md-2" ></div></div > ';
                        } else if (dataList[i].status == "1") {
                            allHtml += '<div class="row"><div class = "col-md-2" ></div> ' +
                                '<div class = "col-md-8"><div class = "radio"><label>' +
                                '<input type = "radio"  name = "optionEnterprise"   id = "join' + i + '" value = "' + dataList[i].objectId + '"  >' +
                                '<span>' + dataList[i].enterpriseName + '</span> </label > </div></div > <div class = "col-md-2" ></div></div > ';
                        }

                    }
                }
                $(".allenterprised").append(loginnow + allHtml);
            }
        }
    });
}

// 选中之后 确认设置默认企业 
$(".setdefault").click(function() {
    var nojoin = '';
    var enterpriseId = "";
    $("input[name='optionEnterprise']").each(function(idx, ele) {
        if ($(ele).prop("checked") == true) {
            enterpriseId = $(ele).val();
            nojoin = $(ele).prop("id");
        }
    });
    console.log(enterpriseId);
    console.log(nojoin);
    // enterpriseId = $("input[name='optionEnterprise']:checked").val();
    // nojoin = $("input[name='optionEnterprise']:checked").prop("id");
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));

    if (nojoin == 'loginnowId') {
        layer.confirm("当前企业已经登录", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: "self",
        }, function() {
            layer.closeAll();
            //诸葛IO
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track('登录设置', { "结果": "成功" });
                }
            } catch (e) {

            }
        });
    } else if (enterpriseId == null || enterpriseId == "") {
        layer.confirm('请选择一个默认企业后，才可登录成功', {
            btn: ['确定'], //按钮
            skin: "self"
        });
    } else if (nojoin != "") {
        //当前需要设置为默认企业并且该企业未加入
        console.log(enterpriseId);
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/user/setDefaultEnterpriseAndJoin?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify({
                "enterpriseId": enterpriseId,
                appCode: appCode
            }),
            dataType: "json",
            success: function(data) {
                console.log(data);
                // alert(data);
                if (data.success == 1) {
                    console.log("设置默认企业并加入");
                    //设置成默认企业之后，需要重新调用获取默认企业ID，然后进行加入该企业
                    getDefaultEnterpriseId();
                } else {
                    layer.msg("服务异常，请稍候重试", { skin: "self-msg" });
                }
            }
        });
    } else {
        console.log(enterpriseId);
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/user/setDefaultEnterprise?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify({
                "enterpriseId": enterpriseId,
                "appId": appId
            }),
            dataType: "json",
            success: function(data) {
                if (data.success == 1) {
                    getDefaultEnterpriseId();
                } else {
                    layer.msg("默认企业设置失败，请重新登录进行设置", { skin: "self-msg" });
                }
            }
        });
    }
});

// 获取当前用户的默认企业Id
function getDefaultEnterpriseId(_userId) {
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/getDefaultEnterpriseId",
        contentType: "application/json",
        data: JSON.stringify({
            userId: _userId
        }),
        dataType: "json",
        success: function(data) {
            var success = data.success;
            if (success == 1) {
                //当前用户存在默认企业Id
                if (data.rows.length > 0) {
                    var _enterpriseId = data.rows[0].enterpriseId;
                    joinDefaultEnterprise(_enterpriseId);
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

// 获取当前用户的默认企业Id
function getDefaultEnterpriseId() {
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/user/getDefaultEnterpriseId?token=" + token + "&appCode=" + appCode,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            var success = data.success;
            if (success == 1) {
                //当前用户存在默认企业Id
                if (data.rows.length > 0) {
                    var _enterpriseId = data.rows[0].enterpriseId;
                    console.log(_enterpriseId);
                    joinDefaultEnterprise(_enterpriseId);
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
// 加入企业
function joinDefaultEnterprise(_enterpriseId) {
    var _userBo = JSON.parse(lsObj.getLocalStorage('userBo'));
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/loginWithEnterprise?token=" + token,
        contentType: "application/json",
        data: JSON.stringify({
            enterpriseId: _enterpriseId,
            appCode: appCode
        }),
        dataType: "json",
        success: function(data) {
            console.log("加入默认企业");
            console.log(data);
            var success = data.success;
            if (success == 1) {
                var row = data.rows;
                var token = data.token;

                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('userBo', JSON.stringify(row[0]));
                lsObj.setLocalStorage('timeOut', new Date().getTime() + (23 * 60 * 60 * 1000));
              
                layer.confirm("企业切换成功！", {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: "self"
                }, function() {
                    layer.closeAll();
                    parent.location.reload();
                    // parent.location.href = '../../../index.html';
                });
            } else {
                switch (data.code) {
                    case "400":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "401":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU01000":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU01020":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU03030":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU03033":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU03035":
                        layer.msg(data.msg, { skin: "self-msg" });

                        break;
                    case "PU03037":
                        layer.msg(data.msg, { skin: "self-msg" });

                        break;
                    case "PU03034":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU01022":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU01023":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU03031":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU03036":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    case "PU03038":
                        layer.msg(data.msg, { skin: "self-msg" });
                        break;
                    default:
                        break;
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
};
// 点击确定按钮跳转首页
// $("#goFirst").bind("click", function(e) {
//     e.preventDefault();
//     parent.menuItem($(this));
// })

// 退出将退出到登录页面，进行缓存清除
$(".return").click(function() {
    //诸葛IO
    // try {
    //     if (zhugeSwitch == 1) {
    //         zhuge.track('登录设置返回');
    //     }
    // } catch (error) {

    // }
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('登陆设置', {
                '返回': '成功'
            });
        }
    } catch (error) {

    }

    // parent.location.href = '../../../login.html';
    parent.location.reload();
});
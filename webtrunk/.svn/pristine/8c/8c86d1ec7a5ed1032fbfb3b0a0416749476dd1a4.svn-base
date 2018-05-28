/** 
 * @file
 * @author  lizhenzhen
 * @desc 登陆设置js逻辑操作
 * @date 2017-06-12 10:02:07
 * @last modified by lizhenzhen
 * @last modified time  2017-06-12
 */

var token = lsObj.getLocalStorage('token'); // 获取token
$(function() {
    changePageStyle("../.."); // 换肤
    firstLogin(); // 判断是否是第一次登陆，第一次展示向导

    $("#goCreate").css({
        "color": "#fff",
        " text-decoration": "none",
        " text-underline-position": " none"
    }).bind("mouseenter", function() {
        $(this).css({
            "color": "#fff",
            " text-decoration": "none"
        });
    }).bind("mouseleave", function() {
        $(this).css({
            "color": "#fff",
            " text-decoration": "none"
        });
    })
    relaodEnterprise(); // 根据用户ID获取当前用户的所有企业
});

// 单选框选择
$("body").on("click", ".radio", function() {
    $(".radio").removeClass("on_check");
    $(this).addClass("on_check");
    $(this).find("input[type='radio']").prop("checked", true);
});

/**
 * @desc 根据用户ID获取当前用户的所有企业
 * @method relaodEnterprise
 */
function relaodEnterprise() {
    var defaultHtml = ""; //默认企业;
    var loginnow = ""; //当前登录企业；
    var allHtml = ""; //所有企业
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); // 获取userBo
    var status = '0,1'; // 获取用户企业状态
    var _data = {
        "userId": userBo.objectId,
        "status": status,
        "appCode": appCode
    };
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
                            '<span>' + dataList[i].enterpriseName + '（'+getLanguageValue("defultLogin")+'）</span> </label > </div></div > <div class = "col-md-2" ></div></div > ';
                    } else {
                        if (dataList[i].status == "0") {
                            allHtml += '<div class="row"><div class = "col-md-2" ></div> ' +
                                '<div class = "col-md-8"><div class = "radio"><label>' +
                                '<input type = "radio"  name = "optionEnterprise"   id = "nojoin' + i + '" value = "' + dataList[i].objectId + '"  >' +
                                '<span>' + dataList[i].enterpriseName + '（ '+getLanguageValue("invited")+')</span> </label > </div></div > <div class = "col-md-2" ></div></div > ';
                        } else if (dataList[i].status == "1") {
                            allHtml += '<div class="row"><div class = "col-md-2" ></div> ' +
                                '<div class = "col-md-8"><div class = "radio"><label>' +
                                '<input type = "radio"  name = "optionEnterprise"   id = "join' + i + '" value = "' + dataList[i].objectId + '"  >' +
                                '<span>' + dataList[i].enterpriseName + '</span> </label > </div></div > <div class = "col-md-2" ></div></div > ';
                        }
                    }
                };
                $(".allenterprised").append(loginnow + allHtml);
            } else {
                layer.alert(getLanguageValue("tip.getInfo.fail"), {
                    title: getLanguageValue("tip"),
                    skin: "self-alert"
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
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
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); // 获取userBo
    if (nojoin == 'loginnowId') {
        layer.confirm(getLanguageValue("tip.currentEnp.error"), {
            title: getLanguageValue("tip"),
            btn: [getLanguageValue("ok")], //按钮
            skin: "self",
        }, function() {
            layer.closeAll();
            //诸葛IO
            try {
                if (tjSwitch == 1) {
                    tjSdk.track('登录设置', {
                        "结果": "成功"
                    });
                }
            } catch (e) {

            }
        });
    } else if (enterpriseId == null || enterpriseId == "") {
        layer.alert(getLanguageValue("tip.nohasSelect"), {
            title: getLanguageValue("tip"),
            skin: "self-alert"
        });
    } else if (enterpriseId == ZYAXenterpriseId) { //对于企业ID为中盈安信的，单独查看角色，当未拥有专家角色后，不能切换到该企业
        var user = JSON.parse(lsObj.getLocalStorage('userBo')); // 获取userBo
        var token = lsObj.getLocalStorage('token'); // 获取token
        $.get('/cloudlink-core-framework/user/getById?objectId=' + user.objectId + '&enterpriseId=' + ZYAXenterpriseId + '&appId=' + appId + '&token=' + token, function(result, status) {
            //获得用户在
            if (result.success == 1) {
                var roleIds = result.rows[0].roleIds;
                if (roleIds == "" || roleIds == null) {
                    //则不能切换
                    layer.confirm(getLanguageValue("tip.nohasRole"), {
                        title: getLanguageValue("tip"),
                        btn: [getLanguageValue("ok")], //按钮
                        skin: "self",
                    }, function() {
                        layer.closeAll();
                    });
                } else {
                    //如果不为空，则将zyax设置为默认企业，切换登录
                    setDefaultEnterpriseAndJoin(ZYAXenterpriseId);
                }
            }

        });
    } else if (nojoin != "") {
        setDefaultEnterpriseAndJoin(enterpriseId);
    } else {
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
                    layer.alert(getLanguageValue("tip.setLogin.error"), {
                        title: getLanguageValue("tip"),
                        skin: "self-alert"
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                console.log(XMLHttpRequest); // 请求对象
                console.log(textStatus); // 返回状态错误类型
                console.log(errorThrown); // 捕获的异常对象

                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        });
    }
});

/**
 * @desc 设置默认企业并登录
 * @author yangyuanzhu
 * @method setDefaultEnterpriseAndJoin
 * @param {*} _enterpriseId
 * @date 2017-06-05 21:28:56 
 */
function setDefaultEnterpriseAndJoin(_enterpriseId) {
    //当前需要设置为默认企业并且该企业未加入
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/user/setDefaultEnterpriseAndJoin?token=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: JSON.stringify({
            "enterpriseId": _enterpriseId,
            appCode: appCode
        }),
        dataType: "json",
        success: function(data) {
            if (data.success == 1) {
                //设置成默认企业之后，需要重新调用获取默认企业ID，然后进行加入该企业
                getDefaultEnterpriseId();
            } else {
                layer.alert("服务异常，请稍候重试", {
                    title: getLanguageValue("tip"),
                    skin: "self-alert"
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取当前用户的默认企业Id
 * @method getDefaultEnterpriseId
 */
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
                    joinDefaultEnterprise(_enterpriseId);
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 加入企业
 * @method joinDefaultEnterprise
 * @param {*} _enterpriseId 
 */
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

            var success = data.success;
            if (success == 1) {
                var row = data.rows;
                var token = data.token;

                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('userBo', JSON.stringify(row[0]));
                lsObj.setLocalStorage('timeOut', new Date().getTime() + (23 * 60 * 60 * 1000));
                //权限

                var roleIds = JSON.parse(lsObj.getLocalStorage('userBo')).roleIds;
                console.log(roleIds);
                var roleNameNum = 1; // 默认阴保工程师
                if (roleIds == null || roleIds == "") { //可能没有角色？？？？？ 由于前期的账户 ，可能会存在有账户没有角色，暂时处理之，之后删除
                    lsObj.setLocalStorage('params', roleNameNum);
                    layer.confirm(getLanguageValue("tip.switch.success"), {
                        title: getLanguageValue("tip"),
                        btn: [getLanguageValue("ok"),], //按钮
                        skin: "self"
                    }, function() {
                        layer.closeAll();
                        parent.location.reload();
                        // parent.location.href = '../../../index.html';
                    });
                    return;
                }

                var roleArray = roleIds.split(",");
                //是否包含阴保工程师
                if ($.inArray(detectionPersonnelId, roleArray) > -1 && $.inArray(cpengineerId, roleArray) > -1) { //阴保工程师与检测人员双角色
                    roleNameNum = 3;
                } else if ($.inArray(detectionPersonnelId, roleArray) > -1) { //现场检测人员
                    roleNameNum = 2;
                } else if ($.inArray(cpengineerId, roleArray) > -1) {
                    roleNameNum = 1; //阴保工程师
                } else if ($.inArray(expertRoleId, roleArray) > -1) {
                    roleNameNum = 5; //专家 专家先于运维 2017年6月7日 14:27:02
                } else if ($.inArray(operatorRoleId, roleArray) > -1) {
                    roleNameNum = 4; //平台管理员
                } else {
                    roleNameNum = 1; //其他情况 默认使用阴保工程师
                }
                lsObj.setLocalStorage('params', roleNameNum);
                layer.confirm(getLanguageValue("tip.switch.success"), {
                    title: getLanguageValue("tip"),
                    btn: [getLanguageValue("ok"),], //按钮
                    skin: "self"
                }, function() {
                    layer.closeAll();
                    parent.location.reload();
                    // parent.location.href = '../../../index.html';
                });
            } else {
                switch (data.code) {
                    case "400":
                        layer.alert("服务异常，请稍候重试", {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU01000":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU01020":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU03030":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU03033":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU03035":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU03037":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU03034":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU01022":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU01023":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU03031":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU03036":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    case "PU03038":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip"),
                            skin: "self-alert"
                        });
                        break;
                    default:
                        layer.alert(getLanguageValue("tip.switch.fail"), {
                            title:getLanguageValue("tip"),
                            skin: "self-alert"
                        });
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

// 创建企业
$("#goCreate").on("click", function(e) {
    e.preventDefault();
    parent.menuItem($(this));
});


// 退出将退出到登录页面，进行缓存清除
$(".return").click(function() {
    try {
        if (tjSwitch == 1) {
            tjSdk.track('登陆设置', {
                '返回': '成功'
            });
        }
    } catch (error) {

    }
    parent.location.reload();
});
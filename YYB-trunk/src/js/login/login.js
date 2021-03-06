﻿/**
 * @file 
 * @author: liangyuanyuan
 * @desc: 登录页面的js
 * @Date: 2017-06-12 09:40:41
 * @Last Modified by: rongfeiyu
 * @Last Modified time: 2017-06-12 17:59:28
 */


(function () {
    var language = lsObj.getLocalStorage("i18nLanguage");
    if (language == "en") {
        $(".logoImg").css("background", "url(/src/images/logo/logo-LOGO_en.png) no-repeat 50% 100%");
        $("#bgcontent .posImg").css("background","url(/src/images/logo/logo-bg_en.png) no-repeat center -12px")
    }
    // 加载电话号码区号
    loadPhoneAreaCode();
}());

var Obj = {
    nameImg: "url(/src/images/login_img/nameImg.png)",
    nameImg1: "url(/src/images/login_img/nameImg1.png)",
    passwordImg: "url(/src/images/login_img/password1.png)",
    passwordImg1: "url(/src/images/login_img/password.png)",
    //当获取焦点的时候，设置样式
    focus: function (obj, imgSrc) {
        obj.css({
            background: "#ECF7FF",
            border: "1px solid #5EB6F9"
        });
        obj.find('input').css("background", "#ECF7FF");
        obj.find('.bg').css("background-image", imgSrc);
    },
    //当失去焦点的时候，设置样式。
    blur: function (obj, imgSrc) {
        obj.css({
            background: "#fff",
            border: "1px solid #bbb"
        });
        obj.find('input').css("background", "#fff");
        obj.find('.bg').css("background-image", imgSrc);
    }
};

// 手机号码前缀选择框的显示与隐藏
$(".select-head").click(function () {
    $(".select-cpt .select-body").toggleClass("show");
})
// 选择手机号码前缀
$(".select-body").on("click", ".option", function () {
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    var phoneNo = $(this).attr("data-no");
    $("#phoneNo").html("+" + phoneNo);
    $(".select-body").removeClass("show");
})

$(".name input").focus(function () {
    Obj.focus($(".name"), Obj.nameImg);
}).blur(function () {
    Obj.blur($(".name"), Obj.nameImg1);
});

$(".password input").focus(function () {
    Obj.focus($(".password"), Obj.passwordImg);
}).blur(function () {
    Obj.blur($(".password"), Obj.passwordImg1);
});

/**
 * @desc 回车登录事件
 */
$(document).bind("keydown", function (e) {
    // 兼容FF和IE和Opera    
    var theEvent = e || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
        $(".confirmButton ").click(); //具体处理函数  
        return false;
    }
    return true;
});

var passwordVal = null; // 密码 
var nameVal = null; // 手机号
var zoneCode = null; // 区号
var token;

String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

/**
 * @desc 确认登录(要进行验证)
 */
$('#login').click(function () {
    var language = lsObj.getLocalStorage("i18nLanguage");
    $('#login').text(getLanguageValue("logining"));
    nameVal = $(".name input").val().trim().trim();
    passwordVal = $(".password input").val().trim().trim();
    var phoneReg = /^1\d{10}$/; //正则匹配
    if (nameVal == "" || nameVal == null) { //如果手机号为空。给用户一个提示
        $('.hidkuai1 span').text(getLanguageValue("tip.check.numberEmpty"));
        setTimeout(function () {
            $('#login').text(getLanguageValue("loginText"));
        }, 500);
        //诸葛IO
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('登录失败', {
                    '失败原因': '手机号码不能为空'
                });
            }
        } catch (error) {}
        return;
    } else if (!phoneReg.test(nameVal) && language == "zh") {
        $('.hidkuai1 span').text(getLanguageValue("tip.check.numberError"));
        setTimeout(function () {
            $('#login').text(getLanguageValue("loginText"));
        }, 500);
        //诸葛IO
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('登录失败', {
                    '失败原因': '输入的手机号码不正确'
                });
            }
        } catch (error) {}
        return;
    } else if (passwordVal == '' || passwordVal == null) {
        $('.hidkuai1 span').text('');
        $('.hidkuai2 span').text(getLanguageValue("tip.check.passwordEmpty"));
        setTimeout(function () {
            $('#login').text(getLanguageValue("loginText"));
        }, 500);
        //诸葛IO
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('登录失败', {
                    '失败原因': '密码不能为空'
                });
            }
        } catch (error) {}
        return;
    } else {
        $('.hidkuai1 span').text('');
        $('.hidkuai2 span').text('');
        accountNumber();
    }
});



/**
 * @desc 验证手机号是否注册 接口开始
 */
function accountNumber() {


    zoneCode = $("#phoneNo").text();

    //英文版本下，首先验证是否是中国号码 如果是 不加区号，
    var language = lsObj.getLocalStorage("i18nLanguage");

    if (zoneCode != "+86") {
        nameVal = zoneCode + nameVal;
    }
    var _data = {
        "registNum": nameVal,
        "validateType": "mobile"
    };

    $.ajax({
        type: "GET",
        url: "/cloudlink-core-framework/login/checkUser",
        contentType: "application/json",
        data: _data,
        dataType: "json",
        success: function (data) {
            var res = data.rows[0].isExist;
            if (res == false && data.msg == "ok") {
                setTimeout(function () {
                    $('#login').text(getLanguageValue("loginText"));
                }, 500);
                //$('.hidkuai1 span').text(getLanguageValue("tip.check.accoutUnsign"));
                showMsg(getLanguageValue("tip.check.accoutUnsign"));
                //诸葛IO
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('登录失败', {
                            '失败原因': '账号未注册'
                        });
                    }
                } catch (error) {}
                return false;
            } else if (res == true) {
                Login(); //已注册账户，进行正常登录流程
                return true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            $('#login').text(getLanguageValue("loginText"));
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 验证手机号和密码
 */
function Login() {
    var _data = {
        "loginNum": nameVal,
        "password": passwordVal,
        "validateType": "mobile",
        "appId":appId
    };
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/loginByPassword",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "json",
        success: function (data) {
            var success = data.success;
            if (success == 1) {
                console.log(success);
                var row = data.rows;
                token = data.token;
                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('userBo', JSON.stringify(row[0]));
                lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));
                getDefaultEnterpriseId();
                setTimeout(function () {
                    $('#login').text(getLanguageValue("loginText"));
                }, 500);
            } else {
                setTimeout(function () {
                    $('#login').text(getLanguageValue("loginText"));
                }, 500);
                var code = data.code;
                switch (code) {
                    case "403":
                        // $('.hidkuai2 span').text(getLanguageValue("403"));
                        showMsg(getLanguageValue("403"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03010":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03010"));
                        showMsg(getLanguageValue("PU03010"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03013":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03013"));
                        showMsg(getLanguageValue("PU03013"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03032":
                        //$('.hidkuai2 span').text(getLanguageValue("PU03032"));
                        showMsg(getLanguageValue("PU03032"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU01000":
                        // $('.hidkuai2 span').text(getLanguageValue("PU01000"));
                        showMsg(getLanguageValue("PU01000"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU01020":
                        // $('.hidkuai2 span').text(getLanguageValue("PU01020"));
                        showMsg(getLanguageValue("PU01020"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03030":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03030"));
                        showMsg(getLanguageValue("PU03030"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03033":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03033"));
                        showMsg(getLanguageValue("PU03033"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03035":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03035"));
                        showMsg(getLanguageValue("PU03035"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03000":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03000"));
                        showMsg(getLanguageValue("PU03000"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03038":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03038"));
                        showMsg(getLanguageValue("PU03038"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03036":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03036"));
                        showMsg(getLanguageValue("PU03036"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03031":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03031"));
                        showMsg(getLanguageValue("PU03031"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {}
                        break;
                    default:
                        $('.hidkuai2 span').text(getLanguageValue("tip.login.fail"));
                };
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            $('#login').text(getLanguageValue("loginText"));
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取当前用户的默认企业Id
 */
function getDefaultEnterpriseId() {
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/login/getDefaultEnterpriseId?token=" + token + "&appId=" + appId,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            var success = data.success;
            if (success == 1) {
                //当前用户存在默认企业Id
                var _enterpriseId = data.rows[0].enterpriseId;
                //当用户的默认企业是中盈安信时，判断用户的角色是否包含专家，如未包含，则不能登录，必须切换企业登录
                if (_enterpriseId == ZYAXenterpriseId && !hasExportRole()) {
                    expertRoleRemovedSomething(); //专家角色被移除后的特殊情况处理
                    return;
                }
                getNologinReason(_enterpriseId);
            } else {
                layer.alert(getLanguageValue("tip.login.fail"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 账号不能登录原因
 * @param 
 */
function getNologinReason(_enterpriseId){
     $.ajax({
        type: "get",
        url: "/cloudlink-corrosionengineer/accout/getNologinReason?token=" + lsObj.getLocalStorage('token'),
        success: function(data) {
            if(data.success == 1){
                if(data.isAudit == 1){ // 待审核
                    showMsg(getLanguageValue("accountAudit")); 
                }else if(data.isAudit == 0){  // 审核通过
                    if (_enterpriseId != "") {
                        joinDefaultEnterprise(_enterpriseId);
                    } else {
                        // 获取用户的企业列表
                        location.href = '../../../get_enterprise_list.html';
                    }
                }else if(data.isAudit == -1){  // 驳回
                    var language = lsObj.getLocalStorage("i18nLanguage");
                    if(language == "en"){
                        switch (data.reason) {
                            case "注册企业不存在":
                                en_reason="Registered enterprises do not exist";
                                showMsg(getLanguageValue("rejectEnterprise")+ en_reason); 
                                break;
                            case "企业名称不合规，请规范企业名称":
                                en_reason="Enterprise name not compliance, please standardize enterprise name";
                                showMsg(getLanguageValue("rejectEnterprise")+ en_reason); 
                                break;
                            case "该企业已被注册":
                                en_reason="The enterprise has been registered";
                                showMsg(getLanguageValue("rejectEnterprise")+ en_reason); 
                                break;
                            case "暂不开放对个人的使用权限":
                                en_reason="The use of personal permission is not open";
                                showMsg(getLanguageValue("rejectEnterprise")+ en_reason); 
                                break;
                            case "电话无人接听":
                                en_reason="nobody answerd the phone";
                                showMsg(getLanguageValue("rejectEnterprise")+ en_reason); 
                                break;
                            default:
                                showMsg("Registered businesses were dismissed"); 
                                break;
                            }
                            return en_reason;
                    }else{
                        showMsg(getLanguageValue("rejectEnterprise")+ '<br/>&nbsp;&nbsp;&nbsp;&nbsp;' + data.reason); // 驳回原因
                    }
                }
            }else{

                if (_enterpriseId != "") {
                    joinDefaultEnterprise(_enterpriseId);
                }else{
                    // 获取用户的企业列表
                    location.href = '../../../get_enterprise_list.html';
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
     });
}

/**
 * @desc 设置默认企业登录
 * @param {*String} _enterpriseId 
 */
function joinDefaultEnterprise(_enterpriseId) {
    var _userBo = JSON.parse(lsObj.getLocalStorage('userBo'));
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/loginWithEnterprise?token=" + token,
        contentType: "application/json",
        data: JSON.stringify({
            enterpriseId: _enterpriseId,
            appId: appId
        }),
        dataType: "json",
        success: function (data) {
            var success = data.success;
            if (success == 1) {
                var row = data.rows;
                var token = data.token;
                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('userBo', JSON.stringify(row[0]));
                lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));

                //权限

                var roleIds = JSON.parse(lsObj.getLocalStorage('userBo')).roleIds;
                var roleNameNum = 1; // 默认阴保工程师
                if (roleIds == null || roleIds == "") {
                    lsObj.setLocalStorage('params', roleNameNum);
                    getUserInfo();
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
                    roleNameNum = 5; //专家  将专家判断提前，登录阴保管管家，用户需要使用JAS下的专家角色
                } else if ($.inArray(operatorRoleId, roleArray) > -1) {
                    roleNameNum = 4; //平台管理员

                } else {
                    roleNameNum = 1; //其他情况 默认使用阴保工程师
                }
                lsObj.setLocalStorage('params', roleNameNum);


                //诸葛IO
                try {
                    if (zhugeSwitch == 1) {
                        zhugeIdentify(JSON.parse(lsObj.getLocalStorage('userBo')));

                        zhuge.track('登录成功');
                    }
                } catch (e) {}
                getUserInfo();

                // 进入页面之前加载一下
                // 获取当前的ip的地址，上传到服务器
                //getNowIP();
            } else {
                // console.log(data);
                switch (data.code) {
                    case "400":
                        // $('.hidkuai2 span').text(getLanguageValue("400"));
                        showMsg(getLanguageValue("400"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '服务器异常！'
                                });
                            }
                        } catch (error) {}
                        break;
                    case "403":
                        // $('.hidkuai2 span').text(getLanguageValue("403"));
                        showMsg(getLanguageValue("403"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '参数异常'
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU01023":
                        // $('.hidkuai2 span').text(getLanguageValue("PU01023"));
                     
                        showMsg(getLanguageValue("PU01023")+ getLanguageValue("or") +"<a class='blue' href='../../../get_enterprise_list.html'> "+ getLanguageValue("changeEnp") +" </a>");
                        // layer.confirm("当前企业应用过期,是否选择其它企业登录?", {
                        //     btn: ['是','否'], //按钮
                        //     skin: 'self',
                        //     yes:function(){
                        //          // 获取用户的企业列表
                        //         location.href = '../../../get_enterprise_list.html';
                        //     }
                        // });
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '企业应用过期!'
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03030":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03030"));
                        showMsg(getLanguageValue("PU03030"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '用户未加入企业！'
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03031":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03031"));
                        showMsg(getLanguageValue("PU03031"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '用户没有该企业应用的使用权限！'
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03033":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03033"));
                        showMsg(getLanguageValue("PU03033"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '用户已被该企业冻结！'
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU03035":
                        // $('.hidkuai2 span').text(getLanguageValue("PU03035"));
                        showMsg(getLanguageValue("PU03035"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '用户已被该企业移除！'
                                });
                            }
                        } catch (error) {}
                        break;
                    case "PU01000":
                        // $('.hidkuai2 span').text(getLanguageValue("PU01000"));
                        showMsg(getLanguageValue("PU01000"));
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '企业不存在'
                                });
                            }
                        } catch (error) {}
                        break;
                    default:
                        layer.alert(getLanguageValue("tip.login.fail"), {
                            title: getLanguageValue("tip"),
                            skin: 'self-alert'
                        });
                        break;
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 加载电话号码区号
 */
function loadPhoneAreaCode() {
    var language = lsObj.getLocalStorage("i18nLanguage");
    $.ajax({
        type: "GET",
        url: "/cloudlink-corrosionengineer/common/getNationCode?language=" + language,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            if (data.success == 1) {
                var list = data.list;
                var items = "";
                $("#selectBody").empty();
                for (var i = 0; i < list.length; i++) {
                    items += ('<div class="option" data-no="' + list[i].code + '" title="' + list[i].zone + '"><span>+' + list[i].code + '</span>' + list[i].zone + '</div>')
                }
                $("#selectBody").append(items);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });

}


/**
 * @desc 获得用户登录信息以及主题设置
 */
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/cloudlink-corrosionengineer/userInfo/getUserInfo?token=" + token,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {

            if (data.success == 1) {

                var loginNum = data.userInfo.loginNum;
                var currentTheme = data.userInfo.currentTheme;

                changeTheme(currentTheme);
                changeLanguage(lsObj.getLocalStorage("i18nLanguage"));
                lsObj.setLocalStorage('loginNum', loginNum);
                //设置用户语言偏好

                location.href = '../../../index.html'; //跳转主页
            } else {
                lsObj.setLocalStorage('currentTheme', "0");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 切换主题
 * @param {number} theme 主题对应的值
 */
function changeTheme(theme) {
    var _data = {
        theme: theme
    };
    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: "/cloudlink-corrosionengineer/userInfo/setUserTheme?token=" + token,
        dataType: "json",
        data: JSON.stringify(_data),
        async: false,
        success: function (data) {
            if (data.success == 1) {
                lsObj.setLocalStorage('currentTheme', theme);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 设置用户的默认语言
 * @param 
 */
function changeLanguage(language) {
    var _data = {
        language: language
    };
    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: "/cloudlink-corrosionengineer/userInfo/setUserLanguage?token=" + token,
        dataType: "json",
        data: JSON.stringify(_data),
        async: false,
        success: function (data) {
            if (data.success == 1) {
                lsObj.setLocalStorage('i18nLanguage', language);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 登陆失败的展示信息
 * @param 
 */
function showMsg(msg){
    $('.login-msg.error')[0].style.display='block';
    $('.login-msg.error span').html(msg);
}


/**
 * @desc 获取当前的ip的地址，上传到服务器
 */
function getNowIP() {
    var token = lsObj.getLocalStorage("token");
    $.ajax({
        type: "POST",
        url: "/cloudlink-corrosionengineer/message/saveIp?token=" + token,
        contentType: "application/json",
        success: function (data) {},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    })
}


/**
 * @desc 诸葛IO用户身份识别函数
 * @param {*String} _userBo 
 */
function zhugeIdentify(_userBo) {
    zhuge.identify(_userBo.objectId, {
        name: _userBo.userName,
        gender: _userBo.sex,
        age: _userBo.age,
        email: _userBo.email,
        qq: _userBo.qq,
        weixin: _userBo.wechat,
        'mobile': _userBo.mobileNum,
        '企业名称': _userBo.enterpriseName == null ? "" : _userBo.enterpriseName,
        '部门名称': _userBo.orgName == null ? "" : _userBo.orgName
    });
}

/************************************ 专家  *************************************/

/**
 * @desc 专家角色被移除后，默认企业还是ZYAX的情况处理
 */
function expertRoleRemovedSomething() {
    var user = JSON.parse(lsObj.getLocalStorage('userBo'));
    var token = lsObj.getLocalStorage('token');
    $.get('/cloudlink-core-framework/user/getById?objectId=' + user.objectId + '&enterpriseId=' + ZYAXenterpriseId + '&appId=' + appId + '&token=' + token, function (result, status) {
        //获得用户在
        if (result.success == 1) {
            var roleIds = result.rows[0].roleIds;
            if (roleIds == "" || roleIds == null) {
                layer.alert("您在中盈安信中专家角色已被移除，点击确定切换企业或创建企业", {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                }, function () {
                    layer.closeAll();
                    location.href = '../../../get_enterprise_list.html?noZYAX=true';
                });
            }
        }
    });
}


/**
 * @desc 是否包含专家角色
 * @return {*Boolean} true||false 
 */
function hasExportRole() {
    var user = JSON.parse(lsObj.getLocalStorage('userBo'));
    var token = lsObj.getLocalStorage('token');
    var bool = false;
    $.ajax({
        type: "get",
        async: false,
        url: '/cloudlink-core-framework/user/getById?objectId=' + user.objectId + '&enterpriseId=' + ZYAXenterpriseId + '&appId=' + appId + '&token=' + token,
        contentType: "application/json",
        success: function (result) {
            if (result.success == 1) {
                var roleIds = result.rows[0].roleIds;
                if (roleIds == "" || roleIds == null) {
                    bool = false;
                } else {
                    bool = true;
                }
            } else {
                bool = false; 
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    })
    return bool;
}



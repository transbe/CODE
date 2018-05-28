/**
 * @file 
 * @author: lizhenzhen
 * @desc: 登录时用户默认企业id为空时，获取企业列表的js
 * @Date: 2017-05-21 09:40:41
 * @Last Modified by: rongfeiyu
 * @Last Modified time: 2017-05-22 17:59:28
 */

$(function() {
    var language=lsObj.getLocalStorage("i18nLanguage");
    if(language == "en"){
        $(".forgotPassword .title .logobg").css("background", "url(../../images/logo/forget-logo_en.png) no-repeat 0 66px;");
    }

    getEnterpriseList();

    /**
     * @desc 从当前应用下选择企业
     */
    $("#submitSelect").click(function() {
        // 单选按钮，选择企业登陆
        var enterpriseListRadios = $(".bottom1 .enterpriseList input[type=radio]");
        for (var i = 0; i < enterpriseListRadios.length; i++) {
            var selectItem = $(enterpriseListRadios[i]).prop("checked");
            if (selectItem == true) {
                var isCheaked = true;
                var currentEnterpriseId = $(enterpriseListRadios[i]).val();
                // 设置默认企业登录
                setDefaultEnterprise(currentEnterpriseId);
            }
        };
        if (isCheaked != true) {
            layer.alert(getLanguageValue("pleaseSelect"), {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });


    /**
     * @desc 从用户加入的所有企业选择
     */
    // $("#openEnp").click(function() {
    //     // 单选按钮，选择企业登陆
    //     var enterpriseListRadios = $(".bottom2 .enterpriseList input[type=radio]");
    //     for (var i = 0; i < enterpriseListRadios.length; i++) {
    //         var selectItem = $(enterpriseListRadios[i]).prop("checked");
    //         if (selectItem == true) {
    //             var isCheaked = true;
    //             var currentEnterpriseId = $(enterpriseListRadios[i]).val();
    //             // 选择企业查询该企业下有无当前应用
    //             getAppList(currentEnterpriseId); // 传入选择的企业id
    //         }
    //     };
    //     if (isCheaked != true) {
    //         layer.alert("请先选择企业", {
    //             title: "提示",
    //             skin: 'self-alert'
    //         });
    //     }
    // });

});


/**
 * @desc 获取用户在应用下的企业列表
 */
function getEnterpriseList() {
    //如果跳转过来页面有noZYAX字段，且等于true，则不渲染中盈安信企业list 
    var noHasZYAX = new Boolean(getParameter('noZYAX', window.top.document.URL));
    // [1激活 0未激活 -1冻结 -2移除 -3退出]
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/login/getEnterpriseList?token=" + lsObj.getLocalStorage('token') + "&appId=" + appId + "&status=0,1,-1",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            var success = data.success;
            if (success == 1) {
                $(".enterprise_list .Contain .bottom1").css({
                    display: 'block'
                });
                var enterpriseListArr = data.rows;
                // enterpriseListArr = [{ objectId: "a8da2cba-4393-412f-b4b8-4a84a3d6028b", enterpriseName: "激活企业", status: 1 }, { objectId: "b8da2cba-4393-412f-b4b8-4a84a3d6028b", enterpriseName: "受邀企业", status: 0 }, { objectId: "c8da2cba-4393-412f-b4b8-4a84a3d6028b", enterpriseName: "失效企业", status: -1 }, { objectId: "d8da2cba-4393-412f-b4b8-4a84a3d6028b", enterpriseName: "移除企业", status: -2 }];
                if (enterpriseListArr.length > 0) {
                    var joinedArr = [],
                        invitedArr = [],
                        forbiddenArr = [],
                        deletedArr = [];
                    for (var temp in enterpriseListArr) {
                        if (noHasZYAX && enterpriseListArr[temp].objectId == ZYAXenterpriseId) { //不去渲染中盈安信节点 yang 2017年6月5日 20:46:44
                            continue;
                        }
                        if (enterpriseListArr[temp].status == 1) {
                            // 激活企业
                            joinedArr.push(enterpriseListArr[temp]);
                        }
                        if (enterpriseListArr[temp].status == 0) {
                            // 受邀企业
                            invitedArr.push(enterpriseListArr[temp]);
                        }
                        if (enterpriseListArr[temp].status == -1) {
                            // 失效企业
                            forbiddenArr.push(enterpriseListArr[temp]);
                        }
                        if (enterpriseListArr[temp].status == -2) {
                            // 移除企业
                            deletedArr.push(enterpriseListArr[temp]);
                        }
                    }
                    if(joinedArr.length == 0 && invitedArr.length == 0){
                        location.href = './create_enterprise.html';
                    }else{
                        renderDOM(joinedArr, getLanguageValue("joinedEnterprise"), "", "joined", "", "enterpriseDom");  // "您已加入的企业"
                        renderDOM(invitedArr, getLanguageValue("invitedEnterprise"), "", "invited", "", "enterpriseDom"); // "您受邀请的企业" 
                        // renderDOM(forbiddenArr, "您已失效的企业", "disable_radio", "forbidden", "disabled", "enterpriseDom");
                        // renderDOM(deletedArr, "您已移除的企业", "disable_radio", "deleted", "disabled", "enterpriseDom");
                    }

                    // 单选按钮，选择企业登陆
                    var enterpriseListRadios = $(".enterpriseList input[type=radio]");
                    for (var i = 0; i < enterpriseListRadios.length; i++) {
                        (function(i) {
                            $(enterpriseListRadios[i]).on("click", function() {
                                $(enterpriseListRadios).prop("checked", false);
                                $(enterpriseListRadios[i]).prop("checked", true);
                            });
                        })(i)
                    };
                } else {

                    // $("#submitSelect").addClass("forbidBtn");
                    // $("#submitSelect input").attr("disabled",true);
                    // $(".enterprise_list .enterpriseList .noEnterprise").css({
                    //     display: "block"
                    // });

                    location.href = './create_enterprise.html';


                    // $("#enterpriseDom  .noEnterprise").css({
                    //     display: "block"
                    // });
                    // layer.alert("当前应用的企业列表为空，是否查询其它企业下的应用？", {
                    //     title: "提示",
                    //     skin: 'self-alert'
                    // }, function(index) {
                    //     layer.closeAll();
                    //     $(".enterprise_list .Contain .bottom1").css({
                    //         display: 'none'
                    //     });
                    //     // 企业列表为空,查询用户的所有企业列表
                    //     allEnterpriseList();
                    // });
                }
            } else {
                layer.alert(getLanguageValue("enterpriseLoadFail"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
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
 * @desc 渲染企业列表
 * @param {*Array} Arr 
 * @param {*String} title 
 * @param {*String} class1 
 * @param {*String} domName 
 * @param {*String} fg 
 * @param {*String} boxDom 
 */
function renderDOM(Arr, title, class1, domName, fg, boxDom) {
    if (Arr.length > 0) {
        var lis = "";
        for (var i = 0; i < Arr.length; i++) {
            lis += "<li><input type='radio' value='" + Arr[i].objectId + "' " + fg + "><span class='enterprise_name'>" + Arr[i].enterpriseName + "</span></li>"
        }
        var oDiv = "<div class='allEnp'><h6>" + title + "</h6><ul id ='" + domName + "' class='" + class1 + "'>" + lis + "</ul></div>";
        $("#" + boxDom).append(oDiv);
    }
}

/**
 * @desc 设置默认企业登录
 * @param {*String} currentEnterpriseId 
 */
function setDefaultEnterprise(currentEnterpriseId) {
    $.ajax({
        type: "post",
        url: "/cloudlink-core-framework/user/setDefaultEnterpriseAndJoin?token=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "enterpriseId": currentEnterpriseId,
            "appId": appId
        }),
        success: function(data) {
            if (data.success == 1) {
                getDefaultEnterpriseId();
            } else {
                layer.alert(getLanguageValue("setDefaultFail"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
 * @desc 获取当前用户的默认企业Id
 */
function getDefaultEnterpriseId() {
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/login/getDefaultEnterpriseId?token=" + lsObj.getLocalStorage('token') + "&appId=" + appId,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            var success = data.success;
            if (success == 1) {
                //当前用户存在默认企业Id
                var _enterpriseId = data.rows[0].enterpriseId;
                if (_enterpriseId != "") {
                    joinDefaultEnterprise(_enterpriseId);
                }
            } else {
                //当前用户不存在默认企业Id
                $('.hidkuai2 span').text(getLanguageValue("noSetDefault"));
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
 * @desc 加入默认企业
 * @param {*String} _enterpriseId 
 */
function joinDefaultEnterprise(_enterpriseId) {
    var _userBo = JSON.parse(lsObj.getLocalStorage('userBo'));
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/loginWithEnterprise?token=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: JSON.stringify({
            enterpriseId: _enterpriseId,
            appId: appId
        }),
        dataType: "json",
        success: function(data) {
            var success = data.success;
            if (success == 1) {
                var row = data.rows;
                var token = data.token;
                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('userBo', JSON.stringify(row[0]));
                lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));
                var roleNameStr = JSON.parse(lsObj.getLocalStorage('userBo')).roleNames;
                if (roleNameStr == null) {
                    roleNameStr = "";
                }
                var roleNameNum = 1;
                if (roleNameStr == "企业管理人员" || roleNameStr == "企业管理员") {
                    roleNameNum = 0;
                } else if (roleNameStr == "阴保工程师") {
                    roleNameNum = 1;
                } else if (roleNameStr == "现场检测人员") {
                    roleNameNum = 2;
                } else if (roleNameStr == "阴保工程师,现场检测人员" || roleNameStr == "现场检测人员,阴保工程师") {
                    roleNameNum = 3; //既有双重角色
                } else if (roleNameStr.indexOf('阴保管家运营人员') > -1) {
                    roleNameNum = 4; //平台管理员
                } else {
                    roleNameNum = 1; //其他情况 默认使用阴保工程师
                }
                lsObj.setLocalStorage('params', roleNameNum);
                location.href = '../../../index.html';
            } else {
                switch (data.code) {
                    case "400":
                        layer.alert(getLanguageValue("serverException"), {
                            title: getLanguageValue("tip"),
                            skin: 'self-alert'
                        });
                        // $('.hidkuai2 span').text('服务器异常！');
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', { '失败原因': '服务器异常！' });
                            }
                        } catch (error) {

                        }
                        break;
                    default:
                        layer.alert(getLanguageValue("loginFail")+data.msg, {
                            title: getLanguageValue("tip"),
                            skin: 'self-alert'
                        });
                        break;
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



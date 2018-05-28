/**
 * @Author: lizhenzhen 
 * @Date: 2017-5-21
 * @Last Modified by: lizhenzhen
 * @Last Modified time: 2017-5-22
 * @func 登录时用户默认企业id为空时，获取企业列表的js操作
 */

$(function() {
    
    getEnterpriseList();

    // 从当前应用下选择企业
    $("#submitSelect").click(function() {
        // 单选按钮，选择企业登陆
        var enterpriseListRadios = $(".bottom1 .enterpriseList input[type=radio]");
        for (var i = 0; i < enterpriseListRadios.length; i++) {
            var selectItem = $(enterpriseListRadios[i]).prop("checked");
            if (selectItem == true) {
                // console.log(i);
                var isCheaked = true;
                var currentEnterpriseId = $(enterpriseListRadios[i]).val();
                // console.log(currentEnterpriseId);
                // 设置默认企业登录
                setDefaultEnterprise(currentEnterpriseId);
            }
        };
        if (isCheaked != true) {
            layer.confirm("请先选择企业", {
                title: "提示",
                btn: ['确定'],
                skin: "self"
            });
        }
    });
    // 从用户加入的所有企业选择
    $("#openEnp").click(function() {
        // 单选按钮，选择企业登陆
        var enterpriseListRadios = $(".bottom2 .enterpriseList input[type=radio]");
        for (var i = 0; i < enterpriseListRadios.length; i++) {
            var selectItem = $(enterpriseListRadios[i]).prop("checked");
            if (selectItem == true) {
                var isCheaked = true;
                var currentEnterpriseId = $(enterpriseListRadios[i]).val();
                // 选择企业查询该企业下有无当前应用
                getAppList(currentEnterpriseId); // 传入选择的企业id
            }
        };
        if (isCheaked != true) {
            layer.confirm("请先选择企业", {
                title: "提示",
                btn: ['确定'],
                skin: "self"
            });
        }
    });

});

/*
 *获取用户在应用下的企业列表
 */
function getEnterpriseList() {
   
    //如果跳转过来页面有noZYAX字段，且等于true，则不渲染中盈安信企业list 2017年6月5日 20:47:03
    var noHasZYAX=new Boolean(getParameter('noZYAX',window.top.document.URL));
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/login/getEnterpriseList?token=" + lsObj.getLocalStorage('token') + "&appCode=" + appCode + "&status=0,1,-1,-2",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            console.log(data);
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
                    for (var temp of enterpriseListArr) {
                        if(noHasZYAX&&temp.objectId==ZYAXenterpriseId){//不去渲染中盈安信节点 yang 2017年6月5日 20:46:44
                            continue;
                        }
                        // console.log(temp.status);
                        if (temp.status == 1) {
                            // 激活企业
                            joinedArr.push(temp);
                        }
                        if (temp.status == 0) {
                            // 受邀企业
                            invitedArr.push(temp);
                        }
                        if (temp.status == -1) {
                            // 失效企业
                            forbiddenArr.push(temp);
                        }
                        if (temp.status == -2) {
                            // 移除企业
                            deletedArr.push(temp);
                        }
                    }
                    renderDOM(joinedArr, "您已加入的企业", "", "joined", "", "enterpriseDom");
                    renderDOM(invitedArr, "您受邀请的企业", "", "invited", "", "enterpriseDom");
                    renderDOM(forbiddenArr, "您已失效的企业", "disable_radio", "forbidden", "disabled", "enterpriseDom");
                    renderDOM(deletedArr, "您已移除的企业", "disable_radio", "deleted", "disabled", "enterpriseDom");

                    // 单选按钮，选择企业登陆
                    var enterpriseListRadios = $(".enterpriseList input[type=radio]");
                    for (var i = 0; i < enterpriseListRadios.length; i++) {
                        (function(i) {
                            $(enterpriseListRadios[i]).on("click", function() {
                                $(enterpriseListRadios).prop("checked", false);
                                $(enterpriseListRadios[i]).prop("checked", true);
                                // console.log(i);
                            });
                        })(i)
                    };
                } else {
                    $("#submitSelect").addClass("forbidBtn");
                    $("#enterpriseDom  .noEnterprise").css({
                        display: "block"
                    });
                    layer.confirm('当前应用的企业列表为空，是否查询其它企业下的应用？', {
                        skin: 'self'
                    }, function(index) {
                        layer.closeAll();
                        $(".enterprise_list .Contain .bottom1").css({
                            display: 'none'
                        });
                        // 企业列表为空,查询用户的所有企业列表
                        allEnterpriseList();
                    });
                }
            } else {
                layer.confirm("企业列表加载失败!", {
                    title: "提示",
                    btn: ['确定'],
                    skin: "self"
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

/*
 *  渲染企业列表
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

/*
 * 获取用户所有的企业列表
 */
function allEnterpriseList() {
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/login/getEnterpriseList?token=" + lsObj.getLocalStorage('token') + "&status=0,1,-1,-2",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            console.log(data);
            var success = data.success;
            if (success == 1) {
                $(".enterprise_list .Contain .bottom2").css({
                    display: 'block'
                });
                var enterpriseListArr = data.rows;
                // enterpriseListArr = [{ objectId: "a8da2cba-4393-412f-b4b8-4a84a3d6028b", enterpriseName: "激活企业", status: 1 }, { objectId: "b8da2cba-4393-412f-b4b8-4a84a3d6028b", enterpriseName: "受邀企业", status: 0 }, { objectId: "c8da2cba-4393-412f-b4b8-4a84a3d6028b", enterpriseName: "失效企业", status: -1 }, { objectId: "d8da2cba-4393-412f-b4b8-4a84a3d6028b", enterpriseName: "移除企业", status: -2 }];
                if (enterpriseListArr.length > 0) {
                    var joinedArr = [],
                        invitedArr = [],
                        forbiddenArr = [],
                        deletedArr = [];
                    for (var temp of enterpriseListArr) {
                        if (temp.status == 1) {
                            // 激活企业
                            joinedArr.push(temp);
                        }
                        if (temp.status == 0) {
                            // 受邀企业
                            invitedArr.push(temp);
                        }
                        if (temp.status == -1) {
                            // 失效企业
                            forbiddenArr.push(temp);
                        }
                        if (temp.status == -2) {
                            // 移除企业
                            deletedArr.push(temp);
                        }
                    }
                    renderDOM(joinedArr, "您已加入的企业", "", "joined", "", "selectOpen");
                    renderDOM(invitedArr, "您受邀请的企业", "", "invited", "", "selectOpen");
                    renderDOM(forbiddenArr, "您已失效的企业", "disable_radio", "forbidden", "disabled", "selectOpen");
                    renderDOM(deletedArr, "您已移除的企业", "disable_radio", "deleted", "disabled", "selectOpen");

                    // 单选按钮，选择企业登陆
                    var enterpriseListRadios = $(".enterpriseList input[type=radio]");
                    for (var i = 0; i < enterpriseListRadios.length; i++) {
                        (function(i) {
                            $(enterpriseListRadios[i]).on("click", function() {
                                $(enterpriseListRadios).prop("checked", false);
                                $(enterpriseListRadios[i]).prop("checked", true);
                                console.log(i);
                            });
                        })(i)
                    };
                    // 加载企业   
                    // 选择企业查询该企业下有无当前应用
                    // getAppList(enterpriseId); // 传入选择的企业id
                } else {
                    $(".allEnp").css({
                        display: "none"
                    });
                    $("#openEnp").addClass("forbidBtn");
                    $(".enterprise_list .enterpriseList .noEnterprise").css({
                        display: "block"
                    });
                }
            }
        }
    });
}

/*
 * 设置默认企业登录
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
                layer.confirm("设置默认企业失败!", {
                    title: "提示",
                    btn: ['确定'],
                    skin: "self"
                });
            }
        }
    });
}

/*
 *获取当前用户的默认企业Id
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
                } else {
                    // 获取用户的企业列表
                    location.href = '../../../get_enterprise_list.html';
                }
            } else {
                //当前用户不存在默认企业Id
                $('.hidkuai2 span').text('当前用户未设置默认登录企业');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

/*
 *加入默认企业
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
            // console.log(data);
            var success = data.success;
            if (success == 1) {
                var row = data.rows;
                var token = data.token;
                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('userBo', JSON.stringify(row[0]));
                lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));
                var roleNameStr = JSON.parse(lsObj.getLocalStorage('userBo')).roleNames;
                // console.log(roleNameStr)
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
                console.log(data);
                switch (data.code) {
                    case "400":
                        $('.hidkuai2 span').text('服务器异常！');
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', { '失败原因': '服务器异常！' });
                            }
                        } catch (error) {

                        }
                        break;
                    case "403":
                        $('.hidkuai2 span').text('参数异常');
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', { '失败原因': '参数异常' });
                            }
                        } catch (error) {}
                        break;
                    case "PU03030":
                        $('.hidkuai2 span').text('用户未加入企业!');
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', { '失败原因': '用户未加入企业！' });
                            }
                        } catch (error) {

                        }
                        break;
                    case "PU03031":
                        $('.hidkuai2 span').text('用户没有该企业应用的使用权限！!');
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', { '失败原因': '用户没有该企业应用的使用权限！' });
                            }
                        } catch (error) {

                        }
                        break;
                    case "PU03033":
                        $('.hidkuai2 span').text('您的账户已被该企业冻结');
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', { '失败原因': '用户已被该企业冻结！' });
                            }
                        } catch (error) {

                        }

                        break;
                    case "PU03035":
                        $('.hidkuai2 span').text('您的账户已被该企业移除');
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', { '失败原因': '用户已被该企业移除！' });
                            }
                        } catch (error) {

                        }
                        break;
                    case "PU01000":
                        $('.hidkuai2 span').text('该企业不存在');
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', { '失败原因': '企业不存在' });
                            }
                        } catch (error) {

                        }
                        break;
                    default:
                        layer.confirm("登录失败！", {
                            title: "提示",
                            btn: ['确定'],
                            skin: "self"
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
}

/*
 * 获取企业下的应用列表
 */
function getAppList(enterpriseId) {
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/enterprise/getAppList?token=" + lsObj.getLocalStorage('token') + "&enterpriseId=" + enterpriseId,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            console.log(data);
            var success = data.success;
            if (success == 1) {
                // 判断有无当前应用
                var enpAppArr = data.rows;
                // enpAppArr = [{
                //     "objectId": "90748268-321e-11e7-b075-001a4a1601c6",
                //     "appCode": "xxws",
                //     "appName": "阴保管家",
                // }, {
                //     "objectId": "90748268-321e-11e7-b075-001a4a1601c6",
                //     "appCode": "xxws",
                //     "appName": "阴保管家",
                // }];
                var isExists = false;
                // 判断企业是否存在该应用
                for (var i = 0; i < enpAppArr.length; i++) {
                    console.log(enpAppArr[i].appCode);
                    if (enpAppArr[i].appCode == appCode) {
                        // console.log(true);
                        isExists = true;
                    } else {
                        // 没有
                        isExists = false;
                    }
                };
                if (isExists == true) {
                    joinDefaultEnterprise(enterpriseId);
                } else {
                    layer.confirm('该企业下无此应用,是否申请加入企业的此项应用', {
                        skin: 'self',
                        btn: ["确定", "取消"]
                    }, function(index) {
                        layer.close(index);
                        // 如果是,根据企业id查询企业名字
                        getById(enterpriseId);
                    });
                }
            }
        }
    });
}

/*
 * 根据企业id查询企业名字
 */
function getById(enterpriseId) {
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/enterprise/getById?token=" + lsObj.getLocalStorage('token') + "&objectId=" + enterpriseId,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            console.log(data);
            if (data.success == 1) {
                console.log(data);
                var enpInfo = data.rows;
                // enpInfo = [{
                //     "objectId": "b909b469-f7e6-4c98-85a0-98e1c2b54a4e",
                //     "enterpriseName": "北京中盈安信",
                //     "address": "北京市海淀区学院路30号科大天工大厦A座13层",
                //     "fromAppName": "阴保管家",
                //     "enpAdminName": "赵赵",
                // }];
                var enterpriseName = enpInfo[0].enterpriseName;
                //根据企业名称发送请求加入
                applyEnterprise(enterpriseName);
            }
        }
    });
}

/*
 * 申请加入企业
 */
function applyEnterprise(enterpriseName) {
    var _data = {
        enterpriseName: enterpriseName,
        signName: "阴保管家",
        appCode: appCode
    };
    $.ajax({
        type: "post",
        url: "/cloudlink-core-framework/user/applyEnterprise?token=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(_data),
        success: function(data) {
            console.log(data);
            var success = data.success;
            if (success == 1) {
                layer.confirm('申请加入成功，等待该企业审核', {
                    skin: 'self',
                    btn: ["确定"]
                }, function(index) {
                    layer.close(index);
                    location.href = '../../../login.html';
                });
            } else {
                layer.confirm("申请加入失败！", {
                    title: "提示",
                    btn: ['确定'],
                    skin: "self"
                });
            }
        }
    });
}
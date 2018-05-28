/**
 * @Author: liangyuanyuan
 * @Date: 2017-2-14
 * @Last Modified by: lizhenzhen
 * @Last Modified time: 2017-4-19
 * @func 登录页面的js操控
 */

/*
 * 修改内容：添加用户角色的判断
 */

var Obj = {
    nameImg: "url(/src/images/login_img/nameImg.png)",
    nameImg1: "url(/src/images/login_img/nameImg1.png)",
    passwordImg: "url(/src/images/login_img/password1.png)",
    passwordImg1: "url(/src/images/login_img/password.png)",
    //当获取焦点的时候，设置样式
    focus: function(obj, imgSrc) {
        obj.css({
            background: "#ECF7FF",
            border: "1px solid #5EB6F9"
        });
        obj.find('input').css("background", "#ECF7FF");
        // obj.find('.common').css("border-left", "1px solid #5EB6F9");
        obj.find('.bg').css("background-image", imgSrc);
    },
    //当失去焦点的时候，设置样式。
    blur: function(obj, imgSrc) {
        obj.css({
            background: "#fff",
            border: "1px solid #bbb"
        });
        obj.find('input').css("background", "#fff");
        // obj.find('.common').css("border-left", "1px solid #bbb");
        obj.find('.bg').css("background-image", imgSrc);
    }
}


$(".name input").focus(function() {
    Obj.focus($(".name"), Obj.nameImg);
}).blur(function() {
    Obj.blur($(".name"), Obj.nameImg1);
});

$(".password input").focus(function() {
    Obj.focus($(".password"), Obj.passwordImg);
}).blur(function() {
    Obj.blur($(".password"), Obj.passwordImg1);
})
var passwordVal = null;
var nameVal = null;
String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

//确认登录(要进行验证)
$('.btn').click(function() {
    nameVal = $(".name input").val().trim().trim();
    passwordVal = $(".password input").val().trim().trim(); //密码使用MD5加密的方式
    var phoneReg = /^1\d{10}$/; //正则匹配
    if (nameVal == "" || nameVal == null) { //如果手机号为空。给用户一个提示
        $('.hidkuai1 span').text('手机号码不能为空');
        //诸葛IO
        try {
            if (tjSwitch == 1) {
                tjSdk.track('登录失败', {
                    '失败原因': '手机号码不能为空'
                });
            }
        } catch (error) {

        }
        return;
    } else if (!phoneReg.test(nameVal)) {
        $('.hidkuai1 span').text('您输入的手机号码不正确');
        //诸葛IO
        try {
            if (tjSwitch == 1) {
                tjSdk.track('登录失败', {
                    '失败原因': '输入的手机号码不正确'
                });
            }
        } catch (error) {

        }
        return;
    } else if (passwordVal == '' || passwordVal == null) {
        $('.hidkuai1 span').text('');
        $('.hidkuai2 span').text('密码不能为空');
        //诸葛IO
        try {
            if (tjSwitch == 1) {
                tjSdk.track('登录失败', {
                    '失败原因': '密码不能为空'
                });
            }
        } catch (error) {

        }

        return;
    } else {
        $('.hidkuai1 span').text('');
        $('.hidkuai2 span').text('');
        accountNumber();
    }
});

// 验证手机号是否注册 接口开始
function accountNumber() {
    var _data = {
        "registNum": nameVal
    };
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-framework/login/checkUser",
        contentType: "application/json",
        data: _data,
        dataType: "json",
        success: function(data, status) {
            // alert(data)
            var res = data.rows.isExist;
            if (res == 0) {
                $('.hidkuai1 span').text('账号未注册');
                //诸葛IO
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('登录失败', {
                            '失败原因': '账号未注册'
                        });
                    }
                } catch (error) {

                }

                return false;
            } else {
                requestData(); //如果已经注册好了
                return true;
            }
        }
    });
}
//验证手机号和密码
function requestData() {
    var _data = {
        "loginNum": nameVal,
        "password": passwordVal,
        "appId": appId
    };
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/loginByPassword",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "json",
        success: function(data) {
            var success = data.success;
            if (success == 1) {
                var row = data.rows;
                console.log(row);
                var token = data.token;
                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('userBo', JSON.stringify(row[0]));
                lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));
                //诸葛IO
                try {
                    if (tjSwitch == 1) {
                        tjIdentify(row[0]);
                        tjSdk.track('登录成功');
                    }
                } catch (e) {

                }
                // getDefaultEnterpriseId(row[0].objectId);
                getEnterpriseList();
                //  alert(token);
            } else {
                if (data.code == "PU03000") {
                    $('.hidkuai2 span').text('用户名和密码不一致');
                    //诸葛IO
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('登录失败', {
                                '失败原因': '用户名和密码不一致'
                            });
                        }
                    } catch (error) {

                    }

                    return;
                }
                if (data.code == "PU03010") {
                    $('.hidkuai2 span').text('该用户未注册');
                    //诸葛IO
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('登录失败', {
                                '失败原因': '该用户未注册'
                            });
                        }
                    } catch (error) {

                    }

                    return;
                }
                if (data.code == "PU03020") {
                    $('.hidkuai2 span').text('该用户已注册');
                    //诸葛IO
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('登录失败', {
                                '失败原因': '该用户已注册'
                            });
                        }
                    } catch (error) {

                    }

                    return;
                }
                if (data.code == "PU03032") {
                    $('.hidkuai2 span').text('该账户已冻结');
                    //诸葛IO
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('登录失败', {
                                '失败原因': '该账户已冻结'
                            });
                        }
                    } catch (error) {

                    }

                    return;
                }
                if (data.code == "400") {
                    $('.hidkuai2 span').text('服务器异常');
                    //诸葛IO
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('登录失败', {
                                '失败原因': '代码异常'
                            });
                        }
                    } catch (error) {}
                    return;
                }
                if (data.code == "401") {
                    $('.hidkuai2 span').text('参数异常');
                    //诸葛IO
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('登录失败', {
                                '失败原因': '参数异常'
                            });
                        }
                    } catch (error) {}
                    return;
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

//获取当前用户的默认企业Id
function getDefaultEnterpriseId(_userId) {
    // alert(_userId);
    var _token = lsObj.getLocalStorage('token');
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/login/getDefaultEnterpriseId?token=" + _token + "&appId=" + appId,
        contentType: "application/json",
        data: JSON.stringify({
            //appCode: 'corrosionengineer'
        }),
        dataType: "json",
        success: function(data) {
            // console.log(data);
            var success = data.success;
            if (success == 1) {
                //当前用户存在默认企业Id
                var _enterpriseId = data.rows[0].enterpriseId;
                if (_enterpriseId != ZYAXenterpriseId) {
                    $('.hidkuai2 span').text('非中盈安信管理人员帐号');
                    return;
                }
                joinDefaultEnterprise(_enterpriseId);

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
/**
 * 获得用户企业列表 
 * @author yangyuanzhu
 * @date 20170527
 * @description 从当前用户的企业列表中取到企业列表 判断是否有中盈安信
 */
function getEnterpriseList() {
    var _token = lsObj.getLocalStorage('token');
    $.ajax({
        type: "get",
        url: "/cloudlink-core-framework/login/getEnterpriseList?token=" + lsObj.getLocalStorage('token') + "&appId=" + appId + "&status=0,1,-1,-2",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            var success = data.success;
            if (success == 1) {
                //判断企业列表中有无中盈安信
                var rows = data.rows;
                for (var i = 0; i < rows.length; i++) {
                    console.log(rows[i].objectId)
                    if (rows[i].objectId == ZYAXenterpriseId) {
                        //进行登录
                        joinDefaultEnterprise(ZYAXenterpriseId);
                        return;
                    }
                }
                //循环完毕若无中盈安信企业，则进行提示
                $('.hidkuai2 span').text('您的企业列表中无JasGroup');
                return;
            } else {
                layer.msg("加载企业列表失败", { skin: "self-msg" });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
//加入默认企业
function joinDefaultEnterprise(_enterpriseId) {
    var _token = lsObj.getLocalStorage('token');
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/loginWithEnterprise?token=" + _token,
        contentType: "application/json",
        data: JSON.stringify({
            appId: appId,
            enterpriseId: _enterpriseId
        }),
        dataType: "json",
        success: function(data) {
            // alert(JSON.stringify(data));
            var success = data.success;
            if (success == 1) {
                var row = data.rows;
                var token = data.token;
                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('userBo', JSON.stringify(row[0]));
                lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));

                var roleIdStr = JSON.parse(lsObj.getLocalStorage('userBo')).roleIds;
                if (roleIdStr.indexOf(expertRoleId) == -1) {
                    console.log(JSON.parse(lsObj.getLocalStorage('userBo')))
                    $('.hidkuai2 span').text('未拥有专家角色');
                    return;
                }
                location.href = '../../../index.html';

                // 进入页面之前加载一下
                // 获取当前的ip的地址，上传到服务器
                getNowIP();
            } else {
                switch (data.code) {
                    case "400":
                        $('.hidkuai2 span').text('服务异常');
                        //诸葛IO
                        try {
                            if (tjSwitch == 1) {
                                tjSdk.track('登录失败', {
                                    '失败原因': '服务异常'
                                });
                            }
                        } catch (error) {

                        }

                        break;
                    case "401":
                        $('.hidkuai2 span').text('参数异常');
                        //诸葛IO
                        try {
                            if (tjSwitch == 1) {
                                tjSdk.track('登录失败', {
                                    '失败原因': '参数异常'
                                });
                            }
                        } catch (error) {

                        }

                        break;
                    case "E01":
                        $('.hidkuai2 span').text('您的账户已被该企业冻结');
                        //诸葛IO
                        try {
                            if (tjSwitch == 1) {
                                tjSdk.track('登录失败', {
                                    '失败原因': '账户被该企业冻结'
                                });
                            }
                        } catch (error) {

                        }

                        break;
                    case "E02":
                        $('.hidkuai2 span').text('您的账户已被该企业移除');
                        //诸葛IO
                        try {
                            if (tjSwitch == 1) {
                                tjSdk.track('登录失败', {
                                    '失败原因': '账户被该企业移除'
                                });
                            }
                        } catch (error) {

                        }

                        break;
                    case "E03":
                        $('.hidkuai2 span').text('该企业不存在');
                        //诸葛IO
                        try {
                            if (tjSwitch == 1) {
                                tjSdk.track('登录失败', {
                                    '失败原因': '该企业不存在'
                                });
                            }
                        } catch (error) {

                        }

                        break;
                    default:
                        $('.hidkuai2 span').text(data.msg);
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


// 获取当前的ip的地址，上传到服务器
function getNowIP() {
    var token = lsObj.getLocalStorage("token");
    $.ajax({
        type: "POST",
        url: "/cloudlink-corrosionengineer/message/saveIp?token=" + token,
        contentType: "application/json",
        success: function(data) {
            // console.log("aaaa");
            // console.log(data);
        }
    })
}
//诸葛IO用户身份识别函数
function tjIdentify(_userBo) {
    tjSdk.identify(_userBo.objectId, {
        objectName: _userBo.userName,
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
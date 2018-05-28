/** 
 * @file
 * @author  lizhenzhen
 * @desc 创建企业js逻辑操作
 * @date 2017-06-12 09:40:15
 * @last modified by lizhenzhen
 * @last modified time  2017-06-12
 */

$(function() {
    changePageStyle("../.."); // 换肤
    getAddressSelectItem();
    var token = lsObj.getLocalStorage("token"); // 获取token
    var user = JSON.parse(lsObj.getLocalStorage("userBo")); // 获取userBo
    var language=lsObj.getLocalStorage("i18nLanguage");
    if(language == "en"){
        $(".en-hide").hide();
    }

    var b = false, // 验证企业名称
        c = false, // 公司规模
        // d = false; //角色判断
        e = false, // 地址判断
        // e1 = false, // 验证省
        // e2 = false, // 验证市
        // e3 = false, // 验证区
        f = false; // 验证详细地址
    // 验证企业名称是否重复
    $('.companyName').blur(function() {
        var val = $('.companyName').val();
        var companyNameReg = /[\u4e00-\u9fa5a-zA-Z]+$/;
        if (val == "" || val == null) {
            $('.companyMsg').css({
                display: 'block'
            });
            $('.companyMsg').text(getLanguageValue("companyNameNoNull"));
            b = false;
            return;
        } else if (!companyNameReg.test(val)) {
            $('.companyMsg').css({
                display: 'block'
            });
            $('.companyMsg').text(getLanguageValue("companyRegError"));
            b = false;
            return;
        } else {
            $('.companyMsg').css({
                display: 'none'
            });
            // 验证企业名称是重复
            $.ajax({
                url: "/cloudlink-core-framework/enterprise/checkEnpName?enterpriseName=" + encodeURI(val),
                type: "get",
                contentType: "application/json",
                success: function(data, status) {
                    var success = data.success;
                    var res = data.rows[0].isExist;
                    if (success == 1 && res == true) {
                        $('.companyMsg').css({
                            display: 'block'
                        });
                        $('.companyMsg').text(getLanguageValue("companyHasDone"));
                        b = false;
                    } else {
                        $('.companyMsg').css({
                            display: 'none'
                        });
                        b = true;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                    console.log(XMLHttpRequest); // 请求对象
                    console.log(textStatus); // 返回状态错误类型
                    console.log(errorThrown); // 捕获的异常对象

                    // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                    layer.alert(NET_ERROR_MSG, {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                }
            });
        }
    });

    // 公司规模判断
    $('.companyScale').blur(function() {
        var Scale = $('.companyScale').val();
        if (Scale == 0) {
            $('.companyScaleMsg').css({
                display: 'block'
            });
            c = false;
            $('.companyScaleMsg').text(getLanguageValue("pleaseSelectCompanyTs"));
            return;
        } else {
            $('.companyScaleMsg').css({
                display: 'none'
            });
            c = true;
        }
    });

    // 地址的判断
    // $('.address-info').blur(function() {
    //     var province = $('.province option:selected').text(),
    //         city = $('.city option:selected').text(),
    //         county = $('.county option:selected').text();
    //     if (province != "请选择" && city != "请选择" && county != "请选择") {
    //         $('.addressMsg').css({
    //             display: 'none'
    //         });
    //         e = true;
    //     }
    // });

    // 省
    $('.province').blur(function() {
        var province = $('.province option:selected').text();
        if (province != "请选择") {
            $('.addressMsg').css({
                display: 'none'
            });
        }
    });
    // 市
    $('.city').blur(function() {
        var city = $('.city option:selected').text();
        if (city != "请选择") {
            $('.addressMsg').css({
                display: 'none'
            });
        }
    });
    // 区
    $('.county').blur(function() {
        var county = $('.county option:selected').text();
        if (county != "请选择") {
            $('.addressMsg').css({
                display: 'none'
            });
        }
    });

    // 详细地址的判断
    $(".detailAddress").blur(function() {
        var detailAddress = $(".detailAddress").val();
        var detailAddressReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/; //中文、英文、数字包括下划线
        if (!detailAddressReg.test(detailAddress)) {
            $('.detailAddressMsg').css({
                display: 'block'
            });
            $('.detailAddressMsg').text('输入地址格式不正确');
            f = false;
            return;
        } else {
            $('.detailAddressMsg').css({
                display: 'none'
            });
            f = true;
        }
    })

    // 注册号数字判断
    // $('.registerNum').blur(function() {
    //     var registerNum = $('.registerNum').val();
    //     console.log(registerNum);
    //     var registerNumReg = /^[0-9]*$/;
    //     if (!registerNumReg.test(registerNum)) {
    //         $('.registerNumMsg').css({
    //             display: 'block'
    //         });
    //         $('.registerNumMsg').text('注册号只能是数字');
    //     } else {
    //         $('.registerNumMsg').css({
    //             display: 'none'
    //         });
    //     }
    // });

    // 点击注册
    $('#createEnp').click(function() {
        var companyName = $('.companyName').val(),
            companyScale = $('.companyScale').val(),
            province = $('.province').val();
            city = $('.city').val();
            county = $('.county').val(); //区县代码
            address = $('.province option:selected').text() + $('.city option:selected').text() + $('.county option:selected').text(); //企业地址
            detailAddress = $('.detailAddress').val(); //详细地址
        var Role = "993132df-9972-40eb-83f0-47e0f470f912";
        // 企业名称判断
        if (companyName == "" || companyName == null) {
            $('.companyMsg').css({
                display: 'block'
            });
            $('.companyMsg').text(getLanguageValue("companyNameNoNull"));
            b = false;
            return;
        };
        // 企业规模判断
        if (companyScale == 0) {
            $('.companyScaleMsg').css({
                display: 'block'
            });
            c = false;
            $('.companyScaleMsg').text(getLanguageValue("pleaseSelectCompanyTs"));
            return;
        };
        if(language != "en"){
            // 地址判断
            if (province == "请选择" || province == "" || province == null || city == "请选择" || city == "" || city == null || county == "请选择" || county == "" || county == null) {
                $('.addressMsg').css({
                    display: 'block'
                });
                e = false;
                $('.addressMsg').text('请选择完整地址');
                return;
            } else {
                $('.addressMsg').css({
                    display: 'none'
                });
                e = true;
            }
            // 详细地址的判断
            if (detailAddress == "" || detailAddress == null) {
                $('.detailAddressMsg').css({
                    display: 'block'
                });
                f = false;
                $('.detailAddressMsg').text('详细地址不能为空');
                return;
            }
        }else{
            e = true;
            f = true;
        }
        _data = {
            "enterpriseName": companyName,
            "enterpriseScale": companyScale,
            "province": province,
            "city": city,
            "county": county,
            "address": address,
            "detailAddress": detailAddress,
            "roleIds": Role,
            "appId": appId
        };
        // 创建企业并登陆
        if (b == true && c == true && e == true && f == true) {
            createEnterpris(_data);
        }
    });
});


/**
 * @desc 创建企业并登陆
 * @method createEnterpris
 * @param {String} _data 
 */
function createEnterpris(_data) {
    $.ajax({
        type: "post",
        // url: "/cloudlink-core-framework/enterprise/add?token=" +
        //     lsObj.getLocalStorage('token'),
        url: "/cloudlink-core-framework/login/registEnterprise?token=" +
            lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: JSON.stringify(_data),
        success: function(data) {
            if (data.success == 1) {
                var dataObj = {};
                // dataObj.enterpriseIds = data.rows[0].objectId;
                dataObj.enterpriseIds = data.rows[0].enterpriseId;
                freezeFromApp(dataObj);
                // layer.confirm("创建企业成功", {
                //     title: getLanguageValue("tip_title"),
                //     btn: ['确定'], //按钮
                //     skin: "self",
                // }, function() {
                //     //诸葛IO
                //     try {
                //         if (zhugeSwitch == 1) {
                //             zhuge.track('创建企业', {
                //                 "结果": "成功"
                //             });
                //         }
                //     } catch (e) {

                //     }
                //     joinDefaultEnterprise(data.rows[0].objectId);
                // });
            } else {
                switch (data.code) {
                    case "403":
                        layer.msg(data.msg, {
                            skin: "self-msg"
                        });
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

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
};

/**
 * @desc 加入默认企业
 * @method joinDefaultEnterprise
 * @param {*} _enterpriseId 
 */
function joinDefaultEnterprise(_enterpriseId) {
    var _userBo = JSON.parse(lsObj.getLocalStorage('userBo'));
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/loginWithEnterprise?token=" + lsObj.getLocalStorage('token'),
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

                layer.closeAll();
                parent.location.reload();

            } else {
                switch (data.code) {
                    case "400":
                        layer.msg("服务器异常！", {
                            skin: "self-msg"
                        });
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': '服务器异常！'
                                });
                            }
                        } catch (error) {

                        }
                        break;
                    case "PU03030":
                        layer.msg(data.msg, {
                            skin: "self-msg"
                        });
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {

                        }
                        break;
                    case "PU03031":
                        layer.msg(data.msg, {
                            skin: "self-msg"
                        });
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {

                        }
                        break;
                    case "PU03033":
                        layer.msg(data.msg, {
                            skin: "self-msg"
                        });
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {

                        }
                        break;
                    case "PU01000":
                        layer.msg(data.msg, {
                            skin: "self-msg"
                        });
                        //诸葛IO
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('登录失败', {
                                    '失败原因': data.msg
                                });
                            }
                        } catch (error) {

                        }
                        break;
                    default:
                        layer.msg("登陆企业失败！", {
                            skin: "self-msg"
                        });
                        break;
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获得省市区列表，并且绑定联动
 * @method getAddressSelectItem
 */
function getAddressSelectItem() {
    $.ajax({
        url: "/cloudlink-core-framework/data/dictionary/queryList?classType=administrativeDivisions&businessType=province",
        dataType: "json",
        method: "get",
        success: function(result) {
            if (result.success == 1) {
                var data = result.rows;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].typeCode + "'>" + data[i].typeName + "</option>"
                }
                var myobj = $("#province");
                // if (myobj.options.length == 0) {
                $("#province").html(options);
                //$("#province").selectpicker('refresh');
                // }
                $("#province").bind("change", function() {
                    var provinceCode = $("#province").val();
                    $.get("/cloudlink-core-framework/data/dictionary/queryList", {
                        'classType': "administrativeDivisions",
                        'parentBusinessType': "province",
                        "parentTypeCode": provinceCode
                    }, function(result, status) {
                        if (result.success == 1) {
                            var data = result.rows;
                            var optionscity = "<option value=''>请选择</option>";
                            var orginOption = "<option value=''>请选择</option>";
                            for (var i = 0; i < data.length; i++) {
                                optionscity += ("<option value='" + data[i].typeCode + "'>" + data[i].typeName + "</option>");
                            }
                            $("#city").html(optionscity);
                            $("#county").html(orginOption);
                        }
                    })
                });
                $("#city").bind("change", function() {
                    var cityCode = $("#city").val();
                    $.get("/cloudlink-core-framework/data/dictionary/queryList", {
                        'classType': "administrativeDivisions",
                        'parentBusinessType': "city",
                        "parentTypeCode": cityCode
                    }, function(result, status) {
                        if (result.success == 1) {
                            var data = result.rows;
                            var optionscounty = "<option value=''>请选择</option>";
                            for (var i = 0; i < data.length; i++) {
                                optionscounty += ("<option value='" + data[i].typeCode + "'>" + data[i].typeName + "</option>");
                            }
                            $("#county").html(optionscounty);
                        }
                    })
                });
            } else {
                layer.msg("加载下拉选失败", {
                    skin: "self-msg"
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 冻结企业对应用的使用权限
 */
function freezeFromApp(_dataObj){
    $.ajax({
        type: "post",
        url: "/cloudlink-corrosionengineer/accout/audit?token=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(_dataObj),
        success: function(data) {
            if(data.success == 1){
                //点击注册 成功后调用自动跳转页面函数
                // $(".quite").hide();
                // $(".create-enterprise").hide();
                // $(".create-success").show();
                layer.alert(getLanguageValue("waitAudit"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                },function(){
                    //  logoutFun();
                    parent.location.reload();
                });
            }else{
                layer.alert(getLanguageValue("enrollFail"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 退出登录
 */
function logoutFun(){
    $.ajax({
        url: "/cloudlink-core-framework/login/logout?token=" + lsObj.getLocalStorage('token'),
        type: "POST",
        dataType: "json",
        success: function (data) {
            var success = data.success;
            if (success == 1) {
                layer.closeAll();
                parent.location.href = '../../../login.html';
            } 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title:getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

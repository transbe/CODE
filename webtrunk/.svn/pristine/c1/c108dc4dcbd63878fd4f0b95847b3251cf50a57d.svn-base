/**
 * @file 
 * @author: liangyuanyuan
 * @desc: 登录时用户默认企业id为空时，创建企业的js
 * @Date: 2017-05-12 09:40:41
 * @Last Modified by: rongfeiyu
 * @Last Modified time: 2017-06-12 17:59:28
 */


$(function() {
   var b = false, // 验证企业名称
        c = false, // 公司规模
        // d = false; //角色判断
        x = false, // 地址判断
        y = false; // 详细地址判断
    getAddressSelectItem(); // 获取地址下拉选

    var language=lsObj.getLocalStorage("i18nLanguage");
    if(language == "en"){
        $(".forgotPassword .title .logobg").css("background", "url(../../images/logo/forget-logo_en.png) no-repeat 0 66px;");
        $(".en-hide").hide();
    }
    /**
     * @desc 验证企业名称是否重复
     */
    $('.companyName').blur(function() {
        var val = $('.companyName').val();
        var companyNameReg = /[\u4e00-\u9fa5a-zA-Z]+$/;
        if (val == "" || val == null) {
            $('.companyMsg').css({
                display: 'block'
            });
            $('.companyMsg span').text(getLanguageValue("companyNameNoNull"));
            b = false;
            return;
        } else if (!companyNameReg.test(val)) {
            $('.companyMsg').css({
                display: 'block'
            });
            $('.companyMsg span').text(getLanguageValue("companyRegError"));
            b = false;
            return;
        } else {
            $('.companyMsg').css({
                display: 'none'
            });
            // 验证企业名称是重复
            $.ajax({
                url: "/cloudlink-core-framework/login/checkEnpName?enterpriseName=" + encodeURI(val),
                type: "get",
                contentType: "application/json",
                success: function(data, status) {
                    // console.log(data);
                    var success = data.success;
                    var res = data.rows[0].isExist;
                    if (success == 1 && res == true) {
                        $('.companyMsg').css({
                            display: 'block'
                        });
                        $('.companyMsg span').text(getLanguageValue("companyHasDone"));
                        b = false;
                    } else {
                        $('.companyMsg').css({
                            display: 'none'
                        });
                        b = true;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    // console.log(XMLHttpRequest);
                    // console.log(textStatus);
                    // console.log(errorThrown);
                    layer.alert(NET_ERROR_MSG, {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                }
            });
        }
    });

    /**
     * @desc 公司规模判断
     */
    $('.companyScale').blur(function() {
        var Scale = $('.companyScale').val();
        if (Scale == 0) {
            $('.companyScaleMsg').css({
                display: 'block'
            });
            c = false;
            $('.companyScaleMsg span').text(getLanguageValue("pleaseSelectCompanyTs"));
            return;
        } else {
            $('.companyScaleMsg').css({
                display: 'none'
            });
            c = true;
        }
    });

    // 注册号数字判断
    // $('.registerNum').blur(function() {
    //     var registerNum = $('.registerNum').val();
    //     var registerNumReg = /^[0-9]*$/;
    //     if (!registerNumReg.test(registerNum)) {
    //         $('.registerNumMsg').css({
    //             display: 'block'
    //         });
    //         $('.registerNumMsg span').text('注册号只能是数字');
    //     }
    // });
    $('.province').blur(function() {
        var province = $('.province option:selected').text();
        if (province != "请选择") {
            $('.addressMsg').css({
                display: 'none'
            });
        }
    });
    $('.city').blur(function() {
        var city = $('.city option:selected').text();
        if (city != "请选择") {
            $('.addressMsg').css({
                display: 'none'
            });
        }
    });
    $('.county').blur(function() {
        var county = $('.county option:selected').text();
        if (county != "请选择") {
            $('.addressMsg').css({
                display: 'none'
            });
        }
    });

    /**
     * @desc 详细地址的判断
     */
    $(".detailAddress").blur(function() {
        var detailAddress = $(".detailAddress").val();
        var detailAddressReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/; //中文、英文、数字包括下划线
        if (!detailAddressReg.test(detailAddress)) {
            $('.detailAddressMsg').css({
                display: 'block'
            });
            $('.detailAddressMsg span').text('输入地址格式不正确');
            y = false;
            return;
        } else {
            $('.detailAddressMsg').css({
                display: 'none'
            });
            y = true;
        }
    });

    /**
     * @desc 点击注册
     */
    $('.btn3').click(function() {
        // 取值
        var companyName = $('.companyName').val(),
            companyScale = $('.companyScale').val(),
            // registerNum = $('.registerNum').val(),
            // companyRole = $('.companyRole').val(),
            province = $('.province').val();
            city = $('.city').val();
            county = $('.county').val(); //区县代码
            detailAddress = $(".detailAddress").val();
        var  address = $('.province option:selected').text() + $('.city option:selected').text() + $('.county option:selected').text(); //企业地址
        var Role = "993132df-9972-40eb-83f0-47e0f470f912";

        // 企业名称判断
        if (companyName == "" || companyName == null) {
            $('.companyMsg').css({
                display: 'block'
            });
            $('.companyMsg span').text(getLanguageValue("companyNameNoNull"));
            b = false;
            return;
        };

        // 企业规模判断
        var Scale = $('.companyScale').val();
        if (Scale == 0) {
            $('.companyTs').css({
                display: 'block'
            })
            c = false;
            $('.companyTs span').text(getLanguageValue("pleaseSelectCompanyTs"));
            return;
        } else {
            $('.companyTs').css({
                display: 'none'
            })
            c = true
        }
        // if (companyRole == "请选择") {
        //     $('.companyRoleMsg').css({
        //         display: 'block'
        //     });
        //     d = false;
        //     $('.companyRoleMsg span').text('请选择人员角色');
        //     return;
        // } else {
        //     $('.companyRoleMsg').css({
        //         display: 'none'
        //     });
        //     d = true;
        // }

        // 地址判断
        if (province == "请选择" || province == "" || province == null || city == "请选择" || city == "" || city == null || county == "请选择" || county == "" || county == null) {
            $('.addressMsg').css({
                display: 'block'
            });
            $('.addressMsg span').text('请选择完整地址');
            x = false;
            return;
        } else {
            $('.addressMsg').css({
                display: 'none'
            });
            x = true;
        }

        // 详细地址的判断
        if (detailAddress == "" || detailAddress == null) {
            $('.detailAddressMsg').css({
                display: 'block'
            });
            y = false;
            $('.detailAddressMsg span').text('详细地址不能为空');
            return;
        }

        // 请求参数取值
        _data = {
            "enterpriseName": companyName,
            "enterpriseScale": companyScale,
            // "registerNum": registerNum,
            // "roleIds": companyRole,
            "province": province,
            "city": city,
            "county": county,
            "address": address,
            "detailAddress": detailAddress,
            "roleIds": Role,
            appCode: appCode
        };

        // 创建企业并登陆
        if (b == true && c == true && x == true && y == true) {
            createEnterpris(_data);
        }
    });

    $('.btn4').click(function() {
        //诸葛IO
        try {
            if (tjSwitch == 1) {
                tjSdk.track('注册成功,等待审核');
            }
        } catch (e) {}
        location.href = 'login.html';
    });

});

/**
 * @desc 创建企业并登陆
 * @param {*String} _data 
 */
function createEnterpris(_data) {
    $.ajax({
        type: "post",
        url: "/cloudlink-core-framework/login/registEnterpriseAndLogin?token=" +
            lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: JSON.stringify(_data),
        success: function(data) {
            if (data.success == 1) {
                var dataObj = {};
                dataObj.enterpriseIds = data.rows[0].enterpriseId;
                freezeFromApp(dataObj)
                // $('.bottom3,.Notes').css({
                //     display: "none"
                // })
                // $('.bottom4').css({
                //     display: "block"
                // });
                // jumpto();
            } else {
                switch (data.code) {
                    case "PU01010":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip_title"),
                            skin: 'self-alert'
                        });
                        break;
                    case "PU00000":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip_title"),
                            skin: 'self-alert'
                        });
                        break;
                    default:
                        layer.alert(getLanguageValue("enrollFail"), {
                            title: getLanguageValue("tip_title"),
                            skin: 'self-alert'
                        });
                        break;
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
};

/**
 * @desc 获得省市区列表，并且绑定联动
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
                // alert(JSON.stringify(myobj));
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
                layer.alert("下拉选加载失败", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
 * @desc 自动跳转页面
 */
function jumpto() {
    var a = 5;
    $('.jumpTo').html(a).show();
    var t = setInterval(function() {
        a--;
        if (a < 1) {
            clearInterval(t);
            $('.jumpTo').hide();
            location.href = 'login.html';
        }
        $('.jumpTo').html(a).show();
    }, 1000)
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
                $('.bottom3,.Notes').css({
                    display: "none"
                })
                $('.bottom4').css({
                    display: "block"
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

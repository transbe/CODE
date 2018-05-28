/**
 * @author: liangyuanyuan
 * @Date: 2017-2-14
 * @Last Modified by: lizhenzhen
 * @Last Modified time: 2017-5-22
 * @file 注册页面的js逻辑
 */

var d = false, //  短信验证码验证
    e = false, //  手机号码,姓名验证
    h = false, //  邮箱验证
    g = false, //  获取验证码验证，再次输入密码验证
    f = false, //  图片验证码验证,密码验证
    fg = false, // 判断是否创建企业
    b = false, //  企业名字验证
    c = false, // 企业规模
    x = false, // 地址判断
    y = false; // 详细地址判断
$(function() {
    getAddressSelectItem();
});
$(".btn1").click(function() {
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('填写手机号码');
        }
    } catch (e) {}
    var mobileNum = $('.phone').val();
    if (mobileNum == '' || mobileNum == null) {
        $('.phoneMeg').css({
            display: 'block'
        });
        $('.phoneMeg span').text('手机号码不能为空');
        e = false;
        return;
    }
    var val = $('.imgCode').val();
    if (val == '' || val == null) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text('图片验证码不能为空');
        f = false;
        return;
    }
    $('.phone').blur();
    if (!e) {
        return;
    }
    $('.imgCode').blur();
    if (!f) {
        return;
    }
    var SMScodeval = $('.SMScode').val();
    if (SMScodeval == "" || SMScodeval == null) {
        $('.SMScodeMsg').css({
            display: 'block'
        });
        $('.SMScodeMsg span').text('短信验证码不能为空');
        d = false;
        return;
    }
    $('.SMScode').blur();
    if (!d) {
        return;
    }
    if (!g) {
        $('.SMScodeMsg span').text('请先获取验证码');
        $('.SMScodeMsg').css({
            display: 'block'
        });
        return;
    } else {
        $('.SMScodeMsg').css({
            display: 'none'
        })
    }
    // 短信验证码校验
    var _data = {
        sendNum: mobileNum,
        verifyCode: SMScodeval
    };
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-framework/verfy/checkVerifyCode",
        contentType: "application/json",
        data: _data,
        success: function(data, status) {
            console.log(data);
            var success = data.success;
            if (success == 1) {
                $('.top img').attr('src', '/src/images/enroll_img/2.png')
                $('.bottom1,.bottom3,.bottom4,.Notes').css({
                    display: "none"
                });
                $('.bottom2').css({
                    display: "block"
                });
                e = false;
                d = false;
                g = false;
                f = false;
            } else {
                $('.SMScodeMsg').css({
                    display: 'block'
                });
                $('.SMScodeMsg span').text('手机号或验证码错误');
                return;
            }
        }
    });
});
$('.btn2').click(function() {
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('填写个人信息');
        }
    } catch (e) {}
    var mobileNum = $('.phone').val();
    var userName = $('.userName').val();
    var password1 = $('.password1').val();
    var password2 = $('.password2').val();
    if (userName == '' || userName == null) {
        $('.nameMsg').css({
            display: 'block'
        });
        $('.nameMsg span').text('姓名不能为空');
        e = false;
        return;
    } else if (password1 == '' || password1 == null) {
        $('.pswMsg1').css({
            display: 'block'
        });
        $('.pswMsg1 span').text('密码不能为空');
        f = false;
        return
    } else if (password2 == '' || password2 == null) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text('请再次输入密码');
        g = false;
        return
    }
    $('.userName').blur();
    if (!e) {
        return;
    }
    $('.password1').blur();
    if (!f) {
        return;
    }
    $('.password2').blur();
    if (!g) {
        return;
    }
    $('.email').blur();
    if (!h) {
        return;
    };
    $('.top img').attr('src', '/src/images/enroll_img/3.png')
    $('.bottom1,.bottom2,.bottom4').css({
        display: "none"
    })
    $('.bottom3,.Notes').css({
        display: "block"
    })
    $('#applyAddEnp').css({
        display: "none"
    })
    e = false;
    f = false;
    g = false;
    h = false;

    //   // 注册用户
    //   var userInfo = {
    //       mobileNum: mobileNum,
    //       password: password2,
    //       userName: userName,
    //       appCode: appCode
    //   };
    //   //   console.log(userInfo);
    //   registUser(userInfo);

});
$('.btn3').click(function() {
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('填写企业信息');
        }
    } catch (e) {}
    var mobileNum = $('.phone').val();
    var userName = $('.userName').val();
    var password = $('.password1').val();
    var enterpriseName = $('.companyName').val();
    if (enterpriseName == "" || enterpriseName == null) {
        $('.companyMsg').css({
            display: 'block'
        });
        $('.companyMsg span').text('企业名称不能为空');
        b = false;
        return;
    }
    $('.companyName').blur();
    if (!b) {
        return;
    };
    var Scale = $('.companyScale').val();
    if (Scale == 0) {
        $('.companyTs').css({
            display: 'block'
        })
        c = false;
        $('.companyTs span').text('请选择公司规模');
        return;
    } else {
        $('.companyTs').css({
            display: 'none'
        })
        c = true
    }

    /**
     * @description 角色指定为阴保工程师 993132df-9972-40eb-83f0-47e0f470f912
     */
    var Role = "993132df-9972-40eb-83f0-47e0f470f912";
    var province = $('.province').val(),
        city = $('.city').val(),
        county = $('.county').val(); //区县代码
    var address = $('.province option:selected').text() + $('.city option:selected').text() + $('.county option:selected').text(); //企业地址
    var detailAddress = $('.detailAddress').val(); //详细地址

    // 地址判断
    if (province == "" || province == null || city == "" || city == null || county == "" || county == null) {
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
        $('.detailAddressMsg').text('详细地址不能为空');
        return;
    }

    _data = {
        "enterpriseName": enterpriseName,
        "enterpriseScale": Scale,
        "province": province,
        "city": city,
        "county": county,
        "address": address,
        "detailAddress": detailAddress,
        "mobileNum": mobileNum,
        "userName": userName,
        "password": password,
        "roleIds": Role,
        "appCode": appCode
    };
    if (b == true && c == true && x == true && y == true) {
        // 注册接口调用
        $.ajax({
            url: "/cloudlink-core-framework/login/registAndLogin",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(_data),
            dataType: "json",
            success: function(data) {
                var success = data.success;
                if (success == 1) {
                    //点击注册 成功后调用自动跳转页面函数
                    $('.top img').attr('src', '/src/images/enroll_img/4.png')
                    $('.bottom1,.bottom2,.bottom3,.Notes').css({
                        display: "none"
                    })
                    $('.bottom4').css({
                        display: "block"
                    });
                    jumpto();
                    var row = data.rows;
                    var token = data.token;
                    lsObj.setLocalStorage('token', token);
                    lsObj.setLocalStorage('loginRow', JSON.stringify(row));
                } else {
                    layer.confirm("注册失败！", {
                        title: "提示",
                        btn: ['确定'],
                        skin: "self"
                    });
                }
            },
        });
    }
});
$('.btn4').click(function() {
    //诸葛IO
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('注册成功');
        }
    } catch (e) {}
    location.href = 'login.html';
    //   location.href = "index.html";
});

/**
 * @desc 手机号验证
 */
$('.phone').blur(function() {
    var val = $(this).val().trim();
    var phoneReg = /^1\d{10}$/;
    if (val == '' || val == null) {
        // $('.phoneMeg').css({
        //     display: 'block'
        // });
        // $('.phoneMeg span').text('手机号码不能为空');
        e = false;
        return;
    } else if (!phoneReg.test(val)) {
        $('.phoneMeg').css({
            display: 'block'
        });
        $('.phoneMeg span').text('请填写正确手机号码');
        e = false;
        return false;
    } else {
        $('.phoneMeg').css({
            display: 'none'
        });
        // 手机号是否注册过接口调用开始
        var _data = {
            "registNum": val,
            "validateType": "mobile"
        };
        $.ajax({
            url: "/cloudlink-core-framework/login/checkUser",
            type: "GET",
            contentType: "application/json",
            data: _data,
            dataType: "json",
            success: function(data, status) {
                var res = data.rows[0].isExist;
                if (res == true && data.msg == "手机号已被注册！") {
                    $('.phoneMeg').css({
                        display: 'block'
                    });
                    $('.phoneMeg span').text('手机号码已注册');
                    e = false;
                } else {
                    $('.phoneMeg').css({
                        display: 'none'
                    });
                    e = true;
                }
            },
            error: function() {}
        });
        // 手机号是否注册过接口调用结束
    }
});
$('.companyScale').blur(function() {
    var Scale = $('.companyScale').val();
    if (Scale == 0) {
        $('.companyTs').css({
            display: 'block'
        });
        c = false;
        $('.companyTs span').text('请选择公司规模');
        return;
    } else {
        $('.companyTs').css({
            display: 'none'
        });
        c = true;
    }
});
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
    console.log(detailAddress);
    var detailAddressReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/; //中文、英文、数字包括下划线
    if (!detailAddressReg.test(detailAddress)) {
        $('.detailAddressMsg').css({
            display: 'block'
        });
        $('.detailAddressMsg').text('输入地址格式不正确');
        y = false;
        return;
    } else {
        $('.detailAddressMsg').css({
            display: 'none'
        });
        y = true;
    }
})

//图片验证码
var imgStr = '';
code();
/**
 * @desc 获取随机验证码
 */
function code() {
    var az = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    var dom1 = parseInt(Math.random() * 10000 % 62);
    var dom2 = parseInt(Math.random() * 10000 % 62);
    var dom3 = parseInt(Math.random() * 10000 % 62);
    var dom4 = parseInt(Math.random() * 10000 % 62);
    imgStr = az[dom1] + az[dom2] + az[dom3] + az[dom4];
    $('.code i').text(imgStr)
}

//刷新验证码
$('.code').click(function() {
    code();

});

/**
 * @desc 图片验证开始
 */
$('.imgCode').blur(function() {
    var val = $(this).val();
    var imgReg = new RegExp(imgStr, "i");
    if (val == '' || val == null) {
        // $('.imgMeg').css({
        //     display: 'block'
        // });
        // $('.imgMeg span').text('图片验证码不能为空');
        f = false;
        return;
    } else if (!imgReg.test(val)) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text('图片验证码填写错误');
        f = false;
        return;
    } else {
        $('.imgMeg').css({
            display: 'none'
        });
        if (!g) {
            $('.styles').css({
                background: '#49CB86'
            })
        }
        f = true;
    }
});

/**
 * @desc 短信验证码验证
 */
$('.SMScode').blur(function() {
    var val = $(this).val();
    if (val == "" || val == null) {
        // $('.SMScodeMsg').css({
        //     display: 'block'
        // });
        // $('.SMScodeMsg span').text('短信验证码不能为空');
        d = false;
        return;
    } else {
        d = true;
        $('.SMScodeMsg').css({
            display: 'none'
        });
    }
});

/**
 * @desc 点击获取短信验证码事件
 */
$('.styles').click(function() {
    var mobileNum = $('.phone').val();
    if (mobileNum == '' || mobileNum == null) {
        $('.phoneMeg').css({
            display: 'block'
        });
        $('.phoneMeg span').text('手机号码不能为空');
        return;
    }
    $('.phone').blur();
    var val = $('.imgCode').val();
    if (val == '' || val == null) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text('图片验证码不能为空');
        return;
    }
    $('.imgCode').blur();
    var aa = $('.styles').html();
    if (aa == "重新获取") {
        g = false;
    }
    if (!f || g || !e) {
        return;
    }
    times();
    $('.styles').text('60秒后再次获取');
    $('.styles').css({
        background: '#ccc'
    })
    f = false;
    //ajax发送手机号，接受验证码
    var number = $('.phone').val();
    var _data = {
        sendMode: "1",
        sendNum: number,
        signName: "阴保管家",
        useCategory: "regist"
    }
    $.ajax({
        url: "/cloudlink-core-framework/verfy/getVerifyCode",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(_data),
        success: function(data) {
            //   console.log(data);
            try {
                //诸葛IO
                if (zhugeSwitch == 1) {
                    zhuge.track('短信验证');
                }
            } catch (e) {}
        }
    })
});


/**
 * @desc 姓名验证
 */
$('.userName').blur(function() {
    var val = $('.userName').val().trim();
    var nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,15}$/;
    if (val == "" || val == null) {
        // $('.nameMsg').css({
        //     display: 'block'
        // });
        // $('.nameMsg span').text('姓名不能为空');
        e = false;
        return;
    } else if (!nameReg.test(val)) {
        $('.nameMsg').css({
            display: 'block'
        });
        $('.nameMsg span').text('姓名格式不正确');
        e = false;
        return;
    } else {
        e = true;
        $('.nameMsg').css({
            display: 'none'
        });
    }
});

/**
 * @desc 密码验证
 */
$('.password1').blur(function() {
    var val = $(this).val();
    var pwReg = /^[\dA-z]{6,12}$/;
    if (val == '' || val == null) {
        $('.pswMsg1').css({
            display: 'block'
        });
        $('.pswMsg1 span').text('密码不能为空');
        f = false;
        return
    } else if (!pwReg.test(val)) {
        $('.pswMsg1').css({
            display: 'block'
        });
        $('.pswMsg1 span').text('密码为6~12位字母或者数字');
        f = false;
        return;
    } else {
        f = true;
        $('.pswMsg1').css({
            display: 'none'
        });
    }
});

/**
 * @desc 确认密码验证
 */
$('.password2').blur(function() {
    var val1 = $('.password1').val();
    var val2 = $(this).val();
    if (val2 == "" || val2 == null) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text('请再次输入密码');
        g = false;
        return
    } else if (val1 != val2) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text('两次输入密码不一致');
        g = false;
        return
    } else {
        g = true;
        $('.pswMsg2').css({
            display: 'none'
        });
    }
});

/**
 * @desc 邮箱验证
 */
$('.email').blur(function() {
    var val = $(this).val();
    var emailReg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
    if (val == '' || val == null) {
        h = true;
        $('.emailMsg').css({
            display: 'none'
        });
    } else if (!emailReg.test(val)) {
        $('.emailMsg').css({
            display: 'block'
        });
        $('.emailMsg span').text('请输入正确邮箱格式');
        h = false;
        return;
    } else {
        h = true;
        $('.emailMsg').css({
            display: 'none'
        });
    }
});

/**
 * @desc 企业名称验证
 */
$('.companyName').blur(function() {
    var val = $('.companyName').val();
    var companyNameReg = /[\u4e00-\u9fa5a-zA-Z]+$/;
    if (val == "" || val == null) {
        // $('.companyMsg').css({
        //     display: 'block'
        // });
        // $('.companyMsg span').text('企业名称不能为空');
        b = false;
        return;
    } else if (!companyNameReg.test(val)) {
        $('.companyMsg').css({
            display: 'block'
        });
        $('.companyMsg span').text('企业名称格式错误');
        b = false;
        return;
    } else {
        $('.companyMsg').css({
            display: 'none'
        });
        // 验证企业名称是否存在接口调用开始
        $.ajax({
            url: "/cloudlink-core-framework/login/checkEnpName?enterpriseName=" + val,
            type: "get",
            contentType: "application/json",
            success: function(data, status) {
                console.log(data);
                var success = data.success;
                var res = data.rows[0].isExist;
                //   console.log(res);
                if (success == 1 && res == true) {
                    $('.companyMsg').css({
                        display: 'block'
                    });
                    $('#applyAddEnp').css({
                        display: "block"
                    });
                    $('.companyMsg span').text('企业名称已注册');
                    b = false;
                    // 企业已注册，根据企业name查询企业id,
                    // 根据企业id 加入企业，设置默认企业
                    // 企业已注册  用户申请加入企业
                    //   console.log("企业名称已注册");
                    //   $('.companyMsg').css({
                    //       display: 'block'
                    //   });
                    //   $('.companyMsg span').text('企业已注册,申请加入');
                    //   fg = true;
                } else {
                    $('.companyMsg').css({
                        display: 'none'
                    });
                    $('#applyAddEnp').css({
                        display: "none"
                    });
                    b = true;
                    // 企业未注册，先注册企业，并注册用户，加入企业
                    //   console.log("企业名称未注册");
                    //   $('.companyMsg').css({
                    //       display: 'block'
                    //   });
                    //   $('.companyMsg span').text('企业未注册');
                    //   fg = false;
                }
                //   b = false;
                // 提供原来接口，注册用户，同时注册企业并加入
            }
        });
        // 验证企业名称是否存在接口调用结束
    }
});

/**
 * @desc 点击获取短信验证码倒计时事件
 * @method times
 */
function times() {
    var a = 60;
    g = true;
    var t = setInterval(function() {
        a--;
        $('.styles').text(a + '秒后再次获取');
        if (a < 1) {
            $('.styles').text('重新获取');
            $('.styles').css({
                background: '#49CB86'
            })
            clearInterval(t);
            f = true;
        }
    }, 1000)
}

/**
 * @desc 自动跳转页面
 * @method jumpto
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
 * @desc 注册用户
 * @method registUser
 * @param {*String} userInfo 
 */
function registUser(userInfo) {
    $.ajax({
        url: "/cloudlink-core-framework/login/regist",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(userInfo),
        success: function(data, status) {
            console.log(data);
            if (data.success == 1 && data.msg == "ok") {
                // 注册用户成功
            } else {
                // 注册用户失败
            }
        }
    });
}

/**
 * @desc 申请加入企业
 */
$("#applyAddEnp").click(function(e) {
    e.preventDefault();
    var companyName = $('.companyName').val(),
        userName = $('.userName').val(),
        password = $('.password1').val(),
        mobileNum = $('.phone').val();
    layer.confirm("您确定要申请加入《" + companyName + "》企业吗？", {
        skin: 'self',
        btn: ["确定", "取消"]
    }, function(index) {
        layer.close(index);
        applyEnterprise(companyName, userName, password, mobileNum);
    });
});

/**
 * @desc 申请加入企业
 * @method applyEnterprise
 * @param {*String} enterpriseName 
 * @param {*String} userName 
 * @param {*String} password 
 * @param {*String} mobileNum 
 */
function applyEnterprise(enterpriseName, userName, password, mobileNum) {
    var _data = {
        enterpriseName: enterpriseName,
        userName: userName,
        password: password,
        mobileNum: mobileNum,
        appCode: appCode
    };
    $.ajax({
        type: "post",
        url: "/cloudlink-core-framework/login/applyEnterprise",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(_data),
        success: function(data) {
            console.log(data);
            var success = data.success;
            if (success == 1) {
                //申请加入企业成功
                $('.top img').attr('src', '/src/images/enroll_img/4.png')
                $('.bottom1,.bottom2,.bottom3,.Notes').css({
                    display: "none"
                })
                $('.bottom4').css({
                    display: "block"
                });
                $("#jump").css({
                    display: "none"
                });
                $("#success").html("申请加入成功，等待审核！");
            } else {
                layer.confirm("申请加入企业失败！", {
                    title: "提示",
                    btn: ['确定'],
                    skin: "self"
                });
            }
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
                layer.confirm("下拉选加载失败", {
                    title: "提示",
                    btn: ['确定'],
                    skin: "self"
                });
            }
        }
    });
}
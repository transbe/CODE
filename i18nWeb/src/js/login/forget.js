/**
 * @file 
 * @author: liangyuanyuan
 * @desc: 忘记密码页面的js
 * @date: 2017-03-12 09:40:41
 * @last modified by: rongfeiyu
 * @last modified time: 2017-06-12 17:59:28
 */
 var language=lsObj.getLocalStorage("i18nLanguage");
(function () {  
   if(language=="en"){
        $(".forgotPassword .title .logobg").css("background","url(/src/images/logo/forget-logo_en.png) no-repeat 0 66px");
        $('.top img').attr('src', '/src/images/forget_img/1_en.png');
        // 加载手机区号
        $("#phoneInput").loadPhoneArea({
            language:"en",
            classArr:["phone"],
            placeholder:getLanguageValue("inputPhone")
        });
   }else{
        $("#phoneInput").append('<input class="phone" type="text" placeholder="&nbsp;'+ getLanguageValue("inputPhone")+'">')
   }
}());

var d = false, // 短信验证码验证
    e = false, // 手机号码验证
    g = false, // 再次输入密码验证
    f = false; // 图片验证码验证

$(".btn1").click(function() {
    var mobileNum = $('.phone').val();
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('安全验证');
        }
    } catch (e) {}
    if (mobileNum == '' || mobileNum == null) {
        $('.phoneMeg').css({
            display: 'block'
        });
        $('.phoneMeg span').text(getLanguageValue("phoneNoNull"));
        e = false;
        return;
    }
    var val = $('.imgCode').val();
    if (val == '' || val == null) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text(getLanguageValue("imageVerificationNoNull"));
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
        $('.SMScodeMsg span').text(getLanguageValue("SMSVerificationNoNull"));
        d = false;
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
    $('.SMScode').blur();
    if (!d) {
        return;
    }
    if (!g) {
        $('.SMScodeMsg span').text(getLanguageValue("pleaseGetVerification"));
        $('.SMScodeMsg').css({
            display: 'block'
        });
        return;
    } else {
        $('.SMScodeMsg').css({
            display: 'none'
        })
    }
    // 短信验证码校验接口调用开始
    var number = $('.phone').val();
    var verifyCode = $('.SMScode').val();
    var phoneNo = $("#phoneNo").html();
    // var _data = { "sendNum": number, "sendMode": 1, "verifyCode": verifyCode };
    if(language == "en"  &&  phoneNo != "+86"){
        number = phoneNo + number;
    }
    var _data = {
        "sendNum": number,
        "verifyCode": verifyCode
    };
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-framework/verfy/checkVerifyCode",
        contentType: "application/json",
        data: _data,
        success: function(data, status) {
            var success = data.success;
            if (success == 1) {
                $('.bottom1,.bottom3,.bottom4,.Notes').css({
                    display: "none"
                })
                $('.bottom2').css({
                    display: "block"
                })
                if(language=="en"){
                    $('.top img').attr('src', '/src/images/forget_img/2_en.png')
                }else{
                    $('.top img').attr('src', '/src/images/forget_img/2.png')
                }
                e = false;
                f = false;
                d = false;
                g = false;
            } else {
                $('.SMScodeMsg').css({
                    display: 'block'
                });
                $('.SMScodeMsg span').text(getLanguageValue("phoneOrSMSVerificationError"));
                return;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
});
$(".btn2").click(function() {
    var mobileNum = $('.phone').val();
    var password1 = $('.pw1').val();
    var password2 = $('.pw2').val();
    var verifyCode = $('.SMScode').val();
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('重置密码');
        }
    } catch (e) {}
    if (password1 == '' || password1 == null) {
        $('.pswMsg1').css({
            display: 'block'
        });
        $('.pswMsg1 span').text(getLanguageValue("pwdNoNull"));
        f = false;
        return
    } else if (password2 == '' || password2 == null) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text(getLanguageValue("pleaseAgainPwd"));
        g = false;
        return
    }
    $('.pw1').blur();
    if (!e) {
        return;
    }
    $('.pw2').blur();
    if (!f) {
        return;
    }

    /**
     * @desc 重置密码
     */
    var _data = {
        "mobileNum": mobileNum,
        "password": password1,
        "verifyCode": verifyCode,
        "appCode": appCode
    }
    $.ajax({
        url: "/cloudlink-core-framework/login/resetPasswordAndLogin",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "json",
        success: function(data, status) {
            if (data.success == 1) {
                if(language=="en"){
                    $('.top img').attr('src', '/src/images/forget_img/3_en.png')
                }else{
                    $('.top img').attr('src', '/src/images/forget_img/3.png')
                }

                $('.bottom2').css({
                    display: "none"
                })
                $('.bottom3').css({
                    display: "block"
                })
            } else {
                switch (data.code) {
                    case "403":
                        layer.alert(data.msg, {
                            title: getLanguageValue("tip_title"),
                            skin: 'self-alert'
                        });
                        break;
                    default:
                        layer.alert(getLanguageValue("updatePwdFail"), {
                            title: getLanguageValue("tip_title"),
                            skin: 'self-alert'
                        });
                        break;
                };

            }

        }
    });
});

//图片验证码
var imgStr = '';
code();




/**
 * @desc 刷新验证码
 */
$('.code').click(function() {
    code();
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('刷新验证码');
        }
    } catch (e) {}
});

/**
 * @desc 手机号验证
 */
$('.phone').blur(function() {
    var val = $(this).val().trim();
    var phoneReg = /^1\d{10}$/;
    if (val == '' || val == null) {
        $('.phoneMeg').css({
            display: 'block'
        });
        $('.phoneMeg span').text(getLanguageValue("phoneNoNull"));
        e = false;
        return;
    } else if (!phoneReg.test(val)) {
        $('.phoneMeg').css({
            display: 'block'
        });
        $('.phoneMeg span').text(getLanguageValue("phoneInputError"));
        e = false;
        return false;
    } else {
        $('.phoneMeg').css({
            display: 'none'
        });
        // 手机号是否注册过接口调用开始
        var _data = { "registNum": val };
        $.ajax({
            url: "/cloudlink-core-framework/login/checkUser",
            type: "GET",
            contentType: "application/json",
            data: _data,
            dataType: "json",
            success: function(data, status) {
                var res = data.rows[0].isExist;
                if (res == 1) {
                    $('.phoneMeg').css({
                        display: 'none'
                    });
                    e = true;
                } else {
                    $('.phoneMeg').css({
                        display: 'block'
                    });
                    $('.phoneMeg span').text(getLanguageValue("phoneNoreEnroll"));
                    e = false;
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
 * @desc 图片验证
 */
$('.imgCode').blur(function() {
    var val = $(this).val();
    var imgReg = new RegExp(imgStr, "i");
    if (val == '' || val == null) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text(getLanguageValue("imageVerificationNoNull"));
        f = false;
        return;
    } else if (!imgReg.test(val)) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text(getLanguageValue("imageVerificationInputError"));
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
        $('.SMScodeMsg').css({
            display: 'block'
        });
        $('.SMScodeMsg span').text(getLanguageValue("SMSVerificationNoNull"));
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
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('点击获取短信验证码');
        }
    } catch (e) {}
    var mobileNum = $('.phone').val();
    if (mobileNum == '' || mobileNum == null) {
        $('.phoneMeg').css({
            display: 'block'
        });
        $('.phoneMeg span').text(getLanguageValue("phoneNoNull"));
        return;
    }
    var val = $('.imgCode').val();
    if (val == '' || val == null) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text(getLanguageValue("imageVerificationNoNull"));
        return;
    }
    $('.phone').blur();
    $('.imgCode').blur();
    // console.log(e, g, f)
    // if (!f || g || !e) {
    //     return;
    // }
    var aa = $('.styles').html();
    if (aa == getLanguageValue("regain")) {
        g = false;
    }
    if (!f || g || !e) {
        return;
    }
    $('.phone').blur();
    times();
    $('.styles').text(getValueHasArgs("timeRegain",['60']));
    $('.styles').css({
        background: '#ccc'
    })
    f = false;
    //ajax发送手机号，接受验证码
    var number = $('.phone').val();

    var _data ={
            sendMode: "1",
            sendNum: number,
            signName: "阴保管家",
            useCategory: "general",
            "sceneType": ""
        };
    var phoneNo = $("#phoneNo").html();
   
    if(language=="en" && phoneNo != "+86"){
        _data.sendNum =  phoneNo+number,
        _data.signName =  "CPEngineer",
        _data.signName.isIntl = true
    }
                
    $.ajax({
        url: "/cloudlink-core-framework/verfy/getVerifyCode",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(_data),
        success: function(data) {
            if (data.success == 1) {} else {
                layer.alert(getLanguageValue("getImgCodeError"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
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
});

/**
 * @desc 重置密码验证
 */
$('.pw1').blur(function() {
    var val = $(this).val();
    var pwReg = /^[\dA-z]{6,12}$/;
    if (val == '' || val == null) {
        $('.pswMsg1').css({
            display: 'block'
        });
        $('.pswMsg1 span').text(getLanguageValue("pwdNoNull"));
        e = false;
        return
    } else if (!pwReg.test(val)) {
        if(language == "zh"){
            $('.pswMsg1').css({
                display: 'block'
            });
            $('.pswMsg1 span').text(getLanguageValue("pwdFormatError"));
            e = false;
            return;
        }else{
             e = true;
        }
    } else {
        e = true;
        $('.pswMsg1').css({
            display: 'none'
        });
    }
});
/**
 * @desc 再次确认密码验证
 */
$('.pw2').blur(function() {
    var val1 = $('.pw1').val();
    var val2 = $('.pw2').val();
    if (val2 == "" || val2 == null) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text(getLanguageValue("pleaseAgainPwd"));
        f = false;
        return
    } else if (val1 != val2) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text(getLanguageValue("differentPwd"));
        f = false;
        return
    } else {
        f = true;
        $('.pswMsg2').css({
            display: 'none'
        });
    }
});

/**
 * @desc 点击完成跳转登陆页面
 */
$(".btnhid").click(function() {
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('重置完成');
        }
    } catch (e) {}
    location.href = "login.html"
});

/**
 * @desc 生成验证码
 */
function code() {
    var az = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    var dom2 = parseInt(Math.random() * 10000 % 62);
    var dom3 = parseInt(Math.random() * 10000 % 62);
    var dom4 = parseInt(Math.random() * 10000 % 62);
    var dom1 = parseInt(Math.random() * 10000 % 62);
    imgStr = az[dom1] + az[dom2] + az[dom3] + az[dom4];
    $('.code i').text(imgStr)
}

/**
 * @desc 点击获取短信验证码倒计时事件
 */
function times() {
    var a = 60;
    g = true;
    var t = setInterval(function() {
        a--;
        $('.styles').text(getValueHasArgs("timeRegain",[a]));
        if (a < 1) {
            $('.styles').text(getLanguageValue("regain"));
            $('.styles').css({
                background: '#49CB86'
            })
            clearInterval(t);
            f = true;
        }
    }, 1000)
}
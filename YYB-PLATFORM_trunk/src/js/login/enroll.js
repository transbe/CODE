/**
 * @file 
 * @author: liangyuanyuan
 * @desc: 注册页面的js
 * @Date: 2017-06-12 09:40:41
 * @Last Modified by: rongfeiyu
 * @Last Modified time: 2017-06-12 17:59:28
 */

var d = false, //  短信验证码验证
    e = false, //  手机号码,姓名验证
    h = false, //  邮箱验证
    g = false, //  获取验证码验证，再次输入密码验证
    b = false, //  企业名字验证
    f = false; //  图片验证码验证,密码验证

/**
 * @desc 校验账号、验证码
 */
$(".btn1").click(function() {
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('填写手机号码');
        }
    } catch (e) {

    }
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
    // 短信验证码校验接口调用开始

    var _data = { "sendNum": mobileNum, "sendMode": 1, "verifyCode": SMScodeval };
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-framework/login/checkVerifyCode",
        contentType: "application/json",
        data: _data,
        dataType: "json",
        success: function(data, status) {
            var success = data.success;
            if (success == 1) {
                $('.top img').attr('src', '/src/images/enroll_img/2.png')
                $('.bottom1,.bottom3,.bottom4,.Notes').css({
                    display: "none"
                })
                $('.bottom2').css({
                        display: "block"
                    })
                    //   $('.top img').attr('src', 'src/images/forget_img/2.png')
                    //   $('.bottom1').css({
                    //       display: "none"
                    //   })
                    //   $('.bottom2').css({
                    //       display: "block"
                    //   })
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
    // 短信验证码校验接口调用结束
});

/**
 * @desc 校验姓名密码
 */
$('.btn2').click(function() {
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('填写个人信息');
        }
    } catch (e) {}
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
    }
    $('.top img').attr('src', '/src/images/enroll_img/3.png')
    $('.bottom1,.bottom2,.bottom4').css({
        display: "none"
    })
    $('.bottom3,.Notes').css({
        display: "block"
    })
    e = false;
    f = false;
    g = false;
    h = false;
});

/**
 * @desc 校验企业信息
 */
$('.btn3').click(function() {
    try {
        //诸葛IO
        if (zhugeSwitch == 1) {
            zhuge.track('填写企业信息');
        }
    } catch (e) {

    }
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
    //   console.log(b);
    if (!b) {
        return;
    }
    var Scale = $('.companyScale').val();
    if (Scale == 0) {
        $('.companyTs').css({
            display: 'block'
        })
        $('.companyTs span').text('请选择公司规模');
        return;
    } else {
        $('.companyTs').css({
            display: 'none'
        })
    }

    //角色指定为阴保工程师 993132df-9972-40eb-83f0-47e0f470f912
    var Role = "993132df-9972-40eb-83f0-47e0f470f912";
    //  
    //   var Role = $('.companyRole').val();
    //   if (Role == '请选择') {
    //       $('.roleTs').css({
    //           display: 'block'
    //       })
    //       $('.roleTs span').text('请选择角色');
    //       return;
    //   } else {
    //       $('.roleTs').css({
    //           display: 'none'
    //       })
    //   }
    // 注册接口调用开始
    var _data = { "mobileNum": mobileNum, "userName": userName, "password": password, "enterpriseName": enterpriseName, "enterpriseScale": Scale, "roleIds": Role };
    $.ajax({
        url: "/cloudlink-core-framework/login/registAndLogin",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "json",
        success: function(data) {
            var success = data.success;
            //   console.log(success)
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
                //   console.log("zhuce" + data);
                var row = data.rows;
                var token = data.token;
                //   console.log(row);
                //   console.log(token);

                lsObj.setLocalStorage('token', token);
                lsObj.setLocalStorage('loginRow', JSON.stringify(row));

                //   console.log(lsObj.getLocalStorage('loginRow'));
                //   console.log(JSON.parse(lsObj.getLocalStorage('loginRow')));

                //   localStorage.loginRow = row;
                //   localStorage.loginToken = token;

                //   location.href = 'login.html';
            } else {
                alert('注册失败')
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
    // 注册接口调用结束
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
        $('.phoneMeg span').text('手机号码填写错误');
        e = false;
        return false;
    } else {
        $('.phoneMeg').css({
            display: 'none'
        });
        // 手机号是否注册过接口调用开始
        var _data = { "registNum": val };
        $.ajax({
            url: "/cloudlink-core-framework/login/isExist",
            type: "GET",
            contentType: "application/json",
            data: _data,
            dataType: "json",
            success: function(data, status) {
                var res = data.rows.isExist;
                if (res == 1) {
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
        // 手机号是否注册过接口调用结束
    }
});
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

/**
 * @desc 刷新验证码
 */
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

    //   console.log(e, g, f)
    //   console.log(!f);
    //   console.log(g);
    //   console.log(!e);
    var aa = $('.styles').html();
    //    console.log(a);
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
    //发送手机号，接受验证码
    var number = $('.phone').val();
    var _data = { "sendNum": number, "sendMode": 1, "useMode": 3, "signName": "阴保管家" }
    $.ajax({
        url: "/cloudlink-core-framework/login/getVerifyCode",
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        data: _data,
        success: function(data) {
            // var verifyCode = JSON.parse(data).rows.verifyCode;
            try {
                //诸葛IO
                if (zhugeSwitch == 1) {
                    zhuge.track('短信验证');
                }
            } catch (e) {}

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
});

/**
 * @desc 点击获取短信验证码倒计时事件
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
 * @desc 姓名验证
 */
$('.userName').blur(function() {
    var val = $('.userName').val().trim();
    var nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,15}$/;
    //   console.log(nameReg.test(val));
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
        // $('.pswMsg1').css({
        //     display: 'block'
        // });
        // $('.pswMsg1 span').text('密码不能为空');
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
        // $('.pswMsg2').css({
        //     display: 'block'
        // });
        // $('.pswMsg2 span').text('请再次输入密码');
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
    //   var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

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
 * @desc  企业名称验证
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
        var _data = { "enterpriseName": val };
        $.ajax({
                url: "/cloudlink-core-framework/enterprise/isExist",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(_data),
                dataType: "json",
                success: function(data, status) {
                    //   console.log(data)
                    var res = data.rows[0].isExist;
                    //   console.log(res)
                    if (res == 1) {
                        $('.companyMsg').css({
                            display: 'block'
                        });
                        $('.companyMsg span').text('企业名称已注册');
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
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            })
            // 验证企业名称是否存在接口调用结束
    }
});

/**
 * @desc 自动跳转页面
 */
function jumpto() {
    var a = 5;
    var t = setInterval(function() {
        a--;
        if (a < 1) {
            clearInterval(t);
            location.href = 'login.html';
        }
        $('.jumpTo').text(a);
    }, 1000)
}
/**
 * @Author: liangyuanyuan
 * @Date: 2017-2-14
 * @Last Modified by: liangyuanyuan
 * @Last Modified time: 2017-4-14
 * @func 忘记密码页面的js操控
 */


var d = false,
    e = false,
    g = false,
    f = false;
$(".btn1").click(function() {
    var mobileNum = $('.phone').val();
    try {
        //诸葛IO
        if (tjSwitch == 1) {
            tjSdk.track('安全验证');
        }
    } catch (e) {

    }
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
    var number = $('.phone').val();
    var verifyCode = $('.SMScode').val();
    // var _data = { "sendNum": number, "sendMode": 1, "verifyCode": verifyCode };
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
            console.log(data);
            var success = data.success;
            if (success == 1) {
                $('.top img').attr('src', '/src/images/enroll_img/2.png')
                $('.bottom1,.bottom3,.bottom4,.Notes').css({
                    display: "none"
                })
                $('.bottom2').css({
                    display: "block"
                })
                $('.top img').attr('src', '/src/images/forget_img/2.png')
                $('.bottom1').css({
                    display: "none"
                })
                $('.bottom2').css({
                    display: "block"
                })
                e = false;
                f = false;
                d = false;
                g = false;
            } else {
                $('.SMScodeMsg').css({
                    display: 'block'
                });
                $('.SMScodeMsg span').text('手机号或验证码错误');
                return;
            }
        }
    });
    // 短信验证码校验接口调用结束

});
$(".btn2").click(function() {
    var mobileNum = $('.phone').val();
    var password1 = $('.pw1').val();
    var password2 = $('.pw2').val();
    var verifyCode = $('.SMScode').val();
    try {
        //诸葛IO
        if (tjSwitch == 1) {
            tjSdk.track('重置密码');
        }
    } catch (e) {

    }
    if (password1 == '' || password1 == null) {
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

    $('.pw1').blur();
    if (!e) {
        return;
    }
    $('.pw2').blur();
    if (!f) {
        return;
    }

    //重置密码


    var _data = { "mobileNum": mobileNum, "password": password1, "verifyCode": verifyCode }
    $.ajax({
        url: "/cloudlink-core-framework/login/resetPassword",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "json",
        success: function(data, status) {
            $('.top img').attr('src', '/src/images/forget_img/3.png')
            $('.bottom2').css({
                display: "none"
            })
            $('.bottom3').css({
                display: "block"
            })
        }
    });


});
$(".btnhid").click(function() {
        try {
            //诸葛IO
            if (tjSwitch == 1) {
                tjSdk.track('重置完成');
            }
        } catch (e) {

        }
        location.href = "login.html"
    })
    //图片验证码
var imgStr = '';
code();

//生成验证码
function code() {
    var az = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    var dom2 = parseInt(Math.random() * 10000 % 62);
    var dom3 = parseInt(Math.random() * 10000 % 62);
    var dom4 = parseInt(Math.random() * 10000 % 62);
    var dom1 = parseInt(Math.random() * 10000 % 62);
    imgStr = az[dom1] + az[dom2] + az[dom3] + az[dom4];
    $('.code i').text(imgStr)
}
//刷新验证码
$('.code').click(function() {
        code();
        try {
            //诸葛IO
            if (tjSwitch == 1) {
                tjSdk.track('刷新验证码');
            }
        } catch (e) {

        }
    })
    //手机号验证
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
                // url: "/cloudlink-core-framework/login/isExist",
                url: "/cloudlink-core-framework/login/checkUser",
                type: "GET",
                contentType: "application/json",
                data: _data,
                dataType: "json",
                success: function(data, status) {
                    // console.log(data);
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
                        $('.phoneMeg span').text('手机号码未注册');
                        e = false;
                    }
                }
            });
            // 手机号是否注册过接口调用结束
        }
    })
    //图片验证
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
    })
    //短信验证码验证
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
    })
    //点击获取短信验证码事件
$('.styles').click(function() {
        try {
            //诸葛IO
            if (tjSwitch == 1) {
                tjSdk.track('点击获取短信验证码');
            }
        } catch (e) {

        }
        var mobileNum = $('.phone').val();
        if (mobileNum == '' || mobileNum == null) {
            $('.phoneMeg').css({
                display: 'block'
            });
            $('.phoneMeg span').text('手机号码不能为空');
            return;
        }
        var val = $('.imgCode').val();
        if (val == '' || val == null) {
            $('.imgMeg').css({
                display: 'block'
            });
            $('.imgMeg span').text('图片验证码不能为空');
            return;
        }
        $('.phone').blur();
        $('.imgCode').blur();
        // console.log(e, g, f)
        // if (!f || g || !e) {
        //     return;
        // }
        var aa = $('.styles').html();
        //    console.log(a);
        if (aa == "重新获取") {
            g = false;
        }
        if (!f || g || !e) {
            return;
        }
        $('.phone').blur();
        times();
        $('.styles').text('60秒后再次获取');
        $('.styles').css({
            background: '#ccc'
        })
        f = false;
        //ajax发送手机号，接受验证码
        var number = $('.phone').val();
        // var _data = { "sendNum": number, "sendMode": 1, "useMode": 3, "signName": "阴保管家" }
        // console.log(number);

        var _data = {
            sendMode: "1",
            sendNum: number,
            signName: "阴保管家",
            useCategory: "general"
                // "sceneType": "",
        };
        $.ajax({
            url: "/cloudlink-core-framework/verfy/getVerifyCode",
            type: "post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                console.log(data);
                // var res = data.rows.isExist;
                // if (res == 1) {
                //     $('.phoneMeg').css({
                //         display: 'none'
                //     });
                // } else {
                //     $('.phoneMeg').css({
                //         display: 'block'
                //     });
                //     $('.phoneMeg span').text('手机号码未注册');
                //     e = false;
                // }
            },
            error: function(data) {
                console.log(data);
            }
        })

    })
    //点击获取短信验证码倒计时事件
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
//重置密码验证
$('.pw1').blur(function() {
        var val = $(this).val();
        var pwReg = /^[\dA-z]{6,12}$/;
        if (val == '' || val == null) {
            // $('.pswMsg1').css({
            //     display: 'block'
            // });
            // $('.pswMsg1 span').text('密码不能为空');
            e = false;
            return
        } else if (!pwReg.test(val)) {
            $('.pswMsg1').css({
                display: 'block'
            });
            $('.pswMsg1 span').text('密码格式错误');
            e = false;
            return;
        } else {
            e = true;
            $('.pswMsg1').css({
                display: 'none'
            });
        }
    })
    //再次确认密码验证
$('.pw2').blur(function() {
    var val1 = $('.pw1').val();
    var val2 = $('.pw2').val();
    if (val2 == "" || val2 == null) {
        // $('.pswMsg2').css({
        //     display: 'block'
        // });
        // $('.pswMsg2 span').text('请再次输入密码');
        f = false;
        return
    } else if (val1 != val2) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text('两次输入密码不一致');
        f = false;
        return
    } else {
        f = true;
        $('.pswMsg2').css({
            display: 'none'
        });
    }
})
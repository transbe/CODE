/**
 * @author: liangyuanyuan
 * @Date: 2017-2-14
 * @Last Modified by: lizhenzhen
 * @Last Modified time: 2017-5-22
 * @file 注册页面的js逻辑
 */
$(function() {
var language=lsObj.getLocalStorage("i18nLanguage");
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

    if(language=="en"){
        $(".forgotPassword .title .logobg").css("background","url(/src/images/logo/forget-logo_en.png) no-repeat 0 66px");
        $('.top img').attr('src', '/src/images/enroll_img/1_en.png');
        // 加载手机区号
        $("#phoneInput").loadPhoneArea({
            language:"en",
            classArr:["phone"],
            placeholder:getLanguageValue("inputPhone")
        });
    }else{
        $("#phoneInput").append('<input class="phone" type="text" placeholder="&nbsp;'+ getLanguageValue("inputPhone")+'">')
    }
    getAddressSelectItem();
    // verificationPhone();

/**
 * @desc 校验账号、验证码
 */
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
        $('.phoneMeg span').text(getLanguageValue("phoneNoNull"));
        e = false;
        return;
    }
    var val = $('.imgCode').val();
    if (val == '' || val == null) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text(getLanguageValue("imageVerificationCodeNoNull"));
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
    // $('.SMScode').blur();
    // console.log(d);
    if (!d) {
        return;
    }
    
    if (!g) {
        $('.SMScodeMsg span').text(getLanguageValue("pleaseGetVerificationCode"));
        $('.SMScodeMsg').css({
            display: 'block'
        });
        return;
    } else {
        $('.SMScodeMsg').css({
            display: 'none'
        })
    }

    var phoneNo =  $("#phoneNo").html();
    if(language == "en"  &&  phoneNo != "+86"){
        mobileNum = $("#phoneNo").html() + mobileNum;
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
            // console.log(data);
            var success = data.success;
            if (success == 1) {
                if(language=="en"){
                    $('.top img').attr('src', '/src/images/enroll_img/2_en.png')
                }else{
                    $('.top img').attr('src', '/src/images/enroll_img/2.png')
                }
                
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
                $('.SMScodeMsg span').text(getLanguageValue("phoneOrSMSVerificationError"));
                return;
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
        $('.nameMsg span').text(getLanguageValue("userNameNoNull"));
        e = false;
        return;
    } else if (password1 == '' || password1 == null) {
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
    if(language=="en"){
        $('.top img').attr('src', '/src/images/enroll_img/3_en.png')
        $(".en-hide").hide();
    }else{
        $('.top img').attr('src', '/src/images/enroll_img/3.png');
    }
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
        $('.companyMsg span').text(getLanguageValue("companyNameNoNull"));
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
        $('.companyTs span').text(getLanguageValue("pleaseSelectCompanyTs"));
        return;
    } else {
        $('.companyTs').css({
            display: 'none'
        })
        c = true
    }

    /**
     * @desc 角色指定为阴保工程师 993132df-9972-40eb-83f0-47e0f470f912
     */
    var Role = "993132df-9972-40eb-83f0-47e0f470f912";
    var province = null,
        city = null,
        county = null; //区县代码
    var address = null; //企业地址
    var detailAddress = null; //详细地址

    if(language == "zh"){
        province = $('.province').val();
        city = $('.city').val();
        county = $('.county').val(); //区县代码
        address = $('.province option:selected').text() + $('.city option:selected').text() + $('.county option:selected').text(); //企业地址
        detailAddress = $('.detailAddress').val(); //详细地址

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
    }else{
        x = true;
        y = true;
    }
    var phoneNo =  $("#phoneNo").html();//英文的情况  注册时，需要传入带+86
    if(language == "en"  &&  phoneNo != "+86"){
        mobileNum = $("#phoneNo").html() + mobileNum;
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
                    if(language=="en"){
                        $('.top img').attr('src', '/src/images/enroll_img/4_en.png')
                    }else{
                        $('.top img').attr('src', '/src/images/enroll_img/4.png')
                    }
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
                    layer.alert(getLanguageValue("enrollFail"), {
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
    var phoneNo =  $("#phoneNo").html();//英文的情况  注册时，需要传入带+86
    var val = $(this).val().trim();
    var phoneReg = /^1\d{10}$/;
    if(phoneNo!="+86"){
        phoneReg=/^[0-9]*$/;
    }
    if (val == '' || val == null) {
        // $('.phoneMeg').css({
        //     display: 'block'
        // });
        // $('.phoneMeg span').text(getLanguageValue("phoneNoNull"));
        e = false;
        return;
    } else if (!phoneReg.test(val)) {
        
        if(language == "zh"){
            $('.phoneMeg').css({
                display: 'block'
            });
            $('.phoneMeg span').text(getLanguageValue("pleaseCorrectPhone"));
            e = false;
            return false;
        }else{
            return true
        }
    } else {
        $('.phoneMeg').css({
            display: 'none'
        });
        // 手机号是否注册过接口调用开始
      
        if(language == "en"  &&  phoneNo != "+86"){
            val = $("#phoneNo").html() + val;
        }
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
                if (res == true && data.rows[0].isExist == true) {
                    $('.phoneMeg').css({
                        display: 'block'
                    });
                    $('.phoneMeg span').text(getLanguageValue("phoneHasDone"));
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
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
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
        $('.companyTs span').text(getLanguageValue("pleaseSelectCompanyTs"));
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
    // console.log(detailAddress);
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
        // $('.imgMeg span').text(getLanguageValue("imageVerificationCodeNoNull"));
        f = false;
        return;
    } else if (!imgReg.test(val)) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text(getLanguageValue("inputImageCodeError"));
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
        // $('.SMScodeMsg span').text(getLanguageValue("SMSVerificationNoNull"));
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
        $('.phoneMeg span').text(getLanguageValue("phoneNoNull"));
        return;
    }
   
    $('.phone').blur();
    var val = $('.imgCode').val();
    if (val == '' || val == null) {
        $('.imgMeg').css({
            display: 'block'
        });
        $('.imgMeg span').text(getLanguageValue("imageVerificationCodeNoNull"));
        return;
    }
    $('.imgCode').blur();
    var aa = $('.styles').html();
   
    if (aa == getLanguageValue("regain")) {
        g = false;
    }
    
    if (!f || g || !e) {
        return;
    }
    times();
    $('.styles').text(getValueHasArgs("timeRegain",['60']));
    $('.styles').css({
        background: '#ccc'
    })
    f = false;
    //ajax发送手机号，接受验证码
    var number = $('.phone').val();
    var _data= {
            sendMode: "1",
            sendNum: number,
            signName: "阴保管家",
            useCategory: "regist"
        };

    var phoneNo = $("#phoneNo").html();

    if(language == "en"  &&  phoneNo != "+86"){
        _data.sendNum =  phoneNo+number,
        _data.signName =  "CPEngineer",
        _data.isIntl = true
    }
    
    $.ajax({
        url: "/cloudlink-core-framework/verfy/getVerifyCode",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(_data),
        success: function(data) {
            //   console.log(data);
            if(data.success==-1){
                layer.alert("SMS Error", {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
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
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
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
        // $('.nameMsg span').text(getLanguageValue("userNameNoNull"));
        e = false;
        return;
    } else if (!nameReg.test(val)) {
        $('.nameMsg').css({
            display: 'block'
        });
        $('.nameMsg span').text(getLanguageValue("userNameRegError"));
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
        $('.pswMsg1 span').text(getLanguageValue("pwdNoNull"));
        f = false;
        return
    } else if (!pwReg.test(val)) {
        $('.pswMsg1').css({
            display: 'block'
        });
        $('.pswMsg1 span').text(getLanguageValue("pwdErrorTip"));
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
        $('.pswMsg2 span').text(getLanguageValue("pleaseAgainPwd"));
        g = false;
        return
    } else if (val1 != val2) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text(getLanguageValue("differentPwd"));
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
        $('.emailMsg span').text(getLanguageValue("emailRegError"));
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
        $('.companyMsg span').text(getLanguageValue("companyRegError"));
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
                // console.log(data);
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
                    $('.companyMsg span').text(getLanguageValue("companyHasDone"));
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
        // 验证企业名称是否存在接口调用结束
    }
});

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
 * @desc 注册用户
 * @param {*String} userInfo 
 */
function registUser(userInfo) {
    $.ajax({
        url: "/cloudlink-core-framework/login/regist",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(userInfo),
        success: function(data, status) {
            // console.log(data);
            if (data.success == 1 && data.msg == "ok") {
                // 注册用户成功
            } else {
                // 注册用户失败
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
        btn: [getLanguageValue("yes"), getLanguageValue("no")]
    }, function(index) {
        layer.close(index);
        applyEnterprise(companyName, userName, password, mobileNum);
    });
});

/**
 * @desc 申请加入企业
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
            // console.log(data);
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
                $("#success").html(getLanguageValue("applySuccess"));
            } else {
                layer.alert(getLanguageValue("applyFail"), {
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
}

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
                var options = "<option value=''>"+getLanguageValue("select")+"</option>";
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
                            var optionscity = "<option value=''>"+getLanguageValue("select")+"</option>";
                            var orginOption = "<option value=''>"+getLanguageValue("select")+"</option>";
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
                            var optionscounty = "<option value=''>"+getLanguageValue("select")+"</option>";
                            for (var i = 0; i < data.length; i++) {
                                optionscounty += ("<option value='" + data[i].typeCode + "'>" + data[i].typeName + "</option>");
                            }
                            $("#county").html(optionscounty);
                        }
                    })
                });
            } else {
                layer.alert(getLanguageValue("drapMenuError"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        }
    });
}

});
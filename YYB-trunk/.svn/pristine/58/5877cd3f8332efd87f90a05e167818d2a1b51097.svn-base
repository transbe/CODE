var d = false, //  验证码校验
    e = false, //  旧手机号验证
    n = false, //新手机验证 判断是否已经被注册
    h = false,// 
    g = false //  获取验证码验证，再次输入密码验证

var language=lsObj.getLocalStorage("i18nLanguage");
$(function() {
    changePageStyle("../..");// 换肤

    // 加载手机区号
    $("#phoneInput").loadPhoneArea({
        language:lsObj.getLocalStorage("i18nLanguage"),
        classArr:["form-control","pw"],
        placeholder:getLanguageValue("oldPhoneNumber"),
        inputId:"exampleInputPassword1"
    });
 

/**
 * @desc 验证旧手机号
 */
$('.pw').blur(function () {

    var val = $(this).val().trim();
    console.log(val);
    var phoneReg = /^1\d{10}$/;
    if (val == '' || val == null) {
        e = false;
        return;
    } else if (!phoneReg.test(val)) {
        $('.pwMsg').css({
            display: 'block'
        });
        $('.pwMsg span').text(getLanguageValue("pleaseCorrectPhone"));
        e = false;
        return false;
    } else {
        $('.pwMsg').css({
            display: 'none'
        });
        // 检测旧手机号与个人信息中手机号是否相同
        var oldNumber = JSON.parse(lsObj.getLocalStorage('userBo')).mobileNum;

        if (oldNumber != val) {
            $('.pwMsg').css({
                display: 'block'
            });
            $('.pwMsg span').text(getLanguageValue("oldPhoneNumberError"));
            e = false;
        } else {
            $('.pwMsg').css({
                display: 'none'
            });
            e = true;
        }
    }
});
/**
 * @desc 检测新手机号有无被注册使用过
 */
$('.pw1').blur(function () {

    var val = $(this).val().trim();
    var phoneReg = /^1\d{10}$/;
    if (val == '' || val == null) {
        n = false;
        return;
    } else if (!phoneReg.test(val)) {
        $('.pw1Msg').css({
            display: 'block'
        });
        $('.pw1Msg span').text(getLanguageValue("pleaseCorrectPhone"));
        n = false;
        return false;
    } else {
        $('.pw1Msg').css({
            display: 'none'
        });
        //checkuser
        var _data = {
            registNum: val
        };
        $.ajax({
            type: "GET",
            url: "/cloudlink-core-framework/login/checkUser",
            contentType: "application/json",
            data: _data,
            dataType: "json",
            success: function (data) {
                var res = data.rows[0].isExist;
                if (res == true) {
                    $('.pw1Msg').css({
                        display: 'block'
                    });
                    $('.pw1Msg span').text(getLanguageValue("phoneHasDone"));
                    n = false;
                    return;
                } else {
                    n = true;
                    $('.pw1Msg').css({
                        display: 'none'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        })
    }
});

/**
 * @desc 点击获取短信验证码事件
 */
$('.get-vercode').click(function () {
    if(e==false){
        $('.pwMsg').css({
            display: 'block'
        });
        $('.pwMsg span').text(getLanguageValue("enterPhoneNumber"));
        return;
    }
    if(n==false){
        $('.pw1Msg').css({
            display: 'block'
        });
        $('.pw1Msg span').text(getLanguageValue("enterPhoneNumber"));
        return;
    }
    times();
    if( language == "en"){
         $('.get-vercode').text('60秒后再次获取');
    }else{
         $('.get-vercode').text('Re-send in 60s');
    }
    
    $('.get-vercode').css({
        background: '#ccc'
    })
    f = false;
    //ajax发送手机号，接受验证码
    var number = $('.pw1').val();
    var _data = {
        sendMode: "1",
        sendNum: number,
        signName: "阴保管家",
        useCategory: "general",
        "sceneType": ""
    }
    $.ajax({
        url: "/cloudlink-core-framework/verfy/getVerifyCode",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(_data),
        success: function (data) {
            g=true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    })
});
/**
 * @desc 点击获取短信验证码倒计时事件
 */
function times() {
    var a = 60;
    g = true;
    var t = setInterval(function () {
        a--;
        $('.get-vercode').text(getValueHasArgs("timeRegain",[a]));
        if (a < 1) {
            $('.get-vercode').text(getLanguageValue("regain"));
            $('.get-vercode').css({
                background: '#59b6fc'
            })
            clearInterval(t);
            f = true;
        }
    }, 1000)
}

$(".btn-primary").click(function() {
    var mobileNum = $('.pw1').val();
    console.log(mobileNum);
    if (mobileNum == '' || mobileNum == null) {
        $('.pw1Msg').css({
            display: 'block'
        });
        $('.pw1Msg span').text(getLanguageValue("phoneNoNull"));
        n = false;
        return;
    }
    $('.pw1').blur();
    if (!n) {
        return;
    }
    var SMScodeval = $('.pw2').val();
    if (SMScodeval == "" || SMScodeval == null) {
        $('.pw2Msg').css({
            display: 'block'
        });
        $('.pw2Msg span').text(getLanguageValue("SMSVerificationNoNull"));
        d = false;
        return;
    }
    $('.pw2').blur();
    if (!d) {
        return;
    }
    if (!g) {
        $('.pw2Msg span').text(getLanguageValue("pleaseGetVerificationCode"));
        $('.pw2Msg').css({
            display: 'block'
        });
        return;
    } else {
        $('.pw2Msg').css({
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
            // console.log(data);
            var success = data.success;
            if (success == 1) {
             updataUserNumber();
            } else {
                $('.pw2Msg').css({
                    display: 'block'
                });
                $('.pw2Msg span').text(getLanguageValue("phoneOrSMSVerificationError"));
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

/**
 * @desc 短信验证码验证
 */
$('.pw2').blur(function() {
    var val = $(this).val();
    if (val == "" || val == null) {
        d = false;
        return;
    } else {
        d = true;
        $('.pw2Msg').css({
            display: 'none'
        });
    }
});
/**
 * @desc 更新用户手机号
 */
function updataUserNumber(){
    console.log("进入更新函数")
     var _objectId = JSON.parse(lsObj.getLocalStorage('userBo')).objectId;
     var _token=lsObj.getLocalStorage('token');
     var mobileNum = $('.pw1').val();
     var _data = {
        objectId: _objectId,
        mobileNum: mobileNum
    };
  $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/user/update?token="+_token,
        contentType: "application/json",
        data: JSON.stringify(_data),
        success: function(data, status) {
            // console.log(data);
            var success = data.success;
            if (success == 1) {
               //更新用户信息中的手机号
                  layer.confirm(getLanguageValue("changeSuccess"), {
                  title: getLanguageValue("tip_title"),
                  btn: [getLanguageValue("submit_btn")], //按钮
                  skin: "self"
              }, function() {
                  var token = lsObj.getLocalStorage('token');
                  $.ajax({
                      url: "/cloudlink-core-framework/login/logout?token=" + token,
                      type: "POST",
                      dataType: "json",
                      success: function(data) {
                          var success = data.success;
                          if (success == 1) {
                              layer.closeAll();
                              localStorage.clear("timeOut");
                          } else {
                              layer.alert("退出失败！", {
                                  title: getLanguageValue("tip_title"),
                                  skin: 'self-alert'
                              });
                          }
                      },
                      error: function(XMLHttpRequest, textStatus, errorThrown) {
                          console.log(XMLHttpRequest);
                          console.log(textStatus);
                          console.log(errorThrown);
                          layer.alert(NET_ERROR_MSG, {
                              title: getLanguageValue("tip_title"),
                              skin: 'self-alert'
                          });
                      }
                  });
              });
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
}

}) 
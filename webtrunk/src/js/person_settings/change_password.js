/** 
 * @file
 * @author  lizhenzhen
 * @desc 修改密码js逻辑操作
 * @date 2017-06-12 09:38:16
 * @last modified by lizhenzhen
 * @last modified time  2017-06-12
 */

/**
 * @desc 检测新密码
 * @method checknewpass
 */
function checknewpass() {
    newpass = $(".pw1").val().trim();
    var s = /^[\dA-z]{6,12}$/;
    return "" == newpass || null == newpass ? ($(".pw1Msg").text(getLanguageValue("oldPasswordTip2")), !1) : s.test(newpass) ? ($(".pw1Msg").text(""), !0) : ($(".pw1Msg").text(getLanguageValue("oldPasswordTip2")), !1)
};


/**
 * @desc 再次输入密码
 * @method checkaginpass
 */
function checkaginpass() {
    return newpass = $(".pw1").val().trim(), aginpass = $(".pw2").val().trim(), "" == aginpass || null == aginpass ? ($(".pw2Msg").text(getLanguageValue("againTip")), !1) : aginpass != newpass ? ($(".pw2Msg").text(getLanguageValue("againTip2")), !1) : ($(".pw2Msg").text(""), !0)
};

$(function() {

    changePageStyle("../.."); // 换肤
  

    var oldpass = null, // 旧密码
        newpass = null, // 新密码
        aginpass = null; // 再次输入密码

    $(".pw").blur(function() {
        null != (oldpass = $(".pw").val().trim()) && "" != oldpass && $(".pwMsg").text("")
    });
    $(".pw1").blur(function() {
        checknewpass()
    });
    $(".pw2").blur(function() {
        checkaginpass()
    });
    $(".btn").click(function() {
        if (oldpass = $(".pw").val().trim(), newpass = $(".pw1").val().trim(), aginpass = $(".pw2").val().trim(), null == oldpass || "" == oldpass)
            return void $(".pwMsg").text(getLanguageValue("tip.pwd.orginal"));
        if (null == newpass || "" == newpass)
            return void $(".pw1Msg").text(getLanguageValue("tip.pwd.new"));
        if (checknewpass()) {
            if (null == aginpass || "" == aginpass)
                return void $(".pw2Msg").text(getLanguageValue("tip.pwd.again"));
            if (checkaginpass()) {
                var s = lsObj.getLocalStorage("token"),
                    n = { oldPassword: oldpass, newPassword: newpass };
                $.ajax({
                    type: "POST",
                    url: "/cloudlink-core-framework/user/updatePassword?token=" + s,
                    contentType: "application/json",
                    data: JSON.stringify(n),
                    dataType: "json",
                    success: function(data) {
                        if (data.success == 1) {
                            layer.confirm(getLanguageValue("tip.pwd.success"), {
                                btn: [getLanguageValue("btn.ok")], //按钮
                                skin: "self"
                            }, function() {
                                lsObj.clearAll();
                                try {
                                    if (tjSwitch == 1) {
                                        tjSdk.track('修改密码', {
                                            '结果': '成功'
                                        });
                                        tjSdk.exit();// 修改密码后退出当前用户的io追踪
                                    }
                                } catch (e) {}
                                parent.location.href = '../../../login.html';
                            });
                        } else {
                            switch (data.code) {
                                case "PU03001":
                                    layer.alert(getLanguageValue("tip.pwd.orginal.error"), {
                                        title: getLanguageValue("tip"),
                                        skin: "self-alert"
                                    });
                                    $(".pw").val("");
                                    $(".pw1").val("");
                                    $(".pw2").val("");
                                    break;
                                default:
                                    layer.alert(getLanguageValue("tip.pwd.fail"), {
                                        title: getLanguageValue("tip"),
                                        skin: "self-alert"
                                    });
                                    break;
                            }
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                        console.log(XMLHttpRequest); // 请求对象
                        console.log(textStatus); // 返回状态错误类型
                        console.log(errorThrown); // 捕获的异常对象

                        // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                        layer.alert(NET_ERROR_MSG, {
                            title: getLanguageValue("tip"),
                            skin: 'self-alert'
                        });
                    }
                })
            }
        }
    });
});
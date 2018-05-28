/**
 * @desc 检测新密码
 * @method checknewpass
 */
function checknewpass() {
    newpass = $(".pw1").val().trim();
    var s = /^[\dA-z]{6,12}$/;
    return "" == newpass || null == newpass ? ($(".pw1Msg").text("密码不能为空"), !1) : s.test(newpass) ? ($(".pw1Msg").text(""), !0) : ($(".pw1Msg").text("密码格式错误"), !1)
};

/**
 * @desc 再次输入密码
 * @method checkaginpass
 */
function checkaginpass() {
    return newpass = $(".pw1").val().trim(), aginpass = $(".pw2").val().trim(), "" == aginpass || null == aginpass ? ($(".pw2Msg").text("请再次输入密码"), !1) : aginpass != newpass ? ($(".pw2Msg").text("两次输入密码不一致"), !1) : ($(".pw2Msg").text(""), !0)
};

$(function() {
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
    /**
     * @desc 检测并登录
     */
    $(".btn").click(function() {
        if (oldpass = $(".pw").val().trim(), newpass = $(".pw1").val().trim(), aginpass = $(".pw2").val().trim(), null == oldpass || "" == oldpass)
            return void $(".pwMsg").text("请输入原密码");
        if (null == newpass || "" == newpass)
            return void $(".pw1Msg").text("请输入新密码");
        if (checknewpass()) {
            if (null == aginpass || "" == aginpass)
                return void $(".pw2Msg").text("请输入确认密码");
            if (checkaginpass()) {
                var s = lsObj.getLocalStorage("token"),
                    n = { oldPassword: oldpass, newPassword: newpass };
                $.ajax({
                    type: "POST",
                    url: "/cloudlink-core-framework/user/updatePassword?token=" + s,
                    contentType: "application/json",
                    data: JSON.stringify(n),
                    dataType: "json",
                    success: function(s) {
                        console.log(s);
                        if (s.success == 1) {
                            layer.confirm("修改成功！请重新登录", {
                                btn: ['确定'], //按钮
                                skin: "self"
                            }, function() {
                                lsObj.clearAll();
                                try {
                                    if (zhugeSwitch == 1) {
                                        zhuge.track('修改密码', {
                                            '结果': '成功'
                                        });
                                    }
                                } catch (e) {}
                                parent.location.href = '../../../login.html';
                            });
                        } else if (s.msg == "原密码不正确") {
                            layer.msg("原密码不正确");
                            $(".pw").val("");
                            $(".pw1").val("");
                            $(".pw2").val("");
                        } else {
                            layer.msg("密码修改失败");
                        }
                    }
                })
            }
        }
    });
});
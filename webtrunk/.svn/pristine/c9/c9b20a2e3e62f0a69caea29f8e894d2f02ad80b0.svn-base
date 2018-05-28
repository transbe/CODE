/** 
 * @file
 * @author  liangyuanyuan
 * @desc  帮助中心意见反馈js逻辑操作
 * @date 2017-06-12 10:18:58
 * @last modified by lizhenzhen
 * @last modified time  2017-06-12
 */

/**
 * @desc 检测新密码
 * @method checknewpass
 */
function initBindSytleChange() {
    $(".center").click(function() {
        var e = $(this).index();
        $(".center").css({
            borderBottom: "1px solid #ececec",
            color: "#000"
        }), $(".center .i").css({
            display: "none"
        }), $(this).css({
            borderBottom: "1px solid #67BDF6",
            color: "#67BDF6"
        });
        var i = $(this).height();
        $(this).find(".i").css({
            display: "block"
        }), $(this).find(".i:eq(0)").css({
            top: i + "px"
        }), $(this).find(".i:eq(1)").css({
            top: i - 1 + "px"
        }), $(".kuai>div").css({
            display: "none"
        }), $(".kuai>div").eq(e).css({
            display: "block"
        })
    })
}

/**
 * @desc 查看反馈信息字数
 * @method lookNum
 * @param {*} e 
 */
function lookNum(e) {
    $(e).val().trim().length > 200 ? ($(e).val($(e).val().substring(0, 199)), $(e).next("span").show().text("*最多200字")) : $(e).next("span").hide()
}

/**
 * @desc 获取参数
 * @method GetQueryString
 * @param {*} e 
 */
function GetQueryString(e) {
    var i = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
        n = window.location.search.substr(1).match(i);
    return null != n ? unescape(n[2]) : null
}

/**
 * @desc 删除添加图片
 * @method closeImg
 * @param {*} e 
 */
function closeImg(e) {
    $(e).closest(".feedback_images").remove();
    for (var i = 0; i < $(".feedback_img_file").find("input[name='file']").length; i++) $(".feedback_img_file").find("input").eq(i).attr("data-value") == $(e).attr("data-key") && $(".feedback_img_file").find("input").eq(i).remove()
}

/**
 * @desc 反馈意见提交
 * @method onSubmit
 */
function onSubmit() {
    uuid = creatuuid();
    var e = $(".feedback_area").find("textarea").val().trim(),
        i = $(".feedback_way").find("input").val().trim();
    if (e.length < 10) return $(".feedback_area").find("span").show().text("*不到10个字哦，再写点吧"), !1;
    if ($(".feedback_img_list").find(".feedback_images").length > 0)
        for (var n = 0; n < $(".feedback_img_list .feedback_images").length; n++) {
            var t = $(".feedback_img_file").find("input").eq(n).attr("id");
            $.ajaxFileUpload({
                url: "/cloudlink-core-file/attachment/save?businessId=" + uuid + "&bizType=pic_suggestions&token=" + lsObj.getLocalStorage("token"),
                secureuri: !1,
                fileElementId: t,
                dataType: "json",
                type: "POST",
                async: !1,
                success: function(n, t) {
                    if (n.success == 1) {
                        ++nImgHasBeenSendSuccess == $(".feedback_img_list .feedback_images").length;
                        postAdvise(e, i, uuid)
                    } else {
                        layer.alert("服务异常，请稍候重试", {
                            title: "提示",
                            skin: 'self-alert'
                        });
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                    console.log(XMLHttpRequest); // 请求对象
                    console.log(textStatus); // 返回状态错误类型
                    console.log(errorThrown); // 捕获的异常对象

                    // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                    layer.alert(NET_ERROR_MSG, {
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            })
        } else {
            postAdvise(e, i, uuid);
        }
}

/**
 * @desc 发送反馈信息
 * @method postAdvise
 * @param {*} e 
 * @param {*} i 
 * @param {*} n 
 */
function postAdvise(e, i, n) {
    var token = lsObj.getLocalStorage('token'); // 获取token
    var userBo = lsObj.getLocalStorage('userBo'); // 获取userBo
    var userName = JSON.parse(userBo).userName; // 获取用户名

    $.ajax({
        url: "/cloudlink-corrosionengineer/feedback/addAdvice?token=" + token,
        type: "POST",
        contentType: "application/json",
        async: !1,
        data: JSON.stringify({
            description: e,
            feedbackType: "pic",
            contact: i,
            userName: userName,
            objectId: n
        }),
        success: function(e) {
            if (e.success == 1) {
                $(".feedback_main").hide();
                $(".feedback_success").show();
            } else {
                layer.alert("服务异常，请稍候重试", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
}

function creatuuid() {
    for (var e = [], i = "0123456789abcdef", n = 0; n < 36; n++) e[n] = i.substr(Math.floor(16 * Math.random()), 1);
    return e[14] = "4", e[19] = i.substr(3 & e[19] | 8, 1), e[8] = e[13] = e[18] = e[23] = "-", e.join("")
}

var numIndex = null,
    uuid = "",
    nImgHasBeenSendSuccess = 0; // 图片是否发送成功

$(function() {
    changePageStyle("../.."); // 换肤

    // 向导跳转
    // var loginNum = parseInt(lsObj.getLocalStorage('loginNum'));
    // var guideGoHelp = lsObj.getLocalStorage('guideGoHelp');
    // if(loginNum == 0){
    //     if(isNull(guideGoHelp)){
    //         bootstro.start();
    //     }else{
    //         setTimeout(function(){
    //              $("html,body").animate({scrollTop:$("#segment").offset().top});
    //             localStorage.removeItem("guideGoHelp");
    //         })
    //     }
    // }

    numIndex = GetQueryString("num");
    null != numIndex && selectIndex(numIndex);
    $(".addImg").click(function() {
        if ($(".feedback_img_list").find(".feedback_images").length <= 2) {
            $(".upload_picture").trigger("click");
        } else {
            layer.alert("最多上传三张图片", {
                title: "提示",
                skin: "self-alert"
            })
        }
    });
    window.onresize = function() {
        var e = $(".center").height();
        $(".center").find(".i:eq(0)").css({
            top: e + "px"
        }), $(".center").find(".i:eq(1)").css({
            top: e - 1 + "px"
        });


    };
    //根据滚动条判断右下角的图片显示或隐藏
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 1024) {
            $('.to_top').css({
                display: 'block'
            })
        } else {
            $('.to_top').css({
                display: 'none'
            })
        }
    });
    initBindSytleChange();
});


//实现拖拽效果
var title = document.getElementById('title'); // 拖拽元素的头部
var suspensionFrame = document.getElementById('suspensionFrame'); // 找到实现拖拽的元素
// 先点住盒子，获取鼠标在盒子中的位置
title.onmousedown = function(e) {
    var e = e || window.event;
    //鼠标在盒子内的位置=鼠标位置-大盒子的offsetleft/top
    var x = getPageX(e) - suspensionFrame.offsetLeft;
    var y = getPageY(e) - suspensionFrame.offsetTop;
    //2 可以让盒子移动
    document.onmousemove = function(e) {
        //3 获取鼠标位置
        var e = e || window.event;
        //盒子的新位置=鼠标新位置-鼠标在盒子内的位置
        var xPos = getPageX(e) - x;
        var yPos = getPageY(e) - y;
        //4 将计算后宽和高给box
        suspensionFrame.style.left = xPos + "px";
        suspensionFrame.style.top = yPos + "px";
    }
};

// 鼠标抬起事件 onmouseup
title.onmouseup = function() {
    document.onmousemove = null; //清除掉document的鼠标移动事件
};

/**
 * @desc 获取拖拽元素在页面的X坐标
 * @method getPageX
 * @param {*} e  
 */
function getPageX(e) {
    //获取鼠标针对可视区域的位置
    var x = e.clientX;
    winScroll().left + x;
    return winScroll().left + x;
}

/**
 * @desc 获取拖拽元素在页面的Y坐标
 * @method getPageY
 * @param {*} e  
 */
function getPageY(e) {
    //获取鼠标针对可视区域的位置
    var y = e.clientY;
    winScroll().left + y;
    return winScroll().left + y;
}

/**
 * @desc 封装一个函数，获取页面的卷曲高度和宽度
 * @method winScroll
 */
function winScroll() {
    return {
        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
    };
}


// 返回按钮
$(".return").click(function() {
    parent.location.reload();
});

// 点击关闭按钮，隐藏咨询框
$('.del').click(function() {
    $('.suspensionFrame').css({ display: 'none' });
})
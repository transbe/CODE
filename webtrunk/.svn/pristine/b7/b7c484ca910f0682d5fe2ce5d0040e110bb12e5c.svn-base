/** 
 * @file
 * @author  liangyuanyuan
 * @desc  门户帮助中心意见反馈js逻辑操作
 * @date 2017-5-22 10:18:58
 * @last modified by lizhenzhen
 * @last modified time  2017-06-12 12:44:32
 */

var numIndex = null;
var uuid = "";
var nImgHasBeenSendSuccess = 0;

// 找到要切换的tab
$(".help_nav ul li").each(function(e) {
    $(this).click(function() {
        selectIndex(e);
    });
});

/**
 * @desc tab切换
 * @method selectIndex
 * @param {*} e 
 */
function selectIndex(e) {
    $(".help_nav ul li").eq(e).attr("class", "selected").siblings("li").attr('class', '');
    $(".tab_main div.change").eq(e).show().siblings("div").hide();
}


/**
 * @desc 删除添加图片
 * @method closeImg
 * @param {*} e 
 */
function closeImg(e) {
    $(e).closest(".feedback_images").remove();
}

/**
 * @desc 获取参数
 * @method GetQueryString
 * @param {*} e 
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

$(function() {
    numIndex = GetQueryString("num");
    if (numIndex != null) {
        selectIndex(numIndex);
    };
    /*上传图片*/
    $(".addImg").click(function() {
        var imgNum = $(".feedback_img_list").find(".feedback_images").length;
        if (imgNum <= 2) {
            $(".upload_picture").trigger("click");
        } else {
            layer.alert("最多上传三张图片", {
                title: "提示",
                skin: "self-alert"
            })
        }
    });

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
});

/**
 * @desc 查看反馈信息字数
 * @method lookNum
 * @param {*} e 
 */
function lookNum(e) {
    var len = $(e).val().trim().length;
    if (len > 200) {
        $(e).val($(e).val().substring(0, 199));
        $(e).next("span").show().text("*最多200字")
    } else {
        $(e).next("span").hide();
    }
}

/**
 * @desc 反馈意见提交
 * @method onSubmit
 */
function onSubmit() {
    uuid = creatuuid();
    var textArea = $(".feedback_area").find("textarea").val().trim();
    var contactWay = $(".feedback_way").find("input").val().trim();
    if (textArea.length < 10) {
        $(".feedback_area").find("span").show().text("*不到10个字哦，再写点吧");
        return false;
    } else {
        var imgNum = $(".feedback_img_list").find(".feedback_images").length;
        if (imgNum > 0) {
            for (var i = 0; i < $('.feedback_img_list .feedback_images').length; i++) {
                var picid = $('.feedback_img_file').find('input').eq(i).attr('id');
                $.ajaxFileUpload({
                    url: "/cloudlink-core-file/attachment/save?businessId=" + uuid + "&bizType=pic_suggestions"+ "&token="+ lsObj.getLocalStorage("token"),
                    /*这是处理文件上传的servlet*/
                    secureuri: false,
                    fileElementId: picid, //上传input的id
                    dataType: "json",
                    type: "POST",
                    async: false,
                    success: function(data, status) {
                        var statu = data.success;
                        if (statu == 1) {
                            nImgHasBeenSendSuccess++;
                            if (nImgHasBeenSendSuccess == $('.feedback_img_list .feedback_images').length) {
                                postAdvise(textArea, contactWay, uuid);
                            }
                        } else {
                            layer.alert("当前网络不稳定", {
                                title: "提示",
                                skin: 'self-alert'
                            });
                        }
                    },
                    error: function(data) { // 请求失败
                        layer.alert(NET_ERROR_MSG, {
                            title: "提示",
                            skin: 'self-alert'
                        });
                    }
                });

            }
        } else {
            postAdvise(textArea, contactWay, uuid);
        }
        //建议的提交
        // console.log({
        //     'description': textArea, //填写的建议
        //     'feedbackType': "pic", //建议类型
        //     'contact': contactWay, //联系方式
        //     'objectId': uuid //插入的主键id
        // });
    }
}

/**
 * @desc 发送反馈信息
 * @method postAdvise
 * @param {*} textArea 
 * @param {*} contactWay 
 * @param {*} uuid 
 */
function postAdvise(textArea, contactWay, uuid) {
    $.ajax({ /*http://192.168.50.235:9901*/
        url: "/cloudlink-corrosionengineer/feedback/addAdvice",
        type: "POST",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
            'description': textArea, //填写的建议
            'feedbackType': "pic", //建议类型
            'contact': contactWay, //联系方式
            'objectId': uuid
        }),
        success: function(data) {
            //  console.log(data);
            if (data.success == 1) {
                $(".feedback_main").hide();
                $(".feedback_success").show();
            } else {
                alert("当前网络不稳定");
            }
        }
    });
}
//uuid
function creatuuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
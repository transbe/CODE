/**
 * @author: liangyuanyuan
 * @date: 2017-02-23
 * @last modified by: lizhenzhen 
 * @last modified time: 2017-04-19 13:10:33
 * @file:首页头部和侧边栏的设置
 */


var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); //获取本地用户信息
var newsData; // 定义消息数据，用于和welcom.js进行iframe框架数据交换


$(function() {

    var roleNameNum = parseInt(lsObj.getLocalStorage('params'));
    if (roleNameNum == 2) {
        $("#iframe-content").attr("src", "src/html/index/welcome2.html?v1.0").attr("data-id", "src/html/index/welcome2.html");
    }

    // 获取用户信息
    getUserImage();

    // 登录超时，返回登录页面，重新登录
    timeOut();

    //消息未读的条数，加载到页面上,每隔20秒刷新一次
    getMsgNumber();


    // setInterval(function() {
    //     getMsgNumber();
    //     document.getElementById("iframe-content").contentWindow.getNewsData(newsData);
    // }, 20000);



})


/**
 * @desc 时间超时函数
 * @method timeOut
 */
function timeOut() {
    //用户登录超时的时候，弹出登录超时。返回登录页面
    var timer = setInterval(function() {
        if (lsObj.getLocalStorage('timeOut') <= new Date().getTime()) {
            //alert("您的登录超时，请重新登录");
            var layer = parent.layer.open({
                type: 0,
                title: '友情提示',
                area: ['300px', '200px'],
                btn: ['重新登录'],
                yes: function() {
                    location.href = "login.html";
                },
                content: "您的登录超时，请重新登录",
                closeBtn: 0,
                anim: 0,
                maxmin: false,
                skin: 'self'
            });
            clearInterval(timer);
        }
    }, 3000)
}


/**
 * @desc 获取用户头像信息
 * @method getUserImage
 */
function getUserImage() {
    $("#userName").html(userBo.userName);
    var _path = getUserProfilePath();
    if (_path != "") {
        $("#userPhoto").attr("src", _path);
    } else {
        if (userBo.sex == "女") {
            $("#userPhoto").attr("src", "../../src/images/main/girl.png");
        } else {
            $("#userPhoto").attr("src", "../../src/images/main/photo.png");
        }
    }
}

/**
 * @desc 获取当前用户头像的路径
 * @method getUserProfilePath
 */
function getUserProfilePath() {
    userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    var profilePhotoId = userBo.profilePhoto;
    var profilePhotoPath = "";
    if (profilePhotoId == null || profilePhotoId == "") {
        profilePhotoPath = "";
    } else {
        profilePhotoPath = "/cloudlink-core-file/file/getImageBySize?fileId=" + profilePhotoId + "&viewModel=fill&width=25&hight=25";
    }
    return profilePhotoPath;
}


/**
 * @desc 初始化数字，显示到页面上
 * @method getMsgNumber
 */
function getMsgNumber() {
    var messageNumber = 0;
    var token = lsObj.getLocalStorage("token");
    $.ajax({
        url: '/cloudlink-corrosionengineer/message/queryAllMessage?token=' + token,
        dataType: "json",
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                var data = result.messageList;
                newsData = data;
                for (var i in data) { //遍历字符串 
                    if (data[i].readStatus == "0") {
                        messageNumber++;
                    }
                }
                if (messageNumber > 0 && messageNumber < 99) {
                    $("#nuReadMsg").show();
                    $("#nuReadMsg").html(messageNumber);
                } else if (messageNumber >= 99) {
                    $("#nuReadMsg").show();
                    $("#nuReadMsg").html('99+');
                }
            } else {
                layer.msg("加载数据失败", { skin: "self-msg" });
            }
        },
        error: function(msg) {}
    });
}



$(".open").mouseenter(function() {
    $(".hide-person-operate").show();
}).mouseleave(function() {
    $(".hide-person-operate").hide();
});

/**
 * @desc 去个人资料页面
 */
$("#goPersonal").on("click", function(e) {
    e.preventDefault();
    parent.menuItem($(this));
    // try {
    //     if (zhugeSwitch == 1) {
    //         zhuge.track('个人资料设置');
    //     }
    // } catch (error) {}

});

/**
 * @desc 去修改密码页面
 */
$("#goModpwd").on("click", function(e) {
    e.preventDefault();
    parent.menuItem($(this));
    // try {
    //     if (zhugeSwitch == 1) {
    //         zhuge.track('进入修改密码');
    //     }
    // } catch (error) {}

});

/**
 * @desc 去goSetLogin登录设置页面
 */
$("#goSetLogin").on("click", function(e) {
    e.preventDefault();
    parent.menuItem($(this));
    // try {
    //     if (zhugeSwitch == 1) {
    //         zhuge.track('进入登录设置');
    //     }
    // } catch (error) {}

});

/**
 * @desc 去消息页面
 */
$("#goNewNews").on("click", function(e) {
    e.preventDefault();
    parent.menuItem($(this));
});

/**
 * @desc 去帮助页面
 */
$("#goHelp").on("click", function(e) {
    e.preventDefault();
    parent.menuItem($(this));
});

/**
 * @desc 退出登录
 */
$("#signOut").on("click", function(e) {
    e.preventDefault();
    layer.confirm("您确定要退出登录吗？", {
        title: "提示",
        btn: ['确定', "取消"], //按钮
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

                    location.href = 'login.html';
                } else {
                    layer.confirm("退出失败！", {
                        btn: ['确定'], //按钮
                        skin: 'self'
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    });
})

/**
 * @desc 设置右上角按钮的鼠标移入移出事件
 */
$(".person-operate li a").click(function() {
        $(this).css({
            background: "#434e62"
        });
    })
    .mouseenter(function() {
        $(this).css({
            background: "#434e62"
        });
    }).mouseleave(function() {
        $(this).css({
            background: "#344052"
        });
    })
    .focus(function() {
        $(this).css({
            background: "#434e62"
        });
    }).blur(function() {
        $(this).css({
            background: "#344052"
        });
    });

/**
 * @desc 菜单的打开与关闭
 */
var menuFlag = false;
$(".menu-bar").bind("click", function() {
    console.log(menuFlag);
    if (menuFlag == false) {
        $("#menuNav.navbar-static-side").show().slideDown(100);
        menuFlag = true;
    } else {
        $("#menuNav.navbar-static-side").slideUp(100).hide();
        menuFlag = false;
    }
});


/**
 * @desc 窗口大小变化控制菜单栏的显示与隐藏
 */
$(window).on("resize", function() {
    var winW = $(window).width();
    if (winW > 768) {
        $("#menuNav.navbar-static-side").show();
    } else {
        $("#menuNav.navbar-static-side").hide();
    }
});
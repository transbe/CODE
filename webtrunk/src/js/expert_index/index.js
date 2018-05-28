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

// 时间超时函数
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

// 获取用户头像信息
function getUserImage() {
    $("#userName").html(userBo.userName);
    var _path = getUserProfilePath();
    if (_path != "") {
        $("#userPhoto").attr("src", _path);
    } else {
        if (userBo.sex == "女") {
            $("#userPhoto").attr("src", "../../images/main/girl.png");
        } else {
            $("#userPhoto").attr("src", "../../images/main/photo.png");
        }
    }
}

// 获取当前用户头像的路径
function getUserProfilePath() {
    userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    var profilePhotoId = userBo.profilePhoto;
    var profilePhotoPath = "";
    if (profilePhotoId == null || profilePhotoId == "") {
        profilePhotoPath = "";
    } else {
        profilePhotoPath = "/cloudlink-core-file/file/getImageBySize?fileId=" + profilePhotoId + "&viewModel=fill&width=25&hight=25"+ "&token="+ lsObj.getLocalStorage("token");
    }
    return profilePhotoPath;
}

// 初始化数字，显示到页面上
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
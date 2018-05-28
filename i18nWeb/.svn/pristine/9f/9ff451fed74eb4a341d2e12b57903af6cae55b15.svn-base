/** 
 * @file
 * @author  lizhenzhen
 * @desc 现场检测人员首页图表的配置js逻辑操作
 * @date 2017-06-12 11:44:09
 * @last modified by lizhenzhen
 * @last modified time  2017-06-13 17:18:59
 */

var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); // 获取userBo
var token = lsObj.getLocalStorage("token"); // 获取token

$(function() {
    changePageStyle("../.."); // 换肤
    getIframHeight();
    $(window).bind("resize", function() {
        getIframHeight();
    });

    getTaskData(); // 获取现场检测个人任务信息
    getExecuteTaskData(); // 获取首页整体完成情况与各任务进度数据
    getPersonTaskData(); // 获取人员工作量统计数据
    getNewsData(); // 获取消息模块数据

    // 去消息页面
    $("#goNews").on("click", function(e) {
        e.preventDefault();
        parent.menuItem($(this));
    });
})

/**
 * @desc 获取首页内容框的高度
 * @method getIframHeight
 */
function getIframHeight() {
    var iframH = $(window).height();
    var iframW = $(window).width();
    if (iframH < 600 || iframW <= 985) {
        iframH = 600;
    }
    var iframHeadH = $(".welcom-header").outerHeight();
    var contentHeight = (iframH - 8 * 2 - iframHeadH);
    var graphBoxHeight = (contentHeight - 80) / 2;
    $(".entirety").height(contentHeight + "px");
    $(".execute-content").height(contentHeight - 50 + "px");
    $(".news-lists").height(contentHeight - 50 + "px");
    if (iframW <= 985) {
        $(".entirety").height("1000px");
        $(".execute-content").height("650px");
        $(".news-main").height("250px");
        $(".news-lists").height("250px");
    }
}

/**
 * @desc 获取现场检测个人任务信息
 * @method getTaskData
 */
function getTaskData() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/statistics/detectUserCount?token=" + token,
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                var data = result.dataMap;
                $("#taskSum").html(data.taskSum);
                $("#unclaimed").html(data.unclaimed);
                $("#running").html(data.running);
                $("#unchecked").html(data.unchecked);
            } else {
                layer.alert("加载数据失败", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }

    });
}

/**
 * @desc 获取首页整体完成情况与各任务进度数据
 * @method getExecuteTaskData
 */
function getExecuteTaskData() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/statistics/getTasProgressForDetectUser?token=" + token + "&detectUserId=" + userBo.objectId + "&enterpriseId=" + userBo.enterpriseId,
        dataType: "json",
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                var data = result.dataList;
                getAnnularChartBox(data);
            } else {
                layer.alert("加载数据失败", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取人员工作量统计数据 与任务的完成情况
 * @method getPersonTaskData
 */
function getPersonTaskData() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/getTaskProcess?token=" + token,
        dataType: "json",
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                var data = result.taskInfoBo.createUserCount;
                doPersonTaskData(data);
                drawPieGraph2("wholeGraph", result);
            } else {
                layer.alert("加载数据失败", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取现场检测人员消息数据
 * @method getNewsData
 */
function getNewsData() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/message/queryAllMessage?token=' + token,
        dataType: "json",
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                var data = result.messageList;
                createOnPage(data);
            } else {
                layer.alert("加载数据失败", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 加载消息到页面上
 * @method createOnPage
 * @param {*} data 
 */
function createOnPage(data) {
    var newsNoReadArr = [];
    for (var temp in data) {
        if (data[temp].readStatus == "0" && (data[temp].businessType == 1 || data[temp].businessType == 2 || data[temp].businessType == 6)) { //未读

            newsNoReadArr.push(data[temp]);
        }
    }
    $("#news-length").html("(" + newsNoReadArr.length + ")");
    $("#lists").html("");
    for (var i = 0; i < newsNoReadArr.length; i++) {
        $("<li><p class = 'list-line1'><span>" +
            newsNoReadArr[i].sendTime + "</span></p><p>" + newsNoReadArr[i].businessTypeName + "</p><p><span>任务名称: </span><span>" + newsNoReadArr[i].taskName + "</span></p><a class='news-check-btn' id=btn" + i + "  data-text='全部任务' data-index='8' href='src/html/task/all_task/all_task.html'>查看</a></li>").appendTo($("#lists"))
    }
    //点击消息查看跳转到全部任务页面
    var newCheckBtn = $(".news-check-btn");
    for (var i = 0; i < newCheckBtn.length; i++) {
        $("#btn" + i).on("click", function(e) {
            e.preventDefault();
            parent.menuItem($(this));
        });
    }
}

/**
 * @desc 处理个人工作量统计数据
 * @param {*} data 
 */
function doPersonTaskData(data) {
    var listArr = []; // 用于存放数据项
    var taskTodayArr = [], // 今日任务数组
        taskWeekArr = [], // 本周任务数组
        taskMonthArr = [], // 本月任务数组
        taskNameArr = []; // 任务名称
    var datazoomStart = "", // 定义datazoom的Start
        datazoomEnd = ""; // 定义datazoom的end

    var dataObj = {}; // 定义一个数组用于存放画图的数据

    for (var temp in data) {
        taskNameArr.push(temp);
        listArr.push(data[temp]);
    }
    for (var i in listArr) {
        taskTodayArr.push(listArr[i][0]);
        taskWeekArr.push(listArr[i][1]);
        taskMonthArr.push(listArr[i][2]);
    }

    dataObj.taskName = taskNameArr;
    dataObj.taskToday = taskTodayArr;
    dataObj.taskWeek = taskWeekArr;
    dataObj.taskMonth = taskMonthArr;

    if (listArr.length < 10) {
        datazoomStart = 0;
        datazoomEnd = 100;
    } else if (listArr.length < 20) {
        datazoomStart = 50;
        datazoomEnd = 100;
    } else if (listArr.length < 30) {
        datazoomStart = 80;
        datazoomEnd = 100;
    } else if (listArr.length < 40) {
        datazoomStart = 90;
        datazoomEnd = 100;
    } else {
        datazoomStart = 95;
        datazoomEnd = 100;
    }
    dataObj.datazoomStart = datazoomStart;
    dataObj.datazoomEnd = datazoomEnd;
    ByTimeDrawBarGrap("byTimeCheckGraph", dataObj);
    $("#personSumNum").html("(总人数：" + listArr.length + ")");
}
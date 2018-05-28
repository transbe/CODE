/**  
 * @file
 * @author: liangyuanyuan
 * @desc: 运营页面首页配置
 * @date: 2017-03-03 
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:30:38
 */

var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
var token;

$(function () {
    token = lsObj.getLocalStorage("token");
    //获取企业图表相关信息
    getEnterpriseInfo("day");
    //获取企业相关信息
    getStatistics();

    //获取所有专家的报告统计
    getReportStatistics();

    //获取待处理申请 获取今日待处理申请（即待审核状态）
    getAuditTask();

    //获取专家总数
    getExpertCount();

    //获取右侧消息列表
    //  getOneNews();

    var h_window = $(window).height();
    $(".content-main").height(h_window - 16);

    //点击按钮刷新企业信息图表
    $(".radius").click(function () {
        $(".radius").removeClass("focus");
        $(this).addClass("focus");
        var countType = $(this).attr("value");
        getEnterpriseInfo(countType);
    });
});

//窗口调整时适应
$(window).resize(function () {
    var h_window = $(window).height();
    $(".content-main").height(h_window - 16);
});

/**
 * @desc 获取企业相关信息
 */
function getStatistics() {
    //获取企业总个数
    $.get("/cloudlink-core-framework/enterprise/statistics/getCountByApp", {
        'token': token,
        'appId': appId
    }, function (result, status) {
        if (result.success == 1) {
            var data = result.rows[0];
            $('#regEnterprise').html(data.totalCount + "个") //注册企业个数
            $('#enrollEnterprise').html(data.totalCount + "个") //注册企业个数
            $('#authNum').html(data.authCount + "个"); // 企业认证个数
            $('#unauthNum').html(data.unauthCount + "个"); // 企业认证个数
            $('#agreementNum').html(data.officialCount + "个"); // 协议企业个数
            $('#testNum').html(data.trialCount + "个"); // 测试企业个数
        }
    })
}

/**
 * @desc 获取待处理申请 获取今日待处理申请（即待审核状态）
 */
function getAuditTask() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var today = date.getDate();
    var tomorrow = today + 1;
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (today >= 0 && today <= 9) {
        today = "0" + today;
    }
    if (tomorrow >= 0 && tomorrow <= 9) {
        tomorrow = "0" + tomorrow;
    }
    var todayDate = year + "-" + month + "-" + today
    var tomorrowDate = year + "-" + month + "-" + tomorrow

    $.get("/cloudlink-core-framework/enterprise/getListByApp", {
        'token': token,
        'appId': appId,
        'authenticateStatus': 2
    }, function (result, status) {
        if (result.success == 1) {
            $("#allAuditTask").html(result.total + "个");
        }
    })

    $.get("/cloudlink-core-framework/enterprise/getListByApp", {
        'token': token,
        'appId': appId,
        'useAppTimeBegin': todayDate,
        'useAppTimeEnd': tomorrowDate,
        'authenticateStatus': 2
    }, function (result, status) {
        if (result.success == 1) {
            $("#todayAuditTask").html(result.total + "个");
        }
    })
}

/**
 * @desc 获取企业用户相关信息图表
 * @param {string} countType 计算类型  day week month year
 */
function getEnterpriseInfo(countType) {
    var today; //今天日期
    var sevenDays; //7天日期集合
    var fourWeeks = []; //4周的集合
    var countRangeBegin = ""; //计算开始日期
    var countRangeEnd = ""; //计算结束日期
    if (countType == "day") {
        var today = moment();
        var sevenDays = [];
        for (var i = 6; i >= 1; i--) {
            var temp = today.clone().subtract(i, 'days');
            sevenDays.push(temp.format("YYYY-MM-DD"));
        }
        sevenDays.push(today.format("YYYY-MM-DD"));
        countRangeBegin = sevenDays[0];
        countRangeEnd = sevenDays[6];
    } else if (countType == "week") {
        var today = moment(); //今天
        var threeWeekBefore = today.clone().subtract(3, 'week'); //距离
        countRangeEnd = today.format("YYYY-MM-DD"); //计算开始日期
        countRangeBegin = moment(threeWeekBefore).startOf('week').format("YYYY-MM-DD"); //计算结束日期
        for (var i = 3; i >= 0; i--) {
            var temp = today.clone().subtract(i, 'week').format("gggg") + "-" + today.clone().subtract(i, 'week').format("w");
            fourWeeks.push(temp);
        }
    } else if (countType == "month") {
        countRangeBegin = new Date().getFullYear() + "-01-01";
        countRangeEnd = new Date().getFullYear() + "-12-31";
    }
    $.ajax({
        method: "get",
        url: "/cloudlink-core-framework/enterprise/statistics/getCountByAppAndRange?token=" + token,
        data: {
            "appId": appId,
            "countType": countType,
            countRangeBegin: countRangeBegin,
            //天 传从现在日期往前查7天可跨年，周 查近4周 可跨年(不用传)，月 查今年月，年不传
            countRangeEnd: countRangeEnd
        },
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var xData = [];
                var ySeries = [];
                var officialCount = {}; //协议用户
                officialCount.data = [];
                var authCount = {}; //认证企业
                authCount.data = [];
                var unauthCount = {}; //未认证企业
                unauthCount.data = [];
                var trialCount = {}; //试用用户
                trialCount.data = [];
                var newCount = {}; //新增用户
                newCount.data = [];
                var rows = result.rows;
                if ((countType == "year")) { //处理年的数据
                    for (var i = 0; i < rows.length; i++) {
                        //处理x轴显示
                        if (rows[i].countRange != null) {
                            xData.push(rows[i].countRange + "年");
                            officialCount.data.push(rows[i].officialCount);
                            authCount.data.push(rows[i].authCount);
                            unauthCount.data.push(rows[i].unauthCount);
                            trialCount.data.push(rows[i].trialCount);
                            newCount.data.push(rows[i].newCount);
                        }
                    }
                } else if ((countType == "month")) { //处理月的数据
                    var monthList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
                    for (var i = 0; i < monthList.length; i++) {
                        var hasNoData = true;
                        for (var j = 0; j < rows.length; j++) {
                            if (monthList[i] == rows[j].countRange.split("-")[1]) {
                                xData.push(monthList[i] + "月");
                                officialCount.data.push(rows[j].officialCount);
                                authCount.data.push(rows[j].authCount);
                                unauthCount.data.push(rows[j].unauthCount);
                                trialCount.data.push(rows[j].trialCount);
                                newCount.data.push(rows[j].newCount);
                                hasNoData = false;
                                break;
                            }
                        }
                        if (hasNoData == true) {
                            xData.push(monthList[i] + "月");
                            officialCount.data.push(0);
                            authCount.data.push(0);
                            unauthCount.data.push(0);
                            trialCount.data.push(0);
                            newCount.data.push(0);
                        }
                    }
                } else if ((countType == "week")) { //处理周的数据
                    for (var i = 0; i < fourWeeks.length; i++) {
                        var hasNoData = true;
                        for (var j = 0; j < rows.length; j++) {
                            if (fourWeeks[i] == rows[j].countRange) {
                                if (i == 3) {
                                    xData.push("本周");
                                } else if (i == 2) {
                                    xData.push("上周");
                                } else {
                                    if (fourWeeks[i].split("-")[0] != new Date().getFullYear()) {
                                        xData.push(fourWeeks[i].split("-")[0] + "年第" + fourWeeks[i].split("-")[1] + "周");
                                    } else {
                                        xData.push("第" + fourWeeks[i].split("-")[1] + "周");
                                    }
                                }
                                officialCount.data.push(rows[j].officialCount);
                                authCount.data.push(rows[j].authCount);
                                unauthCount.data.push(rows[j].unauthCount);
                                trialCount.data.push(rows[j].trialCount);
                                newCount.data.push(rows[j].newCount);
                                hasNoData = false;
                                break;
                            }
                        }
                        if (hasNoData == true) {
                            if (i == 3) {
                                xData.push("本周");
                            } else if (i == 2) {
                                xData.push("上周");
                            } else {
                                if (fourWeeks[i].split("-")[0] != new Date().getFullYear()) {
                                    xData.push(fourWeeks[i].split("-")[0] + "年第" + fourWeeks[i].split("-")[1] + "周");
                                } else {
                                    xData.push("第" + fourWeeks[i].split("-")[1] + "周");
                                }
                            }
                            officialCount.data.push(0);
                            authCount.data.push(0);
                            unauthCount.data.push(0);
                            trialCount.data.push(0);
                            newCount.data.push(0);
                        }
                    }
                } else if (countType == "day") {
                    for (var i = 0; i < sevenDays.length; i++) {
                        var hasNoData = true;
                        for (var j = 0; j < rows.length; j++) {
                            if (sevenDays[i] == rows[j].countRange) {
                                xData.push(sevenDays[i]);
                                officialCount.data.push(rows[j].officialCount);
                                authCount.data.push(rows[j].authCount);
                                unauthCount.data.push(rows[j].unauthCount);
                                trialCount.data.push(rows[j].trialCount);
                                newCount.data.push(rows[j].newCount);
                                hasNoData = false;
                                break;
                            }
                        }
                        if (hasNoData == true) {
                            xData.push(sevenDays[i]);
                            officialCount.data.push(0);
                            authCount.data.push(0);
                            unauthCount.data.push(0);
                            trialCount.data.push(0);
                            newCount.data.push(0);
                        }
                    }
                }
                officialCount.name = "协议用户";
                officialCount.type = "line";
                trialCount.name = "试用用户";
                trialCount.type = "line";
                authCount.name = "认证企业";
                authCount.type = "line";
                unauthCount.name = "非认证企业";
                unauthCount.type = "line";
                newCount.name = "新增用户";
                newCount.type = "line";
                ySeries.push(officialCount);
                ySeries.push(trialCount);
                ySeries.push(authCount);
                ySeries.push(unauthCount);
                ySeries.push(newCount);
                setEnterpriseGraph(xData, ySeries);
            } else {
                layer.alert(result.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 获取企业用户相关信息图表
 * @param {string} countType 计算类型  day week month year
 */
function getEnterpriseInfo_old(countType) {
    $.ajax({
        method: "get",
        url: "/cloudlink-core-framework/enterprise/statistics/getCountByAppAndRange?token=" + token,
        data: {
            "appId": appId,
            "countType": countType
        },
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var xData = [];
                var ySeries = [];
                var officialCount = {}; //协议用户
                officialCount.data = [];
                var authCount = {}; //认证企业
                authCount.data = [];
                var unauthCount = {}; //未认证企业
                unauthCount.data = [];
                var trialCount = {}; //试用用户
                trialCount.data = [];
                var newCount = {}; //新增用户
                newCount.data = [];
                var rows = result.rows;
                var startIndex = 0;
                var endIndex;
                if ((countType == "week")) {
                    if (rows.length >= 4) {
                        startIndex = rows.length - 4;
                        endIndex = rows.length;
                    }
                }
                // switch(countType){
                //     case "week":
                //         if(rows.length>=4){
                //             startIndex = rows.length-4;
                //             endIndex = rows.length;
                //         }
                //         break;
                //     case "day":
                // }
                for (var i = startIndex; i < rows.length; i++) {
                    //处理x轴显示
                    if (rows[i].countRange != null) {
                        if (countType == "week") {
                            if (i == rows.length - 1) {
                                xData.push("本周");
                            } else if (i == rows.length - 2) {
                                xData.push("上周");
                            } else {
                                xData.push(rows[i].countRange.split("-")[1] + "周");
                            }
                        } else if (countType == "month") {
                            if (i == rows.length - 1) {
                                xData.push("本月");
                            } else if (i == rows.length - 2) {
                                xData.push("上月");
                            } else {
                                xData.push(rows[i].countRange.split("-")[1] + "月");
                            }
                        } else {
                            xData.push(rows[i].countRange);
                        }
                        officialCount.data.push(rows[i].officialCount);
                        authCount.data.push(rows[i].authCount);
                        unauthCount.data.push(rows[i].unauthCount);
                        trialCount.data.push(rows[i].trialCount);
                        newCount.data.push(rows[i].newCount);
                    }

                }

                officialCount.name = "协议用户";
                officialCount.type = "line";
                trialCount.name = "试用用户";
                trialCount.type = "line";
                authCount.name = "认证企业";
                authCount.type = "line";
                unauthCount.name = "非认证企业";
                unauthCount.type = "line";
                newCount.name = "新增用户";
                newCount.type = "line";
                ySeries.push(officialCount);
                ySeries.push(trialCount);
                ySeries.push(authCount);
                ySeries.push(unauthCount);
                ySeries.push(newCount);
                setEnterpriseGraph(xData, ySeries);
            } else {
                layer.alert(result.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取所有专家的报告统计
 */
function getReportStatistics() {
    var year = new Date().getFullYear();
    $.ajax({
        method: "get",
        url: "/cloudlink-corrosionengineer/statistics/reportStatistics?token=" + token + "&year=" + year,
        // contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.reportStatistics;
                //finishedReportRate monthAddReportCount reportAverageDays todayAddReportCount totalReportCount
                $("#finishedReportRate").html(data.finishedReportRate);
                $("#monthAddReportCount").html(data.monthAddReportCount);
                $("#reportAverageDays").html(data.reportAverageDays);
                $("#todayAddReportCount").html(data.todayAddReportCount);
                $("#totalReportCount").html(data.totalReportCount);
            } else {
                layer.alert(result.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取专家总数
 */
function getExpertCount() {
    $.ajax({
        method: "get",
        url: "/cloudlink-corrosionengineer/expert/queryExpertForPage?token=" + token + "&appId=" + appId,
        // contentType: "application/json",
        dataType: "json",
        success: function (result) {
            if (result.success == 1) {
                $("#expertCount").html(result.total + "个");
            } else {
                layer.alert(result.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 企业相关信息图表配置项
 * @param {array} xData 横坐标数据
 * @param {array} ySeries 纵坐标数据
 */
function setEnterpriseGraph(xData, ySeries) {
    // 基于准备好的dom，初始化echarts实例
    var enterpriseChart = echarts.init(document.getElementById('enterpriseGraph'));

    // 指定图表的配置项和数据
    var option = {
        // title: {
        //     text: '增长曲线'
        // },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ["协议用户", "试用用户", "认证企业", "非认证企业", "新增用户"]
        },
        xAxis: {
            data: xData
        },
        yAxis: {},
        series: ySeries
    };

    // 使用刚指定的配置项和数据显示图表。
    enterpriseChart.setOption(option, true);

    window.addEventListener("resize", function () {
        enterpriseChart.resize();
    });
}

/**
 * @desc 获取消息到页面
 */
function getOneNews() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/message/queryAllMessage?token=' + token,
        dataType: "json",
        type: 'get',
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.messageList;
                // console.log(data);
                var importantNews = []; //定义消息数组                
                for (var i in data) {
                    if (data[i].readStatus == "0" && (data[i].businessType == 4 || data[i].businessType == 8)) { //未读
                        importantNews.push(data[i]);
                    }
                }
                $("#news-length").html("(" + importantNews.length + ")"); //重要消息个数
                // 消息结构显示
                for (var i = 0; i < importantNews.length; i++) {
                    var lis = "<li><p class='list-line1'><span>" + importantNews[i].sendTime + "</span></p><p>" + importantNews[i].businessTypeName + "</p><p><span>企业名称：</span><span>" + importantNews[i].content + "</span></p><a class='news-check-btn' id=btn" + i + "  data-text='消息' data-index='8' href='src/html/user_management/enterprise_user_management.html'>查看</a></li>";
                    $(lis).appendTo($("#lists"))
                }
                //点击消息查看跳转到企业用户管理页面
                var newCheckBtn = $(".news-check-btn");
                for (var i = 0; i < newCheckBtn.length; i++) {
                    $("#btn" + i).on("click", function (e) {
                        e.preventDefault();
                        parent.menuItem($(this));
                    });
                }
            } else {
                layer.msg("加载数据失败", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}
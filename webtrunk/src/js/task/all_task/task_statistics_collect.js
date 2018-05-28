/**
 * @file
 * @author  lizhenzhen
 * @desc 对文件的简单描述
 * @date  2017-04-21
 * @last modified by lizhenzhen 
 * @last modified time  2017-06-12 09:25:03
 */
var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); //获取userBo
var token = lsObj.getLocalStorage("token");   //获取token

var wholeOption, WholeChart; //整体完成情况配置项与图表
var byTimeCheckChart, TimeCheckOption; //人员工作量统计配置项与图表
var Options, Charts; //各任务进度
var divArr = [];  //定义divArr

$(function () {
    changePageStyle("../../..");
    setExecuteGraph();    //配置整体完成饼图
    setTimeCheckGraph();  //配置下部柱状图
    setTaskRateGraph();   //配置饼状图任务进度
    getExecuteTaskData(); //获取首页整体完成情况与各任务进度数据
    getPersonTaskData();  //获取人员工作量统计数据
})

/**
 * @desc 获取首页内容框的高度
 */
function getIframHeight() {
    var iframH = $(window).height();
    var iframW = $(window).width();
    if (iframH < 500) {
        iframH = 500;
    }
    if (iframW < 1000) {
        iframH = 1000;
        $(".entirety").height("1060px");
        $(".entirety-status").height("590px");
        $(".execute-content").height("550px");
        $(".execute-content .execute-graph-box").height("250px");
        $(".entirety-news").height("450px");
        $(".news-lists").height("400px");

    } else {
        var iframPadding = parseInt($(".welcom-box").css("padding"));
        var iframHeadH = $(".welcom-header").outerHeight();
        var contentHeight = (iframH - iframPadding * 2 - iframHeadH);
        var graphBoxHeight = (contentHeight - 80) / 2;
        $(".entirety").height(contentHeight + "px");
        $(".execute-content").height((contentHeight - 50) + "px");
        $(".execute-content .execute-graph-box").height(graphBoxHeight + "px");
        $(".news-lists").height(contentHeight - 50 + "px");
    }
}

/**
 * @desc 获取首页整体完成情况与各任务进度数据
 */
function getExecuteTaskData() {
    var url = handleURL("/cloudlink-corrosionengineer/statistics/downPartStatis?token=" + token); //对url进行权限处理
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.dataMap;
                drowExecuteGraph(data.theOverAllCompletion);
                drowTaskRateGraph(data);

            } else {
                parent.layer.alert(getLanguageValue("load_data_error"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        }
    });
}

/**
 * @desc 获取人员工作量统计数据
 */
function getPersonTaskData() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/getTaskProcess?token=" + token,
        dataType: "json",
        type: "get",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.taskInfoBo.createUserCount;
                drowTimeCheckGraph(data);
            } else {
                 parent.layer.alert(getLanguageValue("load_data_error"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 配置整体完成饼图
 */
function setExecuteGraph() {
    WholeChart = echarts.init(document.getElementById('wholeGraph'));
    wholeOption = {
        title: {
            subtext: '',
            bottom: 0,
            left: "38%",
            subtextStyle: {
                color: "#333",
                fontSize: 12
            }

        },
        tooltip: {
            trigger: 'item',
            formatter: "{b}"
        },
        textStyle: {
            color: "#666",
            fontSize: 12
        },
        series: [{
            name: getLanguageValue("all_marker_number"),
            type: 'pie',
            radius: '50%',
            center: ['50%', '45%'],
            data: [{
                itemStyle: {
                    normal: {
                        color: '#4fc877' //已完成
                    }
                },
                labelLine: {
                    normal: {
                        length: 1
                    }
                }
            }, {
                itemStyle: {
                    normal: {
                        color: '#fb7760' //无法检测
                    }
                },
                labelLine: {
                    normal: {
                        length: 1
                    }
                }

            }, {
                itemStyle: {
                    normal: {
                        color: '#e2e2e2' //待检测
                    }
                },
                labelLine: {
                    normal: {
                        length: 1
                    }
                }
            }],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    window.addEventListener("resize", function () {
        WholeChart.resize();
    });
    WholeChart.setOption(wholeOption, true);
}

/**
 * @desc 画整体完成情况图
 * @param {*String} data
*/
function drowExecuteGraph(data) {
    var totalmarker = data.totalmarker,
        completedCount = data.completedCount, //已完成
        unableCount = data.unableCount, //无法检测
        notdetectCount = data.notdetectCount; //待检测
    var completedbili, unablebili, notdetectbili;
    if (completedCount == 0) {
        completedbili = 0;
    } else {
        completedbili = (completedCount / totalmarker * 100).toFixed(0);
    }

    if (unableCount == 0) {
        unablebili = 0;
    } else {
        unablebili = (unableCount / totalmarker * 100).toFixed(0);
    }

    if (notdetectCount == 0) {
        notdetectbili = 0;
    } else {
        notdetectbili = (notdetectCount / totalmarker * 100).toFixed(0);
    }
    try {
        if (wholeOption && typeof wholeOption === "object") {
            wholeOption.title.subtext = (getLanguageValue("all_marker")+"(个):" + data.totalmarker);
            wholeOption.series[0].data[0].value = completedCount;
            wholeOption.series[0].data[0].name = completedCount + "个/" + completedbili + "%\n"+getLanguageValue("done");
            wholeOption.series[0].data[1].value = unableCount;
            wholeOption.series[0].data[1].name = unableCount + "个/" + unablebili + "%\n"+getLanguageValue("failed");
            wholeOption.series[0].data[2].value = notdetectCount;
            wholeOption.series[0].data[2].name = notdetectCount + "个/" + notdetectbili + "%\n"+getLanguageValue("waitTest");
            WholeChart.setOption(wholeOption, true);
        }
    } catch (e) {
        alert(e);
    }
}

/**
 * @desc 配置下部柱状图
 */
function setTimeCheckGraph() {
    byTimeCheckChart = echarts.init(document.getElementById('byTimeCheckGraph'));
    TimeCheckOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            right: 10,
            icon: 'circle',
            data: [getLanguageValue("today"), getLanguageValue("week"), getLanguageValue("month")]
        },
        grid: {
            show: true,
            right: '4%',
            bottom: '6%',
            containLabel: true,
        },
        dataZoom: [{
            type: 'inside',
            start: 80,
            end: 100,
            zoomLock: true //是否锁定选择区域（或叫做数据窗口）的大小。
            // 如果设置为 true 则锁定选择区域的大小， 也就是说， 只能平移， 不能缩放。
        },
        {
            show: false,
            type: 'slider',
            y: '90%',
            start: 80,
            end: 100,
        }
        ],
        xAxis: [{
            type: 'category',
            axisLabel: {
                interval: 0
            },
            axisTick: {
                show: true,
                inside: true
            },
            nameTextStyle: {
                fontSize: 8,
            },
            data: ""
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: getLanguageValue("today"),
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: '#50c979',
                    barBorderRadius: 5
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: "#666",
                        fontSize: 12
                    }
                }
            },
            data: ""
        },
        {
            name: getLanguageValue("week"),
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: '#f59324',
                    barBorderRadius: 5
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: "#666",
                        fontSize: 12
                    }
                }
            },
            data: ""
        },
        {
            name: getLanguageValue("month"),
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: '#fb7760',
                    barBorderRadius: 5
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: "#666",
                        fontSize: 12
                    }
                }
            },
            data: ""
        }

        ]
    };
    window.addEventListener("resize", function () {
        byTimeCheckChart.resize();
    });
    byTimeCheckChart.setOption(TimeCheckOption, true);
}

/**
* @desc 画下部柱状图
* @param {*String} data
*/
function drowTimeCheckGraph(data) {

    var taskNameArr = [],
        listArr = [],
        thisDayArr = [],
        thisWeekArr = [],
        thisMonthArr = [];

    var datazoomStart = "",
        datazoomEnd = "";
    for (var temp in data) {
        taskNameArr.push(temp);
        listArr.push(data[temp]);


    }
    for (var i in listArr) {
        thisDayArr.push(listArr[i][0]);
        thisWeekArr.push(listArr[i][1]);
        thisMonthArr.push(listArr[i][2]);
    }

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
    $("#personSumNum").html("("+getLanguageValue("totalPersonnels")+"：" + listArr.length + ")");

    if (TimeCheckOption && typeof TimeCheckOption === "object") {
        TimeCheckOption.dataZoom[0].start = datazoomStart;
        TimeCheckOption.dataZoom[0].end = datazoomEnd;
        TimeCheckOption.dataZoom[1].start = datazoomStart;
        TimeCheckOption.dataZoom[1].end = datazoomEnd;

        TimeCheckOption.xAxis[0].data = taskNameArr;
        TimeCheckOption.series[0].data = thisDayArr;
        TimeCheckOption.series[1].data = thisWeekArr;
        TimeCheckOption.series[2].data = thisMonthArr;
        byTimeCheckChart.setOption(TimeCheckOption, true);
    }
}

/**
 * @desc 配置饼状图任务进度
 */
function setTaskRateGraph() {
    Options = {
        title: {
            subtext: '',
            bottom: 30,
            left: "center",
            subtextStyle: {
                color: "#333",
                fontSize: 12
            }

        },
        grid: {
            left: "0",
            right: "0",
        },
        tooltip: {
            show: false,
            trigger: 'item',
            formatter: "{a} <br/>{b}"
        },
        animation: { show: false },
        series: [{
            name: getLanguageValue("taskStatistics"),
            type: 'pie',
            radius: [0, '20%'],
            center: ['50%', '30%'],
            hoverAnimation: false,
            selectedOffset: 0,
            label: {
                normal: {
                    position: 'inner',
                    textStyle: {
                        color: '#464646',
                        fontSize: 12
                    }
                }
            },
            line: {
                markPoint: {
                    silent: true
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 1000,
                name: "1000",
                itemStyle: {
                    normal: {
                        color: '#fff',
                    }
                }
            }]
        },
        {
            name: getLanguageValue("taskStatistics"),
            type: 'pie',
            radius: ['40%', '50%'],
            center: ['50%', '35%'],
            label: {
                normal: {
                    position: "outside",
                    textStyle: {
                        color: '#464646',
                        fontSize: 12
                    }
                }
            },

            data: [{
                value: "200",
                name: '200',
                itemStyle: {
                    normal: {
                        color: '#50c979'
                    }
                },
                labelLine: {
                    normal: {
                        length: 0.1,
                    }
                },
            },
            {
                value: "300",
                itemStyle: {
                    normal: {
                        color: '#e3e3e3'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                }
            },

            ]
        }
        ]
    };

}

/**
 * @desc 画饼状图任务进度
 * @param {*String} data
*/
function drowTaskRateGraph(data) {
    for (var temp in data) {
        var list = data[temp].taskList;
        for (var temp in list) {
            divArr.push(list[temp]);
        }
    }
    for (var i = 0; i < divArr.length; i++) {
        (function (i) {
            var that = i;
            $("#executeModel").append($("<div class='whole-model' id=" + that + "></div>"));
            if (Options && typeof Options === "object") {
                var charts = echarts.init(document.getElementById(that));
                Options.series[0].data[0].name = divArr[that].testSum; //总
                Options.series[1].data[0].value = divArr[that].complete; //完成
                Options.series[1].data[0].name = divArr[that].complete + "个\n完成"; //完成
                Options.series[1].data[1].value = (divArr[that].testsum - divArr[that].complete);
                Options.title.subtext = divArr[that].taskName;
                charts.setOption(Options, true);
            }
        })(i)
    }
    $("#taskNum").html("(" + divArr.length + ")");
}
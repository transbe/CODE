/**
 * @author: lizhenzhen
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:全部任务统计图
 */
var yearsChart, MarkChart, ResultChart, StausChart, WholeChart, byTimeCheckChart, wayCheckChart;    //定义echart全局变量
var yearsOption = {},
    MarkOption = {},
    ResultOption = {},
    StausOption = {},
    wayCheckOption = {};    //定义全局option
var wholeOption = {},
    TimeCheckOption = {};   //定义全局option
var taskTodayArr = [],
    taskWeekArr = [],
    taskMonthArr = [],
    taskNameArr = [];   //定义全局数组

var Charts;
var Options = [];
var divArr = [];

var token;  //定义全局token
var pipelineid; //定义全局管线ID

$(function () {

    //    时间插件
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4,
        pickTime: false
    });

    //获取管线下拉框
    getPipeline();
})

/**
 * @desc 获取管线下拉框
 * @method getPipeline
 */
function getPipeline() {
    token = lsObj.getLocalStorage("token");
    var url = handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token);    //对url进行权限处理
    $('#treeview').jstree({
        core: {
            multiple: false,
            animation: 0,
            check_callback: true,
            themes: {
                dots: false
            },
            //强制将节点文本转换为纯文本，默认为false
            force_text: true,
            data: function (obj, cb) {
                var dataItem;

                $.ajax({
                    url: url,
                    method: "get",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false
                })
                    .done(function (res) {
                        if (res.success == 1) {
                            dataItem = res.treeList;
                        } else {
                            layer.msg(res.msg, { skin: "self-success" });
                        }
                    })
                cb.call(this, dataItem);
            }
        },
        sort: function (a, b) {
            return this.get_node(a).original.orderNumber - 0 > this.get_node(b).original.orderNumber - 0 ? 1 : -1;
        },
        types: {
            "pipeline-folder": {
                icon: 'folder-icon'
            },
            "pipeline": {
                icon: 'pipeline-icon',
                valid_children: []
            }
        },
        plugins: ["types", "sort"]
    })
        .on('loaded.jstree', function (e, data) {
            $("#pipeName").focus(function () {
                showMenu();
            });
        })
        .on('select_node.jstree', function (e, data) {
            pipelineid = data.node.id;
            $("#pipeName").val(data.node.text);
            hideMenu();
        });
}

/**
 * @desc 列出管线下拉树
 * @method showMenu
 */
function showMenu() {
    var pipleZtreeObj = $("#pipeName");
    var pipleZtreeOffset = $("#pipeName").offset();
    $("#menuContent").css({ left: pipleZtreeOffset.left + "px", top: pipleZtreeOffset.top + pipleZtreeObj.outerHeight() + "px" }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}

/**
 * @desc 隐藏下拉树
 * @method hideMenu
 */
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}


/**
 * @desc 失去焦点事件
 * @method onBodyDown
 * @param {*String} event
 */
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

/**
 * @desc 点击统计做统计
 * @method makeStatic
 */
function makeStatic() {
    var year = $("#year").val();
    var pipelineName = $("#pipeName").val();
    if (pipelineName && pipelineName != null && year && year != null) {
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('任务统计', { '任务类型': '全部任务', '结果': '成功' });
            }
        } catch (e) {

        }
        getStaticData(pipelineid, year);
    } else {
        parent.layer.msg("请输入查询条件", { skin: "self-success" });
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('任务统计', { '任务类型': '全部任务', '结果': '失败' });
            }
        } catch (e) {

        }
    }
}

/**
 * @desc 获取统计数据
 * @method getStaticData
 * @param {*String} lineId, year
 */
function getStaticData(lineId, year) {
    var url = handleURL("/cloudlink-corrosionengineer/statistics/allTaskStatis?token=" + token + "&pipelineId=" + lineId + "&year=" + year);    //对url进行权限处理
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var taskObj = result.dataMap;

                // 本年度任务
                setYearsGraph();
                drowYearTaskGraph(taskObj.yearOfTask);

                // 本年度检测桩检测个数
                setMarkType();
                drowMarkTypeGraph(taskObj.markerOfYear);

                // 各方法累计检测（个）
                setWayCheck();
                drawWayCheckGraph(taskObj.methodOfYear)

                // 执行中任务整体完成情况
                setExecuteGraph();
                drowExecuteGraph(taskObj.allTaskCompletion);

                // 各任务进度  
                setTaskRateGraph();
                drowTaskRateGraph(taskObj);

                // 各任务本日，本周，本月的执行情况
                setTimeCheckGraph();
                drowTimeCheckGraph(taskObj);

            } else {
                layer.msg("加载数据失败", { skin: "self-success" });
            }
        }
    });
}

/**
 * @desc 配置本年度任务图表
 * @method setYearsGraph
 */
function setYearsGraph() {
    yearsChart = echarts.init(document.getElementById('yearsChart'));
    yearsOption = {
        title: {
            subtext: '',
            bottom: "20",
            left: "center",
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
            type: 'pie',
            radius: '35%',
            center: ['50%', '40%'],
            data: [{
                value: "",
                name: "",
                itemStyle: {
                    normal: {
                        color: '#fa765e' //待审核
                    }
                },
                labelLine: {
                    normal: {
                        length: 1,
                    }
                }
            }, {
                value: "",
                name: "",
                itemStyle: {
                    normal: {
                        color: '#f8a950' //执行中
                    }
                },
                labelLine: {
                    normal: {
                        length: 1,
                    }
                }
            }, {
                value: "",
                name: "",
                itemStyle: {
                    normal: {
                        color: '#e2e2e2' //待领取
                    }
                },
                labelLine: {
                    normal: {
                        length: 1,
                    }
                }
            }, {
                value: "",
                name: "",
                itemStyle: {
                    normal: {
                        color: '#4fc877' //已审核
                    }
                },
                labelLine: {
                    normal: {
                        length: 1,
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
    yearsChart.setOption(yearsOption, true);
    window.addEventListener("resize", function () {
        yearsChart.resize();
    });
}

/**
 * @desc 画本年度任务图表
 * @method drowYearTaskGraph
 * @param {*String} yearOfTask
 */
function drowYearTaskGraph(yearOfTask) {
    var total = yearOfTask.totalTaskCount, //总数
        auditCount = yearOfTask.auditCount, //待审核
        runningCount = yearOfTask.runningCount, //计划检测
        receiveCount = yearOfTask.receiveCount, //待领取
        CheckedCount = yearOfTask.CheckedCount; //已审核

    if (yearsOption && typeof yearsOption === "object") {
        yearsOption.title.subtext = ("任务总个数(个):" + total);
        yearsOption.series[0].data[0].value = auditCount;
        yearsOption.series[0].data[0].name = (auditCount + '个\n待审核');
        yearsOption.series[0].data[1].value = runningCount;
        yearsOption.series[0].data[1].name = (runningCount + '个\n执行中');
        yearsOption.series[0].data[2].value = receiveCount;
        yearsOption.series[0].data[2].name = (receiveCount + '个\n待领取');
        yearsOption.series[0].data[3].value = (CheckedCount);
        yearsOption.series[0].data[3].name = (CheckedCount + '个\n已审核');
        yearsChart.setOption(yearsOption, true);
    }

}

/**
 * @desc 配置本年度测试桩检测个数
 * @method setMarkType
 */
function setMarkType() {
    // 基于准备好的dom，初始化echarts实例
    StausChart = echarts.init(document.getElementById('taskChecked'));
    MarkOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['测试桩类型']
        },
        grid: {
            width: "90% ",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            containLabel: true
        },
        xAxis: [{
            type: 'value',
            position: 'top',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
                textStyle: {
                    fontSize: 12
                }
            },
            splitLine: {
                show: false
            },
        }],
        yAxis: [{
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontSize: 12
                }
            },
            axisLine: {
                show: false
            },
            axisTick: { show: false },
            data: ""
        }],
        series: [{
            name: '测试桩数',
            type: 'bar',
            barWidth: 8,
            barMaxWidth: 10,
            itemStyle: {
                normal: {
                    color: "#59b6fc",
                    barBorderRadius: 5
                },
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    textStyle: {
                        color: "#666",
                        fontSize: 12
                    }
                }
            },
            data: ""
        }]
    };
    window.addEventListener("resize", function () {
        StausChart.resize();
    });
    // 使用刚指定的配置项和数据显示图表。
    StausChart.setOption(MarkOption, true);
}

/**
 * @desc 画柱状图表
 * @method drowMarkTypeGraph
 * @param {*String} data
 */
function drowMarkTypeGraph(data) {

    var totalOfMarkStausY = ["任务计划检测", "实际完成检测", "无法检测", "待检测"];
    var totalOfMarkStausArr = [];
    totalOfMarkStausArr.push(data.jihuajiance);
    totalOfMarkStausArr.push(data.shijiwancheng);
    totalOfMarkStausArr.push(data.wufajiance);
    totalOfMarkStausArr.push(data.daijiance);
    if (StausOption && typeof StausOption === "object") {
        StausOption = MarkOption;
        StausOption.series[0].data = totalOfMarkStausArr;
        StausOption.yAxis[0].data = totalOfMarkStausY;
        StausChart.setOption(StausOption, true);
    }
}

/**
 * @desc 配置各方法累计检查
 * @method setWayCheck
 */
function setWayCheck() {
    wayCheckChart = echarts.init(document.getElementById('wayCheckGraph'));
    wayCheckOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            right: '15%',
            bottom: '3%',
            containLabel: true
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
        },
        {
            show: false,
            type: 'slider',
            y: '90%',
            start: 0,
            end: 100
        }
        ],

        xAxis: [{
            name: "检测\n方法",
            type: 'category',
            axisTick: {
                show: true,

            },
            data: ""
        }],
        yAxis: [{
            name: "测试桩数",
            type: 'value',
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
            }
        }],
        series: [{
            name: '测试桩数',
            type: 'bar',
            barWidth: 8,

            itemStyle: {
                normal: {
                    barBorderRadius: 4,
                    color: '#59b6fc'
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
        }]
    };
    window.addEventListener("resize", function () {
        wayCheckChart.resize();
    });
    wayCheckChart.setOption(wayCheckOption, true);
}

/**
 * @desc 画各方法累计检查
 * @method drawWayCheckGraph
 * @param {*String} methodOfYear
 */
function drawWayCheckGraph(methodOfYear) {
    var taskname = [];
    var tasknum = [];
    for (var temp in methodOfYear) {
        taskname.push(temp);
        tasknum.push(methodOfYear[temp]);
    }

    if (wayCheckOption && typeof wayCheckOption === "object") {
        wayCheckOption.xAxis[0].data = taskname;
        wayCheckOption.series[0].data = tasknum;
        wayCheckChart.setOption(wayCheckOption, true);
    }
}

/**
 * @desc 配置执行中任务饼图
 * @method setExecuteGraph
 */
function setExecuteGraph() {
    WholeChart = echarts.init(document.getElementById('wholeGraph'));
    wholeOption = {
        title: {
            subtext: '',
            bottom: "20",
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
            name: '全部测试桩个数',
            type: 'pie',
            radius: '35%',
            center: ['50%', '40%'],
            data: [{
                itemStyle: {
                    normal: {
                        color: '#4fc877' //已完成
                    }
                },
                labelLine: {
                    normal: {
                        length: 1,
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
                        length: 1,
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
                        length: 1,
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
 * @method drowExecuteGraph
 * @param {*String} data
 */
function drowExecuteGraph(data) {
    var totalmarker = data.total,
        completedCount = data.yiwancheng, //已完成
        unableCount = data.wufajiance, //无法检测
        notdetectCount = data.daijiance; //待检测
    var completedbili, unablebili, notdetectbili;
    if (completedCount == 0) {
        completedbili = 0;
    } else {
        completedbili = (completedCount / totalmarker * 100).toFixed(0);
    }

    if (unableCount == 0) {
        unablebili = 0;
    } else {
        unablebili = (notdetectCount / totalmarker * 100).toFixed(0);
    }

    if (notdetectCount == 0) {
        notdetectbili = 0;
    } else {
        notdetectbili = (notdetectCount / totalmarker * 100).toFixed(0);
    }

    if (wholeOption && typeof wholeOption === "object") {
        wholeOption.title.subtext = ("全部测试桩(个):" + totalmarker);
        wholeOption.series[0].data[0].value = completedCount;
        wholeOption.series[0].data[0].name = completedCount + "/" + completedbili + "%\n已检测";
        wholeOption.series[0].data[1].value = unableCount;
        wholeOption.series[0].data[1].name = unableCount + "/" + unablebili + "%\n无法检测";
        wholeOption.series[0].data[2].value = notdetectCount;
        wholeOption.series[0].data[2].name = notdetectCount + "/" + notdetectbili + "%\n待检测";
        WholeChart.setOption(wholeOption, true);
    }
}

/**
 * @desc 配置下部柱状图
 * @method setTimeCheckGraph
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
            data: ['今日', '本周', '本月']
        },
        grid: {
            //   left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        dataZoom: [{
            type: 'inside',
            zoomLock: true //是否锁定选择区域（或叫做数据窗口）的大小。
            // 如果设置为 true 则锁定选择区域的大小， 也就是说， 只能平移， 不能缩放。
        },
        {
            show: false,
            type: 'slider',
            y: '90%',
        }
        ],
        xAxis: [{

            type: 'category',
            axisTick: {
                //   show: false
                show: true,
                inside: true
            },
            axisLabel: {
                rotate: 45,
                interval: 0
            },
            nameTextStyle: {
                fontSize: 8,
            },
            data: ""
        }],
        yAxis: [{
            name: "测试桩数",
            type: 'value'
        }],
        series: [{
            name: '今日',
            type: 'bar',
            barWidth: 8,
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
            name: '本周',
            type: 'bar',
            barWidth: 8,
            itemStyle: {
                normal: {
                    color: '#f59324'
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
            name: '本月',
            type: 'bar',
            barWidth: 8,
            itemStyle: {
                normal: {
                    color: '#fb7760'
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
 * @method drowTimeCheckGraph
 * @param {*String} data
 */
function drowTimeCheckGraph(data) {
    var listArr = [];
    var datazoomStart = "",
        datazoomEnd = "";
    for (var temp in data) {
        var list = data[temp].taskList;
        for (var temp1 in list) {
            listArr.push(list[temp1]);
            taskNameArr.push(list[temp1].taskName);
            taskTodayArr.push(list[temp1].todayTest);
            taskWeekArr.push(list[temp1].thisWeek);
            taskMonthArr.push(list[temp1].thisMonth);
        }
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
    if (TimeCheckOption && typeof TimeCheckOption === "object") {
        TimeCheckOption.dataZoom[0].start = datazoomStart;
        TimeCheckOption.dataZoom[0].end = datazoomEnd;
        TimeCheckOption.dataZoom[1].start = datazoomStart;
        TimeCheckOption.dataZoom[1].end = datazoomEnd;

        TimeCheckOption.xAxis[0].data = taskNameArr;
        TimeCheckOption.series[0].data = taskTodayArr;
        TimeCheckOption.series[1].data = taskWeekArr;
        TimeCheckOption.series[2].data = taskMonthArr;

        byTimeCheckChart.setOption(TimeCheckOption, true);
    }
}

/**
 * @desc 配置饼状图任务进度
 * @method setTaskRateGraph
 */
function setTaskRateGraph() {
    Options = {
        title: {
            subtext: '',
            //   top: 0,
            bottom: "30",
            left: "center",
            subtextStyle: {
                color: "#333",
                fontSize: 12
            }

        },
        tooltip: {
            show: false,
            trigger: 'item',
            formatter: "{a} <br/>{b}"
        },
        animation: { show: false },
        series: [{
            name: '任务统计',
            type: 'pie',
            radius: [0, '20%'],
            center: ['50%', '35%'],
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
            name: '任务统计',
            type: 'pie',
            radius: ['35%', '45%'],
            center: ['50%', '40%'],
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
                        length: 0.01,
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
 * @method drowTaskRateGraph
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
                Options.series[1].data[1].value = (parseInt(divArr[that].testSum) - parseInt(divArr[that].complete));
                var tname = divArr[that].taskName;
                Options.title.subtext = tname;
                window.addEventListener("resize", function () {
                    charts.resize();
                });
                charts.setOption(Options, true);
            }
        })(i)
    }

}
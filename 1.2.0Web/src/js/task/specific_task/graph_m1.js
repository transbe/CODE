/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:m1的曲线图
 */
var objectId = getParameter("objectId"); //获取任务ID
var detectMethod = getParameter("detectMethod");    //获取检测方法
var taskName = decodeURI(getParameter("taskName")); //获取任务名称
var intervalNum = 0 //定义全局的变量
var myChartM1;  //定义全局的变量
var optionM1;   //定义全局的变量

// try {
//     var currentPage = Option1.pageNumber; // 定义当前页码
// } catch (error) {
// }
// var goPageNum; // 定义想要到达的页码
$(function () {
    queryPipeCheck();   //初始化下拉选（所属管线）;
    $("#pipeName").bind("change", function () {  //改变所属管线下拉框时触发
        var pipeNameID = $("#pipeName").val();
        if (pipeNameID != null) {
            queryMarkCheck(pipeNameID); //初始化起始桩下拉框的值
        }
    });
    initEcharts();  //初始化echarts 
    getDetectDataById(objectId);    //根据任务ID查询检测数据
    $('#graph_2').css('display', 'none');

});

/**
 * @desc 初始化下拉选（所属管线）;
 * @method queryPipeCheck
 */
function queryPipeCheck() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryPipeCheck?taskId=" + objectId,
        dataType: "json",
        method: "get",
        success: function (result) {
            if (result.success == 1) {
                var data = result.pipeList;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                var myobj = document.getElementById('pipeName');
                if (myobj.options.length == 0) {
                    $("#pipeName").html(options);
                }
            } else {
                parent.layer.confirm("加载下拉选失败", {
                    title: '提示',
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
            }
        }
    });
}

/**
 * @desc 初始化起始桩下拉框的值
 * @method queryMarkCheck
 * @param {*String} pipelineId
 */
function queryMarkCheck(pipelineId) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryMarkList?flag=check&pipelineId=" + pipelineId + "&taskId=" + objectId + '&token=' + token,
        dataType: "json",
        type: "get",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.success == 1) {
                var data = result.markList;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#pipeendNumberName").html(options);
                $("#pipestartNumberName").html(options);
            }
        }
    });
}

/**
 * @desc 根据任务ID查询检测数据
 * @method getDetectDataById
 * @param {*String} objectId
 */
function getDetectDataById(objectId) {
    var url = "/cloudlink-corrosionengineer/task/queryDetectData?taskId=" + objectId + "&token=" + token;
    $.ajax({
        url: url,
        type: "get",
        async: false,
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                var detectdata = res.detectionDataBoList;
                $('#taskName').html(taskName);
                $('#detectMethod').html(detectMethod);

                if (detectdata.length > 0) {
                    for (var i = 0; i < detectdata.length; i++) {
                        detectdata[i].number = i + 1;
                    }
                }
                var echartData = {};
                if (detectdata.length > 0) {
                    var data_x = [];
                    var data_x_object = [];
                    var data_y_onPotentialOfMax = [];
                    var data_y_avOfPlAvg = [];
                    var data_y_onPotentialOfMin = [];
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);    //测试桩编号
                        data_y_onPotentialOfMax.push(detectdata[i].onPotentialOfMax); //通电电位最大值
                        data_y_onPotentialOfMin.push(detectdata[i].onPotentialOfMin); //通电电位最小值
                        data_y_avOfPlAvg.push(detectdata[i].avOfPlAvg); //交流电压平均值 
                        data_x_object.push(detectdata[i].objectId)  //测试桩ID
                    }
                    if (data_x.length > 50) {
                        optionM1.xAxis[0].axisLabel.interval = 1
                    }
                    optionM1.xAxis[0].data = data_x
                    optionM1.xAxis[1].data = data_x_object
                    optionM1.series[0].data = data_y_onPotentialOfMax;
                    optionM1.series[1].data = data_y_onPotentialOfMin;
                    optionM1.series[2].data = data_y_avOfPlAvg;
                    optionM1.dataZoom[0].startValue = 0
                    optionM1.dataZoom[0].endValue = 49
                    myChartM1.setOption(optionM1, true);
                }
            }
        },
    });
}

/**
 * @desc 初始化echarts
 * @method initEcharts
 */
function initEcharts() {
    myChartM1 = echarts.init(document.getElementById('graph_1'));
    optionM1 = {
        title: {
            text: '电位曲线图',
            left: "center"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },

        },
        toolbox: {
            right: "5",
            feature: {
                dataZoom: {
                    yAxisIndex: 'none',
                    xAxisIndex: 0
                },
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            top: "10%",
            data: ['通电电位最大值', '通电电位最小值', '交流电压平均值']
        },
        xAxis: [{
            nameLocation: "middle",
            nameGap: "40",
            type: 'category',
            axisLabel: {
                margin: '30',
                rotate: '45',
                interval: intervalNum
            },
            axisTick: { // 轴标记
                show: false
            },

            data: "",
        }, {
            show: false,
            data: "",
        }],
        yAxis: [{
            name: "通电电位值（mV）",
            nameLocation: "middle",
            nameGap: "40",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
        }, {
            name: "交流电压平均值（V）",
            nameLocation: "middle",
            nameGap: "40",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
        }],

        grid: {
            bottom: 70,
        },
        dataZoom: [{
            type: 'slider',
            bottom: 45,
            height: 15,
        }, {
            type: 'inside'
        }],

        series: [{
            name: '通电电位最大值',
            type: 'line',
            data: "",
        }, {
            name: '通电电位最小值',
            type: 'line',
            data: ""
        }, {
            name: '交流电压平均值',
            type: 'line',
            yAxisIndex: 1,
            data: ""
        }],
    };

    //窗口大小发生改变时触发
    window.addEventListener("resize", function () {
        myChartM1.resize();
    });
    myChartM1.setOption(optionM1, true);
    myChartM1.on('dblclick', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: '检测数据详情',
            area: ['950px', '600px'],
            btn: ['取消'],
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/specific_task/view_marker_m1.html?detectMethod=1&id="+ optionM1.xAxis[1].data[params.dataIndex]
        });
    })
}


/**
 * @desc 查询曲线图
 * @method queryGraph
 */
function queryGraph() {

    var pipeline_id = $("#pipeName").val(); //管线id
    var startMarkNum = $("#pipestartNumberName").val(); //获取开始的测试桩编号
    var endMarkNum = $("#pipeendNumberName").val(); //获取结束的测试桩编号
    if (endMarkNum - 0 < startMarkNum - 0) {    //起始桩号大于终止桩号
        parent.layer.confirm("起始桩号不能大于终止桩号", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return;
    }
    var url = "/cloudlink-corrosionengineer/task/queryDetectData?taskId=" + objectId;
    var parameter = {
        "pipelineId": pipeline_id,
        "startMarkNum": startMarkNum,
        "endMarkNum": endMarkNum,
        "token": token
    };
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        data: parameter,
        success: function (jso) {
            if (jso.success == 1) {
                var detectdata = jso.detectionDataBoList;
                var echartData = {};
                if (detectdata.length > 0) {
                    var data_x = [];
                    var data_x_object = [];
                    var data_y_onPotentialOfMax = [];
                    var data_y_avOfPlAvg = [];
                    var data_y_onPotentialOfMin = [];
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);
                        data_y_onPotentialOfMax.push(detectdata[i].onPotentialOfMax);
                        data_y_avOfPlAvg.push(detectdata[i].avOfPlAvg);
                        data_y_onPotentialOfMin.push(detectdata[i].onPotentialOfMin);
                        data_x_object.push(detectdata[i].objectId);
                    }
                    console.log(data_y_onPotentialOfMax)
                    optionM1.xAxis[0].data = data_x
                    optionM1.xAxis[1].data = data_x_object
                    optionM1.series[0].data = data_y_onPotentialOfMax;
                    optionM1.series[1].data = data_y_onPotentialOfMin;
                    optionM1.series[2].data = data_y_avOfPlAvg;
                    myChartM1.setOption(optionM1, true);
                } else {
                    parent.layer.confirm("无测试数据", {
                        title: "提示",
                        btn: ['确定'], //按钮
                        skin: 'self'
                    });
                }
            }
        },
    });
}

//重置form表单
function clearForm() {
    // document.getElementById("formSearch").reset();
    // $('.selectpicker').selectpicker('val', null);
    $(':input').each(
        function() {
            switch (this.type) {
                case 'passsword':
                case 'select-multiple':
                case 'select-one':
                case 'text':
                case 'textarea':
                    $(this).val('');
                    break;
                case 'checkbox':
                case 'radio':
                    this.checked = false;
            }
        }
    );
    getDetectDataById(objectId);
}
/**
 * @file
 * @author  gaohui
 * @desc m1的曲线图
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:24:49
 */
var objectId = getParameter("objectId"); //获取任务ID
var detectMethod = getParameter("detectMethod");    //获取检测方法
var taskName = decodeURI(getParameter("taskName")); //获取任务名称
var myChartM1;  //定义全局的变量
var optionM1;   //定义全局的变量
var myChartM2;  //定义全局的变量
var optionM2;   //定义全局的变量
var data_analysisResultVal_color = []; //定义颜色数组
$(function () {
    changePageStyle("../../..");
    loadPipelineSelect();   //初始化下拉选（所属管线）;
   
    $("#pipeName").bind("change", function () {  //改变管线下拉框值触发事件
        var pipeNameID = $("#pipeName").val();
        if (!isNull(pipeNameID)) {
            getMarkList(pipeNameID); //初始化起始桩下拉框的值
        }
    });
    $("#pipestartNumberName").bind("change",function(){         // 选择起始桩号
        $('#pipeendNumberName').selectpicker('val', 0);//默认选中
        $("#pipeendNumberName").selectpicker('refresh');
    }); 
    
    $(".defined-legend-one").css("display",'block');
    initEcharts();  //初始化echarts 
    getDetectDataById(objectId);    //根据任务ID查询检测数据
    // $('#graphTwo').css('display', 'none');
    $("#searchForm").keydown(function() {
        if (event.keyCode == "13") { //keyCode=13是回车键
            queryGraph();
        }
    });
});

/**
 * @desc 根据任务ID查询检测数据
 * @param {*String} objectId
 */
function getDetectDataById(objectId) {
    var url = "/cloudlink-corrosionengineer/task/queryDetectData?taskId=" + objectId + "&token=" + token;
    $.ajax({
        url: url,
        type: "get",
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
                    var map_y_soilResistivity = [];

                    var color = "";
                    for (var i = 0; i < detectdata.length; i++) {
                        
                        var soilResistivity = detectdata[i].soilResistivity?detectdata[i].soilResistivity:0;
                        // var onPotentialOfMax = detectdata[i].onPotentialOfMax?detectdata[i].onPotentialOfMax:0;
                        data_x.push(detectdata[i].markerNumber);    //测试桩编号
                        data_y_onPotentialOfMax.push(detectdata[i].onPotentialOfMax); //通电电位最大值
                        // data_y_onPotentialOfMax.push(onPotentialOfMax); //通电电位最大值
                        data_y_onPotentialOfMin.push(detectdata[i].onPotentialOfMin); //通电电位最小值
                        data_y_avOfPlAvg.push(detectdata[i].avOfPlAvg); //交流电压平均值 
                        map_y_soilResistivity.push(soilResistivity); //土壤电阻率
                        data_x_object.push(detectdata[i].objectId)  //测试桩ID
                        
                        if(detectdata[i].analysisResult == 3){
                            color = "#eaf5fd";
                        }else if(detectdata[i].analysisResult == 2){
                            color = "#fdf2de";
                        }else if(detectdata[i].analysisResult == 4){
                            color = "#f7e6e6";
                        }else{
                            color = "#fff";
                        }
                        data_analysisResultVal_color.push(color);
                    }
                    
                    optionM1.xAxis[0].data = data_x
                    optionM1.xAxis[1].data = data_x_object

                    optionM1.series[0].data = data_y_onPotentialOfMax;
                    optionM1.series[1].data = data_y_onPotentialOfMin;
                    optionM1.series[2].data = data_y_avOfPlAvg;
                    optionM1.dataZoom[0].startValue = 0;
                    optionM1.dataZoom[0].endValue = 49;
                    if (data_x.length > 50) {
                        optionM1.xAxis[0].axisLabel.interval = 1
                    }
                    optionM1.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;
                    myChartM1.setOption(optionM1, true);

                    optionM2.xAxis[0].data = data_x;
                    optionM2.xAxis[1].data = data_x_object;
                   
                    optionM2.series[0].data = map_y_soilResistivity;
                    optionM2.dataZoom[0].startValue = 0;
                    optionM2.dataZoom[0].endValue = 49;
                    if (data_x.length > 50) {
                        optionM2.xAxis[0].axisLabel.interval = 1
                    }
                    optionM2.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;
                    myChartM2.setOption(optionM2, true);
                   
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 初始化echarts
 */
function initEcharts() {
    myChartM1 = echarts.init(document.getElementById('graphOne'));
    myChartM2 = echarts.init(document.getElementById('graphTwo'));

    optionM1 = {
        title: {
            text: getLanguageValue("CurrentCurveChart"),
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
            data: [getLanguageValue("ONPotentialMax"),getLanguageValue("ONPotentialMin"), getLanguageValue("ACVoltageAvg")]
        },
        xAxis: [{
            nameLocation: "middle",
            nameGap: "40",
            type: 'category',
            axisLabel: {
                margin: '30',
                rotate: '45',
            },
            axisTick: { // 轴标记
                show: false
            },
            splitArea: { //背景色的设置
                show: true,
                interval:0,
                areaStyle: {
                    color: ""
                }
            },
            data: "",
        }, {
            show: false,
            data: "",
        }],
        yAxis: [{
            name: getLanguageValue("ONPotentialVal") + getUnit("onPotentialOfMax"),
            nameLocation: "middle",
            nameGap: "50",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
        }, {
            name: getLanguageValue("ACVoltageAvg") + getUnit("avOfPlAvg"),
            nameLocation: "middle",
            nameGap: "50",
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
            // start:2.987,
            // end:65.234
        }, {
            type: 'inside'
        }],

        series: [{
            name: getLanguageValue("ONPotentialMax"),
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#0000ff',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#0000ff'
                }
            },
            data: "",
        }, {
            name: getLanguageValue("ONPotentialMin"),
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#c93a36',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#c93a36'
                }
            },
            data: ""
        }, {
            name: getLanguageValue("ACVoltageAvg"),
            type: 'line',
            yAxisIndex: 1,
            lineStyle: {
                normal: {
                    color: '#ffa500',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#ffa500'
                }
            },
            data: ""
        }],
    };

    optionM2 = {
        title: {
            text: getLanguageValue("soilResistivityMeasurement"),
            left: "center"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
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
            orient: 'horizontal',
            data: [getLanguageValue("soilResistivity")]
        },
        xAxis: [{
            nameLocation: "middle",
            nameGap: "40",
            type: 'category',
            axisLabel: {
                margin: '30',
                rotate: '45',
                // interval: 0
            },
            axisTick: { // 轴标记
                show: false
            },
            splitArea: { //背景色的设置
                show: true,
                interval:0,
                areaStyle: {
                    color: ""
                    //  color: "#fff"
                }
            },
           
            data: "",
            // data: ["111","222","333"],
        }, {
            show: false,
            data: "",
        }],
        yAxis: [{
            name: getLanguageValue("soilResistivity") + getUnit("soilResistivity"),
            nameLocation: "middle",
            nameGap: "50",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
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
            name: getLanguageValue("soilResistivity"),
            type: 'bar',
            barWidth: 10,
            // yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color :'#e6b990',
                    barBorderRadius: 4,
                    // borderColor:"#213",
                    // borderWidth:1,
                }
            },
            data: "",
            //  data: [2,4,6,3,7],
        }]
    };


    //窗口大小发生改变时触发
    window.addEventListener("resize", function () {
        myChartM1.resize();
    });
    window.addEventListener("resize", function () {
        myChartM2.resize();
    });

    myChartM1.setOption(optionM1, true);
    myChartM2.setOption(optionM2, true);

    myChartM1.on('click', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("detailedData"),
            area: ['950px', '600px'],
            btn: [getLanguageValue("close_btn")],
            skin: 'self-iframe',
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/specific_task/view_detectedData_m1.html?detectMethod=1&id="+ optionM1.xAxis[1].data[params.dataIndex]
        });
    });
    myChartM1.on('datazoom',function (params) {
        var opt = myChartM1.getOption();
        var index = opt.dataZoom[0];
        optionM1.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color.slice(index.startValue);
        var tstart = opt.xAxis[0].data[index.startValue];
        var tend = opt.xAxis[0].data[index.endValue];
        // console.log(index.startValue)
        // console.log(tstart)
        // console.log(params)
        // console.log(params.batch[0].end)
        if((isNull(params.start)&&isNull(params.end))&&isNull(params.batch)){
            myChartM1.setOption(optionM1);
            return;        
        }
       if(!isNull(params.start)||!isNull(params.end)){    //平移
            optionM1.dataZoom[0].start = params.start<= 0 ? 0:params.start;
            optionM1.dataZoom[0].end = params.end>= 100?100:params.end;
            myChartM1.setOption(optionM1);
        } else if(!isNull(params.batch[0].startValue)){    //区域放大
            optionM1.dataZoom[0].startValue = params.batch[0].startValue;
            optionM1.dataZoom[0].endValue = params.batch[0].endValue;
            myChartM1.setOption(optionM1);
        } else{  //滑动滚动条
            optionM1.dataZoom[0].start = params.batch[0].start<=0?0:params.batch[0].start;
            optionM1.dataZoom[0].end = params.batch[0].end>=100?100:params.batch[0].end;
            myChartM1.setOption(optionM1);
        }
    });

    myChartM2.on('click', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("detailedData"),
            area: ['950px', '600px'],
            btn: [getLanguageValue("close_btn")],
            skin: 'self-iframe',
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/specific_task/view_detectedData_m1.html?detectMethod=1&id="+ optionM1.xAxis[1].data[params.dataIndex]
        });
    });
    myChartM2.on('datazoom',function (params) {
        var opt = myChartM2.getOption();
        var index = opt.dataZoom[0];
        optionM2.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color.slice(index.startValue);
        var tstart = opt.xAxis[0].data[index.startValue];
        var tend = opt.xAxis[0].data[index.endValue];
        // console.log(index.startValue)
        // console.log(tstart)
        // console.log(params)
        // console.log(params.batch[0].end)
        if((isNull(params.start)&&isNull(params.end))&&isNull(params.batch)){
            myChartM2.setOption(optionM2);
            return;        
        }
       if(!isNull(params.start)||!isNull(params.end)){    //平移
            optionM2.dataZoom[0].start = params.start<= 0 ? 0:params.start;
            optionM2.dataZoom[0].end = params.end>= 100?100:params.end;
            myChartM2.setOption(optionM2);
        } else if(!isNull(params.batch[0].startValue)){    //区域放大
            optionM2.dataZoom[0].startValue = params.batch[0].startValue;
            optionM2.dataZoom[0].endValue = params.batch[0].endValue;
            myChartM2.setOption(optionM2);
        } else{  //滑动滚动条
            optionM2.dataZoom[0].start = params.batch[0].start<=0?0:params.batch[0].start;
            optionM2.dataZoom[0].end = params.batch[0].end>=100?100:params.batch[0].end;
            myChartM2.setOption(optionM2);
        }
    });
    
}


/**
 * @desc 查询曲线图
 */
function queryGraph() {

    var pipelineId = $("#pipeName").val(); //管线id
    var startMarkNum = $("#pipestartNumberName").val(); //获取开始的测试桩编号
    var endMarkNum = $("#pipeendNumberName").val(); //获取结束的测试桩编号
    if (endMarkNum - 0 < startMarkNum - 0) {    //起始桩号大于终止桩号
        parent.layer.alert(getLanguageValue("compare_markerNumber"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    var url = "/cloudlink-corrosionengineer/task/queryDetectData?taskId=" + objectId;
    var parameter = {
        "pipelineId": pipelineId,
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
                    var map_y_soilResistivity = [];
                    data_analysisResultVal_color = [];

                    var color = "";
                    for (var i = 0; i < detectdata.length; i++) {
                        var soilResistivity = detectdata[i].soilResistivity?detectdata[i].soilResistivity:0;
                        data_x.push(detectdata[i].markerNumber);
                        data_y_onPotentialOfMax.push(detectdata[i].onPotentialOfMax);
                        data_y_avOfPlAvg.push(detectdata[i].avOfPlAvg);
                        data_y_onPotentialOfMin.push(detectdata[i].onPotentialOfMin);
                        data_x_object.push(detectdata[i].objectId);
                        map_y_soilResistivity.push(soilResistivity); //土壤电阻率
                        if(detectdata[i].analysisResult == 3){
                            color = "#eaf5fd";
                        }else if(detectdata[i].analysisResult == 2){
                            color = "#fdf2de";
                        }else if(detectdata[i].analysisResult == 4){
                            color = "#f7e6e6";
                        }else{
                            color = "#fff";
                        }
                        data_analysisResultVal_color.push(color);
                    }
                    optionM1.xAxis[0].data = data_x
                    optionM1.xAxis[1].data = data_x_object
                    optionM1.series[0].data = data_y_onPotentialOfMax;
                    optionM1.series[1].data = data_y_onPotentialOfMin;
                    optionM1.series[2].data = data_y_avOfPlAvg;
                    optionM1.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;
                    myChartM1.setOption(optionM1, true);

                    optionM2.xAxis[0].data = data_x;
                    optionM2.xAxis[1].data = data_x_object;
                    optionM2.series[0].data = map_y_soilResistivity;
                    optionM2.dataZoom[0].startValue = 0;
                    optionM2.dataZoom[0].endValue = 49;
                    if (data_x.length > 50) {
                        optionM2.xAxis[0].axisLabel.interval = 1
                    }
                    optionM2.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;
                    myChartM2.setOption(optionM2, true);
                } else {
                    parent.layer.alert(getLanguageValue("noData"), {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 重置form表单
 */
function clearForm() {
    document.getElementById("searchForm").reset();
    $('#pipeName').selectpicker('val', 0);//默认选中
    $("#pipeName").selectpicker('refresh');
    $('#pipestartNumberName').selectpicker('val', 0);//默认选中
    $("#pipestartNumberName").selectpicker('refresh');
    $('#pipeendNumberName').selectpicker('val', 0);//默认选中
    $("#pipeendNumberName").selectpicker('refresh');
    getDetectDataById(objectId);
}
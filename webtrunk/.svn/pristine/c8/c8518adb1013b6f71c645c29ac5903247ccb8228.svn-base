/**
 * @file
 * @author  gaohui
 * @desc m3和m6的曲线图
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:24:38
 */
var objectId = getParameter("objectId"); //获取任务id
var detectMethod = getParameter("detectMethod");    //获取检测方法
var taskName = decodeURI(getParameter("taskName")); //获取任务名称
var token = lsObj.getLocalStorage('token'); //获取token
var data_analysisResultVal_color = [];  //背景色
$(function () {
    changePageStyle("../../..");
    if (detectMethod == 3 || detectMethod == 6) {   //判断检测方法是否为3或者6
        loadPipelineSelect();   //初始化下拉选（所属管线））；
        initEcharts();  //初始化echarts 
        getDetectDataById(objectId);  //根据任务ID查询检测数据
       
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
    }
    $(".defined-legend-one").css("display",'none');
    $(".defined-legend-two").css("display",'block');
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
                    var data_y_onPotentialOfCouponAvg = [];
                    var data_y_offPotentialOfCouponAvg = [];
                    var data_y_soilResistivity = [];
                    
                    var color = "";
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);    //测试桩编号
                        data_y_onPotentialOfCouponAvg.push(detectdata[i].onPotentialOfCouponAvg);   //试片通电电位平均值
                        data_y_offPotentialOfCouponAvg.push(detectdata[i].offPotentialOfCouponAvg); //试片断电电位平均值
                        data_y_soilResistivity.push(detectdata[i].soilResistivity); //土壤电阻率平均值
                        data_x_object.push(detectdata[i].objectId)  //测试桩ID
                        if(detectdata[i].analysisResult == 3){
                            color = "#fef6ed"; 
                        }else if(detectdata[i].analysisResult == 2){
                            color = "#f9d9df";
                        }else{
                            color = "#fff";
                        }
                        data_analysisResultVal_color.push(color);
                    }
                    option.xAxis[0].data = data_x
                    option.xAxis[1].data = data_x_object
                    option.series[0].data = data_y_onPotentialOfCouponAvg;
                    option.series[1].data = data_y_offPotentialOfCouponAvg;
                    option.series[2].data = data_y_soilResistivity;
                    option.dataZoom[0].startValue = 0
                    option.dataZoom[0].endValue = 49
                    option.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;
                    if (data_x.length > 50) {
                        option.xAxis[0].axisLabel.interval = 1
                    }
                    myChart1.setOption(option, true);
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title:getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}
var myChart1;
var option;
/**
 * @desc 初始化echarts
 */
function initEcharts() {
    myChart1 = echarts.init(document.getElementById('graphOne'));
    var colors = ['#5793f3', '#d14a61', '#675bba'];
    option = {
        title: {
            text: getLanguageValue("CurrentCurveChart"),
            left: "center"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        legend: {
            top: "10%",
            left: "center",
            data: [getLanguageValue("couponOnPotentialAvg"), getLanguageValue("couponOFFPotentialAvg"), getLanguageValue("SoilResistivityAvg")]
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
            name: getLanguageValue("couponAvg") + getUnit("onPotentialOfCouponAvg"),
            nameLocation: "middle",
            nameGap: "50",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
        },
        {
            name: getLanguageValue("SoilResistivityAvg") + getUnit("soilResistivity"),
            nameLocation: "middle",
            nameGap: "50",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
        }
        ],
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

        grid: {
            bottom: 70
        },
        dataZoom: [{
            type: 'slider',
            bottom: 45,
            height: 15,
        }, {
            type: 'inside'
        }],

        series: [{
            name: getLanguageValue("couponOnPotentialAvg"),
            type: 'line',
            xAxisIndex: 0,
            lineStyle: {
                normal: {
                    color: '#ff1493',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#ff1493'
                }
            },
            data: ""
        }, {
            name: getLanguageValue("couponOFFPotentialAvg"),
            type: 'line',
            xAxisIndex: 0,
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
            data: ""
        },
        {
            name: getLanguageValue("SoilResistivityAvg"),
            type: 'line',
            type: 'bar',
            barWidth: 10,
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color :'#e6b990',
                    barBorderRadius: 4,
                    // borderColor:"#213",
                    // borderWidth:1,
                }
            },
        }
        ],
    };

    if (option && typeof option === "object") {
        myChart1.setOption(option, true);
        window.addEventListener("resize", function () {
            myChart1.resize();
        });
    }
    myChart1.on('click', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("detailedData"),
            area: ['950px', '600px'],
            btn: [getLanguageValue("close_btn")],
            skin: 'self-iframe',
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/specific_task/view_detectedData_m"+detectMethod+".html?detectMethod="+detectMethod+"&id="+ option.xAxis[1].data[params.dataIndex]
        });
    });
    myChart1.on('datazoom',function (params) {
        var opt = myChart1.getOption();
        var index = opt.dataZoom[0];
        option.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color.slice(index.startValue);
        if(isNull(params.end)&&isNull(params.start)&&isNull(params.batch)){
             myChart1.setOption(option);
            return;        
        }
         if(!isNull(params.start)||!isNull(params.end)){    //平移
            option.dataZoom[0].start = params.start<= 0 ? 0:params.start;
            option.dataZoom[0].end = params.end>= 100?100:params.end;
            myChart1.setOption(option);
        } else if(!isNull(params.batch[0].startValue)){    //区域放大
            option.dataZoom[0].startValue = params.batch[0].startValue;
            option.dataZoom[0].endValue = params.batch[0].endValue;
            myChart1.setOption(option);
        } else{  //滑动滚动条
            option.dataZoom[0].start = params.batch[0].start<=0?0:params.batch[0].start;
            option.dataZoom[0].end = params.batch[0].end>=100?100:params.batch[0].end;
            myChart1.setOption(option);
        }
    });
}

/**
 * @desc 查询曲线图
 */
function queryGraph() {
    var pipelineId = $("#pipeName").val();
    var startMarkNum = $("#pipestartNumberName").val();
    var endMarkNum = $("#pipeendNumberName").val();
    if (endMarkNum - 0 < startMarkNum - 0) {
        parent.layer.alert(getLanguageValue("compare_markerNumber"), {
            title:getLanguageValue("tip_title"),
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
        success: function (res) {
            if (res.success == 1) {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查询曲线图', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                var detectdata = res.detectionDataBoList;
                var echartData = {};
                if (detectdata.length > 0) {
                    var data_x = [];
                    var data_x_object = [];
                    var data_y_onPotentialOfCouponAvg = [];
                    var data_y_offPotentialOfCouponAvg = [];
                    var data_y_soilResistivity = [];
                    data_analysisResultVal_color = [];
                    var color = "";
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);
                        data_y_onPotentialOfCouponAvg.push(detectdata[i].onPotentialOfCouponAvg);
                        data_y_offPotentialOfCouponAvg.push(detectdata[i].offPotentialOfCouponAvg);
                        data_y_soilResistivity.push(detectdata[i].soilResistivity);
                        data_x_object.push(detectdata[i].objectId);
                        if(detectdata[i].analysisResult == 3){
                            color = "#fef6ed"; 
                        }else if(detectdata[i].analysisResult == 2){
                            color = "#f9d9df";
                        }else{
                            color = "#fff";
                        }
                        data_analysisResultVal_color.push(color);

                    }
                    option.xAxis[0].data = data_x
                    option.xAxis[1].data = data_x_object
                    option.series[0].data = data_y_onPotentialOfCouponAvg;
                    option.series[1].data = data_y_offPotentialOfCouponAvg;
                    option.series[2].data = data_y_soilResistivity;
                    option.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;
                    if (data_x.length > 50) {
                        option.xAxis[0].axisLabel.interval = 1
                    }
                    myChart1.setOption(option, true);
                } else {
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('查询曲线图', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                        }
                    } catch (error) {

                    }
                    parent.layer.alert(getLanguageValue("noData"), {
                        title:getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title:getLanguageValue("tip_title"),
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
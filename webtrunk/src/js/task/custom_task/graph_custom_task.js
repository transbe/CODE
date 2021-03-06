/**
 * @file
 * @author  gaohui
 * @desc m2的曲线图
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:24:44
 */
var objectId = getParameter("objectId");     //获取任务ID
var detectMethod = getParameter("detectMethod");    //获取检测方法
var taskName = decodeURI(getParameter("taskName")); //获取任务名称
var token = lsObj.getLocalStorage('token'); //获取token
var templateId = getParameter('templateId');  //获取检测方法
var data_analysisResultVal_color = [];  //背景色
$(function () {
    changePageStyle("../../..");
  
    $(".defined-legend-two").css("display",'block');
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

    initEcharts();    //初始化echarts 
    getDetectDataById(objectId);    //根据任务ID查询检测数据
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
                if (detectdata.length > 0) {
                    for (var i = 0; i < detectdata.length; i++) {
                        detectdata[i].number = i + 1;
                    }
                }
                if (detectdata.length > 0) {
                    var data_x = [];
                    var data_y_offPotentialOfCouponMax = [];
                    var data_y_offPotentialOfCouponMin = [];
                    var data_y_offPotentialOfCouponAvg = [];
                    var onPotentialOfMax = [];
                    var data_y_onPotentialOfMin = [];
                    var data_y_onPotentialOfAvg = [];
                    var data_y_avOfPlAvg = [];
                    var data_y_couponAcDensityAvg = [];
                    var map_x = [];
                    var map_y_soilResistivity = [];
                    var data_x_object = [];
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);    //测试桩编号
                        
                        data_y_offPotentialOfCouponMax.push(detectdata[i].offPotentialOfCouponMax); //试片最大对地断电电位
                        data_y_offPotentialOfCouponMin.push(detectdata[i].offPotentialOfCouponMin); //试片最小对地断电电位
                        data_y_offPotentialOfCouponAvg.push(detectdata[i].offPotentialOfCouponAvg); //试片平均对地断电电位
                        data_y_onPotentialOfMin.push(detectdata[i].onPotentialOfMin); //最小电电位
                        data_y_onPotentialOfAvg.push(detectdata[i].onPotentialOfMax); //平均通电电位
                        onPotentialOfMax.push(detectdata[i].onPotentialOfMax); //通电电位
                        
                        data_y_couponAcDensityAvg.push(detectdata[i].couponAcDensityAvg); // 试片交流电流密度平均值
                        data_y_avOfPlAvg.push(detectdata[i].avOfPlAvg); //交流电压平均值
                        map_y_soilResistivity.push(detectdata[i].soilResistivity); //土壤电阻率
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
                    option.series[0].data = data_y_avOfPlAvg;
                    option.series[1].data = data_y_couponAcDensityAvg;
                    option.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;
                    myChart1.setOption(option, true);
                    option2.xAxis[0].data = data_x
                    option2.xAxis[1].data = data_x_object
                    option2.series[0].data = map_y_soilResistivity;
                    option2.series[1].data = data_y_offPotentialOfCouponAvg;
                    option2.series[2].data = data_y_onPotentialOfAvg;
                    option2.series[3].data = onPotentialOfMax;
                    option2.series[4].data = data_y_onPotentialOfMin;
                    option2.series[5].data = data_y_offPotentialOfCouponMax;
                    option2.series[6].data = data_y_offPotentialOfCouponMin;
                    option2.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;

                    myChart2.setOption(option2, true);
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


var myChart1;   //定义一个变量myChart1
var myChart2;   //定义一个变量myChart2
var option;   //定义一个变量option
var option2;   //定义一个变量option2

/**
 * @desc 初始化echarts
 */
function initEcharts() {
    myChart1 = echarts.init(document.getElementById('graphOne'));
    myChart2 = echarts.init(document.getElementById('graphTwo'));
     option = {
        title: {
            text: getLanguageValue("acCurve"),
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
            top: '10%',

            data: [getLanguageValue("acVoltageAvg"), getLanguageValue("acCurrentDensity")]
        },
        xAxis: [{
            nameLocation: "middle",
            nameGap: "40",
            type: 'category',
            axisLabel: {
                margin: '30',
                rotate: '45',
                interval: 0
            },
            splitArea: { //背景色的设置
                show: true,
                interval:0,
                areaStyle: {
                    color: ""
                }
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
            show: true,
            name: getLanguageValue("acVoltageAvg") + getUnit("acVoltageAvg"),
            nameLocation: "middle",
            nameGap: "50",
            type: 'value',

        }, {
            show: true,
            name: getLanguageValue("acCurrentDensity") + getUnit("acCurrentDensity"),
            nameLocation: "middle",
            nameGap: "50",
            type: 'value',
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
            name: getLanguageValue("acVoltageAvg"),
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
            name: getLanguageValue("acCurrentDensity"),
            type: 'line',
            yAxisIndex: 1,
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
        }]
    };


    option2 = {
        title: {
            text: getLanguageValue("potentialtoSoilCurve"),
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
        legend: [{
            top: "10%",
            orient: 'horizontal',
            data: [getLanguageValue("ONPotentialMax"),getLanguageValue("ONPotentialAvg"),getLanguageValue("ONPotentialMin")]
        },{
            top: "15%",
            orient: 'horizontal',
            data: [getLanguageValue("couponOFFPotentialMax"), getLanguageValue("couponOFFPotentialAvg"), getLanguageValue("couponOFFPotentialMin"),getLanguageValue("soilResistivity")]
        }],
        xAxis: [{
            nameLocation: "middle",
            nameGap: "40",
            type: 'category',
            axisLabel: {
                margin: '30',
                rotate: '45',
                interval: 0
            },
            splitArea: { //背景色的设置
                show: true,
                interval:0,
                areaStyle: {
                    color: ""
                }
            },
            axisTick: { // 轴标记
                show: false
            },
            data: "",
        }, {
            show: false,
            data: ""
        }],
        yAxis: [{
            name: getLanguageValue("PotentialText") + getUnit("PotentialText"),
            nameLocation: "middle",
            nameGap: "50",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        }, {
            name: getLanguageValue("soilResistivity") + getUnit("soilResistivity"),
            // name: "土壤电阻率(Ω•m)",
            nameLocation: "middle",
            nameGap: "50",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },],
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
            // name: "土壤电阻率",
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
            data: "",
        }, {
            name: getLanguageValue("ONPotentialMax"),
            // name: "试片通电电位最大值",
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#00E3E3',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#00E3E3'
                }
            },
            data: ""

        }, {
            name: getLanguageValue("ONPotentialAvg"),
            // name: "试片通电电位平均值",
            type: 'line',
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

        }, {
            name: getLanguageValue("ONPotentialMin"),
            // name: "试片通电电位最小值",
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#FF0000',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#FF0000'
                }
            },
            data: ""

        }, {
            name: getLanguageValue("couponOFFPotentialMax"),
            // name: "试片断电电位最大值",
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#FF44FF',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#FF44FF'
                }
            },
            data: ""

        }, {
            name: getLanguageValue("couponOFFPotentialAvg"),
            // name: "试片断电电位平均值",
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#800080',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#800080'
                }
            },
            data: "",
        }, {
            name: getLanguageValue("couponOFFPotentialMin"),
            // name: "试片断电电位最小值",
            type: 'line',
            lineStyle: {
                normal: {
                    color: '#2828FF',
                    width:1
                }
            },
            itemStyle: {
                normal: {
                    color: '#2828FF'
                }
            },
            data: ""

        }]
    };

    myChart1.setOption(option, true);
    myChart2.setOption(option2, true);
    window.addEventListener("resize", function () {
        myChart1.resize();
    });
    window.addEventListener("resize", function () {
        myChart2.resize();
    });
    myChart1.on('click', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("detailedData"),
            area: ['950px', '600px'],
            btn: [getLanguageValue("close_btn")],
            skin: 'self-iframe',
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/custom_task/view_custom_detectedData.html?detectMethod="+ detectMethod +"&id="+ option.xAxis[1].data[params.dataIndex] + "&templateId=" + templateId
        });
    })
    myChart2.on('click', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("detailedData"),
            area: ['950px', '600px'],
            btn: [getLanguageValue("close_btn")],
            skin: 'self-iframe',
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/custom_task/view_custom_detectedData.html?detectMethod="+ detectMethod +"&id="+ option2.xAxis[1].data[params.dataIndex] + "&templateId=" + templateId
        });
    });

    myChart1.on('datazoom',function (params) {
        var opt = myChart1.getOption();
        var index = opt.dataZoom[0];
        option.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color.slice(index.startValue);
        if(isNull(params.start)&&isNull(params.end)&&isNull(params.batch)){
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
    myChart2.on('datazoom',function (params) {
        var opt = myChart2.getOption();
        var index = opt.dataZoom[0];
        option2.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color.slice(index.startValue);
        if(isNull(params.end)&&isNull(params.start)&&isNull(params.batch)){
            myChart2.setOption(option2);
            return;        
        }
         if(!isNull(params.start)||!isNull(params.end)){    //平移
            option2.dataZoom[0].start = params.start<= 0 ? 0:params.start;
            option2.dataZoom[0].end = params.end>= 100?100:params.end;
            myChart2.setOption(option2);
        } else if(!isNull(params.batch[0].startValue)){    //区域放大
            option2.dataZoom[0].startValue = params.batch[0].startValue;
            option2.dataZoom[0].endValue = params.batch[0].endValue;
            myChart2.setOption(option2);
        } else{  //滑动滚动条
            option2.dataZoom[0].start = params.batch[0].start<=0?0:params.batch[0].start;
            option2.dataZoom[0].end = params.batch[0].end>=100?100:params.batch[0].end;
            myChart2.setOption(option2);
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
        success: function (res) {
            if (res.success == 1) {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查询曲线图', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (err) {

                }
                var detectdata = res.detectionDataBoList;
                if (detectdata.length > 0) {
                    var data_x = [];
                    var data_y_offPotentialOfCouponMax = [];
                    var data_y_offPotentialOfCouponMin = [];
                    var data_y_offPotentialOfCouponAvg = [];
                    var onPotentialOfMax = [];
                    var data_y_onPotentialOfMin = [];
                    var data_y_onPotentialOfAvg = [];
                    var data_y_avOfPlAvg = [];
                    var data_y_couponAcDensityAvg = [];
                    var map_x = [];
                    var map_y_soilResistivity = [];
                    var data_x_object = [];
                    data_analysisResultVal_color = [];
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);    //测试桩编号
                        
                        data_y_offPotentialOfCouponMax.push(detectdata[i].offPotentialOfCouponMax); //试片最大对地断电电位
                        data_y_offPotentialOfCouponMin.push(detectdata[i].offPotentialOfCouponMin); //试片最小对地断电电位
                        data_y_offPotentialOfCouponAvg.push(detectdata[i].offPotentialOfCouponAvg); //试片平均对地断电电位
                        data_y_onPotentialOfMin.push(detectdata[i].onPotentialOfMin); //最小电电位
                        data_y_onPotentialOfAvg.push(detectdata[i].onPotentialOfMax); //平均通电电位
                        onPotentialOfMax.push(detectdata[i].onPotentialOfMax); //通电电位
                        
                        data_y_couponAcDensityAvg.push(detectdata[i].couponAcDensityAvg); // 试片交流电流密度平均值
                        data_y_avOfPlAvg.push(detectdata[i].avOfPlAvg); //交流电压平均值
                        map_y_soilResistivity.push(detectdata[i].soilResistivity); //土壤电阻率
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
                    option.series[0].data = data_y_avOfPlAvg;
                    option.series[1].data = data_y_couponAcDensityAvg;

                    myChart1.setOption(option, true);
                    option2.xAxis[0].data = data_x
                    option2.xAxis[1].data = data_x_object
                    option2.series[0].data = map_y_soilResistivity;
                    option2.series[1].data = data_y_offPotentialOfCouponAvg;
                    option2.series[2].data = data_y_onPotentialOfAvg;
                    option2.series[3].data = onPotentialOfMax;
                    option2.series[4].data = data_y_onPotentialOfMin;
                    option2.series[5].data = data_y_offPotentialOfCouponMax;
                    option2.series[6].data = data_y_offPotentialOfCouponMin;
                    option2.xAxis[0].splitArea.areaStyle.color = data_analysisResultVal_color;

                    myChart2.setOption(option2, true);
                } else {

                    parent.layer.alert(getLanguageValue("noData"), {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                }
            } else {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查询曲线图', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (err) {

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
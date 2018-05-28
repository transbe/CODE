/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:m2的曲线图
 */
var objectId = getParameter("objectId");     //获取任务ID
var detectMethod = getParameter("detectMethod");    //获取检测方法
var taskName = decodeURI(getParameter("taskName")); //获取任务名称
var token = lsObj.getLocalStorage('token'); //获取token

$(function () {
    if (detectMethod == 1) {    //检测方法是1
        $('#graph_2').css('display', 'none')
        $.getScript("../../../js/task/specific_task/graph_m1.js");  //跳转到graph_m1.js
        return;
    } else if (detectMethod == 3 || detectMethod == 6) {    //检测方法是3或6
        $('#graph_2').css('display', 'none')
        $.getScript("../../../js/task/specific_task/graph_m3_m6.js");  //跳转到graph_m3_m6.js
        return;
    }
    queryPipeCheck();   //初始化下拉选（所属管线）;
    $("#pipeName").bind("change", function () {  //改变管线下拉框值触发事件
        var pipeNameID = $("#pipeName").val();
        if (pipeNameID != null) {
            queryMarkCheck(pipeNameID); //初始化起始桩下拉框的值
        }
    });
    initEcharts();    //初始化echarts 
    getDetectDataById(objectId);    //根据任务ID查询检测数据
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
                layer.msg("加载下拉选失败");
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
        },
        async: false,
        dataType: "json"
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
                if (detectdata.length > 0) {
                    var data_x = [];
                    var data_y_offPotentialOfCouponAvg = [];
                    var data_y_onPotentialOfCouponAvg = [];
                    var data_y_avOfPlAvg = [];
                    var data_y_couponAcDensityAvg = [];
                    var data_x_object = [];
                    var map_y_soilResistivity = [];
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);        //测试桩编号
                        data_y_offPotentialOfCouponAvg.push(detectdata[i].offPotentialOfCouponAvg); //试片平均对地断电电位
                        data_y_onPotentialOfCouponAvg.push(detectdata[i].onPotentialOfCouponAvg); //试片平均对地通电电位
                        data_y_couponAcDensityAvg.push(detectdata[i].couponAcDensityAvg); // 试片交流电流密度平均值
                        data_y_avOfPlAvg.push(detectdata[i].avOfPlAvg); //交流电压平均值
                        map_y_soilResistivity.push(detectdata[i].soilResistivity); //土壤电阻率
                        data_x_object.push(detectdata[i].objectId)  //测试桩ID
                    }

                    option.xAxis[0].data = data_x
                    option.xAxis[1].data = data_x_object
                    option.series[0].data = data_y_avOfPlAvg;
                    option.series[1].data = data_y_couponAcDensityAvg;
                    option.dataZoom[0].startValue = 0;  //设置echarts开始是0
                    option.dataZoom[0].endValue = 49;   //设置echarts结束是49  显示50个数据
                    if (data_x.length > 50) {
                        option.xAxis[0].axisLabel.interval = 1
                    }
                    myChart1.setOption(option, true);

                    option2.xAxis[0].data = data_x
                    option2.xAxis[1].data = data_x_object
                    option2.series[0].data = map_y_soilResistivity;
                    option2.series[1].data = data_y_onPotentialOfCouponAvg;
                    option2.series[2].data = data_y_offPotentialOfCouponAvg;
                    option2.dataZoom[0].startValue = 0;
                    option2.dataZoom[0].endValue = 49;
                    if (data_x.length > 50) {
                        option2.xAxis[0].axisLabel.interval = 1
                    }
                    myChart2.setOption(option2, true);
                }
            }
        },
    });
}


var myChart1;   //定义一个变量myChart1
var myChart2;   //定义一个变量myChart2
var option;   //定义一个变量option
var option2;   //定义一个变量option2

/**
 * @desc 初始化echarts
 * @method initEcharts
 */
function initEcharts() {
    myChart1 = echarts.init(document.getElementById('graph_1'));
    myChart2 = echarts.init(document.getElementById('graph_2'));
    option = {
        title: {
            text: '交流电压曲线图',
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

            data: ['交流电压平均值', '交流电流密度']
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
            name: "交流电压平均值(V)",
            nameLocation: "middle",
            nameGap: "40",
            type: 'value',

        }, {
            show: true,
            name: "交流电流密度(A/m²)",
            nameLocation: "middle",
            nameGap: "40",
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
            name: '交流电压平均值',
            type: 'line',
            data: "",
        }, {
            name: '交流电流密度',
            type: 'line',
            yAxisIndex: 1,
            data: "",
        }]
    };


    option2 = {
        title: {
            text: '阴保电位曲线图',
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
            data: ['土壤电阻率', '试片通电电位平均值', '试片断电电位平均值']
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
            axisTick: { // 轴标记
                show: false
            },
            data: "",
        }, {
            show: false,
            data: ""
        }],
        yAxis: [{
            name: "电位检测平均值(mV)",
            nameLocation: "middle",
            nameGap: "40",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        }, {
            name: "土壤电阻率(Ω•m)",
            nameLocation: "middle",
            nameGap: "40",
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
            name: '土壤电阻率',
            type: 'line',
            yAxisIndex: 1,
            data: "",
        }, {
            name: '试片断电电位平均值',
            type: 'line',
            data: "",
        }, {
            name: '试片通电电位平均值',
            type: 'line',
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
    myChart1.on('dblclick', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: '检测数据详情',
            area: ['950px', '600px'],
            btn: ['取消'],
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/specific_task/view_marker_m2.html?detectMethod=2&id="+ option.xAxis[1].data[params.dataIndex]
        });
    })
    myChart2.on('dblclick', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: '检测数据详情',
            area: ['950px', '600px'],
            btn: ['取消'],
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/specific_task/view_marker_m2.html?detectMethod=2&id="+ option2.xAxis[1].data[params.dataIndex]
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
        success: function (res) {
            if (res.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查询曲线图', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (err) {

                }
                var detectdata = res.detectionDataBoList;
                if (detectdata.length > 0) {
                    var data_x = [];
                    var data_y_offPotentialOfCouponAvg = [];
                    var data_y_onPotentialOfCouponAvg = [];
                    var data_y_avOfPlAvg = [];
                    var data_y_couponAcDensityAvg = [];
                    var map_x = [];
                    var map_y_soilResistivity = [];
                    var data_x_object = [];
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);    //测试桩编号
                        data_y_offPotentialOfCouponAvg.push(detectdata[i].offPotentialOfCouponAvg); //试片平均对地断电电位
                        data_y_onPotentialOfCouponAvg.push(detectdata[i].onPotentialOfCouponAvg); //试片平均对地通电电位
                        data_y_couponAcDensityAvg.push(detectdata[i].couponAcDensityAvg); // 试片交流电流密度平均值
                        data_y_avOfPlAvg.push(detectdata[i].avOfPlAvg); //交流电压平均值
                        map_y_soilResistivity.push(detectdata[i].soilResistivity); //土壤电阻率
                        data_x_object.push(detectdata[i].objectId)  //测试桩ID
                    }

                    option.xAxis[0].data = data_x
                    option.xAxis[1].data = data_x_object
                    option.series[0].data = data_y_avOfPlAvg;
                    option.series[1].data = data_y_couponAcDensityAvg;

                    myChart1.setOption(option, true);
                    option2.xAxis[0].data = data_x
                    option2.xAxis[1].data = data_x_object
                    option2.series[0].data = map_y_soilResistivity;
                    option2.series[1].data = data_y_onPotentialOfCouponAvg;
                    option2.series[2].data = data_y_offPotentialOfCouponAvg;

                    myChart2.setOption(option2, true);
                } else {

                    parent.layer.confirm("无测试数据", {
                        title: "提示",
                        btn: ['确定'], //按钮
                        skin: 'self'
                    });
                }
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查询曲线图', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (err) {

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
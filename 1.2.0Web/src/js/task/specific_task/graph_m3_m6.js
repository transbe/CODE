/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:m3和m6的曲线图
 */
var objectId = getParameter("objectId"); //获取任务id
var detectMethod = getParameter("detectMethod");    //获取检测方法
var taskName = decodeURI(getParameter("taskName")); //获取任务名称
var token = lsObj.getLocalStorage('token'); //获取token


var intervalNum = 0

$(function () {

    if (detectMethod == 3 || detectMethod == 6) {   //判断检测方法是否为3或者6
        queryPipeCheck();   //初始化下拉选（所属管线））；
        initEcharts();  //初始化echarts 
        getDetectDataById(objectId);  //根据任务ID查询检测数据
        $("#pipeName").bind("change", function () {  //改变管线下拉框值触发事件
            var pipeNameID = $("#pipeName").val();
            if (pipeNameID != null) {
                queryMarkCheck(pipeNameID);
            }
        });
    }
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
                layer.msg("加载下拉选失败", { skin: "self-success" });
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
        url: "/cloudlink-corrosionengineer/task/queryMarkList?flag=check&pipelineId=" + pipelineId + '&token=' + token+'&taskId='+objectId,
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
                var echartData = {};
                if (detectdata.length > 0) {
                    var data_x = [];
                    var data_x_object = [];
                    var data_y_onPotentialOfCouponAvg = [];
                    var data_y_offPotentialOfCouponAvg = [];
                    var data_y_soilResistivity = [];
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);    //测试桩编号
                        data_y_onPotentialOfCouponAvg.push(detectdata[i].onPotentialOfCouponAvg);   //试片通电电位平均值
                        data_y_offPotentialOfCouponAvg.push(detectdata[i].offPotentialOfCouponAvg); //试片断电电位平均值
                        data_y_soilResistivity.push(detectdata[i].soilResistivity); //土壤电阻率平均值
                        data_x_object.push(detectdata[i].objectId)  //测试桩ID
                    }
                    option.xAxis[0].data = data_x
                    option.xAxis[1].data = data_x_object
                    option.series[0].data = data_y_onPotentialOfCouponAvg;
                    option.series[1].data = data_y_offPotentialOfCouponAvg;
                    option.series[2].data = data_y_soilResistivity;
                    option.dataZoom[0].startValue = 0
                    option.dataZoom[0].endValue = 49
                    if (data_x.length > 50) {
                        option.xAxis[0].axisLabel.interval = 1
                    }
                    myChart1.setOption(option, true);
                }
            }
        }

    });
}
var myChart1;
var option;
/**
 * @desc 初始化echarts
 * @method initEcharts
 */
function initEcharts() {
    myChart1 = echarts.init(document.getElementById('graph_1'));
    var colors = ['#5793f3', '#d14a61', '#675bba'];
    option = {
        title: {
            text: '电位曲线图',
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
            data: ['试片通电电位平均值', '试片断电电位平均值', '土壤电阻率平均值']
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
            name: "试片电位平均值（mV）",
            nameLocation: "middle",
            nameGap: "45",
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
        },
        {
            name: "土壤电阻率平均值(Ω•m)",
            nameLocation: "middle",
            nameGap: "45",
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
            name: '试片通电电位平均值',
            type: 'line',
            xAxisIndex: 0,
            data: "",
        }, {
            name: '试片断电电位平均值',
            type: 'line',
            xAxisIndex: 0,
            data: "",
        },
        {
            name: '土壤电阻率平均值',
            type: 'line',
            yAxisIndex: 1,
            xAxisIndex: 0,
            data: "",
        }
        ],
    };

    if (option && typeof option === "object") {
        myChart1.setOption(option, true);
        window.addEventListener("resize", function () {
            myChart1.resize();
        });
    }
     myChart1.on('dblclick', function (params) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: '检测数据详情',
            area: ['950px', '600px'],
            btn: ['取消'],
            btn2: function (index, layero) { },
            content: getRootPath() + "/../src/html/task/specific_task/view_marker_m"+detectMethod+".html?detectMethod="+detectMethod+"&id="+ option.xAxis[1].data[params.dataIndex]
        });
    })
}

/**
 * @desc 查询曲线图
 * @method queryGraph
 */
function queryGraph() {
    var pipeline_id = $("#pipeName").val();
    var startMarkNum = $("#pipestartNumberName").val();
    var endMarkNum = $("#pipeendNumberName").val();
    if (endMarkNum - 0 < startMarkNum - 0) {
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
                    for (var i = 0; i < detectdata.length; i++) {
                        data_x.push(detectdata[i].markerNumber);
                        data_y_onPotentialOfCouponAvg.push(detectdata[i].onPotentialOfCouponAvg);
                        data_y_offPotentialOfCouponAvg.push(detectdata[i].offPotentialOfCouponAvg);
                        data_y_soilResistivity.push(detectdata[i].soilResistivity);
                        data_x_object.push(detectdata[i].objectId)

                    }
                    option.xAxis[0].data = data_x
                    option.xAxis[1].data = data_x_object
                    option.series[0].data = data_y_onPotentialOfCouponAvg;
                    option.series[1].data = data_y_offPotentialOfCouponAvg;
                    option.series[2].data = data_y_soilResistivity;

                    if (data_x.length > 50) {
                        option.xAxis[0].axisLabel.interval = 1
                    }
                    myChart1.setOption(option, true);
                } else {
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('查询曲线图', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                        }
                    } catch (error) {

                    }
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
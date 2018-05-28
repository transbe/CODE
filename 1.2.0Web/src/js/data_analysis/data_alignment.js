/**
 * @Author: liangyuanyuan
 * @Date: 2017-3-14
 * @Last Modified by: lizhenzhen
 * @Last Modified time: 2017-5-25
 * @func 数据对齐图页面的逻辑
 */

var option1, // 图1的配置项
    option2, // 图2的配置项
    myChart1, // 图1的实例化对象
    myChart2; // 图2的实例化对象
var pipeNameID, // 管线id
    pipestartNumberName, //起始桩号
    pipeendNumberName, //终止桩号
    year; // 所属年度
var avOfPlAvgArr = [], // 交流电压
    couponAcDensityAvy = [], //交流电流密度   
    onPotentialOfCouponAvg = [], // 通电电位
    offPotentialOfCouponAvg = [], // 断电电位
    soilResistivity = [], // 土壤电阻率
    xAxisData = [], // x轴线数据
    areaColorarr = [], // 图1的背景区域颜色
    areaColorarr2 = []; // 图2的背景区域颜色
var token = lsObj.getLocalStorage("token");

$(function() {
    getDataBoxH(); // 动态获取曲线图盒子的高度
    initGraph(); // 图表的配置
    getPipeline(); // 下拉菜单-所属管线
    // 根据所选管线，触发的时候选择 起始桩号--终止桩号
    $("#pipeName").bind("change", function() {
        var pipeNameID = $("#pipeName").val();
        if (pipeNameID != null) {
            queryMarkChecked(pipeNameID);
        }
    });
    // 时间插件
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4,
        pickTime: false,
    });
});

/*
 * 动态获取曲线图盒子的高度
 */
function getDataBoxH() {
    var winH = $(window).height();
    var dataBoxPd = parseInt($(".data-box").css("paddingTop"));
    var searchH = $(".search-box").outerHeight();
    var searchMgBtm = parseInt($(".search-box").css("marginBottom"));
    var graphH = winH - (searchH + searchMgBtm + dataBoxPd * 2);
    $(".data-analysis").css({ height: graphH + "px" });
    var dataGraph = parseInt($(".data-analysis").css("paddingTop"));
    var graphBoxH = (graphH - dataGraph * 2) / 2;
    var graphTwoMgTop = -parseInt($(".graph-two").css("marginTop"));
    $(".graph").css({ height: graphBoxH + graphTwoMgTop / 2 + "px" });
}

/*
 *获取所属管线--下拉框
 */
function getPipeline() {
    $.ajax({
        url: handleURL("/cloudlink-corrosionengineer/task/getPipeline?token=" + token + "&detectMethod=0"),
        dataType: "json",
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                var data = result.dataList;
                var options = '<option value="">请选择</option>';
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].id + '">' + data[i].text + '</option>';
                }
                var mySelectId = document.getElementById("pipeName");
                if (mySelectId.options.length == 0) {
                    $("#pipeName").html(options);
                    //   $("#pipeName").selectpicker('refresh');
                }
            } else {
                parent.layer.msg("加载下拉选失败");
            }

        }
    });
}

/*
 *根据选择的管线  加载桩号
 */
function queryMarkChecked(pipelineId) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryMarkList?flag=check&pipelineId=" + pipelineId + "&token=" + token,
        dataType: "json",
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                var data = result.markList;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#pipestartNumberName").html(options);
                $("#pipestartNumberName").selectpicker('refresh');
                $("#pipeendNumberName").html(options);
                $("#pipeendNumberName").selectpicker('refresh');
            }
        }
    });
}

/*
 *根据查询条件重新加载数据，图表信息
 */
function querylist() {
    avOfPlAvgArr = [];
    couponAcDensityAvy = [];
    onPotentialOfCouponAvg = [];
    offPotentialOfCouponAvg = [];
    soilResistivity = [];
    xAxisData = [];
    areaColorarr = [];
    areaColorarr2 = [];
    var pipeline_id = $("#pipeName").val(); // 管线id
    var startMarkNum = $("#pipestartNumberName").val() - 0; // 起始桩号
    var endMarkNum = $("#pipeendNumberName").val() - 0; // 终止桩号
    var year = $("#year").val() - 0; // 所属年度
    //判断起始桩号是否大于终止桩号
    if (endMarkNum < startMarkNum) {
        parent.layer.confirm("起始桩号不能大于终止桩号", {
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return;
    }
    if (pipeline_id != null && pipeline_id != "" && startMarkNum != null && startMarkNum != "" && endMarkNum != null && endMarkNum != "" && year != null && year != "") {
        $.ajax({
            url: "/cloudlink-corrosionengineer/dataalign/query?token=" + token + "&pipeline=" + pipeline_id + "&startMarker=" + startMarkNum + "&endMarker=" + endMarkNum + "&year=" + year,
            dataType: "json",
            type: "get",
            async: false,
            success: function(result) {
                if (result.success == 1) {
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('数据对齐查询', { '结果': '成功' });
                        }
                    } catch (e) {

                    }

                    console.log(result);
                    var data = result.alignDataList;
                    console.log(data);
                    areaColorarr = data[data.length - 1].color;
                    areaColorarr2 = data[data.length - 1].color;
                    for (var i in data) {
                        avOfPlAvgArr.push(data[i].avOfPlAvg);
                        couponAcDensityAvy.push(data[i].couponAcDensityAvg);
                        onPotentialOfCouponAvg.push(data[i].onPotentialOfCouponAvg);
                        offPotentialOfCouponAvg.push(data[i].offPotentialOfCouponAvg);
                        soilResistivity.push(data[i].soilResistivity);
                        xAxisData.push(data[i].markerNumber);
                    }
                    drawGraph();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('数据对齐查询', {
                            '结果': '失败'
                        });
                    }
                } catch (e) {}
            }
        });
    } else {
        parent.layer.confirm("请输入所有查询条件", {
            btn: ['确定'], //按钮
            skin: 'self'
        });
    }

}


/*
 *图表的配置
 */
function initGraph() {
    myChart1 = echarts.init(document.getElementById('main1'));
    myChart2 = echarts.init(document.getElementById('main2'));
    option1 = {
        legend: {
            // x: 'right',
            right: "3%",
            data: ['交流电压', '交流电流密度', '通电电位', '断电电位', '土壤电阻率']
        },
        tooltip: {
            trigger: 'axis',
        },
        toolbox: {
            x: 15,
            y: -5,
            feature: {
                saveAsImage: {
                    show: true,
                }
            }
        },
        xAxis: [{
            type: 'category', //x轴为类目类型
            axisLine: {
                show: false,
            },
            axisTick: { //去掉刻度
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitArea: { //背景色的设置
                show: true,
                areaStyle: {
                    color: areaColorarr
                }
            },
            data: xAxisData,
        }],
        yAxis: [{
                type: 'value',
                name: "交流电压(V)",
                nameLocation: "middle",
                nameGap: "50",
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            {
                type: 'value',
                name: "交流电流密度(A/m²)",
                nameLocation: "middle",
                nameGap: "50",
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
            }
        ],
        series: [{
                name: '交流电压',
                type: 'line',
                data: '',
                lineStyle: {
                    color: '#ff9e25'
                },
                itemStyle: {
                    normal: {
                        color: '#ff9e25',
                    },
                },
                markLine: {
                    label: {
                        normal: {
                            position: "middle"
                        },
                        emphasis: {
                            position: "middle",
                        }
                    },
                    data: [{
                        name: 'Y 轴值为 3 的水平线', //参考线
                        yAxis: 3,
                        lineStyle: {
                            normal: {
                                color: 'red'
                            }
                        },
                    }, ]
                }
            },
            {
                name: '交流电流密度',
                type: 'line',
                data: '',
                yAxisIndex: 1,
                lineStyle: {
                    color: '#5e77c8'
                },
                itemStyle: {
                    normal: {
                        color: '#5e77c8'
                    }
                }
            },
        ],
    };
    option2 = {
        legend: {
            // x: 'right',
            right: "3%",
            y: 20,
            data: ['通电电位', '断电电位', '土壤电阻率']
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: false
                }
            }
        },
        xAxis: [{
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: { //去掉刻度
                show: false
            },
            axisLabel: {
                //x轴倾斜
                rotate: '45',
            },
            splitArea: { //背景色的设置
                show: true,
                areaStyle: {
                    color: areaColorarr2
                }
            },
            data: xAxisData,

        }],
        yAxis: [{
                type: 'value',
                name: "通断电电位(mV)",
                nameLocation: "middle",
                nameGap: "50",
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
            },
            {
                type: 'value',
                name: "土壤电阻率(Ω•m)",
                nameLocation: "middle",
                nameGap: "50",
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
            },
        ],
        series: [{
                name: '通电电位',
                type: 'line',
                data: '',
                lineStyle: {
                    color: '#c93a36'
                },
                itemStyle: {
                    normal: {
                        color: '#c93a36'
                    }
                },
                markLine: {
                    label: {
                        normal: {
                            position: "middle"
                        },
                        emphasis: {
                            position: "middle",
                        }
                    },
                    data: [{
                        name: 'Y 轴值为 -850的水平线', //参考线
                        yAxis: -850,
                        lineStyle: {
                            normal: {
                                color: 'red'
                            }
                        },
                    }, ]
                }
            },
            {
                name: '断电电位',
                type: 'line',
                data: '',
                lineStyle: {
                    color: '#3b4b5a'
                },
                itemStyle: {
                    normal: {
                        color: '#3b4b5a'
                    }
                }
            },
            {
                name: '土壤电阻率',
                type: 'line',
                data: '',
                yAxisIndex: 1,
                lineStyle: {
                    color: '#a8adb2'
                },
                itemStyle: {
                    normal: {
                        color: '#a8adb2'
                    }
                },
            }
        ]
    };
    // 为echarts对象加载数据
    window.addEventListener("resize", function() {
        getDataBoxH();
        myChart1.resize();
        myChart2.resize();
    });
    myChart1.setOption(option1, true);
    myChart2.setOption(option2, true);
    //联动配置
    echarts.connect([myChart1, myChart2]);
}

/*
 *画图表
 */
function drawGraph() {
    if (option1 && typeof option1 === "object") {
        option1.series[0].data = avOfPlAvgArr; // 交流电压
        option1.series[1].data = couponAcDensityAvy; //交流电流密度       
        option1.xAxis[0].splitArea.areaStyle.color = areaColorarr;
        option1.xAxis[0].data = xAxisData;
        myChart1.setOption(option1, true);
    }
    if (option2 && typeof option2 === "object") {
        option2.series[0].data = onPotentialOfCouponAvg; // 通电电位
        option2.series[1].data = offPotentialOfCouponAvg; // 断电电位
        option2.series[2].data = soilResistivity; // 土壤电阻率
        option2.xAxis[0].splitArea.areaStyle.color = areaColorarr2;
        option2.xAxis[0].data = xAxisData;
        myChart2.setOption(option2, true);
    }
}

/*
 *重置form表单
 */
function clearForm() {
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
    $('.selectpicker').selectpicker('val', null);
    avOfPlAvgArr = [];
    couponAcDensityAvy = [];
    onPotentialOfCouponAvg = [];
    offPotentialOfCouponAvg = [];
    soilResistivity = [];
    xAxisData = [];
    areaColorarr = [];
    areaColorarr2 = [];
    drawGraph();
}
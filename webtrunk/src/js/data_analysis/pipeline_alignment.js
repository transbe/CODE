/**
 * @file
 * @author  liangyuanyuan
 * @desc 数据对齐
 * @date  2017-3-14 16:00:27
 * @last modified by lizhenzhen
 * @last modified time  2017-06-26 19:14:09
 */

var option1, // 图1的配置项
    option2, // 图2的配置项
    option3, // 设备图表配置项
    option4, // 设备图表配置项
    myChart1, // 图1的实例化对象
    myChart2, // 图2的实例化对象
    myChart3, // 设备图表对象
    myChart4; // 设备图表对象


var avOfPlAvgArr = [], // 交流电压
    couponAcDensityAvy = [], //交流电流密度   
    onPotentialOfCouponAvg = [], // 通电电位
    offPotentialOfCouponAvg = [], // 断电电位
    soilResistivity = [], // 土壤电阻率
    xAxisData = [], // x轴线数据
    areaColorarr = [], // 图1的背景区域颜色
    areaColorarr2 = []; // 图2的背景区域颜色

var markerId = []; //测试桩ID
var token = lsObj.getLocalStorage("token"); // 获取token
var DataLength = 0; // 存储查询取得数据
var dataList = {}; // 存储设备数据
var Arr = []; // 存储绝缘装置

$(function() {

    changePageStyle("../.."); // 换肤
    // firstLogin(); // 判断是否是第一次登陆，第一次展示向导
    // getDataBoxH(); // 动态获取曲线图盒子的高度
    initGraph(); // 图表的配置
    getPipeline(); // 下拉菜单-所属管线
    // 根据所选管线，触发的时候选择 起始桩号--终止桩号
    // $("#pipeName").bind("change", function() {
    //     var pipeNameID = $("#pipeName").val();
    //     if (pipeNameID != null) {
    //         queryMarkChecked(pipeNameID);
    //     }
    // });
    $("#pipeName").bind("change", function () {  //改变管线下拉框值触发事件
        var pipeNameID = $("#pipeName").val();
        if (!isNull(pipeNameID)) {
            queryMarkChecked(pipeNameID); //初始化起始桩下拉框的值
        }
    });
    $("#pipestartNumberName").bind("change",function(){         // 选择起始桩号
        $('#pipeendNumberName').selectpicker('val', 0);//默认选中
        $("#pipeendNumberName").selectpicker('refresh');
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


/**
 *  @desc 动态获取曲线图盒子的高度
 */
function getDataBoxH() {
    var winH = $(window).height(),
        dataBoxPd = parseInt($(".data-box").css("paddingTop")),
        searchH = $(".search-box").outerHeight(),
        searchMgBtm = parseInt($(".search-box").css("marginBottom"));
    var graphH = winH - (searchH + searchMgBtm + dataBoxPd * 2) - 10;
    $(".data-analysis").css({ height: graphH + "px" });
    var dataGraph = parseInt($(".data-analysis").css("paddingTop"));
    var graphThreeH = parseInt($(".graph-three").outerHeight());
    var graphTwoMgTop = -parseInt($(".graph-two").css("marginTop"));

    var graphBoxH = (graphH - dataGraph * 2 - graphThreeH + graphTwoMgTop) / 2;
    $(".graph-one,.graph-two").css({
        height: graphBoxH + "px"
    });
}

/**
 * @desc 获取所属管线--下拉框
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
                var options = '<option value="">'+getLanguageValue("load.option.select")+'</option>';
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].id + '">' + data[i].text + '</option>';
                }
                var mySelectId = document.getElementById("pipeName");
                if (mySelectId.options.length == 0) {
                    $("#pipeName").html(options);
                    //   $("#pipeName").selectpicker('refresh');
                }
            } else {
                parent.layer.alert(getLanguageValue("load.option.fail"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(SELECT_ERROR_MSG, {
                title:  getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 根据选择的管线  加载桩号
 * @param {*} pipelineId 
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
                var options = '<option value="">'+getLanguageValue("load.option.select")+'</option>';
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#pipestartNumberName").html(options);
                $("#pipestartNumberName").selectpicker('refresh');
                $("#pipeendNumberName").html(options);
                $("#pipeendNumberName").selectpicker('refresh');
            } else {
                layer.alert(getLanguageValue("load.option.fail"), {
                    title:  getLanguageValue("tip"),
                    skin: "self-alert"
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title:  getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }

    });
}

/**
 * @desc 根据查询条件重新加载数据，图表信息
 */
var pipeline_id = "";
var pipeline_name = "";
function querylist() {
    avOfPlAvgArr = [];
    couponAcDensityAvy = [];
    onPotentialOfCouponAvg = [];
    offPotentialOfCouponAvg = [];
    soilResistivity = [];
    xAxisData = [];
    areaColorarr = [];
    areaColorarr2 = [];
    Arr = [];

    pipeline_id = $("#pipeName").val(); // 管线id
    pipeline_name = $("#pipeName option:selected").text();  
    var startMarkNum = $("#pipestartNumberName").val() - 0; // 起始桩号
    var endMarkNum = $("#pipeendNumberName").val() - 0; // 终止桩号
    var year = $("#year").val() - 0; // 所属年度

    //判断起始桩号是否大于终止桩号
    if (endMarkNum < startMarkNum) {
        parent.layer.confirm(getLanguageValue("tip.startLessEnd"), {
            title:  getLanguageValue("tip"),
            btn: [getLanguageValue("ok")], //按钮
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
                        if (tjSwitch == 1) {
                            tjSdk.track('数据对齐查询', { '结果': '成功' });
                        }
                    } catch (e) {}
                    // console.log(result);
                    var data = result.alignDataList;
                    areaColorarr = data[data.length - 1].color;
                    areaColorarr2 = data[data.length - 1].color;
                    // console.log(areaColorarr);
                    var resultData = data.splice(data.length - 1, 1); // 删除背景颜色项

                    for (var i in data) {
                        avOfPlAvgArr.push(data[i].avOfPlAvg); // 交流电压平均值
                        couponAcDensityAvy.push(data[i].couponAcDensityAvg); // //交流电流密度平均值
                        onPotentialOfCouponAvg.push(data[i].onPotentialOfCouponAvg);  //通电电位平均值
                        offPotentialOfCouponAvg.push(data[i].offPotentialOfCouponAvg); //断电电位平均值
                        soilResistivity.push(data[i].soilResistivity); // 土壤电阻率

                        xAxisData.push(data[i].markerNumber);
                        markerId.push(data[i].markerId);
                    }
                    
                    // avOfPlAvgArr = [4,7,3,8,1,6,2];
                    // couponAcDensityAvy = [1,1,1,1,1,1,1];
                    // onPotentialOfCouponAvg = [2,3,2,1,3,4,1];
                    // offPotentialOfCouponAvg = [5,2,6,2,4,1,7];
                    // soilResistivity = [4,1,5,1,5,1,2];
                    // xAxisData = ["001","002","003","004","005","006","007"]

                    getConnectEquipmentInfo(pipeline_id, startMarkNum, endMarkNum, year); // 获取桩关联的设备信息,
                    drawGraph();
                } else {
                    layer.alert(getLanguageValue("load.option.fail"), {
                        title:  getLanguageValue("tip"),
                        skin: "self-alert"
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('数据对齐查询', {
                            '结果': '失败'
                        });
                    }
                } catch (e) {}
                layer.alert(NET_ERROR_MSG, {
                    title:  getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        });

    } else {
        parent.layer.confirm(getLanguageValue("tip.condition"), {
            btn: [getLanguageValue("ok")], //按钮
            skin: 'self'
        });
    }

}


/**
 * @desc 图表的配置
 */
function initGraph() {
    myChart1 = echarts.init(document.getElementById('main1'));
    myChart2 = echarts.init(document.getElementById('main2'));
    myChart3 = echarts.init(document.getElementById('main3'));
    option1 = {
        legend: {
            right: "3%",
            top:10,
            padding:0,
            itemGap:5,
            data: [getLanguageValue("field.AC"), getLanguageValue("field.AC.density"), getLanguageValue("field.on.potential"), getLanguageValue("field.off.potential"), getLanguageValue("field.soil")]
        },
        grid:{
            top:35,
            bottom:10,
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params, ticket, callback) {
                if(params instanceof Array){
                    var res ='';
                    res = params[0].name+"</br>" ;
                
                    for (var i = 0, l = params.length; i < l; i++) {
                        if (typeof(params[i].value) != 'undefined') {
                            res += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName+":"+params[i].value+'<br/>';
                        }
                    }
                    setTimeout(function() {
                        // 异步回调
                        callback(ticket, res);
                    }, 10)
                }
            }
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
            // axisLine: {
            //     show: false,
            // },
            axisTick: { //去掉刻度
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitArea: { //背景色的设置
                show: true,
                interval:0,
                areaStyle: {
                    color: areaColorarr
                }
            },
            data: xAxisData,
        }, {
            show: false,
            data: ""
        }],
        yAxis: [{
                type: 'value',
                name: getLanguageValue("field.AC") + getUnit("avOfPlAvg"),
                nameLocation: "middle",
                nameGap: "50",
                // axisLine: {
                //     lineStyle: {
                //         color: '#999'
                //     }
                // }
            },
            {
                type: 'value',
                name: getLanguageValue("field.AC.density") + getUnit("couponAcDensityAvg"),
                nameLocation: "middle",
                nameGap: "50",
            }
        ],
        series: [{
                name: getLanguageValue("field.AC"),
                type: 'line',
                data: '',
                lineStyle: {
                     normal: {
                        color: '#ff9e25',
                        width:1
                     }
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
                name: getLanguageValue("field.AC.density"),
                type: 'line',
                data: '',
                yAxisIndex: 1,
                lineStyle: {
                     normal: {
                        color: '#5e77c8',
                        width:1
                     }
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
            right: "3%",
            y: 20,
            top:10,
            padding:0,
            itemGap:5,
            data: [getLanguageValue('field.on.potential'), getLanguageValue('field.off.potential'), getLanguageValue('field.soil')]
        },
        grid:{
            top:35,
            bottom:10,
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params, ticket, callback) {
                if(params instanceof Array){
                    var res ='';
                    res = params[0].name+"</br>" ;
                    for (var i = 0, l = params.length; i < l; i++) {
                        if (typeof(params[i].value) != 'undefined') {
                            res += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName+":"+params[i].value+'<br/>';
                        }
                    }
                    setTimeout(function() {
                        // 异步回调
                        callback(ticket, res);
                    }, 10)
                }
            }
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
            axisTick: { //去掉刻度
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitArea: { //背景色的设置
                show: true,
                interval:0,
                areaStyle: {
                    color: areaColorarr2
                }
            },
            data: xAxisData,

        }, {
            show: false,
            data: ""
        }],
        yAxis: [{
                type: 'value',
                name: getLanguageValue('field.on.potential') + getUnit("onPotentialOfCouponAvg"),
                nameLocation: "middle",
                nameGap: "50",
            },
            {
                type: 'value',
                name: getLanguageValue('field.soil') + getUnit("soilResistivity"),
                nameLocation: "middle",
                nameGap: "50",
            },
        ],
        series: [{
                name: getLanguageValue('field.on.potential'),
                type: 'line',
                data: '',
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
                name: getLanguageValue('field.off.potential'),
                type: 'line',
                data: '',
                lineStyle: {
                     normal: {
                        color: '#3b4b5a',
                        width:1
                     }
                },
                itemStyle: {
                    normal: {
                        color: '#3b4b5a'
                    }
                }
            },
            {
                name: getLanguageValue('field.soil'),
                data: '',
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
        ]
    };
    option3 = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params, ticket, callback) {
                if(params.length>0){
                    var res ="";
                    var markline = "";
                    params.reverse();
                    for (var i = 0, l = params.length; i < l; i++) {
                        if (!isNull(params[i].value) && params[i].data.deviceName) {
                            markline = params[i].name+'</br>';
                            res += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName+":"+params[i].data.deviceName+'<br/>';
                        }
                        if (!isNull(params[i].value) && isNull(params[i].data.deviceName)) {
                             markline = params[i].name+'</br>';
                             res += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName+'<br/>';
                        }
                    }
                    setTimeout(function() {
                        // 异步回调
                        callback(ticket, markline+res);
                    }, 10)
                }
            }
        },
        grid:{
            top:35,
        },
        xAxis: {
            type: "category",
            axisTick: { //去掉刻度
                show: false
            },
            axisLabel: {
                //x轴倾斜
                rotate: '45',
            },
            data:""
        },
        yAxis: [{
            type: "category",
            boundaryGap : false,
            // axisTick: {
            //     show: false
            // },
            splitLine:{
                show:false
            },
            interval:0,
            data: ["",getLanguageValue("isSubwayParallel"),getLanguageValue("field.jiaochapingxing"),getLanguageValue("isHighVoltageCorridor"), getLanguageValue("isHighConsequenceArea"),getLanguageValue("field.zhanchang")+"/"+getLanguageValue("field.fashi"), getLanguageValue("field.jueyuanzhuangzhi"),getLanguageValue("field.hengdianweiyi"),getLanguageValue("field.dingxiangzuan"),getLanguageValue("field.pailiu"),getLanguageValue("field.taoguan"), getLanguageValue("field.jiakong")]
        },{
              type: "value",
              min: 0,
              max: 8,
              interval:0,
              axisTick: {
                show: false
              },
              splitLine:{
                show:false
              },
              axisLabel: {
                show: false
              }
        }],
        series: [
            {
                name:getLanguageValue("isSubwayParallel"),
                data:  '',
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '50%'],
                symbol: "image://../../images/data_analysis/subway.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.jiaochapingxing"),
                data:"",
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '90%'],
                symbol: "image://../../images/data_analysis/jiaochapingxing.png",
                symbolSize: 20,
            },{
                name:getLanguageValue("isHighVoltageCorridor"),
                data:  '',
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '110%'],
                symbol: "image://../../images/data_analysis/gaoyazoulang.png",
                symbolSize: 20,
            },{
                name:getLanguageValue("isHighConsequenceArea"),
                data:  '',
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '140%'],
                symbol: "image://../../images/data_analysis/hightResult.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.zhanchang"),
                data: "",
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '185%'],
                zlevel:3,
                symbol: "image://../../images/data_analysis/zhanchang.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.fashi"),
                data: "",
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '185%'],
                zlevel:4,
                symbol: "image://../../images/data_analysis/fashi.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.jueyuanzhuangzhi"),
                data:"",
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '230%'],
                zlevel:7,
                symbol: "image://../../images/data_analysis/nofalan.png",
                symbolSize:20,
            },
            {
                name: getLanguageValue("field.jueyuanzhuangzhi"),
                data:"",
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '230%'],
                zlevel:4,
                symbol: "image://../../images/data_analysis/nofalan.png",
                symbolSize:20,
            },{
                name: getLanguageValue("field.jueyuanzhuangzhi"),
                yAxisIndex:1,
                //   data:[null,null,1,null,null],
                data:"",
                type: 'scatter',
                symbolOffset:[0, '230%'],
                zlevel:5,
                symbol: "image://../../images/data_analysis/nofalan.png",
                symbolSize:20,
            },{
                name: getLanguageValue("field.jueyuanzhuangzhi"),
                // data:"[null,null,null,1,1]",
                data:"",
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '230%'],
                zlevel:6,
                symbol: "image://../../images/data_analysis/nofalan.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.hengdianweiyi"),
                data: "",
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '260%'],
                symbol: "image://../../images/data_analysis/hengdianweiyi.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.dingxiangzuan"),
                data:'',
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '290%'],
                symbol: "image://../../images/data_analysis/dingxiangzhuan.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.pailiu"),
                data: "",
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '320%'],
                symbol: "image://../../images/data_analysis/pailiu.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.taoguan"),
                data: '',
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '350%'],
                symbol: "image://../../images/data_analysis/taoguan.png",
                symbolSize: 20,
            },{
                name: getLanguageValue("field.jiakong"),
                data:  '',
                yAxisIndex:1,
                type: 'scatter',
                symbolOffset:[0, '380%'],
                symbol: "image://../../images/data_analysis/jiakong.png",
                symbolSize: 20,
            }
        ]
    };
    // 为echarts对象加载数据
    window.addEventListener("resize", function() {
        myChart1.resize();
        myChart2.resize();
        myChart3.resize();
    });
    myChart1.setOption(option1, true);
    myChart2.setOption(option2, true);
    myChart3.setOption(option3, true);

    //联动配置
    echarts.connect([myChart1, myChart2, myChart3]);
    myChart1.on('click', function(params) {
        if (params.name == "Y 轴值为 3 的水平线") {
            return;
        }
        var dataUrl = "src/html/data_analysis/marker_history.html";
        var realDataUrl = "src/html/data_analysis/marker_history.html?markerId=" + option1.xAxis[1].data[params.dataIndex] + "&pipelineId=" + pipeline_id +'&pipelineName=' + encodeURI(pipeline_name) + '&markerName=' + encodeURI(params.name);
        var menuName = getLanguageValue("field.history");
        var dataIndex = "62";
        parent.showMenuPage(dataUrl, realDataUrl, menuName, dataIndex);
    })
    myChart2.on('click', function(params) {
        var dataUrl = "src/html/data_analysis/marker_history.html";
        var realDataUrl = "src/html/data_analysis/marker_history.html?markerId=" + option1.xAxis[1].data[params.dataIndex] + "&pipelineId=" + pipeline_id +'&pipelineName=' + encodeURI(pipeline_name) + '&markerName=' + encodeURI(params.name);
        var menuName = getLanguageValue("field.history");
        var dataIndex = "62";
        parent.showMenuPage(dataUrl, realDataUrl, menuName, dataIndex);
    })
    myChart3.on('click', function(params) {
        var dataUrl = "src/html/data_analysis/marker_history.html";
        var realDataUrl = "src/html/data_analysis/marker_history.html?markerId=" + option1.xAxis[1].data[params.dataIndex] + "&pipelineId=" + pipeline_id +'&pipelineName=' + encodeURI(pipeline_name) + '&markerName=' + encodeURI(params.name);
        var menuName = getLanguageValue("field.history");
        var dataIndex = "62";
        parent.showMenuPage(dataUrl, realDataUrl, menuName, dataIndex);
    })
}

/**
 * @desc 获取关联的设备信息
 */
function getConnectEquipmentInfo(pipelineId, startMarkNum, endMarkNum, year) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/dataalign/getCpSegmentDeviceForMarker?token=" + token + "&pipeId=" + pipelineId + "&startMarker=" + startMarkNum + "&endMarker=" + endMarkNum,
        dataType: "json",
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                dataList = {}; // 每次清空对象
                dataList = result.dataList;
                drawEquipmentGraph(dataList);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title:  getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 画图表
 */
function drawGraph() {
    if (option1 && typeof option1 === "object") {
        option1.series[0].data = avOfPlAvgArr; // 交流电压
        option1.series[1].data = couponAcDensityAvy; //交流电流密度       
        option1.xAxis[0].splitArea.areaStyle.color = areaColorarr;
        option1.xAxis[0].data = xAxisData;
        option1.xAxis[1].data = markerId;
        myChart1.setOption(option1, true);
    }
    if (option2 && typeof option2 === "object") {
        option2.series[0].data = onPotentialOfCouponAvg; // 通电电位
        option2.series[1].data = offPotentialOfCouponAvg; // 断电电位
        option2.series[2].data = soilResistivity; // 土壤电阻率
        option2.xAxis[0].splitArea.areaStyle.color = areaColorarr2;
        option2.xAxis[0].data = xAxisData;
        option2.xAxis[1].data = markerId;
        myChart2.setOption(option2, true);
    }
}

/**
 * @desc 画设备图表
 */
function drawEquipmentGraph(result) {
    // result = {
    //         "subwayParallel":[{"markerNumber":"001","value":1},null,null,null,null,null,null],// 地铁平行/交叉      1
    //         "crossParallelArea":[{"markerNumber":"001","value":2},null,null,null,null,null,null],//  管道交叉平行   2 
    //         "highVoltageCorridor":[{"markerNumber":"001","value":3},null,null,null,null,null,null], //  高压走廊     3
    //         "hightConsequenceArea":[{"markerNumber":"001","value":4},null,null,null,null,null,null],// 高后果区     4
    //         "station":[{"markerNumber":"001","value":5},null,null,null,null,null,null],  // 战场 5
    //         "valve":[{"markerNumber":"zyax1254","type":"FACILITY_VALVE","deviceName":"1","value":5},null,null,null,null,null,null], // 阀室 5
           
    //         "protection":[{"markerNumber":"001","value":6},null,null,null,null,null,null], // 有保护装置绝缘接头     6
    //         "spd":[{"markerNumber":"001","value":6},null,null,null,null,null,null], // 有保护装置绝缘接头     6
    //         "fikwithspd":[{"markerNumber":"001","value":6},null,null,null,null,null,null], // 有保护装置绝缘接头     6
    //         "fikwithoutspd":[{"markerNumber":"001","value":6},null,null,null,null,null,null], // 有保护装置绝缘接头     6

    //         "rectifier":[{"markerNumber":"001","value":7},,null,null,null,null,null,null,null],
    //         "directionalDrilling":[{"markerNumber":"zyax1243","value":8},null,null,null,null,null,null], 
    //         "drainageAnode":[{"markerNumber":"zyax1232","value":9},null,null,null,null,null,null],
    //         "drivePipe":[{"markerNumber":"zyax1232","value":10},null,null,null,null,null,null],
    //         "abovegroundpl":[{"markerNumber":"zyax1232","value":11},null,null,null,null,null,null]
    //     }
    if (option3 && typeof option3 === "object") {
        option3.xAxis.data = xAxisData;
        option3.series[0].data = result.subwayParallel; // 地铁平行/交叉      1
        option3.series[1].data = result.crossParallelArea; //  管道交叉平行   2  
        option3.series[2].data = result.highVoltageCorridor; //  高压走廊     3
        option3.series[3].data = result.hightConsequenceArea; // 高后果区     4

        option3.series[4].data = result.station; // 战场           5
        option3.series[5].data = result.valve; // 阀室             5

        option3.series[6].data = result.protection;  // 有保护装置绝缘接头     6
        option3.series[7].data = result.spd;  // 无保护装置绝缘接头            6
        option3.series[8].data = result.fikwithspd;  // 有保护装置绝缘法兰     6
        option3.series[9].data = result.fikwithoutspd; // 无保护装置绝缘法兰   6

        option3.series[10].data = result.rectifier; //恒电位移              7
        option3.series[11].data = result.directionalDrilling; // 定向钻     8
         
        option3.series[12].data = result.drainageAnode; //排流1         9
        option3.series[13].data = result.drivePipe; // 套管             10
        option3.series[14].data = result.abovegroundpl; // 架空        11
        
       

        myChart3.setOption(option3, true);
    }
}

/**
 * @desc 重置form表单
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
    $("#system").empty();
    $("#environment").empty();
    $("#system").append("<hr/>");
    $("#environment").append("<hr/>");
    drawGraph();
    dataList = {}; // 清空对象
    Arr = []; // 存储绝缘装置
    drawEquipmentGraph(dataList);
}
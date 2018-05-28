/**
 * @file
 * @author  lixiaolong
 * @desc 数据对齐
 * @date  2017-3-14 16:00:27
 * @last modified by lizhenzhen
 * @last modified time  2017-06-26 19:14:09
 * @last modified by lixiaolong 
 * @last modified time  2017年7月20日 13:48:09
 */
var tableId = "";        //table容器的Id
var repairParames = {};
var option1, // 图1的配置项
    option2, // 图2的配置项
    option3, // 设备图表配置项
    option4, // 设备图表配置项
    myChart1, // 图1的实例化对象
    myChart2, // 图2的实例化对象
    //myChart3, // 设备图表对象
    myChart4; // 设备图表对象

    Xindex = 0; //给echart图表分区域（点击时用到）

var avOfPlAvgArr = [], // 交流电压
    couponAcDensityAvy = [], //交流电流密度   
    onPotentialOfCouponAvg = [], // 通电电位
    offPotentialOfCouponAvg = [], // 断电电位
    soilResistivity = [], // 土壤电阻率
    xAxisData = [], // x轴线数据
    //xAxisDataPosition = [], // x轴线数据
    areaColorarr = [], // 图1的背景区域颜色
    areaColorarr2 = []; // 图2的背景区域颜色

var markerIds = []; //测试桩ID
var token = lsObj.getLocalStorage("token"); // 获取token
var DataLength = 0; // 存储查询取得数据
var userBo=JSON.parse(lsObj.getLocalStorage("userBo"));

$(function() {
    changePageStyle("../.."); // 换肤
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
                var options = '<option value="">请选择</option>';
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].id + '">' + data[i].text + '</option>';
                }
                var mySelectId = document.getElementById("pipeName");
                if (mySelectId.options.length == 0) {
                    $("#pipeName").html(options);
                    $("#pipeName2").html(options);
                }
            } else {
                parent.layer.alert("加载下拉选失败", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(SELECT_ERROR_MSG, {
                title: "提示",
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
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#pipestartNumberName").html(options);
                $("#pipestartNumberName").selectpicker('refresh');
                $("#pipeendNumberName").html(options);
                $("#pipeendNumberName").selectpicker('refresh');
            } else {
                layer.alert("加载数据出错", {
                    title: "提示",
                    skin: "self-alert"
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }

    });
}

/**
 * @desc 根据查询条件重新加载数据，图表信息
 */
function querylist() {
    avOfPlAvgArr = [];
    couponAcDensityAvy = [];
    onPotentialOfCouponAvg = [];
    offPotentialOfCouponAvg = [];
    soilResistivity = [];
    xAxisData = [];
    //xAxisDataPosition = [];
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
                        if (tjSwitch == 1) {
                            tjSdk.track('数据对齐查询', { '结果': '成功' });
                        }
                    } catch (e) {}
                    var data = result.alignDataList;
                    areaColorarr = data[data.length - 1].color;
                    areaColorarr2 = data[data.length - 1].color;
                    var resultData = data.splice(data.length - 1, 1); // 删除背景颜色项

                    for (var i in data) {
                        avOfPlAvgArr.push(data[i].avOfPlAvg);
                        couponAcDensityAvy.push(data[i].couponAcDensityAvg);
                        onPotentialOfCouponAvg.push(data[i].onPotentialOfCouponAvg);
                        offPotentialOfCouponAvg.push(data[i].offPotentialOfCouponAvg);
                        soilResistivity.push(data[i].soilResistivity);

                        // xAxisDataPosition.push(data[i].position);
                        xAxisData.push(data[i].markerNumber);
                        markerIds.push(data[i].markerId);
                    }
                    drawGraph();
                } else {
                    layer.alert("加载数据出错", {
                        title: "提示",
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
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        });

    } else {
        parent.layer.confirm("请输入所有查询条件", {
            btn: ['确定'], //按钮
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
    option1 = {
        legend: {
            right: "3%",
            top:10,
            padding:0,
            itemGap:5,
            data: ['交流电压', '交流电流密度', '通电电位', '断电电位', '土壤电阻率']
        },
        grid:{
            top:35,
            bottom:10,
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params, ticket, callback) {
                try{
                    Xindex = params[0].dataIndex;   
                }catch(e){
                }
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
                name: "交流电压(V)",
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
                name: "交流电流密度(A/m²)",
                nameLocation: "middle",
                nameGap: "50",
            }
        ],
        series: [{
                name: '交流电压',
                type: 'line',
                data: "",
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
                name: '交流电流密度',
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
            data: ['通电电位', '断电电位', '土壤电阻率']
        },
        grid:{
            top:35,
            bottom:40,
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
                show: true,
            },
            axisLabel: {
                rotate: "45",
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
                name: "通断电电位(mV)",
                nameLocation: "middle",
                nameGap: "50",
            },
            {
                type: 'value',
                name: "土壤电阻率(Ω•m)",
                nameLocation: "middle",
                nameGap: "50",
            },
        ],
        series: [{
                name: '通电电位',
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
                name: '断电电位',
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
                name: '土壤电阻率',
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
    // 为echarts对象加载数据
    window.addEventListener("resize", function() {
        myChart1.resize();
        myChart2.resize();
        // myChart3.resize();
    });
    myChart1.setOption(option1, true);
    myChart2.setOption(option2, true);
    // myChart3.setOption(option3, true);

    //联动配置
    echarts.connect([myChart1, myChart2]);
    // myChart1.on('click', function(params) {
        // if (params.name == "Y 轴值为 3 的水平线") {
        //     return;
        // }
        // var dataUrl = "src/html/data_analysis/marker_history.html";
        // var realDataUrl = "src/html/data_analysis/marker_history.html?markerId=" + option1.xAxis[1].data[params.dataIndex] + '&markerName=' + encodeURI(params.name);
        // var menuName = "测试桩历史数据";
        // var dataIndex = "62";
        // parent.showMenuPage(dataUrl, realDataUrl, menuName, dataIndex);
    // })
    // myChart2.on('click', function(params) {
        // var dataUrl = "src/html/data_analysis/marker_history.html";
        // var realDataUrl = "src/html/data_analysis/marker_history.html?markerId=" + option1.xAxis[1].data[params.dataIndex] + '&markerName=' + encodeURI(params.name);
        // var menuName = "测试桩历史数据";
        // var dataIndex = "62";
        // parent.showMenuPage(dataUrl, realDataUrl, menuName, dataIndex);
    // })
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
        option1.xAxis[1].data = markerIds;
        myChart1.setOption(option1, true);
    }
    if (option2 && typeof option2 === "object") {
        option2.series[0].data = onPotentialOfCouponAvg; // 通电电位
        option2.series[1].data = offPotentialOfCouponAvg; // 断电电位
        option2.series[2].data = soilResistivity; // 土壤电阻率
        option2.xAxis[0].splitArea.areaStyle.color = areaColorarr2;
        option2.xAxis[0].data = xAxisData;
        option2.xAxis[1].data = markerIds;
        myChart2.setOption(option2, true);
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
}

/**
 * @desc 选取维修范围(高低腐蚀风险管段区域选择)
 */
function selectRepairRegion(){
    markerList = [];
    var beignNunberId = "";           //起始桩Id（维修范围）
    var endNunberId = "";             //终止桩Id（维修范围）
    var beignNunber = "";           //起始桩号（维修范围）
    var endNunber = "";             //终止桩号（维修范围）
    var markerList = [];            //维修范围内测试桩ids
    var length = xAxisData.length;
    if(Xindex == 0){
        beignNunberId = markerIds[Xindex];
        beignNunber = xAxisData[Xindex];
        for(var i=0;i<length;i++){
            if(areaColorarr[Xindex] == areaColorarr[i]){
                if(i == length-1){
                    markerList.push(markerIds[i]);
                    endNunberId = markerIds[i];
                    endNunber = xAxisData[i];
                }else{
                    markerList.push(markerIds[i]);
                    continue;
                }
            }else{
                endNunberId = markerIds[i-1];
                endNunber = xAxisData[i-1];
                break;
            }
        }
    }else if(Xindex == xAxisData.length-1){
        endNunberId = markerIds[Xindex];
        endNunber = xAxisData[Xindex];
        for(var i=Xindex;i>=0;i--){
            if(areaColorarr[Xindex] == areaColorarr[i]){
                if(i==0){
                    markerList.push(markerIds[i]);
                    beignNunberId = markerIds[0];
                    beignNunber = xAxisData[0];
                }else{
                    markerList.push(markerIds[i]);
                    continue;
                }
            }else{
                beignNunberId = markerIds[i+1];
                beignNunber = xAxisData[i+1];
                break;
            }
        }
    }else{
         for(var i=Xindex;i<length;i++){
            if(areaColorarr[Xindex] == areaColorarr[i]){
                if(i==length-1){
                    markerList.push(markerIds[i]);
                    endNunberId = markerIds[length-1];
                    endNunber = xAxisData[length-1];
                }else{
                    markerList.push(markerIds[i]);
                    continue;
                }
            }else{
                endNunberId = markerIds[i-1];
                endNunber = xAxisData[i-1];
                break;
            }
        }
        for(var i=Xindex-1;i>=0;i--){
            if(areaColorarr[Xindex] == areaColorarr[i]){
                if(i==0){
                    markerList.push(markerIds[i]);
                    beignNunberId = markerIds[0];
                    beignNunber = xAxisData[0];
                }else{
                    markerList.push(markerIds[i]);
                    continue;
                }
            }else{
                beignNunberId = markerIds[i+1];
                beignNunber = xAxisData[i+1];
                break;
            }
        }
    }
    repairParames.equipmentType = "管道";         //设备类型
    repairParames.belongPipelineId = $("#pipeName").val();      //所属管线Id    
    repairParames.pipelineName = $("#pipeName option:selected").text();          //所属管线名称
    repairParames.markerZone =   beignNunber + "-" +endNunber;       //维修范围
    repairParames.markerList = markerList;          //维修范围
    
    var startPosition = getMarkerPosition(beignNunberId);
    var endPosition = getMarkerPosition(endNunberId);
    repairParames.positionDescription = startPosition + "-" + endPosition;   //位置描述
    var length = xAxisData.length;
    if(areaColorarr[Xindex] == "#f9d9df"){
        repairParames.riskType = "高腐蚀风险";
    }else if(areaColorarr[Xindex] == "#fef6ed"){
        repairParames.riskType = "低腐蚀风险";
    }else{
        repairParames.equipmentType = "";
        repairParames.belongPipelineId = "";
        repairParames.pipelineName = "";
        repairParames.positionDescription="";
        repairParames.riskType = "";
        repairParames.markerZone = "";
        repairParames.markerList = [];
        $("#markerZone").val("");
        return;
    }
    $("#markerZone").val(beignNunber + "-" +endNunber);
}
function getMarkerPosition(markerId){
    var position = "";
    $.ajax({
        url: handleURL("/cloudlink-corrosionengineer/marker/queryMarkerById?token=" + token + "&objectId="+markerId),
        dataType: 'json',
        type: 'get',
        anync:false,
        success:function(res){
            if (res.success == 1 && res.markerInfo.length>0) {
                position = res.markerInfo[0].position
            } else {
                parent.layer.alert("查询桩信息位置失败", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.open(SELECT_ERROR_MSG,{
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
    return position;
}
/**
 * @desc 选取维修范围(M4/M5/M8/M9/M10维修范围选择)
 */
function selectRepairRegion2(markerId,pipelineId,markerNumber,pipelineName,positionDescription,equipmentType,riskType){
    markerList = [];
    repairParames.markerList = markerId;          //维修范围内的测试桩ids
    repairParames.markerZone =   markerNumber;       //维修范围
    repairParames.belongPipelineId = pipelineId;      //所属管线Id    
    repairParames.pipelineName = pipelineName;          //所属管线名称
    if(positionDescription!=null){
        repairParames.positionDescription = positionDescription;   //位置描述
    }else{
        repairParames.positionDescription = "";
    }
    repairParames.equipmentType = equipmentType;         //设备类型
    repairParames.riskType = riskType;                  //风险类型
    $("#markerZone").val(markerNumber);
}
var tableHeight = "";   //重新设置table高度
//选择不同页签时的预处理操作
function selectItem(id){
    // var tableId = "";        //table容器的Id
    var detectDataType = ""; //根据也签选择不同的传入不同的值
    var columnArr = [];
    if(id == "1"){
        $(".tips").html("点击查询结果图中特定的区域进行选取");
    }else{
        $(".tips").html("单击列表中一行或每行后面的操作按钮进行选取");
    }
    switch(id){
        case "1":
            $("#conditionDiv").hide();
        break;
        case "2":
            $("#conditionDiv").show();
            $("#conditionText").html("已搭接");
            $("#conditionText").attr("data-value",2);
            tableId = "table_2";
            detectDataType = "4";
            columnArr = columnArr2;
        break;
        case "3":
            $("#conditionDiv").show();
            $("#conditionText").html("有干扰");
            $("#conditionText").attr("data-value",1);
            tableId = "table_3";
            detectDataType = "5";
            columnArr = columnArr3;
        break;
        case "4":
            $("#conditionDiv").show();
            $("#conditionText").html("绝缘失效");
            $("#conditionText").attr("data-value",2);
            tableId = "table_4";
            detectDataType = "8";
            columnArr = columnArr4;
        break;
        case "5":
            $("#conditionDiv").show();
            $("#conditionText").html("恒电位仪运行异常");
            $("#conditionText").attr("data-value",2);
            tableId = "table_5";
            detectDataType = "9";
            columnArr = columnArr5;
        break;
        case "6":
            $("#conditionDiv").show();
            $("#conditionText").html("地床失效");
            $("#conditionText").attr("data-value",2);
            tableId = "table_6";
            detectDataType = "10";
            columnArr = columnArr6;
        break;
    }
    if(tableHeight ==""){
        var winH = $(window).height();
        var tabsHeight = parseInt($(".nav-tabs").outerHeight(true));
        var regionHeight = parseInt($(".repair_region").outerHeight(true));
        var conditionDivHeight = parseInt($("#conditionDiv").outerHeight(true));
        tableHeight = winH - tabsHeight - regionHeight - conditionDivHeight - 15;
    }
    items.analysisResult =  $("#conditionText").attr("data-value");
    loadTable(tableId,detectDataType,columnArr);
}
var currentPageNumber; //定义当前页码
var currentPageSize; //定义当前页大小
//套管搭接页签table中columns配置项
var columnArr2 = [[{
                title: '序号',
                rowspan: 2,
                align: 'center',
                width: 70,
                formatter: function(value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                    // return index;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                rowspan: 2,
                align: 'center',
                sortable: true,
                width: '10%'
            }, {
                field: 'analysisResultVal',
                title: '分析结果',
                sortable: false,
                // width: '10%',
                align: 'center',
                rowspan: 2
            }, {
                title: '管道通电电位(mV)',
                // width: '10%',
                align: 'center',
                rowspan: 1,
                colspan: 1
            }, {
                title: '管道断电电位(mV)',
                // width: '10%',
                align: 'center',
                rowspan: 1,
                colspan: 1
            }, {
                field: 'offPotentialOfAvg',
                title: '套管通电电位(mV)',
                align: 'center',
                // width: '10%',
                rowspan: 2
            }, {
                field: 'offPotenialOfCasing',
                title: '套管断电电位(mV)',
                align: 'center',
                // sortable: true,
                // width: '10%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: '所属管线',
                align: 'center',
                // sortable: true,
                // width: '10%',
                class: 'td-nowrap',
                rowspan: 2,
            }, {
                field: 'createTime',
                title: '检测时间',
                align: 'center',
                // sortable: true,
                // width: '10%',
                class: 'td-nowrap',
                rowspan: 2,
                formatter: function(value, row, index) {
                    var createTime = (row.createTime).split(' ');
                    return createTime[0];
                }
            }, {
                field: 'operation',
                title: '操作',
                width: '10%',
                rowspan: 2,
                formatter: function(value, row, index) {
                    var e = '<a href="#" mce_href="#" title = "选择" onclick="selectRepairRegion2(\'' + row.markerId + '\'\,\'' + row.pipelineId + '\'\,\'' + row.markerNumber + '\'\,\'' + row.pipelineName + '\'\,\'' + row.position + '\'\,\'' + "套管" + "\',\'" + "套管搭接" + '\')"><span class="glyphicon glyphicon-ok"></span></a> ';
                    return e;
                }
            }],[{
                field: 'onPotentialOfAvg',
                title: '平均值',
                // sortable: true,
                width: '10%',
                align: 'center'
            }, {
                field: 'offPotentialOfAvg',
                title: '平均值',
                // sortable: true,
                width: '10%',
                align: 'center'
            }]];
//交叉平行干扰页签table中columns配置项
var columnArr3 = [[{
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                sortable: true,
                width: '10%',
                rowspan: 2
            }, {
                field: 'analysisResultVal',
                title: '分析结果',
                sortable: false,
                width: '10%',
                align: 'center',
                rowspan: 2  
            }, {
                title: '自己恒电位仪开启',
                rowspan: 1,
                colspan: 2
            }, {
                title: '自己恒电位仪关闭',
                rowspan: 1,
                colspan: 2
            }, {
                title: '外部恒电位仪开启',
                rowspan: 1,
                colspan: 2
            }, {
                title: '外部恒电位仪关闭',
                rowspan: 1,
                colspan: 2
            }, {
                field: 'offPotentialOfAvg',
                title: '自己管道试片断电电位(mV)',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: '所属管线',
                sortable: true,
                width: '10%',
                rowspan: 2
            }, {
                field: 'createTime',
                title: '检测时间',
                sortable: true,
                width: '6%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                title: '操作',
                width: '10%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" title = "选择" onclick="selectRepairRegion2(\'' + row.markerId + '\'\,\'' + row.pipelineId + '\'\,\'' + row.markerNumber + '\'\,\'' + row.pipelineName + '\'\,\'' + row.position + '\'\,\'' + "交叉管道" + "\',\'" + "交叉平行干扰" + '\')"><span class="glyphicon glyphicon-ok"></span></a> ';
                    return e;
                }
            }],
            [{
                field: 'plPotentialRecitifierOn',
                title: '自己管道电位（mV）',
                sortable: true,
                width: '6%'
            }, {
                field: 'forPlPotentialRecitifierOn',
                title: '外部管道电位（mV）',
                sortable: true,
                width: '6%'
            }, {
                field: 'plPotentialRecitifierOff',
                title: '自己管道电位（mV）',
                sortable: true,
                width: '6%'
            }, {
                field: 'forPlPotentialRecitifierOff',
                title: '外部管道电位（mV）',
                sortable: true,
                width: '6%'
            }, {
                field: 'plPotentialForRecitifierOn',
                title: '自己管道电位（mV）',
                sortable: true,
                width: '6%'
            }, {
                field: 'forPlPotentialForRecitifierOn',
                title: '外部管道电位（mV）',
                sortable: true,
                width: '6%'
            }, {
                field: 'plPotentialForRecitifierOff',
                title: '自己管道电位（mV）',
                sortable: true,
                width: '6%'
            }, {
                field: 'forPlPotentialForRecitifierOff',
                title: '外部管道电位（mV）',
                sortable: true,
                width: '6%'
            }]
            ];
//绝缘失效页签table中columns配置项
var columnArr4 = [{
            title: '序号',
            formatter: function (value, row, index) {
                return currentPageSize * (currentPageNumber - 1) + index + 1;
            }
        }, {
            field: 'markerNumber',
            title: '测试桩号',
            sortable: true,
            width: '10%'
        }, {
            field: 'analysisResultVal',
            title: '分析结果',
            sortable: false,
            width: '10%',
            align: 'center'
        }, {
            field: 'onPotentialOfAvg',
            title: '保护端管道电位（V）',
            sortable: true,
            width: '9%'
        }, {
            field: 'avOfPlAvg',
            title: '保护端管道交流电压（V）',
            sortable: true,
            width: '9%'
        }, {
            field: 'couponOfPlNonProtectSide',
            title: '非保护端管道电位（V）',
            sortable: true,
            width: '9%'
        }, {
            field: 'avOfPlNonProtectSide',
            title: '非保护端管道交流电压（V）',
            sortable: true,
            width: '9%'
        }, {
            field: 'crossoverCurrent',
            title: '跨接电流（A）',
            sortable: true,
            width: '9%'
        }, {
            field: 'pipelineName',
            title: '所属管线',
            sortable: true,
            width: '9%'
        }, {
            field: 'createTime',
            title: '检测时间',
            sortable: true,
            width: '9%'
        }, {
            field: 'option',
            title: '操作',
            width: '9%',
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#" title = "选择" onclick="selectRepairRegion2(\'' + row.markerId + '\'\,\'' + row.pipelineId + '\'\,\'' + row.markerNumber + '\'\,\'' + row.pipelineName + '\'\,\'' + row.position + '\'\,\'' + "绝缘接头" + "\',\'" + "绝缘失效" + '\')"><span class="glyphicon glyphicon-ok"></span></a> ';
                return e;
            }
        }];
//恒电位仪运行异常页签table中columns配置项
var columnArr5 = [[{
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'analysisResultVal',
                title: '分析结果',
                sortable: false,
                width: '10%',
                rowspan: 2
            }, {
                title: '输出电流（A）',
                colspan: 1
            }, {
                title: '输出电压（V）',
            }, {
                field: 'cpLoopResistance',
                title: '回路电阻（Ω）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'setupPotentialOfRecitifier',
                title: '设定电位（mV）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'setupOffPotentialOfRecitifier',
                title: '设定断电电位（mV）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'onPotentialOnPipeConnectionAvg',
                title: '汇流点通电电位（mV）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'offPotentialOnPipeConnectionAvg',
                title: '汇流点断电电位（mV）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'onPotentialOnAnodeAvg',
                title: '阳极地床平均通电电位（mV）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'offPotentialOnAnodeAvg',
                title: '阳极地床平均断电电位（mV）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'apparentResistanceOfPl',
                title: '管道视电阻（Ω）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'apparentResistanceOfGroundbed',
                title: '地床视电阻（Ω）',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: '所属管线',
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'createTime',
                title: '检测时间',
                sortable: true,
                class: 'td-nowrap',
                rowspan: 2
            }, {
                title: '操作',
                width: '6%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" title = "选择" onclick="selectRepairRegion2(\'' + row.markerId + '\'\,\'' + row.pipelineId + '\'\,\'' + row.markerNumber + '\'\,\'' + row.pipelineName + '\'\,\'' + row.position + '\'\,\'' + "恒电位仪" + "\',\'" + "恒电位仪运行异常" + '\')"><span class="glyphicon glyphicon-ok"></span></a> ';
                    return e;
                }
            }],
            [{
                field: 'outputCurrentOfRecitifierAvg',
                title: '平均值',
                sortable: true,
                width: '5%'
            }, {
                field: 'outputVoltageOfRecitifierAvg',
                title: '平均值',
                sortable: true,
                width: '5%',
            }]
        ];
//地床失效页签table中columns配置项
var columnArr6 = [[{
                title: '序号',
                rowspan: 2,
                width: 70,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                sortable: true,
                width: '10%',
                rowspan: 2
            }, {
                field: 'analysisResultVal',
                title: '分析结果',
                sortable: false,
                width: '10%',
                align: 'center',
                rowspan: 2
            }, {
                title: '管道电位检测',
                width: '20%',
                colspan: 2
            }, {
                title: '牺牲阳极性能',
                width: '30%',
                colspan: 3
            },{
                field: 'pipelineName',
                title: '所属管线',
                width: '10%',
                // sortable: true,
                // width: '7%',
                rowspan: 2
            }, {
                field: 'createTime',
                title: '检测时间',
                sortable: true,
                width: '10%',
                // width: '7%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                title: '操作',
                width: '10%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" title = "选择" onclick="selectRepairRegion2(\'' + row.markerId + '\'\,\'' + row.pipelineId + '\'\,\'' + row.markerNumber + '\'\,\'' + row.pipelineName + '\'\,\'' + row.position + '\'\,\'' + "地床" + "\',\'" + "地床失效" + '\')"><span class="glyphicon glyphicon-ok"></span></a> ';
                    return e;
                }
            }],
            [{
                field: 'plOnPotentialAnodeConnected',
                title: '通电电位（mV）',
                // sortable: true,
                width: '10%'
            }, {
                field: 'plOffPotentialAnodeDisconnected',
                title: '断电电位（mV）',
                width: '10%',
                // sortable: true,
                // width: '7%'
            }, {
                field: 'potentialOfAnodeDisconnected',
                title: '开路电位（mV）',
                width: '10%',
                // sortable: true,
                // width: '7%'
            }, {
                field: 'currentFromPlToAnode',
                title: '输出电流（mA）',
                width: '10%',
                // sortable: true,
                // width: '7%'
            }, {
                field: 'anodeGroundResistance',
                title: '接地电阻（Ω）',
                width: '10%',
                // sortable: true,
                // width: '5%'
            }]
        ];
//初始化table表时的默认查询条件（分析结果：有问题的记录）
var items = {
    "analysisResult": "", //维修状态
}
/**
 * @desc 加载table表
 */
function loadTable(tableId,detectDataType,columnArr) {
    var url = handleURL('/cloudlink-corrosionengineer/dataalign/getSpecialDetectData'); //对url进行权限处理
    console.log(tableId)
    try{
        $('#'+tableId).bootstrapTable({
            url: url, //请求后台的URL（*）
            method: 'get', //请求方式（*）
            // toolbar: "#toolbar",
            height:tableHeight,
            pageSize: 10,
            showRefresh: false, //隐藏刷新按钮
            queryParams: function(params) {
                currentPageNumber = this.pageNumber;
                currentPageSize = this.pageSize;
                params.detectDataType = detectDataType //不同也签的值
                if (items.analysisResult != "") { //维修状态为全部
                    params.analysisResult = items.analysisResult;
                } else {
                    
                }
                params.pipelineId = $("#pipeName2").val(); //管线ID
                params.markerName = $("#markerName").val(); //测试桩名字
                params.enterpriseId=userBo.enterpriseId;
                params.token = lsObj.getLocalStorage("token"); //token
                params.pageSize = this.pageSize; //页面大小
                params.pageNum = this.pageNumber; //当前页码
                params.sortName = this.sortName;
                params.sortOrder = this.sortOrder;
                return params;
            },
            columns: columnArr,
            onClickRow:function(row){
                var equipmentType = "";
                var riskType = "";
                switch(tableId){
                    case "table_2":
                        equipmentType = "套管";
                        riskType = "套管搭接";
                    break;
                    case "table_3":
                        equipmentType = "交叉管道";
                        riskType = "交叉平行干扰";
                    break;
                    case "table_4":
                        equipmentType = "绝缘接头";
                        riskType = "绝缘失效";
                    break;
                    case "table_5":
                        equipmentType = "恒电位仪";
                        riskType = "恒电位仪运行异常";
                    break;
                    case "table_6":
                        equipmentType = "地床";
                        riskType = "地床失效";
                    break;
                }
                selectRepairRegion2(row.markerId,row.pipelineId,row.markerNumber,row.pipelineName,row.position,equipmentType,riskType);
            },
            // onDblClickRow: function(row) {
                // viewTask(row.objectId, row.detectMethod, row.taskStatus, row.detectUserId, row.taskName);
            // },
            responseHandler: function(res) { //加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
                if (res.success == 1) {
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('选择维修范围', {"结果": "成功" });
                        }
                    } catch (error) {

                    }
                    var data = res.rows;

                    return res;
                } else {
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('选择维修范围', {"结果": "失败" });
                        }
                    } catch (error) {

                    }
                    layer.alert("加载数据出错", {
                        title: "提示",
                        skin: "self-alert"
                    });
                }
            },
            onLoadSuccess:function(){
                try{
                    $('#'+tableId).bootstrapTable('resetView');
                }catch(e){
                    alert(e);
                }
            }
        });
    }catch(e){
        alert(e);
    }
}

//根据维修状态查询
$(".repairStatus .item").click(function() {
    var $parent = $('.repairStatus');
    $parent.find(".item").removeClass('active'); //移除所有的active
    $(this).addClass('active'); //将点击按钮设置点击状态
    items.analysisResult = $(this).attr("data-value"); //获取点击按钮的值
    $('#'+tableId).bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
});
//根据所属管线进行查询
$('#pipeName2').on('change',function(){  //管线
    $('#'+tableId).bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" });
});
//根据测试关键字搜索
$("#searchBtn").click(function(){
    $('#'+tableId).bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
});
//重置查询条件（标签2-6）
$("#resetBtn").click(function(){
    $("#pipeName2").val("");
    $("#markerName").val("");
    $('#'+tableId).bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
});
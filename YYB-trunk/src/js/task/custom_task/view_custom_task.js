/**
 * @file
 * @author  gaohui
 * @desc 查看任务
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:22:33
 */
var roleNum = lsObj.getLocalStorage("params"); //获取角色 的标识
var objectId = getParameter("objectId"); //获取任务id
var templateId = getParameter('templateId');  //获取检测方法

var map = new BMap.Map("task-map"); //创建一个地图实例
var mapBtn = $(".bottom-btn span");
var mapContainer = $("#task-map"); //百度地图DIV容器
var detectMethod = getParameter('detectMethod'); //检测方法
var detectUserId = getParameter('detectUserId'); //检测检测人员ID
var taskStatus = decodeURI(getParameter('taskStatus')); //任务状态
var taskName = decodeURI(getParameter('taskName')); //任务名称
var token = lsObj.getLocalStorage('token');
var source = null;
var analysisResult = "analysisResult";

//定义网格化传入参数的值
var items = {
    "detectResult": '', //检测结果
    "markerStatus":'' //桩状况
}
var currentPageNumber; //定义一个全局变量
var currentPageSize;    //定义一个全局变量

var myChart1,option1,
    myChart2,option2,
    myChart3,option3,
    myChart4,option5;
var graphMark = "";
var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
$(function () {
    changePageStyle("../../..");
    // 面板显隐
    $('.panel-heading').on('click', function() {
        $(this).siblings('.panel-body').toggleClass('panel-body-close');
    });
    getTaskInfo() //渲染任务页面
    if (roleNum == 2) { //判断角色是否为现场检测人员
        setTimeout(function () {
            initPeopleStatistics(); //人员统计
            getTaskProcess();   //获取任务进展
        }, 100)

    }
    mapContainer.slideUp();    //隐藏地图
    mapBtn.attr("class", "map-down");  //追加按钮class
    // 初始化地图
    initMap();

    $(".son_wrapper .line").css("display", "none");
    $("#analysisResultM2").css("display", "inherit");
    MTask();  //初始化任务的表格
   
    queryPipeData(); //初始化下拉选（所属管线））；
    $("#pipeName1").bind("change", function () { //改变管线下拉框是触发事件
        var pipeNameID = $("#pipeName1").val();
        if (!isNull(pipeNameID)) {
            queryMarkData(pipeNameID);  //加载下拉测试桩号下拉桩的值
        }
    });

     //时间插件
    $("#minDetectTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month"
    }).on("click", function () {
        $("#minDetectTime").datetimepicker("setEndDate", $("#maxDetectTime").val())
    });
    $("#maxDetectTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month"
    }).on("click", function () {
        $("#maxDetectTime").datetimepicker("setStartDate", $("#minDetectTime").val())
    });
     //回车查询检测数据
    $("#searchMarker").keydown(function() {
        if (event.keyCode == "13") { //keyCode=13是回车键
            $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
        }
    });
  
    $('.more').click(function() {
        $('.more').toggleClass("active");
        $('.more_item_wrapper').toggle();
    }); 
    clickSearch();
});

/**
 * @desc 点击查询
 */
function clickSearch(){
    $(".detect-result .item").click(function(){ //分析结果
        var parent = $('.detect-result');
        parent.find(".item").removeClass('active'); //移除所有的active
        $(this).addClass('active'); //将点击按钮设置点击状态
        items.detectResult = $(this).attr("data-value"); //获取点击按钮的值
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
    // });
    });
    $(".marker-status .item").click(function(){ //桩状态
        var parent = $(".marker-status");
        parent.find(".item").removeClass("active");
        $(this).addClass("active");
        items.markerStatus = $(this).attr("data-value");
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
    });

    $("#pipeName1").on('change',function(){ //所属管线
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
    });
    $("#detectStatus").on('change',function(){  //检测状态
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
    });
    $("#markerNumberBtn").on('click',function(){    //测试桩起止桩号确定
        if(isNull($("#pipestartNumberName1").val())){
            // parent.layer.alert("", {
            parent.layer.alert(getLanguageValue("start_markerNumber"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return; 
        }else if(isNull($("#pipeendNumberName1").val())){
            parent.layer.alert(getLanguageValue("end_markerNumber"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return;
        }else if($("#pipeendNumberName1").val() - 0 < $("#pipestartNumberName1").val() - 0) {  //判断起始桩号是否大于终止桩号
            parent.layer.alert(getLanguageValue("compare_markerNumber"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return;
        }else{
            $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
        }
    });

    $(".marker-number").on("change",function(){
        if(!isNull($("#pipestartNumberName1").val())&&!isNull($("#pipeendNumberName1").val())&&$("#pipeendNumberName1").val() - 0 >= $("#pipestartNumberName1").val() - 0){
            $("#markerNumberBtn").addClass("active")
        }else{
            $("#markerNumberBtn").removeClass("active");
        }
    })

    $("#dateBtn").on('click',function(){
        if(isNull($("#minDetectTime").val())){
            parent.layer.alert(getLanguageValue("start_time"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return; 
        }else if(isNull($("#maxDetectTime").val())){
            parent.layer.alert(getLanguageValue("end_time"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return; 
        }else{
            $("#dateBtn").addClass("active")
            $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
        }
    });

    $(".detect-time").on("change",function(){
        if(!isNull($("#minDetectTime").val())&&!isNull($("#maxDetectTime").val())){
            $("#dateBtn").addClass("active")
        }else{
            $("#dateBtn").removeClass("active");
        }
    });

    $("#recorder").on('change',function(){  //检测状态
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
    });
}
/**
 * @desc 初始化下拉选（所属管线））
 */
function queryPipeData() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryPipeCheck?taskId=" + objectId + "&token=" + token,
        dataType: "json",
        method: "get",
        success: function (result) {
            if (result.success == 1) {
                var data = result.pipeList;
                var options = "<option value=''>"+ getLanguageValue("select")+"</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                var myobj = document.getElementById('pipeName1');
                if (myobj.options.length == 0) {
                    $("#pipeName1").html(options);
                    $('#pipeName1').selectpicker('refresh');
                }
            } else {
                parent.layer.alert(getLanguageValue("dropdown_menu"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
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
 * @desc 加载下拉测试桩号下拉桩的值
 * @param {*String} pipelineId
 */
function queryMarkData(pipelineId) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryMarkList?flag=check&pipelineId=" + pipelineId + '&token=' + token,
        dataType: "json",
        type: "get",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.markList;
                var options = "<option value=''>"+ getLanguageValue("select")+"</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#pipeendNumberName1").html(options);
                $("#pipestartNumberName1").html(options);
                $("#pipeendNumberName1").selectpicker('refresh');
                $("#pipestartNumberName1").selectpicker('refresh');
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
 * @desc 查询测试桩数据
 */
$("#searchBtn").click(function(){ 
    $("#tb-all-task").bootstrapTable('refreshOptions', { pageNumber: 1,sortName:"",sortOrder:"" }); //刷新页面并跳转到第一页
});

/**
 * @desc 重置方法
 */
$("#resetBtn").click(function(){
    document.getElementById("searchMarker").reset();
    $(".detect-result").find(".item").removeClass("active");
    $($(".detect-result").find(".all")).addClass("active");
    $(".marker-status").find(".item").removeClass("active");
    $($(".marker-status").find(".item")[0]).addClass("active");
    $("#dateBtn").removeClass("active");
    $("#markerNumberBtn").removeClass("active");
    items.markerStatus = "";
    items.detectResult = "";
    $('.selectpicker').selectpicker('val', null);
    $("#tb-all-task").bootstrapTable('refreshOptions', { pageNumber: 1,sortName:"",sortOrder:"" }); //刷新页面并跳转到第一页
})


/**
 * @desc 自定义任务网格化
 */
function MTask() {
    var dataDetection = loadDataDetection(); // 检测数据项
    // console.log(dataDetection);
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url进行权限处理
    $('#tb-all-task').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: dataDetection,
        onDblClickRow: function (row, field) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onEditableSave: function (field, row, oldValue, $el) {
            // alert(row.analysisResult);
            var data = {
                "objectID":row.objectId,
                "taskID":row.taskId,
                "result":row.analysisResult
            }
            setAnalysisResult(data);
        },
        onLoadSuccess: function (res) {

        }
    });
};

/**
 * @desc 设置传入参数
 * @method queryParams
 * @param {*String} params
 * @returns {*String} temp
 */
function queryParams(params) {
    var recorder = ""
    if (roleNum == 2) {
        recorder = $('#recorder').val()
    }
    currentPageNumber = this.pageNumber;
    currentPageSize = this.pageSize;
    var temp = {
        pageSize: this.pageSize, //页面大小
        pageNum: this.pageNumber, //当前页码
        pipelineId: $("#pipeName1").val(),  //管线ID
        detectResult: items.detectResult,    //检测结果
        detectMethod: detectMethod, //检测方法
        startMarkNum: $("#pipestartNumberName1").val(), //开始桩号
        endMarkNum: $("#pipeendNumberName1").val(), //结束桩号
        recorder: recorder, //记录人
        detectStatus: $("#detectStatus").val(), //检测状态
        token: token,    //token
        sortName:this.sortName,
        sortOrder:this.sortOrder,
        markerStatus:items.markerStatus,
        minDetectTime:$("#minDetectTime").val(),
        maxDetectTime:$("#maxDetectTime").val(),
        markNum:$("#markerNumber").val() 
    }
    return temp;
}

/**
 * @desc 设置边框底部页码
 * @method responseHandler
 * @param {*String} res
 * @returns {*String} res
 */
function responseHandler(res) {
    if (res.success == 1) {
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('查询检测数据', { '任务类型': 'M' + detectMethod, "结果": "成功" });
            }
        } catch (error) {

        }
        var data = res.rows;
        return res;
    } else {
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('查询检测数据', { '任务类型': 'M' + detectMethod, "结果": "失败" });
            }
        } catch (error) {

        }
        parent.layer.alert(getLanguageValue("load_data_error"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });

    }
}

/**
 * @desc 渲染页面
 * @method getTaskInfo
 */
function getTaskInfo() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryTaskInfo?objectId=" + objectId + "&token=" + token,
        method: 'get', //请求方式（*）
        success: function (result) {
            if (result.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看任务', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                data = result.taskInfo;
                if (!isNull(data)) {

                    var taskInfo = data.taskinfo;
                    // var detectdata = data.detectdata;
                    // console.log(taskInfo);
                    var taskFinishInfo = data.taskFinishInfo;
                    $('#workOrder').html(taskInfo.workOrder); //工单号
                    $('#taskName1').html(taskInfo.taskName); //任务名称
                    $("#auditorName").html(taskInfo.auditorName); // 审核人员
                    $('#detectMethod1').html('M' + taskInfo.detectMethod); //检测方法
                    $('#startTimePlan').html(taskInfo.startTimePlan); //计划结束时间
                    $('#endTimePlan').html(taskInfo.endTimePlan); //计划开始时间
                    $('#startTime').html(taskInfo.startTime);   //检测开始时间
                    $('#endTime').html(taskInfo.endTime);   //检测技术时间
                    $('#createTime').html((taskInfo.createTime));   //任务创建时间
                    $('#closeTime').html((taskInfo.closeTime)); //审核通过时间
                    var taskStatus = "";
                    switch(taskInfo.taskStatus){
                        case '1':
                        taskStatus = getLanguageValue("received")
                        break;
                        case '2':
                        taskStatus = getLanguageValue("operating")
                        break;
                        case '3':
                        taskStatus = getLanguageValue("reviewed")
                        break;
                        case '4':
                        taskStatus = getLanguageValue("approved")
                        break;
                    }
                    $('#taskStatus').html(taskStatus);   //任务状态

                    $('#detectUserName').html($.trim(taskInfo.detectUserName)); //检测人员
                    $('#detectUserName1').attr("title", $.trim(taskInfo.detectUserName));
                    $('#pipelineName').html(taskInfo.pipelineName); //所属管线
                    $('#createUserName').html(taskInfo.createUserName); //任务创建人

                    var num = parseInt(((taskFinishInfo.taskSum - taskFinishInfo.TaskUnfinish) / taskFinishInfo.taskSum) * 10000 / 100.00) + "%"
                    $('#num').html(num)
                    initTaskStatic(taskFinishInfo); //渲染任务统计柱状图

                }
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看任务', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (error) {

                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    })

}

/**
 * @desc 渲染任务统计柱状图、
 * @method initTaskStatic
 * @param {*String} taskFinishInfo
 */
function initTaskStatic(taskFinishInfo) {
    var x;
    if (taskFinishInfo.taskSum < 4) {
        x = 4;
    } else {
        x = taskFinishInfo.taskSum + 1
    }
    // 基于准备好的dom，初始化echarts实例
    if (roleNum == 2) {
        var myChart = echarts.init(document.getElementById('taskProgress'));
    } else {
        var myChart = echarts.init(document.getElementById('taskStatic'));
    }
    // 指定图表的配置项和数据
    var option = {
        grid: {
            left: '3%',
            right: '4%',
            top: 0,
            bottom: '3%',
            containLabel: true
        },

        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            minInterval: 1,
            max: x

        },
        yAxis: {
            type: 'category',
            data: [getLanguageValue("rejected")+':' + taskFinishInfo.repeatDetect, getLanguageValue("failed")+':'  + taskFinishInfo.unDetect, getLanguageValue("add")+':' +taskFinishInfo.addMarker,getLanguageValue("done")+':' + taskFinishInfo.taskDone, getLanguageValue("waitTest")+':' + taskFinishInfo.TaskUnfinish, getLanguageValue("all")+':' + taskFinishInfo.taskSum]
        },
        series: [{
            name: '2011年',
            type: 'bar',
            barWidth: 8,
            itemStyle: {
                normal: {
                    color: "#59b6fc",
                    barBorderRadius: 5
                },
            },
            data: [taskFinishInfo.repeatDetect, taskFinishInfo.unDetect, taskFinishInfo.addMarker, taskFinishInfo.taskDone, taskFinishInfo.TaskUnfinish, taskFinishInfo.taskSum,]
        },]
    };

    // 使用刚指定的配置项和数据显示图表。  
    myChart.setOption(option);
    window.onresize = myChart.resize;
}

var optionStatisticsChart = {}  //定义一个全局变量optionStatisticsChart
var people = [];    //定义一个全局变量people
var thisDay = [];   //定义一个全局变量thisDay
var thisWeek = [];  //定义一个全局变量thisWeek
var thisMouth = []; //定义一个全局变量thisMouth

/**
 * @desc 获取任务进展
 * @method getTaskProcess
 */
function getTaskProcess() {
    var url = handleURL("/cloudlink-corrosionengineer/task/getTaskProcess?token=" + token + "&task=" + detectMethod + "&taskChose=" + objectId);   //对url进行权限处理
    $.ajax({
        url: url,
        method: 'get', //请求方式（*）
        success: function (result) {
            if (result.success == 1) {

                for (var key in result.taskInfoBo.createUserCount) {
                    people.push(key);

                    thisDay.push(result.taskInfoBo.createUserCount[key][0]);
                    thisWeek.push(result.taskInfoBo.createUserCount[key][1]);
                    thisMouth.push(result.taskInfoBo.createUserCount[key][2]);
                }
                $('#peopleStatistics').width();
                optionStatisticsChart.xAxis[0].data = people;
                optionStatisticsChart.series[0].data = thisDay;
                optionStatisticsChart.series[1].data = thisWeek;
                optionStatisticsChart.series[2].data = thisMouth;
                $('#num1').html(people.length);
                peopleStatisticsChart.setOption(optionStatisticsChart, true);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 人员统计
 * @method initPeopleStatistics
 */
function initPeopleStatistics() {

    peopleStatisticsChart = echarts.init(document.getElementById('peopleStatistics'));
    optionStatisticsChart = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            right: 10,
            icon: 'circle',
            // data: ['今日', '本周', '本月']
            data: [ getLanguageValue("today"), getLanguageValue("week"), getLanguageValue("month")]
        },
        grid: {
            show: true,
            //   left: '3%',
            right: '4%',
            bottom: '6%',
            containLabel: true,
        },
        dataZoom: [{
            type: 'inside',
            // start: 80,
            // end: 100,
            zoomLock: true //是否锁定选择区域（或叫做数据窗口）的大小。
            // 如果设置为 true 则锁定选择区域的大小， 也就是说， 只能平移， 不能缩放。
        },
        {
            show: false,
            type: 'slider',
            y: '90%',
            start: 80,
            end: 100,
        }
        ],
        xAxis: [{
            type: 'category',
            //   nameGap: 5,
            //   nameRotate: 45,
            axisLabel: {
                rotate: 45,
                interval: 0
            },
            axisTick: {
                //   show: false
                show: true,
                inside: true
            },
            nameTextStyle: {
                fontSize: 8,
            },
            data: ""
            // data: ['1', '2']
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            // name: '今日',
            name:getLanguageValue("today"),
            type: 'bar',
            barWidth: 10,
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
            // data: ['0', '1']
            data: ""
        },
        {
            // name: '本周',
            name:getLanguageValue("week"),
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: '#f59324',
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
            // data: ['1', '2']
            data: ""
        },
        {
            // name: '本月',
            name:getLanguageValue("month"),
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: '#fb7760',
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
            // data: ['2', '1']
            data: ""
        }

        ]
    };
    window.addEventListener("resize", function () {
        peopleStatisticsChart.resize();
    });
    peopleStatisticsChart.setOption(optionStatisticsChart, true);


    // getTaskProcess()
}

//显示/隐藏地图按钮
$(".bottom-btn").click(function () {
    if (mapContainer.is(":hidden")) {
        mapContainer.slideDown();
        mapBtn.attr("class", "map-up");
    } else {
        mapContainer.slideUp();
        mapBtn.attr("class", "map-down");
    }
});


/**
 * @desc 查看数据信息
 * @method viewDetectedData
 * @param {*String} id,detectStatus
 */

function viewDetectedData(id, detectStatus) {
    uncheck('viewDetectedData');
    var rows = $('#tb-all-task').bootstrapTable('getSelections');
    if (isNull(id) || id =="null") {  // id为空
        if ((detectStatus == "未检测" || detectStatus ==  "UnDetect") && !isNull(detectStatus)) {
            parent.layer.alert(getLanguageValue("select_marker_nodata"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return;
        } else if (rows.length == 1 && (rows == [] || rows[0].detectStatus == "未检测" || detectStatus ==  "UnDetect")) {
            parent.layer.alert(getLanguageValue("select_marker_nodata"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return;
        }
    }
    if (!isNull(id)) {
    } else if (rows.length == 1) {
        id = rows[0].objectId;
        detectStatus = rows[0].detectStatus;
        if (detectStatus == "未检测" || detectStatus ==  "UnDetect") {
            parent.layer.alert(getLanguageValue("select_marker_nodata"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return;
        }
    } else {
        parent.layer.alert(getLanguageValue("select_check_marker"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    viewData();
    /*****************************处理上一个下一个桩快捷查看（开始）lixiaolong**************************/ 
    var dataArr =  $('#tb-all-task').bootstrapTable('getData');
    var objectIds = "";
    for(var i = 0;i < dataArr.length;i++){
        if(dataArr[i].objectId!=""&&dataArr[i].objectId!=null){
            if(i==dataArr.length-1){
                objectIds = objectIds + dataArr[i].objectId;
            }else{
                objectIds = objectIds + dataArr[i].objectId + ",";
            }
        }
    }
    lsObj.setLocalStorage("objectIds",objectIds);
    /*****************************处理上一个下一个桩快捷查看（结束）********************************/ 
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        // title: '检测数据详情',
        title: getLanguageValue("detail_data"),
        area: ['950px', '600px'],
        skin: 'self-iframe',
        btn: [getLanguageValue("close_btn")],
        btn2: function (index, layero) { },
        // content: content + id + "&objectIds=" + objectIds,
        content: content + id,
        end:function(){
            $('#tb-all-task').bootstrapTable('refresh', true);
        }
    });
    localStorage.setItem("indexNow", JSON.stringify(index));
}

var content = "";   //定义一个全局的url

/**
 * @desc 获取跳转页面地址
 * @method viewData
 */
function viewData() {
        content = getRootPath() + "/../src/html/task/custom_task/view_custom_detectedData.html?detectMethod="+ detectMethod +"&templateId=" + templateId +"&id=";
}

/**
 * @desc 驳回重测测试桩
 */
function rejected() {
    uncheck('rejected');
    var rows = $('#tb-all-task').bootstrapTable('getSelections');
    var preventDblClick = false;
    if (rows.length < 1) {
        parent.layer.alert(getLanguageValue("select_recheck_marker"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    var pipelineName = "";  //管线名称
    var markerNumber = ""   //测试桩编号
    var objectID = "";  //检测数据ID
    var taskID = "";    //任务id
    var markerID = ""   //测试桩ID
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].detectStatus == "未检测") {
            continue;
        }
        if (i != rows.length - 1) {
            objectID += rows[i].objectId + ','
            taskID += rows[i].taskId + ','
            markerID += rows[i].markerId + ','
            markerNumber += rows[i].markerNumber + ",";
            pipelineName += rows[i].pipelineName + ",";
        } else {
            objectID += rows[i].objectId
            taskID += rows[i].taskId
            markerID += rows[i].markerId
            markerNumber += rows[i].markerNumber;
            pipelineName += rows[i].pipelineName;
        }
    }

    if (pipelineName.length == 0) {
        parent.layer.alert(getLanguageValue("select_checked_marker"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("recheck"),
        area: ['600px', '550px'],
        btn: [getLanguageValue("confirm"), getLanguageValue("cancel")],
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            if(!preventDblClick){
                var objWindow = layero.find('iframe')[0].contentWindow;
                var result = objWindow.submitData();
                if (result == true) {
                    // //刷新曲线图
                    // if (detectMethod == 2) {
                    //     $.getScript("../../../js/task/specific_task/graph_m2.js");
                    // } else if (detectMethod == 1) {
                    //     $.getScript("../../../js/task/specific_task/graph_m1.js");
                    // } else if (detectMethod == 3 || detectMethod == 6) {
                    //     $.getScript("../../../js/task/specific_task/graph_m3_m6.js");
                    // }
                    //刷新测试桩页面数据
                    $('#tb-all-task').bootstrapTable('refresh', true);
                    parent.layer.close(index);
                    preventDblClick = true;
                }
            }else{
                preventDblClick = false;
            }
        },
        btn2: function (index, layero) { },
        end: function (index, layero) {
            parent.layer.close(index);
        },
        content: getRootPath() + "/../src/html/task/custom_task/reject_custom_detectedData.html?markerNumber=" + encodeURI(markerNumber) + '&pipelineName=' + encodeURI(pipelineName) + '&objectID=' + objectID + '&taskID=' + taskID + '&markerID=' + markerID + '&token=' + token + '&detectMethod=' + detectMethod
    });
}

/**
 * @desc 审核通过
 * @returns {*String} result
 */
function approved() {
    var approvedData = "";
    var approvedSuccessMsg = ""
    var hintMsg = ""
    var detectUser = JSON.parse(lsObj.getLocalStorage("userBo")).objectId;
    //taskStatus// 待领取  1// 执行中  2// 待审核  3// 已审核  4
    if ((roleNum == 2 && taskStatus == "2") || (detectUser == detectUserId && taskStatus == "2")) { //是现场检测人员且任务状态执行中或者具有现场检测人员的角色且任务状态执行中
        approvedData = { 'taskId': objectId, 'taskStatus': 3 }
        approvedSuccessMsg = getLanguageValue("submit_audit");
        hintMsg = "提交审核"
    } else if ((roleNum == 2 && taskStatus == "1") || (detectUser == detectUserId && taskStatus == "1")) {  //是现场检测人员且任务状态待领取或者具有现场检测人员的角色且任务状态待领取
        approvedData = { 'taskId': objectId, 'taskStatus': 2 }
        approvedSuccessMsg = getLanguageValue("get_task");
        hintMsg = "领取任务"
    } else {
        approvedData = { 'taskId': objectId, 'taskStatus': 4 }
        approvedSuccessMsg = getLanguageValue("approval");
        hintMsg = "审核通过"
    }
    var result = false;
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/setTaskStatus?token=" + token,
        dataType: "json",
        type: "post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(approvedData),
        async: false,
        success: function (res) {
            if (res.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track(hintMsg, { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                parent.layer.msg(approvedSuccessMsg, {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
                result = true;
                return result;
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track(hintMsg, { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (error) {

                }
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
            result = false;
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }

    })
    return result;
}

/**
 * @desc 导出测试桩数据
 * @method exportSelect
 */
function exportSelect() {
    uncheck("exportSelect");
    var rows = $('#tb-all-task').bootstrapTable('getSelections');
    if (rows.length < 1) {
        parent.layer.alert(getLanguageValue("select_export"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    var objectID = "";
    var markNum = "";
    var dataId = "";
    for (var i = 0; i < rows.length; i++) {
        if (i != rows.length - 1) {
            objectID += rows[i].markerId + ',';
            dataId += rows[i].objectId + ',';
            markNum += rows[i].markerNumber + ',';
        } else {
            objectID += rows[i].markerId;
            dataId += rows[i].objectId;
            markNum += rows[i].markerNumber;
        }
    }
     var url = "/cloudlink-corrosionengineer/task/exportDetectData?token=" + token  + '&type=selected'+ '&method=' + detectMethod +'&taskName='+taskName+ '&taskId=' + objectId+ '&objectIds=' + objectID;
    $('#exportData').attr("src", url);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出选中检测数据', { '任务类型': 'M' + detectMethod });
        }
    } catch (error) {

    }
}

/**
 * @desc 导出全部测试数据
 * @method exportAll
 */
function exportAll() {
    uncheck("exportAll");
    rowDate = $('#tb-all-task').bootstrapTable('getData');
    if (rowDate.length <= 0) {
        parent.layer.alert(getLanguageValue("no_export"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    var url = "/cloudlink-corrosionengineer/task/exportDetectData?token=" + token + '&type=query'  + '&method=' + detectMethod+'&taskName='+
    taskName+ '&taskId=' + objectId+ '&detectResult=' + items.detectResult  + '&startMarkNum=' + $("#pipestartNumberName1").val() + '&pipelineId=' +
    $("#pipeName1").val() + '&endMarkNum=' + 
    $("#pipeendNumberName1").val()  + '&detectStatus=' + $('#detectStatus').val() + '&recorder=' +
    $("#recorder").val()+'&markNum='+$("#markerNumber").val()+'&markerStatus='+items.markerStatus+'&minDetectTime='+$("#minDetectTime").val()+
    '&maxDetectTime='+$("#maxDetectTime").val()+"&language="+lsObj.getLocalStorage("i18nLanguage");
    $('#exportData').attr("src", url);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出全部检测数据', { '任务类型': 'M' + detectMethod });
        }
    } catch (error) {

    }
}

/**
 * @desc 编辑修改分析结果字段
 */
function setAnalysisResult(data){
     $.ajax({
        url: "/cloudlink-corrosionengineer/task/setAnalysisResult?token="+token,
        contentType: "application/json; charset=utf-8",
        type: "post",
        data: JSON.stringify(data),
        dataType: 'JSON',
        success: function (res) {
            $('#tb-all-task').bootstrapTable('refresh', true);
            if (res.success == 1) {
                parent.layer.msg(getLanguageValue("edit_success"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
            }else{
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 加载数据检测项
 */
function  loadDataDetection(){
    var  resultData = [[{
            checkbox: true,
            rowspan: 2
        }, {
            title:  getLanguageValue("no"),
            rowspan: 2,
            formatter: function (value, row, index) {
                return currentPageSize * (currentPageNumber - 1) + index + 1;
            }
        }, {
            field: 'markerNumber',
            title: getLanguageValue("markerNumber"),
            sortable: true,
            rowspan: 2
        }, {
            field: 'pipelineName',
            title: getLanguageValue("pipelinename"),
            sortable: true,
             rowspan: 2,
        }, {
            field: 'detectStatus',
            title: getLanguageValue("detectStatu"),
             rowspan: 2,
        }, {
            field: 'createUserName',
            title: getLanguageValue("createUser"),
             rowspan: 2,
        }, {
            field: analysisResult,
            title:  getLanguageValue("analysisResult"),
            // sortable: true,
            width: '7%',
            class: 'td-nowrap',
            rowspan: 2,
            editable: {
                type: 'select',
                title:  getLanguageValue("analysisResult"),
                source: [{ value: 0, text: "——" }, { value: 1, text:  getLanguageValue("normal")  }, {value:2,text: getLanguageValue("high") }, {value:3,text: getLanguageValue("low") }]
            }
        }, {
            field: 'detectTime',
            title: getLanguageValue("createTime"),
            sortable: true,
            class: 'td-nowrap',
             rowspan: 2,
        }, {
            title:getLanguageValue("operate"),
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#"  title=" ' + getLanguageValue("view") + '" " onclick="viewDetectedData(\'' +
                    row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                return e;
            },
            rowspan: 2
        }],[]];
   
     $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/template/query?token=' + token +"&hasContent=1&isVisible=1&templateType=1&objectId="+templateId),
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if(result.success == 1){
                var templateContent = result.list[0].templateContent
                if(!isNull(templateContent)){
                    var templateContentArr = JSON.parse(templateContent),
                        langulage = lsObj.getLocalStorage("i18nLanguage"),
                        typeName = "";
                    if(langulage == "en"){
                        typeName = "$.type"
                    }else{
                        typeName = "$.typename"
                    }
                    var dataList = Enumerable.From(templateContentArr).GroupBy(typeName,null,function(key,e){return {
                        typeName: key,
                        list:e.ToArray()
                    }}).ToArray();
                    for(var idx in dataList){
                        var listArr = dataList[idx].list,
                            arr1 = {
                                title: dataList[idx].typeName,
                                rowspan: 1,
                                colspan: listArr.length
                            };
                        resultData[0].splice(resultData[0].length-3,0,arr1);
                        for(var idx2 in listArr){
                            var itemsTitle = listArr[idx2].ch + getUnit(listArr[idx2].fieldName);
                            if(langulage == "en"){
                                itemsTitle = listArr[idx2].en + getUnit(listArr[idx2].fieldName);
                            };
                            var fieldName = listArr[idx2].fieldName;
                            if(fieldName == "propertyOfDrainageDevice"){
                                fieldName = "drainageVal"
                            }
                            if(fieldName == "anodeMaterial"){
                                fieldName = "anodeMaterialVal"
                            }
                            var arr2 = {
                                field: fieldName,
                                title: itemsTitle,
                                sortable: true,
                                align: 'center'
                            }
                            if(fieldName == "anodeMaterialVal"){
                                arr2.formatter =  function (value, row, index) {
                                    return  getLanguageValue(row.anodeMaterialVal)
                                }
                            }
                            if(fieldName == "drainageVal"){
                                arr2.formatter =  function (value, row, index) {
                                    return  getLanguageValue(row.drainageVal)
                                }
                            }
                            resultData[1].push(arr2);
                        }
                    }
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
    return resultData;
}

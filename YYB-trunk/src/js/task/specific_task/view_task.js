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

var map = new BMap.Map("task-map"); //创建一个地图实例
var mapBtn = $(".bottom-btn span");
var mapContainer = $("#task-map"); //百度地图DIV容器
var detectMethod = getParameter('detectMethod'); //检测方法
var detectUserId = getParameter('detectUserId'); //检测检测人员ID
var taskStatus = decodeURI(getParameter('taskStatus')); //任务状态
var taskName = decodeURI(getParameter('taskName')); //任务名称
var token = lsObj.getLocalStorage('token');
var source = null;
var analysisResult = "";
//定义网格化传入参数的值
var items = {
    "detectResult": '', //检测结果
    "markerStatus":'' //桩状况
}
var currentPageNumber; //定义一个全局变量
var currentPageSize;    //定义一个全局变量
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

    if(roleNum == "2"){
        $.fn.bootstrapTable.defaults.editable = false;
        analysisResult = "analysisResultVal";
    }else{
        analysisResult = "analysisResult";
    }
    if (detectMethod == 1) {    //检测方法为1 
        $("#analysisResultM1").css("display", "inherit");
        // $.getScript("../../../js/task/specific_task/graph_m1.js");
        // $('#graphTwo').css('display', 'none');
        M1();   //初始化任务1的表格
    } else if (detectMethod == 2) { //检测方法为2
        $(".son_wrapper .line").css("display", "none");
        $("#analysisResultM2").css("display", "inherit");
        $.getScript("../../../js/task/specific_task/graph_m2.js");
        M2();   //初始化任务2的表格
    } else if (detectMethod == 3 || detectMethod == 6) {    //检测方法为3,6
        $(".son_wrapper .line").css("display", "none");
        $("#analysisResultM3").css("display", "inherit");
        $.getScript("../../../js/task/specific_task/graph_m3_m6.js");
        $('#graphTwo').css('display', 'none');
        M3();   //初始化任务3,6的表格

    } else if (detectMethod == 4) { //检测方法为4
        $(".son_wrapper .line").css("display", "none");
        $("#analysisResultM4").css('display', "inherit");
        $('#curve').css('display', 'none');
        source = [{ value: 0, text: "——" }, { value: 1, text: getLanguageValue("riskFree") }, {value:2,text:getLanguageValue("circuit")}];
        M4();   //初始化任务4的表格
    } else if (detectMethod == 5) { //检测方法为5
        $(".son_wrapper .line").css("display", "none");
        $("#analysisResultM5").css("display", "inherit");
        $('#curve').css('display', 'none');
        source = [{ value: 0, text: "——" }, { value: 1, text: getLanguageValue("interfered") }, {value:2,text:"无干扰"}];
        M5();   //初始化任务5的表格
    } else if (detectMethod == 7) { //检测方法为7
        $(".son_wrapper .line").css("display", "none");
        $("#analysisResultM7").css("display", "inherit");
        $('#curve').css('display', 'none');
        M7();   //初始化任务7的表格
    } else if (detectMethod == 8) { //检测方法为8
        $(".son_wrapper .line").css("display", "none");
        $("#analysisResultM8").css("display", "inherit");
        $('#curve').css('display', 'none');
        source = [{ value: 0, text: "——" }, { value: 1, text: getLanguageValue("good") }, {value:2,text: getLanguageValue("shorted")}];
        M8();   //初始化任务8的表格
    } else if (detectMethod == 9) { //检测方法为9
        $(".son_wrapper .line").css("display", "none");
        $("#analysisResultM9").css("display", "inherit");
        $('#curve').css('display', 'none');
        source = [{ value: 0, text: "——" }, { value: 1, text: getLanguageValue("runNormal") }, {value:2,text: getLanguageValue("runAbormal")}];
        M9();   //初始化任务9的表格
    } else if (detectMethod == 10) {    //检测方法为10
        $(".son_wrapper .line").css("display", "none");
        $("#analysisResultM10").css("display", "inherit");
        $('#curve').css('display', 'none');
        source = [{ value: 0, text: "——" }, { value: 1, text: getLanguageValue("normal") }, {value:2,text: getLanguageValue("polarized") }];
        M10();  //初始化任务10的表格
    }
    //  else if(detectMethod == 11){      //检测方法为11
    //     $(".son_wrapper .line").css("display", "none");
    //     $("#analysisResultM11").css("display", "inherit");
    //     source = [{ value: 0, text: "——" }, { value: 1, text:  getLanguageValue("normal")  }, {value:2,text: getLanguageValue("high") }, {value:3,text: getLanguageValue("low") }];
    //     $.getScript("../../../js/task/specific_task/graph_m11.js");
    //     M11();  //初始化任务10的表格
    // } 
    
    // else{
    //     // M10之后的...
    //     // $(".son_wrapper .line").css("display", "none");
    //     // $('#curve').css('display', 'none');

    // }

   
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
     //回车查询曲线图
    $("#searchForm").keydown(function() {
        if (event.keyCode == "13") { //keyCode=13是回车键
            queryGraph();
        }
    });
    $('.more').click(function() {
        $('.more').toggleClass("active");
        $('.more_item_wrapper').toggle();
    }); 
    clickSearch();

    // getUnit(); // 获取单位
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
 * @desc 任务m1网格化
 */
function M1() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url进行权限处理
    Option1 = {
        url: url,
        method: 'get', //请求方式（*）
        toolbar: '#toolbar',
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        columns: [
            [{
                checkbox: true,
                rowspan: 2,
            }, {
                title: getLanguageValue("no"),
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: getLanguageValue("markerNumber"),
                width: '7%',
                sortable: true,
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '10%',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '5%',
                rowspan: 2
            }, {
                title:  getLanguageValue("potential"),
                rowspan: 1,
                colspan: 3
            }, {
                title:getLanguageValue("voltage"),
                rowspan: 1,
                colspan: 3
            }, {
                field: 'soilResistivity',
                title: getLanguageValue("soilResistivity") + getUnit("soilResistivity"),
                sortable: true,
                width: '8%',
                rowspan: 2
            }, {
                field: "analysisResult",
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                width: '8%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (row.analysisResult == 1) {
                        var res="<i class='fa fa-check-circle' aria-hidden='true'></i>";
                        return res;
                    } else if (row.analysisResult == 2) {
                        var res = "<img class='dc-style' src = '/src/images/task/dc.png'>";
                        return res;
                    } else if (row.analysisResult == 3) {
                        var res = "<img class='ac-style' src = '/src/images/task/ac.png'>";
                        return res;
                    } else if (row.analysisResult == 4) {
                        var res = "<img class='dc-style' src = '/src/images/task/dc.png' style='padding-right: 5%'>";
                        res += "<img class='ac-style' src = '/src/images/task/ac.png'>";
                        return res;
                    }

                }
            }, {
                field: 'markerStatus',
                title: getLanguageValue("markerStatus"),
                sortable: true,
                width: '8%',
                rowspan: 2
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                width: '9%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title:  getLanguageValue("createUser"),
                sortable: true,
                width: '5%',
                rowspan: 2
            }, {
                title:getLanguageValue("operate"),
                width: '5%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var res = '<a href="#" mce_href="#" title=" ' + getLanguageValue("view") +'" onclick="viewDetectedData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return res;
                }
            }],
            [{
                field: 'onPotentialOfMax',
                title: getLanguageValue("Max") + getUnit("onPotentialOfMax"),
                sortable: true,
                width: '8%'
            }, {
                field: 'onPotentialOfMin',
                title: getLanguageValue("Min") + getUnit("onPotentialOfMin"),
                sortable: true,
                width: '8%'
            }, {
                field: 'onPotentialOfAvg',
                title: getLanguageValue("Avg") + getUnit("onPotentialOfAvg"),
                sortable: true,
                width: '8%'
            }, {
                field: 'avOfPlMax',
                title:  getLanguageValue("Max") + getUnit("avOfPlMax"),
                sortable: true,
                width: '8%'
            }, {
                field: 'avOfPlMin',
                title:  getLanguageValue("Min") + getUnit("avOfPlMin"),
                sortable: true,
                width: '8%'
            }, {
                field: 'avOfPlAvg',
                 title:  getLanguageValue("Avg") + getUnit("avOfPlAvg"),
                sortable: true,
                width: '8%'
            }]
        ],
        onDblClickRow: function (row) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {
            // console.log(res);
        }
    }
    $('#tb-all-task').bootstrapTable(Option1);
}


/**
 * @desc 任务m2网格化
 */
function M2() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url进行权限处理
    Option2 = {
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: [
            [{
                checkbox: true,
                rowspan: 2
            }, {
                title: getLanguageValue("no"),
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: getLanguageValue("markerNumber"),
                sortable: true,
                width: '10%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '10%',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '5%',
                rowspan: 2
            }, {
                title:  getLanguageValue("voltage"),
                width: '7%',
                colspan: 3
            }, {
                title: getLanguageValue("ONPotentialOFCoupon"),
                width: '7%',
                colspan: 3
            }, {

               title: getLanguageValue("OFFPotentialOFCoupon"),
                width: '7%',
                // colspan: 3
                colspan: 1
            }, {
                title: getLanguageValue("acCurrentDensity"),
                width: '7%',
                colspan: 3
            }, {
                title: getLanguageValue("dcCurrentDensity"),
                width: '7%',
                colspan: 3
            }, {
                field: 'ratioOfCouponDcAc',
                title: getLanguageValue("adcCurrentDensityRatio"),
                sortable: true,
                width: '7%',
                rowspan: 2
            }, {
                field: 'soilResistivity',
                title: getLanguageValue("soilResistivity") + getUnit("soilResistivity"),
                sortable: true,
                width: '7%',
                rowspan: 2
            }, {
                field: 'analysisResultVal',
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                class:"td-nowrap",
                width: '9%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var str = "";
                    if(language == "en"){
                        switch(row.analysisResultVal){
                            case "高腐蚀风险":
                                str = "High Corr. Risk Zone";
                            break;
                            case "低腐蚀风险":
                                str =  "Low Corr. Risk Zone"
                            break;
                            default:
                            break;
                        }
                    }else{
                        str = row.analysisResultVal
                    }
                    return str;
                }
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                width: '9%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: getLanguageValue("createUser"),
                sortable: true,
                width: '5%',
                rowspan: 2
            }, {
                field: '',
                title:getLanguageValue("operate"),
                width: '5%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var res = "<i class='glyphicon glyphicon-eye-open' title=' "  + getLanguageValue("view") +"'  onclick=\"viewDetectedData('" + row.objectId + "')\"></i></a>";
                    return res;
                }
            }],
            [{
                field: 'avOfPlMax',
                 title:  getLanguageValue("Max") + getUnit("avOfPlMax"),
                sortable: true,
                width: '7%'
            },{
                field: 'avOfPlMin',
                 title:  getLanguageValue("Min") + getUnit("avOfPlMin"),
                sortable: true,
                width: '7%'
            },{
                field: 'avOfPlAvg',
                 title:  getLanguageValue("Avg") + getUnit("avOfPlAvg"),
                sortable: true,
                width: '7%'
            }, {
                field: 'onPotentialOfCouponMax',
                title: getLanguageValue("Max") + getUnit("onPotentialOfCouponMax"),
                sortable: true,
                width: '7%'
            }, {
                field: 'onPotentialOfCouponMin',
                title: getLanguageValue("Min") + getUnit("onPotentialOfCouponMin"),
                sortable: true,
                width: '7%'
            }, {
                field: 'onPotentialOfCouponAvg',
                title: getLanguageValue("Avg") + getUnit("onPotentialOfCouponAvg"),
                sortable: true,
                width: '7%'
            },
            //  {
            //     field: 'offPotentialOfCouponMax',
            //     title: getLanguageValue("Max") + getUnit("offPotentialOfCouponMax"),
            //     sortable: true,
            //     width: '7%'
            // }, {
            //     field: 'offPotentialOfCouponMin',
            //     title: getLanguageValue("Min") + getUnit("offPotentialOfCouponMin"),
            //     sortable: true,
            //     width: '7%'
            // },
             {
                field: 'offPotentialOfCouponAvg',
                title: getLanguageValue("Avg") + getUnit("offPotentialOfCouponAvg"),
                sortable: true,
                width: '7%'
            }, {
                field: 'couponAcDensityMax',
                title: getLanguageValue("Max") + getUnit("couponAcDensityMax"),
                sortable: true,
                width: '7%'
            }, {
                field: 'couponAcDensityMin',
                title: getLanguageValue("Min") + getUnit("couponAcDensityMin"),
                sortable: true,
                width: '7%'
            }, {
                field: 'couponAcDensityAvg',
                title: getLanguageValue("Avg") + getUnit("couponAcDensityAvg"),
                sortable: true,
                width: '7%'
            }, {
                field: 'couponDcDensityMax',
                title: getLanguageValue("Max") + getUnit("couponDcDensityMax"),
                sortable: true,
                width: '7%'
            }, {
                field: 'couponDcDensityMin',
                title: getLanguageValue("Min") + getUnit("couponDcDensityMin"),
                sortable: true,
                width: '7%'
            }, {
                field: 'couponDcDensityAvg',
                title: getLanguageValue("Avg") + getUnit("couponDcDensityAvg"),
                sortable: true,
                width: '7%'
            }]
        ],
        onDblClickRow: function (row) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {
        }
    }
    $('#tb-all-task').bootstrapTable(Option2);


};

/**
 * @desc 任务m3网格化
 */
function M3() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url进行权限处理
    Option3 = {
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        pageList:[5,10,25,50,100],
        columns: [
            [{
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
                width: '10%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '9%',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '9%',
                rowspan: 2
            }, {
                title: getLanguageValue("ONPotentialOFCoupon"),
                rowspan: 1,
                colspan: 3
            }, {
               title: getLanguageValue("OFFPotentialOFCoupon"),
                rowspan: 1,
                // colspan: 3
                colspan: 1
            }, {
                title: getLanguageValue("CPCurrentDensity"),
                rowspan: 1,
                colspan: 3
            }, {
                field: 'soilResistivity',
                title: getLanguageValue("soilResistivity") + getUnit("soilResistivity"),
                sortable: true,
                width: '9%',
                rowspan: 2
            }, {
                field: 'analysisResultVal',
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                class:"td-nowrap",
                width: '9%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var str = "";
                    if(language == "en"){
                        switch(row.analysisResultVal){
                            case "高腐蚀风险":
                                str = "High Corr. Risk Zone";
                            break;
                            case "低腐蚀风险":
                                str =  "Low Corr. Risk Zone"
                            break;
                            default:
                            break;
                        }
                    }else{
                        str = row.analysisResultVal
                    }
                    return str;
                }
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                width: '9%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: getLanguageValue("createUser"),
                sortable: true,
                width: '9%',
                rowspan: 2
            }, {
                field: 'operation',
                title:getLanguageValue("operate"),
                width: '9%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" title=" ' + getLanguageValue("view") + '" onclick="viewDetectedData(\'' + row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                    return e;
                }
            }],
            [{
                field: 'onPotentialOfCouponMax',
                title: getLanguageValue("Max") + getUnit("onPotentialOfCouponMax"),
                sortable: true
            },{
                field: 'onPotentialOfCouponMin',
                title: getLanguageValue("Min") + getUnit("onPotentialOfCouponMin"),
                sortable: true
            },{
                field: 'onPotentialOfCouponAvg',
                title: getLanguageValue("Avg") + getUnit("onPotentialOfCouponAvg"),
                sortable: true
            },
            // {
            //     field: 'offPotentialOfCouponMax',
            //     title: getLanguageValue("Max") + getUnit("offPotentialOfCouponMax"),
            //     sortable: true
            // },{

            //     field: 'offPotentialOfCouponMin',
            //     title: getLanguageValue("Min") + getUnit("offPotentialOfCouponMin"),
            //     sortable: true
            // },
            {

                field: 'offPotentialOfCouponAvg',
                title: getLanguageValue("Avg") + getUnit("offPotentialOfCouponAvg"),
                sortable: true
            }, {
                field: 'cpCurrentDensityMax',
                title: getLanguageValue("Max") + getUnit("cpCurrentDensityMax"),
                sortable: true
            }, {
                field: 'cpCurrentDensityMin',
                title: getLanguageValue("Min") + getUnit("cpCurrentDensityMin"),
                sortable: true
            }, {
                field: 'cpCurrentDensityAvg',
                title: getLanguageValue("Avg") + getUnit("cpCurrentDensityAvg"),
                sortable: true
            }]
        ],
        onDblClickRow: function (row) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {
        }
    };
    $('#tb-all-task').bootstrapTable(Option3);
};
/**
 * @desc 任务m4网格化
 */
function M4() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId);  //对url进行权限处理
    $('#tb-all-task').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: [
            [{
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
                width: '10%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '9%',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '9%',
                rowspan: 2,
            }, {
                title: getLanguageValue("pipleNoPotential"),
                rowspan: 1,
                colspan: 3
            }, {
                title: getLanguageValue("pipleOffPotential"),
                rowspan: 1,
                colspan: 3
            }, {
                title: getLanguageValue("onPoteniallOfCasing"),
                rowspan: 1,
                colspan: 3
            }, {
                title: getLanguageValue("offPotenialOfCasing"),
                rowspan: 1,
                colspan: 3
            },
            {
                field: analysisResult,
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                width: '9%',
                rowspan: 2,
                editable: {
                    type: 'select',
                    title:  getLanguageValue("analysisResult"),
                    source:source
                }
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                width: '9%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: getLanguageValue("createUser"),
                sortable: true,
                width: '9%',
                rowspan: 2
            }, {
                field: 'operation',
                title:getLanguageValue("operate"),
                width: '9%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#"  title=" ' + getLanguageValue("view") + '"  onclick="viewDetectedData(\'' + row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                    return e;
                }
            }
            ],
            [{
                field: 'onPotentialOfMax',
                title: getLanguageValue("Max") + getUnit("onPotentialOfMax"),
                sortable: true,
                width: '9%',
                align: 'center'
            },{
                field: 'onPotentialOfMin',
                title: getLanguageValue("Min") + getUnit("onPotentialOfMin"),
                sortable: true,
                width: '9%',
                align: 'center'
            },{
                field: 'onPotentialOfAvg',
                title: getLanguageValue("Avg") + getUnit("onPotentialOfAvg"),
                sortable: true,
                width: '9%',
                align: 'center'
            },{
                field: 'offPotentialOfMax',
                title: getLanguageValue("Max") + getUnit("offPotentialOfMax"),
                sortable: true,
                width: '9%',
                align: 'center'
            },{
                field: 'offPotentialOfMin',
                title: getLanguageValue("Min") + getUnit("offPotentialOfMin"),
                sortable: true,
                width: '9%',
                align: 'center'
            }, {
                field: 'offPotentialOfAvg',
                title: getLanguageValue("Avg") + getUnit("offPotentialOfAvg"),
                sortable: true,
                width: '9%',
                align: 'center'
            },{
                field: 'onPoteniallOfCasingMax',
                title: getLanguageValue("Max") + getUnit("onPoteniallOfCasingMax"),
                sortable: true,
                width: '9%',
                align: 'center'
            }, {
                field: 'onPoteniallOfCasingMin',
                title: getLanguageValue("Min") + getUnit("onPoteniallOfCasingMin"),
                sortable: true,
                width: '9%',
                align: 'center'
            },{
                field: 'onPoteniallOfCasing',
                title: getLanguageValue("Avg") + getUnit("onPoteniallOfCasing"),
                sortable: true,
                width: '9%',
                align: 'center'
            },{
                field: 'offPotenialOfCasingMax',
                title: getLanguageValue("Max") + getUnit("offPotenialOfCasingMax"),
                sortable: true,
                width: '9%',
                align: 'center'
            }, {
                field: 'offPotenialOfCasingMin',
                title: getLanguageValue("Min") + getUnit("offPotenialOfCasingMin"),
                sortable: true,
                width: '9%',
                align: 'center'
            },{
                field: 'offPotenialOfCasing',
                title: getLanguageValue("Avg") + getUnit("offPotenialOfCasing"),
                sortable: true,
                width: '9%',
                align: 'center'
            } ]
        ],
        onDblClickRow: function (row) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onEditableSave: function (field, row, oldValue, $el) {
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
 * @desc 任务m5网格化
 */
function M5() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId);  //对url权限进行处理
    $('#tb-all-task').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: [
            [{
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
                width: '8%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '10%',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '5%',
                rowspan: 2,
            }, {
                title: getLanguageValue("selfRectifierOn"),
                rowspan: 1,
                colspan: 2
            }, {
                title: getLanguageValue("selfRectifierOff"),
                rowspan: 1,
                colspan: 2
            }, {
                title: getLanguageValue("outsideRectifierOn"),
                rowspan: 1,
                colspan: 2
            }, {
                title: getLanguageValue("outsideRectifierOff"),
                rowspan: 1,
                colspan: 2
            }, {
                field: 'offPotentialOfAvg',
                title: getLanguageValue("offPotentialOfAvg") + getUnit("offPotentialOfAvg"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'soilResistivity',
                title: getLanguageValue("soilResistivity") + getUnit("soilResistivity"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: analysisResult,
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                width: '7%',
                rowspan: 2,
                editable: {
                    type: 'select',
                    title:  getLanguageValue("analysisResult"),
                    source:source
                }
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                width: '6%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: getLanguageValue("createUser"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                title:getLanguageValue("operate"),
                width: '5%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var res = '<a href="#" mce_href="#"  title=" ' + getLanguageValue("view") + '"  onclick="viewDetectedData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return res;
                }
            }],
            [{
                field: 'plPotentialRecitifierOn',
                title: getLanguageValue("selfPiple") + getUnit("plPotentialRecitifierOn"),
                sortable: true,
                width: '6%'
            }, {
                field: 'forPlPotentialRecitifierOn',
                 title: getLanguageValue("outsidePiple") + getUnit("forPlPotentialRecitifierOn"),
                sortable: true,
                width: '6%'
            }, {
                field: 'plPotentialRecitifierOff',
                title: getLanguageValue("selfPiple") + getUnit("plPotentialRecitifierOff"),
                sortable: true,
                width: '6%'
            }, {
                field: 'forPlPotentialRecitifierOff',
                 title: getLanguageValue("outsidePiple") + getUnit("forPlPotentialRecitifierOff"),
                sortable: true,
                width: '6%'
            }, {
                field: 'plPotentialForRecitifierOn',
                title: getLanguageValue("selfPiple") + getUnit("plPotentialForRecitifierOn"),
                sortable: true,
                width: '6%'
            }, {
                field: 'forPlPotentialForRecitifierOn',
                 title: getLanguageValue("outsidePiple") + getUnit("forPlPotentialForRecitifierOn"),
                sortable: true,
                width: '6%'
            }, {
                field: 'plPotentialForRecitifierOff',
                title: getLanguageValue("selfPiple") + getUnit("plPotentialForRecitifierOff"),
                sortable: true,
                width: '6%'
            }, {
                field: 'forPlPotentialForRecitifierOff',
                 title: getLanguageValue("outsidePiple") + getUnit("forPlPotentialForRecitifierOff"),
                sortable: true,
                width: '6%'
            }]
        ],
        onDblClickRow: function (row) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onEditableSave: function (field, row, oldValue, $el) {
            var data = {
                "objectID":row.objectId,
                "taskID":row.taskId,
                "result":row.analysisResult
            }
            setAnalysisResult(data);
        },
        onLoadSuccess: function (res) {

            if (res.rows.length == 0) {
                $('#graph').css('display', 'none')
            }
        }

    });
}

/**
 * @desc 任务m7网格化
 */
function M7() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url权限进行处理
    $('#tb-all-task').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: [
            [{
                checkbox: true,
                rowspan: 2,
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
                width: '5%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '4%',
                rowspan: 2
            } ,{
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '4%',
                rowspan: 2
            }, {
                field: '',
                title: getLanguageValue("recordingTime"),
                width: '5%',
                rowspan: 2
            }, {
                title:  getLanguageValue("voltage"),
                rowspan: 1,
                colspan: 3
            }, {
                title: getLanguageValue("potential"),
                rowspan: 1,
                colspan: 3
            }, {
                title: getLanguageValue("offPotential"),
                rowspan: 1,
                colspan: 3
            }, {
               title: getLanguageValue("acCurrentDensity"),
                rowspan: 1,
                colspan: 3
            }, {
                title: getLanguageValue("dcCurrentDensity"),
                rowspan: 1,
                colspan: 3
            }, {
                field: 'analysisResult',
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                width: '4%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (row.analysisResult == 1) {
                        return;
                    } else if (row.analysisResult == 2) {
                        var res = "<img class='dc-style' src = '/src/images/task/dc.png'>";
                        return res;
                    } else if (row.analysisResult == 3) {
                        var res = "<img class='ac-style' src = '/src/images/task/ac.png'>";
                        return res;
                    } else if (row.analysisResult == 4) {
                        var res = "<img class='dc-style' src = '/src/images/task/dc.png' style='padding-right: 5%'>";
                        res += "<img class='ac-style' src = '/src/images/task/ac.png'>";
                        return res;
                    }

                }
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                width: '4%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: getLanguageValue("createUser"),
                sortable: true,
                width: '5%',
                rowspan: 2
            }, {
                title:getLanguageValue("operate"),
                width: '5%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var res = '<a href="#" mce_href="#"  title=" ' + getLanguageValue("view") + '"  onclick="viewDetectedData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return res;
                }
            }],
            [{
                field: 'avOfPlMax',
                title: getLanguageValue("Max") + getUnit("avOfPlMax"),
                sortable: true,
                width: '4%'
            }, {
                field: 'avOfPlMin',
                title: getLanguageValue("Min") + getUnit("avOfPlMin"),
                sortable: true,
                width: '4%'
            }, {
                field: 'avOfPlAvg',
                title:  getLanguageValue("Avg") + getUnit("avOfPlAvg"),
                sortable: true,
                width: '4%'
            },{
                field: 'onPotentialOfMax',
                title: getLanguageValue("Max") + getUnit("onPotentialOfMax"),
                sortable: true,
                width: '4%'
            }, {
                field: 'onPotentialOfMin',
                title: getLanguageValue("Min") + getUnit("onPotentialOfMin"),
                sortable: true,
                width: '4%'
            }, {
                field: 'onPotentialOfAvg',
                title: getLanguageValue("Avg") + getUnit("onPotentialOfAvg"),
                sortable: true,
                width: '4%'
            },{
                field: 'offPotentialOfMax',
                 title: getLanguageValue("Max") + getUnit("offPotentialOfMax"),
                sortable: true,
                width: '4%'
            }, {
                field: 'offPotentialOfMin',
                title: getLanguageValue("Min") + getUnit("offPotentialOfMin"),
                sortable: true,
                width: '4%'
            }, {
                field: 'offPotentialOfAvg',
                title: getLanguageValue("Avg") + getUnit("offPotentialOfAvg"),
                sortable: true,
                width: '4%'
            },{
                field: 'plToCouponAcMax',
                title: getLanguageValue("Max") + getUnit("plToCouponAcMax"),
                sortable: true,
                width: '4%'
            }, {
                field: 'plToCouponAcMin',
                title: getLanguageValue("Min") + getUnit("plToCouponAcMin"),
                sortable: true,
                width: '4%'
            }, {
                field: 'plToCouponAcAvg',
                title: getLanguageValue("Avg") + getUnit("plToCouponAcAvg"),
                sortable: true,
                width: '4%'
            },{
                field: 'couponToPlDcMax',
                title: getLanguageValue("Max") + getUnit("couponToPlDcMax"),
                sortable: true,
                width: '4%'
            }, {
                field: 'couponToPlDcMin',
                title: getLanguageValue("Min") + getUnit("couponToPlDcMin"),
                sortable: true,
                width: '4%'
            }, {
                field: 'couponToPlDcAvg',
                title: getLanguageValue("Avg") + getUnit("couponToPlDcAvg"),
                sortable: true,
                width: '4%'
            }]
        ],
        onDblClickRow: function (row) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {
            if (res.rows.length == 0) {
                $('#graph').css('display', 'none')
            }
        }

    });
}
/**
 * @desc 任务m8网格化
 */
function M8() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url 进行权限处理
    $('#tb-all-task').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: [[{
            checkbox: true,
            rowspan: 2,
            valign: "middle"
        }, {
            title:  getLanguageValue("no"),
            rowspan: 2,
            formatter: function (value, row, index) {
                return currentPageSize * (currentPageNumber - 1) + index + 1;
            }
        }, {
            field: 'markerNumber',
            rowspan: 2,
            title: getLanguageValue("markerNumber"),
            sortable: true,
            width: '10%'
        }, {
            field: 'pipelineName',
            rowspan: 2,
            title: getLanguageValue("pipelinename"),
            sortable: true,
            width: '9%'
        }, {
            field: 'detectStatus',
            rowspan: 2,
            title: getLanguageValue("detectStatu"),
            width: '9%'
        }, {
            title: getLanguageValue("onPotentialOfAvg"), //站外通电电位
            rowspan: 1,
            colspan: 3
        }, {
            title: getLanguageValue("offPotentialAvg"), //站外管道断电电位
            rowspan: 1,
            colspan: 3
        }, {
            field: 'avOfPlAvg', // 站外管道交流电压
            rowspan: 2,
            title: getLanguageValue("avOfPlAvg") + getUnit("avOfPlAvg"),
            sortable: true,
            width: '9%'
        }, {
            title:  getLanguageValue("couponOfPlNonProtectSide"), //站内通电电位平均值
            rowspan: 1,
            colspan: 3
        }, {
            title:  getLanguageValue("OffPotentialOfPlNonProtectSide"), //站内断电电位平均值
            rowspan: 1,
            colspan: 3
        }, {
            field: 'plOffAcPotentialSsdDisconnectedMax',  //  断开去耦合器管道交流电压
            rowspan: 2,
            title: getLanguageValue("plOffAcPotentialSsdDisconnectedMax") + getUnit("plOffAcPotentialSsdDisconnectedMax"),
            sortable: true,
            width: '9%'
        }, {
            field: 'avOfPlNonProtectSide',  //  站内交流电压
            rowspan: 2,
            title: getLanguageValue("avOfPlNonProtectSide") + getUnit("avOfPlNonProtectSide"),
            sortable: true,
            width: '9%'
        }, {
            field: 'crossoverCurrent',
            rowspan: 2,
            title: getLanguageValue("crossoverCurrent") + getUnit("crossoverCurrent"),
            sortable: true,
            width: '9%'
        }, {
            field: analysisResult,
            rowspan: 2,
            title:  getLanguageValue("analysisResult"),
            // sortable: true,
            width: '7%',
            editable: {
                type: 'select',
                title:  getLanguageValue("analysisResult"),
                source:source
            }
        }, {
            field: 'detectTime',
            rowspan: 2,
            title: getLanguageValue("createTime"),
            sortable: true,
            width: '9%'
        }, {
            field: 'createUserName',
            rowspan: 2,
            title: getLanguageValue("createUser"),
            sortable: true,
            width: '9%'
        }, {
            field: 'option',
            rowspan: 2,
            title:getLanguageValue("operate"),
            width: '9%',
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#"  title=" ' + getLanguageValue("view") + '"  onclick="viewDetectedData(\'' +
                    row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                return e;
            }
        }],[
            {  // 站外通电电位
                field: 'onPotentialOfMax',
                rowspan: 1,
                title: getLanguageValue("Max") + getUnit("onPotentialOfMax"),
                sortable: true,
                width: '9%'
            },{
                field: 'onPotentialOfMin',
                rowspan: 1,
                title: getLanguageValue("Min") + getUnit("onPotentialOfMin"),
                sortable: true,
                width: '9%'
            },{
                field: 'onPotentialOfAvg',
                rowspan: 1,
                title: getLanguageValue("Avg") + getUnit("onPotentialOfAvg"),
                sortable: true,
                width: '9%'
            },
            {  // 站外管道断电电位
                field: 'offPotentialOfMax',
                rowspan: 1,
                title: getLanguageValue("Max") + getUnit("offPotentialOfMax"),
                sortable: true,
                width: '9%'
            },{
                field: 'offPotentialOfMin',
                rowspan: 1,
                title: getLanguageValue("Min") + getUnit("offPotentialOfMin"),
                sortable: true,
                width: '9%'
            },{
                field: 'offPotentialOfAvg',
                rowspan: 1,
                title: getLanguageValue("Avg") + getUnit("offPotentialOfAvg"),
                sortable: true,
                width: '9%'
            },
            {  // 站内通电电位
                field: 'couponOfPlNonProtectSideMax',
                rowspan: 1,
                title: getLanguageValue("Max") + getUnit("couponOfPlNonProtectSideMax"),
                sortable: true,
                width: '9%'
            },{
                field: 'couponOfPlNonProtectSideMin',
                rowspan: 1,
                title: getLanguageValue("Min") + getUnit("couponOfPlNonProtectSideMin"),
                sortable: true,
                width: '9%'
            },{
                field: 'couponOfPlNonProtectSide',
                rowspan: 1,
                title: getLanguageValue("Avg") + getUnit("couponOfPlNonProtectSide"),
                sortable: true,
                width: '9%'
            },
            {  // 站内断电电位
                field: 'offPotentialOfPlNonProtectSideMax',
                rowspan: 1,
                title: getLanguageValue("Max") + getUnit("offPotentialOfPlNonProtectSideMax"),
                sortable: true,
                width: '9%'
            },{
                field: 'offPotentialOfPlNonProtectSideMin',
                rowspan: 1,
                title: getLanguageValue("Min") + getUnit("offPotentialOfPlNonProtectSideMin"),
                sortable: true,
                width: '9%'
            },{
                field: 'offPotentialOfPlNonProtectSideAvg',
                rowspan: 1,
                title: getLanguageValue("Avg") + getUnit("offPotentialOfPlNonProtectSideAvg"),
                sortable: true,
                width: '9%'
            }
        ]],
        onDblClickRow: function (row, field) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onEditableSave: function (field, row, oldValue, $el) {
            var data = {
                "objectID":row.objectId,
                "taskID":row.taskId,
                "result":row.analysisResult
            }
            setAnalysisResult(data);
        },
        onLoadSuccess: function (res) { }
    });
};

/**
 * @desc 任务m9网格化
 */
function M9() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url进行权限处理
    $('#tb-all-task').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: [
            [{
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
                width: '6%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '6%',
                rowspan: 2,
            }, {
                title:  getLanguageValue("outputCurrent"),
                colspan: 3
            }, {
                title: getLanguageValue("outputVoltage"),
                colspan: 3
            }, {
                field: 'cpLoopResistance',
                title: getLanguageValue("cpLoopResistance") + getUnit("cpLoopResistance"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'setupPotentialOfRecitifier',
                title: getLanguageValue("setupPotentialOfRecitifier") + getUnit("setupPotentialOfRecitifier"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'setupOffPotentialOfRecitifier',
                title:  getLanguageValue("setupOffPotentialOfRecitifier") + getUnit("setupOffPotentialOfRecitifier"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'onPotentialOnPipeConnectionAvg',
                title: getLanguageValue("onPotentialOnPipeConnectionAvg") + getUnit("onPotentialOnPipeConnectionAvg"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'offPotentialOnPipeConnectionAvg',
                title: getLanguageValue("offPotentialOnPipeConnectionAvg") + getUnit("offPotentialOnPipeConnectionAvg"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'onPotentialOnAnodeAvg',
                title: getLanguageValue("onPotentialOnAnodeAvg") + getUnit("onPotentialOnAnodeAvg"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'offPotentialOnAnodeAvg',
                title:  getLanguageValue("offPotentialOnAnodeAvg") + getUnit("offPotentialOnAnodeAvg"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'apparentResistanceOfPl',
                title: getLanguageValue("apparentResistanceOfPl") + getUnit("apparentResistanceOfPl"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: 'apparentResistanceOfGroundbed',
                title: getLanguageValue("apparentResistanceOfGroundbed") + getUnit("apparentResistanceOfGroundbed"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                field: analysisResult,
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                width: '7%',
                rowspan: 2,
                editable: {
                    type: 'select',
                    title:  getLanguageValue("analysisResult"),
                    source:source
                }
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: getLanguageValue("createUser"),
                sortable: true,
                width: '6%',
                rowspan: 2
            }, {
                title:getLanguageValue("operate"),
                width: '6%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#"  title=" ' + getLanguageValue("view") + '"  onclick="viewDetectedData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return e;
                }
            }],
            [{
                field: 'outputCurrentOfRecitifierMax',
                title: getLanguageValue("Max") + getUnit("outputCurrentOfRecitifierMax"),
                sortable: true,
                width: '5%',
            },{
                field: 'outputCurrentOfRecitifierMin',
                title: getLanguageValue("Min") + getUnit("outputCurrentOfRecitifierMin"),
                sortable: true,
                width: '5%',
            },{
                field: 'outputCurrentOfRecitifierAvg',
                title: getLanguageValue("Avg") + getUnit("outputCurrentOfRecitifierAvg"),
                sortable: true,
                width: '5%',
            }, {
                field: 'outputVoltageOfRecitifierMax',
                title: getLanguageValue("Max") + getUnit("outputVoltageOfRecitifierMax"),
                sortable: true,
                width: '5%',
            }, {
                field: 'outputVoltageOfRecitifierMin',
                title: getLanguageValue("Min") + getUnit("outputVoltageOfRecitifierMin"),
                sortable: true,
                width: '5%',
            }, {
                field: 'outputVoltageOfRecitifierAvg',
                title: getLanguageValue("Avg") + getUnit("outputVoltageOfRecitifierAvg"),
                sortable: true,
                width: '5%',
            }]
        ],
        onDblClickRow: function (row, field) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onEditableSave: function (field, row, oldValue, $el) {
            var data = {
                "objectID":row.objectId,
                "taskID":row.taskId,
                "result":row.analysisResult
            }
            setAnalysisResult(data);
        }
    });
};

/**
 * @desc 任务m10网格化
 */
function M10() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url进行权限处理
    $('#tb-all-task').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: [
            [{
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
                width: '7%',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '7%',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '7%',
                rowspan: 2,
            }, {
                title:  getLanguageValue("potentialSurvey"),
                colspan: 2
            }, {
                title: getLanguageValue("galvanicAnode"),
                colspan: 4
            }, {
                field: analysisResult,
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                width: '7%',
                rowspan: 2,
                editable: {
                    type: 'select',
                    title:  getLanguageValue("analysisResult"),
                    source:source
                }
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                width: '7%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: getLanguageValue("createUser"),
                sortable: true,
                width: '7%',
                rowspan: 2
            }, {
                title:getLanguageValue("operate"),
                width: '7%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#"  title=" ' + getLanguageValue("view") + '"  onclick="viewDetectedData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return e;
                }
            }],
            [{
                field: 'plOnPotentialAnodeConnected',
                title: getLanguageValue("potential") + getUnit("plOnPotentialAnodeConnected"),
                sortable: true,
                width: '7%'
            }, {
                field: 'plOffPotentialAnodeDisconnected',
                title: getLanguageValue("offPotential") + getUnit("plOffPotentialAnodeDisconnected"),
                sortable: true,
                width: '7%'
            }, {
                field: 'potentialOfAnodeDisconnected',
                title: getLanguageValue("potentialOfAnodeDisconnected") + getUnit("potentialOfAnodeDisconnected"),
                sortable: true,
                width: '7%'
            }, {
                field: 'currentFromPlToAnode',
                title: getLanguageValue("currentFromPlToAnode") + getUnit("currentFromPlToAnode"),
                sortable: true,
                width: '7%'
            }, {
                field: 'sumCurrentFromPlToAnode',
                title: getLanguageValue("sumCurrentFromPlToAnode") + getUnit("sumCurrentFromPlToAnode"),
                sortable: true,
                width: '5%'
            }, {
                field: 'sumAnodeGroundResistance',
                title: getLanguageValue("sumanodeGroundResistance") + getUnit("sumAnodeGroundResistance"),
                sortable: true,
                width: '5%'
            }]
        ],
        onDblClickRow: function (row, field) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onEditableSave: function (field, row, oldValue, $el) {
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
 * @desc 任务m11网格化
 */
function M11() {
    var url = handleURL("/cloudlink-corrosionengineer/task/queryDetectionPage?taskId=" + objectId); //对url进行权限处理
    $('#tb-all-task').bootstrapTable({
        url: url,
        method: 'get', //请求方式（*）
        queryParams: queryParams,
        responseHandler: responseHandler,
        queryParamsType: "size",
        toolbar: '#toolbar',
        columns: [
            [{
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
                width: '7%',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: getLanguageValue("detectStatu"),
                width: '7%',
                rowspan: 2,
            }, {
                title:  getLanguageValue("potential"),
                // colspan: 2
            }, {
                title: getLanguageValue("off_Potential_Anodes"),
            }, {
                field: 'offPotentialOfCouponAvg',
                title: getLanguageValue("OFFPotentialOFCoupon") + getUnit("offPotentialOfCouponAvg"),
                rowspan: 2
            }, {
                field: 'selfCorrisionPotential',
                title: getLanguageValue("selfCorrisionPotential") + getUnit("selfCorrisionPotential"),
                rowspan: 2
            },{
                title: getLanguageValue("voltage")
            },{
                title: getLanguageValue("off_Potential_Voltage"),
            },{
                title: getLanguageValue("galvanicAnode"),
                colspan: 4
            }, {
                title: getLanguageValue("capacitorLeakageCurrent"),
            }, {
                title: getLanguageValue("acdischarge"),
            }, {
                field: 'drainageVal',
                title: getLanguageValue("propertyofDecouple"),
                rowspan: 2
            }, {
                field: 'soilResistivity',
                title: getLanguageValue("soilResistivity") + getUnit("soilResistivity"),
                rowspan: 2
            }, {
                field: 'phOfSoil',
                title: getLanguageValue("pHofSoil"),
                rowspan: 2
            }, {
                field: analysisResult,
                title:  getLanguageValue("analysisResult"),
                // sortable: true,
                width: '7%',
                rowspan: 2,
                editable: {
                    type: 'select',
                    title:  getLanguageValue("analysisResult"),
                    source:source
                }
            }, {
                field: 'pipelineName',
                title: getLanguageValue("pipelinename"),
                sortable: true,
                width: '7%',
                rowspan: 2
            }, {
                field: 'detectTime',
                title: getLanguageValue("createTime"),
                sortable: true,
                width: '7%',
                class: 'td-nowrap',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: getLanguageValue("createUser"),
                sortable: true,
                width: '7%',
                rowspan: 2
            }, {
                title:getLanguageValue("operate"),
                width: '7%',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#"  title=" ' + getLanguageValue("view") + '" " onclick="viewDetectedData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return e;
                }
            }],
            [{
                field: 'onPotentialOfAvg',
                title: getLanguageValue("Avg") + getUnit("onPotentialOfAvg"),
                sortable: true,
                width: '7%'
            },{
                field: 'plOffPotentialAnodeDisconnected',
                title: getLanguageValue("Avg") + getUnit("plOffPotentialAnodeDisconnected"),
                sortable: true,
                width: '7%'
            }, {
                field: 'avOfPlAvg',
                title: getLanguageValue("Avg") + getUnit("avOfPlAvg"),
                sortable: true,
                width: '7%'
            }, {
                field: 'avOfPlAnodeDisconnectedAvg',
                title: getLanguageValue("Avg") + getUnit("avOfPlAnodeDisconnectedAvg"),
                sortable: true,
                width: '7%'
            }, {
                field: 'potentialOfAnodeDisconnected',
                title:  getLanguageValue("potentialOfAnodeDisconnected") + getUnit("potentialOfAnodeDisconnected"),
                sortable: true,
                width: '7%'
            }, {
                field: 'currentFromPlToAnode',
                title:  getLanguageValue("currentFromPlToAnode") + getUnit("currentFromPlToAnode"),
                sortable: true,
                width: '5%'
            }, {
                field: 'sumCurrentFromPlToAnode',
                title:  getLanguageValue("sumCurrentFromPlToAnode") + getUnit("sumCurrentFromPlToAnode"),
                sortable: true,
                width: '5%'
            }, {
                field: 'sumanodeGroundResistance',
                title:  getLanguageValue("sumanodeGroundResistance") + getUnit("sumanodeGroundResistance"),
                sortable: true,
                width: '5%'
            }, {
                field: 'leakageCurrentAvg',
                title: getLanguageValue("Avg") + getUnit("leakageCurrentAvg"),
                sortable: true,
                width: '7%'
            }, {
                field: 'acDrainageAvg',
                title: getLanguageValue("Avg") + getUnit("acDrainageAvg"),
                sortable: true,
                width: '7%'
            }]
        ],
        onDblClickRow: function (row, field) {
            viewDetectedData(row.objectId, row.detectStatus);
        },
        onEditableSave: function (field, row, oldValue, $el) {
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
    if (isNull(id) || id =="null") {
        if (detectStatus == "未检测" && !isNull(detectStatus)) {
            parent.layer.alert(getLanguageValue("select_marker_nodata"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return;
        } else if (rows.length == 1 && (rows == [] || rows[0].detectStatus == "未检测")) {
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
        if (detectStatus == "未检测") {
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
    if (detectMethod == 1) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m1.html?detectMethod=1&id="
    } else if (detectMethod == 2) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m2.html?detectMethod=2&id="
    } else if (detectMethod == 3) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m3.html?detectMethod=3&id="
    } else if (detectMethod == 4) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m4.html?detectMethod=4&id="
    } else if (detectMethod == 5) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m5.html?detectMethod=5&id="
    } else if (detectMethod == 6) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m6.html?detectMethod=6&id="
    } else if (detectMethod == 8) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m8.html?detectMethod=8&id="
    } else if (detectMethod == 9) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m9.html?detectMethod=9&id="
    } else if (detectMethod == 10) {
        content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m10.html?detectMethod=10&id="
    }
    //  else if (detectMethod == 11) {
    //     content = getRootPath() + "/../src/html/task/specific_task/view_detectedData_m11.html?detectMethod=11&id="
    // }
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
                    //刷新曲线图
                    if (detectMethod == 2) {
                        $.getScript("../../../js/task/specific_task/graph_m2.js");
                    } else if (detectMethod == 1) {
                        $.getScript("../../../js/task/specific_task/graph_m1.js");
                    } else if (detectMethod == 3 || detectMethod == 6) {
                        $.getScript("../../../js/task/specific_task/graph_m3_m6.js");
                    }
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
        content: getRootPath() + "/../src/html/task/specific_task/reject_detectedData.html?markerNumber=" + encodeURI(markerNumber) + '&pipelineName=' + encodeURI(pipelineName) + '&objectID=' + objectID + '&taskID=' + taskID + '&markerID=' + markerID + '&token=' + token + '&detectMethod=' + detectMethod
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

/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:查看任务
 */
var roleNum = lsObj.getLocalStorage("params"); //获取角色 的标识
var objectId = getParameter("objectId"); //获取任务id

var map = new BMap.Map("task_map"); //创建一个地图实例
var $mapBtn = $(".bottom_btn span");
var $mapO = $("#task_map"); //百度地图DIV容器
var detectMethod = getParameter('detectMethod'); //检测方法
var detectUserId = getParameter('detectUserId'); //检测检测人员ID
var taskStatus = decodeURI(getParameter('taskStatus')); //任务状态
var taskName = decodeURI(getParameter('taskName')); //任务名称
var token = lsObj.getLocalStorage('token');
var closeTime;

var currentPageNumber; //定义一个全局变量
var currentPageSize;    //定义一个全局变量
$(function () {
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
    $mapO.slideUp();    //隐藏地图
    $mapBtn.attr("class", "map_down");  //追加按钮class
    // 初始化地图
    initMap();
    if (detectMethod == 1) {    //检测方法为1 
        $("#analysisResultM1").css("display", "inherit");
        $.getScript("../../../js/task/specific_task/graph_m1.js");
        $('#graph_2').css('display', 'none');
        M1();   //初始化任务1的表格
    } else if (detectMethod == 2) { //检测方法为2
        $("#analysisResultM2").css("display", "inherit");
        $.getScript("../../../js/task/specific_task/graph_m2.js");
        M2();   //初始化任务2的表格
    } else if (detectMethod == 3 || detectMethod == 6) {    //检测方法为3,6
        $("#analysisResultM3").css("display", "inherit");
        $.getScript("../../../js/task/specific_task/graph_m3_m6.js");
        $('#graph_2').css('display', 'none');
        M3();   //初始化任务3,6的表格

    } else if (detectMethod == 4) { //检测方法为4
        $("#analysisResultM4").css('display', "inherit");
        $('#curve').css('display', 'none');
        M4();   //初始化任务4的表格
    } else if (detectMethod == 5) { //检测方法为5
        $("#analysisResultM5").css("display", "inherit");
        $('#curve').css('display', 'none');
        M5();   //初始化任务5的表格
    } else if (detectMethod == 7) { //检测方法为7
        $("#analysisResultM7").css("display", "inherit");
        $('#curve').css('display', 'none');
        M7();   //初始化任务7的表格
    } else if (detectMethod == 8) { //检测方法为8
        $("#analysisResultM8").css("display", "inherit");
        $('#curve').css('display', 'none');
        M8();   //初始化任务8的表格
    } else if (detectMethod == 9) { //检测方法为9
        $("#analysisResultM9").css("display", "inherit");
        $('#curve').css('display', 'none');
        M9();   //初始化任务9的表格
    } else if (detectMethod == 10) {    //检测方法为10
        $("#analysisResultM10").css("display", "inherit");
        $('#curve').css('display', 'none');
        M10();  //初始化任务10的表格
    }
    queryPipeData(); //初始化下拉选（所属管线））；
    $("#pipeName1").bind("change", function () { //改变管线下拉框是触发事件
        var pipeNameID = $("#pipeName1").val();
        if (pipeNameID != null) {
            queryMarkData(pipeNameID);  //加载下拉测试桩号下拉桩的值
        }
    });
});


/**
 * @desc 初始化下拉选（所属管线））
 * @method queryPipeData
 */
function queryPipeData() {
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
                var myobj = document.getElementById('pipeName1');
                if (myobj.options.length == 0) {
                    $("#pipeName1").html(options);
                    // $('#pipeName').selectpicker('refresh');
                }
            } else {
                layer.msg("加载下拉选失败");
            }
        }
    });
}

/**
 * @desc 加载下拉测试桩号下拉桩的值
 * @method queryMarkData
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
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#pipeendNumberName1").html(options);
                $("#pipestartNumberName1").html(options);
            }
        },

    });
}

var jsonExportWord = { "pipelineId": "", "detectResult": "", "startMarkNum": "", "endMarkNum": "", "detectStatus": "", "recorder": "" } //定义一个全局的json数组

/**
 * @desc 查询测试桩数据
 * @method querylistData
 */
function querylistData() {
    if (roleNum == 2) { //判断权限是否为现场检测人员
        jsonExportWord.recorder = $('#recorder').val(); //获取记录人的值
    }
    jsonExportWord.pipelineId = $("#pipeName1").val();  //获取管线ID
    jsonExportWord.detectResult = getChkVal();    //获取检测结果
    jsonExportWord.detectStatus = $('#detectStatus').val(); //获取检测状态
    jsonExportWord.startMarkNum = $("#pipestartNumberName1").val(); //获取开始测试桩

    // if ($("#pipeendNumberName1").val() != undefined && $("#pipeendNumberName1").val() != null && $("#pipeendNumberName1").val() != "null") {
    jsonExportWord.endMarkNum = $("#pipeendNumberName1").val(); //获取结束测试桩
    // }
    if (jsonExportWord.endMarkNum - 0 < jsonExportWord.startMarkNum - 0) {  //判断起始桩号是否大于终止桩号
        parent.layer.confirm("起始桩号不能大于终止桩号", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return;
    }
    $("#tb-all-task").bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新页面并跳转到第一页

}

/**
 * @desc 重置方法
 * @method clearSearchData
 */
function clearSearchData() {
    document.getElementById("searchMarker").reset();
    querylistData();
}

/**
 * @desc 获取复选框参数
 * @method getChkVal
 * @return {*String} analysisResult
 */
function getChkVal() {
    var obj = document.getElementsByName('analysisResult'); //选择所有name="'test'"的对象，返回数组 
    var analysisResult = "";
    for (var i = 0; i < obj.length; i++) {   //取到对象数组后，循环检测它是不是被选中 
        if (obj[i].checked) {
            analysisResult += obj[i].value + ','; //如果选中，将value添加到变量s中 
        }
    }
    analysisResult = analysisResult.substring(0, analysisResult.length - 1);
    return analysisResult;
}

/**
 * @desc 任务m5网格化
 * @method M5
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
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
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
                title: '自己管道试片断电电位(mv)',
                rowspan: 2
            }, {
                field: 'soilResistivity',
                title: '土壤电阻率，Ω.m',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: '记录人',
                rowspan: 2
            }, {
                field: '',
                title: '操作',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var res = '<a href="#" mce_href="#" title="查看" onclick="showData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return res;
                }
            }],
            [{
                field: 'plPotentialRecitifierOn',
                title: '自己管道电位（mv）'
            }, {
                field: 'forPlPotentialRecitifierOn',
                title: '外部管道电位（mv）'
            }, {
                field: 'plPotentialRecitifierOff',
                title: '自己管道电位（mv）'
            }, {
                field: 'forPlPotentialRecitifierOff',
                title: '外部管道电位（mv）'
            }, {
                field: 'plPotentialForRecitifierOn',
                title: '自己管道电位（mv）'
            }, {
                field: 'forPlPotentialForRecitifierOn',
                title: '外部管道电位（mv）'
            }, {
                field: 'plPotentialForRecitifierOff',
                title: '自己管道电位（mv）'
            }, {
                field: 'forPlPotentialForRecitifierOff',
                title: '外部管道电位（mv）'
            }]
        ],
        onDblClickRow: function (row) {
            showData(row.objectId, row.detectStatus);
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
 * @method M7
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
                valign: "middle",
                rowspan: 2
            }, {
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
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
                title: '自己管道试片断电电位(mv)',
                rowspan: 2
            }, {
                field: 'soilResistivity',
                title: '土壤电阻率，Ω.m',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: '记录人',
                rowspan: 2
            }, {
                field: '',
                title: '操作',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var res = '<a href="#" mce_href="#" title="查看" onclick="showData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return res;
                }
            }],
            [{
                field: 'plPotentialRecitifierOn',
                title: '自己管道电位（mv）'
            }, {
                field: 'forPlPotentialRecitifierOn',
                title: '外部管道电位（mv）'
            }, {
                field: 'plPotentialRecitifierOff',
                title: '自己管道电位（mv）'
            }, {
                field: 'forPlPotentialRecitifierOff',
                title: '外部管道电位（mv）'
            }, {
                field: 'plPotentialForRecitifierOn',
                title: '自己管道电位（mv）'
            }, {
                field: 'forPlPotentialForRecitifierOn',
                title: '外部管道电位（mv）'
            }, {
                field: 'plPotentialForRecitifierOff',
                title: '自己管道电位（mv）'
            }, {
                field: 'forPlPotentialForRecitifierOff',
                title: '外部管道电位（mv）'
            }]
        ],
        onDblClickRow: function (row) {
            showData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {
            if (res.rows.length == 0) {
                $('#graph').css('display', 'none')
            }
        }

    });
}

/**
 * @desc 任务m1网格化
 * @method M1
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
                valign: "middle",
                rowspan: 2,
            }, {
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: '检测状态',
                rowspan: 2
            }, {
                field: 'onPotentialOfAvg',
                title: '通电电位(mV)',
                rowspan: 1,
                colspan: 3
            }, {
                field: 'avOfPlAvg',
                title: '交流电压(V)',
                rowspan: 1,
                colspan: 3
            }, {
                field: 'analysisResult',
                title: '分析结果',
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
                field: 'markerStaus',
                title: '桩状况',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: '记录人',
                rowspan: 2
            }, {
                field: '',
                title: '操作',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var res = '<a href="#" mce_href="#" title="查看" onclick="showData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return res;
                }
            }],
            [{
                field: 'onPotentialOfMax',
                title: '最大值'
            }, {
                field: 'onPotentialOfMin',
                title: '最小值'
            }, {
                field: 'onPotentialOfAvg',
                title: '平均值'
            }, {
                field: 'avOfPlMax',
                title: '最大值'
            }, {
                field: 'avOfPlMin',
                title: '最小值'
            }, {
                field: 'avOfPlAvg',
                title: '平均值'
            }]
        ],
        onDblClickRow: function (row) {
            showData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {
        }
    }
    $('#tb-all-task').bootstrapTable(Option1);
}

/**
 * @desc 任务m3网格化
 * @method M3
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
                valign: "middle",
                rowspan: 2
            }, {
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                valign: "middle",
                align: 'center',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: '检测状态',
                rowspan: 2
            }, {
                title: '试片通电电位(mV)',
                rowspan: 1,
                colspan: 1
            }, {
                title: '试片断电电位(mV)',
                rowspan: 1,
                colspan: 1
            }, {
                title: '阴保电流密度(A/m²)',
                rowspan: 1,
                colspan: 1
            }, {
                field: 'soilResistivity',
                title: '土壤电阻率(Ω.m)',
                rowspan: 2
            }, {
                field: 'analysisResultVal',
                title: '分析结果',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: '所属管线',
                rowspan: 2
            }, {
                field: 'createTime',
                title: '检测时间',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: '检测人',
                rowspan: 2
            }, {
                field: 'operation',
                title: '操作',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" title="查看" onclick="showData(\'' + row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                    return e;
                }
            }],
            [{
                field: 'onPotentialOfCouponAvg',
                title: '平均值'
            }, {

                field: 'offPotentialOfCouponAvg',
                title: '平均值'
            }, {
                field: 'cpCurrentDensityAvg',
                title: '平均值'
            }]
        ],
        onDblClickRow: function (row) {
            showData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {
        }
    };
    $('#tb-all-task').bootstrapTable(Option3);
};

/**
 * @desc 任务m2网格化
 * @method M2
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
                valign: "middle",
                rowspan: 2
            }, {
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: '检测状态',
                rowspan: 2
            }, {
                title: '交流电压(V)',
                colspan: 1
            }, {
                title: '试片通电电位(mV)',
                colspan: 1
            }, {

                title: '试片断电电位(mV)',
                colspan: 1
            }, {
                title: '交流电流密度(A/m²)',
                colspan: 1
            }, {

                title: '直流电流密度(A/m²)',
                colspan: 1
            }, {
                field: 'ratioOfCouponDcAc',
                title: '交直流电流密度比',
                rowspan: 2
            }, {
                field: 'soilResistivity',
                title: '土壤电阻率(Ω.m)',
                rowspan: 2
            }, {
                field: 'analysisResultVal',
                title: '分析结果',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: '记录人',
                rowspan: 2
            }, {
                field: '',
                title: '操作',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var res = "<i class='glyphicon glyphicon-eye-open' onclick=\"showData('" + row.objectId + "')\"></i></a>";
                    return res;
                }
            }],
            [{
                field: 'avOfPlAvg',
                title: '平均值'
            }, {
                field: 'onPotentialOfCouponAvg',
                title: '平均值'
            }, {
                field: 'offPotentialOfCouponAvg',
                title: '平均值'
            }, {
                field: 'couponAcDensityAvg',
                title: '平均值'
            }, {
                field: 'couponDcDensityAvg',
                title: '平均值'
            }]
        ],
        onDblClickRow: function (row) {
            showData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {
        }
    }
    $('#tb-all-task').bootstrapTable(Option2);


};

/**
 * @desc 任务m4网格化
 * @method M4
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
                valign: "middle",
                rowspan: 2
            }, {
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: '检测状态',
                rowspan: 2,
            }, {
                title: '管道通电电位(mV)',
                rowspan: 1,
                colspan: 1
            }, {
                title: '管道断电电位(mV)',
                rowspan: 1,
                colspan: 1
            }, {
                field: 'onPoteniallOfCasing',
                title: '套管通电电位(mV)',
                rowspan: 2
            }, {
                field: 'offPotenialOfCasing',
                title: '套管断电电位(mV)',
                rowspan: 2
            },
            {
                field: 'analysisResultVal',
                title: '分析结果',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: '所属管线',
                rowspan: 2
            }, {
                field: 'createTime',
                title: '检测时间',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: '检测人',
                rowspan: 2
            }, {
                field: 'operation',
                title: '操作',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" onclick="showData(\'' + row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                    return e;
                }
            }
            ],
            [{
                field: 'onPotentialOfAvg',
                title: '平均值',
                align: 'center'
            }, {
                field: 'offPotentialOfAvg',
                title: '平均值',
                align: 'center'
            }]
        ],
        onDblClickRow: function (row) {
            showData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) { }
    });
};

/**
 * @desc 任务m8网格化
 * @method M8
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
        columns: [{
            checkbox: true,
            valign: "middle"
        }, {
            title: '序号',
            formatter: function (value, row, index) {
                return currentPageSize * (currentPageNumber - 1) + index + 1;
            }
        }, {
            field: 'markerNumber',
            title: '测试桩号'
        }, {
            field: 'detectStatus',
            title: '检测状态'
        }, {
            field: 'onPotentialOfAvg',
            title: '保护端管道电位（V）',
        }, {
            field: 'avOfPlAvg',
            title: '保护端管道交流电压（V）'
        }, {
            field: 'couponOfPlNonProtectSide',
            title: '非保护端管道电位（V）'
        }, {
            field: 'avOfPlNonProtectSide',
            title: '非保护端管道交流电压（V）'
        }, {
            field: 'crossoverCurrent',
            title: '跨接电流（A）'
        }, {
            field: 'pipelineName',
            title: '所属管线'
        }, {
            field: 'createTime',
            title: '检测时间'
        }, {
            field: 'createUserName',
            title: '记录人'
        }, {
            field: 'option',
            title: '操作',
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#" title="查看" onclick="showData(\'' +
                    row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                return e;
            }
        }],
        onDblClickRow: function (row, field) {
            showData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) { }
    });
};

/**
 * @desc 任务m9网格化
 * @method M9
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
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: '检测状态',
                rowspan: 2,
            }, {
                title: '输出电流（A）',
                colspan: 1
            }, {
                title: '输出电压（V）',
            }, {
                field: 'cpLoopResistance',
                title: '回路电阻（Ω）',
                rowspan: 2
            }, {
                field: 'setupPotentialOfRecitifier',
                title: '设定电位（mV）',
                rowspan: 2
            }, {
                field: 'setupOffPotentialOfRecitifier',
                title: '设定断电电位（mV）',
                rowspan: 2
            }, {
                field: 'onPotentialOnPipeConnectionAvg',
                title: '汇流点通电电位（mV）',
                rowspan: 2
            }, {
                field: 'offPotentialOnPipeConnectionAvg',
                title: '汇流点断电电位（mV）',
                rowspan: 2
            }, {
                field: 'onPotentialOnAnodeAvg',
                title: '阳极地床平均通电电位（mV）',
                rowspan: 2
            }, {
                field: 'offPotentialOnAnodeAvg',
                title: '阳极地床平均断电电位（mV）',
                rowspan: 2
            }, {
                field: 'apparentResistanceOfPl',
                title: '管道视电阻（Ω）',
                rowspan: 2
            }, {
                field: 'apparentResistanceOfGroundbed',
                title: '地床视电阻（Ω）',
                rowspan: 2
            }, {
                field: 'pipelineName',
                title: '所属管线',
                rowspan: 2
            }, {
                field: 'createTime',
                title: '检测时间',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: '记录人',
                rowspan: 2
            }, {
                title: '操作',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" title="查看" onclick="showData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return e;
                }
            }],
            [{
                field: 'outputCurrentOfRecitifierAvg',
                title: '平均值',
            }, {
                field: 'outputVoltageOfRecitifierAvg',
                title: '平均值',
            }]
        ],
        onDblClickRow: function (row, field) {
            showData(row.objectId, row.detectStatus);
        },
    });
};

/**
 * @desc 任务m10网格化
 * @method M10
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
                title: '序号',
                rowspan: 2,
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                rowspan: 2
            }, {
                field: 'detectStatus',
                title: '检测状态',
                rowspan: 2,
            }, {
                title: '管道电位检测',
                colspan: 2,
            }, {
                title: '排流地床（牺牲阳极）性能',
                colspan: 4
            }, {
                title: '牺牲阳极属性',
                colspan: 3
            }, {
                field: 'pipelineName',
                title: '所属管线',
                rowspan: 2
            }, {
                field: 'createTime',
                title: '检测时间',
                rowspan: 2
            }, {
                field: 'createUserName',
                title: '记录人',
                rowspan: 2
            }, {
                title: '操作',
                rowspan: 2,
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" title="查看" onclick="showData(\'' +
                        row.objectId + '\',\'' + row.detectStatus + '\')"><span class="glyphicon glyphicon-eye-open" ></span></a>';
                    return e;
                }
            }],
            [{
                field: 'plOnPotentialAnodeConnected',
                title: '通电电位（mV）',
            }, {
                field: 'plOffPotentialAnodeDisconnected',
                title: '断电电位（mV）',
            }, {
                field: 'potentialOfAnodeDisconnected',
                title: '开路电位（mV）',
            }, {
                field: 'currentFromPlToAnode',
                title: '输出电流（mA）',
            }, {
                field: 'currentFromPlToAnodeAfterConn',
                title: '连上10cm<sup>2</sup>试片输出电流（mA）',
            }, {
                field: 'anodeGroundResistance',
                title: '接地电阻（Ω）',
            }, {
                field: 'anodeWeight',
                title: '重量（kg）',
            }, {
                field: 'anodeInstalationDate',
                title: '安装日期',
            }, {
                field: 'anodeMaterial',
                title: '材料',
            }]
        ],
        onDblClickRow: function (row, field) {
            showData(row.objectId, row.detectStatus);
        },
        onLoadSuccess: function (res) {

        }
    });
};

/**
 * @desc 设置传入参数
 * @method queryParams
 * @param {*String} params
 * @return {*String} temp
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
        detectResult: getChkVal(),    //检测结果
        detectMethod: detectMethod, //检测方法
        startMarkNum: $("#pipestartNumberName1").val(), //开始桩号
        endMarkNum: $("#pipeendNumberName1").val(), //结束桩号
        recorder: recorder, //记录人
        detectStatus: $('#detectStatus').val(), //检测状态
        token: token    //token
    }
    return temp;
}

/**
 * @desc 设置边框底部页码
 * @method responseHandler
 * @param {*String} res
 * @return {*String} res
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
        layer.confirm('加载数据出错', {
            title: "提示",
            btn: ['确定'],
            skin: 'self'
        });

    }
}

/**
 * @desc 渲染页面
 * @method getTaskInfo
 */
function getTaskInfo() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryTaskInfo?objectId=" + objectId,
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
                if (data != null) {

                    var taskInfo = data.taskinfo;

                    // var detectdata = data.detectdata;
                    var taskFinishInfo = data.taskFinishInfo;
                    $('#taskName1').html(taskInfo.taskName); //任务名称
                    $('#detectMethod1').html('M' + taskInfo.detectMethod); //检测方法
                    $('#startTimePlan').html(taskInfo.startTimePlan); //计划结束时间
                    $('#endTimePlan').html(taskInfo.endTimePlan); //计划开始时间
                    $('#startTime').html(taskInfo.startTime);   //检测开始时间
                    $('#endTime').html(taskInfo.endTime);   //检测技术时间
                    $('#createTime').html((taskInfo.createTime));   //任务创建时间
                    closeTime = taskInfo.closeTime;
                    $('#closeTime').html((taskInfo.closeTime)); //审核通过时间
                    $('#taskStatus').html((taskInfo.taskStatus));   //任务状态

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
            data: ['驳回重测:' + taskFinishInfo.repeatDetect, '无法检测:' + taskFinishInfo.unDetect, '新增:'+taskFinishInfo.addMarker,'已检测:' + taskFinishInfo.taskDone, '待检测:' + taskFinishInfo.TaskUnfinish, '全部:' + taskFinishInfo.taskSum]
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
            data: ['今日', '本周', '本月']
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
            name: '今日',
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
            name: '本周',
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
            name: '本月',
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
$(".bottom_btn").click(function () {
    if ($mapO.is(":hidden")) {
        $mapO.slideDown();
        $mapBtn.attr("class", "map_up");
    } else {
        $mapO.slideUp();
        $mapBtn.attr("class", "map_down");
    }
});


/**
 * @desc 查看数据信息
 * @method showData
 * @param {*String} id,detectStatus
 */

function showData(id, detectStatus) {
    var rows = $('#tb-all-task').bootstrapTable('getSelections');
    if ((id == null || id == "null")) {
        if (detectStatus == "未检测" && detectStatus != null) {
            parent.layer.confirm('所选桩无检测数据！', {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            return;
        } else if (rows.length == 1 && (rows == [] || rows[0].detectStatus == "未检测")) {
            parent.layer.confirm('所选桩无检测数据！', {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            return;
        }
    }
    if (id != null) {
    } else if (rows.length == 1) {
        id = rows[0].objectId;
        detectStatus = rows[0].detectStatus;
        if (detectStatus == "未检测") {
            parent.layer.confirm('所选桩无检测数据！', {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            return;
        }
    } else {
        parent.layer.confirm('请选择一条已检测的测试桩!', {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return;
    }
    viewData();
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '检测数据详情',
        area: ['950px', '600px'],
        btn: ['取消'],
        btn2: function (index, layero) { },
        content: content + id
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
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m1.html?detectMethod=1&id="
    } else if (detectMethod == 2) {
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m2.html?detectMethod=2&id="
    } else if (detectMethod == 3) {
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m3.html?detectMethod=3&id="
    } else if (detectMethod == 4) {
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m4.html?detectMethod=4&id="
    } else if (detectMethod == 5) {
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m5.html?detectMethod=5&id="
    } else if (detectMethod == 6) {
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m6.html?detectMethod=6&id="
    } else if (detectMethod == 8) {
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m8.html?detectMethod=8&id="
    } else if (detectMethod == 9) {
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m9.html?detectMethod=9&id="
    } else if (detectMethod == 10) {
        content = getRootPath() + "/../src/html/task/specific_task/view_marker_m10.html?detectMethod=10&id="
    }
}

/**
 * @desc 驳回重测测试桩
 * @method rejected
 */
function rejected() {
    var rows = $('#tb-all-task').bootstrapTable('getSelections');
    if (rows.length < 1) {
        parent.layer.confirm('请选择需要重测的测试桩!', {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
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
        parent.layer.confirm('请选择已完成检测的测试桩!', {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '重新检测',
        area: ['600px', '550px'],
        btn: ['确认', '取消'],
        maxmin: false,
        yes: function (index, layero) {
            var objWindow = layero.find('iframe')[0].contentWindow;
            var save = objWindow.submitData();
            if (save) {
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
            }
        },
        btn2: function (index, layero) { },
        end: function (index, layero) {
            parent.layer.close(index);
        },
        content: getRootPath() + "/../src/html/task/specific_task/reject_marker.html?markerNumber=" + encodeURI(markerNumber) + '&pipelineName=' + encodeURI(pipelineName) + '&objectID=' + objectID + '&taskID=' + taskID + '&markerID=' + markerID + '&token=' + token + '&detectMethod=' + detectMethod
    });
}

/**
 * @desc 审核通过
 * @method approved
 * @return {*String} approvedFlag
 */
function approved() {
    var approvedData = "";
    var approvedSuccessMsg = ""
    var hintMsg = ""
    var detectUser = JSON.parse(lsObj.getLocalStorage("userBo")).objectId;
    if ((roleNum == 2 && taskStatus == "执行中") || (detectUser == detectUserId && taskStatus == "执行中")) { //是现场检测人员且任务状态执行中或者具有现场检测人员的角色且任务状态执行中
        approvedData = { 'taskId': objectId, 'taskStatus': 3 }
        approvedSuccessMsg = "已提交审核!"
        hintMsg = "提交审核"
    } else if ((roleNum == 2 && taskStatus == "待领取") || (detectUser == detectUserId && taskStatus == "待领取")) {  //是现场检测人员且任务状态待领取或者具有现场检测人员的角色且任务状态待领取
        approvedData = { 'taskId': objectId, 'taskStatus': 2 }
        approvedSuccessMsg = "已领取任务!"
        hintMsg = "领取任务"
    } else {
        approvedData = { 'taskId': objectId, 'taskStatus': 4 }
        approvedSuccessMsg = "审核通过！"
        hintMsg = "审核通过"
    }
    var approvedFlag = false;
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
                    skin: "self-success"
                });
                approvedFlag = true;
                return approvedFlag;
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track(hintMsg, { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (error) {

                }
                parent.layer.confirm(res.msg, {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
            }
            approvedFlag = false;
        },
        error: function () {
            parent.layer.confirm('审核异常', {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
        }

    })
    return approvedFlag;
}

/**
 * @desc 导出测试桩数据
 * @method exportSelect
 */
function exportSelect() {
    uncheck("exportSelect");
    var rows = $('#tb-all-task').bootstrapTable('getSelections');
    if (rows.length < 1) {
        parent.layer.confirm('请选择导出测试桩!', {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
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
     var url = "/cloudlink-corrosionengineer/task/exportDetectData?token=" + token + '&objectIds=' + objectID + '&type=selected' + '&method=' + detectMethod + '&taskId=' + objectId+'&taskName='+taskName+'&closeTime='+closeTime;
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
    rowDate = $('#tb-all-task').bootstrapTable('getData');
    if (rowDate.length <= 0) {
        layer.confirm("没有可导出的数据", {
            title: "提示",
            btn: ['确定'],
            skin: 'self'
        });
        return;
    }

    var url = "/cloudlink-corrosionengineer/task/exportDetectData?token=" + token + '&detectResult=' + jsonExportWord.detectResult + '&type=query' + '&method=' + detectMethod + '&startMarkNum=' + jsonExportWord.startMarkNum + '&pipelineId=' + jsonExportWord.pipelineId + '&endMarkNum=' + jsonExportWord.endMarkNum + '&taskId=' + objectId + '&detectStatus=' + jsonExportWord.detectStatus + '&recorder=' +
    jsonExportWord.recorder+'&taskName='+taskName+'&closeTime='+closeTime;
    $('#exportData').attr("src", url);
    uncheck("exportAll")
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出全部检测数据', { '任务类型': 'M' + detectMethod });
        }
    } catch (error) {

    }
}
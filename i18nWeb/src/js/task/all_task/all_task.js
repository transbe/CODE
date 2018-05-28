/**
 * @file
 * @author  gaohui
 * @desc 全部任务列表操作逻辑
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:25:15
 */
var roleNum = lsObj.getLocalStorage('params'); //获取角色 的标识
var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); //获取useBo
var token = lsObj.getLocalStorage("token"); //获取token
var query = getParameter("query"); //获取query

//定义网格化传入参数的值
var items = {
    "taskStatusId": '', //任务状态
    "detectMethod": '', //检测方法
}

$(function () {
    changePageStyle("../../..");
    // firstLogin(); // 判断是否是第一次登陆，第一次展示向导

    loadDetectUserName("detectUserName"); //初始化下拉选
    getPipeline("pipeName", 0); //初始化管线下拉选
    // 时间插件===========
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4
    });
    //初始化Table
    loadTable();
    //设置Table高度
    setTableHeight('tb-all-task');
    //回车查询
    $("#searchForm").keydown(function () {
        if (event.keyCode == "13") { //keyCode=13是回车键
            $('#tb-all-task').bootstrapTable('refreshOptions', {
                pageNumber: 1,
                sortName: "",
                sortOrder: ""
            }); //刷新页面并跳转到第一页
        }
    });
    if (query == "news") { //query为news
        if (parent.canOpenViewTask) {
            var objectId = getParameter("taskId");
            var taskName = decodeURI(getParameter("taskName"));
            var taskStatus = decodeURI(getParameter("taskStatus"));
            var detectMethod = getParameter("detectMethod");
            var detectUserId = getParameter("detectUserId");
            viewTask(objectId, detectMethod, taskStatus, detectUserId, taskName);
            parent.canOpenViewTask = false;
        }
    }
    $('.more').click(function () {
        $('.more').toggleClass("active");
        $('.more_item_wrapper').toggle();
        setTableHeight('tb-all-task');
    });
    clickSearch(); //点击查询
    document.getElementById("lineHeight").style.height = "40px";
});

/**
 * @desc 点击按钮查询
 */
function clickSearch() {
    $(".task-status .item").click(function () {
        var $parent = $('.task-status');
        $parent.find(".item").removeClass('active'); //移除所有的active
        $(this).addClass('active'); //将点击按钮设置点击状态
        items.taskStatusId = $(this).attr("data-value"); //获取点击按钮的值
        $('#tb-all-task').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        }); //刷新页面并跳转到第一页
    });
    $(".detect-methed .item").click(function () {
        var $parent = $('.detect-methed');
        $parent.find(".item").removeClass('active'); //移除所有的active
        $(this).addClass('active'); //将点击按钮设置点击状态
        items.detectMethod = $(this).attr("data-value"); //获取点击按钮的值
        $('#tb-all-task').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        }); //刷新页面并跳转到第一页
    });
    $('#pipeName').on('change', function () { //管线
        $('#tb-all-task').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        });
    });
    $('#year').on('change', function () { //年份
        $('#tb-all-task').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        });
    });
    $('#detectUserName').on('change', function () { //检测人员
        $('#tb-all-task').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        });
    });
}
/**
 * @desc 初始化列表
 */
function loadTable() {
    var currentPageNumber; //定义当前页码
    var currentPageSize; //定义当前页大小
    var url = handleURL('/cloudlink-corrosionengineer/task/queryTaskForPage'); //对url进行权限处理
    $('#tb-all-task').bootstrapTable({
        url: url, //请求后台的URL（*）
        method: 'get', //请求方式（*）
        toolbar: "#toolbar",
        pageSize: 50,
        queryParams: function (params) {
            currentPageNumber = this.pageNumber;
            currentPageSize = this.pageSize;
            if (roleNum == 2) { //现场检测人员角色
                if (items.taskStatusId == "") { //任务状态为空
                    params.taskStatusId = "1,2,3";
                } else {
                    params.taskStatusId = items.taskStatusId;
                }
                if ($("#detectUserName").val() == "" || $("#detectUserName").val() == null) { //检测人员为空
                    params.detectUserId = userBo.objectId
                } else {
                    params.detectUserId = $("#detectUserName").val();
                }
            } else {
                params.taskStatusId = items.taskStatusId;
                params.detectUserId = $("#detectUserName").val();
            }
            params.detectMethod = items.detectMethod //检测方法
            params.pipeID = $("#pipeName").val(); //管线ID
            params.taskName = $("#taskName").val(); //任务名称
            params.year = $("#year").val(); //年度
            params.token = lsObj.getLocalStorage("token"); //token
            params.pageSize = this.pageSize; //页面大小
            params.pageNum = this.pageNumber; //当前页码
            params.sortName = this.sortName;
            params.sortOrder = this.sortOrder;

            return params;
        },
        columns: [{
            checkbox: true
        }, {
            title: getLanguageValue("No"),
            formatter: function (value, row, index) {
                return currentPageSize * (currentPageNumber - 1) + index + 1;
            }
        }, {
            field: 'detectMethod',
            title: getLanguageValue("detectMethod"),
            sortable: true,
            width: '7%',
            formatter: function (value, row, index) {
                return 'M' + row.detectMethod;
            }

        }, {
            field: 'taskName',
            title: getLanguageValue("taskName"),
            sortable: true,
            width: '15%'
        }, {
            field: 'pipelineName',
            title: getLanguageValue("pipelineName"),
            width: '15%'
        }, {
            field: 'taskStatus',
            title: getLanguageValue("taskStatusVal"),
            sortable: true,
            formatter: function (value, row, index) {
                var taskStatus = (row.taskStatus);
                var val = "";
                // console.log(taskStatus);
                switch (taskStatus) {
                    case "1":
                        val = getLanguageValue("received");
                        break;
                    case "2":
                        val = getLanguageValue("operating");
                        break;
                    case "3":
                        val = getLanguageValue("reviewed");
                        break;
                    case "4":
                        val = getLanguageValue("approved");
                        break;
                }
                return val;
            },
            width: '8%'
        }, {
            field: 'taskProcess',
            title: getLanguageValue("taskProcess"),
            width: '10%'
        }, {
            field: 'detectUserName',
            title: getLanguageValue("detectUserName"),
            sortable: true,
            width: '15%'
        }, {
            field: 'createUserName',
            title: getLanguageValue("createUserName"),
            sortable: true,
            width: '10%'
        }, {
            field: 'createTime',
            title: getLanguageValue("createTime"),
            sortable: true,
            width: '10%',
            class: 'td-nowrap',
            formatter: function (value, row, index) {
                var createTime = (row.createTime).split(' ');
                return createTime[0];
            }
        }, {
            field: 'operation',
            title: getLanguageValue("operation"),
            width: '10%',
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#" title = "' + getLanguageValue("view") + '" onclick="viewTask(\'' + row.objectId + '\'\,\'' + row.detectMethod + '\'\,\'' + row.taskStatus + "\',\'" + row.detectUserId + "\',\'" + row.taskName + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                var d = '';
                if (row.detectMethod == 1 || row.detectMethod == 2 || row.detectMethod == 3 || row.detectMethod == 6) {
                    d = '<a href="#" mce_href="#" title = "' + getLanguageValue("graph") + '" onclick="viewGraph(\'' + row.objectId + '\'\,\'' + row.detectMethod + '\',\'' + row.taskName + '\')"><i class="fa  fa-line-chart"></i></span></a> ';
                    return e + d;
                } else {
                    d = '<a href="#" mce_href="#"  title = "' + getLanguageValue("graph") + '" onclick="viewGraph(\'' + row.objectId + '\'\,\'' + row.detectMethod + '\',\'' + row.taskName + '\')">' +
                        '<i class="fa  fa-line-chart style="style="visibility:hidden"></i></span></a> ';
                    return e + d;
                }
            }
        }],
        onDblClickRow: function (row) {
            viewTask(row.objectId, row.detectMethod, row.taskStatus, row.detectUserId, row.taskName);
        },
        responseHandler: function (res) { //加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
            if (res.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查询任务', {
                            '任务种类': '全部任务',
                            "结果": "成功"
                        });
                    }
                } catch (error) {

                }
                var data = res.rows;

                return res;
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查询任务', {
                            '任务种类': '全部任务',
                            "结果": "失败"
                        });
                    }
                } catch (error) {

                }
                layer.alert(getLanguageValue("load_data_error"), {
                    title: getLanguageValue("tip_title"),
                    skin: "self-alert"
                });
            }
        }
    });
}

/**
 * @desc 查看任务详情
 * @param {*String} objectId 任务ID, detectMethod 检测方法, taskStatus 任务状态, detectUserId 检测人员,taskName任务名称
 */
function viewTask(objectId, detectMethod, taskStatus, detectUserId, taskName) {
    uncheck("viewTask");
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    var preventDblClick = false;
    if (!isNull(objectId)) { //object为空

    } else if (rowDate.length == 1) {
        objectId = rowDate[0].objectId;
        detectMethod = rowDate[0].detectMethod;
        taskStatus = rowDate[0].taskStatus;
        detectUserId = rowDate[0].detectUserId;
        taskName = rowDate[0].taskName;
    } else {
        layer.alert(getLanguageValue("select_one"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }

    var detectUser = userBo.objectId; //获取登录人员的ID
    var viewUrl = getRootPath() + "/src/html/task/specific_task/view_task.html?objectId=" + objectId + '&detectMethod=' + detectMethod + '&taskStatus=' + taskStatus + '&detectUserId=' + detectUserId + '&taskName=' + taskName;
    var btnMess = "";
    if (!judgePrivilege()) {
        if (roleNum == 2) { //现场检测人员
            if (taskStatus == "1") { //任务状态待领取
                btnMess = [getLanguageValue("take_btn"), getLanguageValue("cancel_btn")];
            } else if (taskStatus == "2") { //任务状态执行中
                btnMess = [getLanguageValue("submit_btn"), getLanguageValue("cancel_btn")];
            } else {
                btnMess = [getLanguageValue("close_btn")];
            }

        } else {
            if (detectUser == detectUserId && taskStatus == "1") { //登录人员与检修人员相同且任务状态是待领取
                btnMess = [getLanguageValue("take_btn"), getLanguageValue("cancel_btn")];
            } else if (detectUser == detectUserId && taskStatus == "2") { //登录人员与检修人员相同且任务状态是执行中
                btnMess = [getLanguageValue("submit_btn"), getLanguageValue("cancel_btn")];
            } else if (taskStatus == "3") { //任务状态待审核
                btnMess = [getLanguageValue("approval_btn"), getLanguageValue("cancel_btn")]
            } else {
                btnMess = [getLanguageValue("close_btn")];
            }
        }
    } else {
        btnMess = [getLanguageValue("close_btn")];
    }
    var layer1 = parent.layer.open({
        type: 2,
        // title: '查看任务及测试数据',
        title: getLanguageValue("viewPage_Head"),
        area: ['950px', '600px'],
        btn: btnMess,
        skin: 'self-iframe',
        yes: function (index, layero) {
            if (!preventDblClick) {
                var windowObj = layero.find('iframe')[0].contentWindow;
                // 待领取  1
                // 执行中  2
                // 待审核  3
                // 已审核  4
                // judgePrivilege = true // 运营人员
                // judgePrivilege = false // 非运营人员
                console.log(taskStatus === 1);
                if (!judgePrivilege()) {
                    if ((roleNum == 2 && taskStatus == "1") || (detectUser == detectUserId && taskStatus == "2")) {
                        //现场检测人员且任务状态是执行中或者检测人员与登录人员一样且任务状态是执行中
                        parent.layer.confirm(getLanguageValue("judge_go"), {
                            title: getLanguageValue("tip_title"),
                            skin: 'self'
                        }, function () {
                            $.ajax({
                                url: "/cloudlink-corrosionengineer/task/checkTaskHasData?taskId=" + objectId,
                                type: "get",
                                success: function (res) {
                                    if (res.success == 1) {
                                        if (res.rows != "false") {
                                            var result = windowObj.approved();
                                            if (result == true) {
                                                $('#tb-all-task').bootstrapTable('refresh', true);
                                            }
                                        } else {
                                            parent.layer.alert(getLanguageValue("one_marker"), {
                                                title: getLanguageValue("tip_title"),
                                                skin: 'self-alert'
                                            });
                                        }
                                        preventDblClick = true;
                                        parent.layer.close(index);
                                    } else {
                                        parent.layer.alert(res.msg, {
                                            title: getLanguageValue("tip_title"),
                                            skin: 'self-alert'
                                        });
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    layer.alert(NET_ERROR_MSG, {
                                        title: getLanguageValue("tip_title"),
                                        skin: 'self-alert'
                                    });
                                }
                            })
                        })
                    } else if ((roleNum != 2 && taskStatus == "3")) { //不是现场检测人员且任务状态是待审核
                        parent.layer.confirm(getLanguageValue("judge_approve"), {
                            title: getLanguageValue("tip_title"),
                            skin: 'self'
                        }, function () {
                            var result = windowObj.approved();
                            if (result == true) {
                                $('#tb-all-task').bootstrapTable('refresh', true);
                                parent.layer.close(index);
                            }
                        })
                        preventDblClick = true;
                    } else if ((roleNum == 2 && taskStatus == "1") || (detectUser == detectUserId && taskStatus == "1")) { //现场检测人员且任务状态为待领取或者登录人员与检测人员是同一人且任务状态待领取
                        var result = windowObj.approved();
                        if (result == true) {
                            $('#tb-all-task').bootstrapTable('refresh', true);
                            parent.layer.close(index);
                        }
                        preventDblClick = true;
                    } else {
                        parent.layer.close(index);
                    }
                } else {
                    parent.layer.close(index);
                }
            } else {
                preventDblClick = false;
            }
        },
        content: viewUrl
    });
    parent.layer.full(layer1);
};

/**
 * @desc 任务统计
 */
function taskStatistic() {
    uncheck("taskStatistic"); //取消按钮选中状态
    var roleNameNum = parseInt(lsObj.getLocalStorage('params'));
    var newURL;
    if (roleNameNum == 2) { //现场检测人员
        newURL = "/src/html/task/all_task/task_statistics_collect.html";
    } else {
        newURL = "/src/html/task/all_task/task_statistics.html"
    }
    var taskStatisticlayer = parent.layer.open({
        type: 2,
        title: getLanguageValue("task_statistic"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("close_btn")],
        skin: "self-iframe",
        yes: function (index) {
            parent.layer.close(index);
        },
        content: getRootPath() + newURL
    });
    parent.layer.full(taskStatisticlayer);

};

/**
 * @desc 曲线图
 * @param {*String} objectId, detectMethod, taskName
 */
function viewGraph(objectId, detectMethod, taskName) {
    uncheck("viewGraph"); //取消按钮选中状态
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (!isNull(objectId)) {

    } else if (rowDate.length == 1) {
        objectId = rowDate[0].objectId;
        detectMethod = rowDate[0].detectMethod;
        taskName = rowDate[0].taskName;
    } else {
        layer.alert(getLanguageValue("select_one"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }

    var viewUrl = "";
    if (detectMethod == 1 || detectMethod == 2 || detectMethod == 3 || detectMethod == 6) { //检测方法是1,2,3,6的其中之一
        viewUrl = getRootPath() + "/src/html/task/specific_task/graph_task.html?objectId=" + objectId + '&detectMethod=' + detectMethod + '&taskName=' + encodeURI(taskName);
    } else {
        return;
    }
    //弹出窗
    var layer1 = parent.layer.open({
        type: 2,
        title: getLanguageValue("title_graph"),
        skin: 'self-iframe',
        area: ['950px', '600px'],
        yes: function () {},
        btn1: function (index, layero) {},
        content: viewUrl
    });
};

/**
 * @desc 导出选中任务
 */
function exportSelect() {
    uncheck("exportSelect"); //取消按钮选中状态
    var objectIds = "";
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections'); //获取选中的值
    if (rowDate.length <= 0) {
        layer.alert(getLanguageValue("select_one"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    for (var i = 0; i < rowDate.length; i++) {
        if (i != rowDate.length - 1) {
            objectIds += rowDate[i].objectId + ","
        } else {
            objectIds += rowDate[i].objectId
        }
    }
    var url = '/cloudlink-corrosionengineer/task/exportTask?token=' + token + '&objectIds=' + objectIds + '&type=selected';
    $("#exportExcelIframe").attr("src", url);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出选中任务', {
                '任务类型': '全部任务'
            });
        }
    } catch (error) {

    }
};

/**
 * @desc 导出全部任务
 */
function exportAll() {
    uncheck("exportAll"); //取消按钮选中状态
    var rowData = $('#tb-all-task').bootstrapTable('getData'); //获取选中的值
    if (rowData.length <= 0) {
        layer.alert(getLanguageValue("no_export_data"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    var detectUserId = "";
    if (roleNum == 2) {
        detectUserId = userBo.objectId;
    } else {
        detectUserId = $("#detectUserName").val()
    }
    var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
    var url = '/cloudlink-corrosionengineer/task/exportTask?token=' + token + '&pipeID=' + $("#pipeName").val() + '&taskName=' + $("#taskName").val() +
        '&detectMethed=' + items.detectMethod + '&year=' + $("#year").val() + '&detectUserId=' + detectUserId + '&taskStatus=' + items.taskStatusId + '&type=query' + "&language=" + language;
    $("#exportExcelIframe").attr("src", url);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出全部任务', {
                '任务种类': '全部任务'
            });
        }
    } catch (error) {

    }
}

/**
 * @desc 导出PDF
 */
function exportWorkBook() {
    uncheck("exportWorkBook"); //取消按钮选中状态
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (rowDate.length > 1 || rowDate.length == 0) {
        layer.alert(getLanguageValue("select_one"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    var url = '/cloudlink-corrosionengineer/task/exportInspectionRecord?token=' + token +
        '&detectMethod=' + rowDate[0].detectMethod + '&taskId=' + rowDate[0].objectId + '&taskName=' + encodeURI(rowDate[0].taskName) +
        '&closeTime=' + rowDate[0].closeTime;
    $("#exportExcelIframe").attr("src", url);
};

/**
 * @desc 根据查询条件重新加载数据
 */
$("#searchBtn").click(function () {
    $('#tb-all-task').bootstrapTable('refreshOptions', {
        pageNumber: 1,
        sortName: "",
        sortOrder: ""
    }); //刷新页面并跳转到第一页
})
/**
 * @desc 重置form表单
 */
$("#resetBtn").click(function () {
    document.getElementById("searchForm").reset();
    $('.selectpicker').selectpicker('val', null);
    $(".task-status .item").removeClass('active');
    $($(".task-status .item")[0]).addClass('active');
    $(".detect-methed .item").removeClass('active');
    $($(".detect-methed .item")[0]).addClass('active');
    items.taskStatusId = "";
    items.detectMethod = "";
    $('#tb-all-task').bootstrapTable('refreshOptions', {
        pageNumber: 1,
        sortName: "",
        sortOrder: ""
    }); //刷新页面并跳转到第一页
})
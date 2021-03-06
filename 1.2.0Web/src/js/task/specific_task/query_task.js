/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:任务逻辑
 */

var detectMethod = getParameter('method');  //获取检测方法
var roleNum = lsObj.getLocalStorage('params'); //获取角色 的标识
var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));   //获取useBo
var token = lsObj.getLocalStorage("token"); //获取tokens
var numberPage; //定义页码
$(function () {
    if (detectMethod == 1 || detectMethod == 2 || detectMethod == 3 || detectMethod == 6) { //判读检测方法是否为1,2,3,6
        $('#viewGraph').css('display', 'inline-block'); //曲线图区域显示
    }
    getPipelineSelects();   //加载管线名称下拉选
    loadSelects("detectUserName");  //初始化下拉选（检测单位（人员））
    //时间插件
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4,
        pickTime: false
    });

    loadTable();    //初始化Table
    setTableHeight('tb-all-task');  //设置表格高度
    //回车查询
    $("#searchForm").keydown(function() {
        if (event.keyCode == "13") { //keyCode=13是回车键
            querylist();
        }
    });
});

/**
 * @desc 加载管线名称下拉选
 * @method getPipelineSelects
 */
function getPipelineSelects() {
    var url = handleURL("/cloudlink-corrosionengineer/task/getPipeline?token=" + token + "&detectMethod=" + detectMethod);  //对 url进行权限处理
    $.ajax({
        url: url,
        dataType: "json",
        method: "get",
        success: function (result) {
            if (result.success == 1) {
                var data = result.dataList;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                var myobj = document.getElementById('pipeName');
                if (myobj.options.length == 0) {
                    $("#pipeName").html(options);
                    $('#pipeName').selectpicker('refresh');
                }
            } else {
                layer.confirm("加载下拉选失败", {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
            }
        }
    });
}

/**
 * @desc 初始化列表信息
 * @method loadTable
 */
function loadTable() {
    var currentPageSize;    //定义当前页面大小
    var url = handleURL('/cloudlink-corrosionengineer/task/queryTaskForPage');  //对url进行权限处理
    //初始化Table
    $('#tb-all-task').bootstrapTable({
        url: url, //请求后台的URL（*）
        method: 'get', //请求方式（*）
        queryParamsType: "pageSize", //页面大小
        toolbar: "#toolbar",
        queryParams: function (params) {
            if (roleNum == 2) { //判断是否为检测账号
                if ($("#taskStatus").val() == "") {   //判断任务状态是否为空
                    params.taskStatusId = "1,2,3"; //设置任务状态为待领取，进行中，待审核
                } else {
                    params.taskStatusId = $("#taskStatus").val();
                }
                if ($("#detectUserName").val() == "") {   //判断检测人员账号是否为空
                    params.detectUserId = userBo.objectId;  //设置检测人员ID为登陆人员ID
                } else {
                    params.detectUserId = $("#detectUserName").val();
                }
            } else {
                params.taskStatusId = $("#taskStatus").val();
                params.detectUserId = $("#detectUserName").val();
            }
            numberPage = this.pageNumber;
            currentPageSize = params.pageSize;
            params.pageSize = params.pageSize; //页面大小
            params.pageNum = this.pageNumber; //当前页码
            params.detectMethod = detectMethod; //获取检测方法
            params.pipeID = $("#pipeName").val();   //获取管线ID
            params.taskName = $("#taskName").val(); //获取任务名称
            params.year = $("#year").val(); //获取年份
            params.token = token;  //获取token
            return params;
        },
        columns: [{
            checkbox: true,
        }, {
            field: 'sequence',
            title: '序号',
            formatter: function (value, row, index) {
                return currentPageSize * (numberPage - 1) + index + 1;
            }
        }, {
            field: 'detectMethod',
            title: '检测方法',
            formatter: function (value, row, index) {
                return 'M' + row.detectMethod;
            }
        }, {
            field: 'taskName',
            title: '任务名称',
        }, {
            field: 'pipelineName',
            title: '所属管线',
        }, {
            field: 'taskStatus',
            title: '任务状态',
        }, {
            field: 'taskProcess',
            title: '任务进度',
        }, {
            field: 'detectUserName',
            title: '检测单位(人员)',
        }, {
            field: 'createUserName',
            title: '创建人',
        }, {
            field: 'createTime',
            title: '创建时间',
            formatter: function (value, row, index) {
                var createTime = (row.createTime).split(' ');
                return createTime[0];
            }
        }, {
            field: 'operation',
            title: '操作',
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#" title="查看" onclick="view(\'' + row.objectId + "\',\'" + row.taskStatus + "\',\'" + row.detectUserId+ "\',\'" + row.taskName+ '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                if (!judgePrivilege()) {
                    if (roleNum != 2) {
                        var d = '<a href="#" mce_href="#" title="修改" onclick="updateTask(\'' + row.objectId + '\',\'' + row.taskStatus + '\')"><span class="glyphicon glyphicon-edit" id = "editColor"></span></a> ';
                        if (row.taskStatus == "已审核") {
                            d = '<a href="#" mce_href="#" title="修改" onclick="updateTask(\'' + row.objectId + '\',\'' + row.taskStatus + '\')"><span class="glyphicon glyphicon-edit" style="color:#ccc"></span></a> ';
                        }

                        return e + d;
                    }
                }
                return e;
            }
        }
        ],
        onDblClickRow: function (row) {
            view(row.objectId, row.taskStatus, row.detectUserId,row.taskName);
        },
        responseHandler: function (res) { //加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。                
            if (res.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查询任务', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                return res;
            } else {
                layer.confirm('加载数据出错', {
                    title: "提示",
                    btn: ['确定'],
                    skin: 'self'
                });
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查询任务', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (error) {

                }
            }

        }
    });
}

/**
 * @desc 根据添加查询数据列表
 * @method querylist
 */
function querylist() {
    $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新页面并跳转到第一页
}

/**
 * @desc 新增任务
 * @method addTask
 */
function addTask() {
    uncheck("addTaskButton");   //取消按钮选中状态
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '新增任务',
        area: ['950px', '600px'],
        btn: ['提交', '取消'],
        yes: function (index, layero) {
            var windowObj = layero.find('iframe')[0].contentWindow;
            var saveFlag = windowObj.saveData();
            if (saveFlag == true) {
                $('#tb-all-task').bootstrapTable('refresh', true);
                parent.layer.close(index);
            }
        },
        btn2: function (index, layero) {

        },
        content: getRootPath() + "/src/html/task/specific_task/add_task.html?detectMethod=" + detectMethod
    });
    parent.layer.full(index);
};

/**
 * @desc 删除任务
 * @method deleteTask
 */
function deleteTask() {
    uncheck("deleteTaskButton");   //取消按钮选中状态
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (rowDate.length > 0) {
        var isDelte = "";
        var str = "";
        var objectIds = "";
        for (var i = 0; i < rowDate.length; i++) {
            if (rowDate[i].taskStatus == "执行中") {   //任务状态执行中
                str += '任务名称：' + rowDate[i].taskName + " 任务处于待执状态" + "\n";
            }
            if (rowDate[i].taskStatus == "待审核") {  //任务状态待审核
                str += '任务名称：' + rowDate[i].taskName + " 任务处于待审核状态" + "\n";
            }
            if (rowDate[i].hasData == 1) {    //有检测数据
                isDelte += '任务名称：' + rowDate[i].taskName + ",";
            }
            objectIds += rowDate[i].objectId + ",";
        }
        if (isDelte != "") {
            isDelte = isDelte.substring(0, isDelte.length - 1);
            isDelte += " 已有测试数据，不能删除！"
            var index = layer.confirm(isDelte, {
                title: "提示",
                btn: ['确定'],
                skin: 'self', //按钮
            });
        } else {
            if (str != "") {
                var index = layer.confirm(str + "删除后无法查看数据", {
                    title: "提示",
                    btn: ['确定', '取消'],
                    skin: 'self', //按钮
                }, function () {
                    removeTask(objectIds);
                    layer.close(index);
                });
            } else {
                var index = layer.confirm('是否确定删除所选项？', {
                    title: "提示",
                    btn: ['确定', '取消'],
                    skin: 'self', //按钮
                }, function () {
                    removeTask(objectIds);
                    layer.close(index);
                });
            }
        }
    } else {
        layer.confirm("请至少选择一条数据", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
    }
};

/**
 * @desc 删除任务
 * @method removeTask
 */
function removeTask(objectIds) {
    var objectId = objectIds.substring(0, objectIds.length - 1);
    var parameter = {
        "objectId": objectId
    };
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/deleteTask?token=" + token,
        type: "post",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(parameter),
        success: function (res) {
            if (res.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('删除任务', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                var rows = $('#tb-all-task').bootstrapTable('getData', true);   //获取当前页的数据
                var rows1 = $('#tb-all-task').bootstrapTable('getSelections');  //获取选中的数据
                if (numberPage != 1 && rows.length == rows1.length) { //页码不是1,当前页数量等于选中数量
                    $('#tb-all-task').bootstrapTable('prevPage');   //调转到上一页
                } else {
                    $('#tb-all-task').bootstrapTable('refresh', true);//刷新数据
                }
                parent.layer.msg("删除成功！", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-success"
                });
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('删除任务', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (error) {

                }
                parent.layer.confirm(res.msg, {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
            }
        },
    });
}

/**
 * @desc 生成曲线图
 * @method viewGraph
 */
function viewGraph() {
    uncheck("viewGraph");   //取消按钮选中状态
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (rowDate.length == 1) {
      var objectId = rowDate[0].objectId;
      var taskName = rowDate[0].taskName;
    } else {
        layer.confirm("请选择一条数据", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return;
    }
    var layer1 = parent.layer.open({
        type: 2,
        title: '曲线图',
        area: ['950px', '600px'],
        yes: function () { },
        btn1: function (index, layero) {

        },
        content: getRootPath() + "/src/html/task/specific_task/graph_task.html?objectId=" + objectId + '&detectMethod=' + detectMethod + '&taskName=' + encodeURI(taskName)
    });
};

/**
 * @desc 导出选中任务
 * @method exportSelect
 */
function exportSelect() {
    uncheck("exportSelect");   //取消按钮选中状态
    var objectIds = "";
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (rowDate.length <= 0) {
        layer.confirm("请选择一条数据", {
            title: "提示",
            btn: ['确定'],
            skin: 'self'
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
    var url = '/cloudlink-corrosionengineer/task/exportTask?token=' + lsObj.getLocalStorage('token') + '&objectIds=' + objectIds + '&type=selected';
    $("#exprotExcelIframe").attr("src", url);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出选中任务', { '任务类型': 'M' + detectMethod });
        }
    } catch (error) {

    }
};

/**
 * @desc 导出全部任务
 * @method exportAll
 */
function exportAll() {
    uncheck("exportAll");   //取消按钮选中状态
    var objectIds = "";
    rowDate = $('#tb-all-task').bootstrapTable('getData');
    if (rowDate.length <= 0) {
        layer.confirm("没有可导出的数据", {
            title: "提示",
            btn: ['确定'],
            skin: 'self'
        });
        return;
    }
    var url = '/cloudlink-corrosionengineer/task/exportTask?token=' + token + '&pipeID=' + $("#pipeName").val() + '&taskName=' + $("#taskName").val() +
        '&detectMethed=' + detectMethod + '&year=' + $("#year").val() + '&taskStatus=' + $("#taskStatus").val() + '&type=query' + '&detectUserId=' + $("#detectUserName").val();
    $("#exprotExcelIframe").attr("src", url);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出全部任务', { '任务类型': 'M' + detectMethod });
        }
    } catch (error) {

    }
}

/**
 * @desc 查看任务信息
 * @method view
 * @param {*String} objectId, taskStatus, detectUserId,taskName
 */
function view(objectId, taskStatus, detectUserId,taskName) {
    uncheck("viewTaskButton");   //取消按钮选中状态
    var btn = "";
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (objectId != null && objectId != "") {

    } else if (rowDate.length == 1) {
        objectId = rowDate[0].objectId;
        taskStatus = rowDate[0].taskStatus;
        detectUserId = rowDate[0].detectUserId;
        taskName = rowDate[0].taskName;
    } else {
        layer.confirm("请选择一条数据", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return;
    }
    var detectUser = userBo.objectId;  //获取登录用户人员ID
    if (!judgePrivilege()) {
        if (roleNum == 2) { //登录角色是现场检测人员
            if (taskStatus == "待领取") {
                btn = ['领取任务', '取消'];
            } else if (taskStatus == "执行中") {
                btn = ['提交审核', '取消'];
            } else {
                btn = ['关闭'];
            }

        } else {
            if (detectUser == detectUserId && taskStatus == "待领取") {  //任务检测ID与登录人员id一致 && 任务状态待领取 
                btn = ['领取任务', '取消'];
            } else if (detectUser == detectUserId && taskStatus == "执行中") {
                btn = ['提交审核', '取消'];
            } else if (taskStatus == "待审核") {
                btn = ['审核通过', '取消']
            } else {
                btn = ['关闭']
            }
        }
    } else {
        btn = ['关闭']
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '查看任务及检测数据',
        area: ['950px', '600px'],
        btn: btn,
        yes: function (index, layero) {
            var windowObj = layero.find('iframe')[0].contentWindow;
            if (!judgePrivilege()) {
                if ((roleNum == 2 && taskStatus == "执行中") || (detectUser == detectUserId && taskStatus == "执行中")) {
                    //权限现场检测人员&&任务状态执行中 || 任务检测ID与登录人员id一致 && 任务状态执行中
                    parent.layer.confirm('提交审核后无法继续测试，您确定提交审核吗？', { skin: 'self' }, function () {
                        $.ajax({
                            url: "/cloudlink-corrosionengineer/task/checkTaskHasData?taskId=" + objectId,
                            type: "get",
                            success: function (res) {
                                if (res.success == 1) {
                                    if (res.hasData != false) {
                                        var approvedFlag = windowObj.approved();
                                        if (approvedFlag == true) {
                                            $('#tb-all-task').bootstrapTable('refresh', true);
                                        }
                                    } else {
                                        parent.layer.confirm("请至少录入一个桩的检测数据", {
                                            title: "提示",
                                            btn: ['确定'], //按钮
                                            skin: 'self'
                                        });
                                    }
                                    parent.layer.close(index);
                                } else {

                                }
                            }
                        })

                    })
                } else if ((roleNum != 2 && taskStatus == "待审核")) { //权限不是现场检测人员且任务状态为待审核
                    parent.layer.confirm('审核通过后无法继续测试，您确定审核通过吗？', { skin: 'self' }, function () {
                        var approvedFlag = windowObj.approved();
                        if (approvedFlag == true) {
                            $('#tb-all-task').bootstrapTable('refresh', true);
                            parent.layer.close(index);
                        }
                    })
                } else if ((roleNum == 2 && taskStatus == "待领取") || (detectUser == detectUserId && taskStatus == "待领取")) {
                    //权限现场检测人员&&任务状态待领取 || 任务检测ID与登录人员id一致 && 任务状态待领取
                    var approvedFlag = windowObj.approved();
                    if (approvedFlag == true) {
                        $('#tb-all-task').bootstrapTable('refresh', true);
                        parent.layer.close(index);
                    }
                } else {
                    parent.layer.close(index);
                }
            } else {
                parent.layer.close(index);
            }
        },

        btn2: function (index, layero) {
        },
        content: getRootPath() + "/src/html/task/specific_task/view_task.html?objectId=" + objectId + '&detectMethod=' + detectMethod + '&taskStatus=' + encodeURI(taskStatus) + '&detectUserId=' + detectUserId + '&taskName='+encodeURI(taskName)
    });
    parent.layer.full(index)
};

/**
 * @desc 修改任务
 * @method view
 * @param {*String} objectId, taskStatus
 */
function updateTask(objectId, taskStatus) {

    var taskStatusId;
    switch (taskStatus) {
        case "待领取":
            taskStatusId = "1";
            break;
        case "执行中":
            taskStatusId = "2";
            break;
        case "待审核":
            taskStatusId = "3";
            break;
        case "已审核":
            taskStatusId = "4";
            break;
    }
    if (taskStatusId == "4") {
        return;
    } else {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: '修改任务',
            area: ['950px', '600px'],
            btn: ['提交', '取消'],
            yes: function (index, layero) {
                var windowObj = layero.find('iframe')[0].contentWindow;
                var updateFlag = windowObj.update();
                if (updateFlag == true) {
                    $('#tb-all-task').bootstrapTable('refresh', true);
                    parent.layer.close(index);
                }
            },
            btn2: function (index, layero) { },
            content: getRootPath() + "/src/html/task/specific_task/add_task.html?objectId=" + objectId + "&taskStatus=" + taskStatusId + "&detectMethod=" + detectMethod
        });
        parent.layer.full(index);
    }
}

/**
 * @desc 重置form表单
 * @method clearForm
 */
function clearForm() {
    document.getElementById("searchForm").reset();
    $('.selectpicker').selectpicker('val', null);
    $("#pipeName").val("");
    querylist();
}

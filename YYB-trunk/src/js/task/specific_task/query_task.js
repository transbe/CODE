/**
 * @file
 * @author  gaohui
 * @desc m1-m10任务列表操作逻辑
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:23:58
 * 
 * @last modified by lixiaolong 新增M11
 * @last modified time  2017年8月18日08:55:30
 */
var detectMethod = getParameter('method');  //获取检测方法
var roleNum = lsObj.getLocalStorage('params'); //获取角色 的标识
var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));   //获取useBo
var token = lsObj.getLocalStorage("token"); //获取tokens

var language = lsObj.getLocalStorage("i18nLanguage"), //获得语言的key
    mobileNum = userBo.mobileNum;

var numberPage; //定义页码
var imageCode; // 图形验证码
$(function () {
    changePageStyle("../../..");
    if (detectMethod == 1 || detectMethod == 2 || detectMethod == 3 || detectMethod == 6) { //判读检测方法是否为1,2,3,6
        $('#viewGraph').css('display', 'inline-block'); //曲线图区域显示
    }
    if (detectMethod == 11 ) { //M11暂时导出检测记录不可用
        $('#exportWorkBook').css('display', 'none'); //隐藏
    }
    getPipeline("pipeName",detectMethod);   //加载管线名称下拉选
    loadDetectUserName("detectUserName");  //初始化下拉选（检测单位（人员））
    //时间插件
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4,
        pickTime: false
    });
    clickSearch();
    loadTable();    //初始化Table
    setTableHeight('tb-all-task');  //设置表格高度
    //回车查询
    $("#searchForm").keydown(function() {
        if (event.keyCode == "13") { //keyCode=13是回车键
           $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
        }
    });
    $('.more').click(function() {
        $('.more').toggleClass("active");
        $('.more_item_wrapper').toggle();
        setTableHeight('tb-all-task');
    });
    document.getElementById("lineHeight").style.height = "40px";
});

//定义网格化传入参数的值
var items = {
    "taskStatusId": '', //任务状态
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
             //任务状态taskStatus 1待领取 2执行中 3待审核 4审核完成
            if (roleNum == 2) { //判断是否为检测账号
                if ($("#taskStatus").val() == "") {   //判断任务状态是否为空
                    params.taskStatusId = "1,2,3"; //设置任务状态为待领取，进行中，待审核
                } else {
                    params.taskStatusId = items.taskStatusId;
                }
                if ($("#detectUserName").val() == "") {   //判断检测人员账号是否为空
                    params.detectUserId = userBo.objectId;  //设置检测人员ID为登陆人员ID
                } else {
                    params.detectUserId = $("#detectUserName").val();
                }
            } else {
                params.taskStatusId = items.taskStatusId;
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
            params.sortName = this.sortName;  
            params.sortOrder = this.sortOrder;  
            return params;
        },
        columns: [{
            checkbox: true,
        }, {
            field: 'sequence',
            title: getLanguageValue("No"),
            formatter: function (value, row, index) {
                return currentPageSize * (numberPage - 1) + index + 1;
            }
        }, {
            field: 'detectMethod',
            title: getLanguageValue("detectMethod"),
            width: '6%',
            formatter: function (value, row, index) {
                return 'M' + row.detectMethod;
            }
        }, {
            field: 'taskName',
            title: getLanguageValue("taskName"),
            sortable: true,
            width: '12%'
        }, {
            field: 'pipelineName',
            title: getLanguageValue("pipelineName"),
            width: '12%'
        }, {
            field: 'taskStatus',
            title: getLanguageValue("taskStatusVal"),
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
            sortable: true,
            width: '8%'
        }, {
            field: 'taskProcess',
            title: getLanguageValue("taskProcess"),
            width: '5%'
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
            width:'10%',
            class: 'td-nowrap',
            formatter: function (value, row, index) {
                var createTime = (row.createTime).split(' ');
                return createTime[0];
            }
        }, {
            field: 'operation',
            title: getLanguageValue("operation"),
            width:'10%',
            formatter: function (value, row, index) {
                // console.log(row.auditorId);
                // console.log(row.taskStatus);
                 //任务状态taskStatus 1待领取 2执行中 3待审核 4审核完成
                var e = '<a href="#" mce_href="#" title=" ' + getLanguageValue("view") +'" onclick="view(\'' + row.objectId + "\',\'" + row.taskStatus + "\',\'" + row.detectUserId+ "\',\'" + row.taskName+ "\',\'" + row.auditorId + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                if (!judgePrivilege()) {
                    if (roleNum != 2) {
                        var d = '<a href="#" mce_href="#" title="' + getLanguageValue("edit") +'" onclick="updateTask(\'' + row.objectId + '\',\'' + row.taskStatus + '\')"><span class="glyphicon glyphicon-edit" id = "editColor"></span></a> ';
                        if (row.taskStatus == 4 ) {
                            d = '<a href="#" mce_href="#" title="' + getLanguageValue("edit") +'" onclick="updateTask(\'' + row.objectId + '\',\'' + row.taskStatus + '\')"><span class="glyphicon glyphicon-edit" style="color:#ccc"></span></a> ';
                        }

                        return e + d;
                    }
                }
                return e;
            }
        }
        ],
        onDblClickRow: function (row) {
            view(row.objectId, row.taskStatus, row.detectUserId,row.taskName,row.auditorId);
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
                layer.alert(getLanguageValue("load_data_error"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
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
 * @desc 新增任务
 * @method addTask
 */
function addTask() {
    uncheck("addTaskButton");   //取消按钮选中状态
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("add_task"),
        skin: 'self-iframe',
        area: ['950px', '600px'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancel")],
        yes: function (index, layero) {
            if(!preventDblClick){
                preventDblClick = true;
                var windowObj = layero.find('iframe')[0].contentWindow;
                var result = windowObj.saveData();
                if (result == true) {
                    $('#tb-all-task').bootstrapTable('refresh', true);
                    parent.layer.close(index);
                }else{
                    preventDblClick = false;
                }
            }else{
                preventDblClick = false;
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
 */
function deleteTask() {
    uncheck("deleteTaskButton");   //取消按钮选中状态
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (rowDate.length > 0) {
        var isDelte = "";
        var str = "";
        var objectIds = "";
        //任务状态taskStatus 1待领取 2执行中 3待审核 4审核完成
        for (var i = 0; i < rowDate.length; i++) {
            if (rowDate[i].taskStatus == 2) {   //任务状态执行中
                str += getLanguageValue("taskName")+'：' + rowDate[i].taskName + getLanguageValue("task_progress") + "\n";
            }
            if (rowDate[i].taskStatus == 3) {  //任务状态待审核
                str += getLanguageValue("taskName")+'：' + rowDate[i].taskName + getLanguageValue("task_reviewed") + "\n";
            }
            if (rowDate[i].hasData == 1) {    //有检测数据
                isDelte += getLanguageValue("taskName")+'：' + rowDate[i].taskName + ",";
            }
            objectIds += rowDate[i].objectId + ",";
        }
        if (!isNull(isDelte)) {
            console.log(isDelte);
            isDelte = isDelte.substring(0, isDelte.length - 1);
            isDelte += getLanguageValue("data_no_delete");
            // var index = layer.alert(isDelte, {
            //     title: getLanguageValue("tip_title"),
            //     skin: 'self-alert', //按钮
            // });
            var index = layer.confirm(isDelte, {
                title: getLanguageValue("tip_title"),
                btn:[ getLanguageValue("delete1"), getLanguageValue("cancel")],
                skin: 'self', //按钮
            }, function () {
                // removeTask(objectIds);
                // getVerifyCode(objectIds);
                getImageVerifyCode(objectIds);
                layer.close(index);
            });
        } else {
            if (str != "") {
                var index = layer.confirm(str + getLanguageValue("delete_no_view"), {
                    title: getLanguageValue("tip_title"),
                    btn:[ getLanguageValue("delete1"), getLanguageValue("cancel")],
                    skin: 'self', //按钮
                }, function () {
                    // removeTask(objectIds);
                    // getVerifyCode(objectIds);
                    getImageVerifyCode(objectIds);
                    layer.close(index);
                });
            } else {
                var index = layer.confirm(getLanguageValue("is_delete"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self', //按钮
                }, function () {
                    removeTask(objectIds);
                    layer.close(index);
                });
            }
        }
    } else {
        layer.alert(getLanguageValue("select_one_data"), {
            title: getLanguageValue("tip_title"),
            skin: 'self'
        });
    }
};



/**
 * @desc 删除任务
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
                parent.layer.msg(getLanguageValue("delete_success"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('删除任务', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (error) {

                }
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
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
        layer.alert(getLanguageValue("select_only_one"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    var layer1 = parent.layer.open({
        type: 2,
        title: getLanguageValue("graph"),
        skin: 'self-iframe',
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
        layer.alert(getLanguageValue("select_only_one"), {
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
    var url = '/cloudlink-corrosionengineer/task/exportTask?token=' + lsObj.getLocalStorage('token') + '&objectIds=' + objectIds + '&type=selected';
    $("#exportExcelIframe").attr("src", url);
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
        layer.alert(getLanguageValue("no_export"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }

    var detectUserId = "";
    if(roleNum == 2){
        detectUserId = userBo.objectId;
    }else{
        detectUserId = $("#detectUserName").val()
    }
    var url = '/cloudlink-corrosionengineer/task/exportTask?token=' + token + '&pipeID=' + $("#pipeName").val() + '&taskName=' + $("#taskName").val() +
        '&detectMethed=' + detectMethod + '&year=' + $("#year").val() + '&taskStatus=' + items.taskStatusId + '&type=query' + '&detectUserId=' + detectUserId;
    $("#exportExcelIframe").attr("src", url);
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
 * @param {*String} objectId, taskStatus, detectUserId,taskName,auditorId // 审核人员id
 */
function view(objectId, taskStatus, detectUserId,taskName,auditorId) {
    // console.log(auditorId);
    uncheck("viewTaskButton");   //取消按钮选中状态
    var preventDblClick = false;
    var btn = "";
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (objectId != null && objectId != "") {

    } else if (rowDate.length == 1) {
        objectId = rowDate[0].objectId;
        taskStatus = rowDate[0].taskStatus;
        detectUserId = rowDate[0].detectUserId;
        taskName = rowDate[0].taskName;
        auditorId =  rowDate[0].auditorId;
    } else {
        layer.alert(getLanguageValue("select_only_one"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    //任务状态taskStatus 1待领取 2执行中 3待审核 4审核完成
    var detectUser = userBo.objectId;  //获取登录用户人员ID
    // console.log(detectUser);
    // console.log(auditorId);

    if (!judgePrivilege()) {  // 非运营人员
        if (roleNum == 2) { //登录角色是现场检测人员
            if (taskStatus == "1") {  // 待领取
                 // 领取任务  取消
                btn = [getLanguageValue("take_btn"), getLanguageValue("cancel")];
            } else if (taskStatus == "2") { // 执行中
                 // 提交审核  取消
                btn = [getLanguageValue("submit_btn"), getLanguageValue("cancel")];
            } else {
                // 关闭
                btn = [getLanguageValue("close_btn")];
            }

        } else {  // 非现场检测人员
            if (detectUser == detectUserId && taskStatus == "1") {  //任务检测ID与登录人员id一致 && 任务状态待领取 
                 // 领取任务  取消
                btn = [getLanguageValue("take_btn"), getLanguageValue("cancel")];
            } else if (detectUser == detectUserId && taskStatus == "2") {
                 // 提交审核  取消
                btn = [getLanguageValue("submit_btn"), getLanguageValue("cancel")];
            } else if (taskStatus == "3") {
                 // 只有当审核人员id和当前用户id相同时才可以审核    
                 // M1~M10之前没有审核人员这一项，所以，需要对之前的进行原始处理
                 if(detectUser == auditorId){
                    // 审核通过   取消
                    btn = [getLanguageValue("approval_btn"), getLanguageValue("cancel")]
                 }else{
                     // 因为之前的任务没有审核人员id这块，所以还按原来的处理
                     // 审核通过   取消
                    btn = [getLanguageValue("approval_btn"), getLanguageValue("cancel")]
                 }
                
            } else {
                 // 关闭
                btn = [getLanguageValue("close_btn")]
            }
        }
    } else { // 运营人员
        // 关闭
        btn = [getLanguageValue("close_btn")]
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("task_details_data"),
        area: ['950px', '600px'],
        skin: 'self-iframe',
        btn: btn,
        yes: function (index, layero) {
            if(!preventDblClick){
                var windowObj = layero.find('iframe')[0].contentWindow;
                if (!judgePrivilege()) {
                    if ((roleNum == 2 && taskStatus == "2") || (detectUser == detectUserId && taskStatus == "2")) {
                        //权限现场检测人员&&任务状态执行中 || 任务检测ID与登录人员id一致 && 任务状态执行中
                        parent.layer.confirm(getLanguageValue("judge_go"), { skin: 'self' }, function () {
                            $.ajax({
                                url: "/cloudlink-corrosionengineer/task/checkTaskHasData?taskId=" + objectId + "&token=" + token,
                                type: "get",
                                success: function (res) {
                                    if (res.success == 1) {
                                        if (res.hasData != false) {
                                            var result = windowObj.approved();
                                            if (result == true) {
                                                $('#tb-all-task').bootstrapTable('refresh', true);
                                            }
                                        preventDblClick = true;
                                        } else {
                                            parent.layer.alert(getLanguageValue("one_marker"), {
                                                title: getLanguageValue("tip_title"),
                                                skin: 'self-alert'
                                            });
                                        }
                                        parent.layer.close(index);
                                    } else {

                                    }
                                }
                            })

                        })
                    } else if ((roleNum != 2 && taskStatus == "3")) { //权限不是现场检测人员且任务状态为待审核
                        // 这里应该做判断处理，因为新增审核人员  只有当审核人员id和当前用户id相同时才可以审核
                        if(!isNull(auditorId) && detectUser == auditorId){
                                console.log("这里应该有操作");
                                parent.layer.confirm(getLanguageValue("judge_approve"), { skin: 'self' }, function () {
                                var result = windowObj.approved();
                                if (result == true) {
                                    $('#tb-all-task').bootstrapTable('refresh', true);
                                    parent.layer.close(index);
                                }
                                preventDblClick = true;
                            })
                        }else{
                            // 因为之前的任务没有审核人员id这块，所以还按原来的处理
                            parent.layer.confirm(getLanguageValue("judge_approve"), { skin: 'self' }, function () {
                                var result = windowObj.approved();
                                if (result == true) {
                                    $('#tb-all-task').bootstrapTable('refresh', true);
                                    parent.layer.close(index);
                                }
                                preventDblClick = true;
                            })
                        }
                    } else if ((roleNum == 2 && taskStatus == "1") || (detectUser == detectUserId && taskStatus == "1")) {
                        //权限现场检测人员&&任务状态待领取 || 任务检测ID与登录人员id一致 && 任务状态待领取
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
            }else{
                preventDblClick = false;
            }
        },

        btn2: function (index, layero) {
        },
        content: getRootPath() + "/src/html/task/specific_task/view_task.html?objectId=" + objectId + '&detectMethod=' + detectMethod + '&taskStatus=' + encodeURI(taskStatus) + '&detectUserId=' + detectUserId + '&taskName='+encodeURI(taskName)
    });
    parent.layer.full(index);
};

/**
 * @desc 修改任务
 * @method view
 * @param {*String} objectId, taskStatus
 */
function updateTask(objectId, taskStatus) {
    console.log("update_"+taskStatus)
    var preventDblClick = false;
    var taskStatusId;
    switch (taskStatus) {
        case "1":
            taskStatusId = "1";
            break;
        case "2":
            taskStatusId = "2";
            break;
        case "3":
            taskStatusId = "3";
            break;
        case "4":
            taskStatusId = "4";
            break;
    }
    if (taskStatusId == "4") {
        return;
    } else {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("update_task"),
            area: ['950px', '600px'],
            btn: [getLanguageValue("submit"), getLanguageValue("cancel")],
            skin: 'self-iframe',
            yes: function (index, layero) {
                if(!preventDblClick){
                    preventDblClick = true;
                    var windowObj = layero.find('iframe')[0].contentWindow;
                    var result = windowObj.update();
                    if (result == true) {
                        $('#tb-all-task').bootstrapTable('refresh', true);
                        parent.layer.close(index);
                    }
                }else{
                    preventDblClick = false;
                }
            },
            btn2: function (index, layero) { },
            content: getRootPath() + "/src/html/task/specific_task/add_task.html?objectId=" + objectId + "&taskStatus=" + taskStatusId + "&detectMethod=" + detectMethod
        });
        parent.layer.full(index);
    }
}

/**
 * @desc 导出PDF
 */
function exportWorkBook() {
    uncheck("exportWorkBook");   //取消按钮选中状态
    var rowDate = $('#tb-all-task').bootstrapTable('getSelections');
    if (rowDate.length > 1 || rowDate.length == 0) {
        layer.alert(getLanguageValue("select_only_one"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        return;
    }
    var url = '/cloudlink-corrosionengineer/task/exportInspectionRecord?token=' + token +
        '&detectMethod=' + rowDate[0].detectMethod + '&taskId=' + rowDate[0].objectId+'&taskName='+encodeURI(encodeURI(rowDate[0].taskName)) 
        + '&closeTime='+rowDate[0].closeTime;
    $("#exportExcelIframe").attr("src", url);
};

/**
 * @desc 根据查询条件重新加载数据
 */
$("#searchBtn").click(function(){
    $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
});
/**
 * @desc 重置form表单
 */
$("#resetBtn").click(function() {
    document.getElementById("searchForm").reset();
    $('.selectpicker').selectpicker('val', null);
    $(".task-status .item").removeClass('active');
    $($(".task-status .item")[0]).addClass('active');
    items.taskStatusId = "";
    $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
});

/**
 * @desc 点击按钮查询
 */
function clickSearch(){
    $(".task-status .item").click(function(){   //任务状态
        var $parent = $('.task-status');
        $parent.find(".item").removeClass('active'); //移除所有的active
        $(this).addClass('active'); //将点击按钮设置点击状态
        items.taskStatusId = $(this).attr("data-value"); //获取点击按钮的值
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
    });
    $(".detect-methed .item").click(function(){ //检测方法
        var $parent = $('.detect-methed');
        $parent.find(".item").removeClass('active'); //移除所有的active
        $(this).addClass('active'); //将点击按钮设置点击状态
        items.detectMethod = $(this).attr("data-value"); //获取点击按钮的值
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" }); //刷新页面并跳转到第一页
    });
    $('#pipeName').on('change',function(){
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" });
    });
    $('#year').on('change',function(){
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" });
    });
    $('#detectUserName').on('change',function(){
        $('#tb-all-task').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: "", sortOrder: "" });
    });

}



/**
 * @desc 获取校验码
 */
function getVerifyCode(objectIds){

   var _data= {
            sendMode: "1",
            sendNum: mobileNum,
            signName: "阴保管家",
            useCategory: "general"
        };

    if(language == "en"){
        _data.signName =  "CPEngineer",
        _data.isIntl = true
    }
    $.ajax({
        url: "/cloudlink-core-framework/verfy/getVerifyCode",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(_data),
        success: function(data) {
              console.log(data);
            if(data.success == 1){
                layer.prompt({
                    title:getLanguageValue("enterVerificationCode"),
                    skin: 'self'
                }, function (val, index) {
                    checkVerifyCode(val,objectIds);
                    layer.close(index);
                });
            }else{
                 layer.alert(getLanguageValue("pleaseAgain"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert', //按钮
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    })
}


/**
 * @desc 校验校验码
 */
function checkVerifyCode(val,objectIds){
    // 短信验证码校验
    var _data = {
        sendNum: mobileNum,
        verifyCode: val
    };
    
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-framework/verfy/checkVerifyCode",
        contentType: "application/json",
        data: _data,
        success: function(data, status) {
            var success = data.success;
            if (success == 1) {
                 console.log(data);
                 removeTask(objectIds);
            }else{
               layer.alert(getLanguageValue("inspectionFailure"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert', //按钮
                });
            }
        }
    });
}

/**
 * @desc 生成图形验证
 */
function getImageVerifyCode(objectIds){

    layer.open({
        type: 1,
        skin: 'self-iframe',
        area: ['300px', '180px'], //宽高
        title: getLanguageValue("enterVerificationCode"),
        btn: [getLanguageValue("submit"), getLanguageValue("cancel")],
        yes:function (index, layero) {
            var inputCode = layero.find("#inputCode").val();
            var imgReg = new RegExp(imageCode, "i");
            if(imgReg.test(inputCode)){
                 removeTask(objectIds);
                 layer.close(index);
            }else{
                 layero.find("#codeError").show()
                 return false;
            }
        },
        content: '<div style="margin:25px auto;position:relative;text-align:center;">\
                      <input type="text" id="inputCode" placeholder="&nbsp;'+ getLanguageValue("enterVerificationCode") +'" style="width:90%;height:36px;margin-left:3%;border-radius:4px;border:1px solid #ddd">\
                      <div style="position:absolute;right:5%;top:1px;width:100px;height:34px;line-height:34px;background:url(../../../images/forget_img/code.jpg) no-repeat 0 center;border-radius:4px;border:1px solid #fff;text-align:center"><i style="font-size:22px;font-weight:bold;color:#fff;letter-spacing: 8px;" id="Code">'+ code() +'</i></div></br>  \
                      <span id="codeError" style="color:red;position:absolute;top:45px;left: 10%;">'+ getLanguageValue("codeError")+'</span>\
                  </div>',
        success: function(layero, index){
            layero.find("#codeError").hide();
            $(document).on("click","#Code",function(){
               $(this).html(code());
            });
            $(document).find("#inputCode").blur(function(){
                var inputCode = layero.find("#inputCode").val();
                var imgReg = new RegExp(imageCode, "i");
                if(imgReg.test(inputCode)){
                    layero.find("#codeError").hide();
                }else{
                    layero.find("#codeError").show()
                    return false;
                }
            })
        }
    });
}


/**
 * @desc 生成验证码
 */
function code() {
    var imgStr;
    var az = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    var dom2 = parseInt(Math.random() * 10000 % 62);
    var dom3 = parseInt(Math.random() * 10000 % 62);
    var dom4 = parseInt(Math.random() * 10000 % 62);
    var dom1 = parseInt(Math.random() * 10000 % 62);
    imgStr = az[dom1] + az[dom2] + az[dom3] + az[dom4];
    imageCode = imgStr;
    return imgStr
}
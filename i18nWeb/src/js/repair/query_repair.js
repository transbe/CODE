/**
 * @file
 * @author  lixiaolong
 * @desc 维修管理列表操作逻辑
 * @date  2017-07-13
 * @last modified by 
 * @last modified time  
 */
var roleNum = lsObj.getLocalStorage('params'); //获取角色 的标识
var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); //获取useBo
var token = lsObj.getLocalStorage("token"); //获取token
var user = JSON.parse(lsObj.getLocalStorage("userBo")); //获取user
var enterpriseId = user.enterpriseId; //公司名称id
var numberPage; //定义页码
//定义网格化传入参数的值
var items = {
    "riskType": "",
    "repairStatus":""
};


$(function () {
    changePageStyle("../../"); //换肤
    getPipeline("pipeName", 0); //初始化管线下拉选
    // 时间插件===========
    $("#createTimeRangMin,#createTimeRangMax").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month"
    }).on("click", function () {
        $("#createTimeRangMin").datetimepicker("setEndDate", $("#createTimeRangMin").val())
        $("#createTimeRangMax").datetimepicker("setEndDate", $("#createTimeRangMax").val())
    });
    //初始化Table
    loadTable();
    //设置Table高度
    setTableHeight('repair_records');
    //回车查询
    $("#searchForm").keydown(function () {
        if (event.keyCode == "13") { //keyCode=13是回车键
            $('#repair_records').bootstrapTable('refreshOptions', {
                pageNumber: 1,
                sortName: "",
                sortOrder: ""
            }); //刷新页面并跳转到第一页
        }
    });
    //点击高级查询
    $('.more').click(function () {
        $('.more').toggleClass("active");
        $('.more_item_wrapper').toggle();
        setTableHeight('repair_records');
        document.getElementById("lineHeight").style.height = "40px";
    });

    $("#searchBtn").click(function () {
        $('#repair_records').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        }); //刷新页面并跳转到第一页
    });
    $("#resetBtn").click(function () {
        $('#markerName').val(null);
        $('.create-time').val(null);
        items.riskType = "";
        items.repairStatus = "";
        $('.selectpicker').selectpicker('val', null);
        $(".repairStatus .item").removeClass('active');
        $($(".repairStatus .item")[0]).addClass('active');
        $(".riskType .item").removeClass('active');
        $($(".riskType .item")[0]).addClass('active');
        $('#repair_records').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        }); //刷新页面并跳转到第一页
    });
    //点击查询
    clickSearch();
});

/**
 * @desc 点击按钮查询
 */
function clickSearch() {
    //根据维修状态查询
    $(".repairStatus .item").click(function () {
        var $parent = $('.repairStatus');
        $parent.find(".item").removeClass('active'); //移除所有的active
        $(this).addClass('active'); //将点击按钮设置点击状态
        items.repairStatus = $(this).attr("data-value"); //获取点击按钮的值
        $('#repair_records').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        }); //刷新页面并跳转到第一页
    });
    //根据风险类型查询
    $(".riskType .item").click(function () {
        var $parent = $('.riskType');
        $parent.find(".item").removeClass('active'); //移除所有的active
        $(this).addClass('active'); //将点击按钮设置点击状态
        items.riskType = $(this).attr("data-value"); //获取点击按钮的值
        $('#repair_records').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        }); //刷新页面并跳转到第一页
    });
    //根据所属管线查询
    $('#pipeName').on('change', function () { //管线
        $('#repair_records').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        });
    });
    //根据时间范围查询
    $("#dateBtn").on('click', function () {
        if (isNull($("#createTimeRangMin").val())) {
            parent.layer.alert("请选择起始时间", {
                title: "提示",
                skin: 'self-alert'
            });
            return;
        } else if (isNull($("#createTimeRangMax").val())) {
            parent.layer.alert("请选择结束时间", {
                title: "提示",
                skin: 'self-alert'
            });
            return;
        } else {
            $("#dateBtn").addClass("active")
            $('#repair_records').bootstrapTable('refreshOptions', {
                pageNumber: 1,
                sortName: "",
                sortOrder: ""
            }); //刷新页面并跳转到第一页
        }
    });
    $(".create-time").on("change", function () {
        if (!isNull($("#createTimeRangMin").val()) && !isNull($("#createTimeRangMax").val())) {
            $("#dateBtn").addClass("active")
        } else {
            $("#dateBtn").removeClass("active");
        }
    });
}

/**
 * @desc 初始化列表
 */
function loadTable() {
    var currentPageNumber; //定义当前页码
    var currentPageSize; //定义当前页大小
    var url = handleURL('/cloudlink-corrosionengineer/equipment/query'); //对url进行权限处理
    try {
        $('#repair_records').bootstrapTable({
            url: url, //请求后台的URL（*）
            method: 'get', //请求方式（*）
            toolbar: "#toolbar",
            pageSize: 50,
            queryParams: function (params) {
                numberPage = this.pageNumber;
                currentPageNumber = this.pageNumber;
                currentPageSize = this.pageSize;
                if (items.repairStatus != "") { //维修状态为全部
                    params.repairStatus = items.repairStatus;
                }
                params.pageNum = -1;
                params.riskType = items.riskType //风险类型
                params.markerName = $("#markerName").val(); //测试桩名字
                params.belongPipelineId = $("#pipeName").val(); //管线ID
                params.createTimeRangMin = $("#createTimeRangMin").val(); //年度
                params.createTimeRangMax = $("#createTimeRangMax").val(); //年度
                params.pageSize = this.pageSize; //页面大小s
                params.pageNum = this.pageNumber; //当前页码
                params.sortName = this.sortName;
                params.sortOrder = this.sortOrder;
                params.token = lsObj.getLocalStorage("token"); //token
                params.enterpriseId = enterpriseId;
                return params;
            },
            columns: [{
                checkbox: true
            }, {
                title: '序号',
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'repairTheme',
                title: '维修主题',
                sortable: true,
                width: '10%'
            }, {
                field: 'markerZone',
                title: '维修范围',
                sortable: false,
                width: '15%',
                formatter: function (value, row, index) {
                    if (row.markerZone != null && row.markerZone != "") {
                        var Zone = new Array();
                        Zone = row.markerZone.split('--');
                        if (Zone.length > 1) {
                            var str = Zone[0] + "---" + Zone[Zone.length - 1];
                            return str;
                        } else {
                            return row.markerZone;
                        }
                    }
                }
            }, {
                field: 'equipmentType',
                title: '设备类型',
                // sortable: true,
                width: '7%'
            }, {
                field: 'riskType',
                title: '风险类型',
                width: '10%'
            }, {
                field: 'pipelineName',
                title: '所属管线',
                sortable: true,
                width: '8%'
            }, {
                field: 'emergencyLevel',
                title: '紧急程度',
                width: '10%'
            }, {
                field: 'repairStatus',
                title: '维修状态',
                sortable: true,
                width: '10%'
            }, {
                field: 'repairUser',
                title: '维修负责人',
                sortable: true,
                width: '10%',
                class: 'td-nowrap',
            }, {
                field: 'createTime',
                title: '创建时间',
                sortable: true,
                width: '10%',
                formatter: function (value, row, index) {
                    if (row.createTime != null && row.createTime != "") {
                        var createTime = (row.createTime).split(' ');
                        return createTime[0];
                    } else {
                        return "";
                    }
                }
            }, {
                field: 'operation',
                title: '操作',
                width: '10%',
                class: 'td-nowrap',
                formatter: function (value, row, index) {
                    var e = '<a href="#" mce_href="#" title = "查看" onclick="viewRecord(\'' + row.objectId + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                    var d = '<a href="#" mce_href="#" title = "修改" onclick="updateRecord(\'' + row.objectId + '\',\'' + row.repairStatus + '\')"><span class="glyphicon glyphicon-edit"></span></a> ';
                    if (row.repairStatus == "维修完成") {
                        d = '<a href="#" mce_href="#" title = "修改"><span class="glyphicon glyphicon-edit" style="color:#ccc"></span></a> ';
                    }
                    var f = '<a href="#" mce_href="#" title = "关闭" onclick="closeRecord(\'' + row.objectId + '\',\'' + row.repairStatus + '\')"><span class="glyphicon glyphicon-remove-circle"></span></a> ';
                    if (row.repairStatus == "维修完成") {
                        f = '<a href="#" mce_href="#" title = "关闭"><span class="glyphicon glyphicon-remove-circle" style="color:#ccc"></span></a> ';
                    }
                    return e + d + f;
                }
            }],
            onDblClickRow: function (row) {
                viewRecord(row.objectId);
            },
            responseHandler: function (res) { //加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
                if (res.success == 1) {
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('查询维修记录', {
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
                            zhuge.track('查询维修记录', {
                                "结果": "失败"
                            });
                        }
                    } catch (error) {

                    }
                    layer.alert("加载数据出错", {
                        title: "提示",
                        skin: "self-alert"
                    });
                }
            }
        });
    } catch (e) {
        alert(e);
    }
}
/**
 * @desc 新增维修记录
 */
function addRecord() {
    uncheck("add"); //取消按钮选中状态
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '新增维修记录',
        area: ['950px', '600px'],
        btn: ['提交', '取消'],
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            var addPage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = addPage.saveData();
                if (result == true) { //保存成功
                    parent.layer.close(index);
                    $('#repair_records').bootstrapTable('refresh', true); //刷新数据
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#addData").attr('disabled', false);
        },
        content: rootPath + "/src/html/repair/add_repair.html?"
    });
}
/**
 * @desc 修改维修记录
 */
function updateRecord(objectId,repairStatus) {
    uncheck("update"); //取消按钮选中状态
    var preventDblClick = false;
    var objectId = objectId || "";
    var repairStatus = repairStatus || "";
    if (objectId == "") {
        var rowDate = $('#repair_records').bootstrapTable('getSelections');
        if (rowDate.length != 1) {
            layer.alert("请选择一条数据", {
                title: "提示",
                skin: 'self'
            });
            return;
        } else {
            objectId = rowDate[0].objectId;
            repairStatus = rowDate[0].repairStatus;
        }
    }
    if(repairStatus == "维修完成"){
        layer.alert("该记录已关闭不能修改", {
            title: "提示",
            skin: 'self'
        });
        return;
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '修改维修记录',
        area: ['950px', '600px'],
        btn: ['提交', '取消'],
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            var addPage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = addPage.saveData();
                if (result == true) { //修改成功
                    parent.layer.close(index);
                    $('#repair_records').bootstrapTable('refresh', true); //刷新数据
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#addData").attr('disabled', false);
        },
        content: rootPath + "/src/html/repair/add_repair.html?objectId=" + objectId
    });
}
/**
 * @desc 删除维修记录（前端预处理）
 */
function deleteRecord(objectId, repairStatus) {
    uncheck("delete"); //取消按钮选中状态
    var preventDblClick = false;
    var objectIds = objectId || "";
    if (objectIds == "") {
        var rowDate = $('#repair_records').bootstrapTable('getSelections');
        if (rowDate.length > 0) {
            var message = "";
            for (var i = 0; i < rowDate.length; i++) {
                if (i == rowDate.length - 1) {
                    objectIds = objectIds + rowDate[i].objectId;
                } else {
                    objectIds = objectIds + rowDate[i].objectId + ",";
                }
                if (rowDate[i].repairStatus == "维修中") {
                    message = message + "[" + rowDate[i].repairTheme + "]" + ","
                }
            }
            if (message != "") {
                message = message.substring(0, message.length - 1) + "--记录正在维修中,不能删除";
                layer.alert(message, {
                    title: "提示",
                    skin: 'self'
                });
                return;
            } else {
                var index = layer.confirm("删除后无法查看数据", {
                    title: "提示",
                    skin: 'self', //按钮
                }, function () {
                    removeRecord(objectIds);
                    layer.close(index);
                });
            }
        } else {
            layer.alert("请至少选择一条数据", {
                title: "提示",
                skin: 'self'
            });
            return;
        }
    } else {
        if (repairStatus == "维修中") {
            layer.alert("该记录正在维修中，无法删除", {
                title: "提示",
                skin: 'self'
            });
            return;
        } else {
            var index = layer.confirm("删除后无法查看数据", {
                title: "提示",
                skin: 'self', //按钮
            }, function () {
                removeRecord(objectIds);
                layer.close(index);
            });
        }
    }
}

/**
 * @desc 删除维修记录（与后台交互）
 */
function removeRecord(objectIds) {
    var data = {
        "objectId": objectIds
    }
    $.ajax({
        url: "/cloudlink-corrosionengineer/equipment/delete?token=" + token,
        type: "post",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (res) {
            if (res.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('删除维修记录', {
                            '操作': '成功'
                        });
                    }
                } catch (error) {

                }
                var rows = $('#repair_records').bootstrapTable('getData', true); //获取当前页的数据
                var rows1 = $('#repair_records').bootstrapTable('getSelections'); //获取选中的数据
                if (numberPage != 1 && rows.length == rows1.length) { //页码不是1,当前页数量等于选中数量
                    $('#repair_records').bootstrapTable('prevPage'); //调转到上一页
                } else {
                    $('#repair_records').bootstrapTable('refresh', true); //刷新数据
                }
                parent.layer.msg("删除成功！", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('删除维修记录', {
                            '操作': '失败'
                        });
                    }
                } catch (error) {

                }
                parent.layer.alert(res.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
    });
}

/**
 * @desc 查看维修记录
 */
function viewRecord(objectId) {
    var objectId = objectId || "";
    if (objectId == "") {
        var rowDate = $('#repair_records').bootstrapTable('getSelections');
        if (rowDate.length != 1) {
            layer.alert("请选择一条数据", {
                title: "提示",
                skin: 'self'
            });
            return;
        } else {
            objectId = rowDate[0].objectId;
        }
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '查看维修记录',
        area: ['950px', '600px'],
        btn: ['关闭'],
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            parent.layer.close(index);
        },
        content: rootPath + "/src/html/repair/view_repair.html?objectId=" + objectId
    });
}
/**
 * @desc 关闭维修记录（前端预处理）
 */
function closeRecord(objectId, repairStatus) {
    var repairStatus = repairStatus || "";
    var objectId = objectId || "";
    if (objectId == "") {
        var rowDate = $('#repair_records').bootstrapTable('getSelections');
        if (rowDate.length == 1) {
            repairStatus = rowDate[0].repairStatus;
            if (repairStatus == "维修完成") {
                return;
            } else {
                objectId = rowDate[0].objectId;
                var index = layer.confirm("关闭后将无法修改记录", {
                    title: "提示",
                    skin: 'self', //按钮
                }, function () {
                    closeOrder(objectId);
                    layer.close(index);
                });
            }
        } else {
            layer.alert("请至少选择一条数据", {
                title: "提示",
                skin: 'self'
            });
            return;
        }
    } else {
        if (repairStatus == "维修完成") {
            return;
        } else {
            var index = layer.confirm("关闭后将无法修改记录", {
                title: "提示",
                skin: 'self', //按钮
            }, function () {
                closeOrder(objectId);
                layer.close(index);
            });
        }
    }
}
/**
 * @desc 关闭维修记录(与后台交互)
 */
function closeOrder(objectId) {
    var data = {
        "objectId": objectId
    }
    $.ajax({
        url: "/cloudlink-corrosionengineer/equipment/closeOrder?token=" + token,
        type: "post",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (res) {
            if (res.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('关闭维修记录', {
                            '操作': '成功'
                        });
                    }
                } catch (error) {

                }
                $('#repair_records').bootstrapTable('refresh', true); //刷新数据
                parent.layer.msg("操作成功！", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('关闭维修记录', {
                            '操作': '失败'
                        });
                    }
                } catch (error) {

                }
                parent.layer.alert(res.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
    });
}
/**
 * @desc 导出维修记录
 */
function exportRecord() {
    uncheck("export"); //取消按钮选中状态
    var objectIds = "";
    var url = "";
    var rowDate = $('#repair_records').bootstrapTable('getSelections');
    if (rowDate.length > 0) {
        for (var i = 0; i < rowDate.length; i++) {
            if (i != rowDate.length - 1) {
                objectIds += rowDate[i].objectId + ","
            } else {
                objectIds += rowDate[i].objectId
            }
        }
        url = '/cloudlink-corrosionengineer/equipment/export?token=' + lsObj.getLocalStorage('token') + '&objectId=' + objectIds;
    } else {
        var index = layer.confirm("删除后无法查看数据", {
            title: "提示",
            skin: 'self', //按钮
        }, function () {
            url = '/cloudlink-corrosionengineer/equipment/export?token=' + token + '&riskType=' + items.riskType + '&createTimeRangMin=' + $("#createTimeRangMin").val() +
                '&createTimeRangMax=' + createTimeRangMax + '&belongPipelineId=' + $("#pipeName").val() + '&enterpriseId=' + enterpriseId;
            if (items.repairStatus != "") { //维修状态为全部
                url = url + '&repairStatus=' + items.repairStatus;
            }
            layer.close(index);
        });
    }
    $("#exportExcelIframe").attr("src", url);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出维修记录', {
                '结果': '成功'
            });
        }
    } catch (error) {

    }
}

/**
 * @desc 获取管线下拉框
 */
function getPipeline(pipeName, detectMethod) {
    var url = handleURL("/cloudlink-corrosionengineer/task/getPipeline?token=" + token + "&detectMethod=" + detectMethod);    //对URL进行权限处理 
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.dataList;
                var options = '<option value="">请选择</option>';
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].id + '">' + data[i].text + '</option>';
                }
                var mySelectId = document.getElementById(pipeName);
                if (mySelectId.options.length == 0) {
                    $("#" + pipeName).html(options);
                    $("#" + pipeName).selectpicker('refresh');
                }
            } else {
                layer.alert("加载下拉选失败", {
                    title: 提示,
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(SELECT_ERROR_MSG, {
                title: 提示,
                skin: 'self-alert'
            });
        }
    });
}

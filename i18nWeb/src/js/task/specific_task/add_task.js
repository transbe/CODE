/**
 * @file
 * @author  gaohui
 * @desc 任务的新增和修改
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:24:53
 */
var objectId = getParameter("objectId"); //获取任务ID
var selectData = []; //定义一个全局数组变量
var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); //获取localstorage 的useBo
var detectMethod = getParameter('detectMethod') //获取检测方法
var currentSelectPipelineId = ""; //初始化点击管线时的管线ID
var taskStatus = getParameter("taskStatus"); //获取任务状态
var token = lsObj.getLocalStorage("token"); //获取token
var pick = $("#pickList").pickList({
    data: [],
});
$(function () {
    changePageStyle("../../..");
    firstLogin(); // 判断是否是第一次登陆，第一次展示向导

    if (detectMethod == 1) { //检测方法为1时取消 从检测区划分的 功能
        $("#addButton").css('display', 'none');
    }
    if (taskStatus == 3) { //任务状态为待审核时移除按钮不可点击
        $(".pRemove").attr("disabled", true)
        $(".pRemoveAll").attr("disabled", true)
    }
    if (isNull(objectId)) {
        generateWorkOrder();
    }
    loadDetectUserName("detectUserName"); //加载检测人员下拉框
    loadHistoricalRecord("historicalRecord"); //加载历史记录下拉框

    if (!isNull(objectId)) { //判断任务id是否为空
        queryTaskById(objectId); //根据objectId获取任务信息
    } else {
        $("#importData").css("display", ''); //任务ID为空时显示 从历史区域选择测试桩和 从检测区划分的功能
    }
    //时间插件
    $("#startTimePlan").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month"
    }).on("click", function () {
        $("#startTimePlan").datetimepicker("setEndDate", $("#endTimePlan").val())
    }).on('hide', function (e) {
        $('#addTaskFrom').data('bootstrapValidator')
            .updateStatus('startTimePlan', 'NOT_VALIDATED', null)
            .validateField('startTimePlan');
    });
    $("#endTimePlan").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month"
    }).on("click", function () {
        $("#endTimePlan").datetimepicker("setStartDate", $("#startTimePlan").val())
    }).on('hide', function (e) {
        $('#addTaskFrom').data('bootstrapValidator')
            .updateStatus('endTimePlan', 'NOT_VALIDATED', null)
            .validateField('endTimePlan');
    });

    //获取管线树
    getPipelineTree();

    //改变 pickListResult 下拉框的值时进行重新校验
    $(".pickListLenght").on("click", function (e) {
        e.preventDefault();
        setTimeout(function () {
            var check =
                $('#addTaskFrom').data('bootstrapValidator')
                .updateStatus('pickListResult', 'NOT_VALIDATED', null)
                .validateField('pickListResult');
            queryMarkList(currentSelectPipelineId); //更新管线下的测试桩数据
        }, 100);
    })
    $("#historicalRecord").bind("change", function () {
        fromHistoryTask();
        // setTimeout(function() {
        var check = $('#addTaskFrom').data('bootstrapValidator');
        check.resetField("pickListResult");
        check.validateField("pickListResult");
        queryMarkList(currentSelectPipelineId); //更新管线下的测试桩数据
        // }, 100);

    })

});

//窗口大小改变时设置备注宽度
window.onresize = function () {
    setRemarkWidth();
}

//刷新窗口页面时设置备注宽度
window.onload = function () {
    setRemarkWidth();
};

/**
 * @desc 设置备注的宽度
 */
function setRemarkWidth() {
    var rwidth = document.getElementById('remark');
    var rowWidth = $("#pickList").parent().width();
    // var treePadding = parseInt($(".treeview").parent().css('paddingLeft'));
    var pickListPadding = parseInt($(".pickListResult").parent().css('paddingRight'));
    var labelWith = $(".remark-style").width();
    var labelPadding = parseInt($(".remark-style").css('paddingLeft'));
    rwidth.style.width = rowWidth - pickListPadding - labelWith - labelPadding * 2 - 30 + "px";
}

/**
 * @desc 自动生成工单号
 */
function generateWorkOrder() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/common/generateWorkOrder?token=" + token + "&type=T",
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                $("#workOrder").val(res.workOrder);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}
/**
 * @desc 获取管线树
 */
function getPipelineTree() {
    var url = handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token); //对url进行权限处理
    $('#treeview').jstree({
            core: {
                multiple: false,
                animation: 0,
                check_callback: true,
                themes: {
                    dots: false
                },
                //强制将节点文本转换为纯文本，默认为false
                force_text: true,
                data: function (obj, cb) {
                    var dataItem;

                    $.ajax({
                            url: url,
                            method: "get",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            async: false
                        })
                        .done(function (res) {
                            if (res.success == 1) {
                                dataItem = res.treeList;
                            } else {
                                parent.layer.alert(res.msg, {
                                    title: getLanguageValue("tip_title"),
                                    skin: 'self-alert'
                                });
                            }
                        })
                        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                            parent.layer.alert(NET_ERROR_MSG, {
                                title: getLanguageValue("tip_title"),
                                skin: 'self-alert'
                            });
                        })
                    cb.call(this, dataItem);
                }
            },
            sort: function (a, b) {
                return this.get_node(a).original.orderNumber - 0 > this.get_node(b).original.orderNumber - 0 ? 1 : -1;
            },
            types: {
                "pipeline-folder": {
                    icon: 'folder-icon'
                },
                "pipeline": {
                    icon: 'pipeline-icon',
                    valid_children: []
                }
            },
            plugins: ["types", "sort"]
        })
        .on('loaded.jstree', function (e, data) {
            var inst = data.instance;
            //默认展开全部节点 
            inst.open_all();
        })
        .on('select_node.jstree', function (e, data) {
            if (data.node.type == "pipeline") {
                currentSelectPipelineId = data.node.id;
                queryMarkList(data.node.id);
            }
        });

}

/**
 * @desc 根据管线id查询其所包含的测试桩
 * @param {*String} pipelineId
 */
function queryMarkList(pipelineId) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryMarkList?flag=add&pipelineId=" + pipelineId + '&token=' + token,
        dataType: "json",
        type: "get",
        async: false,
        success: function (res) {
            if (res.success == 1) {
                var data = res.markList; //获取管线下所有的测试桩数组
                var resultData = pick.getValues(); //获取已选中的测试桩数组
                var result = changeArray(data, resultData); //去除已选中的测试桩
                $('#num').html(result.length + " 个");

                for (var i = 0; i < result.length; i++) {
                    if (detectMethod == 4) {
                        if (result[i]["isDrivepipe"] == 1) {
                            result[i]["text"] = result[i]["text"] + "   套管";
                        }
                    }
                    if (detectMethod == 5) {
                        if (result[i]["isCrossParallelArea"] == 1) {
                            result[i]["text"] = result[i]["text"] + "   交叉平行";
                        }
                    }
                    if (detectMethod == 8) {
                        if (result[i]["isInsulatedJoint"] == 1) {
                            result[i]["text"] = result[i]["text"] + "   绝缘接头桩";
                        }
                    }
                    if (detectMethod == 9) {
                        if (result[i]["isRecitifierNearest"] == 1) {
                            result[i]["text"] = result[i]["text"] + "   套管";
                        }
                    }
                    if (detectMethod == 10) {
                        if (result[i]["isDrainageAnode"] == 1) {
                            result[i]["text"] = result[i]["text"] + "   排流桩";
                        }
                    }
                }
                pick.setData(result);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 新增保存数据
 * @returns {*boolean} result 
 */
function saveData() {
    var result = false;
    var workOrder = $("#workOrder").val()
    var taskName = $("#taskName").val(); //获取任务名称
    var detectUserId = $("#detectUserName option:selected").val(); //获取检测人员ID
    var detectUserName = $.trim($("#detectUserName option:selected").text()); //获取检测人员的text值
    var startTimePlan = $("#startTimePlan").val(); //获取计划开始时间
    var endTimePlan = $("#endTimePlan").val(); //获取计划结束时间
    var remark = $("#remark").val(); //获取备注
    var markerArr = pick.getValues(); //获取已选取的测试桩
    var markerId = [];
    for (var i = 0; i < markerArr.length; i++) {
        markerId.push(markerArr[i].id);
    }
    var parameter = {
        "detectMethod": detectMethod,
        "workOrder": workOrder,
        "taskName": taskName,
        "detectUserId": detectUserId,
        "detectUserName": detectUserName,
        "startTimePlan": startTimePlan,
        "endTimePlan": endTimePlan,
        "markerId": markerId,
        "remark": remark
    };
    var check = $('#addTaskFrom').data('bootstrapValidator');
    check.validate();

    if (check.isValid()) {
        $.ajax({
            url: "/cloudlink-corrosionengineer/task/addTask?token=" + token,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "post",
            async: false,
            data: JSON.stringify(parameter),
            success: function (res) {
                if (res.success == 1) {
                    //诸葛IO
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新增任务', {
                                '任务类型': 'M' + detectMethod,
                                "结果": "成功"
                            });
                        }
                    } catch (err) {

                    }

                    parent.layer.msg(getLanguageValue("saveSuccess"), {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });

                    result = true;
                } else {
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新增任务', {
                                '任务类型': 'M' + detectMethod,
                                "结果": "失败"
                            });
                        }
                    } catch (err) {

                    }
                    parent.layer.alert(res.msg, {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                    result = false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                parent.layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
                result = false;
            }
        });
        return result;
    } else {
        return false
    }

}

/**
 * @desc 修改任务
 * @returns {*boolean} result 
 */
function update() {
    var result = false;
    var taskName = $("#taskName").val(); //获取任务名称
    var detectUserId = $("#detectUserName option:selected").val(); //获取检测人员ID
    var detectUserName = $.trim($("#detectUserName option:selected").text()); //获取检测人员的text值
    var startTimePlan = $("#startTimePlan").val(); //获取计划开始时间
    var endTimePlan = $("#endTimePlan").val(); //获取计划结束时间
    var remark = $("#remark").val(); //获取备注
    var markerArr = pick.getValues(); //获取已选取的测试桩
    var workOrder=$("#workOrder").val();
    var markerId = [];
    for (var i = 0; i < markerArr.length; i++) {
        markerId.push(markerArr[i].id);
    }
    var parameter = {
        "objectId": objectId,
        "taskName": taskName,
        "workOrder":workOrder,
        "detectUserId": detectUserId,
        "detectUserName": detectUserName,
        "startTimePlan": startTimePlan,
        "endTimePlan": endTimePlan,
        "markerId": markerId,
        "remark": remark
    };
    var check = $('#addTaskFrom').data('bootstrapValidator');
    check.validate();

    if (check.isValid()) {
        $.ajax({
            url: "/cloudlink-corrosionengineer/task/updateTask?token=" + token,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "post",
            data: JSON.stringify(parameter),
            async: false,
            success: function (res) {
                if (res.success == 1) {
                    //诸葛IO
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('修改任务', {
                                '任务类型': 'M' + detectMethod,
                                "结果": "成功"
                            });
                        }
                    } catch (err) {

                    }
                    // setTaskStatus();
                    parent.layer.msg(getLanguageValue("updataSuccess"), {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                    result = true;
                } else {
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('修改任务', {
                                '任务类型': 'M' + detectMethod,
                                "结果": "失败"
                            });
                        }
                    } catch (err) {

                    }
                    parent.layer.alert(res.msg, {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                    result = false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                parent.layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
                result = false;
            }
        });
        return result;
    } else {
        return false
    }
}

/**
 * @desc 修改任务状态
 */
function setTaskStatus() {
    if (taskStatus == 1) {
        return;
    }
    var parameter = {
        "taskStatus": 2,
        "taskId": objectId
    }
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/setTaskStatus?token=" + token,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "post",
        data: JSON.stringify(parameter),
        async: false,
        success: function (res) {
            if (res.success == 1) {}
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 根据objectId获取任务信息
 * @param {*String} objectId
 */
function queryTaskById(objectId) {
    var parameter = {
        "objectId": objectId,
        "token": token
    };
    var url = handleURL("/cloudlink-corrosionengineer/task/queryTask"); //对url进行权限处理
    $.ajax({
        type: "get",
        url: url,
        contentType: "application/json; charset=utf-8",
        data: parameter,
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                var data = res.taskBoList;
                $("#taskName").val(data[0].taskName);
                $("#workOrder").val(data[0].workOrder);
                $("#detectUserName").selectpicker("val", data[0].detectUserId);
                var detectUserName = $("#detectUserName").val();
                if (isNull(detectUserName)) {
                    $("#userName").val("");
                } else {
                    for (var i = 0; i < selectData.length; i++) {
                        if (detectUserName == selectData[i].objectId) {
                            $("#userName").val(selectData[i].account);
                        }
                    }
                }
                $("#startTimePlan").val(data[0].startTimePlan);
                $("#endTimePlan").val(data[0].endTimePlan);
                $("#remark").val(data[0].remark);
                selectData = data[0].markerId;
                for (var i = 0; i < selectData.length; i++) {
                    if (detectMethod == 4) {
                        if (selectData[i]["isDrivepipe"] == 1) {
                            selectData[i]["text"] = selectData[i]["text"] + "   套管";
                        }
                    }
                    if (detectMethod == 5) {
                        if (selectData[i]["isCrossParallelArea"] == 1) {
                            selectData[i]["text"] = selectData[i]["text"] + "   交叉平行";
                        }
                    }
                    if (detectMethod == 8) {
                        if (selectData[i]["isInsulatedJoint"] == 1) {
                            selectData[i]["text"] = selectData[i]["text"] + "   绝缘接头桩";
                        }
                    }
                    if (detectMethod == 9) {
                        if (selectData[i]["isRecitifierNearest"] == 1) {
                            selectData[i]["text"] = selectData[i]["text"] + "   套管";
                        }
                    }
                    if (detectMethod == 10) {
                        if (selectData[i]["isDrainageAnode"] == 1) {
                            selectData[i]["text"] = selectData[i]["text"] + "   排流桩";
                        }
                    }
                }
                pick.setResultData(data[0].markerId);
                $('#num1').html(data[0].markerId.length + " 个");
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 去除管线下已选取的测试桩集合
 * @param {*Array} arr1 arr2
 * @returns {*Array} arr1
 */
function changeArray(arr1, arr2) {
    var temp = []; //临时数组1 
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i].id == arr2[j].id) {
                arr1.splice(i, 1);
                i--;
                break;
            } else {}
        }
    }
    return arr1;
}

/**
 * @desc 加载历史记录下拉框
 */
function loadHistoricalRecord(comboxid) {
    $.ajax({
        url: '/cloudlink-corrosionengineer/marker/historyTaskCheck?method=' + detectMethod + '&token=' + lsObj.getLocalStorage("token"),
        dataType: "json",
        method: 'get',
        success: function (res) {
            if (res.success == 1) {
                var data = res.dataList;
                options = "<option value='" + getLanguageValue("select") + "'>" + getLanguageValue("importfromCompletedTasks") + "</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#" + comboxid).html(options);
                $("#" + comboxid).selectpicker('refresh');
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(SELECT_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 选中下拉框触发测试桩选中事件
 */
function fromHistoryTask() {
    var taskID = $("#historicalRecord").val();
    $.ajax({
        url: '/cloudlink-corrosionengineer/marker/fromHistoryTask?taskId=' + taskID + '&token=' + lsObj.getLocalStorage("token"),
        dataType: "json",
        type: "get",
        async: false,
        success: function (res) {
            if (res.success == 1) {
                pick.setResultData(res.markerList)
                $('#num1').html(res.markerList.length + "个")
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 从检测区导入
 */
function importTestArea() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/marker/fromDetectionArea?method=' + detectMethod + '&token=' + lsObj.getLocalStorage("token"),
        dataType: "json",
        type: "get",
        success: function (res) {
            if (res.success == 1) {
                pick.setResultData(res.markerList);
                if(langulage == "en"){
                    $('#num1').html(res.markerList.length)
                }else{
                    $('#num1').html(res.markerList.length + "个")
                }
                
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 表单校验
 */
$('#addTaskFrom').bootstrapValidator({
    fields: {
        taskName: {
            validators: {
                notEmpty: {}
            }
        },
        detectUserName: {
            validators: {
                notEmpty: {}
            }
        },
        startTimePlan: {
            validators: {
                notEmpty: {}
            }
        },
        endTimePlan: {
            validators: {
                notEmpty: {}
            }
        },
        pickListResult: {
            validators: {
                callback: {
                    callback: function (value, validator) {
                        var pickListResult = $("#pickListResult option");
                        var result = false;
                        if (pickListResult.length > 0) {
                            result = true;
                        }
                        return result
                    }
                }
            }
        },
        remark: {
            validators: {
                stringLength: {
                    max: 500
                },
            }
        }
    }
});
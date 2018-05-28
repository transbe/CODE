/**
 * @file
 * @author: gaohui
 * @desc:测试桩管理主页面右侧列表操作逻辑
 * @date: 2017-03-02
 * @last modified by: lujingrui
 * @last modified time: 2017-06-12 10:29:22
 */
var numberPage; //定义一个全局的页码值
var currentPageSize; //定义一个全局的页面大小
var token = "";
var enterpriseId = ""; //企业id

$(function () {
    changePageStyle("../../.."); // 换肤
    // firstLogin(); // 判断是否是第一次登陆，第一次展示向导

    token = lsObj.getLocalStorage('token');
    var user = JSON.parse(lsObj.getLocalStorage("userBo"));
        enterpriseId = user.enterpriseId;

    //加载table
    loadTable();
    //设置table高度
    setTableHeight('markerTable');

    //回车查询
    $("#markerFrom").on("keydown",function(e){
        if (e.keyCode == "13") { //keyCode=13是回车键
            query();  
            return false;//阻止表单提交
        }
    });

});


/**
 * @desc 执行查询
 */
function query() {
    $("#markerTable").bootstrapTable("refreshOptions", {
        "pageNumber": 1,
        "sortName": "",
        "sortOrder": ""
    })
}


/**
 * @desc 初始化加载table
 */
function loadTable() {
    $('#markerTable').bootstrapTable({
        url: handleURL('/cloudlink-corrosionengineer/marker/queryMarkerForPage?token=' + lsObj.getLocalStorage('token')),
        method: 'get',
        toolbar: '#toolbar',
        queryParams: queryParams, // 分页参数
        responseHandler: responseHandler,
        columns: [
               {
                    checkbox: 'true',
                }, {

                    title: getLanguageValue("No"),
                    formatter: function (value, row, index) {
                        return currentPageSize * (numberPage - 1) + index + 1;
                    }
                },
                {
                    sortable: true,
                    field: 'markerNumber',
                    title: getLanguageValue("参考测试桩"),
                    width: "10%"
                },
                {
                    field: 'pipelineName',
                    sortable: true,
                    title: getLanguageValue("距离"),
                    width: "9%"
                },
                {
                    sortable: true,
                    field: 'mileage',
                    title: getLanguageValue("深埋"),
                    width: "9%"
                },
                {
                    title: getLanguageValue("dB值"),
                     width: "9%"
                },
                {
                    title: getLanguageValue("腐蚀活性"),
                     width: "9%"
                },
                {
                    field: 'position',
                    title:  getLanguageValue("通电电位"),
                    width: "9%"
                },
                {
                    field: 'position',
                    title:  getLanguageValue("断电电位"),
                    width: "9%"
                },
                 {
                    field: 'position',
                    title:  getLanguageValue("IR"),
                    width: "9%"
                },
                 {
                    field: 'position',
                    title:  getLanguageValue("破损电等级"),
                    width: "9%"
                },
                {
                    field: 'position',
                    title:  getLanguageValue("是否修复"),
                    width: "9%"
                },
                {
                    field: 'position',
                    title:  getLanguageValue("位置描述"),
                    width: "9%"
                },
                {
                    field: 'position',
                    title:  getLanguageValue("检测年度"),
                    width: "9%"
                },
                {
                    field: 'Operation',
                    title: getLanguageValue("Operation"),
                    width: "9%",
                    class:"td-nowrap",
                    formatter: function (value, row, index) {
                        var res = "<a href='#'><i class='glyphicon glyphicon-eye-open'  title='"+getLanguageValue("option.view")+"' onclick=\"viewCoatingDefect('" + row.objectId + "')\"></i></a>";
                        if (!judgePrivilege()) {
                            res += "<a href='#'><i class='glyphicon glyphicon-edit' title='"+getLanguageValue("option.update")+"' onclick=\"updateOneMarker('" + row.objectId + "','" + row.pipelineId + "')\"></i></a>";
                        }
                        return res;
                    }
                }
        ],
        onDblClickRow: function (row) {
            viewCoatingDefect(row.objectId);
        }
    });
}


/**
 * @desc 后台返回数据处理
 * @param {json} res 后台返回数据列表
 */
function responseHandler(res) {
    if (res.success == 1) {
        try {
            if (tjSwitch == 1) {
                tjSdk.track('防腐层缺陷', {
                    '结果': '成功'
                });
            }
        } catch (err) {
            //在此处理错误
        }
        return res;
    } else {
        try {
            if (tjSwitch == 1) {
                tjSdk.track('防腐层缺陷', {
                    '结果': '失败'
                });
            }
        } catch (err) {
            //在此处理错误
        }
        layer.alert('加载数据出错', {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
    }
}


/**
 * @desc 设置传入参数
 * @param {json} params 向后台传递参数
 */
function queryParams(params) {
    currentPageSize = params.limit;
    numberPage = this.pageNumber;
    temp = {
        sortName: this.sortName, //排序字段
        sortOrder: this.sortOrder, //排序方式
        pageSize: params.limit, //页面大小
        pageNum: this.pageNumber, //当前页码
        pipelineId: pipelineId, //管线id  
    }
    return temp;
}

/**
 * @desc 重新刷新页面的方法
 */
function reloadPage() {
    $("#markerTable").bootstrapTable('refresh', true)
}


/**
 * @desc 测试桩导入
 */
function importCoatingDefect() {
    $("#importCoatingDefect").attr('disabled', true);
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("import_tip_head"),
        area: ['500px', '450px'],
        btn: [getLanguageValue("btn_upload"), getLanguageValue("btn_close")], //按钮
        skin: 'self-iframe',
        yes: function (index, layero) {
            var savePage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = savePage.importData();
                if (result == true) {
                    parent.$('.layui-layer-btn0').css('display', 'none');
                    parent.$('.layui-layer-btn1').html(getLanguageValue("btn_close"));
                    reloadPage();
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#importCoatingDefect").attr('disabled', false);
        },
        content: rootPath + "/src/html/cps_system/coating_defect/import_coating_defect.html?pipeLineId=" + pipelineId
    });
}


/**
 * @desc 测试桩新增
 */
function addCoatingDefect() {
    $("#addCoatingDefect").attr('disabled', true);
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("addTest_Head"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancle")], //按钮
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            var addPage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = addPage.saveData();
                if (result == true) { //保存成功
                    parent.layer.close(index);
                    reloadPage();
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#addCoatingDefect").attr('disabled', false);
        },
        content: rootPath + "/src/html/cps_system/coating_defect/add_coating_defect.html?pipelineId=" + pipelineId
    });
}


/**
 * @desc 测试桩修改
 */
function updateCoatingDefect(objectId, pipeLineID) {
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("update_marker_title"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancle")], //按钮
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            var save = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = save.saveUpdateData();
                if (result == true) { //修改成功
                    parent.layer.close(index);
                    reloadPage();
                } else {
                    preventDblClick = false;
                }
            }

        },
        btn2: function (index, layero) {},
        content: rootPath + "/src/html/cps_system/coating_defect/update_coating_defect.html?objectId=" + objectId + '&pipelineId=' + pipeLineID
    });
}


/**
 * @desc 调整测试桩顺序
 */
function sortCoatingDefect() {
   
    $("#sortCoatingDefect").attr('disabled', true);
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("sort_marker_Head"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancle")], //按钮
        skin: 'self-iframe',
        yes: function (index, layero) {
            var sortPage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = sortPage.saveSortMarker();
                if (result == true) {
                    parent.layer.close(index);
                    reloadPage();
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#sortCoatingDefect").attr('disabled', false);
        },
        content: rootPath + "/src/html/cps_system/coating_defect/sort_coating_defect.html?pipelineId=" + pipelineId
    });
}



function nextPage(){
    $('#table').bootstrapTable('method', parameter);
}


/**
 * @desc 测试桩查看
 * @param {string} objectId 测试桩id
 */
function viewCoatingDefect(objectId) {
    /*****************************处理上一个下一个桩快捷查看（开始）lixiaolong**************************/ 
    // var dataArr =  $('#markerTable').bootstrapTable('getData');
    // var objectIds = "";
    // for(var i = 0;i < dataArr.length;i++){
    //     if(dataArr[i].objectId!=""&&dataArr[i].objectId!=null){
    //         if(i==dataArr.length-1){
    //             objectIds = objectIds + dataArr[i].objectId;
    //         }else{
    //             objectIds = objectIds + dataArr[i].objectId + ",";
    //         }
    //     }
    // }
    // lsObj.setLocalStorage("markerObjectIds",objectIds);
    /*****************************处理上一个下一个桩快捷查看（结束）********************************/ 
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("view_Marker"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("btn_close")],
        skin: 'self-iframe',
        no: function (index, layero) {
            var viewPage = layero.find('iframe')[0].contentWindow;
            viewPage.viewData();
        },
        btn2: function (index, layero) {},
        content: rootPath + "/src/html/cps_system/coating_defect/view_coating_defect.html"
    })
}

/**
 * @desc 删除选中行数据
 */
function deleteCoatingDefect() {
    
    var rows = $('#markerTable').bootstrapTable('getSelections');
    if (rows.length == 0) {
        layer.alert(getLanguageValue("please_SelectOne"),{
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    var objectId = "";
    for (var i = 0; i < rows.length; i++) {
        if (i != rows.length - 1) {
            objectId += rows[i].objectId + ","
        } else {
            objectId += rows[i].objectId
        }
    }
    $.ajax({
        url: "/cloudlink-corrosionengineer/marker/queryDataForDelete?token=" + lsObj.getLocalStorage('token'),
        method: 'get',
        dataType: 'json',
        data: {
            "objectIds": objectId
        },
        success: function (result) {
            if (result.success == 1 && result.hasData == "true") { //所选测试桩在任务中存在
                layer.alert(getValueHasArgs("delete_tip",[result.data]), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert',
                });
            } else if (result.success == 1 && result.hasData == "false") { //所选测试桩不在任务中存在
                layer.confirm(getLanguageValue("comfim_delete"), {
                    title: getLanguageValue("tip"),
                    skin: 'self'
                }, function () {
                    $.ajax({
                        method: "POST",
                        dataType: "json",
                        url: "/cloudlink-corrosionengineer/marker/deleteMarker?token=" + lsObj.getLocalStorage('token'),
                        contentType: "application/json; charset=utf-8",
                        data:JSON.stringify({
                            "objectIds": objectId
                        }), //删除当前id的plan,
                        //记得做未成功清空/提示
                        success: function (result) {
                            if (result.success == 1) {
                                layer.msg(getLanguageValue("delete_success"), {
                                    time: MSG_DISPLAY_TIME,
                                    skin: "self-msg"
                                });
                                var rows = $('#markerTable').bootstrapTable('getData', true);
                                var rows1 = $('#markerTable').bootstrapTable('getSelections');
                                if (numberPage != 1 && rows.length == rows1.length) {
                                    $('#markerTable').bootstrapTable('prevPage');
                                } else {
                                    reloadPage()
                                }
                                try {
                                    if (tjSwitch == 1) {
                                        tjSdk.track('删除测试桩', {
                                            '结果': '成功'
                                        });
                                    }
                                } catch (err) {
                                    //在此处理错误
                                }

                            } else {
                                layer.alert(result.msg, {
                                    title: getLanguageValue("tip"),
                                    skin: 'self-alert'
                                });
                                reloadPage();
                                try {
                                    if (tjSwitch == 1) {
                                        tjSdk.track('删除测试桩', {
                                            '结果': '失败'
                                        });
                                    }
                                } catch (err) {
                                    //在此处理错误
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                            layer.alert(NET_ERROR_MSG, {
                                title: getLanguageValue("tip"),
                                skin: 'self-alert'
                            });
                        }
                    });
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 清空查询条件
 */
function resetForm() {
    if (!isSavedBatchModify()) {
        return;
    };
    document.getElementById("markerFrom").reset();
    // $("input[name='markerType']").val(0);
    $(".marker-checkbox .btn").removeClass("focus");
    $(".marker-checkbox").find(".btn:first-child").addClass("focus");
    $(".marker-checkbox .btn").find(".triangle-div").removeClass("triangle");
    $(".marker-checkbox .btn").val(0);
    $("#markerTable").bootstrapTable("refreshOptions", {
        "pageNumber": 1,
        "sortName": "",
        "sortOrder": ""
    })
}


/**
 * @desc 导出选中数据
 */
function exportSelect() {
    if (!isSavedBatchModify()) {
        return;
    };
    // 找到所有被选中行
    var rows = $('#markerTable').bootstrapTable('getSelections');
    if (enterpriseId == "" || enterpriseId == null) {
        layer.alert(getLanguageValue("loginAgain"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    if (rows.length == 0) {
        layer.alert(getLanguageValue("tip_selectTip"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    var objectids = "";
    for (var i = 0; i < rows.length; i++) {
        if (i != rows.length - 1) {
            objectids += rows[i].objectId + ","
        } else {
            objectids += rows[i].objectId
        }
    }

    var markerNumber = $('#markerNumber').val(),
        isDrivepipe = $('#isDrivepipe').val(),
        isInsulatedJoint = $('#isInsulatedJoint').val(),
        isDrainageAnode = $('#isDrainageAnode').val(),
        isDirectionalDrilling = $('#isDirectionalDrilling').val(),
        isRecitifierNearest = $('#isRecitifierNearest').val();

        isHighVoltageCorridor = $('#isHighVoltageCorridor').val(),
        isSubwayParallel = $('#isSubwayParallel').val(),
        isCrossParallelArea = $('#isCrossParallelArea').val(),
        isHighConsequenceArea = $('#isHighConsequenceArea').val(),

    //导出文件访问的url
    url = '/cloudlink-corrosionengineer/marker/exportMarkerExcel?pipelineId=' + pipelineId + 
        '&markerNumber=' + markerNumber + 
        '&isDrivepipe=' + isDrivepipe + 
        '&isInsulatedJoint=' + isInsulatedJoint + 
        '&isDrainageAnode=' + isDrainageAnode +
        '&isDirectionalDrilling=' + isDirectionalDrilling + 
        '&isRecitifierNearest=' + isRecitifierNearest +
        '&isHighVoltageCorridor=' + isHighVoltageCorridor +
        '&isSubwayParallel=' + isSubwayParallel +
        '&isHighConsequenceArea=' + isHighConsequenceArea +
        '&isCrossParallelArea=' + isCrossParallelArea + 
        '&objectIds=' + objectids +
        '&token=' + lsObj.getLocalStorage('token');
    $("#exportExcelIframe").attr("src", url); //下载导出文件
    uncheck("exportSelect");

    try {
        if (tjSwitch == 1) {
            tjSdk.track('导出选中测试桩');
        }
    } catch (err) {
        //在此处理错误
    }
}


/**
 * @desc 导出全部数据
 */
function exportAll() {
    if (!isSavedBatchModify()) {
        return;
    };
    //验证token是否失效
    if (enterpriseId == "" || enterpriseId == null) {
        layer.alert(getLanguageValue("loginAgain"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }

    var markerNumber = $('#markerNumber').val(),
        isDrivepipe = $('#isDrivepipe').val(),
        isInsulatedJoint = $('#isInsulatedJoint').val(),
        isDrainageAnode = $('#isDrainageAnode').val(),
        isDirectionalDrilling = $('#isDirectionalDrilling').val(),
        isRecitifierNearest = $('#isRecitifierNearest').val(),

        isHighVoltageCorridor = $('#isHighVoltageCorridor').val(),
        isSubwayParallel = $('#isSubwayParallel').val(),
        isCrossParallelArea = $('#isCrossParallelArea').val(),
        isHighConsequenceArea = $('#isHighConsequenceArea').val(),

        isCommon = $("#isCommon").val();
    var objectids = "";

    url = '/cloudlink-corrosionengineer/marker/exportMarkerExcel?pipelineId=' + pipelineId + 
        '&markerNumber=' + markerNumber + 
        '&isDrivepipe=' + isDrivepipe + 
        '&isInsulatedJoint=' + isInsulatedJoint + 
        '&isDrainageAnode=' + isDrainageAnode +
        '&isDirectionalDrilling=' + isDirectionalDrilling +
        '&isRecitifierNearest=' + isRecitifierNearest +
        '&isHighVoltageCorridor=' + isHighVoltageCorridor +
        '&isSubwayParallel=' + isSubwayParallel +
        '&isCrossParallelArea=' + isCrossParallelArea +
        '&isHighConsequenceArea=' + isHighConsequenceArea + 
        '&objectIds=' + objectids +
        '&token=' + lsObj.getLocalStorage('token') + 
        '&isCommon=' + isCommon+
        '&language='+ lsObj.getLocalStorage('i18nLanguage');
    $("#exportExcelIframe").attr("src", url);
    uncheck("exportAll");

    try {
        if (tjSwitch == 1) {
            tjSdk.track('导出全部测试桩');
        }
    } catch (err) {
        //在此处理错误
    }
}
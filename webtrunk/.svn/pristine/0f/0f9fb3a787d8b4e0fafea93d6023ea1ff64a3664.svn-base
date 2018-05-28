/**
 * @file
 * @author: gaohui
 * @desc 网格化数据
 * @date: 2017-03-13
 * @last modified by: zhangyi
 * @last modified time: 2017-06-12 16:42:41
 */
var reportType = getParameter("reportType"); //报告区分字段：1有效性报告，2完整性报告
var token = lsObj.getLocalStorage("token"); //token
var currentPageNum = 1; // 当前页码
var currentPageSize = ""; //当前展示条数
// 定义申请状态
var items = {
    "applyStatus": ""
}

$(function() {
    changePageStyle("../../../../src");
    var pipeName = "";
    if (reportType == 1) {
        pipeName = getLanguageValue("Pipeline_Name");
        $("#changeName").html(getLanguageValue("Pipeline_Name"));
    } else {
        pipeName = getLanguageValue("CPS_Schematic");
        $("#changeName").html(getLanguageValue("CPS_Schematic"));
    }
    loadSelect('pipeName');
    loadTable(pipeName);
    setTableHeight('applictionTable');
    //    时间插件
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4
    }).on('changeDate', function(e) {
        $("#applictionTable").bootstrapTable('refresh', {
            pageNumber: 1
        });
    });

    $("select").change(function() {
        $("#applictionTable").bootstrapTable('refresh', {
            pageNumber: 1
        })
    });

    //点击申请状态
    $('#applyStatus .item').click(function() {
        var $parent = $('#applyStatus');
        $parent.find(".item").removeClass('focus');
        $(this).addClass('focus');
        items.applyStatus = $(this).attr("data-value");
        $('#applictionTable').bootstrapTable('refresh', {
            pageNumber: 1
        });
    });

    // 查询，重新加载table
    $("#queryBtn").click(function() {
        uncheck('queryBtn');
        $('#applictionTable').bootstrapTable('refresh', {
            pageNumber: 1
        });
    });

    // 重置，重新加载table
    $("#resetBtn").click(function() {
        uncheck('resetBtn');
        // 审核状态 样式重置
        $('#applyStatus').find(".item").removeClass('focus');
        $($('#applyStatus .item')[0]).addClass('focus')
            // 审核状态 传值重置
        items.applyStatus = "";
        document.getElementById('searchForm').reset();
        $('.selectpicker').selectpicker('val', null);
        $('#applictionTable').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: '',
            sortOrder: ''
        });
    });

    $("#searchForm").keydown(function(e) {
        if (e.keyCode == "13") {
            $('#applictionTable').bootstrapTable('refresh', {
                pageNumber: 1
            });
        }
    });

});

/**
 * @desc 网格化数据
 * @param {string} pipeName 表格列名称
 */
function loadTable(pipeName) {
    $('#applictionTable').bootstrapTable({
            url: handleURL('/cloudlink-corrosionengineer/report/queryApplyForPage?token=' + token + '&reportType=' + reportType + "&roleType=0"),
            toolbar: '#toolbar',
            queryParams: queryParams, // 分页参数
            responseHandler: responseHandler,
            columns: [{
                checkbox: 'true'
            }, {
                title: getLanguageValue("No."),
                formatter: function(value, row, index) {
                    return (currentPageNum - 1) * currentPageSize + index + 1;
                }
            }, {
                field: 'reportName',
                title: getLanguageValue("Report_Name"),
                sortable: true,
                width: '25%'
            }, {
                field: 'pipeName',
                title: pipeName,
                width: '25%'
            }, {
                field: 'applyStatus',
                title: getLanguageValue("State_of_Apllication"),
                width: '10%',
                sortable: true,
                formatter: function(value, row) {
                    return convertApplyStatus(value);
                }
            }, {
                field: 'expertName',
                title: getLanguageValue("Speacilist_Name"),
                sortable: true,
                width: '10%',
            }, {
                field: 'applyUserName',
                title: getLanguageValue("Applicant"),
                width: '10%'
            }, {
                field: 'applyTime',
                title: getLanguageValue("Application_Start"),
                sortable: true,
                width: '10%',
                class: 'td-nowrap',
                formatter: function(value, row, index) {
                    return (row.applyTime).split(' ')[0];
                }
            }, {
                title: getLanguageValue("Action"),
                width: '10%',
                class: "td-nowrap",
                formatter: function(value, row, index) {
                    var f = "";
                    var d = "";
                    var e = "<a href='#'><i class='glyphicon glyphicon-eye-open' title='" + getLanguageValue("view") + "' onclick=\"viewApplication('" + row.objectId + "')\"></i></a>";
                    if (row.applyStatus == 1) {
                        d = '<a href="#"><i class="glyphicon glyphicon-edit" title="' + getLanguageValue("EDIT") + '" onclick="editReport(\'' + row.objectId + '\',\'' + row.applyStatus + '\')"></i></a>';
                    } else {
                        d = '<a href="#"><i class="glyphicon glyphicon-edit" title="' + getLanguageValue("EDIT") + '" style="visibility:hidden"></i></a>';
                    }
                    if (row.applyStatus == 3 || row.applyStatus == 4 || row.applyStatus == 5) {
                        f = '<a href="#"><i class="fa fa-file-pdf-o" title="' + getLanguageValue("View_Report") + '" onclick="viewReport(\'' + row.objectId + '\',\'' + row.applyStatus + '\',\'' + row.reportName + '\',\'' + row.fileId + '\')"></i></a>';
                    } else {
                        f = '<a href="#"><i class="fa fa-file-pdf-o" title="' + getLanguageValue("View_Report") + '" style="visibility:hidden"></i></a>';
                    }
                    var result = judgePrivilege();
                    if (result) {
                        return e + f;
                    }
                    return e + d + f;
                }
            }],
            onDblClickRow: function(row) {
                viewApplication(row.objectId);
            }
        })
        //设置返回给表格的数据
    function responseHandler(res) {
        if (res.success == 1) {
            return res;
        } else {
            layer.alert(getLanguageValue("Load_data_error"), {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
            return [];
        }
    }

    // 设置传入参数
    function queryParams(params) {
        currentPageSize = params.limit;
        currentPageNum = this.pageNumber;
        return tmp = {
            pageSize: params.pageSize, // 页面大小
            pageNum: this.pageNumber,
            sortOrder: this.sortOrder,
            sortName: this.sortName,
            applyStatus: items.applyStatus,
            year: $('#year').val(),
            pipeId: $('#pipeName option:selected').val(),
            reportName: $('#reportName').val()
        }
    }
}

/**
 * @desc 添加报告申请
 */
function addReport() {
    uncheck("addReport");
    var preventDblClick = false;
    var title = "";
    if (reportType == 1) {
        title = getLanguageValue("Apply_CP_Efficiency_Report");
    } else {
        title = getLanguageValue("Apply_CP_Integrity_Report");
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: title,
        skin: 'self-iframe',
        area: ['950px', '600px'],
        btn: [getLanguageValue("submit"), getLanguageValue("close")],
        yes: function(index, layero) {
            if (!preventDblClick == true) {
                preventDblClick = true;
                var windowObj = layero.find('iframe')[0].contentWindow;
                var result = windowObj.saveData();
                if (result == true) {
                    $('#applictionTable').bootstrapTable('refresh');
                    parent.layer.close(index);
                } else {
                    preventDblClick = false;
                }
            }
        },
        content: "src/html/expert_and_report/report/add_application.html?reportType=" + reportType
    });
}

/**
 * @desc 删除申请记录  
 * 		 1、关闭申请和验收通过条件下
 */
function deleteReport() {
    uncheck("deleteReport");
    var preventDblClick = false;
    var rows = $('#applictionTable').bootstrapTable('getSelections');
    var objectId = "";
    if (rows.length == 0) {
        layer.alert(getLanguageValue("select_one_rows"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    } else {
        var rowData = $('#applictionTable').bootstrapTable('getData', true);
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].applyStatus != 2 && rows[i].applyStatus != 5) {
                layer.alert(getLanguageValue("delete_data"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                return;
            }
            if (rowData.length == rows.length && currentPageNum != 1) {
                currentPageNum = currentPageNum - 1;
            }
            objectId += rows[i].objectId + 　",";
        }
    }
    layer.confirm(getLanguageValue("Determine_delete"), {
        title: getLanguageValue("tip"),
        skin: 'self'
    }, function() {
        if (!preventDblClick == true) {
            preventDblClick == true;
            $.ajax({
                url: '/cloudlink-corrosionengineer/report/deleteApply?token=' + token,
                type: 'post',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "objectId": objectId
                }),
                success: function(successResult) {
                    if (successResult.success == 1) {
                        layer.msg(getLanguageValue("deleted_successfully"), {
                            time: MSG_DISPLAY_TIME, // common.js中定义好的layer弹框消失的时间
                            skin: "self-msg"
                        });
                        $('#applictionTable').bootstrapTable('refresh', {
                            pageNumber: currentPageNum
                        });
                    } else {
                        layer.alert(successResult.msg, {
                            title: getLanguageValue("tip"),
                            skin: 'self-alert'
                        });
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    layer.alert(NET_ERROR_MSG, {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                }
            });
        }
    });
}

/**
 * @desc 加载管线/分段下拉框
 * @param {string} comboxid 下拉框id
 */
function loadSelect(comboxid) {
    var user = JSON.parse(lsObj.getLocalStorage('userBo'));
    if (reportType == 1) {
        $.ajax({
            url: '/cloudlink-corrosionengineer/common/getPipelineListForSelect',
            type: 'get',
            dataType: 'json',
            data: {
                "token": token,
                "enterpriseId": user.enterpriseId
            },
            success: function(successResult) {
                if (successResult.success == 1) {
                    var data = successResult.pipelineList;
                    var options = "<option value='' class='CP-i18n' key='Select'>" + getLanguageValue("Select") + "</option>";
                    for (var i = 0; i < data.length; i++) {
                        options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                    }
                    $("#" + comboxid).html(options);
                    $('#' + comboxid).selectpicker('refresh');
                } else {
                    layer.alert(getLanguageValue("Error_loading"), {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                layer.alert(SELECT_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        });
    } else {
        $.ajax({
            url: '/cloudlink-corrosionengineer/common/getCpsegmentListForSelect',
            type: 'get',
            dataType: 'json',
            data: {
                "token": token,
                "enterpriseId": user.enterpriseId
            },
            success: function(successResult) {
                if (successResult.success == 1) {
                    var data = successResult.cpsegmentList;
                    var options = "<option value='' class='CP-i18n' key='Select'>" + getLanguageValue("Select") + "</option>";
                    for (var i = 0; i < data.length; i++) {
                        options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                    }
                    $("#" + comboxid).html(options);
                    $('#' + comboxid).selectpicker('refresh');
                } else {
                    layer.alert(getLanguageValue("Error_load"), {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                layer.alert(SELECT_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        });
    }
}

/**
 * @desc 导出报告
 * 		 1、只能在【3提交报告/5验收通过】状态下
 */
function exportReport() {
    uncheck('exportReport');
    var rows = $('#applictionTable').bootstrapTable('getSelections');
    var fileId = "";
    if (rows.length < 1) {
        layer.alert(getLanguageValue("Can_be_downloaded"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].applyStatus != 3 && rows[i].applyStatus != 5) {
            layer.alert(getLanguageValue("Can_be"), {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
            return;
        }
        if (i == rows.length - 1) {
            fileId += rows[i].fileId;
        } else {
            fileId += rows[i].fileId + ",";
        }
    }
    // post请求获取文件
    var url = '/cloudlink-core-file/attachment/downLoadMultiFile?token='+ lsObj.getLocalStorage("token");
    var zipFileName = "";
    if (reportType == 1) {
        zipFileName = getLanguageValue("CP_Efficiency_Report");
    } else {
        zipFileName = getLanguageValue("CP_Integrity_Report");
    }
    var data = {
        'idList': fileId,
        'zipFileName': zipFileName
    };
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function(response, status, request) {
            var disp = request.getResponseHeader('Content-Disposition');
            if (disp && disp.search('attachment') != -1) {
                var form = $('<form method="POST" action="' + url + '">');
                $.each(data, function(k, v) {
                    form.append($('<input type="hidden" name="' + k + '" value="' + v + '">'));
                });
                $('#exportIframe').append(form);
                form.submit(); // 自动提交
            }
        }
    });
}

/**
 * @desc 修改报告申请
 * 		 1、完善数据下
 * @param {string} reportId 
 * @param {int} applyStatus 
 */
function editReport(reportId, applyStatus) {
    uncheck("editReport");
    var preventDblClick = false;
    var objectId = "";
    var rows = $('#applictionTable').bootstrapTable('getSelections');
    if (isNull(reportId) == false) {
        objectId = reportId;
    } else if (rows.length == 1) {
        objectId = rows[0].objectId;
        applyStatus = rows[0].applyStatus;
    } else {
        layer.alert(getLanguageValue("select_one_rows"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    if (applyStatus != 1) {
        layer.alert(getLanguageValue("Can_be_edited"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    var title = "";
    if (reportType == 1) {
        title = getLanguageValue("revise_CP_Efficiency_Application");
    } else {
        title = getLanguageValue("revise_CP_Integrity_Application");
    }
    // 设置按钮
    if (applyStatus == 1) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: title,
            skin: 'self-iframe',
            area: ['950px', '600px'],
            btn: [getLanguageValue("submit"), getLanguageValue("colse_apply"), getLanguageValue("close")],
            yes: function(index, layero) {
                if (!preventDblClick == true) {
                    preventDblClick = true;
                    var windowObj = layero.find('iframe')[0].contentWindow;
                    var result = windowObj.saveApplication();
                    if (result == true) {
                        parent.layer.close(index);
                        $('#applictionTable').bootstrapTable('refresh');
                    } else {
                        preventDblClick = false;
                    }
                }
            },
            btn2: function(index, layero) {
                var result = false;
                var windowObj = layero.find('iframe')[0].contentWindow;
                parent.layer.confirm(getLanguageValue("Confirm_close_application"), {
                    title: getLanguageValue("tip"),
                    skin: 'self'
                }, function(inner) {
                    if (!preventDblClick == true) {
                        preventDblClick = true;
                        parent.layer.close(inner);
                        result = windowObj.closeApplication();
                        if (result == true) {
                            $('#applictionTable').bootstrapTable('refresh');
                            parent.parent.layer.close(index);
                        } else {
                            preventDblClick = false;
                        }
                    }
                });
                return result;
            },
            content: "src/html/expert_and_report/report/update_application.html?reportType=" + reportType + '&objectId=' + objectId
        });
    } else {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: title,
            skin: 'self-iframe',
            area: ['950px', '600px'],
            btn: [getLanguageValue("close")],
            content: "src/html/expert_and_report/report/update_application.html?reportType=" + reportType + '&objectId=' + objectId
        });
    }
}

/**
 * @desc 查看申请
 * @param {string} reportId 
 */
function viewApplication(reportId) {
    uncheck("viewApplication");
    var _objectId = "";
    var rows = $("#applictionTable").bootstrapTable('getSelections');
    if (isNull(reportId) == false) {
        _objectId = reportId;
    } else if (rows.length != 1) {
        layer.alert(getLanguageValue("select_one_rows"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    } else {
        _objectId = rows[0].objectId;
    }
    var title = "";
    if (reportType == 1) {
        title = getLanguageValue("View_CP_Efficiency_Application");
    } else {
        title = getLanguageValue("View_CP_Integrity_Application");
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: title,
        skin: 'self-iframe',
        area: ['950px', "600px"],
        btn: [getLanguageValue("close")],
        content: 'src/html/expert_and_report/report/view_application.html?reportType=' + reportType + '&objectId=' + _objectId
    });
}

/**
 * @desc 查看报告
 * 		 1、只能在【3提交报告/4修订报告/5验收通过】状态下
 * 		 2、只有在【3提交报告】状态下才有【接收】【退回】按钮
 * @param {string} objectId 
 * @param {string} applyStatus 
 * @param {string} reportName 
 * @param {string} fileId 
 */
function viewReport(objectId, applyStatus, reportName, fileId) {
    uncheck("viewReport");
    var preventDblClick = false;
    var _objectId = "";
    var rows = $('#applictionTable').bootstrapTable('getSelections');
    if (isNull(objectId) == false) {
        _objectId = objectId;
    } else if (rows.length == 1) {
        _objectId = rows[0].objectId;
        applyStatus = rows[0].applyStatus;
        reportName = rows[0].reportName;
        fileId = rows[0].fileId;
    } else {
        layer.alert(getLanguageValue("select_one_rows"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    if (applyStatus != 3 && applyStatus != 4 && applyStatus != 5) {
        layer.alert(getLanguageValue("No_report_found"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    // 设置窗口标题
    var title = "";
    if (reportType == 1) {
        title = getLanguageValue("View_CP_Efficiency_Report");
    } else {
        title = getLanguageValue("View_CP_Integrity_Report");
    }
    // 设置窗口按钮
    if (applyStatus == 3) {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: title,
            skin: 'self-iframe',
            area: ['800px', '600px'],
            btn: [getLanguageValue("receive"), getLanguageValue("send_back"), getLanguageValue("close")],
            yes: function(index, layero) {
                if (!preventDblClick == true) {
                    preventDblClick = true;
                    var windowObj = layero.find('iframe')[0].contentWindow;
                    var result = windowObj.receiveReport();
                    if (result == true) {
                        parent.layer.close(index);
                        $('#applictionTable').bootstrapTable('refresh');
                    } else {
                        preventDblClick = false;
                    }
                }
            },
            btn2: function(index, layero) {
                var result = false;
                var windowObj = layero.find('iframe')[0].contentWindow;
                parent.layer.confirm(getLanguageValue("sure_send_back"), {
                    title: getLanguageValue("tip"),
                    skin: 'self'
                }, function(middle) {
                    parent.layer.close(middle);
                    parent.layer.open({
                        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                        title: getLanguageValue("send_it_back"),
                        skin: 'self-iframe',
                        area: ['800px', '500px'],
                        btn: [getLanguageValue("submit"), getLanguageValue("close")],
                        yes: function(inner, layero) {
                            if (!preventDblClick == true) {
                                preventDblClick = true;
                                var windowObj = layero.find('iframe')[0].contentWindow;
                                result = windowObj.returnReport();
                                if (result == true) {
                                    $('#applictionTable').bootstrapTable('refresh');
                                    parent.layer.close(inner);
                                    parent.parent.layer.close(index);
                                } else {
                                    preventDblClick = false;
                                }
                            }
                        },
                        content: "src/html/expert_and_report/report/return_report.html?objectId=" + _objectId + "&reportName=" + encodeURI(reportName) + "&fileId=" + fileId + "&reportType=" + reportType
                    });
                });
                return result;
            },
            content: ["src/html/expert_and_report/report/view_report.html?objectId=" + _objectId + "&fileId=" + fileId + "&layerWidth=800&layerHeight=600&reportType=" + reportType, 'no']
        });
    } else {
        var index = parent.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: title,
            skin: 'self-iframe',
            area: ['800px', '600px'],
            btn: [getLanguageValue("close")],
            content: ["src/html/expert_and_report/report/view_report.html?objectId=" + _objectId + "&fileId=" + fileId + "&layerWidth=800&layerHeight=600&reportType=" + reportType, 'no']
        });
    }
}
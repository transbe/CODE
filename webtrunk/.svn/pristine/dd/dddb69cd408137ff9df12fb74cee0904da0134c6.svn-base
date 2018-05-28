/**
 * @file
 * @author zhangyi
 * @desc 查询检测区域
 * @date 2017-03-13
 * @last modified by zhangyi
 * @last modified time 2017-06-12 09:24:43
 */
var token = lsObj.getLocalStorage('token');
var tmenpi = lsObj.getLocalStorage('tmenpi') + ""; //权限处理 
var currentPageNum = 1; // 获取当前页码
var currentPageSize = ""; // 获取当前条数
//初始化
$(function () {
    changePageStyle("../../../src");
    var objectId = "";
    loadTable();
    setTableHeight('areaTable');
});

/**
 * @desc 获取表格高度
 */
function getTableHeight() {
    var contentH;
    var winH = $(window).height();
    var bodyPaddingTop = parseInt($(".content-box").css("paddingTop"));
    var bodyPaddingBottom = parseInt($(".content-box").css("paddingBottom"));
    var contentPaddingTop = parseInt($(".content-body").css('paddingTop'));
    var contentPaddingBottom = parseInt($(".content-body").css('paddingBottom'));
    var toolbarH = $("#toolbar").outerHeight();
    var toolbarMarginTop = parseInt($("#toolbar").css('marginTop'));
    var toolbarMarginBottom = parseInt($("#toolbar").css('marginBottom'));
    contentH = winH - (bodyPaddingTop + bodyPaddingBottom) - (contentPaddingTop + contentPaddingBottom);
    return contentH;
}

/**
 * @desc 初始化表格
 */
function loadTable() {
    var ViewTitle = getLanguageValue('View');
    var EditTitle = getLanguageValue('Edit');
    $('#areaTable').bootstrapTable({
        url: handleURL('/cloudlink-corrosionengineer/detectionAreaDivision/queryPage?token=' + token),
        toolbar: '#toolbar',
        queryParams: function (params) {
            currentPageNum = this.pageNumber;
            currentPageSize = params.limit;
            params.sortName = this.sortName;
            params.sortOrder = this.sortOrder;
            params.pageSize = params.limit;
            params.pageNum = this.pageNumber;
            return params;
        },
        columns: [{
            checkbox: true
        }, {
            field: 'objectId',
            title: 'objectId',
            visible: false
        }, {
            // title: '序号',
            title: getLanguageValue('No'),
            formatter: function (value, rows, index) {
                return (currentPageNum - 1) * currentPageSize + index + 1;
            }
        }, {
            field: 'areaName',
            // title: '记录名称',
            title: getLanguageValue('recordName'),
            width: '15%',
            sortable: true
        }, {
            field: 'method1',
            // title: '常规检测',
            title: getLanguageValue('Common-Measuring'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method2',
            // title: '交流干扰',
            title: getLanguageValue('a.c-measurement'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method3',
            // title: '直流干扰',
            title: getLanguageValue('stray-current-measurement'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method4',
            // title: '套管检测',
            title: getLanguageValue('Cased-crossing'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method5',
            // title: '交叉平行',
            title: getLanguageValue('Parallel-crossing'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method6',
            // title: '阴保有效性',
            title: getLanguageValue('CP-Effectiveness-Measuring'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method7',
            // title: '专项检测',
            title: getLanguageValue('a.c/styray-current-Recording'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method8',
            // title: '绝缘检测',
            title: getLanguageValue('Insulation-joints'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method9',
            // title: '恒电位仪',
            title: getLanguageValue('Rectifier'),
            sortable: true,
            width: '5%'
        }, {
            field: 'method10',
            // title: '牺牲阳极',
            title: getLanguageValue('Galvanic-anodes'),
            sortable: true,
            width: '5%'
        }, {
            field: 'isOption',
            // title: '默认任务<br/>测试桩备选库',
            title: getLanguageValue('Default-for-Next-Task'),
            sortable: true,
            width: '5%',
            formatter: function (value, row, index) {
                if (value == 1) {
                    return getLanguageValue("field.option.yes");
                }
                return getLanguageValue("field.option.no")
            }
        }, {
            field: 'createTime',
            // title: '创建时间',
            title: getLanguageValue('Added-On'),
            sortable: true,
            width: '10%',
            class: 'td-nowrap',
            formatter: function (value, row, index) {
                var createTime = (row.createTime).split(' ');
                return createTime[0];
            }
        }, {
            field: 'createUser',
            // title: '创建人',
            title: getLanguageValue('Added-By'),
            width: '10%',
            class: 'td-nowrap'
        }, {
            // title: '操作',
            title: getLanguageValue('Action-Line'),
            width: '10%',
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#" title="'+ViewTitle+'" onclick="viewArea(\'' + row.objectId + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                var d = '<a href="#" mce_href="#" title="'+EditTitle+'" onclick="updateArea(\'' + row.objectId + '\')"><span class="glyphicon glyphicon-edit"></span></a> ';
                var judgeFlag = judgePrivilege();
                if (judgeFlag) {
                    return e;
                }
                return e + d;
            }
        }],
        onDblClickRow: function (row) {
            viewArea(row.objectId);
        },
        responseHandler: function (res) {
            if (res.success == 1) {
                return res;
            } else {
                layer.alert(getLanguageValue("tip.error.load"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                return [];
            }
        },
        onPageChange: function (number, size) {
            currentPageNum = number;
        },
        onLoadSuccess: function (res) {
            // 填充网格化右侧滚动条右上角
            $(".fixed-table-container").css("background-color", "#edf1f2");
            // 填充网格化背景色
            $(".fixed-table-body").css("background-color", "#fff");
        }
    });
}

/**
 * @desc 新建检测区
 */
function addArea() {
    uncheck("addArea");
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("new.area"),
        skin: 'self-iframe',
        area: ["990px", "600px"],
        btn: [getLanguageValue("btn.submit"), getLanguageValue("btn.cancle")],
        yes: function (index, layero) {
            var viewObj = layero.find("iframe")[0].contentWindow;
            var result = viewObj.checkDifference();
            if (result == true) {
                parent.layer.open({
                    type: 2,
                    title: getLanguageValue("tip"),
                    skin: 'self-iframe',
                    area: ['950px', '600px'],
                    btn: [getLanguageValue("btn.OK"), getLanguageValue("btn.cancle")],
                    yes: function (inner, layero) {
                        if (!preventDblClick) {
                            preventDblClick = true;
                            result = viewObj.saveArea("YES");
                            if (result == true) {
                                $("#areaTable").bootstrapTable('refresh');
                                parent.layer.close(inner);
                                parent.parent.layer.close(index);
                                window.localStorage.removeItem("amJSON");
                            } else {
                                preventDblClick = false;
                                parent.layer.close(inner);
                            }
                        }
                    },
                    btn2: function (inner, layero) {
                        if (!preventDblClick) {
                            window.localStorage.removeItem("amJSON");
                            preventDblClick = true;
                            result = viewObj.saveArea();
                            if (result == true) {
                                $("#areaTable").bootstrapTable('refresh');
                                parent.layer.close(inner);
                                parent.parent.layer.close(index);
                            }
                        } else {
                            preventDblClick = false;
                        }
                    },
                    cancel: function (inner, layero) {
                        window.localStorage.removeItem("amJSON");
                    },
                    content: 'src/html/detection_area/show_difference.html'
                });
            } else {
                result = viewObj.saveArea();
                if (result == true) {
                    $("#areaTable").bootstrapTable('refresh');
                    parent.layer.close(index);
                }
            }
        },
        btn2: function (index, layero) {
            var viewObj = layero.find('iframe')[0].contentWindow;
            viewObj.clearTemporaryData();
        },
        cancel: function (index, layero) {
            var viewObj = layero.find('iframe')[0].contentWindow;
            viewObj.clearTemporaryData();
        },
        content: "src/html/detection_area/add_area.html"
    });
    parent.layer.full(index);
}

/**
 * @desc 修改
 * @param {string} objectId 
 */
function updateArea(objectId) {
    uncheck("updateArea");
    var preventDblClick = false;
    var _objectId = "";
    var rows = $("#areaTable").bootstrapTable("getSelections");
    if (isNull(objectId) == false) {
        _objectId = objectId;
    } else if (rows.length == 1) {
        _objectId = rows[0].objectId;
    } else {
        layer.alert(getLanguageValue("tip.please.one"), {
            title: getLanguageValue("tip"),
            skin: "self-alert"
        });
        return;
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("edit.area"),
        skin: 'self-iframe',
        area: ["990px", "600px"],
        btn: [getLanguageValue("btn.submit"), getLanguageValue("btn.saveAs"), getLanguageValue("btn.cancle")],
        yes: function (index, layero) {
            var viewObj = layero.find("iframe")[0].contentWindow;
            var result = viewObj.checkDifference();
            if (result == true) {
                parent.layer.open({
                    type: 2,
                    title: getLanguageValue("tip"),
                    skin: 'self-iframe',
                    area: ['950px', '600px'],
                    btn: [getLanguageValue("btn.OK"), getLanguageValue("btn.cancle")],
                    yes: function (inner, layero) {
                        if (!preventDblClick) {
                            preventDblClick = true;
                            result = viewObj.updateArea("YES");
                            if (result == true) {
                                $("#areaTable").bootstrapTable('refresh');
                                parent.layer.close(inner);
                                parent.parent.layer.close(index);
                                window.localStorage.removeItem("amJSON");
                            } else {
                                preventDblClick = false;
                                parent.layer.close(inner);
                            }
                        }
                    },
                    btn2: function (inner, layero) {
                        if (!preventDblClick) {
                            window.localStorage.removeItem("amJSON");
                            preventDblClick = true;
                            result = viewObj.updateArea();
                            if (result == true) {
                                $("#areaTable").bootstrapTable('refresh');
                                parent.layer.close(inner);
                                parent.parent.layer.close(index);
                            }
                        } else {
                            preventDblClick = false;
                        }
                    },
                    cancel: function (inner, layero) {
                        window.localStorage.removeItem("amJSON");
                    },
                    content: 'src/html/detection_area/show_difference.html'
                });
            } else {
                if (!preventDblClick) {
                    preventDblClick = true;
                    result = viewObj.updateArea();
                    if (result == true) {
                        preventDblClick = false;
                        $("#areaTable").bootstrapTable('refresh');
                        parent.layer.close(index);
                    }
                }
            }
        },
        btn2: function (index, layero) {
            var viewObj = layero.find("iframe")[0].contentWindow;
            var result = viewObj.checkDifference();
            if (result == true) {
                parent.layer.open({
                    type: 2,
                    title: getLanguageValue("tip"),
                    skin: 'self-iframe',
                    area: ['950px', '600px'],
                    btn: [getLanguageValue("btn.OK"), getLanguageValue("btn.cancle")],
                    yes: function (inner, layero) {
                        if (!preventDblClick) {
                            preventDblClick = true;
                            result = viewObj.addUpdateArea("YES");
                            if (result == true) {
                                $("#areaTable").bootstrapTable('refresh');
                                parent.layer.close(inner);
                                parent.parent.layer.close(index);
                                window.localStorage.removeItem("amJSON");
                            } else {
                                preventDblClick = false;
                                parent.layer.close(inner);
                            }
                        }
                    },
                    btn2: function (inner, layero) {
                        if (!preventDblClick) {
                            window.localStorage.removeItem("amJSON");
                            preventDblClick = true;
                            result = viewObj.addUpdateArea();
                            if (result == true) {
                                $("#areaTable").bootstrapTable('refresh');
                                parent.layer.close(inner);
                                parent.parent.layer.close(index);
                            }
                        } else {
                            preventDblClick = false;
                        }
                    },
                    cancel: function (inner, layero) {
                        window.localStorage.removeItem("amJSON");
                    },
                    content: 'src/html/detection_area/show_difference.html'
                });
            } else {
                if (!preventDblClick) {
                    preventDblClick = true;
                    result = viewObj.addUpdateArea();
                    if (result == true) {
                        $("#areaTable").bootstrapTable('refresh');
                        parent.layer.close(index);
                    } else {
                        return false;
                    }
                }
            }
            return false;
        },
        content: "src/html/detection_area/update_area.html?areaId=" + _objectId
    });
    parent.layer.full(index);
}

/**
 * @desc 查看
 * @param {string} objectId
 */
function viewArea(objectId) {
    var _objectId = "";
    var rows = $("#areaTable").bootstrapTable("getSelections");
    if (isNull(objectId) == false) {
        _objectId = objectId;
    } else if (rows.length == 1) {
        _objectId = rows[0].objectId;
    } else {
        layer.alert(getLanguageValue("tip.please.one"), {
            title: getLanguageValue("tip"),
            skin: "self-alert"
        });
        return;
    }
    uncheck("viewArea");
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("tip.info.head"),
        skin: 'self-iframe',
        area: ["990px", "600px"],
        btn: [getLanguageValue("btn.close")],
        content: "src/html/detection_area/view_area.html?areaId=" + _objectId
    });
    parent.layer.full(index);
}

/**
 * @desc 删除提示
 */
function deleteArea() {
    uncheck('deleteArea');
    var preventDblClick = false;
    var objectId = "";
    var rows = $("#areaTable").bootstrapTable('getSelections');
    if (rows.length < 1) {
        layer.alert(getLanguageValue("tip.please.one"), {
            title: getLanguageValue("tip"),
            skin: "self-alert"
        });
        return;
    } else if (rows.length > 0) {
        var rowData = $('#areaTable').bootstrapTable('getData', true);
        if (rowData.length == rows.length && currentPageNum != 1) {
            currentPageNum = currentPageNum - 1;
        }
        layer.confirm(getLanguageValue("tip.confirm"), {
            title: getLanguageValue("tip"),
            skin: "self",
            yes: function () {
                if (!preventDblClick) {
                    preventDblClick == true;
                    for (var i = 0; i < rows.length; i++) {
                        if (i != rows.length - 1) {
                            objectId += rows[i].objectId + ",";
                            continue;
                        }
                        objectId += rows[i].objectId;
                    }
                    deleteData(objectId);
                }
            }
        });
    }
}
/**
 * @desc 删除
 * @param {String} objectId 
 */
function deleteData(objectId) {
    $.ajax({
        url: '/cloudlink-corrosionengineer/detectionAreaDivision/deleteDivisionAreaAndData?token=' + token,
        type: 'post',
        dataType: 'json',
        data: {
            "token": token,
            "divisionAreaId": objectId
        },
        success: function (result) {
            if (result.success == 1) {
                layer.msg(getLanguageValue("tip.confirm.ok"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg",
                });
                //诸葛IO
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('删除检测区', {
                            '结果': '成功'
                        });
                    }
                } catch (error) {}
                $("#areaTable").bootstrapTable('refresh', {
                    pageNumber: currentPageNum
                });
            } else {
                layer.alert("删除失败！", {
                    title: getLanguageValue("tip"),
                    skin: "self-alert"
                });
                //诸葛IO
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('删除检测区', {
                            '结果': '失败'
                        });
                    }
                } catch (error) {}
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: "self-alert"
            });
        }
    });
}

/**
 * @desc 导出
 */
function exportArea() {
    uncheck("exportArea");
    var rows = $("#areaTable").bootstrapTable("getSelections");
    var objectIds = "";
    for (var i = 0; i < rows.length; i++) {
        if (i != rows.length - 1) {
            objectIds += rows[i].objectId + ",";
        } else {
            objectIds += rows[i].objectId;
        }
    }
    url = '/cloudlink-corrosionengineer/detectionAreaDivision/exportDivisionArea?token=' + token + "&divisionAreaId=" + objectIds;
    $("#exportIframe").attr("src", url);
    //诸葛IO
    try {
        if (tjSwitch == 1) {
            tjSdk.track('导出检测区');
        }
    } catch (error) {}
}
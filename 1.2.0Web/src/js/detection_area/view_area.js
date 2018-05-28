/**
 * @author: zhangyi
 * @date: 2017-03-13
 * @last modified by: zhangyi
 * @last modified time: 2017/4/6
 * @file 查看检测区
 */
var pipelineId = ""; //管线ID
var token = lsObj.getLocalStorage('token'); //用户token
var areaId = getParameter("areaId"); //企业ID
//json对象  {测试方法}
var detectMethod = {
    "isM2": 0,
    "isM3": 0,
    "isM4": 0,
    "isM5": 0,
    "isM6": 0,
    "isM7": 0,
    "isM8": 0,
    "isM9": 0,
    "isM10": 0
};

//初始化
$(function () {
    getData();
    getPipelineTree();
    loadTable();
    $(window).on('resize', function () {
        $("#showAll").bootstrapTable('refresh', {
            silent: true
        });
    });
});

/**
 * @desc  获取查看数据
 * @method getData
 */
function getData() {
    var dataJSON = {
        "detectionAreaDivisionId": areaId
    };
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/detectionAreaDivision/viewDivisionArea?token=' + token),
        type: 'get',
        dataType: 'json',
        data: dataJSON,
        success: function (result) {
            if (result.success == 1) {
                var data = result.divisionAera;
                if (data != null) {
                    if (data.isOption == 1) {
                        $("#areaName").html(data.areaName + "（为任务测试桩备选库）");
                    } else {
                        $("#areaName").html(data.areaName);
                    }
                    $("#createUser").html(data.createUser);
                    if (data.createTime != null) {
                        var createTime = data.createTime.split(' ');
                        $("#createTime").text(createTime[0]);
                    }
                    $("#method2").html(data.method2);
                    $("#method3").html(data.method3);
                    $("#method4").html(data.method4);
                    $("#method5").html(data.method5);
                    $("#method6").html(data.method6);
                    $("#method7").html(data.method7);
                    $("#method8").html(data.method8);
                    $("#method9").html(data.method9);
                    $("#method10").html(data.method10);
                }
            } else {
                layer.confirm('加载失败！', {
                    skin: 'self'
                });
            }
        }
    });
}

/**
 * @desc 计算表格高度
 * @method getTableHeight
 */
function getTableHeight() {
    var contentH;
    var winH = $(".data-box").height();
    var bodyPaddingTop = parseInt($(".data-box").css("paddingTop"));
    var bodyPaddingBottom = parseInt($(".data-box").css("paddingBottom"));
    contentH = winH - (bodyPaddingTop + bodyPaddingBottom);
    return contentH;
}

/**
 * @desc 初始化网格
 * @method loadTable
 */
function loadTable() {
    $('#showAll').bootstrapTable({
        url: handleURL('/cloudlink-corrosionengineer/detectionAreaDivision/viewDivisionArea?token=' + token),
        showRefresh: false,
        height: getTableHeight(),
        queryParams: function (params) {
            params.pageSize = params.limit;
            params.pageNum = this.pageNumber;
            params.detectionAreaDivisionId = areaId;
            params.markerNumber = $('#markerNumber').val(); //测试桩号
            params.pipelineId = pipelineId; //管线id            
            params.isM2 = detectMethod.isM2;
            params.isM3 = detectMethod.isM3;
            params.isM4 = detectMethod.isM4;
            params.isM5 = detectMethod.isM5;
            params.isM6 = detectMethod.isM6;
            params.isM7 = detectMethod.isM7;
            params.isM8 = detectMethod.isM8;
            params.isM9 = detectMethod.isM9;
            params.isM10 = detectMethod.isM10;
            return params;
        },
        columns: [
            [{
                field: 'objectId',
                title: 'objectId',
                visible: false,
                rowspan: 2
            }, {
                field: 'sequence',
                title: '序号',
                rowspan: 2
            }, {
                field: 'markerNumber',
                title: '测试桩号',
                rowspan: 2
            }, {
                title: '通电电位（mV）',
                colspan: 3
            }, {
                title: '交流电压（V）',
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
                field: 'isM2',
                title: 'M2<br/>交流<br/>干扰',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }, {
                field: 'isM3',
                title: 'M3<br/>直流<br/>干扰',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004;';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }, {
                field: 'isM4',
                title: 'M4<br/>套管<br/>检测',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004;';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }, {
                field: 'isM5',
                title: 'M5<br/>交叉<br/>平行',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004;';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }, {
                field: 'isM6',
                title: 'M6<br/>阴保<br/>有效性',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004;';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }, {
                field: 'isM7',
                title: 'M7<br/>专项<br/>检测',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004;';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }, {
                field: 'isM8',
                title: 'M8<br/>绝缘<br/>检测',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004;';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }, {
                field: 'isM9',
                title: 'M9<br/>恒电<br/>位仪',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004;';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }, {
                field: 'isM10',
                title: 'M10<br/>地床<br/>检测',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '&#10004;';
                        return e;
                    } else {
                        var e = '';
                        return e;
                    }
                }
            }],
            [{
                field: 'opOfMax',
                title: '最大值'
            }, {
                field: 'opOfMin',
                title: '最小值'
            }, {
                field: 'opOfAvg',
                title: '平均值'
            }, {
                field: 'avOfMax',
                title: '最大值'
            }, {
                field: 'avOfMin',
                title: '最小值'
            }, {
                field: 'avOfAvg',
                title: '平均值'
            }]
        ],
        responseHandler: function (res) {
            if (res.success == 1) {
                var data = res.divisionAreaData;
                //诸葛IO
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测区', {
                            '结果': '成功'
                        });
                    }
                } catch (error) {}
                return {
                    'total': data.totalLength,
                    'rows': data.result
                };
            } else {
                layer.confirm("加载失败", {
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
                //诸葛IO
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测区', {
                            '结果': '失败'
                        });
                    }
                } catch (error) {}
                return [];
            }
        }
    });

}


/**
 * @desc 获取管线树
 * @method getPipelineTree
 */
function getPipelineTree() {
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
                    $.ajax({
                            url: handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token),
                            method: "get",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            async: false
                        })
                        .done(function (res) {
                            if (res.success == 1) {
                               var dataItem = res.treeList;
                                cb.call(this, dataItem);
                            } else {
                                layer.confirm(res.msg, {
                                    title:['提示'],
                                    btn:['确定'],
                                    skin: "self"
                                });
                            }
                        })
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
            pipelineId = data.node.id;
            queryList();
        });
}

/**
 * @desc 查询
 * @method queryList
 */
function queryList() {
    uncheck("queryBtn");
    detectMethod.isM2 = getCheckBoxVal("isM2");
    detectMethod.isM3 = getCheckBoxVal("isM3");
    detectMethod.isM4 = getCheckBoxVal("isM4");
    detectMethod.isM5 = getCheckBoxVal("isM5");
    detectMethod.isM6 = getCheckBoxVal("isM6");
    detectMethod.isM7 = getCheckBoxVal("isM7");
    detectMethod.isM8 = getCheckBoxVal("isM8");
    detectMethod.isM9 = getCheckBoxVal("isM9");
    detectMethod.isM10 = getCheckBoxVal("isM10");
    $('#showAll').bootstrapTable('refreshOptions', {
        pageNumber: 1
    });
}

/**
 * @desc 清除查询条件
 * @method clearForm
 */
function clearForm() {
    uncheck("clearBtn");
    $(':input', '#formSearch')
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $('#treeview').jstree(true).deselect_all();
    pipelineId = "";
    queryList();
}

/**
 * @desc 获取复选框选中状态
 * @method getCheckBoxVal
 * @param {String} checkBoxId 
 */
function getCheckBoxVal(checkBoxId) {
    if ($('#' + checkBoxId).is(':checked')) {
        return 1;
    }
    return 0;
}
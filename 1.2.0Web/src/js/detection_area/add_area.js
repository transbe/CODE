/**
 * @author: zhangyi
 * @date: 2017-03-13
 * @last modified by: zhangyi
 * @last modified time 2017/3/22 : 
 * @file 添加检测区域
 */

// 全局变量
var pipelineId = ""; //管线ID
var token = lsObj.getLocalStorage('token'); //用户token
var areaId = ""; //检测区域ID
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
var changeDataArr = []; //改变数据存储数组

$(function () {
    // 加载管线树
    getPipelineTree();
    //初始化
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/detectionAreaDivision/queryForDivisionArea?token=' + token),
        dataType: 'json',
        type: 'get',
        success: function (result) {
            if (result.success == 1) {
                loadTable();
            } else {
                layer.confirm("查询失败", {
                    btn: ['确定'],
                    skin: "self"
                });
            }
        },
        error: function (result) {
            layer.confirm("查询失败", {
                btn: ['确定'],
                skin: "self"
            });
        }
    });
    $(window).on('resize', function () {
        $("#showAll").bootstrapTable('refresh', {
            silent: true
        });
    });
    // 数据校验
    $("#searchForm").bootstrapValidator({
        fields: {
            "areaName": {
                validators: {
                    noEmpty: {}
                }
            }
        }
    });
});

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
 * @desc 加载网格数据
 * @method loadTable
 */
function loadTable() {
    $('#showAll').bootstrapTable({
        url: handleURL('/cloudlink-corrosionengineer/detectionAreaDivision/queryFromTemporary?token=' + token),
        showRefresh: false,
        height: getTableHeight(),
        queryParams: function (params) {
            params.pageSize = params.limit; //页面大小
            params.pageNum = this.pageNumber; //当前页码
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
                field: 'markerId',
                title: 'markerId',
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
                        var e = '<input type="checkbox" onClick="getChangeData(\'two' + index + '\',\'' + row.markerId + '\')" id="two' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'two' + index + '\',\'' + row.markerId + '\')" id="two' + index + '" >';
                        return e;
                    }
                }
            }, {
                field: 'isM3',
                title: 'M3<br/>直流<br/>干扰',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '<input type="checkbox" onClick="getChangeData(\'three' + index + '\',\'' + row.markerId + '\')" id="three' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'three' + index + '\',\'' + row.markerId + '\')" id="three' + index + '" >';
                        return e;
                    }
                }
            }, {
                field: 'isM4',
                title: 'M4<br/>套管<br/>检测',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '<input type="checkbox" onClick="getChangeData(\'four' + index + '\',\'' + row.markerId + '\')" id="four' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'four' + index + '\',\'' + row.markerId + '\')" id="four' + index + '" >';
                        return e;
                    }
                }
            }, {
                field: 'isM5',
                title: 'M5<br/>交叉<br/>平行',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '<input type="checkbox" onClick="getChangeData(\'five' + index + '\',\'' + row.markerId + '\')" id="five' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'five' + index + '\',\'' + row.markerId + '\')" id="five' + index + '" >';
                        return e;
                    }
                }
            }, {
                field: 'isM6',
                title: 'M6<br/>阴保<br/>有效性',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '<input type="checkbox" onClick="getChangeData(\'six' + index + '\',\'' + row.markerId + '\')" id="six' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'six' + index + '\',\'' + row.markerId + '\')" id="six' + index + '" >';
                        return e;
                    }
                }
            }, {
                field: 'isM7',
                title: 'M7<br/>专项<br/>检测',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '<input type="checkbox" onClick="getChangeData(\'seven' + index + '\',\'' + row.markerId + '\')" id="seven' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'seven' + index + '\',\'' + row.markerId + '\')" id="seven' + index + '">';
                        return e;
                    }
                }
            }, {
                field: 'isM8',
                title: 'M8<br/>绝缘<br/>检测',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '<input type="checkbox" onClick="getChangeData(\'eight' + index + '\',\'' + row.markerId + '\')" id="eight' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'eight' + index + '\',\'' + row.markerId + '\')" id="eight' + index + '" >';
                        return e;
                    }
                }
            }, {
                field: 'isM9',
                title: 'M9<br/>恒电<br/>位仪',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '<input type="checkbox" onClick="getChangeData(\'nine' + index + '\',\'' + row.markerId + '\')" id="nine' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'nine' + index + '\',\'' + row.markerId + '\')" id="nine' + index + '" >';
                        return e;
                    }
                }
            }, {
                field: 'isM10',
                title: 'M10<br/>地床<br/>检测',
                rowspan: 2,
                formatter: function (value, row, index) {
                    if (value == 1) {
                        var e = '<input type="checkbox" onClick="getChangeData(\'ten' + index + '\',\'' + row.markerId + '\')" id="ten' + index + '" checked>';
                        return e;
                    } else {
                        var e = '<input type="checkbox" onClick="getChangeData(\'ten' + index + '\',\'' + row.markerId + '\')" id="ten' + index + '" >';
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
                var data = res.rows;
                if (data.length > 0) {
                    areaId = data[0].detectionAreaDivisionId;
                }
                return res;
            } else {
                parent.layer.confirm("加载数据失败", {
                    title: ['提示'],
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
                return [];
            }
        },
        onPageChange: function (number, size) {
            if (changeDataArr.length > 0) {
                layer.confirm('是否要保存修改', {
                    title: ['提示'],
                    skin: 'self'
                }, function (index) {
                    saveChangeData();
                    layer.close(index);
                    return;
                }, function (index) {
                    changeDataArr = [];
                });
            }
        }
    });

}

/**
 * @desc 获取checkBox选中状态值
 * @method getCheckBoxVal
 * @param {String} checkBoxId
 * @return {int}0未选中或1选中
 */
function getCheckBoxVal(checkBoxId) {
    if ($('#' + checkBoxId).is(':checked')) {
        return 1;
    }
    return 0;
}

/**
 * @desc 查询条件判断
 *      1、判断checkbox是否更改
 * @method queryList
 */
function queryList() {
    uncheck("queryBtn");
    var result = hasChangeData();
    if (result == true) {
        layer.confirm('是否要保存修改', {
            title: ['提示'],
            skin: 'self'
        }, function (index) {
            layer.close(index);
            result = saveChangeData();
            if (result == true) {
                queryData();
            }
        }, function (index) {
            changeDataArr = [];
            queryData();
        });
    } else {
        changeDataArr = [];
        queryData();
    }
}

/**
 * @desc 查询
 * @method queryData
 */
function queryData() {
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
    }); // 刷新页码
}

/**
 * @desc 清除查询条件
 *       1、判断checkbox是否更改
 * @method clearForm
 */
function clearForm() {
    uncheck("clearBtn");
    var result = hasChangeData();
    if (result == true) {
        layer.confirm('是否要保存修改？', {
            title: ['提示'],
            skin: 'self'
        }, function (index) {
            layer.close(index);
            result = saveChangeData();
            if (result == true) {
                clearData();
            }
        }, function (index) {
            changeDataArr = [];
            clearData();
        });
    } else {
        changeDataArr = [];
        clearData();
    }
}

/**
 * @desc 重置查询条件
 * @method clearData
 */
function clearData() {
    $(':input', '#searchForm')
        .not(':button, :submit, :reset, :hidden,#areaName')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $('#treeview').jstree(true).deselect_all();
    pipelineId = "";
    queryData();
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
                            dataType: "json"
                        })
                        .done(function (res) {
                            if (res.success == 1) {
                                var dataItem = res.treeList;
                                cb.call(this, dataItem);
                            } else {
                                layer.confirm(res.msg, {
                                    title: ['提示'],
                                    btn: ['确定'],
                                    skin: "self"
                                });
                            }
                        });
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
            var result = hasChangeData();
            if (result == true) {
                layer.confirm('是否要保存修改', {
                    title: ['提示'],
                    skin: 'self'
                }, function (index) {
                    layer.close(index);
                    result = saveChangeData();
                    if (result == true) {
                        queryData();
                    }
                }, function (index) {
                    changeDataArr = [];
                    queryData();
                });
            } else {
                changeDataArr = [];
                queryData();
            }
        });
}

/**
 * @desc 添加保存检测区域
 * @method saveArea
 * @return {boolean} true 成功 false 失败
 */
function saveArea() {
    var bootstrapValidator = $("#searchForm").data('bootstrapValidator');
    bootstrapValidator.validate();
    var validateResult = bootstrapValidator.isValid();
    if (!validateResult) {
        layer.confirm("请输入记录名称！", {
            title: ['提示'],
            btn: ["确定"],
            skin: "self"
        });
        return false;
    }
    var isOption = getCheckBoxVal("isOption");
    var areaName = $("#areaName").val();
    var dataJSON = {
        "detecBo": {
            "objectId": areaId,
            "areaName": areaName,
            "isOption": isOption
        },
        "detectionDataList": changeDataArr
    };
    var result = false;
    $.ajax({
        url: '/cloudlink-corrosionengineer/detectionAreaDivision/saveDivisionAreaAndData?token=' + token,
        dataType: 'json',
        type: 'post',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(dataJSON),
        success: function (successResult) {
            if (successResult.success == 1) {
                parent.layer.msg("提交成功！", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-success"
                });
                result = true;
                //诸葛IO
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('新建检测区', {
                            '结果': '成功'
                        });
                    }
                } catch (error) {}
            } else {
                parent.layer.confirm("提交失败！", {
                    title: ['提示'],
                    btn: ['确定'],
                    skin: "self"
                });
                result = false;
                //诸葛IO
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('新建检测区', {
                            '结果': '失败'
                        });
                    }
                } catch (error) {}
            }
        },
        error: function (errorResult) {
            parent.layer.confirm("提交失败！", {
                title: ['提示'],
                btn: ['确定'],
                skin: "self"
            });
        }
    });
    return result;
}

/**
 * @desc 清空后台临时表
 * @method clearTemporaryData
 * @return {*boolean} true/false 用来控制layer层是否关闭
 */
function clearTemporaryData() {
    var result = false;
    $.ajax({
        url: '/cloudlink-corrosionengineer/detectionAreaDivision/emptyTemporary?token=' + token,
        type: 'get',
        dataType: 'json',
        data: {
            'detectionAreaId': areaId
        },
        success: function (successResult) {
            if (successResult.success == 1) {
                result = true;
            } else {
                result = false;
            }
        },
        error: function (errorResult) {
            result = false;
        }
    });
    return result;
}

/**
 * @desc 1、为checkbox添加/删除class标记
 *       2、调用getChangeDataArr方法获取改变的数据
 * @param {String} checkBoxId 
 * @param {String} markerId 
 */
function getChangeData(checkBoxId, markerId) {
    $('#' + checkBoxId).toggleClass(checkBoxId);
    getChangeDataArr(checkBoxId, markerId);
}

/**
 * @desc 判断整页数据是否更改
 * @method hasChangeData
 * @return {boolean} true 有更改 fasle 无更改
 */
function hasChangeData() {
    var allData = $('#showAll').bootstrapTable('getData', true);
    if (allData.length > 0) {
        for (var i = 0; i < allData.length; i++) {
            var isM2 = $('#two' + i).hasClass("two" + i);
            var isM3 = $('#three' + i).hasClass("three" + i);
            var isM4 = $('#four' + i).hasClass("four" + i);
            var isM5 = $('#five' + i).hasClass("five" + i);
            var isM6 = $('#six' + i).hasClass("six" + i);
            var isM7 = $('#seven' + i).hasClass("seven" + i);
            var isM8 = $('#eight' + i).hasClass("eight" + i);
            var isM9 = $('#nine' + i).hasClass("nine" + i);
            var isM10 = $('#ten' + i).hasClass("ten" + i);

            if (isM2 == true || isM3 == true || isM4 == true || isM5 == true) {
                return true;
            }
            if (isM6 == true || isM7 == true || isM8 == true || isM9 == true || isM10 == true) {
                return true;
            }
        }
    }
    return false;
}

/**
 * @desc 获取被操作的数据，存入changeDataArr数组
 * @method getChangeDataArr
 * @param {*String} checkBoxId 
 * @param {*String} markerId 
 */
function getChangeDataArr(checkBoxId, markerId) {
    var n = getDuplicateIndex(markerId);
    var obj = new Object();
    obj.detectionAreaDivisionId = areaId;
    obj.markerId = markerId;
    // 检测类型
    var i = "";
    if (checkBoxId.indexOf("two") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("two") + 3, checkBoxId.length);
    }
    if (checkBoxId.indexOf("three") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("three") + 5, checkBoxId.length);
    }
    if (checkBoxId.indexOf("four") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("four") + 4, checkBoxId.length);
    }
    if (checkBoxId.indexOf("five") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("five") + 4, checkBoxId.length);
    }
    if (checkBoxId.indexOf("six") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("six") + 3, checkBoxId.length);
    }
    if (checkBoxId.indexOf("seven") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("seven") + 5, checkBoxId.length);
    }
    if (checkBoxId.indexOf("eight") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("eight") + 5, checkBoxId.length);
    }
    if (checkBoxId.indexOf("nine") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("nine") + 4, checkBoxId.length);
    }
    if (checkBoxId.indexOf("ten") != -1) {
        i = checkBoxId.slice(checkBoxId.indexOf("ten") + 3, checkBoxId.length);
    }
    obj.isM2 = getCheckBoxVal("two" + i);
    obj.isM3 = getCheckBoxVal("three" + i);
    obj.isM4 = getCheckBoxVal("four" + i);
    obj.isM5 = getCheckBoxVal("five" + i);
    obj.isM6 = getCheckBoxVal("six" + i);
    obj.isM7 = getCheckBoxVal("seven" + i);
    obj.isM8 = getCheckBoxVal("eight" + i);
    obj.isM9 = getCheckBoxVal("nine" + i);
    obj.isM10 = getCheckBoxVal("ten" + i);
    if (n == -1) {
        changeDataArr.push(obj);
    } else {
        changeDataArr[n].isM2 = obj.isM2;
        changeDataArr[n].isM3 = obj.isM3;
        changeDataArr[n].isM4 = obj.isM4;
        changeDataArr[n].isM5 = obj.isM5;
        changeDataArr[n].isM6 = obj.isM6;
        changeDataArr[n].isM7 = obj.isM7;
        changeDataArr[n].isM8 = obj.isM8;
        changeDataArr[n].isM9 = obj.isM9;
        changeDataArr[n].isM10 = obj.isM10;
    }
}

/**
 * @desc 返回changeDataArr中重复数据的下标
 * @method getDuplicateIndex
 * @param {*String} markerId
 * @return {int} 返回changeDataArr中重复数据的下标
 */
function getDuplicateIndex(markerId) {
    var n = -1;
    for (var i = 0; i < changeDataArr.length; i++) {
        if (markerId == changeDataArr[i].markerId) {
            n = i;
        }
    }
    return n;
}

/**
 * @desc 保存更改数据
 * @method saveChangeData
 * @return {boolean} true 保存成功 false 保存失败
 */
function saveChangeData() {
    var dataJSON = {
        "detectionDataList": changeDataArr
    };
    var result = false;
    $.ajax({
        url: '/cloudlink-corrosionengineer/detectionAreaDivision/updateTemporaryById?token=' + token,
        dataType: 'json',
        type: 'post',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(dataJSON),
        success: function (successResult) {
            if (successResult.success == 1) {
                layer.msg("保存成功！", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-success"
                });
                changeDataArr = [];
                result = true;
            } else {
                layer.confirm("保存失败！", {
                    title: ['提示'],
                    btn: ['确定'],
                    skin: "self"
                });
                changeDataArr = [];
                result = false;
            }
        },
        error: function (errorResult) {
            layer.confirm("保存失败！", {
                title: ['提示'],
                btn: ['确定'],
                skin: "self"
            });
            changeDataArr = [];
            result = false;
        }
    });
    return result;
}
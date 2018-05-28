/**
 * @file
 * @author: gaohui
 * @desc 添加报告申请js
 * @date: 2017-3-13
 * @last modified by: zhangyi
 * @last modified time: 2017-06-12 17:43:22
 */

var token = lsObj.getLocalStorage("token")
var reportType = getParameter("reportType"); // 报告区分字段：1有效性报告，2完整性报告
var leafArr = []; // 获取所有的叶子节点数组

$(function() {
    changePageStyle("../../../../src");
    if (reportType == 1) {
        $('#remark').html(getLanguageValue("Note1"));
        $('#treeText').html(getLanguageValue("Select_pipeline"));
        $('#pickText').html(getLanguageValue("Selected_Pipelines"));
    } else {
        $('#remark').html('<ol><li>' + getLanguageValue("Note2") + '</li><li>' + getLanguageValue("Note3") + '</li><li>' + getLanguageValue("Note4") + '</li><li>' + getLanguageValue("Note5") + '</li><li>' + getLanguageValue("Note6") + '</li></ol>');
        $('#treeText').html(getLanguageValue("Select_pipeline"));
        $('#pickText').html(getLanguageValue("Selected_Pipelines"));
    }
    getTree(reportType); // 获取树
    loadExpertSelect(); // 加载专家下拉框
    // 时间插件
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4
    }).on('hide', function(e) {
        $('#addForm').data('bootstrapValidator').updateStatus('year', 'NOT_VALIDATED', null).validateField('year');
    });

    $(".pickListButtons").on("click", "button", function() {
        var check = $('#addForm').data('bootstrapValidator');
        check.resetField("treeData");
        check.validateField("treeData");
    });
    //表格验证
    $('#addForm').bootstrapValidator({
        fields: {
            reportName: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        max: 50
                    }
                }
            },
            expertName: {
                validators: {
                    notEmpty: {},
                }
            },
            year: {
                validators: {
                    notEmpty: {},
                }
            },
            treeData: {
                validators: {
                    callback: {
                        callback: function(value, validator) {
                            var items = $("#treeData option");
                            var result = false;
                            if (items.length > 0) {
                                result = true;
                            }
                            return result;
                        }
                    }
                }
            }
        }
    });

})


/**
 * @desc 获取企业管线/阴保分段树数据
 * @param {string} reportType 
 */
function getTree(reportType) {
    if (reportType == 1) {
        $('#tree').jstree({
                core: {
                    multiple: true,
                    animation: 0,
                    check_callback: true,
                    themes: {
                        dots: false
                    },
                    //强制将节点文本转换为纯文本，默认为false
                    force_text: true,
                    data: function(obj, cb) {
                        var dataItem;
                        leafArr = [];
                        $.ajax({
                                url: handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token),
                                method: "get",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                async: false
                            })
                            .done(function(res) {
                                if (res.success == 1) {
                                    dataItem = res.treeList;
                                    for (var i = 0; i < dataItem.length; i++) {
                                        if (dataItem[i].type == "pipeline") {
                                            var allNodeLeaf = {
                                                "id": '',
                                                "text": ''
                                            };
                                            allNodeLeaf.id = dataItem[i].id;
                                            allNodeLeaf.text = dataItem[i].text;
                                            leafArr.push(allNodeLeaf);
                                        }
                                    }
                                } else {
                                    layer.alert(res.msg, {
                                        title: getLanguageValue("tip"),
                                        skin: "self-alert"
                                    });
                                }
                            })
                            .fail(function(XMLHttpRequest, textStatus, errorThrown) {
                                layer.alert(NET_ERROR_MSG, {
                                    skin: "self-alert"
                                });
                            });
                        cb.call(this, dataItem);
                    }
                },
                sort: function(a, b) {
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
            .on('loaded.jstree', function(e, data) {
                var inst = data.instance;
                //默认展开全部节点 
                inst.open_all();
            });
    } else {
        $.jstree.defaults.core.themes.dots = false;
        $('#tree').jstree({
                core: {
                    multiple: true,
                    animation: 0,
                    check_callback: true,
                    force_text: true,
                    data: function(obj, cb) {
                        var dataItem;
                        leafArr = [];
                        $.ajax({
                                url: handleURL('/cloudlink-corrosionengineer/cpsegment/getCpSegmentChartTree?token=' + token),
                                method: "get",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                async: false
                            })
                            .done(function(res) {
                                if (res.success == 1) {
                                    dataItem = res.result;
                                    for (var i = 0; i < dataItem.length; i++) {
                                        if (dataItem[i].type == "file") {
                                            var allNodeLeaf = {
                                                "id": '',
                                                "text": ''
                                            };
                                            allNodeLeaf.id = dataItem[i].id;
                                            allNodeLeaf.text = dataItem[i].text;
                                            leafArr.push(allNodeLeaf);
                                        }
                                    }
                                } else {
                                    layer.alert(res.msg, {
                                        title: getLanguageValue("tip"),
                                        skin: "self-alert"
                                    });
                                }

                            })
                            .fail(function(XMLHttpRequest, textStatus, errorThrown) {
                                layer.alert(NET_ERROR_MSG, {
                                    title: getLanguageValue("tip"),
                                    skin: "self-alert"
                                });
                            });
                        cb.call(this, dataItem);
                    }
                },
                types: {
                    default: {
                        icon: 'folder-icon'
                    },
                    file: {
                        icon: 'segment-icon',
                        valid_children: []
                    },
                    chart: {
                        icon: 'chart-icon',
                        valid_children: []
                    },
                    publish: {
                        icon: 'publish-icon',
                        valid_children: []
                    }
                },
                plugins: ["types", "state", "sort"]
            })
            .on('loaded.jstree', function(e, data) {
                var inst = data.instance;
                //默认展开全部节点 
                inst.open_all();
            })
    }
}

/**
 * @desc 点击新增阴保分段/企业管线
 */
function pAdd() {
    var mess = $("#treeText").html().split("：")[0];
    var inst = $('#tree').jstree(true);
    var nodes = inst.get_selected(true);
    var type = "";
    var text = "";
    var id = "";
    for (var i = 0; i < nodes.length; i++) {
        id += nodes[i].id + ',';
        type += nodes[i].type + ',';
        text += nodes[i].text + ',';
    }
    if (type.indexOf('pipeline-folder') != -1 || type.indexOf('default') != -1 || type.indexOf('chart') != -1 || type.indexOf('publish') != -1) {
        parent.layer.alert(mess + '！', {
            title: getLanguageValue("tip"), //按钮
            skin: 'self-alert'
        });
        return;
    }
    var str = $("#treeData option").map(function() {
        return $(this).val();
    }).get().join(", ");
    for (var i = 0; i < nodes.length; i++) {
        if (str.indexOf(nodes[i].id) != -1) {
            continue;
        }
        $('#treeData').append("<option value='" + nodes[i].id + "'>" + nodes[i].text + "</option>");
    }
}

/**
 * @desc 点击新增所有的阴保分段/叶子节点企业管线
 */
function pAddAll() {
    var str = $("#treeData option").map(function() {
        return $(this).val();
    }).get().join(", ");
    for (var i = 0; i < leafArr.length; i++) {
        if (str.indexOf(leafArr[i].id) != -1) {
            continue;
        }
        $('#treeData').append("<option value='" + leafArr[i].id + "'>" + leafArr[i].text + "</option>");
    }
}


/**
 * @desc 点击移除阴保分段/企业管线
 * @param {string} removeFlag 值为all表示全部移除 
 */
function pRemove(removeFlag) {
    $("#treeData").find("option:selected").remove();
    if (removeFlag == "all") {
        $("#treeData").find('option').remove();
    }
}

/**
 * @desc 提交申请报告
 * @returns {boolean} true 成功 false 失败 
 */
function saveData() {
    var bootstrapValidator = $("#addForm").data('bootstrapValidator');
    bootstrapValidator.validate();
    if (bootstrapValidator.isValid()) {
        var pipeId = $("#treeData option").map(function() {
            return $(this).val();
        }).get().join(",");
        var reportName = $('#reportName').val();
        var year = $('#year').val();
        var expertId = $("#expertName").selectpicker().val();
        var expertName = $('#expertName option:selected').html();
        var result = false;
        $.ajax({
            url: '/cloudlink-corrosionengineer/report/addApply?token=' + token,
            type: 'post',
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "reportName": reportName,
                "year": year,
                "expertId": expertId,
                "expertName": expertName,
                "pipeId": pipeId,
                "reportType": reportType
            }),
            success: function(successResult) {
                if (successResult.success == 1) {
                    parent.layer.msg(getLanguageValue("New_success"), {
                        time: MSG_DISPLAY_TIME, // common.js中定义好的layer弹框消失的时间
                        skin: "self-msg"
                    });
                    result = true;
                } else {
                    parent.layer.alert(successResult.msg, {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                    result = false;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                parent.layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                result = false;
            }
        });
        return result;
    } else {
        return false;
    }
}

/**
 * @desc 加载专家下拉框
 */
function loadExpertSelect() {
    var user = JSON.parse(lsObj.getLocalStorage('userBo'));
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/common/getExpertsListForSelect?serveEnterpriseId=' + user.enterpriseId + '&token=' + token),
        dataType: "json",
        type: 'get',
        success: function(successResult) {
            if (successResult.success == 1) {
                var data = successResult.expertList;
                var options = "<option value=''>" + getLanguageValue("Select") + "</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#expertName").html(options);
                $("#expertName").selectpicker('refresh');
            } else {
                layer.alert(getLanguageValue("Load_data_error"), {
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

/**
 * @desc 查看专家信息
 */
function viewExpert() {
    var expertId = $("#expertName").val();
    if (isNull(expertId) == false) {
        parent.layer.open({
            type: 2,
            title: [getLanguageValue("Information_of_spcilist")],
            skin: 'self-iframe',
            btn: [getLanguageValue("cancle")],
            area: ['450px', '350px'],
            maxmin: false,
            content: '/src/html/expert_and_report/report/expert_info.html?expertId=' + expertId
        });
    } else {
        layer.alert(getLanguageValue("Select_Specilist"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
    }
}
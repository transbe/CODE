/**
 * @author: gaohui
 * @date: 2017-3-13
 * @last modified by: zhangyi
 * @last modified time: 2017-5-20
 * @file 添加报告申请js
 */

var token = lsObj.getLocalStorage("token")
var reportType = getParameter("reportType"); // 报告区分字段：1有效性报告，2完整性报告
var leafArr = []; // 获取所有的叶子节点数组

$(function () {
    if (reportType == 1) {
        $('#remark').html('所选管线M3、M6检测的测试桩占全部测试桩80%以上。');
        $('#treeText').html("请选择企业管线：");
        $('#pickText').html("已选择企业管线：");
    } else {
        $('#remark').html('<ol><li>阴保分段绘制完成；</li><li>申请报告中所选阴保分段中，每段阴保分段上恒电位仪M9检测数据完成率100%；</li><li>所选每段阴保分段上，如在ICCP系统上存在排流站，要求M10地床检测数据完成率100%；</li><li>所选每段阴保分段上，M8绝缘接头检测数据整体覆盖率100%；</li><li>所选每段阴保分段上，全部测试桩中，要求已完成M3直流干扰检测和M6阴保有效性检测检测任务占全部测试桩的80%及以上</li></ol>');
        $('#treeText').html("请选择阴保分段：");
        $('#pickText').html("已选择阴保分段：");
    }
    getTree(reportType); // 获取树
    loadExpertSelect(); // 加载专家下拉框
    // 时间插件
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4
    });

    $(".pickListButtons").on("click", "button", function () {
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
                }
            },
            expertName: {
                validators: {
                    notEmpty: {},
                }
            },
            treeData: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            var items = $("#treeData option");
                            var flag = false;
                            if (items.length > 0) {
                                flag = true;
                            }
                            return flag

                        }
                    }
                }
            }
        }
    });

})


/**
 * @desc 获取企业管线/阴保分段树数据
 * @method getTree
 * @param {String} reportType 
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
                    data: function (obj, cb) {
                        var dataItem;
                        leafArr = [];
                        $.ajax({
                                url: handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token),
                                method: "get",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                async: false
                            })
                            .done(function (res) {
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
                                    layer.msg(res.msg, {
                                        skin: "self-success"
                                    });
                                }
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
            });
    } else {
        $.jstree.defaults.core.themes.dots = false;
        $('#tree').jstree({
                core: {
                    multiple: true,
                    animation: 0,
                    check_callback: true,
                    force_text: true,
                    data: function (obj, cb) {
                        var dataItem;
                        leafArr = [];
                        $.ajax({
                                url: handleURL('/cloudlink-corrosionengineer/cpsegment/getCpSegmentChartTree?token=' + token),
                                method: "get",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                async: false
                            })
                            .done(function (res) {
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
                                    // try{
                                    //     if(zhugeSwitch==1){
                                    //         zhuge.track('阴保分段',{'操作':'查询树'});
                                    //     }
                                    // }catch(err){
                                    //     //在此处理错误
                                    // }
                                } else {
                                    layer.msg(res.msg, {
                                        skin: "self-success"
                                    });
                                }

                            })
                        cb.call(this, dataItem);
                    }
                },
                types: {
                    default: {
                        icon: 'folder-icon'
                    },
                    file: {
                        icon: 'segment-file-icon',
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
            .on('loaded.jstree', function (e, data) {
                var inst = data.instance;
                //默认展开全部节点 
                inst.open_all();
            })
    }
}

/**
 * @desc 点击新增阴保分段/企业管线
 * @method pAdd
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
        parent.layer.confirm(mess + '！', {
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return;
    }
    var str = $("#treeData option").map(function () {
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
 * @method pAddAll
 */
function pAddAll() {
    var str = $("#treeData option").map(function () {
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
 * @method pRemove
 * @param {*String} flag 值为all表示全部移除 
 */
function pRemove(flag) {
    $("#treeData").find("option:selected").remove();
    if (flag == "all") {
        $("#treeData").find('option').remove();
    }
}

/**
 * @desc 提交申请报告
 * @method saveData
 * @returns {*Boolean} true 成功 false 失败 
 */
function saveData() {
    var bootstrapValidator = $("#addForm").data('bootstrapValidator');
    bootstrapValidator.validate();
    if (bootstrapValidator.isValid() == true) {
        var pipeId = $("#treeData option").map(function () {
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
            success: function (successResult) {
                if (successResult.success == 1) {
                    parent.layer.msg('新增成功！', {
                        time: MSG_DISPLAY_TIME, // common.js中定义好的layer弹框消失的时间
                        skin: "self-success"
                    });
                    // zhugeMess("新增", "成功");
                    result = true;
                } else {
                    parent.layer.confirm(successResult.msg, {
                        title: ['提示'],
                        btn: ['确定'], //按钮
                        skin: 'self'
                    });
                    result = false;
                    // zhugeMess("新增", "失败");
                }
            }
        });
        return result;
    } else {
        /*parent.layer.confirm("请填写必填项！", {
            title: ['提示'],
            btn: ['确定'],
            skin: 'self'
        });*/
        return false;
    }
}

/**
 * @desc 加载专家下拉框
 * @method loadExpertSelect
 */
function loadExpertSelect() {
    var user = JSON.parse(lsObj.getLocalStorage('userBo'));
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/common/getExpertsListForSelect?serveEnterpriseId=' + user.enterpriseId + '&token=' + token),
        dataType: "json",
        type: 'get',
        success: function (successResult) {
            if (successResult.success == 1) {
                var data = successResult.expertList;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#expertName").html(options);
                $("#expertName").selectpicker('refresh');
            } else {
                layer.confirm('下拉选加载失败', {
                    title: ['提示'],
                    btn: ['确定'],
                    skin: 'self'
                })
            }
        }
    });
}

/**
 * @desc 诸葛IO
 * @method zhugeMess
 * @param {*String} action 操作 
 * @param {*String} result 
 */
function zhugeMess(action, result) {
    var zhugeName = "";
    if (reportType == 1) {
        zhugeName = params + "阴保有效性报告";
    } else {
        zhugeName = params + "阴保完整性报告";
    }
    //诸葛IO
    try {
        if (zhugeSwitch == 1) {
            zhuge.track(zhugeName, {
                '结果': param
            });
        }
    } catch (error) {}
}

/**
 * @desc 查看专家信息
 * @method viewExpert
 */
function viewExpert() {
    var expertId = $("#expertName").val();
    if (expertId != "") {
        parent.layer.open({
            type: 2,
            title: ['专家信息'],
            btn: ['关闭'],
            area: ['450px', '350px'],
            maxmin: false,
            content: '/src/html/expert_and_report/report/expert_info.html?expertId=' + expertId
        });
    } else {
        layer.confirm('请选择专家', {
            title: ['提示'],
            btn: ['确定'],
            skin: 'self'
        });
    }
}
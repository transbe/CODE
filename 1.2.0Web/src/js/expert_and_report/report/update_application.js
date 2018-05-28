var reportId = getParameter('objectId'); // 报告id
var reportType = getParameter('reportType'); // 报告区分字段：1有效性报告，2完整性报告
var token = lsObj.getLocalStorage("token");
var expertId = ""; // 专家ID
var returnInfo = ""; // 退回信息/补充信息
var leafArr = [];

$(function () {

    $('.panel-heading').on('click', function () {
        $(this).siblings('.panel-body').toggleClass('panel-body-close');
    });

    if (reportType == 1) {
        $('#verificationResult').html('<ul style="list-style:none;"><li>所选管线M3、M6检测的测试桩占全部测试桩80%以上。</li></ul>');
        $('#treeText').html("请选择企业管线：");
        $('#pickText').html("已选择企业管线：");
    } else {
        $('#verificationResult').html('<ol><li>阴保分段绘制完成；</li><li>申请报告中所选阴保分段中，每段阴保分段上恒电位仪M9检测数据完成率100%；</li><li>所选每段阴保分段上，如在ICCP系统上存在排流站，要求M10地床检测数据完成率100%；</li><li>所选每段阴保分段上，M8绝缘接头检测数据整体覆盖率100%；</li><li>所选每段阴保分段上，全部测试桩中，要求已完成M3直流干扰检测和M6阴保有效性检测检测任务占全部测试桩的80%及以上</li></ol>');
        $('#treeText').html("请选择阴保分段：");
        $('#pickText').html("已选择阴保分段：");
    }
    getTree(reportType);
    getHistory();
    getData();
    $(".pickListButtons").on("click", "button", function () {
        var check = $('#treeForm').data('bootstrapValidator');
        check.resetField("treeData");
        check.validateField("treeData");
    });

    //表格验证
    $('#treeForm').bootstrapValidator({
        fields: {
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
});

/**
 * @desc 获取申请数据
 * @method getData
 */
function getData() {
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/report/getForUpdate?token=' + token),
        type: 'get',
        dataType: 'json',
        data: {
            "objectId": reportId
        },
        success: function (result) {
            if (result.success == 1) {
                var data = result.bo;
                expertId = data.expertId;
                $("#reportName").html(data.reportName);
                $("#expertName").html(data.expertName);
                $("#year").html(data.year);
                if (data.reportType == 1) {
                    $("#reportType").html('阴保有效性报告');
                } else {
                    $("#reportType").html('阴保完整性报告');
                }
                $("#applyStatus").html(convertApplyStatus(data.applyStatus));
                $("#applyUserName").html(data.applyUserName);
                $("#applyTime").html(data.applyTime);
                var pipeArr = data.pipe;
                if (pipeArr.length > 0) {
                    for (var i = 0; i < pipeArr.length; i++) {
                        $('#treeData').append("<option value='" + pipeArr[i].id + "'>" + pipeArr[i].text + "</option>");
                    }
                }
                $("#reason").val(returnInfo);
            } else {
                layer.confirm(result.msg, {
                    btn: ['确定'],
                    skin: 'self'
                });
            }
        },
        error: function (result) {
            layer.confirm('加载失败！', {
                btn: ['确定'],
                skin: 'self'
            });
        }
    });
}

/**
 * @desc 获取企业管线/阴保分段树数据
 * @method getTree
 * @param {*String} reportType 
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
            });
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
            title: ['提示'],
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
 * @desc 提交申请
 * 		 先调用微服务存储，返回filedId
 * @method saveApplication
 * @returns {*Boolean} true 成功 false 失败
 */
function saveApplication() {
    var flag = false;
    var fileName = $("#file").val();
    if (fileName.length < 1) {
        parent.layer.confirm("请上传PDF文件", {
            title: ['提示'],
            btn: ['确定'],
            skin: 'self'
        });
        return;
    } else {
        var fileArr = fileName.split(".");
        if (fileArr[fileArr.length - 1] != "pdf") {
            parent.layer.confirm("请上传PDF文件", {
                title: ['提示'],
                btn: ['确定'],
                skin: 'self'
            });
            return;
        }
    }
    var bootstrapValidator = $("#treeForm").data('bootstrapValidator');
    bootstrapValidator.validate();
    if (bootstrapValidator.isValid()) {
        var pipeId = $("#treeData option").map(function () {
            return $(this).val();
        }).get().join(", ");
        var fileId = uploadFile();
        if (fileId != "" && fileId != null && fileId != undefined) {
            $.ajax({
                url: '/cloudlink-corrosionengineer/report/updateApplyPipe?token=' + token,
                async: false,
                type: 'post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "objectId": reportId,
                    "fileId": fileId,
                    "pipeId": pipeId,
                    "opinion": $("#opinion").val()
                }),
                success: function (result) {
                    if (result.success == 1) {
                        parent.layer.msg('提交成功！', {
                            time: MSG_DISPLAY_TIME,
                            skin: 'self-success'
                        });
                        // zhugeMess("修改", "成功");
                        flag = true;
                    } else {
                        parent.layer.confirm(result.msg, {
                            title: ['提示'],
                            btn: ['确定'], //按钮
                            skin: 'self'
                        });
                        flag = false;
                    }
                },
                error: function () {
                    parent.layer.confirm('提交失败！', {
                        title: ['提示'],
                        btn: ['确定'], //按钮
                        skin: 'self'
                    });
                    flag = false;
                }
            });
        } else {
            parent.layer.confirm('提交失败！', {
                title: ['提示'],
                btn: ['确定'], //按钮
                skin: 'self'
            });
            flag = false;
        }
    } else {
        parent.layer.confirm("请填写必填项！", {
            title: ['提示'],
            btn: ['确定'],
            skin: 'self'
        });
    }
    return flag;
}

/**
 * @desc 关闭申请
 * @method closeApplication
 * @returns {*boolean} flag
 */
function closeApplication() {
    var flag = false;
    $.ajax({
        url: '/cloudlink-corrosionengineer/report/audit?token=' + token,
        type: 'post',
        async: false,
        data: JSON.stringify({
            'reportId': reportId,
            'action': 2,
            "reportType": reportType
        }),
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            if (result.success == 1) {
                parent.layer.msg('关闭成功！', {
                    time: MSG_DISPLAY_TIME, // common.js中定义好的layer弹框消失的时间
                    skin: "self-success"
                });
                flag = true;
            } else {
                parent.layer.confirm('关闭失败！', {
                    skin: 'self',
                    btn: ['确定']
                });
                flag = false;
            }
        },
        error: function (result) {
            parent.layer.confirm('关闭失败！', {
                skin: 'self',
                btn: ['确定']
            });
            flag = false;
        }
    });
    return flag;
}

/**
 * @desc 附件上传 （只能上传pdf文件）
 * @method uploadFile
 */
function uploadFile() {
    var fileId = "";
    var formData = new FormData($("#importForm")[0]);
    $.ajax({
        url: '/cloudlink-core-file/attachment/save?businessId=' + reportId + '&bizType=doc',
        type: 'post',
        async: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (result) {
            if (result.success == 1) {
                fileId = result.rows[0].fileId;
            }
        }
    });
    return fileId;
}

/**
 * @desc 获取历史信息
 * @method getHistory
 */
function getHistory() {
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/report/getAuditHistory?token=' + token),
        type: 'get',
        dataType: 'json',
        data: {
            "reportId": reportId,
            "havaFile": false
        },
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows;
                if (data.length > 0) {
                    returnInfo = data[0].opinion;
                    var li_str = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].operateTime != null) {
                            li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
                            li_str += '<div><span>' + data[i].operateTime + '</span><span>' + data[i].operatorName + '</span><span>' + convertApplyStatus(data[i].action) + '</span></div></li>'
                        }
                    }
                }
                $(".history-body").html(li_str);
            }
        }
    });
}

/**
 * @desc 查看专家信息
 * @method viewExpert
 */
function viewExpert() {
    parent.layer.open({
        type: 2,
        title: ['专家信息'],
        btn: ['关闭'],
        area: ['450px', '350px'],
        maxmin: false,
        content: '/src/html/expert_and_report/report/expert_info.html?expertId=' + expertId
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
        zhugeName = action + "阴保有效性报告";
    } else {
        zhugeName = action + "阴保完整性报告";
    }
    //诸葛IO
    try {
        if (zhugeSwitch == 1) {
            zhuge.track(zhugeName, {
                '结果': result
            });
        }
    } catch (error) {}
}
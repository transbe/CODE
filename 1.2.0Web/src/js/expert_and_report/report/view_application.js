var reportId = getParameter('objectId'); //报告id
var reportType = getParameter('reportType'); //报告区分字段：1有效性报告，2完整性报告
var token = lsObj.getLocalStorage("token");
var expertId = ""; // 专家ID
var returnInfo = ""; // 退回信息/补充信息

$(function() {
    $('.panel-heading').on('click', function() {
        $(this).siblings('.panel-body').toggleClass('panel-body-close');
    });

    if (reportType == 1) {
        $("#pipeName").html("企业管线管理层级：");
        $('#verificationResult').html('<ul style="list-style:none;"><li>所选管线M3、M6检测的测试桩占全部测试桩80%以上。</li></ul>');
    } else {
        $("#pipeName").html("阴保分段：");
        $('#verificationResult').html('<ol><li>阴保分段绘制完成；</li><li>申请报告中所选阴保分段中，每段阴保分段上恒电位仪M9检测数据完成率100%；</li><li>所选每段阴保分段上，如在ICCP系统上存在排流站，要求M10地床检测数据完成率100%；</li><li>所选每段阴保分段上，M8绝缘接头检测数据整体覆盖率100%；</li><li>所选每段阴保分段上，全部测试桩中，要求已完成M3直流干扰检测和M6阴保有效性检测检测任务占全部测试桩的80%及以上</li></ol>');
    }
    getHistory();
    getData();

    // 历史信息展开
    $(".show-content").click(function(e) {
        $(".history-body").show();
    });
    // 历史信息收缩
    $(".hide-content").click(function(e) {
        $(".history-body").hide();
    });
});

/**
 * @desc 加载数据
 * @method getData
 */
function getData() {
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/report/getById?token=' + token),
        type: 'get',
        dataType: 'json',
        data: {
            "objectId": reportId,
            "reportType": reportType
        },
        success: function(result) {
            if (result.success == 1) {
                var data = result.rows;
                if (data != null) {
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
                        getTree(reportType, pipeArr);
                    }
                    if (returnInfo != null && returnInfo != "") {
                        $("#reason").show();
                        $("#opinion").val(returnInfo);
                    }
                }
            } else {
                layer.confirm('加载失败！', {
                    btn: ['确定'],
                    skin: 'self'
                });
            }
        },
        error: function(result) {
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
 * @param {*Array} pipeArr	管线数组
 */
function getTree(reportType, pipeArr) {
    if (reportType == 1) {
        $('#pipe').jstree({
                core: {
                    multiple: false,
                    animation: 0,
                    check_callback: true,
                    themes: {
                        dots: false
                    },
                    //强制将节点文本转换为纯文本，默认为false
                    force_text: true,
                    data: pipeArr
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
        $('#pipe').jstree({
                core: {
                    multiple: false,
                    animation: 0,
                    check_callback: true,
                    force_text: true,
                    data: pipeArr
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
            .on('loaded.jstree', function(e, data) {
                var inst = data.instance;
                //默认展开全部节点 
                inst.open_all();
            });
    }
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
        success: function(result) {
            if (result.success == 1) {
                var data = result.rows;
                if (data.length > 0) {
                    var li_str = "";
                    if (data[0].action != 3) {
                        returnInfo = data[0].opinion;
                    }
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
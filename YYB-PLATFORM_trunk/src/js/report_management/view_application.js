/**
 * @file
 * @author: zhangyi
 * @desc: 申请信息查看
 * @date：2017-05-17
 * @last modified by: zhangyi
 * @last modified time: 2017-06-13 10:19:06
 */

var reportType = getParameter("reportType"); // 报告类型 1.阴保有效性报告2.阴保完整性报告
var applyId = getParameter("applyId"); // 申请ID
var token = lsObj.getLocalStorage("token"); //token
var returnInfo = ""; // 退回信息/补充信息

$(function () {
    $('.panel-heading').on('click', function () {
        $(this).siblings('.panel-body').toggleClass('panel-body-close');
    });
    if (reportType == 2) {
        $("#treeName").html("阴保分段：");
        $('#verificationResult').html('<ol><li>阴保分段绘制完成；</li><li>申请报告中所选阴保分段中，每段阴保分段上恒电位仪M9检测数据完成率100%；</li><li>所选每段阴保分段上，如在ICCP系统上存在排流站，要求M10地床检测数据完成率100%；</li><li>所选每段阴保分段上，M8绝缘接头检测数据整体覆盖率100%；</li><li>所选每段阴保分段上，全部测试桩中，要求已完成M3直流干扰检测和M6阴保有效性检测检测任务占全部测试桩的80%及以上。</li></ol>');
    } else {
        $("#treeName").html("企业管线管理层级：");
        $('#verificationResult').html('<ul style="list-style:none;"><li>所选管线M3、M6检测的测试桩占全部测试桩80%以上。</li></ul>');
    }
    getHistory();
    getApplyData(); // 加载查看数据
    // 历史信息展示
    $('.show-content').click(function () {
        $('.history-body').show();
    });
    // 历史信息收缩
    $('.hide-content').click(function () {
        $('.history-body').hide();
    });
});

/**
 * @desc 加载查看数据
 */
function getApplyData() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/report/getById?token=' + token,
        type: 'get',
        data: {
            'objectId': applyId,
            'reportType': reportType
        },
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows;
                $("#reportName").html(data.reportName);
                $("#enterpriseName").html(data.enterpriseName);
                $("#year").html(data.year);
                if (data.reportType == 1) {
                    $("#reportType").html('阴保有效性报告');
                } else {
                    $("#reportType").html('阴保完整性报告');
                }
                $("#applyStatus").html(convertApplyStatus(data.applyStatus));
                $("#applyUserName").html(data.applyUserName);
                $("#applyTime").html(data.applyTime);
                if (returnInfo != null && returnInfo != "") {
                    $("#reason").show();
                    $("#opinion").val(returnInfo);
                }
                var pipeArr = data.pipe;
                if (pipeArr.length > 0) {
                    getTree(reportType, pipeArr);
                }
            } else {
                layer.alert("加载数据出错！", {
                    title: '提示',
                    skin: "self-alert"
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: '提示',
                skin: "self-alert"
            });

        }
    });
}

/**
 * @desc 获取企业管线/阴保分段树数据
 * @param {string} reportType 1.阴保有效性报告 2.阴保完整性报告
 * @param {array} pipeArr	管线数组
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
                plugins: ["types", "sort"]
            })
            .on('loaded.jstree', function (e, data) {
                var inst = data.instance;
                //默认展开全部节点 
                inst.open_all();
            });
    }
}

/**
 * @desc 加载历史数据
 */
function getHistory() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/report/getAuditHistory?token=' + token,
        type: 'get',
        data: {
            'reportId': applyId,
            "havaFile": false
        },
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows;
                if (data.length > 0) {
                    returnInfo = data[0].opinion;
                    var li_str = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].operateTime != null) {
                            li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
                            var roleName = getOperatorRole(data[i].action);
                            if (data[i].action == '1') {
                                li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>退回申请</span></div></li>';
                                continue;
                            }
                            if (data[i].action == '4') {
                                li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>退回报告</span></div></li>';
                                continue;
                            }
                            li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>' + convertApplyStatus(data[i].action) + '</span></div></li>';
                        }
                    }
                }
                $(".history-body").html(li_str);
            } else {
                layer.alert('加载数据出错！', {
                    title: '提示',
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: '提示',
                skin: 'self-alert'
            });
        }
    })
}
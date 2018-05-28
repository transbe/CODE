/**
 * @file
 * @author: zhangyi
 * @desc 查看申请js
 * @date: 2017-05-20
 * @last modified by: zhangyi
 * @last modified time: 2017-06-12 18:21:51
 */

var reportId = getParameter('objectId'); //报告id
var reportType = getParameter('reportType'); //报告区分字段：1有效性报告，2完整性报告
var token = lsObj.getLocalStorage("token");
var expertId = ""; // 专家ID
var returnInfo = ""; // 退回信息/补充信息

$(function() {
    changePageStyle("../../../../src");

    $('.panel-heading').on('click', function() {
        $(this).siblings('.panel-body').toggleClass('panel-body-close');
    });

    if (reportType == 1) {
        $("#pipeName").html(getLanguageValue("Company_Hierarchy"));
        $('#verificationResult').html('<ul style="list-style:none;"><li>' + getLanguageValue("Note1") + '</li></ul>');
    } else {
        $("#pipeName").html(getLanguageValue("CPS_Schematic"));
        $('#verificationResult').html('<ol><li>' + getLanguageValue("Note2") + '</li><li>' + getLanguageValue("Note3") + '</li><li>' + getLanguageValue("Note4") + '</li><li>' + getLanguageValue("Note5") + '</li><li>' + getLanguageValue("Note6") + '</li></ol>');
    }
    getHistory();
    getApplyData();

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
 */
function getApplyData() {
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/report/getById?token=' + token),
        type: 'get',
        dataType: 'json',
        data: {
            "objectId": reportId,
            "reportType": reportType
        },
        success: function(successResult) {
            if (successResult.success == 1) {
                var data = successResult.rows;
                if (data != null) {
                    expertId = data.expertId;
                    $("#reportName").html(data.reportName);
                    $("#expertName").html(data.expertName);
                    $("#year").html(data.year);
                    if (data.reportType == 1) {
                        $("#reportType").html(getLanguageValue("CP_Efficiency_Report"));
                    } else {
                        $("#reportType").html(getLanguageValue("CP_Integrity_Report"));
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
                layer.alert(getLanguageValue("fail_load"), {
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

/**
 * @desc 获取企业管线/阴保分段树数据
 * @param {string} reportType
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
            });
    }
}

/**
 * @desc 获取历史信息
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
        success: function(successResult) {
            if (successResult.success == 1) {
                var data = successResult.rows;
                if (data.length > 0) {
                    var li_str = "";
                    if (data[0].action != 3) {
                        returnInfo = data[0].opinion;
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].operateTime != null) {
                            li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
                            var roleName = getOperatorRole(data[i].action);
                            if (data[i].action == '1') {
                                li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>' + getLanguageValue("Return_application") + '</span></div></li>';
                                continue;
                            }
                            if (data[i].action == '4') {
                                li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>' + getLanguageValue("Return_report") + '</span></div></li>';
                                continue;
                            }
                            li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>' + convertApplyStatus(data[i].action) + '</span></div></li>';
                        }
                    }
                }
                $(".history-body").html(li_str);
            } else {
                parent.layer.alert(getLanguageValue("Load_data_error"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
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
    parent.layer.open({
        type: 2,
        title: [getLanguageValue("expert_information")],
        skin: 'self-iframe',
        btn: [getLanguageValue("cancle")],
        area: ['450px', '350px'],
        maxmin: false,
        content: '/src/html/expert_and_report/report/expert_info.html?expertId=' + expertId
    });
}
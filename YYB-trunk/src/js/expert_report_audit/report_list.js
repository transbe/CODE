/**
 * @file
 * @author: zhangyi
 * @desc: 文件网格化展示
 * @date：2017-05-12
 * @last modified by: zhangyi
 * @last modified time: 2017-06-12 19:59:36
 */

var applyId = getParameter("objectId"); // 申请ID
var reportType = getParameter("reportType"); // 申请ID
var currentPageNum = ""; // 当前页码
var currentPageSize = ""; // 当前条数

$(function () {
    changePageStyle("../../../src");
    loadTable();
});


/**
 * @desc 获取文件列表
 */
function loadTable() {
    $("#reportTable").bootstrapTable({
        url: '/cloudlink-core-file/attachment/getFileInfoListByBizIdAndBizAttr?businessId=' + applyId + '&bizType=doc',
        toolbar: "#toolbar",
        queryParams: function (params) {
            currentPageNum = this.pageNumber;
            currentPageSize = params.limit;
            params.pageSize = params.limit; //页面大小
            params.pageNum = this.pageNumber; //当前页码
            return params;
        },
        columns: [{
            checkbox: true,
        }, {
            field: 'objectId',
            title: 'objectId',
            visible: false,
        }, {
            title: '序号',
            formatter: function (value, row, index) {
                return (currentPageNum - 1) * currentPageSize + index + 1;
            }
        }, {
            field: 'fileDisplayName',
            title: '报告名称',
            width: '60%'
        }, {
            field: 'createTimeStr',
            title: '上传时间',
            class: 'td-nowrap',
            width: '30%'
        }, {
            field: 'operation',
            title: '操作',
            width: "10%",
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#" id="viewApplicationTable" title="预览" onclick="viewReport(\'' + row.objectId + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                var f = '<a href="#" mce_href="#" id="viewApplicationTable" title="下载" onclick="exportSingle(\'' + row.objectId + '\')"><span class="glyphicon glyphicon-share"></span></a> ';
                return e + f;
            }
        }],
        onDblClickRow: function (row) {
            viewReport(row.objectId);
        },
        responseHandler: function (res) {
            if (res.success == 1) {
                return res;
            } else {
                layer.alert('加载数据出错！', {
                    title: '提示',
                    skin: 'self-alert'
                })
            }
        }
    });
}

/**
 * @desc 操作列下载单个文件
 * @param {string} objectId 
 */
function exportSingle(objectId) {
    var url = "/cloudlink-core-file/attachment/downLoadOneFile?fileId=" + objectId;
    $("#exportIframe").attr('src', url);
}

/**
 * @desc 下载选中/下载全部
 * @param {string} exportFlag  'all'表示下载全部
 */
function exportData(exportFlag) {
    var rows = "";
    var _objectId = "";
    if (exportFlag == "all") {
        uncheck('exportAll');
        rows = $('#reportTable').bootstrapTable('getData', true);
        if (rows.length < 1) {
            layer.alert('没有可下载的文件！', {
                title: '提示',
                skin: 'self-alert'
            });
            return;
        }
    } else {
        uncheck('exportSelect');
        rows = $("#reportTable").bootstrapTable('getSelections');
        if (rows.length < 1) {
            layer.alert('请至少选择一条数据！', {
                title: '提示',
                skin: 'self-alert'
            });
            return;
        }
    }
    for (var i = 0; i < rows.length; i++) {
        if (i == rows.length - 1) {
            _objectId += rows[i].objectId;
        } else {
            _objectId += rows[i].objectId + ",";
        }
    }
    // post请求获取文件
    var url = '/cloudlink-core-file/attachment/downLoadMultiFile';
    var zipFileName = '补充数据'; //补充数据
    var data = {
        'idList': _objectId,
        'zipFileName': zipFileName
    };
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function (response, status, request) {
            var disp = request.getResponseHeader('Content-Disposition');
            if (disp && disp.search('attachment') != -1) {
                var form = $('<form method="POST" action="' + url + '">');
                $.each(data, function (k, v) {
                    form.append($('<input type="hidden" name="' + k + '" value="' + v + '">'));
                });
                $('#exportIframe').append(form);
                form.submit(); // 自动提交
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });

        }
    });
}

/**
 * @desc 预览报告
 * @param {string} objectId 
 */
function viewReport(objectId) {
    parent.layer.open({
        type: 2,
        title: ['查看报告'],
        skin: 'self-iframe',
        area: ['800px', '600px'],
        btn: ['关闭'],
        content: ['src/html/expert_report_audit/view_report.html?fileId=' + objectId + "&layerWidth=800&layerHeight=600&reportType=" + reportType, 'no']
    });
}
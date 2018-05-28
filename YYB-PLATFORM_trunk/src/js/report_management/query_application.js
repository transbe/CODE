/**
 * @file
 * @author: zhangyi
 * @desc: 报告信息网格化展示
 * @date：2017-05-12
 * @last modified by: zhangyi
 * @last modified time: 2017-06-13 09:52:29
 */

var token = lsObj.getLocalStorage("token"); //token
var currentPageNum = 1; // 当前页码
var currentPageSize = ""; //当前展示条数

//报告申请时间
var applyTime;

// 定义申请状态/报告类型
var items = {
    "applyStatus": "",
    "reportType": "",
};

$(function() {

    loadEnterpriseSelect();
    loadExpertSelect();
    $("#year").datetimepicker({
        format: 'yyyy', // 时间格式
        autoclose: true, // 是否自动关闭
        startView: "decade",
        minView: 4
    }).on('changeDate', function(e) {
        $("#reportTable").bootstrapTable('refreshOptions', {
            pageNumber: 1
        });
    });

    //获取从首页跳转过来的参数(报告申请时间)
    var queryTime = getParameter("time");
    var _date = new Date();
    var _year = _date.getFullYear();
    var _month = _date.getMonth() + 1;
    var _today = _date.getDate();
    if (queryTime == "today") {
        applyTime == _year + "-" + _month + "-" + _today;
    } else if (queryTime == "month") {
        applyTime == _year + "-" + _month;
    }

    loadTable();
    setTableHeight("reportTable");

    //点击申请状态
    $('#applyStatus .item').click(function() {
        var $parent = $('#applyStatus');
        $parent.find(".item").removeClass('focus');
        $(this).addClass('focus');
        items.applyStatus = $(this).attr("value");
        $('#reportTable').bootstrapTable('refreshOptions', {
            pageNumber: 1
        });
    });

    //点击报告类型
    $('#reportType .item').click(function() {
        var $parent = $('#reportType');
        $parent.find(".item").removeClass('focus');
        $(this).addClass('focus');
        items.reportType = $(this).attr("value");
        $('#reportTable').bootstrapTable('refreshOptions', {
            pageNumber: 1
        });
    });

    // 下拉选查询
    $("select").change(function() {
        $("#reportTable").bootstrapTable('refreshOptions', {
            pageNumber: 1
        })
    });

    // 查询按钮
    $('#searchBtn').click(function() {
        $('#reportTable').bootstrapTable('refreshOptions', {
            pageNumber: 1
        });
        uncheck("searchBtn");
    });

    //  重置按钮       
    $("#resetBtn").click(function() {
        //将搜索框里面的内容清空
        $("#reportName").val("");
        $("#year").val('');
        $("#expertName").selectpicker('val', '');
        $("#expertName").selectpicker('refresh');
        $("#enterpriseName").selectpicker('val', '');
        $("#enterpriseName").selectpicker('refresh');
        // 审核状态&&报告类型 样式重置
        $('#applyStatus').find(".item").removeClass('focus');
        $($('#applyStatus .item')[0]).addClass('focus')
        $('#reportType').find(".item").removeClass('focus');
        $($('#reportType .item')[0]).addClass('focus');
        // 审核状态&&报告类型 传值重置
        items.applyStatus = "";
        items.reportType = "";
        $('#reportTable').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: '',
            sortOrder: ''
        });
        uncheck("resetBtn");
    });

    // 回车查询
    $("#searchForm").keydown(function(e) {
        if (e.keyCode == "13") {
            $('#reportTable').bootstrapTable('refreshOptions', {
                pageNumber: 1
            });
        }
    });

});

/**
 * @desc 加载网格数据
 */
function loadTable() {
    $("#reportTable").bootstrapTable({
        url: '/cloudlink-corrosionengineer/report/queryApplyForPage?token=' + token + "&roleType=1",
        toolbar: '#toolbar',
        queryParams: function(params) {
            currentPageNum = this.pageNumber;
            currentPageSize = params.limit;

            params.pageSize = params.limit;
            params.pageNum = this.pageNumber;
            params.sortName = this.sortName;
            params.sortOrder = this.sortOrder;
            params.applyStatus = items.applyStatus;
            params.reportType = items.reportType;
            params.reportName = $("#reportName").val();
            params.enterpriseId = $("#enterpriseName").selectpicker().val();
            params.expertId = $("#expertName").selectpicker().val();
            params.year = $("#year").val();

            params.applyTime = applyTime;
            return params;
        },
        columns: [{
            checkbox: true
        }, {
            field: 'objectId',
            visible: false
        }, {
            title: '序号',
            formatter: function(value, row, index) {
                return (currentPageNum - 1) * currentPageSize + index + 1;
            }
        }, {
            field: 'reportName',
            title: '报告名称',
            sortable: true,
            width: '20%'
        }, {
            field: 'reportType',
            title: '报告类型',
            sortable: true,
            width: '12%',
            formatter: function(value, row, index) {
                if (value == 1) {
                    return "阴保有效性报告";
                }
                return "阴保完整性报告";
            }
        }, {
            field: 'enterpriseName',
            title: '企业名称',
            sortable: true,
            width: '20%'
        }, {
            field: 'expertName',
            title: '专家姓名',
            sortable: true,
            width: '10%'
        }, {
            field: 'applyStatus',
            title: '审核状态',
            sortable: true,
            width: '10%',
            formatter: function(value, row) {
                return convertApplyStatus(value);
            }
        }, {
            field: 'applyUserName',
            title: '申请人',
            width: '10%',
            sortable: true
        }, {
            field: 'applyTime',
            title: '申请时间',
            sortable: true,
            width: '12%',
            class: 'td-nowrap',
            formatter: function(value, row, index) {
                return (row.applyTime).split(' ')[0];
            }
        }, {
            title: '操作',
            width: '6%',
            formatter: function(value, row, index) {
                var b = "";
                var a = '<a href="#" title="查看申请" onclick="viewApplication(\'' + row.objectId + '\',\'' + row.reportType + '\')"><span class="glyphicon glyphicon-eye-open"></span></a>';
                if (row.applyStatus == 4 || row.applyStatus == 3 || row.applyStatus == 5) {
                    b = '<a href="#" title="查看报告" onclick="viewReport(\'' + row.objectId + '\',\'' + row.applyStatus + '\',\'' + row.fileId + '\')"><span class="fa fa-file-pdf-o"></span></a>';
                } else {
                    b = '<a href="#"><span class="glyphicon glyphicon-eye-open" style="visibility:hidden"></span></a>';
                }
                return a + b;
            }
        }],
        onDblClickRow: function(row) {
            viewApplication(row.objectId, row.reportType);
        },
        responseHandler: function(res) {
            if (res.success == 1) {
                return res;
            } else {
                layer.alert('加载数据出错！', {
                    title: '提示',
                    skin: 'self-alert'
                });
                return [];
            }
        }
    });
}

/**
 * @desc 查看申请
 * @param {string} objectId
 * @param {string} reportType 1.阴保有效性报告 2.阴保完整性报告
 */
function viewApplication(objectId, reportType) {
    var _objectId = "";
    var rows = $("#reportTable").bootstrapTable('getSelections');
    if (isNull(objectId) == false) {
        _objectId = objectId;
    } else if (rows.length == 1) {
        _objectId = rows[0].objectId;
        reportType = rows[0].reportType;
    } else {
        layer.alert("请选择一条数据！", {
            title: '提示',
            skin: 'self-alert'
        });
        return;
    }
    parent.layer.open({
        type: 2,
        title: '查看申请',
        area: ['950px', '600px'],
        btn: ['关闭'],
        content: 'src/html/report_management/view_application.html?applyId=' + _objectId + "&reportType=" + reportType
    });
}

/**
 * @desc 查看报告
 * @param {string} objectId
 * @param {string} applyStatus
 */
function viewReport(objectId, applyStatus, fileId) {
    var _objectId = "";
    var rows = $("#reportTable").bootstrapTable('getSelections');
    if (isNull(objectId) == false) {
        _objectId = objectId;
    } else if (rows.length == 1) {
        _objectId = rows[0].objectId;
        applyStatus = rows[0].applyStatus;
        fileId = rows[0].fileId
    } else {
        layer.alert("请选择一条数据！", {
            title: '提示',
            skin: 'self-alert'
        });
        return;
    }
    if (applyStatus != 4 && applyStatus != 3 && applyStatus != 5) {
        layer.alert("没有报告可以查看！", {
            title: '提示',
            skin: 'self-alert'
        });
        return;
    }
    parent.layer.open({
        type: 2,
        title: '查看报告',
        area: ['800px', '600px'],
        btn: ['关闭'],
        content: ['src/html/report_management/view_report.html?applyId=' + _objectId + "&fileId=" + fileId + "&layerWidth=800&layerHeight=600", 'no']
    });
}

/**
 * @desc 加载企业名称下拉框
 */
function loadEnterpriseSelect() {
    $.ajax({
        url: '/cloudlink-core-framework/enterprise/getListByApp?token=' + token + '&appId=' + appId + '&pageSize=-1',
        dataType: "json",
        type: 'get',
        success: function(result) {
            if (result.success == 1) {
                var data = result.rows;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].objectId + "'>" + data[i].enterpriseName + "</option>"
                }
                $("#enterpriseName").html(options);
                $("#enterpriseName").selectpicker('refresh');
            } else {
                layer.alert("加载企业名称下拉框出错！", {
                    title: '提示',
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(SELECT_ERROR_MSG, {
                title: '提示',
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 加载服务专家下拉框
 */
function loadExpertSelect() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/common/getExpertsListForSelect?accountStatus=1&token=' + token,
        dataType: "json",
        type: 'get',
        success: function(result) {
            if (result.success == 1) {
                var data = result.expertList;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#expertName").html(options);
                $("#expertName").selectpicker('refresh');
            } else {
                layer.alert("加载服务专家下拉框出错！", {
                    title: '提示',
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(SELECT_ERROR_MSG, {
                title: '提示',
                skin: 'self-alert'
            });
        }
    });
}
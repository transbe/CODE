/**
 * @file 
 * @author: rongfeiyu
 * @desc: 查看专家信息
 * @Date: 2017-05-22 11:24:05
 * @Last Modified by: rongfeiyu
 * @Last Modified time: 2017-06-12 11:24:11
 */

var expertID = getParameter("objectId"); //专家ID
var status = getParameter("status"); //专家账号状态
var token = lsObj.getLocalStorage('token');
var auditCountCharts, reportsCountCharts; //审核报告饼图
var firstReportOptions = {}, //审核报告申请状态饼图
    secondReportOptions = {}; //审核报告报告完整性与有效性饼图
var qualificationPageNum, qualificationPageSize, servicePageNum, servicePageSize, reportPageNum, reportPageSize; //table表格序号
var items = { // 定义各种状态的值
    "serviceStatus": "", //服务状态
    "effectivenessStatus": "", //报告完成状态
    "reportStatus": "" //报告申请状态
}

/**
 * @desc 初始化函数
 */
$(function() {
    selectQueryCondition(); //查询头部的查询状态（改变状态、输入、重置）
    getExpertData(); // 获取专家信息
    getQualificationInfo(); // 加载专家资质
    getReportStatistic(); //获取审核报告统计信息
    getServiceEnterprise(); //获取服务企业信息
    getAppraisalReport(); //获取审核报告信息

    // 回车键搜索
    $("#serviceSearchInput").keydown(function(e) {
        if (e.keyCode == 13) {
            $('#serviceEnterpriseTable').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
        }
    });
    $("#reportSearchInput").keydown(function(e) {
        if (e.keyCode == 13) {
            $('#auditReportTable').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
        }
    });
    $('.panel-heading').on('click', function() {
        $(this).siblings('.panel-body').toggleClass('panel-body-close');
    });
    $(".nav-tabs").on("click", "li", function() { //点击tab标签触发事件
        if ($(this).index() > 0) {
            setTimeout(function() {
                var tableId = $(".tab-content").find('div.active').attr("id"); //获取选中的tab面板的 Id
                setLayerHeightTable(tableId + 'Table'); //设置table表格高度
            }, 5);
        }
    });
    $(window).on('resize', function() { //窗口大小改变时触发table窗口设置高度
        var tableId = $(".tab-content").find('div.active').attr("id"); //获取选中的tab面板的 Id
        setLayerHeightTable(tableId + 'Table'); //设置table表格高度
        $(".nav-tabs").click(function() {
            setTimeout(function() {
                var tableId = $(".tab-content").find('div.active').attr("id"); //获取选中的tab面板的 Id
                setLayerHeightTable(tableId + 'Table'); //设置table表格高度
            }, 5);
        });
    });
});


/**
 * @desc 查询头部的查询状态（改变状态、输入框、重置）
 */
function selectQueryCondition() {
    //点击服务企业的时候刷新页面
    $('.service-type .item').click(function() {
        var $parent = $('.service-type');
        $parent.find(".item").removeClass('active');
        $(this).addClass('active');
        items.serviceStatus = $(this).attr("data-value");
        $('#serviceEnterpriseTable').bootstrapTable('refreshOptions', { pageNumber: 1 });
    });

    //点击审核报告有效性状态的时候刷新页面
    $('.effectiveness-type .item').click(function() {
        var $parent = $('.effectiveness-type');
        $parent.find(".item").removeClass('active');
        $(this).addClass('active');
        items.effectivenessStatus = $(this).attr("data-value");
        $('#auditReportTable').bootstrapTable('refreshOptions', { pageNumber: 1 });
    });

    //点击报告申请状态的时候刷新页面
    $('.reportstatus-type .item').click(function() {
        var $parent = $('.reportstatus-type');
        $parent.find(".item").removeClass('active');
        $(this).addClass('active');
        items.reportStatus = $(this).attr("data-value");
        $('#auditReportTable').bootstrapTable('refreshOptions', { pageNumber: 1 });
    });

    // 点击确定的时候实现搜索
    $('#serviceSearch').click(function() {
        $('#serviceEnterpriseTable').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
    });
    // 点击确定的时候实现搜索
    $('#reportSearch').click(function() {
        $('#auditReportTable').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
    });

    //  重置按钮       
    $("#searchServiceReset").click(function() {
        $(".serviceSearchInput").val(""); //将搜索框里面的内容清空
        // 服务状态 样式重置
        $('.service-type').find(".item").removeClass('active');
        $($('.service-type .item')[0]).addClass('active');
        // 服务状态 传值重置
        items.serviceStatus = "";
        $('#serviceEnterpriseTable').bootstrapTable('refreshOptions', { pageNumber: 1 });
    });
    $("#searchReportReset").click(function() {
        $(".reportSearchInput").val(""); //将搜索框里面的内容清空
        // 审核报告 样式重置
        $('.effectiveness-type').find(".item").removeClass('active');
        $($('.effectiveness-type .item')[0]).addClass('active');
        $('.reportstatus-type').find(".item").removeClass('active');
        $($('.reportstatus-type .item')[0]).addClass('active');
        // 审核报告 传值重置
        items.effectivenessStatus = "";
        items.reportStatus = "";
        $('#auditReportTable').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
    });
}

/**
 * @desc 设置服务企业、审核报告table表格的高度
 * @param {*String} tableId
 */
function setLayerHeightTable(tableId) {
    var contentH;
    var winH = $(window).height(),
        navTabs = $('.nav-tabs').outerHeight(true),
        bodyPaddingTop = parseInt($(".content-box").css("paddingTop")),
        bodyPaddingBottom = parseInt($(".content-box").css("paddingBottom")),
        headMarginTop = parseInt($(".content-header").css('marginTop')),
        headMarginBottom = parseInt($(".content-header").css('marginBottom')),
        contentPaddingTop = parseInt($(".content-body").css('paddingTop')),
        contenterPaddingTop = parseInt($(".container").css('paddingTop')),
        contentPaddingBottom = parseInt($(".content-body").css('paddingBottom'));
    setTimeout(function() {
        var enterpriseContentH = $('#serviceEnterprise .content-header').outerHeight(true),
            reportContentH = $('#auditReport .content-header').outerHeight(true);
        if (tableId === 'serviceEnterpriseTable') {
            contentH = winH - (bodyPaddingTop + bodyPaddingBottom) - enterpriseContentH - navTabs - contenterPaddingTop - (contentPaddingTop + contentPaddingBottom) - 44;
        } else {
            contentH = winH - (bodyPaddingTop + bodyPaddingBottom) - reportContentH - navTabs - contenterPaddingTop - (contentPaddingTop + contentPaddingBottom) - 44;
        }
        $("#" + tableId).bootstrapTable("resetView", {
            height: contentH
        });
        $("#" + tableId).bootstrapTable("resetWidth"); //对齐表格与表头的宽度
    }, 5);
}

/**
 * @desc 获取专家信息
 */
function getExpertData() {
    $.get("/cloudlink-core-framework/user/getById", {
        'token': token,
        'objectId': expertID,
        'enterpriseId': ZYAXenterpriseId,
        'appId': appId
    }, function(result, status) {
        if (result.success == 1) {
            //加载专家信息
            var data = result.rows[0];
            $("#userName").html(data.userName); // 专家姓名
            $("#age").html(data.age); // 专家年龄
            $("#sex").html(data.sex); // 专家性别
            $("#mobileNum").html(data.mobileNum); //专家电话
            $("#roleNames").html(data.roleNames); //专家角色名称
            $("#createTime").html(data.createTime); //注册时间
            $("#position").html(data.position); //职位
            if (data.status == -1) {
                $("#status").html("冻结");
            } else if (data.status == 1) {
                $("#status").html("正常"); // 专家账户状态
            } else if (data.status == 0) {
                $("#status").html("未激活"); // 专家账户状态
            }
            $("#orgName").html(data.orgName); //组织机构名称
            $("#email").html(data.email); //邮箱
            $("#qq").html(data.qq); //QQ
            $("#wechat").html(data.wechat); //微信
        } else {
            layer.alert("加载失败！", {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 加载专家资质
 */
function getQualificationInfo() {
    $(".panel-body #showData").bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryQualification?token=' + token + '&expertId=' + expertID,
        method: 'get',
        queryParams: function(params) {
            qualificationPageNum = this.pageNumber;
            qualificationPageSize = 100;
            params.pageNum = this.pageNumber;
            params.pageSize = 100;
            return params;
        },
        pagination: false, // 底部不显示分页工具栏
        showRefresh: false, // 不显示刷新按钮
        columns: [{
            field: 'objectId',
            title: 'objectId',
            visible: false
        }, {
            title: '序号',
            formatter: function(value, row, index) {
                return (qualificationPageNum - 1) * qualificationPageSize + index + 1;
            }
        }, {
            field: 'qualificationName',
            width: '33.33%',
            title: '资质名称'
        }, {
            field: 'qualificationGrade',
            width: '33.33%',
            title: '资质等级'
        }, {
            field: 'certificateNum',
            width: '33.33%',
            title: '证书编号'
        }],
        onDblClickRow: function(row) {
            // view(row.objectId);
        },
        responseHandler: function(res) {
            if (res.success == 1) {
                var data = {
                    "total": res.qualificationList.length,
                    "rows": res.qualificationList
                }
                return data;
            } else {
                layer.alert("加载数据出错！", {
                    title: "提示",
                    skin: 'self-alert'
                });
                return [];
            }
        },
        onLoadSuccess: function(result) {
            // console.log(JSON.stringify(result))
        }
    });
}

/**
 * @desc 获取审核报告统计信息
 */
function getReportStatistic() {
    var year = $("#year").val();
    // if (year == "全部") { year = ""; }
    $.ajax({
        url: '/cloudlink-corrosionengineer/expert/queryReportStatistic?&token=' + token + '&expertId=' + expertID + '&year=' + year,
        dataType: 'json',
        type: 'get',
        success: function(result) {
            if (result.success == "1") {
                var data = result.reportStatistic;
                var effectiveCloseReportCount = parseInt(data.effectiveCloseReportCount), //有效性报告关闭的数量
                    effectiveAuditingReportCount = parseInt(data.effectiveAuditingReportCount), //有效性报告审核中的数量
                    effectiveFinishedReportCount = parseInt(data.effectiveFinishedReportCount), //有效性报告审核完成的数量
                    integrityFinishedReportCount = parseInt(data.integrityFinishedReportCount), //完整性报告审核完成的数量
                    integrityAuditingReportCount = parseInt(data.integrityAuditingReportCount), //完整性报告审核中的数量 
                    integrityCloseReportCount = parseInt(data.integrityCloseReportCount), //完整性报告关闭的数量

                    effectiveCount = effectiveCloseReportCount + effectiveAuditingReportCount + effectiveFinishedReportCount, //有效性报告
                    integrityCount = integrityFinishedReportCount + integrityAuditingReportCount + integrityCloseReportCount, //完整性报告

                    submittedApplyCount = parseInt(data.submittedApplyCount), //提交的申请总数
                    perfectReportCount = parseInt(data.perfectReportCount), //完善的报告总数
                    submittedReportCount = parseInt(data.submittedReportCount), //专家提交的报告总数
                    modifyReportCount = parseInt(data.modifyReportCount), //需修订的报告总数 
                    finishReport = parseInt(data.finishReportCount), //审核完成的报告数量
                    closeReportCount = parseInt(data.closeReportCount), //关闭的报告总数
                    // auditingReport = submittedApplyCount + perfectReportCount + submittedReportCount + modifyReportCount, //审核中
                    count = effectiveCount + integrityCount; //提交的报告总数 
                $("#countSum").html(count);
                //审核状态饼图
                setFirstReportGraph(submittedApplyCount, perfectReportCount, submittedReportCount, modifyReportCount, finishReport, closeReportCount);
                // 报告完整性、有效性饼图
                setSecondReportGraph(effectiveCount, integrityCount);
            }
        },
        error: function() {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });

        }
    });
}


/**
 * @desc 审核状态饼图
 * @param {*Number} a 
 * @param {*Number} b 
 * @param {*Number} c 
 * @param {*Number} d 
 * @param {*Number} e 
 * @param {*Number} f 
 */
function setFirstReportGraph(a, b, c, d, e, f) {
    auditCountCharts = echarts.init(document.getElementById('auditCount'));
    firstReportOptions = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [{
            name: '审核报告统计信息',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '50%'],
            label: {
                normal: {
                    position: 'outside',
                    textStyle: {
                        fontSize: 13
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data: [{
                    value: a,
                    name: '提交申请',
                    selected: true
                },
                {
                    value: b,
                    name: '完善数据'
                },
                {
                    value: c,
                    name: '提交报告',
                    // labelLine: { normal: { show: true } }
                },
                {
                    value: d,
                    name: '修订报告'
                },
                {
                    value: e,
                    name: '审核完成'
                },
                {
                    value: f,
                    name: '关闭申请'
                }
            ]
        }]
    };
    auditCountCharts.setOption(firstReportOptions, true);
}

/**
 * @desc 审核状态饼图
 * @param {*Number} effectiveCount 
 * @param {*Number} integrityCount 
 */
function setSecondReportGraph(effectiveCount, integrityCount) {
    reportsCountCharts = echarts.init(document.getElementById('reportsCount'));
    secondReportOptions = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [{
            name: '审核报告统计信息',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '50%'],
            label: {
                normal: {
                    position: 'outside',
                    textStyle: {
                        fontSize: 13
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data: [
                { value: effectiveCount, name: '有效性', selected: true, itemStyle: { normal: { color: '#ca8622' } } },
                { value: integrityCount, name: '完整性', itemStyle: { normal: { color: '#bda29a' } } }
            ]
        }]
    };
    reportsCountCharts.setOption(secondReportOptions, true);
}

/**
 * @desc 加载服务企业
 */
function getServiceEnterprise() {
    $("#serviceEnterpriseTable").bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryExpertForEnterprise?token=' + token + '&expertId=' + expertID,
        method: 'get',
        queryParams: function(params) {
            servicePageNum = this.pageNumber;
            servicePageSize = params.limit;
            params.pageNum = this.pageNumber;
            params.pageSize = params.limit;
            params.serviceStatus = items.serviceStatus;
            params.enterpriseName = $(".serviceSearchInput").val(); //搜索框
            return params;
        },
        showRefresh: false, // 不显示刷新按钮
        columns: [{
            field: 'objectId',
            title: 'objectId',
            visible: false
        }, {
            // field: 'qualificationName',
            title: '序号',
            formatter: function(value, row, index) {
                return (servicePageNum - 1) * servicePageSize + index + 1;
            }
        }, {
            field: 'enterpriseName',
            width: '25%',
            title: '企业名称'
        }, {
            field: 'serviceStatus',
            width: '25%',
            title: '服务状态',
            formatter: function(value) {
                if (value == 1) {
                    return "服务中"
                } else {
                    return "服务到期"
                }
            }
        }, {
            field: 'appointTime',
            width: '25%',
            title: '服务起始时间'
        }, {
            field: 'endTime',
            width: '25%',
            title: '服务结束时间',
            formatter: function(value) {
                if (value == null) {
                    return "至今"
                } else {
                    return value
                }
            }
        }],
        onDblClickRow: function(row) {
            // view(row.objectId);
        },
        responseHandler: function(res) {
            if (res.success == 1) {
                // var data = {
                //     "total": res.total,
                //     "rows": res.rows
                // }
                return res;
            } else {
                layer.alert("加载数据出错！", {
                    title: "提示",
                    skin: 'self-alert'
                });
                return [];
            }
        },
        onLoadSuccess: function(result) {}
    });
}


/**
 * @desc 加载审核报告
 */
function getAppraisalReport() {
    $("#auditReportTable").bootstrapTable({
        url: '/cloudlink-corrosionengineer/report/queryApplyForPage?token=' + token + '&roleType=2&expertId=' + expertID,
        method: 'get',
        queryParams: function(params) {
            reportPageNum = this.pageNumber;
            reportPageSize = params.limit;
            params.pageNum = this.pageNumber;
            params.pageSize = params.limit;
            params.reportType = items.effectivenessStatus;
            params.applyStatus = items.reportStatus;
            params.reportName = $(".reportSearchInput").val(); //搜索框
            return params;
        },
        showRefresh: false, // 不显示刷新按钮
        columns: [{
            field: 'objectId',
            title: 'objectId',
            visible: false
        }, {
            title: '序号',
            formatter: function(value, row, index) {
                return (reportPageNum - 1) * reportPageSize + index + 1;
            }
        }, {
            field: 'reportName',
            width: '12.5%',
            title: '报告名称'
        }, {
            field: 'reportType',
            width: '12.5%',
            title: '报告类型', //reportType            
            formatter: function(value) {
                if (value == 1) {
                    return "有效性报告"
                } else if (value == 2) {
                    return "完整性报告"
                }
            }
        }, {
            field: 'applyStatus',
            width: '12.5%',
            title: '审核状态',
            formatter: function(value) {
                if (value == 0) {
                    return "提交申请"
                } else if (value == 1) {
                    return "完善数据"
                } else if (value == 2) {
                    return "关闭申请"
                } else if (value == 3) {
                    return "提交报告"
                } else if (value == 4) {
                    return "修订报告"
                } else {
                    return "验收通过"
                }
            }
        }, {
            field: 'enterpriseName',
            width: '12.5%',
            title: '企业名称'
        }, {
            field: 'applyTime',
            width: '12.5%',
            title: '申请时间'
        }, {
            field: 'duration',
            width: '12.5%',
            title: '审核用时'
        }, {
            field: 'completeTime',
            width: '12.5%',
            title: '审核完成时间'
        }, {
            field: 'operation',
            width: '12.5%',
            title: '操作',
            formatter: function(value, row, index) {
                var b = "";
                var a = '<a href="#" title="查看申请" onclick="viewApplication(\'' + row.objectId + '\',\'' + row.reportType + '\')"><span class="glyphicon glyphicon-eye-open"></span></a>';
                if (row.applyStatus == 3 || row.applyStatus == 4 || row.applyStatus == 5) {
                    b = '<a href="#" title="查看报告" onclick="viewReport(\'' + row.objectId + '\',\'' + row.applyStatus + '\',\'' + row.fileId + '\')"><span class="fa fa-file-pdf-o"></span></a>';
                } else {
                    // b = '<a href="#"><span class="glyphicon glyphicon-eye-open" style="visibility:hidden"></span></a>';
                    b = '<a href="#" title="暂无报告可查看" ><span class="fa fa-file-pdf-o" style = "color:#ccc;"></span></a>';
                }
                return a + b;
            }
        }],
        onDblClickRow: function(row) {
            // viewApplication(row.objectId, row.reportType);
        },
        responseHandler: function(res) {
            if (res.success == 1) {
                // var data = {
                //     "total": res.total,
                //     "rows": res.rows
                // }
                return res;
            } else {
                layer.alert("加载数据出错！", {
                    title: "提示",
                    skin: 'self-alert'
                });
                return [];
            }
        },
        onLoadSuccess: function(result) {}
    });
}


/**
 * @desc 查看申请
 * @param {*String} objectId
 * @param {*String} reportType 1.阴保有效性报告 2.阴保完整性报告
 */
function viewApplication(objectId, reportType) {
    var _objectId = "";
    var rows = $("#reportTable").bootstrapTable('getSelections');
    if (objectId != "" && objectId != null && objectId != undefined) {
        _objectId = objectId;
    } else if (rows.length == 1) {
        _objectId = rows[0].objectId;
        reportType = rows[0].reportType;
    } else {
        layer.alert("请选择一条数据！", {
            title: "提示",
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
 * @param {*String} objectId 
 * @param {*String} applyStatus 
 * @param {*String} fileId 
 */
function viewReport(objectId, applyStatus, fileId) {
    var _objectId = "";
    var rows = $("#reportTable").bootstrapTable('getSelections');
    if (objectId != "" && objectId != null) {
        _objectId = objectId;
    } else if (rows.length == 1) {
        _objectId = rows[0].objectId;
        applyStatus = rows[0].applyStatus;
        fileId = rows[0].fileId
    } else {
        layer.alert("请选择一条数据！", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    if (applyStatus != 4 && applyStatus != 3 && applyStatus != 5) {
        layer.alert("没有报告可以查看！", {
            title: "提示",
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
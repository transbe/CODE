/**  
 * @file
 * @author: lujingrui
 * @desc: 专家服务企业相关
 * @date: 2017-05-04
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:26:17
 */

var token;
var expertId; //专家id
//用于生成序号
var currentPage; //当前页
var currentPageSize; //当前页页面大小

/**
 * @desc 初始化方法
 */
$(function () {
    changePageStyle("../..");
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    token = lsObj.getLocalStorage("token")
    expertId = userBo.objectId;

    //获取从前台页面跳转过来的数据
    var status = getParameter("status");
    if (status == 1) { //服务中
        $(".service-status .btn-default").removeClass("focus");
        $(".service-status .btn-default[value=1]").addClass("focus");
    }

    loadTable();
    setTableHeight('tbEnterprise');

    addEvent(); //添加监听事件
});

/**
 * @desc 添加监听事件
 * @method addEvent
 */
function addEvent() {
    //控制查询中服务状态显示
    $(".service-status .btn-default").click(
        function () {
            $(".service-status .btn-default").removeClass("focus");
            $(this).addClass("focus");
            $("#tbEnterprise").bootstrapTable('refresh', true);
        }
    );

    //查询
    $("#query").click(function click() {
        $("#tbEnterprise").bootstrapTable('refresh', true);
    });

    //重置查询条件
    $("#clear").click(function () {
        $(".service-status .btn-default").removeClass("focus");
        $(".service-status .btn-default:first-child").addClass("focus");
        document.getElementById("searchForm").reset();
        $("#tbEnterprise").bootstrapTable("refreshOptions", {
            "pageNumber": 1,
            "sortName": "",
            "sortOrder": ""
        })
    });

    //input按enter刷新页面
    $("#searchForm").on("keydown", function (event) {
        if (event.keyCode == "13") {
            $("#tbEnterprise").bootstrapTable("refreshOptions", {
                "pageNumber": 1,
                "sortName": "",
                "sortOrder": ""
            })
        }
    });
}

/**
 * @desc 加载企业信息table
 * @method loadTable
 */
function loadTable() {
    $("#tbEnterprise").bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryExpertForEnterprise?token=' + token + '&roleType=2', //请求后台的URL（*）
        // url:"data.json",
        method: "get", //请求方式（*）
        queryParams: function (params) {
            //applyStatus  reportType reportName expertName enterpriseId year
            params.pageSize = params.limit; //页面大小
            params.pageNum = this.pageNumber; //当前页码
            params.sortName = this.sortName, //排序字段
            params.sortOrder = this.sortOrder, //排序方式
            currentPage = this.pageNumber - 1;
            currentPageSize = params.limit;

            params.expertId = expertId;
            params.serviceStatus = $(".service-status .focus").attr("value");
            params.enterpriseName = $('#enterpriseName').val();
            return params;
        },
        toolbar: "#toolbar",
        columns: [{
            checkbox: true,
        }, {
            field: 'sequence',
            title: '序号',
            align: 'center',
            formatter: function (value, row, index) {
                return currentPageSize * currentPage + index + 1;
            }
        }, {
            field: 'enterpriseName',
            sortable: true,
            title: '企业名称',
            align: 'center',
            width:"26%"
        }, {
            field: 'serviceStatus',
            title: '服务状态',
            align: 'center',
            width:"20%",
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "服务中";
                } else {
                    return "服务到期";
                }
            }
        }, {
            field: 'appointTime',
            sortable: true,
            title: '服务起始时间',
            align: 'center',
            class:"td-nowrap",
            width:"22%"
        }, {
            field: 'endTime',
            sortable: true,
            title: '服务结束时间',
            align: 'center',
            width:"22%",
            class:"td-nowrap",
            formatter: function (value, row, index) {
                if (value != null) {
                    return value;
                } else if (row.serviceStatus == 1) {
                    return "至今";
                }
            }
        }, {
            field: 'operation',
            title: '操作',
            align: 'center',
            width:"10%",
            formatter: function (value, row, index) {
                var e = '<a href="#" mce_href="#" title="查看企业数据" onclick="viewEnterpriseData(\'' + row.enterpriseId + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                var f = '<a href="#" mce_href="#" title="查看企业数据"><span class="glyphicon glyphicon-eye-open" style="cursor:not-allowed;color:#ccc;"></span></a> ';
                if (row.serviceStatus == 1) {
                    return e;
                } else {
                    return f;
                }
            }
        }],
        onDblClickRow: function (row) {
            if (row.serviceStatus == 1) {
                viewEnterpriseData(row.enterpriseId);
            } else {
                layer.confirm("该企业服务已到期", {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
            }
        },
        //加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。                
        responseHandler: function (res) {
            if (res.success == 1) {
                return res;
            } else {
                layer.confirm("加载数据出错", {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
            }
            return {
                "rows": [],
                "total": 0
            }

        },
        onLoadSuccess: function (res) {

        }
    });
}

/**
 * @desc 点击工具栏按钮查看企业数据
 * @method viewApplyByToolbar
 */
function viewApplyByToolbar() {
    var rows = $('#tbEnterprise').bootstrapTable('getSelections');
    if (rows.length != 1) {
        layer.confirm('请选中一条记录！', {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return;
    } else {
        if (rows[0].serviceStatus == 1) {
            var enterpriseId = rows[0].enterpriseId;
            viewEnterpriseData(enterpriseId);
        } else {
            layer.confirm('该企业服务已到期！', {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
        }
    }
}

/**
 * @desc 查看企业数据
 * @method viewEnterpriseData
 * @param {string} token 
 * @param {string} enterpriseId 企业id
 */
function viewEnterpriseData(enterpriseId) {
    openWindowURL(enterpriseId);
}
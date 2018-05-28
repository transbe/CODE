/**
 * @author: rongfeiyu
 * @Date: 2017-5-22
 * @Last Modified by: 
 * @Last Modified time: 
 * @file 我的服务专家的js
 */

var currentPageNum = 1; // 当前页码
var currentPageSize = ""; //当前展示条数
var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));

$(function() {
    loadTable(); // 初始化表格
    setTableHeight('table'); //表格部分滚动条的实现
    loadExpertSelect(); //加载专家下拉框
    getSelectedExpert(); //搜索选中的专家
});


/**
 * @desc 表格初始化
 * @method loadTable
 */
function loadTable() {
    $('#table').bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryExpertByEnterpriseId?token=' + lsObj.getLocalStorage('token') + '&enterpriseId=' + userBo.enterpriseId,
        method: 'get', //请求方式（*）
        toolbar: '#toolbar',
        pageSize: 10,
        queryParams: function(params) {
            currentPageNum = this.pageNumber;
            currentPageSize = params.limit;
            params.pageNum = this.pageNumber; //当前页码
            params.pageSize = params.limit; //页面大小
            params.expertId = $("#expertName").val(); //搜索框
            return params;
        },
        sidePagination: 'client',
        uniqueId: "objectId", // 每一行的唯一标识，一般为主键列
        clickToSelect: true, //点击行即可选中单选/复选框  
        columns: [{
                checkbox: true,
            }, {
                field: 'expertId',
                title: 'expertId',
                visible: false
            },
            {
                title: '序号',
                formatter: function(value, row, index) {
                    return (currentPageNum - 1) * currentPageSize + index + 1;
                }
            },
            {
                field: 'expertName',
                title: '专家姓名'
            },
            {
                field: 'qualificationInfo',
                title: '资质名称等级'
            },
            {
                field: 'appointTime',
                title: '服务开始时间',
            },
            {
                field: 'operation',
                title: '操作',
                formatter: function(value, row, index) {
                    var res = "<a href='#'><i class='glyphicon glyphicon-eye-open' title='查看信息' onclick=\"getExpertInfo('" + row.expertId + "')\"></i></a>";
                    return res;
                }
            }
        ],
        onDblClickRow: function(row) {
            getExpertInfo(row.expertId);
        },
        onLoadSuccess: function(res) {},
        onPageChange: function(number, size) {},
        responseHandler: function(res) { //设置边框底部页码
            if (res.success == 1) {
                return res.expertList;
            } else {
                layer.confirm("加载数据出错", {
                    btn: ['确定'],
                    skin: 'self'
                });
                return []
            }
        },
    });
}

/**
 * @desc 加载专家下拉框
 * @method loadExpertSelect
 */
function loadExpertSelect() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/common/getExpertsListForSelect?serveEnterpriseId=' + userBo.enterpriseId + '&token=' + lsObj.getLocalStorage('token'),
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
 * @desc 搜索选中的专家
 * @method getSelectedExpert
 */
function getSelectedExpert() {
    $('#table').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
}

/**
 * @desc 查看专家信息
 * @method getExpertInfo
 * @param {*String} objecId
 */
function getExpertInfo(objectId) {
    var rows = $("#table").bootstrapTable('getSelections');
    if (objectId != null) {} else if (rows.length == 1) {
        objectId = rows[0].expertId;
    } else {
        layer.confirm("请选择一条数据", {
            btn: ['确定'],
            skin: 'self'
        });
        return;
    }
    var index = parent.layer.open({
        type: 2,
        title: '专家详细信息',
        area: ['950px', '600px'],
        btn: ["关闭"],
        content: 'src/html/expert_and_report/expert/load_expertInfo.html?objectId=' + objectId
    });
    // parent.layer.full(index);
}
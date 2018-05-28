/**
 * @file 
 * @author: rongfeiyu
 * @desc: 我的服务专家
 * @Date: 2017-05-22 10:49:29
 * @Last Modified by: rongfeiyu
 * @Last Modified time:2017-06-12 11:49:24
 */

var currentPageNum = 1; // 当前页码
var currentPageSize = ""; //当前展示条数
var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));

$(function() {
    changePageStyle("../../.."); // 换肤
    // firstLogin(); // 判断是否是第一次登陆，第一次展示向导


    loadTable(); // 初始化表格
    setTableHeight('table'); //表格部分滚动条的实现
    loadExpertSelect(); //加载专家下拉框
    getSelectedExpert(); //搜索选中的专家
});


/**
 * @desc 表格初始化
 */
function loadTable() {
    $('#table').bootstrapTable({
        url: handleURL('/cloudlink-corrosionengineer/expert/queryExpertByEnterpriseId?token=' + lsObj.getLocalStorage('token') + '&enterpriseId=' + userBo.enterpriseId),
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
                title: getLanguageValue("No"),
                formatter: function(value, row, index) {
                    return (currentPageNum - 1) * currentPageSize + index + 1;
                }
            },
            {
                field: 'expertName',
                width: "20%",
                title: getLanguageValue("Specilist")
            },
            {
                field: 'qualificationInfo',
                width: '35%',
                title: getLanguageValue("Qualifications")
            },
            {
                field: 'appointTime',
                width: '25%',
                title: getLanguageValue("Service_from")
            },
            {
                field: 'operation',
                width: '20%',
                title: getLanguageValue("Action"),
                formatter: function(value, row, index) {
                    var res = "<a href='#'><i class='glyphicon glyphicon-eye-open' title='" + getLanguageValue("View") + "' onclick=\"getExpertInfo('" + row.expertId + "')\"></i></a>";
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
                layer.alert(getLanguageValue("select_one_rows"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                return []
            }
        },
    });
}

/**
 * @desc 加载专家下拉框
 */
function loadExpertSelect() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/common/getExpertsListForSelect?serveEnterpriseId=' + userBo.enterpriseId + '&token=' + lsObj.getLocalStorage('token'),
        dataType: "json",
        type: 'get',
        success: function(result) {
            if (result.success == 1) {
                var data = result.expertList;
                var options = "<option value=''>" + getLanguageValue("Select") + "</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#expertName").html(options);
                $("#expertName").selectpicker('refresh');
            } else {
                layer.alert(SELECT_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        },
        error: function() {
            // console.log(XMLHttpRequest);
            // console.log(textStatus);
            // console.log(errorThrown);
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });

        }
    });
}


/**
 * @desc 搜索选中的专家
 */
function getSelectedExpert() {
    $('#table').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
}

/**
 * @desc 查看专家信息
 * @param {*String} objecId
 */
function getExpertInfo(objectId) {
    var rows = $("#table").bootstrapTable('getSelections');
    if (objectId != null) {} else if (rows.length == 1) {
        objectId = rows[0].expertId;
    } else {
        layer.alert(getLanguageValue("select_one_rows"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    var index = parent.layer.open({
        type: 2,
        skin: 'self-iframe',
        title: getLanguageValue("detailInfo"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("close")],
        content: 'src/html/expert_and_report/expert/load_expertInfo.html?objectId=' + objectId
    });
    // parent.layer.full(index);
}
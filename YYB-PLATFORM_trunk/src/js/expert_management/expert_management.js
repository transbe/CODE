/**
 * @file 
 * @author: rongfeiyu
 * @desc: 专家管理的js
 * @Date: 2017-06-12 09:40:41
 * @Last Modified by: rongfeiyu
 * @Last Modified time: 2017-06-12 09:51:47
 */

var currentPageNum = 1; // 当前页码
var currentPageSize = ""; //当前展示条数
var createTime = "",
    status = "",
    mobileNum = ""; //注册时间,用户状态,手机号码
$(function() {
    // 初始化表格
    loadTable();
    //表格部分滚动条的实现
    setTableHeight('table');
    // 回车键搜索
    $("#searchInput").keydown(function(e) {
        if (e.keyCode == 13) {
            $('#table').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
        }
    });
    // 点击确定的时候实现搜索
    $('#searchBtn').click(function() {
        $('#table').bootstrapTable('refreshOptions', { pageNumber: 1 }); //刷新表格并且把页面设置
    });
    //  重置按钮       
    $("#resetBtn").click(function() {
        $("#searchInput").val(""); //将搜索框里面的内容清空
        createTime = "";
        status = "";
        mobileNum = "";
        $('#table').bootstrapTable('refreshOptions', { pageNumber: 1, sortName: '', sortOrder: '' });
    });
});


/**
 * @desc 表格初始化
 */
function loadTable() {
    $('#table').bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryExpertForPage?token=' + lsObj.getLocalStorage('token'),
        method: 'get', //请求方式（*）
        toolbar: '#toolbar',
        queryParams: function(params) {
            currentPageNum = this.pageNumber;
            currentPageSize = params.limit;

            params.pageNum = this.pageNumber; //当前页码
            params.pageSize = params.limit; //页面大小
            params.expertName = $("#searchInput").val(); //搜索框
            params.status = status;
            params.createTime = createTime;
            params.sortName = this.sortName;
            params.sortOrder = this.sortOrder;
            params.mobileNum = mobileNum;
            return params;
        },
        columns: [{
                checkbox: true,
            }, {
                field: 'objectId',
                title: 'objectId',
                visible: false
            },
            {
                title: '序号',
                formatter: function(value, row, index) {
                    return (currentPageNum - 1) * currentPageSize + index + 1;
                }
            },
            {
                field: 'userName',
                width: '10%',
                title: '专家姓名',
                sortable: true,
                sortName: 'expertName'
            },
            {
                field: 'qualificationInfo',
                width: '22%',
                title: '资质名称等级'

            },
            {
                field: 'serverCount',
                width: '10%',
                title: '服务中企业数量'
            },
            {
                field: 'auditingReportCount',
                width: '10%',
                title: '审核中报告数量'
            },
            {
                field: 'status',
                width: '10%',
                title: '账户状态',
                sortable: true,
                formatter: function(value) {
                    if (value == 1) {
                        return "正常"
                    } else if (value == 0) {
                        return "未激活"
                    } else if (value == -1) {
                        return "冻结"
                    }
                }
            },
            {
                field: 'createTime',
                width: '16%',
                title: '注册时间',
                sortable: true
            },
            {
                field: 'mobileNum',
                width: '10%',
                title: '手机号码',
                sortable: true
            },
            {
                field: 'operation',
                width: '12%',
                title: '操作',
                formatter: function(value, row, index) {
                    var res = "<a href='#'><i class='glyphicon glyphicon-eye-open' title='查看信息' onclick=\"getExpertInfo('" + row.objectId + "')\"></i></a>";
                    if (row.status == 1) {
                        res += "<a href= '#'><i class='fa fa-exclamation-circle'  title='冻结' onclick=\"toggleAccountStatus('" + row.objectId + "','" + row.status + "')\"></i></a>";
                    } else if (row.status == -1) {
                        res += "<a href= '#'><i class='fa fa-exclamation-circle' style = 'color:#ccc' title='解冻' onclick=\"toggleAccountStatus('" + row.objectId + "','" + row.status + "')\"></i></a>";
                    } else {
                        res += "<a href= '#'><i class='fa fa-exclamation-circle' style = 'color:#ccc' title='未激活' onclick=\"toggleAccountStatus('" + row.objectId + "','" + row.status + "')\"></i></a>";
                    }
                    res += "<a href='#'><i class='fa fa-user-times'  title='移除' onclick=\"removeExpert('" + row.objectId + "')\"></i></a>";
                    return res;
                }
            }
        ],
        onDblClickRow: function(row) {
            getExpertInfo(row.objectId);
        },
        onLoadSuccess: function(res) {},
        onPageChange: function(number, size) {},
        responseHandler: function(res) { //设置边框底部页码
            if (res.success == 1) {
                // return {
                //     "rows": res.rows,
                //     "total": res.total
                // }
                return res;
            } else {
                layer.alert("加载数据出错!", {
                    title: "提示",
                    skin: 'self-alert'
                });
                return [];
            }
        },
    });
}


/**
 * @desc 查看专家信息
 * @param {*String} objecId
 */
function getExpertInfo(objectId) {
    var rows = $("#table").bootstrapTable('getSelections');
    if (objectId != null) {} else if (rows.length == 1) {
        objectId = rows[0].objectId;
    } else {
        layer.alert("请选择一条数据!", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    var index = parent.layer.open({
        type: 2,
        title: '查看专家信息',
        area: ['950px', '600px'],
        btn: ["关闭"],
        content: 'src/html/expert_management/load_expertInfo.html?objectId=' + objectId
    });
    // parent.layer.full(index);
}


/**
 * @desc 邀请专家
 */
function inviteExpert() {
    // uncheck("inviteExpert"); //取消按钮选中状态
    parent.layer.open({
        type: 2, //加载的提示风格
        title: '邀请人员',
        btn: ['邀请', '邀请并继续', '取消'],
        area: ['500px', '600px'],
        yes: function(index, layero) {
            var viewObj = layero.find('iframe')[0].contentWindow;
            var inviteFlag = viewObj.inviteExpert();
            if (inviteFlag) {
                layer.msg("邀请成功", {
                    time: MSG_DISPLAY_TIME,
                    skin: 'self-msg'
                });
                $('#table').bootstrapTable('refreshOptions', { pageNumber: 1 });
                parent.layer.close(index);
            }
        },
        btn2: function(index, layero) {
            var viewObj = layero.find('iframe')[0].contentWindow;
            var result = viewObj.inviteExpert();
            if (result) {
                $('#table').bootstrapTable('refreshOptions', { pageNumber: 1 });
            }
            return false;
        },
        btn3: function(index, layero) {},
        content: 'src/html/expert_management/invite_expert.html'
    });
}


/**
 * @desc 专家账户状态冻结/解冻
 * @param {*String} objecId
 * @param {*String} status
 */
function toggleAccountStatus(objectId, status) {
    var accountStatus, url, successMsg;
    var rows = $("#table").bootstrapTable('getSelections');
    if (objectId != null) {
        accountStatus = status;
    } else if (rows.length == 1) {
        objectId = rows[0].objectId;
        accountStatus = rows[0].status;
    } else {
        layer.alert("请选择一条数据!", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    if (accountStatus == 1) {
        url = '/cloudlink-core-framework/user/freezeFromEnterpriseApp?&token=' + lsObj.getLocalStorage('token'); //账户冻结接口
        successMsg = "专家账户冻结成功！";
    } else if (accountStatus == -1) {
        url = '/cloudlink-core-framework/user/unfreezeFromEnterpriseApp?&token=' + lsObj.getLocalStorage('token'); //账户解冻接口
        successMsg = "专家账户解冻成功！";
    } else if (accountStatus == 0) {
        layer.alert("专家账户未激活，无法进行冻结或解冻操作！", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    var _data = {
        "userIds": objectId,
        "enterpriseId": ZYAXenterpriseId,
        "appId": appId
    };
    $.ajax({
        url: url,
        contentType: "application/json",
        data: JSON.stringify(_data),
        type: "post",
        dataType: "json",
        success: function(result) {
            if (result.success == "1") {
                layer.msg(successMsg, {
                    time: MSG_DISPLAY_TIME,
                    skin: 'self-msg'
                });
                $('#table').bootstrapTable('refreshOptions', { pageNumber: currentPageNum });
            } else {
                layer.alert("参数异常！", {
                    title: "提示",
                    skin: 'self-alert'
                });
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
 * @desc 移除专家
 */
function removeExpert(objectId) {
    var rows = $("#table").bootstrapTable('getSelections');
    if (objectId != null) {} else if (rows.length == 1) {
        objectId = rows[0].objectId;
    } else {
        layer.alert("请选择一条数据", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    layer.confirm("确定移除该专家？", {
        btn: ['确定', '取消'],
        skin: 'self',
        yes: function(index, layero) {
            $.ajax({
                url: '/cloudlink-corrosionengineer/expert/hasRelationData?token=' + lsObj.getLocalStorage('token') + '&expertId=' + objectId,
                contentType: "application/json",
                type: "get",
                success: function(result) {
                    if (result.success == "1") {
                        if (result.hasRelation == false) {
                            removeExpertRole(objectId);
                        } else {
                            layer.alert("该专家正在服务相关企业，无法移除！", {
                                title: "提示",
                                skin: 'self-alert'
                            });
                        }
                    } else {
                        layer.alert("参数异常！", {
                            title: "提示",
                            skin: 'self-alert'
                        });
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
    });

}

/**
 * @desc 移除用户在该企业中的专家角色
 */
function removeExpertRole(objectId) {
    var _data = {
        "userId": objectId,
        "enterpriseId": ZYAXenterpriseId,
        "appId": appId,
        "roleIds": expertRoleId
    };
    $.ajax({
        url: '/cloudlink-core-framework/user/removeRoles?token=' + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: JSON.stringify(_data),
        type: "post",
        dataType: "json",
        success: function(result) {
            if (result.success == "1") {
                layer.msg("专家账户移除成功！", {
                    time: MSG_DISPLAY_TIME,
                    skin: 'self-msg'
                });
                $('#table').bootstrapTable('refreshOptions', { pageNumber: currentPageNum });
            } else if (result.code == "PU00000") {
                layer.alert("应用不存在！", {
                    title: "提示",
                    skin: 'self-alert'
                });
            } else {
                layer.alert("参数异常！", {
                    title: "提示",
                    skin: 'self-alert'
                });
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
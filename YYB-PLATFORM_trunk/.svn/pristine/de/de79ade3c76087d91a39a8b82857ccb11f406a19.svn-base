/**
 * @file
 * @author  zhangyi
 * @desc 变更/移除服务专家
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:25:15
 */
var enterpriseId = getParameter("objectId"); //  企业ID
var token = lsObj.getLocalStorage('token'); //获取token值
var enterpriseName = decodeURI(getParameter('enterpriseName')); //企业名称
/**
 * @desc 初始化函数
 */
$(function () {
    $("#enterpriseName").html(enterpriseName);

    // 加载专家列表
    loadTable();
    //获取历史信息
    getHistory();

    //设置历史记录显示
    $(".show-content").click(function () {
        $(".history-body").show();
    });
    //设置历史记录隐藏
    $(".hide-content").click(function () {
        $(".history-body").hide();
    });
});

var expertListName = "";    //定义已选专家变量

/**
 * @desc 网格化服务专家列表
 */
function loadTable() {
    $("#expertTable").bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryExpertForPage?token=' + token + '&status=' + 1 + '&serveEnterpriseId=' + enterpriseId,
        method: 'get',
        responseHandler: responseHandler,
        queryParams: queryParams,
        showRefresh: false,
        columns: [{
            field: 'number',
            title: '序号',
            formatter: function (value, row, index) {
                return (index + 1)
            }
        }, {
            field: 'userName',
            title: '服务专家名称',
            width:"25%"
        }, {
            field: 'serverCount',
            title: '服务中企业数量',
            width:"20%"
        }, {
            field: 'qualificationInfo',
            title: '专家资质等级',
            width:"35%"
        }, {
            title: '操作',
            width:"20%",
            formatter: function (value, row) {
                var res = ""
                if (row.isService == 1) {
                    res += "<a href='#'><i class='fa fa-remove'  title='移除专家服务' onclick=\"setExpertForEnterprise('" + row.objectId + "','0','" + row.userName + "')\"></i></a>";
                    expertListName += row.userName + " ";
                    return res;
                }
                res += "<a href='#'><i class='fa fa-hand-o-up'  title='指派专家服务' onclick=\"setExpertForEnterprise('" + row.objectId + "','1','" + row.userName + "')\"></i></a>";
                return res;

            }
        }],
        onLoadSuccess: function (rows) {
            $("#num").html(rows.total)
            $('#expertNameList').html(expertListName)
        },
    })
}

/**
 * @desc 处理网格化返回的数据
 * @param {*Object} res 服务端获取数据
 * @return {*Object}  含有rows 和 total 属性的对象
 */
function responseHandler(res) {
    if (res.success == 1) {
        return res;
    } else {
        layer.alert("加载数据出错", {
            title:"提示",
            skin: "self-alert"
        });
    }
}

/**
 * @desc 网格化传入参数
 * @param {*Object} params
 * @return {*Object} temp 请求参数对象 
 */
function queryParams(params) {
    var temp = {
        pageSize: params.limit, //页面大小
        pageNum: this.pageNumber,
        expertName: $('#expertName').val()
    }
    return temp
}

/**
 * @desc 移除或者指派专家
 * @param {*String} expertId 
 * @param {*String} flag 0 移除 1 指派
 * @param {*String} userName
 */
function setExpertForEnterprise(expertId, flag, userName) {
    var paramsData = {
        "expertId": expertId,
        "flag": flag,
        "enterpriseId": enterpriseId,
        "enterpriseName": enterpriseName,
        "expertName": userName
    }
    if (flag == 0) {
        var hasRelation = hasRelationData(expertId, enterpriseId);
        if (hasRelation == true) {
            layer.alert('该专家在该企业有未审核完的报告，不能移除！', {
                title: "提示",
                skin: 'self-alert'
            });
            return;
        }
    }
    $.ajax({
        url: '/cloudlink-corrosionengineer/expert/setExpertForEnterprise?token=' + token,
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(paramsData),
        success: function (res) {
            if (res.success == 1) {
                expertListName = ""
                var msg = "移除成功！";
                if (flag == 1) {
                    msg = "指派成功！";
                }
                layer.msg(msg, {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
                $("#expertTable").bootstrapTable("refresh", true);
                getHistory();
            } else {
                layer.alert(msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
}

function hasRelationData(expertId, enterpriseId) {
    var paramsData = {
        "expertId": expertId,
        "serviceEnterpriseId": enterpriseId,
    }
    var flag = false;
    $.ajax({
        url: '/cloudlink-corrosionengineer/expert/hasRelationData?token=' + token + '&expertId=' + expertId + '&serviceEnterpriseId=' + enterpriseId,
        method: 'get',
        async: false,
        success: function (res) {
            if (res.success == 1) {
                if (res.hasRelation == true) {
                    flag = true;
                }
            } else {
                flag = false;
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
    return flag;
}
/**
 * @desc 获取指派历史记录
 */
function getHistory() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/expert/queryExpertHistory?token=' + token + '&serveEnterpriseId=' + enterpriseId,
        method: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                var data = result.expertHistoryList;
                var li_str = "";
                for (var i = 0; i < data.length; i++) {

                    li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
                    li_str += '<div><span>' + data[i].operateTime + '</span><span>' + data[i].operateUserName + '</span>为<span>' + data[i].serveEnterpriseName + '</span>' + data[i].operateType + '服务专家 <span>' + data[i].expertName + '</span></div></li>';
                }
                $(".history-body").html(li_str);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }

    })
}

/**
 * @desc 查询
 */
function queryExpert() {
    $("#expertTable").bootstrapTable("refresh", true)
}

/**
 * @desc 重置查询条件
 */
function clearExpert() {
    $('#expertName').val('');
    expertListName = ""
    $("#expertTable").bootstrapTable("refresh", true)
}
/**  
 * @file
 * @author: lujingrui
 * @desc: 企业认证审核
 * @date: 2017-05-04
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:26:17
 */

var token = "";
//企业id
var objectId = "";
//申请人id
var startUserId = "";
// 任务ID
var taskId = "";

//初始化
$(function () {
    token = lsObj.getLocalStorage('token');
    objectId = getParameter("objectId");
    //获取企业信息
    getEnterpriseInfo();
    //获取任务id，完成后获取认证信息，完成后再获取企业其他基本信息
    getTaskId();
    //获取历史认证信息
    getHistory();
    //获取企业营业执照和身份证照片
    getPhoto();

    //添加监听事件
    addEvent();
});

/**
 * @desc 获取企业基本信息
 */
function getEnterpriseInfo() {
    $.ajax({
        // url: '/cloudlink-core-framework/enterprise/getById?objectId='+objectId+'&token='+token,
        url: '/cloudlink-core-framework/enterprise/getById?objectId=' + objectId + '&token=' + token,
        dataType: 'json',
        type: 'get',
        success: function (result) {
            if (result.success == "1") {
                var data = result.rows[0];
                $("#enterpriseName").html(data.enterpriseName);
                $("#registerNum").html(data.registerNum);
                $("#enterpriseScale").html(data.enterpriseScale);
                $("#telephoneNum").html(data.telephoneNum);
                $("#address").html(data.address);
                $("#registTime").html(data.createTime);
                $("#enpAdminName").html(data.enpAdminName);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取企业其他基本信息
 * @param {string} id 企业认证申请人id
 */
function getOtherInfo(id) {
    $.ajax({
        url: '/cloudlink-core-framework/user/getById?objectId=' + id + '&enterpriseId=' + objectId + '&token=' + token,
        dataType: 'json',
        type: 'get',
        success: function (result) {
            if (result.success == "1") {
                var data = result.rows[0];
                $("#mobileNum").html(data.mobileNum);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取认证信息
 * @param {string} taskId 任务id
 */
function getAuthHistoryById(taskId) {
    $.ajax({
        // url: '/cloudlink-core-framework/enterprise/getById?objectId='+objectId+'&token='+token,
        url: '/cloudlink-core-framework/enterprise/getAuthHistoryById?taskId=' + taskId + '&token=' + token,
        dataType: 'json',
        type: 'get',
        success: function (result) {
            if (result.success == "1") {
                var data = result.rows[0];
                $("#authEnterpriseName").html(data.authEnterpriseName);
                $("#authRegisterNum").html(data.authRegisterNum);
                $("#startUserName").html(data.startUserName);
                $("#startTime").html(data.startTime);
                $("#fromAppName").html(data.fromAppName);
                $("#approveContent").html(data.approveContent);
                //获取企业其他基本信息
                getOtherInfo(data.startUserId);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取图片
 */
function getPhoto() {
    //获取营业执照
    $.ajax({
        url: '/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?businessId=' + objectId + '&bizType=pic_business&token=' + token,
        method: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows
                var li_str = "";
                for (var i = 0; i < data.length; i++) {
                    li_str += '<li><img src="' + rootPath + '/cloudlink-core-file/file/downLoad?fileId=' + data[i].fileId + '" ></li>';
                }
                $("#pic_business").html(li_str);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }

    })
    //获取法人身份证
    $.ajax({
        url: '/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?businessId=' + objectId + '&bizType=pic_identity&token=' + token,
        method: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows
                var li_str = "";
                for (var i = 0; i < data.length; i++) {
                    li_str += '<li><img src="' + rootPath + '/cloudlink-core-file/file/downLoad?fileId=' + data[i].fileId + '" ></li>';
                    // li_str+='<li><img src="'+rootPath+'/cloudlink-core-file/file/getImageBySize?fileId='+data[i].fileId+'&width=100&hight=100&viewModel=lfit" ></li>';
                }
                $("#pic_identity").html(li_str);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 获取审核历史信息
 */
function getHistory() {
    $.ajax({
        url: '/cloudlink-core-framework/enterprise/getAuthHistory?enterpriseId=' + objectId + '&token=' + token,
        method: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows;
                var li_str = "";
                for (var i = 0; i < data.length; i++) {
                    if ((data[i].endTime != "" && data[i].endTime != null) && (data[i].approveContent != "" && data[i].approveContent != null)) {
                        li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
                        li_str += '<div><span>' + data[i].endTime + '</span><span>' + data[i].approveContent + '</span></div></li>';
                    }
                }
                $(".history-body").html(li_str);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 获得当前所选企业对应的TaskID
 */
function getTaskId() {
    $.ajax({
        url: '/cloudlink-core-framework/enterprise/queryAuthList?token=' + token,
        method: 'get',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        data: {
            enterpriseId: objectId,
        },
        success: function (result) {
            console.log();
            if (result.success == 1 && result.rows[0] != null) {
                taskId = result.rows[0].objectId;
                getAuthHistoryById(taskId);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 企业认证流程
 * 1，使用企业ID获得企业认证的taskID，
 * 2，使用taskId进行企业认证
 * @param {string} status 审核结果
 */
function updateStatus(status) {
    var approveContent = $("#approveContent").val(); //审核意见
    if (approveContent != null && approveContent != "") {
        var flag = 0; //审核失败：0； 审核成功：1； 未填写意见：2；
        $.ajax({
            url: '/cloudlink-core-framework/enterprise/authApprove?token=' + token,
            method: 'post',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            data: JSON.stringify({
                taskId: taskId,
                approveResult: status,
                approveContent: approveContent,
                startUserId: startUserId,
                signName: "阴保管家"
            }),
            success: function (result) {
                if (result.success == 1) {
                    flag = 1;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        })
    } else {
        flag = 2;
    }
    return flag;
}

/**
 * @desc 给遮罩层img添加src
 * @param {*innerHtml Object} e 
 */
function changeZheZhao(e) {
    $("#zcdiv").show();
    $("#picture").attr("src", e.src);
}

/**
 * @desc 关闭遮罩层
 */
function closeMask() {
    $("#zcdiv").hide();
}

/**
 * @desc 添加监听事件
 */
function addEvent() {
    //审核历史信息中，控制显隐状态
    $(".show-content").click(function () {
        $(".history-body").show();
    });
    $(".hide-content").click(function () {
        $(".history-body").hide();
    });
    //全屏查看照片
    $(".basic_info").off("click");
    $(".basic_info").on("click", "img", function () {
        changeZheZhao(this);
    });
}
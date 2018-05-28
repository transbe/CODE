/**  
 * @file
 * @author: zhangyi
 * @desc: 查看企业信息
 * @date: 2017-05-04
 * @last modified by: gaohui 
 * @last modified time: 2017-06-12 09:26:17
 */
var enterpriseID = getParameter("objectId"); //企业ID
var authenticateStatus = getParameter("authenticateStatus"); //企业认证状态
var useType = getParameter("useType"); //企业使用应用的类型1 协议 0 试用
var enterpriseType = getParameter("enterpriseType"); //企业类型1 正式 0 测试
var token = lsObj.getLocalStorage('token'); //获取token
var historyMsg = []; //定义一个全局变量
/**
 * @desc 初始化函数
 */
$(function () {
    if (authenticateStatus != 1) {  //企业没有认证
        $("#authenticate").css('display', 'none');  //认证区域隐藏
    }
    if (useType == 1) { //协议用户 
        $("#informationStyle").css('display', '');  //显示协议信息tab标签
    } else {
        $("#expire").html("试用结束时间：");
        $("#effective").html("试用起始时间：");
    }
    getPhoto("businessLicense"); // 营业执照
    getPhoto("idCard"); // 法人身份证照片

    getEnterpriseData(); // 获取企业信息
    //获取任务id，完成后获取认证信息，完成后再获取企业其他基本信息
    getTaskId();
    loadTable(); // 加载服务专家网格数据

    // 为ul添加事件委托,控制图片点击事件
    $("ul").on('click', function (e) {
        if (e.target && e.target.nodeName == "IMG") {
            $("#zcdiv").show();
            $("#test").attr("src", e.target.src);
        }
    });
    getHistory();   //获取历史信息
    
    getReportTable(); //获取Tab标签企业报告网格信息
    getSigningTable(); //获取Tab标签协议信息网格信息
    
    $(".nav-tabs").on("click","li",function(){    //点击tab标签触发事件
        setTimeout(function(){
            var tableId = $(".tab-content").find('div.active').attr("id");  //获取选中的tab面板的 Id
            setHeightTable(tableId+'Table');    //设置table表格高度
        },10)
    });

    
    $(window).on('resize', function () {    //窗口大小改变时触发
        var tableId = $(".tab-content").find('div.active').attr("id");  //获取选中的tab面板的 Id
        setHeightTable(tableId+'Table');    //设置table表格高度
        $(".nav-tabs").click(function(){
            setTimeout(function(){
                var tableId = $(".tab-content").find('div.active').attr("id");  //获取选中的tab面板的 Id
                setHeightTable(tableId+'Table');    //设置table表格高度
            },10)
        });
    });
});

/**
 * @desc 设置table表格高度
 * @param {*String} tableId
 */
function setHeightTable(tableId){
    $("#"+tableId).bootstrapTable("resetWidth");    //对齐表格表头
    $("#"+tableId).bootstrapTable("resetView", {
        height: window.innerHeight-105
    });
   
}

/**
 * @desc 获取企业信息
 */
function getEnterpriseData() {
    $.get("/cloudlink-core-framework/enterprise/getById", {
        'objectId': enterpriseID,
        'token': token,
        'appId': appId
    }, function (result, status) {
        if (result.success == 1) {
            var data = result.rows[0];
            historyMsg.push(data.createTime + "企业注册");
            if (useType == 0) {
                $("#useType").html("试用用户")
            } else {
                $("#useType").html("协议用户")
            }
            if (data.createUser != null) {
            }
            $("#enterpriseName").html(data.enterpriseName); // 企业名称
            if (data.enterpriseScale != null) { // 企业规模
                switch (data.enterpriseScale) {
                    case 1:
                        $("#enterpriseScale").html("50人以下");
                        break;
                    case 2:
                        $("#enterpriseScale").html("50-100人");
                        break;
                    case 3:
                        $("#enterpriseScale").html("100-200人");
                        break;
                    case 4:
                        $("#enterpriseScale").html("200-500人");
                        break;
                    case 5:
                        $("#enterpriseScale").html("500人以上");
                        break;
                    default:
                        break;
                }
            } else {
                $("#enterpriseScale").html(data.enterpriseScale);
            }
            $("#registerNum").html(data.registerNum); // 企业注册号
            $("#USCCode").html(data.registerNum); // 社会统一信用代码
            // authenticateStatus:认证状态（0默认未认证，2 待审核，1已认证，-1驳回）
            if (data.authenticateStatus != null) {
                switch (data.authenticateStatus) {
                    case -1:
                        $("#authenticateStatus").html("驳回");
                        break;
                    case 0:
                        $("#authenticateStatus").html("未认证");
                        break;
                    case 1:
                        $("#authenticateStatus").html("已认证");
                        break;
                    case 2:
                        $("#authenticateStatus").html("待审核");
                        break;
                    default:
                        break;
                }
            } else {
                $("#authenticateStatus").html(data.authenticateStatus); // 企业认证状态
            }
            $("#enpAdminName").html(data.enpAdminName); //管理员
            $("#telephoneNum").html(data.telephoneNum); //管理员电话
            $("#address").html(data.address);
            $("#createTime").html(data.createTime);
            $("#createUserName").html(data.createUserName);
            $("#effectiveTime").html(data.effectiveTime)
            $("#expireTime").html(data.expireTime)
            getUser(data.createUser);
        } else {
            parent.layer.alert("加载失败", {
                title: "提示",
                skin: "self-alert"
            });
        }
    });
}

/**
 * @desc 获取用户信息
 * @param {*String} objectId
 */
function getUser(objectId) {
    if (objectId == "null") {
        return;
    }
    $.get("/cloudlink-core-framework/user/getById", {
        'objectId': objectId,
        'token': token
    }, function (result, status) {
        if (result.success == 1) {
            var data = result.rows[0];
            $("#createUser").html(data.userName);
        }
    });
}

/**
 * @desc 加载服务专家网格数据
 */
function loadTable() {
    $("#showData").bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryExpertByEnterpriseId?token=' + token + '&enterpriseId=' + enterpriseID,
        method: 'get',
        pageSize: 5,
        showRefresh: false,
        // queryParamsType: "size",
        queryParams: function (params) {
            params.pageNum = this.pageNumber;
            params.pageSize = params.limit;
            return params;
        },

        sidePagination: 'client',
        columns: [{
            field: 'objectId',
            title: 'objectId',
            valign: 'middle',
            align: 'center',
            visible: false
        }, {
            title: '序号',
            formatter: function (value, row, index) {
                return (index + 1)
            }
        }, {
            field: 'expertName',
            title: '专家姓名',
        }, {
            field: 'qualificationInfo',
            title: '专家资质',
        }, {
            field: 'appointTime',
            title: '服务开始时间',
        }],
        onDblClickRow: function (row) {
            view(row.objectId);
        },
        responseHandler: function (res) {
            if (res.success == 1) {
                return res.expertList;
            } else {
                parent.layer.alert("加载数据出错", {
                    title:"提示",
                    skin: "self-alert"
                });
            }

        },
        onLoadSuccess: function (result) {}
    });
}

/**
 * @desc 获取企业营业执照和法人身份证照片
 * @param {*String} params
 */
function getPhoto(params) {
    var bizType = "";
    var paramId = "";
    if (params == "businessLicense") { // 营业执照
        bizType = "pic_business";
        paramId = "businessLicense";
    } else { // 法人照片
        bizType = "pic_identity";
        paramId = "idCard";
    }
    $.ajax({
        url: '/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?businessId=' + enterpriseID + '&bizType=' + bizType,
        type: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows;
                var li_str = "";
                for (var i = 0; i < data.length; i++) {
                    li_str += '<li style="float:left"><img  style="width:80px;height:80px" src="' + getRootPath() + '/cloudlink-core-file/file/downLoad?fileId=' + data[i].fileId + '"></li>'
                }
                $("#" + paramId).html(li_str);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 关闭遮罩层
 */
function closeMask() {
    $("#zcdiv").hide();
}

/**
 * @desc 获取Tab标签企业报告网格信息
 */
function getReportTable() {
    var currentNumber;
    var currentSize;
    $("#reportTable").bootstrapTable({
        url: '/cloudlink-corrosionengineer/report/queryApplyForPage?token=' + token + '&roleType=1' + '&enterpriseId=' + enterpriseID,
        method: 'get',
        showRefresh: false,
        queryParams: function (params) {
            currentNumber = this.pageNumber;
            currentSize = this.pageSize;
            params.pageNum = this.pageNumber; //当前页码
            params.pageSize = this.pageSize; //页面大小
            return params;
        },
        columns: [{
            title: '序号',
            formatter:function(value, row, index){
                return currentSize*(currentNumber-1)+index;
            }
        }, {
            field: 'reportName',
            title: '报告名称',
            width: '10%'
        }, {
            field: 'reportType',
            title: '报告类型',
            width: '10%'
        }, {
            field: 'applyStatus',
            title: '报告状态',
            width: '10%'
        }, {
            field: 'enterpriseName',
            title: '企业名称',
            width: '15%'
        }, {
            field: 'expertName',
            title: '专家姓名',
            width: '10%'
        }, {
            field: 'qualificationGrade',
            title: '资质等级',
            width: '15%'
        }, {
            field: 'applyTime',
            title: '申请时间',
            class: 'td-nowrap',
            width: '10%'
        }, {
            field: 'completeTime',
            title: '完成时间',
            class: 'td-nowrap',
            width: '10%'
        }, {
            field: 'duration',
            title: '审核时长',
            width: '10%'
        }],
        responseHandler: function (res) {
            if (res.success == 1) {
                return res;
            } else {
                parent.layer.alert("加载数据出错", {
                    title:"提示",
                    skin: "self-alert"
                });
            }

        }
    })
}

/**
 * @desc 获取Tab标签协议信息网格信息
 */
function getSigningTable() {
    $("#signingTable").bootstrapTable({
        url: '/cloudlink-core-framework/enterprise/protocol/getListByEnterprise?token=' + token + '&enterpriseId=' + enterpriseID,
        method: 'get',
        showRefresh: false,
        queryParamsType: "pageSize", //页面大小
        sidePagination: "client",
        columns: [{
            field: 'sequence',
            title: '序号',
            formatter: function (value, row, index) {
                return (index + 1)
            }
        }, {
            field: 'effectiveTime',
            title: '协议起始时间',
            class: "td-nowrap",
            width: "15%"
        }, {
            field: 'expireTime',
            title: '协议到期时间',
            class: "td-nowrap",
            width: "15%"
        }, {
            field: 'duration',
            title: '协议时长',
            width: "15%"
        }, {
            field: 'operator',
            title: '经办人',
            width: "10%"
        }, {
            field: 'signDate',
            title: '签约时间',
            class: "td-nowrap",
            width: "15%"
        }, {
            field: 'remark',
            title: '备注',
            width: "20%"
        }, {
            title: '操作',
            width: "10%",
            formatter: function (value, row) {
                var res = ""
                if(row.protocolId != ""){
                    res += "<a href='#'><i class='fa fa-file-pdf-o'  title='查看文档' onclick=\"viewPdf('" + row.protocolId + "')\"></i></a>";
                    res += "<a href='#'><i class='glyphicon glyphicon-export'  title='下载文档' onclick=\"downLoadPdf('" + row.protocolId + "')\"></i></a>";
                }else{
                    res += "<a href='#'><i class='fa fa-file-pdf-o'  title='查看文档' style = 'color:#ccc' onclick=\"viewPdf('" + row.protocolId + "')\"></i></a>";
                    res += "<a href='#'><i class='glyphicon glyphicon-export'  title='下载文档' style = 'color:#ccc' onclick=\"downLoadPdf('" + row.protocolId + "')\"></i></a>";
                }
                return res;
            }
        }],
        responseHandler: function (res) {
            if (res.success == 1) {
                var data = res.rows
                console.log(data)
                if (data.length > 0) {
                    if (data.length != 1) {
                        historyMsg.push(data[data.length - 1].signDate + "企业签约");
                        historyMsg.push(data[0].signDate + "企业续约");
                    } else {
                        historyMsg.push(data[0].signDate + "企业签约");
                    }
                }
                return data;
            } else {
                parent.layer.alert("加载数据出错", {
                    title:"提示",
                    skin: "self-alert"
                });

            }

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
            enterpriseId: enterpriseID,
        },
        success: function (result) {
            if (result.success == 1 && result.rows[0] != null) {
                taskId = result.rows[0].objectId;
                getCertificationData(taskId);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 获取认证信息
 * @param {*String} taskId
 */
function getCertificationData(taskId) {
    $.ajax({
        url: '/cloudlink-core-framework/enterprise/getAuthHistoryById?taskId=' + taskId + '&token=' + token,
        dataType: 'json',
        type: 'get',
        success: function (result) {
            if (result.success == "1") {
                historyMsg.push(result.rows[0].endTime + "企业认证");
                var data = result.rows[0];
                $("#startUserName").html(data.startUserName);
                $("#startTime").html(data.startTime);
                $("#fromAppName").html(data.fromAppName);
                $("#approveContent").html(data.approveContent);
                $("#approveUserName").html(data.approveUserName);

                getOtherInfo(data.startUserId);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取企业其他基本信息
 * @param {*String} id
 */
function getOtherInfo(id) {
    $.ajax({
        url: '/cloudlink-core-framework/user/getById?objectId=' + id + '&enterpriseId=' + enterpriseID + '&token=' + token,
        dataType: 'json',
        type: 'get',
        success: function (result) {
            if (result.success == "1") {
                var data = result.rows[0];
                $("#mobileNum").html(data.mobileNum);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

//显示历史记录
$(".show-content").click(function () {
    $(".history-body").show();
});
//隐藏历史记录
$(".hide-content").click(function () {
    $(".history-body").hide();
});

/**
 * @desc 查看PDF
 * @param {*String} fileId
 */
function viewPdf(fileId) {
    if(fileId == ""){
        return;
    }
    parent.layer.open({
        type: 2,
        title: '协议用户续约',
        btn: ['关闭'],
        area: ['800px', '600px'],
        yes: function (index, layero) {
            parent.layer.close(index);
        },
        content: ['src/html/user_management/viewPdf.html?fileId=' + fileId+"&layerWidth=800&layerHeight=600", 'no']
    });
}
/**
 * @desc 下载PDF
 * @param {*String} fileId
 */
function downLoadPdf(fileId) {
    if(fileId == ""){
        return;
    }
    $("#exprotPdf").attr("src","/cloudlink-core-file/attachment/downLoadOneFile?fileId="+fileId);
}

/**
 * @desc 查看记录
 */
function getHistory() {
    var li_str = "";
    setTimeout(function () {
        for (var i = 0; i < historyMsg.length; i++) {

            li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
            li_str += '<div><span>' + historyMsg[i] + '</span></div></li>';
        }
        $(".history-body").html(li_str);
    }, 100)
}
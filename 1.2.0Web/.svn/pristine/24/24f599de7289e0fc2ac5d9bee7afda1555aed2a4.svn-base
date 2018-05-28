/**
 * @Author: liangyuanyuan
 * @Date: 2017-3-14
 * @Last Modified by: lizhenzhen
 * @Last Modified time: 2017-5-25
 * @func 消息页面的js逻辑
 * @操作部分:新增消息删除，批量删除，批量标记功能  2017-4-24
 * @操作部分:添加注释，修改代码规范
 */

var detectMethod = ""; // 任务检测方法
var taskStatus = ""; // 任务状态
var currentPageNum = 1; // 当前页码
var token = lsObj.getLocalStorage("token");
var roleNum = lsObj.getLocalStorage('params'); //获取角色 的标识
$(function() {
    // 下拉菜单
    messageTyppe();
    //  时间插件 开始时间
    $("#beginTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    });
    //  时间插件 开始时间
    $("#endTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    });
    // 加载消息表格
    loadTable();
    // 自适应窗口剩余高度
    setTableHeight('news');
});

/*
 *初始化下拉选 获取消息类型
 */
function messageTyppe() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/message/msgTypeCheck?domain=msg_business_type",
        dataType: "json",
        method: "get",
        success: function(result) {
            if (result.success == 1) {
                var data = result.msgTypeList;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].code + "'>" + data[i].value + "</option>"
                }
                var myobj = document.getElementById('businessType');
                if (myobj.options.length == 0) {
                    $("#businessType").html(options);
                    $('#businessType').selectpicker('refresh');
                }
                $("#businessType").bind("change", function() {
                    var businessType = $("#businessType").val();
                    if (businessType == null || businessType == "") {
                        $("#userName").val("");
                    } else {
                        // for(var i=0;i<data.length;i++){
                        //     if(businessType ==  data[i].code){
                        //         $("#userName").val(data[i].account);
                        //     }
                        // }
                    }
                });
            } else {
                layer.confirm("加载下拉选失败！", {
                    title: "提示",
                    btn: ['确定'],
                    skin: "self"
                });
            }
        }
    });
}

/* 
 * 加载消息表格数据
 */
function loadTable() {
    $('#news').bootstrapTable({
        url: '/cloudlink-corrosionengineer/message/queryAllMessageForPage',
        method: 'get', //请求方式（*）
        toolbar: '#toolbar',
        queryParams: queryParams, // 分页参数
        responseHandler: responseHandler,
        columns: [{
            checkbox: true,
        }, {
            field: 'objectId',
            title: 'objectId',
            visible: false,
        }, {
            field: 'sendTime',
            title: '接收时间',
            formatter: function(value, row, index) {
                if (row.readStatus == 0) {
                    return "<span class='unread' id=" + row.objectId + ">未读</span>" + "<span class='send-time'>" + row.sendTime + '</span>';
                } else {
                    return "<span style='visibility:hidden'>未读</span>" + "<span class='send-time'>" + row.sendTime + '</span>'
                }
                return row.sendTime;
            }
        }, {
            field: 'businessTypeName',
            title: '消息类型',
        }, {
            field: 'content',
            title: '消息内容',
        }, {
            field: 'senderName',
            title: '发信人',
        }, {
            field: 'operation',
            title: '操作',
            formatter: function(value, row, index) {

                var d = '<a href="#"  mce_href="#" title="删除" onclick="deletNews(this,\'' + row.objectId + '\'\,\'' + row.businessType + '\'\,\'' + row.businessDataId + '\')"><span class="glyphicon glyphicon-trash"></span></a> ';
                e = '<a href="#"   mce_href="#" title="查看" onclick="oneClick(\'' + row.objectId + '\'\,\'' + row.businessType + '\'\,\'' + row.businessDataId + '\')"><i class="glyphicon glyphicon-eye-open  "></i></span></a> ';
                return e + d;
            }
        }],
        onClickRow: function(row) {
            setNewStatus(row.objectId);
        },
        onDblClickRow: function(row) {
            oneClick(row.objectId, row.businessType, row.businessDataId);
        },
        onPageChange: function(number, size) {
            currentPageNum = number;
        }
    });
}

/*
 * 设置获取表格的传入参数
 */
function queryParams() {
    var businessType = $("#businessType").val();
    var beginTime = $("#beginTime").val();
    var endTime = $("#endTime").val();
    var senderName = $("#senderName").val();

    var temp = {
        pageSize: this.pageSize, //页面大小
        pageNum: this.pageNumber, //当前页码
        token: token,
        businessType: businessType,
        beginTime: beginTime,
        endTime: endTime,
        senderName: senderName
    }
    return temp;
}

/*
 *展示表格数据，设置边框底部页码
 */
function responseHandler(res) {
    if (res.success == 1) {
        return {
            "rows": res.rows,
            "total": res.total
        }
    } else {
        // console.log(res.msg);
        layer.confirm("加载表格数据出错！", {
            title: "提示",
            btn: ['确定'],
            skin: "self"
        });
        return {
            "rows": [],
            "total": 0
        }
    }
}

/*
 *（单击查看消息，设置消息状态）
 */
function setNewStatus(objectId) {
    var parameter = {
        "objectId": objectId,
        "token": token,
    };
    $.ajax({
        url: "/cloudlink-corrosionengineer/message/setMessageStatus",
        dataType: "json",
        method: "post",
        data: parameter,
        success: function(result) {
            var objArr = objectId.split(',');
            for (var temp in objArr) {
                var msgRead = $("#" + objArr[temp]);
                msgRead.css("visibility", "hidden") //双击的时候，如果原本是0变成1，传给后台
            }
        }
    });
}

/*
 * 点击查看任务详情
 */
function oneClick(objectId, businessType, businessDataId) {
    parent.canOpenViewTask = true;
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryTaskById?objectId=" + businessDataId,
        dataType: "json",
        method: "get",
        success: function(result) {
            if (result.success == 1) {
                detectMethod = result.taskInfo.detectMethod;
                taskStatus = result.taskInfo.taskStatus;
                var taskName = result.taskInfo.taskName;
                var detectUserId = result.taskInfo.detectUserId;
                // console.log(businessDataId+"-"+detectMethod+"--"+taskStatus);
                //根据businessType跳转到不同的页面
                //console.log('businessDataId=='+businessDataId+"detectMethod=="+detectMethod+"taskStatus=="+taskStatus);
                var dataUrl =  "src/html/task/all_task/all_task.html";
                var realDataUrl = "src/html/task/all_task/all_task.html?query=news&taskId="+businessDataId+'&detectMethod='+detectMethod+"&taskStatus="+encodeURI(taskStatus)+'&taskName='+encodeURI(taskName)+'&detectUserId='+detectUserId;
                var menuName = "全部任务";
                var dataIndex = "40";
                parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                // if (roleNum == 1) {     //阴保工程师人员
                //     switch (businessType) {
                //         case "3":
                //         parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             // dataChecked(businessDataId, detectMethod, taskStatus);
                //             break;
                //             // case "2":
                //             // location.href="../../html/task/all-task.html"; 
                //             // break; 
                //             // case "3":
                //             //   dataChecked(businessDataId, detectMethod, taskStatus); 
                //             //    break; 
                //         case "4":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //             // case "5":
                //             // location.href="../../html/task/all-task.html"; 
                //             // break; 
                //             // case "6":
                //             // location.href="../../html/task/all-task.html"; 
                //             // break; 
                //             // case "7":
                //             // location.href="../../html/task/all-task.html"; 
                //             // break; 
                //         case "8":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //     }
                // }else if(roleNum == 2){ //现场检测
                //     switch (businessType) {
                //         case "1":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "2":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "5":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "6":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "7":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //     }
                // }else if(roleNum == 3){ //现场检测+运营
                //     switch (businessType) {
                //         case "1":
                //            parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "2":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "3":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "4":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "5":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "6":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "7":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //         case "8":
                //             parent.showMenuPage(dataUrl,realDataUrl,menuName,dataIndex);
                //             break;
                //     }
                // }
            }
        }
    });
};

/*
 *双击任务详细信息查看
 */
function dataChecked(objectId, detectMethod, taskStatus) {
    var viewUrl = ""; // 打开窗口的url
    viewUrl = "src/html/task/specific_task/view_task.html?objectId=" + objectId + '&detectMethod=' + detectMethod;
    var btnMess = ['关闭'];
    var layer1 = parent.layer.open({
        type: 2,
        title: '查看任务及测试数据',
        area: ['950px', '600px'],
        btn: btnMess,
        content: viewUrl
    });
};

/*
 *删除消息
 */
function deletNews(self, id, type, bid) {
    // 把当前要删除的消息ID传到后台，进行删除，成功之后，从页面上删除
    var rows = $("#news").bootstrapTable('getSelections');
    var rowData = $("#news").bootstrapTable('getData', true);
    if (rowData.length == rows.length && currentPageNum != 1) {
        currentPageNum = currentPageNum - 1;
    };
    var msgIds = id;
    layer.confirm("您确定要删除该消息吗？", {
        title: "提示",
        btn: ['确定', "取消"], //按钮
        skin: "self"
    }, function() {
        $.ajax({
            url: "/cloudlink-corrosionengineer/message/deleteMessageByIds?msgIds=" + msgIds + "&token=" + token,
            dataType: "json",
            method: "get",
            success: function(result) {
                if (result.success == 1) {
                    //从页面删除消息
                    $("#news").bootstrapTable('refreshOptions', {
                        pageNumber: currentPageNum
                    });
                    layer.closeAll();
                    layer.msg("删除消息成功！", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-success"
                    });
                } else {
                    layer.confirm("删除消息失败！", {
                        title: "提示",
                        btn: ['确定'],
                        skin: "self"
                    });
                }
            }
        });
    });
}

/*
 *批量删除消息
 */
function deleteAllNews() {
    // 先获取选中的消息
    var rowDate = $('#news').bootstrapTable('getSelections');
    var newsIds = "";
    if (rowDate.length > 0) {
        if (rowDate.length > 1) {
            for (var temp in rowDate) {
                newsIds += (rowDate[temp].objectId + ",");
            }
            newsIds = newsIds.substring(0, newsIds.length - 1);
        } else {
            newsIds = rowDate[0].objectId;
        };
        deletNews(newsIds, newsIds, newsIds, newsIds);
    } else {
        layer.confirm("请至少选择一条消息", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
    }
}

/*
 *全部标记为已读
 */
function markReadAllNews() {
    var rowDate = $('#news').bootstrapTable('getSelections');
    var newsIds = "";
    if (rowDate.length > 0) {
        layer.confirm("您确定要全部标记已读吗？", {
            title: "提示",
            btn: ['确定', "取消"], //按钮
            skin: "self"
        }, function() {
            layer.closeAll();
            // 先获取选中的消息
            if (rowDate.length > 1) {
                for (var temp in rowDate) {
                    newsIds += (rowDate[temp].objectId + ",");
                }
                newsIds = newsIds.substring(0, newsIds.length - 1);
            } else {
                newsIds = rowDate[0].objectId;
            };
            setNewStatus(newsIds);
        });
    } else {
        layer.confirm("请至少选择一条未读消息", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
    }
}

/*
 *根据查询条件重新加载数据
 */
function queryReload() {
    $("#news").bootstrapTable('refresh', true)
}

/*
 *重置form表单
 */
function clearForm() {
    document.getElementById("formSearch").reset();
    $('.selectpicker').selectpicker('val', null);
    queryReload()
}
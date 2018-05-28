/** 
 * @file
 * @author  liangyuanyuan
 * @desc 消息页面js逻辑操作
 * @date 2017-06-12 09:38:16
 * @last modified by lizhenzhen
 * @last modified time  2017-06-12
 */

var detectMethod = ""; // 任务检测方法
var taskStatus = ""; // 任务状态
var currentPageNum = 1; // 当前页码
var token = lsObj.getLocalStorage("token"); // 获取token
var roleNum = lsObj.getLocalStorage('params'); //获取角色 的标识
$(function() {
    changePageStyle("../.."); // 换肤
    firstLogin(); // 判断是否是第一次登陆，第一次展示向导

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


/**
 * @desc 初始化下拉选 获取消息类型
 * @method messageTyppe
 */
function messageTyppe() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/message/msgTypeCheck?domain=msg_business_type",
        dataType: "json",
        method: "get",
        success: function(result) {
            if (result.success == 1) {
                var data = result.msgTypeList;
                var options = "<option value=''>"+getLanguageValue("option.select")+"</option>";
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
                layer.alert(getLanguageValue("option.fail"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 加载消息表格数据
 * @method loadTable
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
            title: getLanguageValue("recive"),
            width: "20%",
            formatter: function(value, row, index) {
                if (row.readStatus == 0) {
                    return "<span class='unread' id=" + row.objectId + ">"+getLanguageValue("field.Uncheck")+"</span>" + "<span class='send-time'>" + row.sendTime + '</span>';
                } else {
                    return "<span style='visibility:hidden'>"+getLanguageValue("field.Uncheck")+"</span>" + "<span class='send-time'>" + row.sendTime + '</span>'
                }
            }
        }, {
            // field: 'businessTypeName',
            field: 'title',
            title: getLanguageValue("field.msgType"),
            width: "15%"

        }, {
            field: 'content',
            title: getLanguageValue("field.content"),
            width: "35%"
        }, {
            field: 'senderName',
            title: getLanguageValue("field.sender"),
            width: "15%"
        }, {
            field: 'operation',
            title: getLanguageValue("field.operation"),
            width: "15%",
            formatter: function(value, row, index) {

                var d = '<a href="#"  mce_href="#" title="'+getLanguageValue("field.view")+'" onclick="deletNews(this,\'' + row.objectId + '\'\,\'' + row.businessType + '\'\,\'' + row.businessDataId + '\')"><span class="glyphicon glyphicon-trash"></span></a> ';
                e = '<a href="#"   mce_href="#" title="'+getLanguageValue("field.delete")+'" onclick="oneClick(\'' + row.objectId + '\'\,\'' + row.businessType + '\'\,\'' + row.businessDataId + '\')"><i class="glyphicon glyphicon-eye-open  "></i></span></a> ';
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

/**
 * @desc 设置获取表格的传入参数
 * @method queryParams
 */
function queryParams() {
    var businessType = $("#businessType").val(); // 消息类型
    var beginTime = $("#beginTime").val(); // 开始时间
    var endTime = $("#endTime").val(); // 结束时间
    var senderName = $("#senderName").val(); // 发信人

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

/**
 * @desc 展示表格数据，设置边框底部页码
 * @method responseHandler
 * @param {String} res 
 */
function responseHandler(res) {
    if (res.success == 1) {
        return {
            "rows": res.rows,
            "total": res.total
        }
    } else {
        layer.alert("加载表格数据出错！", {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return {
            "rows": [],
            "total": 0
        }
    }
}


/**
 * @desc 单击查看消息，设置消息状态
 * @method setNewStatus
 * @param {*} objectId 
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
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }

    });
}


/**
 * @desc 点击查看任务详情
 * @method oneClick
 * @param {*} objectId 
 * @param {*} businessType 
 * @param {*} businessDataId 
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
                var dataUrl = "src/html/task/all_task/all_task.html";
                var realDataUrl = "src/html/task/all_task/all_task.html?query=news&taskId=" + businessDataId + '&detectMethod=' + detectMethod + "&taskStatus=" + encodeURI(taskStatus) + '&taskName=' + encodeURI(taskName) + '&detectUserId=' + detectUserId;
                var menuName = getLanguageValue("tip.alltask");
                var dataIndex = "40";
                parent.showMenuPage(dataUrl, realDataUrl, menuName, dataIndex);
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
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            console.log(XMLHttpRequest); // 请求对象
            console.log(textStatus); // 返回状态错误类型
            console.log(errorThrown); // 捕获的异常对象

            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
};


/**
 * @desc 双击任务详细信息查看
 * @method dataChecked
 * @param {*} objectId 
 * @param {*} detectMethod 
 * @param {*} taskStatus 
 */
function dataChecked(objectId, detectMethod, taskStatus) {
    var viewUrl = ""; // 打开窗口的url
    viewUrl = "src/html/task/specific_task/view_task.html?objectId=" + objectId + '&detectMethod=' + detectMethod;
    var btnMess = [getLanguageValue("tip.close")];
    var layer1 = parent.layer.open({
        type: 2,
        skin: 'self-iframe',
        title: getLanguageValue("tip.viewTask"),
        area: ['950px', '600px'],
        btn: btnMess,
        content: viewUrl
    });
};

/**
 * @desc 删除消息
 * @method deletNews
 * @param {*} self 
 * @param {*} id 
 * @param {*} type 
 * @param {*} bid 
 */
function deletNews(self, id, type, bid) {
    // 把当前要删除的消息ID传到后台，进行删除，成功之后，从页面上删除
    var rows = $("#news").bootstrapTable('getSelections');
    var rowData = $("#news").bootstrapTable('getData', true);
    if (rowData.length == rows.length && currentPageNum != 1) {
        currentPageNum = currentPageNum - 1;
    };
    var msgIds = id;
    layer.confirm(getLanguageValue("tip.delete.msg"), {
        title: getLanguageValue("tip"),
        btn: [getLanguageValue("tip.ok"), getLanguageValue("tip.cancle")], //按钮
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
                    layer.msg(getLanguageValue("tip.delete.success"), {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                } else {

                    layer.alert(getLanguageValue("tip.delete.fail"), {
                        title: getLanguageValue("tip"),
                        skin: "self-alert"
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                console.log(XMLHttpRequest); // 请求对象
                console.log(textStatus); // 返回状态错误类型
                console.log(errorThrown); // 捕获的异常对象

                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        });
    });
}


/**
 * @desc 批量删除消息
 * @method deleteAllNews
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
        layer.alert(getLanguageValue("tip.select.msg"), {
            title: getLanguageValue("tip"),
            btn: [getLanguageValue("tip.ok")], 
            skin: 'self-alert'
        });
    }
}


/**
 * @desc 全部标记为已读
 * @method markReadAllNews
 */
function markReadAllNews() {
    var rowDate = $('#news').bootstrapTable('getSelections'); // 获取选中的行
    var newsIds = ""; // 获取消息的id
    if (rowDate.length > 0) {
        layer.confirm(getLanguageValue("tip.select.confim"), {
            title: getLanguageValue("tip"),
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
        layer.alert(getLanguageValue("tip.select.unread"), {
            title: getLanguageValue("tip"),
            btn: [getLanguageValue("tip.ok")], 
            skin: 'self-alert'
        });
    }
}


/**
 * @desc 根据查询条件重新加载数据
 * @method queryReload
 */
function queryReload() {
    $("#news").bootstrapTable('refresh', true)
}


/**
 * @desc 重置form表单
 * @method clearForm
 */
function clearForm() {
    document.getElementById("formSearch").reset();
    $('.selectpicker').selectpicker('val', null);
    queryReload()
}
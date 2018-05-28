/**
 * @Author: liangyuanyuan
 * @Date: 2017-3-14
 * @Last Modified by: liangyuanyuan
 * @Last Modified time: 2017-4-14
 * @func 消息页面的js逻辑
 */


var detectMethod = "";
var taskStatus = "";
var newsdata = "";
$(function() {
    // 下拉菜单
    messageTyppe();
    //    时间插件
    $("#beginTime").datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    });
    $("#endTime").datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    });

    //初始化Table
    var oTable = new TableInit();
    oTable.Init();
    //表格部分滚动条的实现
    setTableHeight('news');
});

//初始化下拉选（消息类型）；
function messageTyppe() {
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    $.ajax({
        url: "/cloudlink-corrosionengineer/message/msgTypeCheck?domain=msg_business_type",
        dataType: "json",
        method: "get",
        success: function(result) {
            if (result.success == 1) {
                var data = result.msgTypeList;
                // console.log(JSON.stringify(data));
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
                layer.msg("加载下拉选失败");
            }
        }
    });
}


//初始化列表
var TableInit = function() {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function() {
        $('#news').bootstrapTable({
            url: '/cloudlink-corrosionengineer/message/queryAllMessageForPage', //请求后台的URL（*）        
            method: 'get', //请求方式（*）
            striped: true, //使表格带有条纹
            pagination: true, //在表格底部显示分页工具栏
            //    queryParams: function(params) {
            //        params.token = lsObj.getLocalStorage("token");
            //        return params;
            //    },
            pageSize: 10,
            pageNumber: 1,
            queryParams: queryParams, // 分页参数
            sidePagination: "server", // 服务端请求
            //    uniqueId: "objectid", // 每一行的唯一标识，一般为主键列
            responseHandler: responseHandler,
            clickToSelect: true,
            columns: [{
                checkbox: true,
            }, {
                field: 'objectId',
                title: 'objectId',
                align: 'center',
                visible: false,
            }, {
                field: 'sendTime',
                title: '接收时间',
                align: 'center',
                formatter: function(value, row, index) {
                    //console.log(row.objectId);                   
                    // 判断已读未读  id="'+row.objectId+'"
                    if (row.readStatus == 0) {
                        return "<span class='unread' id=" + row.objectId + ">未读</span>" + "<span class='send-time'>" + row.sendTime + '</span>';
                    } else {
                        // return "<span style='visibility:hidden'>未读</span>"+row.sendTime;
                        return "<span style='visibility:hidden'>未读</span>" + "<span class='send-time'>" + row.sendTime + '</span>'
                    }
                    return row.sendTime;
                }
            }, {
                field: 'businessTypeName',
                title: '消息类型',
                align: 'center',
            }, {
                field: 'content',
                title: '消息内容',
                align: 'center',
            }, {
                field: 'senderName',
                title: '发信人',
                align: 'center',
            }, {
                field: 'operation',
                title: '操作',
                align: 'center',
                formatter: function(value, row, index) {
                    // console.log(row);
                    var e = '<a href="#" style="visibility:hidden" mce_href="#" title="查看" onclick="oneClick(\'' + row.objectId + '\'\,\'' + row.businessType + '\'\,\'' + row.businessDataId + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';

                    var d = '<a href="#"  mce_href="#" title="删除" onclick="deletNews(this,\'' + row.objectId + '\'\,\'' + row.businessType + '\'\,\'' + row.businessDataId + '\')"><span class="glyphicon glyphicon-trash"></span></a> ';
                    if (row.businessType == 4) {
                        e = '<a href="#"   mce_href="#" title="查看" onclick="oneClick(\'' + row.objectId + '\'\,\'' + row.businessType + '\'\,\'' + row.businessDataId + '\')"><i class="glyphicon glyphicon-eye-open  "></i></span></a> ';
                    }
                    return e + d;
                }
            }],
            onLoadSuccess: function(data) { //加载成功时执行  
            },
            onClickRow: function(row) {
                //oneClick(row.objectId, row.businessType, row.businessDataId);
                setNewStatus(row.objectId);
            },
            onDblClickRow: function(row) {
                oneClick(row.objectId, row.businessType, row.businessDataId);
            },
        });
    };
    return oTableInit;
};

// 设置传入参数
function queryParams(params) {
    // var parameter = {, "token": token };
    var businessType = $("#businessType").val();
    var beginTime = $("#beginTime").val();
    var endTime = $("#endTime").val();
    var senderName = $("#senderName").val();
    var token = lsObj.getLocalStorage("token");
    var temp = {
        pageSize: this.pageSize, //页面大小
        pageNum: this.pageNumber, //当前页码
        token: lsObj.getLocalStorage("token"),
        businessType: businessType,
        beginTime: beginTime,
        endTime: endTime,
        senderName: senderName
    }
    console.log();
    return temp;
}
//设置边框底部页码
function responseHandler(res) {
    // alert(1)
    if (res.success == 1) {
        return {
            "rows": res.rows,
            "total": res.total
        }
    } else {
        return {
            "rows": [],
            "total": 0
        }
    }
}

//（单击查看消息，设置消息状态）
function setNewStatus(objectId) {
    //    console.log("单击");
    var token = lsObj.getLocalStorage("token");
    var parameter = {
        "objectId": objectId,
        "token": token,
    };
    //  $(".unread").css("display","none")//如果状态变成1，去掉未读
    // 已读未读的设置
    $.ajax({
        url: "/cloudlink-corrosionengineer/message/setMessageStatus",
        dataType: "json",
        method: "post",
        data: parameter,
        success: function(result) {
            var msgRead = $("#" + objectId);
            //console.log(msgRead);
            msgRead.css("visibility", "hidden") //双击的时候，如果原本是0变成1，传给后台
        }

    });
}

// 点击查看任务详情
function oneClick(objectId, businessType, businessDataId) {
    //    console.log("5555555");
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryTaskById?objectId=" + businessDataId,
        dataType: "json",
        method: "get",
        success: function(result) {
            if (result.success == 1) {
                //   console.log(result.success);
                // console.log(result);
                detectMethod = result.rows.taskinfo.detectMethod;
                taskStatus = result.rows.taskinfo.taskStatus;
                // console.log(businessDataId+"-"+detectMethod+"--"+taskStatus);
                //根据businessType跳转到不同的页面
                //console.log('businessDataId=='+businessDataId+"detectMethod=="+detectMethod+"taskStatus=="+taskStatus);
                switch (businessType) {
                    // case "1":           
                    // dataChecked(businessDataId, detectMethod, taskStatus); 
                    // break; 
                    // case "2":
                    // location.href="../../html/task/all-task.html"; 
                    // break; 
                    // case "3":
                    //   dataChecked(businessDataId, detectMethod, taskStatus); 
                    //    break; 
                    case "4":
                        dataChecked(businessDataId, detectMethod, taskStatus);
                        break;
                        // case "5":
                        // location.href="../../html/task/all-task.html"; 
                        // break; 
                        // case "6":
                        // location.href="../../html/task/all-task.html"; 
                        // break; 
                        // case "7":
                        // location.href="../../html/task/all-task.html"; 
                        // break; 
                }
            }
        }
    });
};

//根据查询条件重新加载数据
function queryReload() {
    $("#news").bootstrapTable('refresh', true)
}


//重置form表单
function clearForm() {
    document.getElementById("formSearch").reset();
    $('.selectpicker').selectpicker('val', null);
    queryReload();
}


//双击任务详细信息查看，
function dataChecked(objectId, detectMethod, taskStatus) {
    console.log(taskStatus);
    var viewUrl = "";
    // if (detectMethod == 1 || detectMethod == 2 || detectMethod == 5 || detectMethod == 7) {
    viewUrl = "src/html/task/specific_task/view_task.html?eventId=" + objectId + '&detectMethod=' + detectMethod;
    // console.log('我是111' + viewUrl);
    // } else if (detectMethod == 3 || detectMethod == 4 || detectMethod == 6) {
    //     viewUrl = "src/html/task/M3/dataDatection.html?eventId=" + objectId + "&detectMethod=" + detectMethod;
    //     //console.log('我是222'+viewUrl);
    // } else if (detectMethod == 8) {
    //     viewUrl = "src/html/task/M8/show-m8.html?eventId=" + objectId;
    //     //console.log('我是333'+viewUrl);
    // } else if (detectMethod == 9) {
    //     viewUrl = "src/html/task/M9/show-m9.html?eventId=" + objectId;
    //     // console.log('我是444'+viewUrl);
    // } else if (detectMethod == 10) {
    //     viewUrl = "src/html/task/M10/show-m10.html?eventId=" + objectId;
    //     // console.log('我是555'+viewUrl);
    // }
    var btnMess = ['关闭'];
    // if (taskStatus != "待审核") {
    //     btnMess = ['关闭'];
    // }
    var layer1 = parent.layer.open({
        type: 2,
        title: '查看任务及测试数据',
        area: ['950px', '600px'],
        btn: btnMess,
        content: viewUrl
    });
};

//删除消息
function deletNews(self, id, type, bid) {
    // console.log("111111111");
    // 把当前要删除的消息ID传到后台，进行删除，成功之后，从页面上删除
    layer.confirm("您确定要删除该消息吗？", {
        title: "提示",
        btn: ['确定', "取消"], //按钮
        skin: "self"
    }, function() {
        //从页面删除消息
        $(self).parents("tr").remove();
        layer.closeAll();
    });
}
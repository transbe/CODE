/**
 * @file
 * @author  lixiaolong
 * @desc 维修管理列表操作逻辑
 * @date  2017-07-13
 * @last modified by 
 * @last modified time  
 */
var roleNum = lsObj.getLocalStorage('params'); //获取角色 的标识
var userBo = JSON.parse(lsObj.getLocalStorage("userBo")); //获取useBo
var token = lsObj.getLocalStorage("token"); //获取token
var user = JSON.parse(lsObj.getLocalStorage("userBo")); //获取user
var enterpriseId = user.enterpriseId; //公司名称id
var numberPage; //定义页码

$(function(){
    
    //初始化Table
    loadTable();
    setTableHeight('taskTemplate');  //设置表格高度
});

/**
 * @desc 获取table表应有的高度
 */
function getTableHeight(){
    var contentH;
    var winH = $(window).height(),
        // bodyPaddingTop = parseInt($(".content-box").css("paddingTop")),
        // bodyPaddingBottom = parseInt($(".content-box").css("paddingBottom"));
        contentPaddingTop = parseInt($(".content-body").css('paddingTop')),
        contentPaddingBottom = parseInt($(".content-body").css('paddingBottom'));
    // contentH = winH - (bodyPaddingTop + bodyPaddingBottom) - (contentPaddingTop + contentPaddingBottom);
      contentH = winH - (contentPaddingTop + contentPaddingBottom);
    return contentH;
}

/**
 * @desc 初始化列表
 */
function loadTable() {
    var currentPageNumber; //定义当前页码
    var currentPageSize; //定义当前页大小
    var url = handleURL('/cloudlink-corrosionengineer/template/query?token=' + token); //对url进行权限处理
    try {
        $('#taskTemplate').bootstrapTable({
            url: url, //请求后台的URL（*）
            method: 'get', //请求方式（*）
            toolbar: "#toolbar",
            // height: setTableHeight(),
            pageSize: 50,
            queryParams: function (params) {
                numberPage = this.pageNumber;
                currentPageNumber = this.pageNumber;
                currentPageSize = this.pageSize;
                params.pageNum = -1;
                params.pageSize = this.pageSize; //页面大小s
                params.pageNum = this.pageNumber; //当前页码
                params.sortName = this.sortName;
                params.sortOrder = this.sortOrder;
                params.token = lsObj.getLocalStorage("token"); //token
                // params.enterpriseId = enterpriseId;
                return params;
            },
            columns: [{
                checkbox: true
            }, {
                title: getLanguageValue("No"),
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1;
                }
            }, {
                field: 'templateName',
                title: getLanguageValue("templateName"),
                width: '80%'
            }, {
                field: 'operation',
                title: getLanguageValue("operation"),
                width: '20%',
                class: 'td-nowrap',
                formatter: function (value, row, index) {
                    var divClass = "bg_con_on";
                    if(row.isVisible==0){
                        divClass = "bg_con_off"; 
                    }
                    var e = '<a href="#" mce_href="#" title = "'+getLanguageValue("view")+'" onclick="viewTemplate(\'' + row.objectId + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                    var d = '<a href="#" mce_href="#" title = "'+getLanguageValue("edit")+'" onclick="updateTemplate(\'' + row.objectId + '\')"><span class="glyphicon glyphicon-edit"></span></a> ';
                    var f = '<div class="switch_container" title = "在任务菜单中显示" onchange="showOrhide(\'' + row.objectId + '\',\'' + row.isVisible + '\',\'' + index + '\')">'+  
                                '<div class="bg_con '+divClass+'" >'+  
                                    '<input id="switch_'+index+'" type="checkbox" class="theHelper" />'+  
                                    '<label for="switch_'+index+'"></label>'+  
                                '</div>'+  
                            '</div>';
                    return e + d + f;
                }
            }],
            onDblClickRow: function (row) {
                viewTemplate(row.objectId);
            },
            responseHandler: function (res) { //加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
                if (res.success == 1) {
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('查询任务模板', {
                                "结果": "成功"
                            });
                        }
                    } catch (error) {

                    }
                    return {
                        total: res.list.length,
                        rows: res.list
                    }
                    // return res;
                } else {
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('查询任务模板', {
                                "结果": "失败"
                            });
                        }
                    } catch (error) {

                    }
                    layer.alert(getLanguageValue("load_data_error"), {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                }
            },
            onLoadSuccess:function(){
                setTableHeight();
            }
        });
    } catch (e) {
        alert(e);
    }
}
//是否在任务管理列表中显示
function showOrhide(objectId,isVisible,index){
    var isVisible = isVisible == 1?0:1;
    var data = {
        "objectIds": objectId,
        "isVisible":isVisible
    }
    $.ajax({
        url: "/cloudlink-corrosionengineer/template/setVisible?token=" + token,
        type: "post",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        async:false,
        success: function (res) {
            if (res.success == 1) {
                $('#taskTemplate').bootstrapTable('updateCell', {index: index, field: 'isVisible', value:isVisible });
                parent.loadSelfDefinedTemplate();
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('设置任务是否可见', {
                            '操作': '成功'
                        });
                    }
                } catch (error) {

                }
                parent.layer.msg(getLanguageValue("set-success"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
            } else {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('设置任务是否可见', {
                            '操作': '失败'
                        });
                    }
                } catch (error) {

                }
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
    });
}
/**
 * @desc 新增任务模板
 */
function addTemplate(){
    uncheck("add"); //取消按钮选中状态
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("addTaskTemplate"),
        area: ['100%', '100%'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancel")],
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            var addPage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = addPage.saveData();
                if (result == true) { //保存成功
                    parent.layer.close(index);
                    $('#taskTemplate').bootstrapTable('refresh', true); //刷新数据
                    parent.loadSelfDefinedTemplate();
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            // $("#addData").attr('disabled', false);
        },
        content: rootPath + "/src/html/enterprise_defintion/add_template.html?"
    });
}
/**
 * @desc 修改任务模板
 */
function updateTemplate(objectId){
    uncheck("update"); //取消按钮选中状态
    var preventDblClick = false;
    var objectId = objectId || "";
    if (objectId == "") {
        var rowDate = $('#taskTemplate').bootstrapTable('getSelections');
        if (rowDate.length != 1) {
            layer.alert(getLanguageValue("select_only_one"), {
                title: getLanguageValue("tip_title"),
                skin: 'self'
            });
            return;
        } else {
            objectId = rowDate[0].objectId;
        }
    }
    if(!validateTemplate(objectId)){
        return;
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("updateTaskTemplate"),
        area: ['100%', '100%'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancel")],
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            var addPage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = addPage.saveData();
                if (result == true) { //修改成功
                    parent.layer.close(index);
                    $('#taskTemplate').bootstrapTable('refresh', true); //刷新数据
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#addData").attr('disabled', false);
        },
        content: rootPath + "/src/html/enterprise_defintion/add_template.html?objectId=" + objectId
    });
}
/**
 * @desc 删除任务模板（前端逻辑处理）
 */
function deleteTemplate(){
    uncheck("delete"); //取消按钮选中状态
    var rowDate = $('#taskTemplate').bootstrapTable('getSelections');
    if (rowDate.length == 1) {
        if(!validateTemplate(rowDate[0].objectId)){
            return;
        }
        var index = layer.confirm(getLanguageValue("delete_no_view"), {
            title: getLanguageValue("tip_title"),
            skin: 'self', //按钮
        }, function () {
            removeRecord(rowDate[0].objectId);
            layer.close(index);
        });
    } else {
        layer.alert(getLanguageValue("select_only_one"), {
            title: getLanguageValue("tip_title"),
            skin: 'self'
        });
        return;
    }
}
/**
 * @desc 删除任务模板（与后台交互）
 */
function removeRecord(objectId) {
    var data = {
        "objectIds": objectId
    }
    $.ajax({
        url: "/cloudlink-corrosionengineer/template/delete?token=" + token,
        type: "post",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (res) {
            if (res.success == 1) {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('删除任务模板', {
                            '操作': '成功'
                        });
                    }
                } catch (error) {

                }
                var rows = $('#taskTemplate').bootstrapTable('getData', true); //获取当前页的数据
                var rows1 = $('#taskTemplate').bootstrapTable('getSelections'); //获取选中的数据
                if (numberPage != 1 && rows.length == rows1.length) { //页码不是1,当前页数量等于选中数量
                    $('#taskTemplate').bootstrapTable('prevPage'); //调转到上一页
                } else {
                    $('#taskTemplate').bootstrapTable('refresh', true); //刷新数据
                }
                parent.loadSelfDefinedTemplate();
                parent.layer.msg(getLanguageValue("delete_success"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
            } else {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('删除任务模板', {
                            '操作': '失败'
                        });
                    }
                } catch (error) {

                }
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
    });
}
/**
 * @desc 查看任务模板详情
 */
function viewTemplate(objectId){
    uncheck("view"); //取消按钮选中状态
    var preventDblClick = false;
    var objectId = objectId||"";
    if(objectId == ""){
        var rowDate = $('#taskTemplate').bootstrapTable('getSelections');
        if (rowDate.length != 1) {
            layer.alert(getLanguageValue("select_only_one"), {
                title: getLanguageValue("tip_title"),
                skin: 'self'
            });
            return;
        } else {
            objectId = rowDate[0].objectId;
        }
    }
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("viewTaskTemplate"),
        area: ['950px', '600px'],
        skin: 'self-iframe',
        btn: [getLanguageValue("cancel")],
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $('#taskTemplate').bootstrapTable('refresh', true);
        },
        content: rootPath + "/src/html/enterprise_defintion/view_template.html?objectId=" + objectId
    });
}
/**
 * @desc 修改、删除任务模板前的验证（与后台交互）
 */
function validateTemplate(objectId){
    var result = false;
    var data = {
        "objectId": objectId
    }
    $.ajax({
        url: "/cloudlink-corrosionengineer/template/operationValidate?token=" + token,
        type: "post",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        async:false,
        success: function (res) {
            if (res.success == 1&&res.result) {
                result = true;
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
    });
    return result;
}
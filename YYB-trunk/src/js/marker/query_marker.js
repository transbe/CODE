/**
 * @file
 * @author: gaohui
 * @desc:测试桩管理主页面右侧列表操作逻辑
 * @date: 2017-03-02
 * @last modified by: lujingrui
 * @last modified time: 2017-06-12 10:29:22
 */
var numberPage; //定义一个全局的页码值
var currentPageSize; //定义一个全局的页面大小
var token = "";
var enterpriseId = ""; //企业id
$(function () {
    changePageStyle("../.."); // 换肤
    firstLogin(); // 判断是否是第一次登陆，第一次展示向导

    token = lsObj.getLocalStorage('token');
    var user = JSON.parse(lsObj.getLocalStorage("userBo"));
    enterpriseId = user.enterpriseId;

    //加载table
    loadTable();
    //设置table高度
    setTableHeight('markerTable');

    //回车查询
    $("#markerFrom:not(.marker-type)").on("keydown",function(e){
        if (e.keyCode == "13") { //keyCode=13是回车键
            query();  
            return false;//阻止表单提交
        }
    });

    $(".marker-type .btn:first-child").addClass("focus");
    uncheck("all");
    // 多选按钮添加/去除live类
    $(".marker-type").on('click', '.btn', function (e) {
        uncheck(this.id);
        if (this.id != "all") {
            this.value = (this.value == 0) ? 1 : 0;
            $("#all").removeClass("focus");
            $(this).toggleClass("focus");
            $(this).find(".triangle-div").toggleClass("triangle");
        } else {
            $(".marker-type .btn").removeClass("focus");
            $(".marker-type .btn").find(".triangle-div").removeClass("triangle");
            $(".marker-type .btn").val(0);
            $(this).addClass("focus");
        }
        if (!$(".marker-type .btn").hasClass("focus")) {
            $("#all").addClass("focus");
        }
        query();
    });

    $(".marker-environment .btn:first-child").addClass("focus");
    uncheck("markerEnvironment");
     // 多选按钮添加/去除live类
    $(".marker-environment").on('click', '.btn', function (e) {
        uncheck(this.id);
        if (this.id != "markerEnvironment") {
            this.value = (this.value == 0) ? 1 : 0;
            $("#markerEnvironment").removeClass("focus");
            $(this).toggleClass("focus");
            $(this).find(".triangle-div").toggleClass("triangle");
        } else {
            $(".marker-environment .btn").removeClass("focus");
            $(".marker-environment .btn").find(".triangle-div").removeClass("triangle");
            $(".marker-environment .btn").val(0);
            $(this).addClass("focus");
        }
        if (!$(".marker-environment .btn").hasClass("focus")) {
            $("#markerEnvironment").addClass("focus");
        }
        query();
    });
});

/**
 * @desc 初始化加载table
 */
function loadTable() {
    $('#markerTable').bootstrapTable({
        url: handleURL('/cloudlink-corrosionengineer/marker/queryMarkerForPage?token=' + lsObj.getLocalStorage('token')),
        method: 'get',
        toolbar: '#toolbar',
        clickToSelect: false,
        queryParams: queryParams, // 分页参数
        responseHandler: responseHandler,
        columns: [
            [{
                    checkbox: 'true',
                    rowspan: 2

                }, {

                    title: getLanguageValue("No"),
                    rowspan: 2,
                    formatter: function (value, row, index) {
                        return currentPageSize * (numberPage - 1) + index + 1;
                    }
                },
                {

                    sortable: true,
                    field: 'markerNumber',
                    title: getLanguageValue("markerNumber"),
                    rowspan: 2,
                    width: "10%"
                },
                {

                    field: 'pipelineName',
                    sortable: true,
                    title: getLanguageValue("pipelineName"),
                    rowspan: 2,
                    width: "9%"
                },
                {

                    sortable: true,
                    field: 'mileage',
                    title: getLanguageValue("mileage"),
                    rowspan: 2,
                    width: "9%"
                },
                {

                    title: getLanguageValue("markerType"),
                    colspan: 5,
                    width: "54%"
                },
                {

                    title: getLanguageValue("TypeofEnvironment"),
                    colspan: 4,
                    width: "54%"
                },
                {

                    field: 'position',
                    title:  getLanguageValue("position"),
                    rowspan: 2,
                    width: "9%"
                },
                {

                    field: 'Operation',
                    title: getLanguageValue("Operation"),
                    rowspan: 2,
                    width: "9%",
                    class:"td-nowrap",
                    formatter: function (value, row, index) {
                        var res = "<a href='#'><i class='glyphicon glyphicon-eye-open'  title='"+getLanguageValue("option.view")+"' onclick=\"viewMarker('" + row.objectId + "')\"></i></a>";
                        if (!judgePrivilege()) {
                            res += "<a href='#'><i class='glyphicon glyphicon-edit' title='"+getLanguageValue("option.update")+"' onclick=\"updateOneMarker('" + row.objectId + "','" + row.pipelineId + "')\"></i></a>";
                        }
                        return res;
                    }
                }
            ],
            [{
                    field: 'isDrivepipe',
                    title: getLanguageValue("isDrivepipe"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify'  title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {
                    field: 'isInsulatedJoint',
                    title: getLanguageValue("isInsulatedJoint"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {
                    field: 'isDrainageAnode',
                    title: getLanguageValue("isDrainageAnode"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {
                    field: 'isDirectionalDrilling',
                    title: getLanguageValue("isDirectionalDrilling"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {
                    field: 'isRecitifierNearest',
                    title: getLanguageValue("isRecitifierNearest"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {
                    field: 'isHighVoltageCorridor', // 高压走廊
                    title: getLanguageValue("isHighVoltageCorridor"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {
                    field: 'isSubwayParallel',
                    title: getLanguageValue("isSubwayParallel"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {
                    field: 'isCrossParallelArea',
                    title: getLanguageValue("isCrossParallelArea"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {
                    field: 'isHighConsequenceArea',
                    title: getLanguageValue("isHighConsequenceArea"),
                    sortable: true,
                    width: "9%",
                    formatter: function (value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                }
            ]
        ],
        onDblClickRow: function (row) {
            viewMarker(row.objectId);
        },
        onLoadSuccess: function (rows) {
            $(".fixed-table-container").css("background-color", "#edf1f2");
            if ($.fn.bootstrapTable.defaults.showRefresh == true) {
                $(".pull-right.columns-right button[name='refresh']").off("click").on('click', function () {
                    isSavedBatchModify();
                    if ($("#updateMarker").text().trim() == getLanguageValue("update")) {
                        $("#markerTable").bootstrapTable('refresh', true);
                    }
                });
            }
        },
        onPageChange: function (number, size) {
            isSavedBatchModify();
        },
        onClickCell: function (field, value, row, $element) {
            //单击 测试桩类型列的时候触发事件
            if ((field == "isDrivepipe"|| field == "isInsulatedJoint" || field == "isDrainageAnode" || field == "isDirectionalDrilling" || field == "isRecitifierNearest" || field == "isHighVoltageCorridor"  || field == "isSubwayParallel"  || field == "isCrossParallelArea"  || field == "isHighConsequenceArea" ) && $element.find("input").length == 1) {
                $element.find("input").trigger('click');
            }
        }
    });
}


/**
 * @desc 后台返回数据处理
 * @param {json} res 后台返回数据列表
 */
function responseHandler(res) {
    if (res.success == 1) {
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('查询测试桩', {
                    '结果': '成功'
                });
            }
        } catch (err) {
            //在此处理错误
        }
        return res;
    } else {
        try {
            if (zhugeSwitch == 1) {
                zhuge.track('查询测试桩', {
                    '结果': '失败'
                });
            }
        } catch (err) {
            //在此处理错误
        }
        layer.alert('加载数据出错', {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
    }
}

/**
 * @desc 设置传入参数
 * @param {json} params 向后台传递参数
 */
function queryParams(params) {
    currentPageSize = params.limit;
    numberPage = this.pageNumber;
    temp = {
        sortName: this.sortName, //排序字段
        sortOrder: this.sortOrder, //排序方式
        pageSize: params.limit, //页面大小
        pageNum: this.pageNumber, //当前页码
        pipelineId: pipelineId, //管线id  
        markerNumber: $('#markerNumber').val(), //测试桩编号
        isDrivepipe: $('#isDrivepipe').val(), //套管测试桩
        isInsulatedJoint: $('#isInsulatedJoint').val(), //绝缘接头桩
        isDrainageAnode: $('#isDrainageAnode').val(), //排流(牺牲阳极)桩
        isDirectionalDrilling: $('#isDirectionalDrilling').val(), //定向钻桩
        isRecitifierNearest: $('#isRecitifierNearest').val(), //距恒电位仪最近

        isHighVoltageCorridor:$('#isHighVoltageCorridor').val(), // 高压走廊
        isSubwayParallel :$('#isSubwayParallel').val(), // 地铁平行/交叉 
        isCrossParallelArea : $('#isCrossParallelArea').val(), //在交叉并行区域
        isHighConsequenceArea : $('#isHighConsequenceArea').val(), // 高后果区
        isCommon: $('#isCommon').val()
    }
    return temp;
}
/**
 * @desc 判断批量修改是否保存（点击页面上新增，修改等按钮后触发该方法，如果返回true，则执行正在进行的操作，否则提示是否保存批量修改）
 */
function isSavedBatchModify() {
    text = $("#updateMarker").text().trim();
    if (text != getLanguageValue("batchSave")) {
        return true
    }
    var index = layer.confirm(getLanguageValue("tip_isSave"), {
        title: getLanguageValue("tip"),
        btn: [getLanguageValue("submit"), getLanguageValue("cancle")], //按钮
        skin: 'self'
    }, function () {
        updateMarker();
        layer.close(index);
    }, function () {
        $("#updateMarker").empty();
        s = "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span> "+getLanguageValue("update")
        document.getElementById("updateMarker").innerHTML += s;
        $("#updateMarker").removeClass("batchsave");
        var rows = $('#markerTable').bootstrapTable('getData', true);
        console.log("111");
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].isDrivepipe == 1) {  // 套管桩
                $("#markerTable tbody tr").eq(i).find("td").eq(5).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(5).find(".Maymodify").html('-')
            }
            if (rows[i].isInsulatedJoint == 1) { // 绝缘接头桩
                $("#markerTable tbody tr").eq(i).find("td").eq(6).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(6).find(".Maymodify").html('-')
            }
            if (rows[i].isDrainageAnode == 1) { // 排流桩
                $("#markerTable tbody tr").eq(i).find("td").eq(7).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(7).find(".Maymodify").html('-')
            }
            if (rows[i].isDirectionalDrilling == 1) { // 定向钻桩
                $("#markerTable tbody tr").eq(i).find("td").eq(8).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(8).find(".Maymodify").html('-')
            }
            if (rows[i].isRecitifierNearest == 1) { // 汇流桩
                $("#markerTable tbody tr").eq(i).find("td").eq(9).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(9).find(".Maymodify").html('-')
            }
            if (rows[i].isHighVoltageCorridor == 1) { // 高压走廊
                $("#markerTable tbody tr").eq(i).find("td").eq(10).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(10).find(".Maymodify").html('-')
            }
            if (rows[i].isSubwayParallel == 1) { // 地铁平行/交叉
                $("#markerTable tbody tr").eq(i).find("td").eq(11).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(11).find(".Maymodify").html('-')
            }
            if (rows[i].isCrossParallelArea == 1) { // 管道平行/交叉
                $("#markerTable tbody tr").eq(i).find("td").eq(12).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(12).find(".Maymodify").html('-')
            } 
            if (rows[i].isHighConsequenceArea == 1) { // 高后果区
                $("#markerTable tbody tr").eq(i).find("td").eq(13).find(".Maymodify").html('&#10004;')
            } else {
                $("#markerTable tbody tr").eq(i).find("td").eq(13).find(".Maymodify").html('-')
            }
            $("#markerTable").bootstrapTable('refresh', true);
        }
    })
    return false;
}

/**
 * @desc 重新刷新页面的方法
 */
function reloadPage() {
    $("#markerTable").bootstrapTable('refresh', true)
}

/**
 * @desc 测试桩新增
 */
function addMarker() {
    if (!isSavedBatchModify()) { //判断批量修改是否保存
        return;
    };
    if (canAddMarker != 1) { //判断是否选中管线 
        layer.alert(getLanguageValue("tip_addError"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    $("#addData").attr('disabled', true);
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("addTest_Head"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancle")], //按钮
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            var addPage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = addPage.saveData();
                if (result == true) { //保存成功
                    parent.layer.close(index);
                    reloadPage();
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#addData").attr('disabled', false);
        },
        content: rootPath + "/src/html/marker/add_marker.html?pipelineId=" + pipelineId + '&pipelinenameForTable=' + pipelinenameForTable
    });
}

/**
 * @desc 调整测试桩顺序
 */
function sortMarker() {
    if (!isSavedBatchModify()) {
        return;
    };
    if (canAddMarker != 1) {
        layer.alert(getLanguageValue("sort_marker_Tip"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    $("#sortMarker").attr('disabled', true);
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("sort_marker_Head"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancle")], //按钮
        skin: 'self-iframe',
        yes: function (index, layero) {
            var sortPage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = sortPage.saveSortMarker();
                if (result == true) {
                    parent.layer.close(index);
                    reloadPage();
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#sortMarker").attr('disabled', false);
        },
        content: rootPath + "/src/html/marker/sort_marker.html?pipelineId=" + pipelineId
    });
}

/**
 * @desc 测试桩修改
 */
function updateOneMarker(objectId, pipeLineID) {
    if (!isSavedBatchModify()) {
        return;
    };
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("update_marker_title"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("submit"), getLanguageValue("cancle")], //按钮
        skin: 'self-iframe',
        maxmin: false,
        yes: function (index, layero) {
            var save = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = save.saveUpdateData();
                if (result == true) { //修改成功
                    parent.layer.close(index);
                    reloadPage();
                } else {
                    preventDblClick = false;
                }
            }

        },
        btn2: function (index, layero) {},
        content: rootPath + "/src/html/marker/update_marker.html?objectId=" + objectId + '&pipelineId=' + pipeLineID
    });
}

/**
 * @desc 测试桩导入
 */
function importMarker() {
    if (!isSavedBatchModify()) {
        return;
    };
    if (canAddMarker != 1) {
        layer.alert(getLanguageValue("import_title"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    $("#importData").attr('disabled', true);
    var preventDblClick = false;
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("import_tip_head"),
        area: ['500px', '450px'],
        btn: [getLanguageValue("btn_upload"), getLanguageValue("btn_close")], //按钮
        skin: 'self-iframe',
        yes: function (index, layero) {
            var savePage = layero.find('iframe')[0].contentWindow;
            if (!preventDblClick == true) {
                preventDblClick = true;
                var result = savePage.importData();
                if (result == true) {
                    parent.$('.layui-layer-btn0').css('display', 'none');
                    parent.$('.layui-layer-btn1').html(getLanguageValue("btn_close"));
                    reloadPage();
                } else {
                    preventDblClick = false;
                }
            }
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            $("#importData").attr('disabled', false);
        },
        content: rootPath + "/src/html/marker/import_marker.html?pipeLineId=" + pipelineId + '&isAdd=' + canAddMarker + '&pipelinenameForTable=' + pipelinenameForTable
    });
}
function nextPage(){
    $('#table').bootstrapTable('method', parameter);
}
/**
 * @desc 测试桩查看
 * @param {string} objectId 测试桩id
 */
function viewMarker(objectId) {
    if (!isSavedBatchModify()) {
        return;
    };
    /*****************************处理上一个下一个桩快捷查看（开始）lixiaolong**************************/ 
    var dataArr =  $('#markerTable').bootstrapTable('getData');
    var objectIds = "";
    for(var i = 0;i < dataArr.length;i++){
        if(dataArr[i].objectId!=""&&dataArr[i].objectId!=null){
            if(i==dataArr.length-1){
                objectIds = objectIds + dataArr[i].objectId;
            }else{
                objectIds = objectIds + dataArr[i].objectId + ",";
            }
        }
    }
    lsObj.setLocalStorage("markerObjectIds",objectIds);
    /*****************************处理上一个下一个桩快捷查看（结束）********************************/ 
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("view_Marker"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("btn_close")],
        skin: 'self-iframe',
        no: function (index, layero) {
            var viewPage = layero.find('iframe')[0].contentWindow;
            viewPage.viewData();
        },
        btn2: function (index, layero) {},
        content: rootPath + "/src/html/marker/view_marker.html?objectId=" + objectId
    })
}

/**
 * @desc 删除选中行数据
 */
function deleteMarker() {
    //test
    if (!isSavedBatchModify()) {
        return;
    };
    var rows = $('#markerTable').bootstrapTable('getSelections');
    if (rows.length == 0) {
        layer.alert(getLanguageValue("please_SelectOne"),{
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    var objectId = "";
    for (var i = 0; i < rows.length; i++) {
        if (i != rows.length - 1) {
            objectId += rows[i].objectId + ","
        } else {
            objectId += rows[i].objectId
        }
    }
    $.ajax({
        url: "/cloudlink-corrosionengineer/marker/queryDataForDelete?token=" + lsObj.getLocalStorage('token'),
        method: 'get',
        dataType: 'json',
        data: {
            "objectIds": objectId
        },
        success: function (result) {
            if (result.success == 1 && result.hasData == "true") { //所选测试桩在任务中存在
                layer.alert(getValueHasArgs("delete_tip",[result.data]), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert',
                });
            } else if (result.success == 1 && result.hasData == "false") { //所选测试桩不在任务中存在
                layer.confirm(getLanguageValue("comfim_delete"), {
                    title: getLanguageValue("tip"),
                    skin: 'self'
                }, function () {
                    $.ajax({
                        method: "POST",
                        dataType: "json",
                        url: "/cloudlink-corrosionengineer/marker/deleteMarker?token=" + lsObj.getLocalStorage('token'),
                        contentType: "application/json; charset=utf-8",
                        data:JSON.stringify({
                            "objectIds": objectId
                        }), //删除当前id的plan,
                        //记得做未成功清空/提示
                        success: function (result) {
                            if (result.success == 1) {
                                layer.msg(getLanguageValue("delete_success"), {
                                    time: MSG_DISPLAY_TIME,
                                    skin: "self-msg"
                                });
                                var rows = $('#markerTable').bootstrapTable('getData', true);
                                var rows1 = $('#markerTable').bootstrapTable('getSelections');
                                if (numberPage != 1 && rows.length == rows1.length) {
                                    $('#markerTable').bootstrapTable('prevPage');
                                } else {
                                    reloadPage()
                                }
                                try {
                                    if (zhugeSwitch == 1) {
                                        zhuge.track('删除测试桩', {
                                            '结果': '成功'
                                        });
                                    }
                                } catch (err) {
                                    //在此处理错误
                                }

                            } else {
                                layer.alert(result.msg, {
                                    title: getLanguageValue("tip"),
                                    skin: 'self-alert'
                                });
                                reloadPage();
                                try {
                                    if (zhugeSwitch == 1) {
                                        zhuge.track('删除测试桩', {
                                            '结果': '失败'
                                        });
                                    }
                                } catch (err) {
                                    //在此处理错误
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                            layer.alert(NET_ERROR_MSG, {
                                title: getLanguageValue("tip"),
                                skin: 'self-alert'
                            });
                        }
                    });
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 清空查询条件
 */
function resetForm() {
    if (!isSavedBatchModify()) {
        return;
    };
    document.getElementById("markerFrom").reset();
    // $("input[name='markerType']").val(0);
    $(".marker-checkbox .btn").removeClass("focus");
    $(".marker-checkbox").find(".btn:first-child").addClass("focus");
    $(".marker-checkbox .btn").find(".triangle-div").removeClass("triangle");
    $(".marker-checkbox .btn").val(0);
    $("#markerTable").bootstrapTable("refreshOptions", {
        "pageNumber": 1,
        "sortName": "",
        "sortOrder": ""
    })
}

// var markerNumber = ""; //定义查询表单中的测试桩编号
// var isDrivepipe = ""; //套管测试桩
// var isCrossParallelArea = "" //在交叉并行区域
// var isInsulatedJoint = "" //绝缘接头桩
// var isDrainageAnode = "" //排流(牺牲阳极)桩
// var isDirectionalDrilling = "" //定向钻桩	
// var isRecitifierNearest = "" //距恒电位仪最近

/**
 * @desc 执行查询
 */
function query() {
    
    if (!isSavedBatchModify()) {
        return;
    };
    $("#markerTable").bootstrapTable("refreshOptions", {
        "pageNumber": 1,
        "sortName": "",
        "sortOrder": ""
    })
}

//存放临时数据 （翻页时确认批量修改是否保存时存放）
var updateAllJson = {
    "objectId": "",
    "isDrivepipe": "", // 套管桩
    "isInsulatedJoint": "",// 绝缘接头桩
    "isDrainageAnode": "",// 排流桩
    "isDirectionalDrilling": "",// 定向钻桩
    "isRecitifierNearest": "", // 汇流桩
   
    "isHighVoltageCorridor":"",//高压走廊
    "isSubwayParallel":"",//地铁平行/交叉
    "isCrossParallelArea": "", // 管道平行/交叉
    "isHighConsequenceArea":""//高后果区
}

/**
 * @desc 批量修改
 */
function updateMarker() {
    uncheck("updateMarker")
    var data = $('#markerTable').bootstrapTable('getData', true);
    // console.log(data);
    if (data.length == 0) {
        $("#updateMarker").empty();
        s = "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span> "+getLanguageValue("update")
        document.getElementById("updateMarker").innerHTML += s;
        $("#updateMarker").removeClass("batchsave");
        return
    }
    if ($("#updateMarker").hasClass("batchsave")) { //批量保存
        //$("#updateMarker").text("批量修改").removeClass("batchsave");
        $("#updateMarker").empty();
        s = "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span> "+getLanguageValue("update")
        document.getElementById("updateMarker").innerHTML += s;
        $("#updateMarker").removeClass("batchsave");
        //数据提交并刷新数据
        for (var i = 0; i < data.length; i++) {
            updateAllJson.objectId += data[i].objectid + ","
            updateAllJson.isDrivepipe += $("#markerTable tbody tr").eq(i).find("td").eq(5).find(".Maymodify").attr('title') + ","  // 套管桩
            updateAllJson.isInsulatedJoint += $("#markerTable tbody tr").eq(i).find("td").eq(6).find(".Maymodify").attr('title') + ","  // 绝缘接头桩
            updateAllJson.isDrainageAnode += $("#markerTable tbody tr").eq(i).find("td").eq(7).find(".Maymodify").attr('title') + ","  // 排流桩
            updateAllJson.isDirectionalDrilling += $("#markerTable tbody tr").eq(i).find("td").eq(8).find(".Maymodify").attr('title') + ","  // 定向钻桩
            updateAllJson.isRecitifierNearest += $("#markerTable tbody tr").eq(i).find("td").eq(9).find(".Maymodify").attr('title') + ","  // 汇流桩
            updateAllJson.isHighVoltageCorridor += $("#markerTable tbody tr").eq(i).find("td").eq(10).find(".Maymodify").attr('title') + "," //高压走廊
            updateAllJson.isSubwayParallel += $("#markerTable tbody tr").eq(i).find("td").eq(11).find(".Maymodify").attr('title') + "," //地铁平行/交叉
            updateAllJson.isCrossParallelArea += $("#markerTable tbody tr").eq(i).find("td").eq(12).find(".Maymodify").attr('title') + ","  // 管道平行/交叉
            updateAllJson.isHighConsequenceArea += $("#markerTable tbody tr").eq(i).find("td").eq(13).find(".Maymodify").attr('title') + "," //高后果区
        }
        $.ajax({
            url: '/cloudlink-corrosionengineer/marker/updateMarkerAll?token=' + lsObj.getLocalStorage('token'),
            method: 'post',
            contentType:"application/json;chatset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                "objectIds": updateAllJson.objectId,
                "isDrivepipes": updateAllJson.isDrivepipe,  // 套管桩
                "isInsulatedJoints": updateAllJson.isInsulatedJoint,  // 绝缘接头桩
                "isDrainageAnodes": updateAllJson.isDrainageAnode,  // 排流桩
                "isDirectionalDrillings": updateAllJson.isDirectionalDrilling,  // 定向钻桩
                "isRecitifierNearests": updateAllJson.isRecitifierNearest,  // 汇流桩
                "isHighVoltageCorridor":updateAllJson.isHighVoltageCorridor,  //高压走廊
                "isSubwayParallel":updateAllJson.isSubwayParallel, //地铁平行/交叉
                "isCrossParallelAreas": updateAllJson.isCrossParallelArea, // 管道平行/交叉
                "isHighConsequenceArea":updateAllJson.isHighConsequenceArea //高后果区
            }),
            success: function (result) {
                if (result.success == 1) {
                    layer.msg(getLanguageValue("updateSuccessTip"), {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });

                    // reloadPage()
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('修改测试桩', {
                                '结果': '成功'
                            });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                } else {
                    layer.alert(result.msg, {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('修改测试桩', {
                                '结果': '失败'
                            });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                    reloadPage()
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                reloadPage();
            }
        })
        $('#markerTable span.Maymodify[title="1"]').html("<span class='Maymodify' title='1'>&#10004;</span>")
        $('#markerTable span.Maymodify[title="0"]').html("<span class='Maymodify' title='0'>-</span>")
    } else { //批量修改
        $("#updateMarker").empty();
        s = "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> "+getLanguageValue("batchSave")
        document.getElementById("updateMarker").innerHTML += s;
        $("#updateMarker").addClass("batchsave");
        // $(".bs-checkbox").attr('disabled',true)
        $('#markerTable span.Maymodify[title="0"]').html("<input value='0' onclick='inputClick(event)' type='checkbox'>");
        $('#markerTable span.Maymodify[title="1"]').html("<input value='1' onclick='inputClick(event)' type='checkbox' checked='checked'>");
    }
}


/**
 * @desc 点击批量修改时，操作table里的复选框时触发该事件
 */
function inputClick(e) {
    var _this = e.target;
    var data = $('#markerTable').bootstrapTable('getData', true);
    _this.value = (_this.value == 0) ? 1 : 0
    $(_this).parent().attr('title', _this.value);
    for (var i = 0; i < data.length; i++) {
        updateAllJson.objectId += data[i].objectId + ","
        updateAllJson.isDrivepipe += $("#markerTable tbody tr").eq(i).find("td").eq(5).find(".Maymodify").attr('title') + ","
        updateAllJson.isInsulatedJoint += $("#markerTable tbody tr").eq(i).find("td").eq(6).find(".Maymodify").attr('title') + ","
        updateAllJson.isDrainageAnode += $("#markerTable tbody tr").eq(i).find("td").eq(7).find(".Maymodify").attr('title') + ","
        updateAllJson.isDirectionalDrilling += $("#markerTable tbody tr").eq(i).find("td").eq(8).find(".Maymodify").attr('title') + ","
        updateAllJson.isRecitifierNearest += $("#markerTable tbody tr").eq(i).find("td").eq(9).find(".Maymodify").attr('title') + ","
        updateAllJson.isHighVoltageCorridor += $("#markerTable tbody tr").eq(i).find("td").eq(10).find(".Maymodify").attr('title') + "," //高压走廊
        updateAllJson.isSubwayParallel += $("#markerTable tbody tr").eq(i).find("td").eq(11).find(".Maymodify").attr('title') + "," //地铁平行/交叉
        updateAllJson.isCrossParallelArea += $("#markerTable tbody tr").eq(i).find("td").eq(12).find(".Maymodify").attr('title') + ","
        updateAllJson.isHighConsequenceArea += $("#markerTable tbody tr").eq(i).find("td").eq(13).find(".Maymodify").attr('title') + "," //高后果区
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

/**
 * @desc 导出选中数据
 */
function exportSelect() {
    if (!isSavedBatchModify()) {
        return;
    };
    // 找到所有被选中行
    var rows = $('#markerTable').bootstrapTable('getSelections');
    if (enterpriseId == "" || enterpriseId == null) {
        layer.alert(getLanguageValue("loginAgain"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    if (rows.length == 0) {
        layer.alert(getLanguageValue("tip_selectTip"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    var objectids = "";
    for (var i = 0; i < rows.length; i++) {
        if (i != rows.length - 1) {
            objectids += rows[i].objectId + ","
        } else {
            objectids += rows[i].objectId
        }
    }

    var markerNumber = $('#markerNumber').val(),
        isDrivepipe = $('#isDrivepipe').val(),
        isInsulatedJoint = $('#isInsulatedJoint').val(),
        isDrainageAnode = $('#isDrainageAnode').val(),
        isDirectionalDrilling = $('#isDirectionalDrilling').val(),
        isRecitifierNearest = $('#isRecitifierNearest').val();

        isHighVoltageCorridor = $('#isHighVoltageCorridor').val(),
        isSubwayParallel = $('#isSubwayParallel').val(),
        isCrossParallelArea = $('#isCrossParallelArea').val(),
        isHighConsequenceArea = $('#isHighConsequenceArea').val(),

    //导出文件访问的url
    url = '/cloudlink-corrosionengineer/marker/exportMarkerExcel?pipelineId=' + pipelineId + 
        '&markerNumber=' + markerNumber + 
        '&isDrivepipe=' + isDrivepipe + 
        '&isInsulatedJoint=' + isInsulatedJoint + 
        '&isDrainageAnode=' + isDrainageAnode +
        '&isDirectionalDrilling=' + isDirectionalDrilling + 
        '&isRecitifierNearest=' + isRecitifierNearest +
        '&isHighVoltageCorridor=' + isHighVoltageCorridor +
        '&isSubwayParallel=' + isSubwayParallel +
        '&isHighConsequenceArea=' + isHighConsequenceArea +
        '&isCrossParallelArea=' + isCrossParallelArea + 
        '&objectIds=' + objectids +
        '&token=' + lsObj.getLocalStorage('token');
    $("#exportExcelIframe").attr("src", url); //下载导出文件
    uncheck("exportSelect");

    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出选中测试桩');
        }
    } catch (err) {
        //在此处理错误
    }
}

/**
 * @desc 导出全部数据
 */
function exportAll() {
    if (!isSavedBatchModify()) {
        return;
    };
    //验证token是否失效
    if (enterpriseId == "" || enterpriseId == null) {
        layer.alert(getLanguageValue("loginAgain"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }

    var markerNumber = $('#markerNumber').val(),
        isDrivepipe = $('#isDrivepipe').val(),
        isInsulatedJoint = $('#isInsulatedJoint').val(),
        isDrainageAnode = $('#isDrainageAnode').val(),
        isDirectionalDrilling = $('#isDirectionalDrilling').val(),
        isRecitifierNearest = $('#isRecitifierNearest').val(),

        isHighVoltageCorridor = $('#isHighVoltageCorridor').val(),
        isSubwayParallel = $('#isSubwayParallel').val(),
        isCrossParallelArea = $('#isCrossParallelArea').val(),
        isHighConsequenceArea = $('#isHighConsequenceArea').val(),

        isCommon = $("#isCommon").val();
    var objectids = "";

    url = '/cloudlink-corrosionengineer/marker/exportMarkerExcel?pipelineId=' + pipelineId + 
        '&markerNumber=' + markerNumber + 
        '&isDrivepipe=' + isDrivepipe + 
        '&isInsulatedJoint=' + isInsulatedJoint + 
        '&isDrainageAnode=' + isDrainageAnode +
        '&isDirectionalDrilling=' + isDirectionalDrilling +
        '&isRecitifierNearest=' + isRecitifierNearest +
        '&isHighVoltageCorridor=' + isHighVoltageCorridor +
        '&isSubwayParallel=' + isSubwayParallel +
        '&isCrossParallelArea=' + isCrossParallelArea +
        '&isHighConsequenceArea=' + isHighConsequenceArea + 
        '&objectIds=' + objectids +
        '&token=' + lsObj.getLocalStorage('token') + 
        '&isCommon=' + isCommon+
        '&language='+ lsObj.getLocalStorage('i18nLanguage');
    $("#exportExcelIframe").attr("src", url);
    uncheck("exportAll");

    try {
        if (zhugeSwitch == 1) {
            zhuge.track('导出全部测试桩');
        }
    } catch (err) {
        //在此处理错误
    }
}
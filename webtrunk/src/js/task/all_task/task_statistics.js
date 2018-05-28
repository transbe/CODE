/**
 * @file
 * @author  lizhenzhen
 * @desc 全部任务统计图
 * @date  2017-03-02
 * @last modified by lizhenzhen
 * @last modified time  2017-06-13 15:59:42
 */

var token = lsObj.getLocalStorage("token"); //定义全局token
var pipelineid; //定义全局管线ID

$(function() {
    changePageStyle("../../..");
    //    时间插件
    $("#year").datetimepicker({
        format: 'yyyy',
        autoclose: true,
        startView: "decade",
        minView: 4,
        pickTime: false
    });

    //获取管线下拉框
    getPipeline();
    // makeStatic();
})

/**
 * @desc 获取管线下拉框
 */
function getPipeline() {
    var url = handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token); //对url进行权限处理
    $('#treeview').jstree({
            core: {
                multiple: false,
                animation: 0,
                check_callback: true,
                themes: {
                    dots: false
                },
                //强制将节点文本转换为纯文本，默认为false
                force_text: true,
                data: function(obj, cb) {
                    var dataItem;

                    $.ajax({
                            url: url,
                            method: "get",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            async: false
                        })
                        .done(function(res) {
                            if (res.success == 1) {
                                dataItem = res.treeList;
                            } else {
                                parent.layer.alert(res.msg, {
                                    title: getLanguageValue("tip_title"),
                                    skin: 'self-alert'
                                });
                            }
                        })
                        .fail(function(XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                            parent.layer.alert(NET_ERROR_MSG, {
                                title: getLanguageValue("tip_title"),
                                skin: 'self-alert'
                            });
                        })
                    cb.call(this, dataItem);
                }
            },
            sort: function(a, b) {
                return this.get_node(a).original.orderNumber - 0 > this.get_node(b).original.orderNumber - 0 ? 1 : -1;
            },
            types: {
                "pipeline-folder": {
                    icon: 'folder-icon'
                },
                "pipeline": {
                    icon: 'pipeline-icon',
                    valid_children: []
                }
            },
            plugins: ["types", "sort"]
        })
        .on('loaded.jstree', function(e, data) {
            var inst = data.instance;  
            var firstId  = $("#treeview").find("li:first").attr("id");
            if(!isNull(firstId)){
                 $('#treeview').jstree('select_node',firstId,true);
                 makeStatic();
            }else{
                 layer.alert(getLanguageValue("selectCheck"),{
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                 })
            }
            $("#pipeName").focus(function() {
                showMenu();
            });
        })
        .on('select_node.jstree', function(e, data) {
            pipelineid = data.node.id;
            $("#pipeName").val(data.node.text);
            hideMenu();
        });
}

/**
 * @desc 列出管线下拉树
 */
function showMenu() {
    var pipleZtreeObj = $("#pipeName");
    var pipleZtreeOffset = $("#pipeName").offset();
    $("#menuContent").css({ left: pipleZtreeOffset.left + "px", top: pipleZtreeOffset.top + pipleZtreeObj.outerHeight() + "px" }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}

/**
 * @desc 隐藏下拉树
 */
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}


/**
 * @desc 失去焦点事件
 * @param {*String} event
 */
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

/**
 * @desc 点击统计做统计
 * @method makeStatic
 */
function makeStatic() {
    var year = $("#year").val();
    var pipelineName = $("#pipeName").val();
    if (pipelineName && pipelineName != null && year && year != null) {
        try {
            if (tjSwitch == 1) {
                tjSdk.track('任务统计', { '任务类型': '全部任务', '结果': '成功' });
            }
        } catch (e) {

        }
        getStaticData(pipelineid, year);
    } else {
        parent.layer.alert(getLanguageValue("select_pipeline"), {
            title: getLanguageValue("tip_title"),
            skin: 'self-alert'
        });
        try {
            if (tjSwitch == 1) {
                tjSdk.track('任务统计', { '任务类型': '全部任务', '结果': '失败' });
            }
        } catch (e) {

        }
    }
}

/**
 * @desc 获取统计数据
 * @method getStaticData
 * @param {*} lineId 
 * @param {*} year 
 */
function getStaticData(lineId, year) {
    var url = handleURL("/cloudlink-corrosionengineer/statistics/allTaskStatis?token=" + token + "&pipelineId=" + lineId + "&year=" + year); //对url进行权限处理
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                var taskObj = result.dataMap;
                // 本年度任务
                drawPieGraph("yearsChart", taskObj.yearOfTask);
                // 本年度检测桩检测个数
                getCheckMarkData(taskObj.markerOfYear);
                // 各方法累计检测（个）
                getAllCheckData(taskObj.methodOfYear);
                // 执行中任务整体完成情况
                drawPieGraph2("wholeGraph", taskObj.allTaskCompletion);
                // 各任务进度  
                getAnnularChartBox(taskObj);
                // 各任务本日，本周，本月的执行情况
                getByTimeData(taskObj);
            } else {
                parent.layer.alert(getLanguageValue("load_data_error"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 画各方法累计检查
 * @param {*String} methodOfYear
 */
function getAllCheckData(methodOfYear) {
    var dataObj = {};
    var taskname = []; // 任务名称
    var tasknum = []; // 任务数量
    for (var temp in methodOfYear) {
        taskname.push(temp);
        tasknum.push(methodOfYear[temp]);
    }
    dataObj.taskname = taskname;
    dataObj.tasknum = tasknum;
    drawBarGraphX("wayCheckGraph", dataObj);
}

/**
 * @desc 获取本年度测试桩检测数据
 * @param {*String} data
 */
function getCheckMarkData(data) {
    var dataObj = {};
    var totalOfMarkStausY = [getLanguageValue("plan_measure"), getLanguageValue("done_measure"), getLanguageValue("faile_measure"), getLanguageValue("wait_measure")];
    var totalOfMarkStausArr = [];
    totalOfMarkStausArr.push(data.totalmarker);
    totalOfMarkStausArr.push(data.completedCount);
    totalOfMarkStausArr.push(data.unableCount);
    totalOfMarkStausArr.push(data.notdetectCount);
    dataObj.yAxisData = totalOfMarkStausY;
    dataObj.DataArr = totalOfMarkStausArr;
    drawBarGraphY("taskChecked", dataObj)
}

/**
 * @desc 获取环形饼图数据
 * @method getAnnularChartBox
 * @param {*} data 
 */
function getAnnularChartBox(data) {
    var divArr = []; //用于存放list数据 
    for (var temp in data) {
        var list = data[temp].taskList;
        for (var temp in list) {
            divArr.push(list[temp]);
        }
    }
    for (var i = 0; i < divArr.length; i++) {
        (function(i) {
            var that = i;
            $("#executeModel").append($("<div class='whole-model' id=" + that + "></div>"));
            drawAnnularChart(that, divArr[that]);
        })(i)
    }
    $("#taskNum").html("(" + divArr.length + ")");
}
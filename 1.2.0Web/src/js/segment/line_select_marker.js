/**  
 * @author: lujingrui
 * @date: 2017 - 3 - 3 
 * @last modified by: lujingrui 
 * @last modified time: 2017 - 4 - 13
 * @file: 右侧逻辑图具体逻辑处理
*/

var token = "";
//管道id
var pipeId = "";
//逻辑图id
var chartId = "";
//当前选择的管线id
var currentSelectPipelineId = "";
//初始化pickList插件
var pick = $("#pickList").pickList({
    data: [],
});

/**
 * @desc 初始化方法
 */
$(function() {
    token = lsObj.getLocalStorage("token");
    pipeId = getParameter("pipeId");
    chartId = getParameter("chartId");
    getPipelineTree();
    queryMarkerById();
});

/**
 * @desc 获取管线树
 * @method getPipelineTree
 */
function getPipelineTree() {
    var token = lsObj.getLocalStorage("token");
     $('#treeview').jstree({
            core: {
                multiple: false,
                animation: 0,
                check_callback:true,
                themes:{
                    dots:false
                },
                //强制将节点文本转换为纯文本，默认为false
                force_text : true,
                data: function(obj, cb) {
                    var dataItem;
                    $.ajax({
                            url: handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token),
                            method: "get",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json"
                        })
                        .done(function(res) {
                            if (res.success == 1) {
                                dataItem = res.treeList;
                                cb.call(this, dataItem);
                            } else {
                                layer.msg(res.msg, { time: MSG_DISPLAY_TIME,skin: "self-success" });
                            }
                        })
                }
            },
            sort : function(a, b) {
                return this.get_node(a).original.orderNumber-0 > this.get_node(b).original.orderNumber-0 ? 1 : -1;
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
            //默认展开全部节点 
            inst.open_all();
        })
        .on('select_node.jstree', function(e, data) {
            if(data.node.type == "pipeline"){
                currentSelectPipelineId = data.node.id;
                queryMarkerByPipeId(data.node.id);
            }
        });
}

/**
 * @desc 根据管线id查询其所包含的测试桩
 * @method queryMarkerByPipeId
 * @param {string} pipelineId 管线id
 */
function queryMarkerByPipeId(pipelineId) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/cpsegment/queryMarkerByPipeId?&chartId=" + chartId + "&pipelineId=" + pipelineId + "&token=" + token+"&pipeOriginId="+pipeId,
        dataType: "json",
        type: "get",
        success: function(result) {
            if (result.success == 1) {
                var data = result.result;
                for (var i = 0; i < data.length; i++) {
                    data[i].pipelineId = pipelineId;
                }
                var resultData = pick.getValues();
                var result = compliteArray(data, resultData);
                $('#num').html(result.length + " 个");
                pick.setData(result);
            }
        },
        async: false,
        dataType: "json"
    });
}

/**
 * @desc 比较两个数组中相同的项，并把其中一个数组中与另一数组中相同的项移除，返回剩余的项
 * @method compliteArray
 * @param {array} arr1 
 * @param {array} arr2
 * @return {array}
 */
function compliteArray(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i].id == arr2[j].id) {
                arr1.splice(i, 1);
                i--;
                break;
            }
        }
    }
    return arr1;
}

/**
 * @desc 更管道与测试桩的关联关系
 * @method update_gd
 */
function update_gd() {
    var markerArr = pick.getValues();
    var markerId = [];
    var markerIds = "";
    if (markerArr.length > 0) {
        for (var i = 0; i < markerArr.length; i++) {
            markerId.push(markerArr[i].id);
        }
        markerIds = markerId.join(",");
    }
    var parameter = {
        "pipeId": pipeId,
        "chartId": chartId,
        "markerIds": markerIds
    };
    $.ajax({
        url: "/cloudlink-corrosionengineer/cpsegment/updatePipeAndMarkerRelation?token=" + token,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "post",
        data: JSON.stringify(parameter),
        success: function(res) {
            if (res.success == 1) {
                 parent.layer.msg("保存成功", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-success"
                });

                flag = true;
            } else {
                parent.layer.confirm("错误信息：" + res.msg, {
                    title: "提示",
                    btn: ['确定', '取消'], //按钮
                    skin: 'self'
                });
                flag = false;
            }
        },
        async: false,
    });
    return flag;
}

/**
 * @desc 查询管道关联的桩
 * @method queryMarkerById
 */
function queryMarkerById() {
    var parameter = {
        "pipeId": pipeId,
        "chartId": chartId
    };
    $.ajax({
        type: "get",
        url: "/cloudlink-corrosionengineer/cpsegment/getPipeRelationMarkerList?token=" + token,
        contentType: "application/json; charset=utf-8",
        data: parameter,
        dataType: "json",
        success: function(res) {
            if (res.success == 1) {
                var data = res.result;
                if (data != null && data.length > 0) {
                    var markerData = [];
                    for (var i = 0; i < data.length; i++) {
                        markerData.push({ "id": data[i].id, "text": data[i].text, "pipelineId": data[i].pipelineId });
                    }
                    pick.setResultData(markerData);
                    $("#num1").html(markerData.length + "个");
                }
            } else {
                parent.layer.confirm("错误信息：" + res.msg, {
                    title: "提示",
                    btn: ['确定', '取消'], //按钮
                    skin: 'self'
                });
            }
        },
    });
}
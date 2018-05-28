/**  
 * @file
 * @author: lujingrui
 * @desc: 恒电位仪选桩逻辑
 * @date: 2017-03-03 
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:30:38
 */

var token = "";
//恒电位仪id
var potentiostatId = "";
//逻辑图id
var chartId = "";
//当前选择的管线id
var currentSelectPipelineId = "";

var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key

//初始化pickListc插件
var pick = $("#pickList").pickList({
    data: [],
});

/**
 * @desc 初始化方法
 */
$(function () {
    changePageStyle("../../..");
    token = lsObj.getLocalStorage("token");
    potentiostatId = getParameter("potentiostatId");
    chartId = getParameter("chartId");
    getPipelineTree();
    queryMarkerById();
});

/**
 * @desc 获取管线树
 */
function getPipelineTree() {
    var token = lsObj.getLocalStorage("token");
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
                data: function (obj, cb) {
                    var dataItem;
                    $.ajax({
                            url: handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token),
                            method: "get",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json"
                        })
                        .done(function (res) {
                            if (res.success == 1) {
                                dataItem = res.treeList;
                                cb.call(this, dataItem);
                            } else {
                                layer.msg(res.msg, {
                                    time: MSG_DISPLAY_TIME,
                                    skin: "self-msg"
                                });
                            }
                        })
                        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                            layer.alert(NET_ERROR_MSG, {
                                title: getLanguageValue("tip"),
                                skin: 'self-alert'
                            });
                        })
                }
            },
            sort: function (a, b) {
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
        .on('loaded.jstree', function (e, data) {
            var inst = data.instance;
            //默认展开全部节点 
            inst.open_all();
        })
        .on('select_node.jstree', function (e, data) {
            if (data.node.type == "pipeline") {
                currentSelectPipelineId = data.node.id;
                queryMarkerByPipeId(data.node.id);
            }
        });
}

/**
 * @desc 根据管线id查询其所包含的测试桩
 * @param {string} pipelineId 管线id
 */
function queryMarkerByPipeId(pipelineId) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/cpsegment/queryMarkerByPipeId?&chartId=" + chartId + "&pipelineId=" + pipelineId + "&token=" + token + "&potentiostatOriginId=" + potentiostatId,
        dataType: "json",
        type: "get",
        success: function (result) {
            if (result.success == 1) {
                var data = result.result;
                for (var i = 0; i < data.length; i++) {
                    data[i].pipelineId = pipelineId;
                }
                var resultData = pick.getValues();
                var result = compliteArray(data, resultData);
                if(language == "en"){
                     $('#num').html(result.length);
                }else{
                     $('#num').html(result.length + " 个");
                }
               
                pick.setData(result);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        },
        async: false,
        dataType: "json"
    });
}

/**
 * @desc 比较两个数组中相同的项，并把其中一个数组中与另一数组中相同的项移除，返回剩余的项
 * @param {array} arr1 
 * @param {array} arr2
 * @returns {array}
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
 * @desc 更管道与恒电位仪的关联关系
 */
function update_hd() {
    var markerArr = pick.getValues();
    var markerId = "";
    if (markerArr.length > 0) {
        markerId = markerArr[0].id;
    }
    var parameter = {
        "potentiostatId": potentiostatId,
        "chartId": chartId,
        "markerId": markerId
    };
    $.ajax({
        url: "/cloudlink-corrosionengineer/cpsegment/updatePotentiostatAndMarkerRelation?token=" + token,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "post",
        data: JSON.stringify(parameter),
        success: function (res) {
            if (res.success == 1) {
                parent.layer.msg(getLanguageValue("successful"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
                flag = true;
            } else {
                parent.layer.alert(getLanguageValue("Error_Info") + res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                flag = false;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        },
        async: false
    });
    return flag;
}

/**
 * @desc 查询恒电位仪关联的桩
 */
function queryMarkerById() {
    var parameter = {
        "potentiostatId": potentiostatId,
        "chartId": chartId
    };
    $.ajax({
        type: "get",
        url: "/cloudlink-corrosionengineer/cpsegment/getPotentiostatRelationMarker?token=" + token,
        contentType: "application/json; charset=utf-8",
        data: parameter,
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                var data = res.result;
                if (data != null && data != "" && data != undefined) {
                    var markerData = [];
                    markerData.push({
                        "id": data.objectId,
                        "text": data.pipelineName + "-" + data.markerNumber,
                        "pipelineId": data.pipelineId
                    });
                    pick.setResultData(markerData);
                    if(language == "en"){
                        $("#num1").html("1");
                    }else{
                        $("#num1").html("1个");
                    }
                }
            } else {
                parent.layer.alert(getLanguageValue("Error_Info") + res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
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
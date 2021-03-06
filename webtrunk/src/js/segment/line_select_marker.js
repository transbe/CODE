/**  
 * @file
 * @author: lujingrui
 * @desc: 右侧逻辑图具体逻辑处理
 * @date: 2017-03-03 
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:30:12
 */

var token = "";
//管道id
var pipeId = "";
//逻辑图id
var chartId = "";
//当前选择的管线id
var currentSelectPipelineId = "";
//已选择的测试桩
var markerDataList = [];
var beginShapeId;//管道左侧关联的元件id
var endShapeId;//管道右侧关联的元件的id
var beginShapeFacilityType;//管道左侧关联的元件类型
var endShapeFacilityType;//管道右侧关联的元件类型
var beginShapeName;//管道左侧关联的元件名称
var endShapeName;//管道右侧关联的元件名称
var beginStyle;//管道左侧关联的元件样式
var endStyle;//管道右侧关联的元件样式
var beginSrc;//管道左侧关联的元件src
var endSrc;//管道右侧关联的元件src

var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key

//初始化pickList插件
var pick = $("#pickList").pickList({
    data: [],
});

/**
 * @desc 初始化方法
 */
$(function () {
    changePageStyle("../../..");
    token = lsObj.getLocalStorage("token");
    pipeId = getParameter("pipeId");
    chartId = getParameter("chartId");
    beginShapeId = getParameter("beginShapeId");
    endShapeId = getParameter("endShapeId");
    beginShapeFacilityType = getParameter("beginShapeFacilityType");
    endShapeFacilityType = getParameter("endShapeFacilityType");
    beginShapeName = decodeURI(getParameter("beginShapeName"));
    endShapeName =  decodeURI(getParameter("endShapeName"));
    showPic(beginShapeFacilityType, endShapeFacilityType,beginShapeName,endShapeName);
    getPipelineTree();
    queryMarkerById();

    $(".sort-marker").click(function () {
        $(".sort-marker").toggleClass("top-first");
        if($(".sort-marker").hasClass("top-first")){
            $("#topPic").prop("src",beginSrc);
            $("#bottomPic").prop("src",endSrc);
            $("#topPic").prop("style",beginStyle);
            $("#bottomPic").prop("style",endStyle);
            $("#topName").html(beginShapeName);
            $("#bottomName").html(endShapeName);
        }else{
            $("#topPic").prop("src",endSrc);
            $("#bottomPic").prop("src",beginSrc);
            $("#topPic").prop("style",endStyle);
            $("#bottomPic").prop("style",beginStyle);
            $("#topName").html(endShapeName);
            $("#bottomName").html(beginShapeName);
        }
    });

    $(".marker-btn").on("click","button",function(){
        if(isContinuous()){
            if(this.id == "moveForward"){
                $("#sortable li.ui-selected").filter(":first").prev().before($("#sortable li.ui-selected"))
            }else if(this.id == "moveBackward"){
                $("#sortable li.ui-selected").filter(":last").next().after($("#sortable li.ui-selected"))
            }else if(this.id == "sort"){
                var prevElement = $("#sortable li.ui-selected").filter(":first").prev();
                $("#sortable li.ui-selected").each(function(index,element){
                    if(index != 0){
                        if(prevElement.length != 0){
                            prevElement.after($(this));
                        }else{
                            $("#sortable").prepend($(this));
                        }
                    }
                });
            }else if(this.id == "moveTop"){
                $("#sortable").prepend( $("#sortable li.ui-selected"));
            }else if(this.id == "moveBottom"){
                $("#sortable").append( $("#sortable li.ui-selected"));
            }
            $(".middle-pic .first").html($( "#sortable" ).find("li:first-child").html());
            $(".middle-pic .last").html($( "#sortable" ).find("li:last-child").html());
        }else{
             parent.layer.alert(getLanguageValue("Select_continuous_pile"),{
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
        }
    });
});

/**
 * @desc 改变操作已选中的测试桩的时候下方按钮的可点击/不可点击状态
 */
function changeBtnStatus(){
    // console.log($("#sortable li.ui-selected"));
        if( $("#sortable li.ui-selected").length>0){
            if(isContinuous()){
                $("#moveForward").prop({"disabled":false,"title":getLanguageValue("Move_Up")});
                $("#moveBackward").prop({"disabled":false,"title":getLanguageValue("Move_down")});
                if($("#sortable li.ui-selected").length>1 && isContinuous){
                    $("#sort").prop({"disabled":false,"title":getLanguageValue("Inverted_order")});
                }else{
                    $("#sort").prop({"disabled":true,"title":getLanguageValue("Select_continuous_pile")});
                }
                $("#moveTop").prop({"disabled":false,"title":getLanguageValue("top")});
                $("#moveBottom").prop({"disabled":false,"title":getLanguageValue("bottom")});
            }else{
                $("#moveForward").prop({"disabled":true,"title":getLanguageValue("Select_continuous_pile")});
                $("#moveBackward").prop({"disabled":true,"title":getLanguageValue("Select_continuous_pile")});
                $("#sort").prop({"disabled":true,"title":getLanguageValue("Select_continuous_pile")});
                $("#moveTop").prop({"disabled":true,"title":getLanguageValue("Select_continuous_pile")});
                $("#moveBottom").prop({"disabled":true,"title":getLanguageValue("Select_continuous_pile")});
            }
        }else{
            $("#moveForward").prop({"disabled":true,"title":getLanguageValue("Select_one")});
            $("#moveBackward").prop({"disabled":true,"title":getLanguageValue("Select_one")});
            $("#sort").prop({"disabled":true,"title":getLanguageValue("select_least_2")});
            $("#moveTop").prop({"disabled":true,"title":getLanguageValue("Select_one")});
            $("#moveBottom").prop({"disabled":true,"title":getLanguageValue("Select_one")});
        }
}


/**
 * @desc 判断选择的测试桩是否连续的
 */
function isContinuous(){
    var allSelect = $("#sortable li.ui-selected");
    for(var i = 0;i<allSelect.length-1;i++){
        if($("#sortable").find(allSelect[i]).next().data("id") != allSelect.eq(i+1).data("id")){
            return false;
        }
    }
    return true;
}

/**
 * @desc 显示管线两端连接元件
 */
function showPic(beginShapeFacilityType, endShapeFacilityType,beginShapeName,endShapeName) {
    if (!isNull(beginShapeFacilityType) && beginShapeFacilityType != "undefined") {
        var b_res = whichType(beginShapeFacilityType);
        beginSrc = "image/" + b_res.src;
        beginStyle = b_res.style;

        document.getElementById("topPic").src = beginSrc;
        $("#topPic").prop("style",beginStyle);
        $("#topName").html(beginShapeName);
    } else {
        $("#topName").html(getLanguageValue("Not_connected"));
    }
    if (!isNull(endShapeFacilityType) && endShapeFacilityType != "undefined") {
        var e_res = whichType(endShapeFacilityType);
        endSrc = "image/" + e_res.src;
        endStyle = e_res.style;

        document.getElementById("bottomPic").src = endSrc;
        $("#bottomPic").prop("style",endStyle);
        $("#bottomName").html(endShapeName);
    } else {
        $("#bottomName").html(getLanguageValue("Not_connected"));
    }
}

/**
 * @desc 判断元件什么类型，然后返回图片地址
 * @return src 图片地址
 */
function whichType(type) {
    // FACILITY_STATION: 站场
    // FACILITY_VALVE: 阀室
    // FACILITY_TEE: 三通
    // FACILITY_REDUCER: 大小头
    // FACILITY_SPD: 无保护装置绝缘接头
    // FACILITY_PROTECTION: 有保护装置绝缘接头
    // FACILITY_FIKWITHOUTSPD: 无保护装置绝缘法兰
    // FACILITY_FIKWITHSPD: 有保护装置绝缘法兰
    // FACILITY_CABLECONNECTION: 连接点
    // FACILITY_ABOVEGROUNDPL: 架空线
    var src;
    var name;
    var style;
    switch (type) {
        case 'FACILITY_STATION':
            src = "shape_01.png";
            style = "width:42px;height:29px;"
            name = "站场";
            break;
        case 'FACILITY_VALVE':
            src = "shape_02.png";
            style = "width:42px;height:29px;"
            name = "阀室";
            break;
        case 'FACILITY_ABOVEGROUNDPL':
            src = "shape_05.png";
            style = "width:42px;height:29px;"
            name = "架空线";
            break;
        case 'FACILITY_TEE':
            src = "shape_06.png";
            style = "width:26px;height:25px;margin-left:8px;"
            name = "三通";
            break;
        case 'FACILITY_REDUCER':
            src = "shape_07.png";
            style = "width:29px;height:23px;margin-left:6px;"
            name = "大小头";
            break;
        case 'FACILITY_SPD':
            src = "shape_14.png";
            name = "无保护装置绝缘接头";
            style = "width:23px;height:29px;margin-left:9px;"
            break;
        case 'FACILITY_PROTECTION':
            src = "shape_15.png";
            style = "width:23px;height:29px;margin-left:9px;"
            name = "有保护装置绝缘接头";
            break;
        case 'FACILITY_FIKWITHOUTSPD':
            src = "shape_16.png";
            style = "width:19px;height:29px;margin-left:11px;"
            name = "无保护装置绝缘法兰";
            break;
        case 'FACILITY_FIKWITHSPD':
            src = "shape_17.png";
            style = "width:19px;height:29px;margin-left:11px;"
            name = "有保护装置绝缘法兰";
            break;
        case 'FACILITY_CABLECONNECTION':
            src = "shape_18.png";
            style = "width:14px;height:14px;margin-left:14px;"
            name = "连接点";
            break;
    }
    var res = {};
    res.src = src;
    res.name = name;
    res.style = style;
    return res;
}

/**
 * @desc 获取管线树
 */
function getPipelineTree() {
    var token = lsObj.getLocalStorage("token");
    $('#treeview').jstree({
        core: {
            multiple: true,
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
        checkbox: {
            // three_state: false,
            // cascade: 'undetermined',
            tie_selection: false
        },
        plugins: ["types", "sort", "checkbox"]
    })
        .on('loaded.jstree', function (e, data) {
            var inst = data.instance;
            //默认展开全部节点 
            inst.open_all();
        })
        .on('check_node.jstree', function (e, data) {
            // if (data.node.type == "pipeline") {
                currentSelectPipelineId = data.node.id;
                queryMarkerByPipeId(data.node.id, true);
            // }
        })
        .on('uncheck_node.jstree', function (e, data) {
            // if (data.node.type == "pipeline") {
                queryMarkerByPipeId(data.node.id, false);
            // }
        })
        ;
}


/**
 * @desc 根据管线id查询其所包含的测试桩
 * @param {string} pipelineId 管线id
 */
function queryMarkerByPipeId(pipelineId, isCheck) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/cpsegment/queryMarkerByPipeId?&chartId=" + chartId + "&pipelineId=" + pipelineId + "&token=" + token + "&pipeOriginId=" + pipeId,
        dataType: "json",
        type: "get",
        success: function (result) {
            if (result.success == 1) {
                var data = result.result;
                for (var i = 0; i < data.length; i++) {
                    data[i].pipelineId = pipelineId;
                }
                if (isCheck == true) {
                    markerDataList.push.apply(markerDataList, data);
                } else {
                    markerDataList = compliteArray(markerDataList, data);
                }
                // var resultData = pick.getValues();
                // var result = compliteArray(data, resultData);
                if(language == "en"){
                     $('#num').html(markerDataList.length);
                }else{
                    $('#num').html(markerDataList.length + " 个");
                }
               
                pick.setData(markerDataList);
                var resultData = pick.getValues();
                for (var i = 0; i < resultData.length; i++) {
                    for (var j = 0; j < markerDataList.length; j++) {
                        if (resultData[i].id == markerDataList[j].id) {
                            $("#pickData li[data-id='" + markerDataList[j].id + "']").addClass("uncheck");
                            break;
                        }
                    }
                }
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
 * @desc 更管道与测试桩的关联关系
 */
function update_gd() {
    // $( "#sortable" ).sortable( "toArray" ,{attribute: "data-id"});
    var lis = $("#sortable").find("li");
    var markerList = [];
    lis.each(function (index, element) {
        var map = {};
        map.markerId = $(this).data("id");
        map.orderNum = index + 1;
        if (index == 0) {
            if ($(".sort-marker").hasClass("top-first")) {
                map.closeToDeviceId = beginShapeId;
            } else {
                map.closeToDeviceId = endShapeId;
            }
        }
        if (index == lis.length - 1) {
            if ($(".sort-marker").hasClass("top-first")) {
                map.closeToDeviceId = endShapeId;
            } else {
                map.closeToDeviceId = beginShapeId;
            }
        }
        markerList.push(map);
    });
    var parameter = {
        "pipeId": pipeId,
        "chartId": chartId,
        "markerList": markerList
    };
    $.ajax({
        url: "/cloudlink-corrosionengineer/cpsegment/updatePipeAndMarkerRelation?token=" + token,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "post",
        data: JSON.stringify(parameter),
        success: function (res) {
            if (res.success == 1) {
                parent.layer.msg(getLanguageValue("Save_successful"),{
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });

                flag = true;
            } else {
                parent.layer.alert(getLanguageValue("Error_Info")+ res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                flag = false;
            }
        },
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
    return flag;
}

/**
 * @desc 查询管道关联的桩
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
        success: function (res) {
            if (res.success == 1) {
                var data = res.result;
                if (data != null && data.length > 0) {
                    var markerData = [];
                    for (var i = 0; i < data.length; i++) {
                        markerData.push({
                            "id": data[i].markerId,
                            "text": data[i].text
                        });
                    }
                    pick.setResultData(markerData);
                    if(language == "en"){
                         $("#num1").html(markerData.length);
                    }else{
                         $("#num1").html(markerData.length + "个");
                    }
                   
                    $(".middle-pic .first").html($("#sortable").find("li:first-child").html());
                    $(".middle-pic .last").html($("#sortable").find("li:last-child").html());
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

/**  
 * @author: lujingrui
 * @date: 2017 - 3 - 3 
 * @last modified by: lujingrui 
 * @last modified time: 2017 - 4 - 13
 * @file: 测试桩管理主页面左侧树操作逻辑
 */
// 全局变量 管线id
var pipelineid = "";

//全局变量 判断是否在能在该管线下添加测试桩
var canAddMarker;

// 全局变量 token
var token = "";

// 全局变量 管线名称
var pipelinenameForTable = "";

$(window).resize(function() {
    var window_h = $(window).height();
    var window_w = $(window).width();
    $(".divider").css("height", window_h + "px");
    $(".ztree").css("height", window_h - 38 + "px");
    var w = window_w - $("div-left").width();
    $(".div-right").css("width", w + "px");
});
// 初始化方法
$(document).ready(function() {
    // 调整管线树列表div，使其高度等于屏幕高度
    var window_h = $(window).height();
    var w = $(window).width() - 230;
    $(".div-right").css("width", w + "px");
    $(".divider").css("height", window_h + "px");
    $(".ztree").css("height", window_h - 38 + "px");
    // 获取token
    token = lsObj.getLocalStorage("token");
    //判断是否为运营人员
    if (judgePrivilege()) {
        setting.edit.showRemoveBtn = false;
        setting.edit.showRenameBtn = false;
        setting.view.addHoverDom = false;
    }
    loadTree(token);
});

function loadTree(token) {
    $.ajax({
        url: handleURL("/cloudlink-corrosionengineer/pipemanage/queryTree?token=" + token),
        method: "get",
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function(result) {
            // console.log(JSON.stringify(result));
            if (result.success == 1) {
                var data = result.treeList;
                // console.log(data);
                // 初始化下拉树
                $.fn.zTree.init($("#treeDemo"), setting, data);
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.expandAll(true);
                if (data != null && data != "" && data != undefined) {
                    var nodes = zTree.getNodes();
                    // console.log(JSON.stringify(nodes));
                    zTree.selectNode(nodes[0]);
                    pipelineid = nodes[0]["id"];
                    pipelinenameForTable = encodeURI(nodes[0]["name"]);
                    if (nodes[0].children != null && nodes[0].children != undefined) {
                        canAddMarker= 0; //不能添加测试桩
                    } else {
                        canAddMarker= 1; //可以添加测试桩
                    }
                }

                //    try{
                //         if(zhugeSwitch==1){
                //             zhuge.track('测试桩管理',{'操作':'查询管线'});
                //         }
                //     }catch(err){
                //         //在此处理错误
                //     }
            } else if (result.success == 0) {
                layer.msg(result.msg, { skin: "self-success" });
                // layer.confirm(result.msg,{btn:0,time:2000,skin:'self',closeBtn: 0});
            } else {
                layer.msg(result.msg, { skin: "self-success" });
                // layer.confirm(result.msg,{btn:0,time:2000,skin:'self',closeBtn: 0});
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // alert("加载异常");
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// 下拉树配置
var setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    edit: {
        drag: {
            isCopy: false,
            isMove: true,
            prev: false,
            next: false,
            inner: true
        },
        enable: true,
        editNameSelectAll: true,
        renameTitle: "重命名",
        removeTitle: "删除",
        showRemoveBtn: showRemoveBtn,
        showRenameBtn: showRenameBtn
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeDrop: beforeDrop,
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        beforeClick: beforeClick,
        onClick: onClick
    }
};

// 点击下拉树之前触发事件
function beforeClick(treeId, treeNode) {
    remove()
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    if (treeNode.isParent) {
        zTree.expandNode(treeNode);
    } else {
        return true;
    }
}

// 点击下拉树时触发事件
function onClick(event, treeId, treeNode) {
    // console.log(treeNode.id);
    pipelineid = treeNode.id;
    pipelinenameForTable = encodeURI(treeNode.name);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.updateNode(treeNode);
    $.ajax({
        url: "/cloudlink-corrosionengineer/pipemanage/verifyImport?token=" + token + "&objectId=" + pipelineid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        method: "get",
        async: false,
        success: function(result) {
            if (result.success == 1) {
                canAddMarker= 1; //可以添加测试桩
            } else {
                canAddMarker= 0; //不能添加测试桩
            }
        }
    });
    query(treeNode.id);
    $('#tb-datacollection').bootstrapTable('refresh', true);
}

// 拖拽下拉树，放置到某一节点之前触发事件
function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    var flag = false;
    // console.log(JSON.stringify(treeNodes));
    if (targetNode != null && moveType == 'inner') {
        $.ajax({
            url: "/cloudlink-corrosionengineer/pipemanage/updateTree?token=" + token,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            method: "post",
            async: false,
            data: JSON.stringify({
                'objectId': treeNodes[0].id,
                'parentId': targetNode.id,
                'pipelineName': treeNodes[0].name
            }),
            success: function(result) {
                if (result.success == 1) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    layer.msg("移动成功", { skin: "self-success" });
                    treeNodes[0].pId = targetNode.id;
                    zTree.updateNode(treeNodes[0]);
                    query();
                    // layer.confirm("移动成功",{btn:0,time:1000,skin:'self',closeBtn: 0});
                    flag = true;
                    // try{
                    //     if(zhugeSwitch==1){
                    //         zhuge.track('测试桩管理',{'操作':'改变管线层级'});
                    //     }
                    // }catch(err){
                    //     //在此处理错误
                    // }
                } else if (result.success == 0) {
                    layer.msg(result.msg, { skin: "self-success" });
                    // layer.confirm(result.msg,{btn:0,time:2000,skin:'self',closeBtn: 0});
                } else {
                    layer.msg(result.msg, { skin: "self-success" });
                    // layer.confirm(result.msg,{btn:0,time:2000,skin:'self',closeBtn: 0});
                }
            }
        });
    }

    return flag;
}

// 编辑下拉树名字前触发事件
function beforeEditName(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.selectNode(treeNode);
    zTree.editName(treeNode);
    return false;
}

// 删除下拉树节点前触发事件
function beforeRemove(treeId, treeNode) {
    return false;
}

//判断要删除的管线下有无关联测试桩
function isDeleteNode(treeNode) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/pipemanage/verifyBottom?token=" + token,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        method: "post",
        async: false,
        data: JSON.stringify({
            'objectId': treeNode.id
        }),
        success: function(result) {
            if (result.success == 1) {
                layer.msg(result.msg, { skin: "self-success" });
            } else {
                deleteNode(treeNode);
            }
        }
    });
}

// 删除下拉树节点
function deleteNode(treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    layer.confirm('请确定删除该管线下没有包含测试桩的管线', {
        btn: ['删除', '取消'], //按钮
        skin: "self",
        yes: function() {
            $.ajax({
                url: "/cloudlink-corrosionengineer/pipemanage/deleteTree?token=" + token,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                method: "post",
                async: false,
                data: JSON.stringify({
                    'objectId': treeNode.id
                }),
                success: function(result) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    if (result.success == 1) {
                        query();
                        if (treeNode.id == pipelineid) {
                            pipelineid = "";
                        }
                        canAddMarker= 0;
                        zTree.removeNode(treeNode);
                        // zTree.updateNode(treeNode);
                        layer.msg("删除成功", { skin: "self-success" });
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('删除管线', { '结果': '成功' });
                            }
                        } catch (err) {
                            //在此处理错误
                        }
                        return true;
                    } else if (result.success == 0) {
                        loadTree(token);
                        layer.confirm(result.msg, {
                            btn: ['确定'], //按钮
                            skin: 'self'
                        });
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('删除管线', { '结果': '成功' });
                            }
                        } catch (err) {
                            //在此处理错误
                        }
                        return false;
                    } else {
                        layer.msg(result.msg, { skin: "self-success" });
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('删除管线', { '结果': '失败' });
                            }
                        } catch (err) {
                            //在此处理错误
                        }
                        return false;
                    }
                }
            });
        },
        cancel: function() {}
    });
}

// 重命名下拉树节点前触发的操作
function beforeRename(treeId, treeNode, newName, isCancel) {
    var flag = true;
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    if (newName.length == 0) {
        zTree.cancelEditName();
        flag = false;
        layer.msg("名称不能为空", { skin: "self-success" });
        // layer.confirm("名称不能为空",{btn:0,time:1000,skin:'self',closeBtn: 0});
        return false;
    }
    var allNodes;
    if (treeNode.getParentNode()) {
        allNodes = treeNode.getParentNode().children;
    } else {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        allNodes = zTree.getNodes();
    }
    for (var i = 0; i < allNodes.length; i++) {
        var text = allNodes[i].name;
        if (newName == text && text != treeNode.name) {
            zTree.cancelEditName(treeNode.name);
            layer.msg("已存在该名称", { skin: "self-success" });
            // layer.confirm("已存在该名称",{btn:0,time:2000,skin:'self',closeBtn: 0});
            flag = false;
            return false;
        }
    }
    if (flag) {
        $.ajax({
            url: "/cloudlink-corrosionengineer/pipemanage/updateTree?token=" + token,
            contentType: "application/json; charset=utf-8",
            method: "post",
            dataType: "json",
            data: JSON.stringify({
                'objectId': treeNode.id,
                'parentId': treeNode.pId,
                'pipelineName': newName
            }),
            success: function(result) {
                if (result.success == 1) {
                    layer.msg("修改名称成功", { skin: "self-success" });
                    // layer.confirm("修改名称成功",{btn:0,time:1000,skin:'self',closeBtn: 0});
                    zTree.updateNode(treeNode);
                    query();

                    // try{
                    //     if(zhugeSwitch==1){
                    //         zhuge.track('测试桩管理',{'操作':'修改管线名称'});
                    //     }
                    // }catch(err){
                    //     //在此处理错误
                    // }
                } else if (result.success == 0) {
                    zTree.cancelEditName(treeNode.name);
                    layer.msg(result.msg, { skin: "self-success" });
                    // layer.confirm(result.msg,{btn:0,time:2000,skin:'self',closeBtn: 0});
                    return false;
                } else {
                    zTree.cancelEditName(treeNode.name);
                    layer.msg(result.msg, { skin: "self-success" });
                    // layer.confirm(result.msg,{btn:0,time:2000,skin:'self',closeBtn: 0});
                    return false;
                }
            }
        });
    }
    return true;
}

// 显示删除图标
function showRemoveBtn(treeId, treeNode) {
    return treeNode;
}

// 显示重命名图标
function showRenameBtn(treeId, treeNode) {
    return treeNode;
}

// 添加节点 删除节点 图标点击触发事件
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
        "' title='新增' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function() {
        layer.prompt({ title: '请输入名称', skin: 'self' },
            function(pass, index) {
                addLeafNode(treeNode, pass);
                layer.close(index);
            });
    });

    var btn_del = $("#" + treeNode.tId + "_remove");
    if (btn_del) btn_del.bind("click", function() {
        isDeleteNode(treeNode);
    });
}

// 移除图标
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
    $("#" + treeNode.tId + "_remove").unbind().remove();
}

// 添加叶子节点
function addLeafNode(treeNode, newname) {
    var flag = true;
    if (treeNode.children) {
        var allNodes = treeNode.children;
        // console.log(JSON.stringify(allNodes));
        for (var i = 0; i < allNodes.length; i++) {
            var text = allNodes[i].name;
            if (newname == text) {
                flag = false;
                layer.msg("已存在该名称", { skin: "self-success" });
                // layer.confirm("已存在该名称",{btn:0,time:2000,skin:'self',closeBtn: 0});
                return false;
            }
        }
    }
    if (flag) {
        $.ajax({
            url: "/cloudlink-corrosionengineer/pipemanage/addTree?token=" + token,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            method: "post",
            data: JSON.stringify({
                'parentId': treeNode.id,
                'pipelineName': newname
            }),
            success: function(result) {
                if (result.success == 1) {
                    var id = result.objectid;
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    zTree.addNodes(treeNode, { id: id, pId: treeNode.id, name: newname });
                    zTree.expandAll(true);
                    zTree.updateNode(treeNode);
                    layer.msg("添加成功", { skin: "self-success" });
                    query();
                    // layer.confirm("添加成功",{btn:0,time:1000,skin:'self',closeBtn: 0});

                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新建管线', { '结果': '成功' });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                    return false;
                } else {
                    layer.msg(result.msg, { skin: "self-success" });
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新建管线', { '结果': '失败' });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                }
            }
        });
    } else {
        layer.msg("该名称已存在", { skin: "self-success" });
        // layer.confirm("该名称已存在",{btn:0,time:2000,skin:'self',closeBtn: 0});
    }
}

// 添加根节点
function addRootNode() {
    layer.prompt({ title: '请输入名称', skin: 'self' }, function(pass, index) {
        isAddRootNode(pass);
        layer.close(index);
    });
}

// 判断是否能添加根节点
function isAddRootNode(rootnodename) {
    var flag = true;
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var allNodes = zTree.getNodes();
    for (var i = 0; i < allNodes.length; i++) {
        var text = allNodes[i].name;
        if (rootnodename == text) {
            flag = false;
            layer.msg("该名称已存在", { skin: "self-success" });
            // layer.confirm("已存在该名称",{btn:0,time:2000,skin:'self',closeBtn: 0});
            return false;
        }
    }
    if (flag) {
        $.ajax({
            url: "/cloudlink-corrosionengineer/pipemanage/addTree?token=" + token,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            method: "post",
            data: JSON.stringify({
                'parentId': "#",
                'pipelineName': rootnodename
            }),
            success: function(result) {
                if (result.success == 1) {
                    var id = result.objectid;
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    zTree.addNodes(null, { id: id, pId: "#", name: rootnodename });
                    // zTree.expandAll(true);
                    layer.msg("添加成功", { skin: "self-success" });
                    query();

                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新建管线', { '结果': '成功' });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                    // layer.confirm("添加成功",{btn:0,time:1000,skin:'self',closeBtn: 0});
                    return false;
                }  else {
                    layer.msg(result.msg, { skin: "self-success" });
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新建管线', { '结果': '失败' });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                    // layer.confirm(result.msg,{btn:0,time:2000,skin:'self',closeBtn: 0});
                }
            }
        });
    } else {
        layer.msg("已存在该名称", { skin: "self-success" });
        // layer.confirm("已存在该名称",{btn:0,time:2000,skin:'self',closeBtn: 0});
    }
}

//  $(".divider").click(function(){
//      var w=$(window).width()-230;
//     var flag= $(".div-left").hasClass("tohide");
//     if(flag){
//         $(".div-left").animate({width:"0px"});
//         $(".div-right").animate({width:"100%"},function(){
//             query();
//         })
//         $(".div-left").removeClass("tohide");
//         $(".divider").addClass("ishide");
//     }else{
//         $(".div-left").animate({width:"230px"});
//         $(".div-right").animate({width:w+"px"},function(){
//             query();
//         });
//         $(".div-left").addClass("tohide");
//         $(".divider").removeClass("ishide");
//     }

// }); 

//拖放树div
$(".divider i").click(function() {
    var w = $(window).width() - 230;
    var flag = $(".div-left").hasClass("tohide");
    if (flag) {
        $(".div-left").animate({ width: "0px" });
        $(".div-right").animate({ width: "100%" }, function() {
            $('#table_hr').bootstrapTable('resetView');
        })
        $(".div-left").removeClass("tohide");
        $(".divider").addClass("ishide");
    } else {
        $(".div-left").animate({ width: "230px" });
        $(".div-right").animate({ width: w + "px" }, function() {
            $('#table_hr').bootstrapTable('resetView');
        });
        $(".div-left").addClass("tohide");
        $(".divider").removeClass("ishide");
    }

});

$("#divider").off('mousedown');
$("#divider").on('mousedown', function(e) {
    var leftWidthStart = $(".div-left").width();
    var rightWidthStart = $(".div-right").width();
    var mouseStart = { x: e.pageX };

    function mv(e) {
        var w_left = leftWidthStart + e.pageX - mouseStart.x + 'px';
        var w_right = rightWidthStart - (e.pageX - mouseStart.x) + 'px';
        $(".div-left").width(w_left);
        $(".div-right").width(w_right);
        $('#table_hr').bootstrapTable('resetView');
    }
    $(window).off('dragstart');
    $(window).on('dragstart', function(e) { e.preventDefault() });
    $(window).off('mousemove');
    $(window).on('mousemove', mv);
    $(window).off('mouseup');
    $(window).on('mouseup', function(e) {
        $(window).off('mousemove');
    });
    // IE阻止事件冒泡
    event.cancelBubble = true;
    event.returnValue = false;
    //以下是针对非IE浏览器的 阻止事件冒泡
    event.stopPropagation();
    event.preventDefault();
});

// var o=document.getElementById("divider");		
// o.addEventListener('mousedown', function(e) {
//     var leftWidthStart = $(".div-left").width();
//     var rightWidthStart = $(".div-right").width();
//     var mouseStart = {x:e.pageX};
//     function mv(e) {
//        var w_left = leftWidthStart+e.pageX - mouseStart.x + 'px';
//        var w_right = rightWidthStart-(e.pageX - mouseStart.x) + 'px';
//         $(".div-left").width(w_left);
//         $(".div-right").width(w_right);	
//         $('#table_hr').bootstrapTable('resetView');
//     }
//     document.addEventListener('dragstart', function(e) {e.preventDefault()});
//     document.addEventListener('mousemove', mv);
//     document.addEventListener('mouseup', function(e) {
//             document.removeEventListener('mousemove', mv);
//         });
// });
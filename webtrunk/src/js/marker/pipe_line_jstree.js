/**  
 * @file
 * @author: lujingrui
 * @desc: 测试桩管理主页面左侧树操作逻辑
 * @date: 2017-03-03 
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:30:38
 */

var pipelineId = ""; // 全局变量 管线id
var canAddMarker; //全局变量 判断是否在能在该管线下添加测试桩
var token = ""; // 全局变量 token
var pipelinenameForTable = ""; // 全局变量 管线名称
var default_text; // 全局变量 暂时存放重命名时的原名字

/**
 * @desc 窗口调整 自适应
 */
$(window).resize(function () {
    var window_h = $(window).height();
    var window_w = $(window).width();
    $("body").css("height", window_h + "px");
    $(".treeview-box").css("height", window_h - $(".div-left-header").height() + "px");
    $(".divider").css("height", window_h + "px");
    $("body").css("width", window_w + "px");
    var w = window_w - $(".div-left").width();
    $(".div-right").css("width", w - $(".divider").width() + "px");
});

/**
 * @desc 初始化方法
 */
$(document).ready(function () {
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    // 调整管线树列表div，使其高度等于屏幕高度
    var window_h = $(window).height();
    $("body").css("height", window_h + "px");
    $(".treeview-box").css("height", window_h - $(".div-left-header").height() + "px");
    $(".divider").css("height", window_h + "px");
    var w = $(window).width() - $(".div-left").width() - $(".divider").width();
    $(".div-right").css("width", w + "px");
    // 获取token
    token = lsObj.getLocalStorage("token");
    //添加所有监听事件
    listenEvent();

    $.jstree.defaults.core.themes.dots = false;
    $('#treeview').jstree({
            core: {
                multiple: false,
                animation: 0,
                check_callback: function (operation, node, node_parent, node_position, more) {
                    // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                    // in case of 'rename_node' node_position is filled with the new node name
                    if (operation === "move_node") { //移动操作
                        var inst = $('#treeview').jstree(true);
                        var nodes = inst.get_node(node_parent).children;
                       if(node.parent == node_parent.id){
                           var moveFlag = 0;
                            for (var i = 0; i < nodes.length; i++) {
                                var nodeName = inst.get_node(nodes[i]).text;
                                if (nodeName == node.text) {
                                    moveFlag++;
                                    if(moveFlag >1){
                                        return false;
                                    }
                                }
                            }
                       }else{
                         for (var i = 0; i < nodes.length; i++) {
                                var nodeName = inst.get_node(nodes[i]).text;
                                if (nodeName == node.text) {
                                    return false;
                                }
                            }
                       }
                        if (more.pos === "i") { //移动到内部
                            ////只允许拖拽到目录节点
                            if (node_parent.parent == null || node_parent.original.type === "pipeline-folder") {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                    return true;
                },
                //强制将节点文本转换为纯文本，默认为false
                force_text: true,
                data: function (obj, cb) {
                    $.ajax({
                            url: handleURL('/cloudlink-corrosionengineer/pipemanage/queryTree?token=' + token),
                            method: "get",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json"
                        })
                        .done(function (res) {
                            if (res.success == 1) {
                                var dataItem = res.treeList;
                                cb.call(this, dataItem);
                            } else {
                                layer.alert(res.msg, {
                                    title: getLanguageValue("tip"),
                                    skin: 'self-alert'
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
            contextmenu: {
                items: function (node) {
                    var tmp = $.jstree.defaults.contextmenu.items();
                    delete tmp.create.action;
                    delete tmp.ccp;
                    tmp.create.label = getLanguageValue("newItem");
                    tmp.create.submenu = {
                        "create_folder": {
                            //"separator_after": true,
                            "label": getLanguageValue("catalogue"),
                            "action": function (data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference),
                                    nodes = inst.get_node(obj).children;
                                layer.prompt({
                                    title: getLanguageValue("addPipelineDialog"),
                                    skin: 'self'
                                }, function (val, index) {
                                    if (canAddOrRenameNode(nodes, val.trim(), "add") == true) {
                                        // inst.create_node(obj, { text: val, type: "pipeline-folder" });
                                        createNode(obj.id, val.trim(), "pipeline-folder");
                                        layer.close(index);
                                    }
                                });
                            }
                        },
                        "create_file": {
                            "label": getLanguageValue("pipeline"),
                            "action": function (data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference),
                                    nodes = inst.get_node(obj).children;
                                layer.prompt({
                                    title: getLanguageValue("tip_inputPipeName"),
                                    skin: 'self'
                                }, function (val, index) {
                                    if (canAddOrRenameNode(nodes, val, "add") == true) {
                                        // inst.create_node(obj, { text: val, type: "pipeline" });
                                        createNode(obj.id, val.trim(), "pipeline");
                                        layer.close(index);
                                    }
                                });
                            }
                        }
                    };
                    tmp.rename.label = getLanguageValue("rename");
                    tmp.remove = {
                        "label": getLanguageValue("deleteTree"),
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            canDeleteNode(obj.id);
                        }
                    }
                    if (this.get_type(node) === "pipeline") {
                        delete tmp.create;
                    }
                    if (judgePrivilege()) {
                        delete tmp.create;
                        delete tmp.remove;
                        delete tmp.rename;
                    }
                    return tmp;
                }
            },
            dnd: {
                is_draggable: true,
                check_while_dragging: true,
                copy: false
            },
            types: {
                "pipeline-folder": { //管线目录
                    icon: 'folder-icon'
                },
                "pipeline": { //管线
                    icon: 'pipeline-icon',
                    valid_children: []
                }
            },
            plugins: ['contextmenu', "types", "sort", 'dnd', "state"]
        })
        .on('loaded.jstree', function (e, data) {
            var inst = data.instance;
            //默认展开全部节点 
            inst.open_all();

            var obj = inst.get_node("#").children[0];
            inst.select_node(obj);
        })
        // .on('changed.jstree', function(e, data) {
        //     //console.log(data);
        //     // refreshTree();
        // })
        // .on('select_node.jstree', function(e, data) {
        //     //console.log(data);
        // })
        // .on('create_node.jstree', function(e, data) {//新增节点
        // })
        .on('rename_node.jstree', function (e, data) { //重命名节点
            // var default_text = data.node.text.trim();
            var renameFlag = 0; //是否能重命名 大于1的情况下不能重命名
            var inst = $('#treeview').jstree(true);
            var nodes = inst.get_node(data.node.parent).children;
            for (var i = 0; i < nodes.length; i++) {
                var nodeName = inst.get_node(nodes[i]).text;
                if (nodeName.trim() == data.node.text.trim()) {
                    renameFlag++;
                }
            }
            if (renameFlag > 1) {
                layer.confirm(getLanguageValue("tip_ExistName"), {
                    title:  getLanguageValue("tip"),
                    btn: [getLanguageValue("ok")], //按钮
                    skin: 'self',
                    yes: function (index) {
                        // inst.rename_node(data.node, default_text);
                        // inst.edit(data.node);
                        data.instance.refresh();
                        layer.close(index);
                    }
                });
            } else if (nodeName.trim().length > 500) {
                layer.confirm(getLanguageValue("tip_NameLarge"), {
                    title: getLanguageValue("tip"),
                    btn: [getLanguageValue("ok")], //按钮
                    skin: 'self',
                    yes: function (index) {
                        inst.rename_node(data.node, default_text);
                        inst.edit(data.node);
                        layer.close(index);
                    }
                });
            } else {
                if (data.node.text != default_text) { //修改后名称与原来名称不一样
                    $.ajax({
                            url: "/cloudlink-corrosionengineer/pipemanage/renameTree?token=" + token,
                            method: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: 'JSON',
                            data: JSON.stringify({
                                'objectId': data.node.id,
                                'parentId': data.node.parent,
                                'pipelineName': data.node.text.trim()
                            })
                        })
                        .done(function (res) {
                            if (res.success == 1) {
                                layer.msg(getLanguageValue("tip_updataSuccess"), {
                                    time: MSG_DISPLAY_TIME,
                                    skin: "self-msg"
                                });
                                query();
                                // data.instance.refresh();
                            } else {
                                layer.alert(result.msg, {
                                    title:  getLanguageValue("tip"),
                                    skin: 'self-alert'
                                });
                                data.instance.refresh();
                            }

                        })
                        .fail(
                            function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                                layer.alert(NET_ERROR_MSG, {
                                    title:  getLanguageValue("tip"),
                                    skin: 'self-alert'
                                });
                            })
                }
            }
        })
        .on('move_node.jstree', function (e, data) { //移动节点
            var inst = $('#treeview').jstree(true);
            var nodes = inst.get_node(data.node.parent).children;
            var updateHierarchy = [];
            for (var i = 0; i < nodes.length; i++) {
                var list = [];
                list.push(data.parent);
                list.push(i + 1);
                list.push(nodes[i]);
                updateHierarchy.push(list);
            }
            $.ajax({
                url: "/cloudlink-corrosionengineer/pipemanage/updateHierarchy?token=" + token,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                method: "post",
                data: JSON.stringify({
                    'updateHierarchy': updateHierarchy
                }),
                success: function (result) {
                    if (result.success == 1) {
                        layer.msg(getLanguageValue("tip_moveSuccess"), {
                            time: MSG_DISPLAY_TIME,
                            skin: "self-msg"
                        });
                    } else {
                        data.instance.refresh();
                        layer.alert(result.msg, {
                            title:  getLanguageValue("tip"),
                            skin: 'self-alert'
                        });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                    // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                    layer.alert(NET_ERROR_MSG, {
                        title:  getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                }
            });
        })
        // .on('delete_node.jstree', function(e, data) {//删除节点
        // })
        .on('select_node.jstree', function (e, data) {
            default_text = data.node.text;
            pipelineId = data.node.id;
            pipelinenameForTable = encodeURI(data.node.text);
            // if (data.node.type == "pipeline") {
            // if (data.instance.is_leaf(data.node)) {
            if (data.node.type == "pipeline") {
                canAddMarker = 1; //可以添加测试桩
            } else {
                canAddMarker = 0; //不能添加测试桩
            }
            query(data.node.id);
        });
});

/**
 * @desc 删除节点
 * @param {string} nodeId 要删除节点的id
 */
function deleteNode(nodeId) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/pipemanage/deleteTree?token=" + token,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        method: "post",
        async: false,
        data: JSON.stringify({
            'objectId': nodeId
        }),
        success: function (result) {
            if (result.success == 1) {
                $('#treeview').jstree(true).delete_node(nodeId);
                if (nodeId == pipelineId) {
                    pipelineId = "";
                }
                query();
                canAddMarker = 0;
                // $('#treeview').jstree(true).refresh();
                layer.msg(getLanguageValue("tip_deleteSuccess"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('删除管线', {
                            '结果': '成功'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            } else if (result.success == 0) {
                $('#treeview').jstree(true).refresh();
                layer.alert(result.msg, {
                    title:  getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('删除管线', {
                            '结果': '成功'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            } else {
                // $('#treeview').jstree(true).refresh();
                layer.alert(result.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('删除管线', {
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
                title:  getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 判断是否能删除节点，如果可以，删除节点
 * @param {string} nodeId 要删除节点的id
 */
function canDeleteNode(nodeId) {
    $.ajax({
            url: "/cloudlink-corrosionengineer/pipemanage/verifyBottom?token=" + token,
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            // async:false,
            data: JSON.stringify({
                "objectId": nodeId,
            })
        })
        .done(function (result) {
            if (result.success == 1 && result.result == true) {
                layer.alert(getLanguageValue("tip_deleteInfo"), {
                    title:  getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            } else if (result.success == 1 && result.result == false) {
                layer.confirm(getLanguageValue("tip_deleteConfirm"), {
                    title:  getLanguageValue("tip"),
                    btn: [ getLanguageValue("delete"), getLanguageValue("cancle")], //按钮
                    skin: "self",
                    yes: function () {
                        deleteNode(nodeId);
                    },
                    cancel: function () {}
                });
            } else {
                layer.alert('加载异常', {
                    title:  getLanguageValue("tip"),
                    skin: "self-alert"
                });
            }
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title:  getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
}

/**
 * @desc 新建节点
 * @param {string} parentId 新建节点的父节点
 * @param {string} pipelineName 节点名称
 * @param {string} treeType 新建节点类型
 */
function createNode(parentId, pipelineName, treeType) {
    $.ajax({
            url: "/cloudlink-corrosionengineer/pipemanage/addTree?token=" + token,
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify({
                parentId: parentId,
                pipelineName: pipelineName,
                treeType: treeType
            })
        })
        .done(function (res) {
            if (res.success == 1) {
                var inst = $('#treeview').jstree(true);
                inst.create_node(parentId, {
                    text: pipelineName,
                    type: treeType
                });
                inst = $('#treeview').jstree(true);
                var cbk = function () {
                    inst.deselect_all();
                    inst.select_node(res.objectId);
                }
                inst.refresh_cbk(cbk);
                layer.msg(getLanguageValue("tip_addSuccess"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('新建管线', {
                            '结果': '成功'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            } else {
                layer.alert(result.msg, {
                    title:  getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('新建管线', {
                            '结果': '失败'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
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

/**
 * @desc 判断是否能新建节点
 * @param {json} nodes 新建节点同层级的所有节点
 * @param {string} val 节点名称
 * @param {string} operation 新建还是重命名
 * @returns {boolean}是否能新建 true or false
 */
function canAddOrRenameNode(nodes, val, operation) {
    var inst = $('#treeview').jstree(true);
    if (val.trim().length > 500) {
        layer.alert(getLanguageValue("tip_NameLarge"), {
            title:  getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return false;
    }

    if (operation == "add") { //新增
        var createFlag;
        for (var i = 0; i < nodes.length; i++) {
            var nodeName = inst.get_node(nodes[i]).text;
            if (nodeName.trim() == val.trim()) {
                createFlag = 0;
                break;
            }
        }
        if (createFlag == 0) {
            layer.alert(getLanguageValue("tip_existName"), {
                title:  getLanguageValue("tip"),
                skin: 'self-alert'
            });
            return false;
        }
    } else if (operation == "rename") { //重命名
        var renameFlag = 0;
        for (var i = 0; i < nodes.length; i++) {
            var nodeName = inst.get_node(nodes[i]).text;
            if (nodeName.trim() == data.node.text.trim()) {
                renameFlag++;
                if (renameFlag > 1) {
                    break;
                }
            }
        }
        if (renameFlag > 1) {
            layer.alert(getLanguageValue("tip_existName"), {
                title:  getLanguageValue("tip"),
                skin: 'self-alert'
            });
            return false;
        }
    }
    return true;
}

/**
 * @desc 设置左侧树滚动条
 */
// (function($) {
//     $(window).on("load", function() {
//         // 如果配置不满足条件，则只需向相应的配置对象内添加键值对即可。
//         mCustomScrollbarOptions.axis = "yx";
//         $(".treeview-box").mCustomScrollbar(mCustomScrollbarOptions); // 初始化配置
//     });
// })(jQuery);

/**
 * @desc 添加父节点方法
 */
function addRootNode() {
    var inst = $('#treeview').jstree(true);
    var obj = inst.get_node("#");
    var nodes = inst.get_node("#").children;
    layer.prompt({
        title: getLanguageValue("addPipelineDialog"),
        skin: 'self'
    }, function (val, index) {
        if (canAddOrRenameNode(nodes, val, "add") == true) {
            // inst.create_node(obj, { text: val, type: "pipeline-folder" });
            createNode("#", val.trim(), "pipeline-folder");
            layer.close(index);
        }
    });
}

/**
 * @desc 所有的监听事件
 */
function listenEvent() {
    /**
     * @desc 点击按钮展开/折叠左侧树区域
     */
    $(".divider i").click(function () {
        var w = $(window).width() - 230;
        var hideFlag = $(".div-left").hasClass("tohide");
        if (hideFlag) {
            $(".div-left").animate({
                width: "0px"
            });
            $(".div-right").animate({
                width: "100%"
            }, function () {
                $('#markerTable').bootstrapTable('resetView');
            })
            $(".div-left").removeClass("tohide");
            $(".divider").addClass("ishide");
        } else {
            $(".div-left").animate({
                width: "230px"
            });
            $(".div-right").animate({
                width: w + "px"
            }, function () {
                $('#markerTable').bootstrapTable('resetView');
            });
            $(".div-left").addClass("tohide");
            $(".divider").removeClass("ishide");
        }

    });

    /**
     * @desc 点击中间竖线拖放左右区域
     */
    $("#divider").off('mousedown');
    $("#divider").on('mousedown', function (e) {
        var leftWidthStart = $(".div-left").width();
        var rightWidthStart = $(".div-right").width();
        var mouseStart = {
            x: e.pageX
        };

        function mv(e) {
            var w_left = leftWidthStart + e.pageX - mouseStart.x + 'px';
            var w_right = rightWidthStart - (e.pageX - mouseStart.x) + 'px';
            $(".div-left").width(w_left);
            $(".div-right").width(w_right);
            $('#markerTable').bootstrapTable('resetView');
        }
        $(window).off('dragstart');
        $(window).on('dragstart', function (e) {
            e.preventDefault()
        });
        $(window).off('mousemove');
        $(window).on('mousemove', mv);
        $(window).off('mouseup');
        $(window).on('mouseup', function (e) {
            $(window).off('mousemove');
        });
        // IE阻止事件冒泡
        event.cancelBubble = true;
        event.returnValue = false;
        //以下是针对非IE浏览器的 阻止事件冒泡
        event.stopPropagation();
        event.preventDefault();
    });
}
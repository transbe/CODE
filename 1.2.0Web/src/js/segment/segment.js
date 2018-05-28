/**  
 * @author: lujingrui
 * @date: 2017 - 3 - 3 
 * @last modified by: lujingrui 
 * @last modified time: 2017 - 4 - 13
 * @file: 阴保分段左侧树逻辑
*/
var token;
var isNotExtract;//是否能抽取
var default_text ;// 全局变量 暂时存放重命名时的原名字

/**
 * @desc 窗口调整
 */
$(window).resize(function() {
    var window_h = $(window).height();
    var window_w = $(window).width();
    $("body").css("height", window_h+ "px");
    $(".treeview-box").css("height", window_h - $(".company-header").height() + "px");
    $("body").css("width", window_w + "px");
    var w = window_w - $("div-left").width();
    $(".div-right").css("width", w + "px");
});

/**
 * @desc 初始化方法
 */
$(document).ready(function() {
    token = lsObj.getLocalStorage("token");
    //调整列表div，使其高度等于屏幕高度
    var window_h = $(window).height();
    $("body").css("height", window_h + "px");
    $(".treeview-box").css("height", window_h - $(".company-header").height() + "px");
    var w = $(window).width() - $(".div-left").width()- $(".divider").width();
    $(".div-right").css("width", w + "px");

    //添加监听事件
    addEvent();

    //初始化树
    $.jstree.defaults.core.themes.dots = false;
    $('#treeview').jstree({
            core: {
                dots: false,
                multiple: false,
                animation: 0,
                check_callback: true,
                force_text : true,
                data: function(obj, cb) {
                    var dataItem;
                    $.ajax({
                        //handleURL 权限处理
                        url: handleURL('/cloudlink-corrosionengineer/cpsegment/getCpSegmentChartTree?token=' + token),
                        method: "get",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    })
                    .done(function(res) {
                        if (res.success == 1) {
                            dataItem = res.result;
                            cb.call(this, dataItem);
                        } else {
                            layer.confirm(res.msg, {
                                title: "提示",
                                btn: ['确定'], //按钮
                                skin: 'self'
                            });
                        }
                    })
                }
            },
            contextmenu: {
                items: function(node) {
                    var tmp = $.jstree.defaults.contextmenu.items();
                    delete tmp.create.action;
                    delete tmp.ccp;
                    tmp.create.label = "新建";
                    tmp.create.submenu = {
                        "create_folder": {
                            //"separator_after": true,
                            "label": "目录",
                            "action": function(data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                var nodes = inst.get_node(obj).children;
                                layer.prompt({ title: '请输入目录名称', skin: 'self' }, function(val, index) {
                                    if (canAddOrRenameNode(nodes,val.trim(),"add") == true) {
                                        // inst.create_node(obj, { text: val, type: "default" });
                                        createNode(obj.id,val.trim(),"default");
                                    } 
                                });
                            }
                        },
                        "create_chart": {
                            "label": "逻辑图",
                            "action": function(data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                var nodes = inst.get_node(obj).children;
                                layer.prompt({ title: '请输入逻辑图名称', skin: 'self' }, function(val, index) {
                                    if (canAddOrRenameNode(nodes,val.trim(),"add") == true) {
                                        // inst.create_node(obj, { text: val, type: "default" });
                                        createNode(obj.id,val.trim(),"chart");
                                    } 
                                });
                            }
                        }
                    };
                    tmp.rename.label = "重命名";
                    // tmp.remove.label = "删除";
                    tmp.remove = {
                            "label": "删除",
                            "action": function(data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                var index = layer.confirm('确定删除 ' + obj.text, {
                                    title: "提示",
                                    btn: ['删除', '取消'],
                                    skin: "self", //按钮
                                    yes: function() {
                                        inst.delete_node(obj);
                                        layer.close(index);
                                    },
                                    cancel: function() {
                                        layer.close(index);
                                    }
                                });
                            }
                        }
                        //tmp.ccp.label = "编辑";
                        //tmp.ccp.submenu.copy.label = "复制";
                        //tmp.ccp.submenu.cut.label = "剪切";
                        //tmp.ccp.submenu.paste.label = "粘贴";

                    if (this.get_type(node) === "default") {
                        if (this.get_node(node).children.length > 0) {
                            delete tmp.remove;
                        }
                    }
                    if (this.get_type(node) === "file") {
                        delete tmp.create;
                        delete tmp.remove;
                    }
                    if (this.get_type(node) === "chart") {
                        delete tmp.create;
                    }
                    if (this.get_type(node) === "publish") {
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
            types: {
                default: {
                    icon: 'folder-icon'
                },
                file: {
                    icon: 'segment-icon',
                    valid_children: []
                },
                chart: {
                    icon: 'chart-icon',
                    valid_children: []
                },
                publish: {
                    icon: 'publish-icon',
                    valid_children: []
                }
            },
            plugins: ['contextmenu', "types", "state", "sort"]
        })
        .on('loaded.jstree', function(e, data) {
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
        // .on('create_node.jstree', function(e, data) {
        // })
        .on('rename_node.jstree', function(e, data) {
            var renameFlag = 0;//是否能重命名 大于1的情况下不能重命名
            var inst = $('#treeview').jstree(true);
            var nodes = inst.get_node(data.node.parent).children;
            for (var i = 0; i < nodes.length; i++) {
                var nodeName = inst.get_node(nodes[i]).text;
                if (nodeName.trim() == data.node.text.trim()) {
                    renameFlag++;
                }
            }
            if (renameFlag > 1) {
                layer.confirm('已存在该文件名，请重命名！', {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self',
                    yes:function(index){
                        inst.rename_node(data.node,default_text);
                        inst.edit (data.node);
                        layer.close(index);
                    }
                });
            } else if(data.node.text.trim().length>500){
                 layer.confirm('文件名称不能超过500字！', {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self',
                    yes:function(index){
                        inst.rename_node(data.node,default_text);
                        inst.edit (data.node);
                        layer.close(index);
                    }
                });
            } else {
                if(data.node.text != default_text){
                      $.ajax({
                        url: '/cloudlink-corrosionengineer/cpsegment/updateTreeName?token=' + token,
                        method: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'JSON',
                        data: JSON.stringify({
                            id: data.node.id,
                            text: data.node.text.trim(),
                            type: data.node.type

                        })
                    })
                    .done(function(res) {
                        if (res.success == 1) {
                            layer.msg("修改成功", {time: MSG_DISPLAY_TIME, skin: "self-success" });
                        } else {
                            layer.confirm(res.msg, {
                                title: "提示",
                                btn: ['确定'], //按钮
                                skin: 'self'
                            });
                            data.instance.refresh();
                        }

                    })
                }
            }
        })
        // .on('move_node.jstree', function(e, data) {
        // })
        .on('delete_node.jstree', function(e, data) {
            if (data.node.type == "default") {
                $.ajax({
                        url: '/cloudlink-corrosionengineer/cpsegment/deleteChartFolder?token=' + token,
                        method: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'JSON',
                        data: JSON.stringify({
                            objectId: data.node.id,
                            modifyDatetime: data.node.original.attributes.modifyDatetime
                        })
                    })
                    .done(function(res) {
                        if (res.success == 1) {
                            layer.msg('删除成功！', { time: MSG_DISPLAY_TIME,skin: "self-success" });
                            // normalRefresh();
                            $(".div-right").empty();
                            try {
                                if (zhugeSwitch == 1) {
                                    zhuge.track('删除逻辑图目录', { '结果': '成功' });
                                }
                            } catch (err) {
                                //在此处理错误
                            }
                        } else {
                            layer.confirm(res.msg, {
                                title: "提示",
                                btn: ['确定'], //按钮
                                skin: 'self'
                            });
                            normalRefresh();
                            try {
                                if (zhugeSwitch == 1) {
                                    zhuge.track('删除逻辑图目录', { '结果': '失败' });
                                }
                            } catch (err) {
                                //在此处理错误
                            }
                        }

                    })
            } else if (data.node.type == "chart" || data.node.type == "publish") {
                $.ajax({
                        url: '/cloudlink-corrosionengineer/cpsegment/deleteChart?token=' + token,
                        method: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'JSON',
                        data: JSON.stringify({
                            objectId: data.node.id
                        })
                    })
                    .done(function(res) {
                        if (res.success == 1) {
                            layer.msg('删除成功！', {time: MSG_DISPLAY_TIME, skin: "self-success" });
                            // normalRefresh();
                            $(".div-right").empty();
                            try {
                                if (zhugeSwitch == 1) {
                                    zhuge.track('删除逻辑图', { '结果': '成功' });
                                }
                            } catch (err) {
                                //在此处理错误
                            }
                        } else {
                            layer.confirm(res.msg, {
                                title: "提示",
                                btn: ['确定'], //按钮
                                skin: 'self'
                            });
                            normalRefresh();
                            try {
                                if (zhugeSwitch == 1) {
                                    zhuge.track('删除逻辑图', { '结果': '失败' });
                                }
                            } catch (err) {
                                //在此处理错误
                            }
                        }

                    })
            }
        })
        .on('select_node.jstree', function(e, data) {
            default_text = data.node.text;
            // console.log(data.node);
            var id = data.node.id;
            var chartName = encodeURI(data.node.text);
            var folderId = data.node.parent;
            var inst = $('#treeview').jstree(true);
            var type = inst.get_type(data.node);
            if (inst.get_type(data.node) === "chart") {
                $(".div-right").empty();
                $(".div-right").html('<iframe src="svg/view_chart.html?objectId=' + id + '&chartName=' + chartName + '&folderId=' + folderId + '&type=chart" style="width:100%;height:100%;" id="chartDraw"></iframe>');
            } else if (inst.get_type(data.node) === "publish") {
                if (data.node.children.length > 0) {
                    isNotExtract = false;
                } else {
                    isNotExtract = true;
                }
                $(".div-right").empty();
                $(".div-right").html('<iframe src="svg/view_chart.html?objectId=' + id + '&chartName=' + chartName + '&folderId=' + folderId + '&type=publish" style="width:100%;height:100%;" id="chartDraw"></iframe>');
            } else if (inst.get_type(data.node) === "default") {
                $(".div-right").empty();
            } else if (inst.get_type(data.node) === "file") {
                var parentDomId = document.getElementById("chartDraw");
                // console.log(parentDomId);
                if (parentDomId != null && parentDomId != "" && parentDomId != undefined) {
                    var iframeSrc = parentDomId.src;
                    var pId = getParameter("objectId", iframeSrc);
                    // console.log(pId);
                    if (pId == folderId) {
                        // fileId=id;//定义了一个全局变量，管段的ID
                        parentDomId.contentWindow.isGetetHighlight(id);
                    } else {
                        $(".div-right").empty();
                        $(".div-right").html('<iframe src="svg/view_chart.html?objectId=' + folderId + '&chartName=' + chartName + '&fileId=' + id + '&type=file" style="width:100%;height:100%;" id="chartDraw"></iframe>');
                    }
                } else {
                    $(".div-right").html('<iframe src="svg/view_chart.html?objectId=' + folderId + '&chartName=' + chartName + '&fileId=' + id + '&type=file" style="width:100%;height:100%;" id="chartDraw"></iframe>');
                }

            }

        });
    });


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
 * @desc 新建节点
 * @method createNode
 * @param {string} parentId 新建节点的父节点
 * @param {string} name 节点名称
 * @param {string} treeType 新建节点类型
 */
function createNode(parentId,name,treeType){
    var url;//url地址
    var data;//向后台传参
    var logText;//诸葛io中提示语句
    if(treeType == "default"){
        url = '/cloudlink-corrosionengineer/cpsegment/addChartFolder?token=' + token;
        data = JSON.stringify({
                    parent: parentId,
                    text: name
                });
        logText = "新建逻辑图目录"
    }else if(treeType == "chart"){
        url = '/cloudlink-corrosionengineer/cpsegment/addChart?token=' + token;
        data = JSON.stringify({
                folderId: parentId,
                chartName: name
            })
         logText = "新建逻辑图"
    }
    $.ajax({
        url: url,
        method: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: data
    })
    .done(function(res) {
        if (res.success == 1) {
            var inst = $('#treeview').jstree(true);
            inst.create_node(parentId, { text: name, type: treeType });
            inst = $('#treeview').jstree(true);
            var cbk = function() {
                inst.deselect_all();
                inst.select_node(res.result.objectId);
            }
            inst.refresh_cbk(cbk);
            layer.msg("添加成功！", { time: MSG_DISPLAY_TIME, skin: "self-success" });
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track(logText, { '结果': '成功' });
                }
            } catch (err) {
                //在此处理错误
            }
        } else {
            layer.confirm(result.msg, {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track(logText, { '结果': '失败' });
                }
            } catch (err) {
                //在此处理错误
            }
        }
    })
}

/**
 * @desc 判断是否能新建节点
 * @method canAddOrRenameNode
 * @param {json} nodes 新建节点同层级的所有节点
 * @param {string} val 节点名称
 * @param {string} operation 新建还是重命名
 * @return {boolean}是否能新建 true or false
 */
function canAddOrRenameNode(nodes,val,operation){
    var inst = $('#treeview').jstree(true);
    if(val.trim().length > 500){
        layer.confirm("名称长度不能超过500字", {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
        return false;
    }
    if(operation == "add"){//新增
        var createFlag;
        for (var i = 0; i < nodes.length; i++) {
            var nodeName = inst.get_node(nodes[i]).text;
            if (nodeName == val) {
                createFlag = 0;
                break;
            }
        }
        if(createFlag == 0){
            layer.confirm("已存在该名称", {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            return false;
        }
    }else if(operation == "rename"){//重命名
        var renameFlag=0;
         for (var i = 0; i < nodes.length; i++) {
            var nodeName = inst.get_node(nodes[i]).text;
            if (nodeName == data.node.text) {
                renameFlag++;
                if(renameFlag>1){
                    break;
                }
            }
        }
        if(renameFlag>1){
            layer.confirm("已存在该名称", {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            return false;
        }
    }
    return true;
}

/**
 * @desc 新增父节点
 * @method addRootNode
 */
function addRootNode() {
    var inst = $('#treeview').jstree(true);
    var obj = inst.get_node("#");
    var nodes = obj.children;
    layer.prompt({ title: '请输入目录名称', skin: 'self' }, function(val, index) {
        if (canAddOrRenameNode(nodes,val.trim(),"add") == true) {
            createNode("#",val.trim(),"default");
        } 
    });
}

/**
 * @desc 使某个节点处于选中状态
 * @method setNodeSelect
 */
function setNodeSelect(nodeId) {
    $('#treeview').jstree(true).select_node(nodeId);
}

/**
 * @desc 取消选中
 * @method setNodeSelect
 */
function deselectNode() {
    $('#treeview').jstree(true).deselect_all();
}

/**
 * @desc 刷新树的方法 有回调方法(发布成功回调)
 * @method refreshTree
 * @param {string} nodeId 节点id
 */
function refreshTree(nodeId) {
    var cbk = function() {
        deselectNode();
        setNodeSelect(nodeId);
    }
    $('#treeview').jstree(true).refresh_cbk(cbk);
    layer.msg("发布成功！", {time: MSG_DISPLAY_TIME, skin: "self-success" });
}

/**
 * @desc 刷新树 无回调方法(抽取成功回调)
 * @method refreshTreeNoCbk
 */
function refreshTreeNoCbk() {
    $('#treeview').jstree(true).refresh();
    layer.msg("抽取成功！", { time: MSG_DISPLAY_TIME,skin: "self-success" });
}

/**
 * @desc 普通刷新方法
 * @method normalRefresh
 */
function normalRefresh() {
    $('#treeview').jstree(true).refresh();
}

/**
 * @desc 为拖动页面创建遮罩层
 * @method createMask
 */
function createMask() {
    //创建背景 
    var rootEl = document.documentElement || document.body;
    var docHeight = ((rootEl.clientHeight > rootEl.scrollHeight) ? rootEl.clientHeight : rootEl.scrollHeight) + "px";
    var docWidth = ((rootEl.clientWidth > rootEl.scrollWidth) ? rootEl.clientWidth : rootEl.scrollWidth) + "px";
    var shieldStyle = "position:absolute;top:0px;left:0px;width:" + docWidth + ";height:" + docHeight + ";background:#000;z-index:10000;filter:alpha(opacity=0);opacity:0";
    $("<div id='shield' style=\"" + shieldStyle + "\"></div>").appendTo("body");
}

/**
 * @desc 添加监听事件
 * @method addEvent
 */
function addEvent(){
    /**
     * @desc 点击按钮收缩或展开树
     */
    $(".divider i").click(function() {
        var hideFlag = $(".div-left").hasClass("tohide");
        var w = $(window).width() - 230;
        if (hideFlag) {
            $(".div-left").animate({ width: "0px" });
            $(".div-right").animate({ width: "100%" })
            $(".div-left").removeClass("tohide");
            $(".divider").addClass("ishide");
        } else {
            $(".div-left").animate({ width: "230px" });
            $(".div-right").animate({ width: w + "px" });
            $(".div-left").addClass("tohide");
            $(".divider").removeClass("ishide");
        }
    });

    /**
     * @desc 为拖动添加事件
     */
    $("#divider").off('mousedown');
    $("#divider").on('mousedown', function(e) {
        createMask();
        var leftWidthStart = $(".div-left").width();
        var rightWidthStart = $(".div-right").width();
        var mouseStart = { x: e.pageX };

        function mv(e) {
            var w_left = leftWidthStart + e.pageX - mouseStart.x + 'px';
            var w_right = rightWidthStart - (e.pageX - mouseStart.x) + 'px';
            $(".div-left").width(w_left);
            $(".div-right").width(w_right);
        }
        // $(window).off('dragstart');
        // $(window).on('dragstart', function(e) {e.preventDefault()});
        $(window).off('mousemove');
        $(window).on('mousemove', mv);
        $(window).off('mouseup');
        $(window).on('mouseup', function() {
            $(window).off('mousemove');
            $("#shield").remove();
        });
        // IE阻止事件冒泡
        event.cancelBubble = true;
        event.returnValue = false;
        //以下是针对非IE浏览器的 阻止事件冒泡
        event.stopPropagation();
        event.preventDefault();
    });
}


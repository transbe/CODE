;(function($){
    var type = getParameter("type");
    var mouseCurrentX,mouseCurrentY;
    var  logicDiagram = {
        init:function(){
            changePageStyle("../.."); // 换肤
            this.initPageAndImage() // 初始化页面和工具栏图片
            this.initChart(); // 初始化逻辑图页面
            this.setPageMetaExtent();//设置pageMeta的extent对象

            // 绑定事件
            this.bindContainerDiv(); 
            this.bindPageMetaPanel();
            this.bindWindowEvent();
            this.bindAttributetable();
        },
        initChart:function() {
            if (type == "chart") { //逻辑图
                console.log(type);
                if (judgePrivilege()) { //权限控制
                    pageMeta.editable = false;
                    $(".for-operation").hide();
                    //隐藏左边工具栏
                    visitPanel();
                } else {
                    $("#save").show();
                    $("#publish").show();
                    $("#equipmentlist").hide();
                    var timer = setInterval(save, 60 * 1000);
                }
            } else if (type == "publish") { //已发布逻辑图
                 console.log(type);
                if (judgePrivilege()) { //权限控制
                    $(".for-operation").hide();
                } else {
                    if (parent.isNotExtract) {
                        $("#extract").show();
                    }
                    $("#edit").show();
                    $("#equipmentlist").hide();
                }
                //隐藏左边工具栏
                visitPanel();
                $("#shapepanel").hide();
                //设置画布不可编辑
                pageMeta.editable = false;
            } else if (type == "file") { //管段
                console.log(type);
                if (judgePrivilege()) {
                    $(".for-operation").hide();
                }
                this.isGetetHighlight();
                //隐藏左边工具栏
                visitPanel();
                $("#shapepanel").hide();

                //设置画布不可编辑
                pageMeta.editable = false;
            }else{  
                console.log(type);
                $(".for-operation").animate({
                    top: "-42px"
                }).hide();
                $("#shapepanel").animate({
                    left: "-103px"
                }).hide();
                $("#viewpanel").css({
                    left:"0px",
                    top:"0px",
                });
                resizeWindow()
                //设置画布不可编辑
                pageMeta.editable = false;
            }
            $("#equipmentlist").css("left", 35).css("top", 70);
        },
        initPageAndImage:function(){
            pageMeta.canvas = Raphael(pageMeta.container, pageMeta.canvasSize.width, pageMeta.canvasSize.height); // 创建Raphael画布
            pageMeta.canvasDiv = $('#' + pageMeta.container); // Raphael画布容器
            pageMeta.collection = new ShapeCollection(); // 创建图片连接的实例化对象

            for (var a in imageMeta) {
                if (a.length == 2) { // 为每个图形菜单对象添加属性
                    var image = $('#image' + a);
                    var td = $('#td' + a);
                    td.attr('url', imageMeta[a].url);
                    td.attr('warningurl', imageMeta[a].warningurl);
                    image.attr('src', imageMeta[a].url);
                }
            }
            resizeCanvas(); 
            {
                $('#canvasWidth').val(pageMeta.canvasSize.width);
                $('#canvasHeight').val(pageMeta.canvasSize.height);
            };
        },
        setPageMetaExtent:function(){
            {
                pageMeta.extent = new ShapeBean();
                pageMeta.extent.raphael = pageMeta.canvas;
                pageMeta.extent.shapeType = ShapeConfig.SHAPE_RECT;
                pageMeta.extent.x = -1000;
                pageMeta.extent.y = -1000;
                pageMeta.extent.width = 1;
                pageMeta.extent.height = 1;
                pageMeta.extent.border = 1;
                pageMeta.extent.radius = 2;
                pageMeta.extent.hasExtent = false;
                pageMeta.extent.fillColor = '#0000FF';
                pageMeta.extent.color = '#0000FF';
                pageMeta.extent.opacity = 0.1;
                pageMeta.extent.scope = pageMeta.canvasExtent;
                pageMeta.extent.moveFun = function() {
                    var dx = pageMeta.extent.x - pageMeta.panel_x;
                    var dy = pageMeta.extent.y - pageMeta.panel_y;
                    for (var i = 0; i < pageMeta.selectedShapeList.length; i++) {
                        var shape = pageMeta.selectedShapeList[i];
                        var locat = pageMeta.selectedShapeLocatList[i];
                        if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                            shape.x = locat.x + dx;
                            shape.y = locat.y + dy;
                            shape.moveTo();
                        } else {
                            if (shape.beginShape == null || shape.endShape == null) {
                                if (shape.beginShape == null) {
                                    shape.bx = locat.bx + dx;
                                    shape.by = locat.by + dy;
                                }
                                if (shape.endShape == null) {
                                    shape.ex = locat.ex + dx;
                                    shape.ey = locat.ey + dy;
                                }
                                if (shape.mShape) {
                                    shape.cx = locat.cx + dx;
                                    shape.cy = locat.cy + dy;
                                }
                                shape.moveTo();
                            } else {
                                if (shape.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {
                                    shape.cx = locat.cx + dx;
                                    shape.cy = locat.cy + dy;
                                    shape.moveTo();
                                    shape.resetShape();
                                }
                            }
                        }
                    }
                };
                pageMeta.extent.upFun = function() {
                    saveView();
                };
                pageMeta.extent.createShape();
            }
        },
        bindContainerDiv:function(){
            /**
             * @desc 画板的各种鼠标事件
             */
            var containerDiv = $('#' + pageMeta.container); // 画板
            containerDiv.css('cursor', 'default');
            containerDiv.mousedown(function(e) {
                shapeClick(pageMeta.selectedBean);
                if (pageMeta.editable) {
                    var offset = $(this).offset();
                    pageMeta.start_x = (pageMeta.mouse_x - offset.left);
                    pageMeta.start_y = (pageMeta.mouse_y - offset.top);
                    var remove = true;
                    var box = pageMeta.extent.shape.getBBox();
                    if (pageMeta.start_x >= box.x && pageMeta.start_x <= box.x + box.width && pageMeta.start_y >= box.y &&
                        pageMeta.start_y <= box.y + box.height) {
                        remove = false;
                    }
                    if (remove) {
                        hideExtent();
                        pageMeta.drawExtent = true;
                    }
                }
            });
            containerDiv.mousemove(function(e) {
                if (pageMeta.drawExtent) {
                    var offset = $(this).offset();
                    var relativeX = (e.pageX - offset.left);
                    var relativeY = (e.pageY - offset.top);
                    pageMeta.extent.shape.show();
                    var x = 0;
                    var y = 0;
                    var width = 0;
                    var height = 0;
                    if (relativeX > pageMeta.start_x) {
                        x = pageMeta.start_x;
                        width = relativeX - pageMeta.start_x;
                    } else {
                        x = relativeX;
                        width = pageMeta.start_x - relativeX;
                    }
                    if (relativeY > pageMeta.start_y) {
                        y = pageMeta.start_y;
                        height = relativeY - pageMeta.start_y;
                    } else {
                        y = relativeY;
                        height = pageMeta.start_y - relativeY;
                    }
                    pageMeta.extent.x = x + width / 2;
                    pageMeta.extent.y = y + height / 2;
                    pageMeta.extent.width = width;
                    pageMeta.extent.height = height;
                    pageMeta.extent.moveTo();
                }
            });
            containerDiv.mouseup(function(e) {
                if (pageMeta.drawExtent) {
                    pageMeta.drawExtent = false;
                    selectShape();
                    getSelectShapeLoact();
                }
            });
        },
        bindPageMetaPanel:function(){
            /**
             * @desc 图形菜单栏的拖拽 
             */
            pageMeta.panel = $('#selectpanel');
            $(document).mousemove(function(e) {
                mouseCurrentX = e.pageX - 120;
                mouseCurrentY = e.pageY - 40;
                drawMouseMove(e);
            });
            $(document).mouseup(function(e) {
                drawMouseUp();
            });
        },
        bindWindowEvent:function(){
            /**
             * @desc 键盘事件
             */
            $(document).keydown(function(e) {
                if (pageMeta.keyState) {
                    e = window.event || e;
                    var keyCode = e.keyCode || e.which;
                    // e.preventDefault();
                    e.stopPropagation();
                    if (e.ctrlKey && keyCode == 89) { //ctrl+y
                        //	nextView();
                    }
                    if (e.ctrlKey && keyCode == 90) { //ctrl+z
                        //	previousView();
                    }
                    if (e.ctrlKey && keyCode == 67) { //ctrl+c
                        copyShape();
                    }
                    if (e.ctrlKey && keyCode == 86) { //ctrl+v
                        pasteShape(mouseCurrentX, mouseCurrentY);
                    }
                    if (keyCode == 46) { //del
                        if (pageMeta.editable) {
                            isHaveMarker();
                            // clearShape(false);
                        }
                    }
                }
            });
            $(window).resize(function() {
                resizeWindow();
            });
        },
        bindAttributetable:function(){
            /**
             * @desc 属性悬浮窗的移动事件
             */
            pageMeta.attributetable = $('#attributepanel');
            pageMeta.attributetable.css({
                'left': $(window).width() - 230,
                'top': 70
            });
            $('#attributeheader').mousedown(function(e) {
                pageMeta.attributemove = true;
                pageMeta.attr_start_x = parseInt(pageMeta.attributetable.css('left').replace('px', ''));
                pageMeta.attr_start_y = parseInt(pageMeta.attributetable.css('top').replace('px', ''));
                pageMeta.attr_mouse_x = e.screenX;
                pageMeta.attr_mouse_y = e.screenY;
                pageMeta.attributeclick = true;
            });
            $(window).mousemove(function(e) {
                if (pageMeta.attributemove) {
                    pageMeta.attributeclick = false;
                    var x = e.screenX - pageMeta.attr_mouse_x + pageMeta.attr_start_x;
                    var y = e.screenY - pageMeta.attr_mouse_y + pageMeta.attr_start_y;
                    
                    if ($("#shapepanel").css("left") == "-103px" && x < 0) {
                        x = 0;
                    }else if(x < 113){
                        x = 113;
                    }

                    if($(".for-operation").css("top") == "-42px" && y < 0){
                         y = 0;
                    }else if( y < 42){
                         y = 42;
                    }
                    if (x > pageMeta.bodyWidth - 200) {
                        x = pageMeta.bodyWidth - 200;
                    }
                    if (y > pageMeta.bodyHeight - 35) {
                        y = pageMeta.bodyHeight - 35;
                    }
                    pageMeta.attributetable.css({
                        'left': x,
                        'top': y
                    });
                }
            });
            $(window).mouseup(function(e) {
                if (pageMeta.attributemove) {
                    pageMeta.attributemove = false;
                    if (pageMeta.attributeclick) {
                        var attributeview = $('#attributeview');
                        if (attributeview.is(':hidden')) {
                            attributeview.show();
                        } else {
                            attributeview.hide();
                        }
                    }
                }
            });
        },
        drawChart:function(){
            var tempList1 = getChartStr(); // 画板逻辑图对象
            createGeometrys(tempList1); // 创建几何图形
        },
        isGetetHighlight:function(fileId) {
            if (fileId != null && fileId != "" && fileId != undefined) {
                getHighlight(fileId);
            } else {
                var objectId = getParameter("fileId");
                getHighlight(objectId);
            }
        },
        clearAllShape:function(){
            clearShape(true);
        }
    }
    window.logicDiagram = logicDiagram;
}(jQuery));

// $(function() {
//     resizeWindow();
//     if (pageMeta.editable) {
//         saveView();
//     }
// });

$(function(){
    logicDiagram.init(); //  初始化画图
    logicDiagram.drawChart(); // 画图
    logicDiagram.isGetetHighlight();  // 高亮
})
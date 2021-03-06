// layer.js 全局配置
layer.config({
    extend: 'patch/style.css',
    skin: 'app-layer-patch',
    resize: false,
    maxmin: true,
    btnAlign: 'c'
});

//自定义js

//公共配置


$(document).ready(function () {


    /**
     * 渲染菜单
     * getMenuNodes为渲染数据，一个数据
     * 
     * getMenuNodes()方法移动至privilege.js中定义
     */
    $('#side-menu').renderMenu(getMenuNodes(), function (event, el, data) {
        if (data.url && data.url != '' && data.url != '#') {
            menuItem(el);
        } else if (data.url == undefined && $("body").hasClass("mini-navbar")) {
            $("body").toggleClass("mini-navbar");
            SmoothlyMenu();
        }
        /**
         * 扩展区
         * 这里为菜单点击事件处理函数
         * 接收3个参数：
         * event：事件event对象
         * el：点击节点的jQuery对象
         * data: 点击节点的源数据
         */
    });


    // Small todo handler
    $('.check-link').click(function () {
        var button = $(this).find('i');
        var label = $(this).next('span');
        button.toggleClass('fa-check-square').toggleClass('fa-square-o');
        label.toggleClass('todo-completed');
        return false;
    });

    //固定菜单栏
    $(function () {
        $('.sidebar-collapse').slimScroll({
            size: '6px',
            height: '100%',
            railOpacity: 0.9,
            alwaysVisible: false
        });

        loadSelfDefinedTemplate();
    });


    //菜单切换
    //  $('.navbar-minimalize').click(function() {
    //      $("body").toggleClass("mini-navbar");
    //      SmoothlyMenu();
    //  });

    $('.nav-control').click(function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });


    // 侧边栏高度
    //  function fix_height() {
    //      var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    //      $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    //  }
    //  fix_height();

    //  $(window).bind("load resize click scroll", function() {
    //      if (!$("body").hasClass('body-small')) {
    //          fix_height();
    //      }
    //  });

    //侧边栏滚动
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $('.full-height-scroll').slimScroll({
        height: '100%'
    });

    // $('#side-menu>li').click(function() {
    //     if ($('body').hasClass('mini-navbar')) {
    //         NavToggle();
    //     }
    // });
    // $('#side-menu>li li a').click(function() {
    //     if ($(window).width() < 769) {
    //         NavToggle();
    //     }
    // });

    // $('.nav-close').click(NavToggle);

    //ios浏览器兼容性处理
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        $('#content-main').css('overflow-y', 'auto');
    }

});

// $(window).bind("load resize", function() {
//     if ($(this).width() < 769) {
//         $('body').addClass('mini-navbar');
//         $('.navbar-static-side').fadeIn();
//     }
// });

// function NavToggle() {
//     $('.navbar-minimalize').trigger('click');
// }

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(500);
            }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(500);
            }, 300);
    } else {
        $('#side-menu').removeAttr('style');
    };
}



/**
 * 获取菜单节点数据
 * @function
 * @return     {array}
 */


function getMenuNodes() {

    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    var roleNameNum = parseInt(lsObj.getLocalStorage('params'));
    var language = lsObj.getLocalStorage("i18nLanguage"); //当前语言类型
    // alert(roleNameNum);

    // 阴保工程师菜单
    var menuArr1 = [{
            id: 1,
            text: getLanguageValue("home"),
            url: 'src/html/index/welcome.html',
            icon: 'fa fa-home'
        },
        {
            id: 2,
            text: getLanguageValue('TPs-Management'),
            url: 'src/html/marker/marker.html',
            icon: 'fa fa-anchor',
        }, {
            id: 3,
            text: getLanguageValue('CPS-Schematic'),
            url: 'src/html/segment/segment.html',
            icon: 'fa fa-sitemap'
        },
        {
            id: 4,
            text: getLanguageValue('Task-management'),
            icon: 'fa fa-file',
            childs: [
                // {
                //     id: 7,
                //     text: '检测账号管理',
                //     url: 'src/html/datacollection/datacollection.html',
                // }, 
                {
                    id: 40,
                    text: getLanguageValue('alltask'),
                    url: 'src/html/task/all_task/all_task.html',
                }, {
                    id: 41,
                    text: getLanguageValue('M1'),
                    url: 'src/html/task/specific_task/query_task.html?method=1',
                }, {
                    id: 42,
                    text: getLanguageValue('M2'),
                    url: 'src/html/task/specific_task/query_task.html?method=2',
                }, {
                    id: 43,
                    text: getLanguageValue('M3'),
                    url: 'src/html/task/specific_task/query_task.html?method=3',
                }, {
                    id: 44,
                    text: getLanguageValue('M4'),
                    url: 'src/html/task/specific_task/query_task.html?method=4',
                }, {
                    id: 45,
                    text: getLanguageValue('M5'),
                    url: 'src/html/task/specific_task/query_task.html?method=5',
                }, {
                    id: 46,
                    text: getLanguageValue('M6'),
                    url: 'src/html/task/specific_task/query_task.html?method=6',
                }, {
                    id: 47,
                    text: getLanguageValue('M7'),
                    url: 'src/html/task/specific_task/query_task.html?method=7',
                }, {
                    id: 48,
                    text: getLanguageValue('M8'),
                    url: 'src/html/task/specific_task/query_task.html?method=8',
                }, {
                    id: 49,
                    text: getLanguageValue('M9'),
                    url: 'src/html/task/specific_task/query_task.html?method=9',
                }, {
                    id: 50,
                    text: getLanguageValue('M10'),
                    url: 'src/html/task/specific_task/query_task.html?method=10',
                }
                // , {
                //     id: 51,
                //     text: getLanguageValue('M11'),
                //     url: 'src/html/task/specific_task/query_task.html?method=11',
                // }
                ,{
                    id: 101,
                    icon: 'fa fa-sliders',
                    text: getLanguageValue('custom'),
                    // url: 'src/html/enterprise_defintion/custom_tasktype.html',
                    // url: 'src/html/enterprise_defintion/query_template.html',
                    url: 'src/html/enterprise_defintion/query_defintion.html',
                    icon: 'fa fa-file',
                    // url: 'src/html/enterprise_defintion/tasktype_defintion.html',    
                }
            ]
        },
        {
            id: 5,
            text: getLanguageValue('Operation-Scope'),
            icon: 'fa fa-server',
            url: 'src/html/detection_area/query_area.html'
        }, {
            id: 6,
            text: getLanguageValue('Data-Interpretation'),
            icon: 'fa fa-pie-chart',
            childs: [{
                    id: 71,
                    text: getLanguageValue('Aligment'),
                    url: 'src/html/data_analysis/pipeline_alignment.html',
                },
                {
                    id: 72,
                    text: getLanguageValue('Evolution-of-CP-reading'),
                    url: 'src/html/data_analysis/marker_history.html',
                }
            ]
        }, {
            id: 7,
            text: getLanguageValue('Specilist-Services'),
            icon: 'fa fa-user-secret',
            childs: [{
                    id: 91,
                    text: getLanguageValue('My-Specilist'),
                    url: 'src/html/expert_and_report/expert/my_expert.html',
                },
                {
                    id: 92,
                    text: getLanguageValue('CP-Efficiency-Report'),
                    url: 'src/html/expert_and_report/report/query_application.html?reportType=1',
                }, {
                    id: 83,
                    text: getLanguageValue('CPS-Integrity-Report'),
                    url: 'src/html/expert_and_report/report/query_application.html?reportType=2',
                },

            ]
        },
        {
            id: 8,
            // text: getLanguageValue('Maintenances-Management'),
            text: getLanguageValue('Maintenances-Management'),
            icon: 'fa fa-wrench',
            url: 'src/html/repair/query_repair.html'
        },
        {
            id: 9,
            text: getLanguageValue('Engineer-Tools'),
            icon: 'fa fa-credit-card',
            childs: [{
                    id: 81,
                    text: getLanguageValue('shenjingyangji'),
                    url: 'src/html/toolkit/select_location.html',
                },
                {
                    id: 82,
                    text: getLanguageValue('jieditijulijisuan'),
                    url: 'src/html/toolkit/calculate_distance.html',
                }
            ]
        }
    ];

    // 现场检测人员菜单
    var menuArr2 = [{
            id: 1,
            text: getLanguageValue("home"),
            url: 'src/html/index/welcom_collect.html',
            icon: 'fa fa-home'
        },
        {
            id: 2,
            text: getLanguageValue('Task-management'),
            icon: 'fa fa-file',
            childs: [
                // {
                //     id: 7,
                //     text: '检测账号管理',
                //     url: 'src/html/datacollection/datacollection.html',
                // }, 
                {
                    id: 20,
                    text: getLanguageValue('alltask'),
                    url: 'src/html/task/all_task/all_task.html',
                }, {
                    id: 21,
                    text: getLanguageValue('M1'),
                    url: 'src/html/task/specific_task/query_task.html?method=1',
                }, {
                    id: 22,
                    text: getLanguageValue('M2'),
                    url: 'src/html/task/specific_task/query_task.html?method=2',
                }, {
                    id: 23,
                    text: getLanguageValue('M3'),
                    url: 'src/html/task/specific_task/query_task.html?method=3',
                }, {
                    id: 24,
                    text: getLanguageValue('M4'),
                    url: 'src/html/task/specific_task/query_task.html?method=4',
                }, {
                    id: 25,
                    text: getLanguageValue('M5'),
                    url: 'src/html/task/specific_task/query_task.html?method=5',
                }, {
                    id: 26,
                    text: getLanguageValue('M6'),
                    url: 'src/html/task/specific_task/query_task.html?method=6',
                }, {
                    id: 27,
                    text: getLanguageValue('M7'),
                    url: 'src/html/task/specific_task/query_task.html?method=7',
                }, {
                    id: 28,
                    text: getLanguageValue('M8'),
                    url: 'src/html/task/specific_task/query_task.html?method=8',
                }, {
                    id: 29,
                    text: getLanguageValue('M9'),
                    url: 'src/html/task/specific_task/query_task.html?method=9',
                }, {
                    id: 30,
                    text: getLanguageValue('M10'),
                    url: 'src/html/task/specific_task/query_task.html?method=10',
                }
                // , {
                //     id: 31,
                //     text: getLanguageValue('M11'),
                //     url: 'src/html/task/specific_task/query_task.html?method=11',
                // }
            ]
        }
    ];

    // 企业管理人员子菜单
    var enterpriseChildArr = [{
        id: 81,
        text: getLanguageValue('zuzhijigou'),
        url: 'src/html/enterprise/organization_management.html',
    }, {
        id: 82,
        text: getLanguageValue('renyuanguanli'),
        url: 'src/html/enterprise/people_management.html',
    }, {
        id: 83,
        text: getLanguageValue('qiyerenzheng'),
        url: 'src/html/enterprise/enterprise_certification.html',
    }];
    if (language == "en") {//英文版暂时要隐去设备维修模块 2017年9月22日11:21:39 yangyuanzhu 
    jsonObj = enterpriseChildArr;
    enterpriseChildArr = Enumerable.From(jsonObj).Where("x=>x.url!='src/html/enterprise/enterprise_certification.html'").ToArray();//再隐去企业认证
    }
    // 管理员移交菜单
    var turnOver = {
        id: 84,
        text: getLanguageValue('guanliyuanyijiao'),
        url: 'src/html/enterprise/administrator_transfer.html',
    };

    // 企业管理人员菜单
    var enterpriseObj = {
        id: 8,
        text: getLanguageValue('qiyeguanli'),
        icon: 'fa fa-briefcase',
        childs: enterpriseChildArr
    };

    //专家菜单
    var expertMenuArr = [{
            id: 1,
            text: '首页',
            url: 'src/html/expert_index/home.html',
            icon: 'fa fa-home'
        },
        {
            id: 25,
            text: '报告审核',
            url: 'src/html/expert_report_audit/query_report.html',
            icon: 'fa fa-briefcase',

        },
        {
            id: 26,
            text: '查看服务企业',
            url: 'src/html/expert_enterprise/enterprise.html',
            icon: 'fa fa-briefcase',

        }
    ];

    // 运营人员所能看到的企业 只有人员管理
    var platformObj = {
        id: 9,
        text: '企业人员信息',
        icon: 'fa fa-briefcase',
        childs: [{
                id: 91,
                text: '组织人员查看',
                url: 'src/html/enterprise/people_management.html',
            },

        ]
    };

    //英文版暂时要隐去设备维修模块 2017年9月20日14:31:13 yangyuanzhu 
    // console.log(menuArr1);
    if (language == "en") {
        var jsonObj = menuArr1;
        menuArr1 = Enumerable.From(jsonObj).Where("x=>x.url!='src/html/repair/query_repair.html'").ToArray();
      
    }

    // console.log(menuArr1);
    // 是运营人员 加上人员查看
    if (roleNameNum == 4) {
        menuArr1.push(platformObj);
        return menuArr1
    }


    // 判断是否是管理员，是管理员加上企业管理模块
    if (userBo.isSysadmin == 1 && roleNameNum != 4) {
        // 阴保工程师中
        // 如果是系统管理员，则添加系统管理员移交子菜单
        // 如果是非系统管理员，则不添加系统管理员移交子菜单
        enterpriseChildArr.push(turnOver);

        // 现场检测人员中，只要是企业管理员的也有企业管理模块
        menuArr2.push(enterpriseObj);
    };
    // console.log(enterpriseObj);
    // 阴保工程师都有企业管理模块
    menuArr1.push(enterpriseObj);



    // 判断角色加载菜单
    // 只判断现场检查人员与其他人员的区别  专家
    if (roleNameNum == 2) {
        return menuArr2;
    } else if (roleNameNum == 5) { //返回专家
        return expertMenuArr;
    } else {
        return menuArr1;
    }


}


/**
 * @desc 菜单中插入自定义任务的菜单节点
 */
function insertMenuNodes(newNode){
    var method = 10;  // 现在任务到M10  每次清空10以后的，然后重新追加
    if(newNode.length>0){
          var targetParent = $("#side-menu").find(".task-management");  // 任务管理那一栏
          var targetContainer = $(targetParent).find(".nav-second-level"); // 任务管理的子菜单
          var waiteDelete = $(targetContainer).find(".template-node");
          if(waiteDelete.length>0){
               $(waiteDelete).remove();
          }
          for(var i = 0; i < newNode.length; i++){
                method++;
                var newNodeHtml = '<li class="'+ newNode[i].objectId+' template-node"><a class="template-node-event" href="src/html/task/custom_task/query_custom_task.html?method='+ method +'&templateId='+ newNode[i].objectId+'"  title="M'+ method +"-"+ newNode[i].templateName+'" data-id="'+ newNode[i].objectId+'" data-index="'+ method +'">M'+ method +"-"+ newNode[i].templateName +'</a></li>';
                if (roleNameNum == 2) {  // 现场检测人员
                    $(targetContainer).append($(newNodeHtml));
                }else{ // 非现场检测人员
                    $(newNodeHtml).insertBefore($(targetContainer).children().last());
                }
               
                // $(targetContainer).append(newNodeHtml);
          }
          $(targetContainer).on("click",".template-node-event",function(e){
                e.preventDefault();
                menuItem($(this));
                $(".nav").find("a").each(function () {
                    $(this).removeClass("cur")
                });
                $(this).addClass("cur").siblings().removeClass("cur");
          })
    }else{
        var targetParent = $("#side-menu").children("li").eq(3);  // 任务管理那一栏
        var targetContainer = $(targetParent).find(".nav-second-level"); // 任务管理的子菜单
        var waiteDelete = $(targetContainer).find(".template-node");
        if(waiteDelete.length>0){
            $(waiteDelete).remove();
        }
    }
}

/**
 * @desc 加载自定义模板菜单
 */
function  loadSelfDefinedTemplate(){
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/template/query?token=' + lsObj.getLocalStorage('token')+"&hasContent=0&isVisible=1&templateType=1"),
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if(result.success == 1){
                insertMenuNodes(result.list);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

(function () {
    $.fn.renderMenu = function (data, cb) {
        var menuNodes = data,
            callback = cb;
        if (!data || Object.prototype.toString.call(data) !== '[object Array]') {
            menuNodes = [];
        }
        if (!cb || Object.prototype.toString.call(cb) !== '[object Function]') {
            callback = function () {};
        }

        function switchLevel(level) {
            var str = 'nav';
            switch (level) {
                case 1:
                    str += ' nav-second-level';
                    break;
                case 2:
                    str += ' nav-third-level';
                    break;
            }
            return str;
        }

        function addAttrs(el, attrs) {
            $.each(attrs, function (index, item) {
                if (index != 'url' && index != 'text' && index != 'icon' && index != 'childs') {
                    el.attr('data-' + index, item);
                }
            });
        }

        var dataIndex = 0;

        function render(nodes, el, level) {
            if (level === undefined || level < 0) level = 0;
            $.each(nodes, function (index, item) {
                var spanText =  (item.text === undefined ? '' : item.text);
                var $li = $('<li>').appendTo(el);
                var $a = $('<a>').attr({
                    'href': (item.url && item.url != '') ? item.url : '#',
                    'data-index': dataIndex++,
                    "title":spanText
                }).appendTo($li);
                addAttrs($a, item);
                if (level === 0) {
                    $('<i>').addClass(item.icon).appendTo($a);
                    // **
                    // * 对过长的item处理 2017年9月19日17:40:47 yangyuanzhu
                    // *
                    // var text_process = item.text === undefined ? '' : item.text;
                    // if (text_process.length > 10) {
                    //     text_process = text_process.substring(0, 12) + "..";
                    // }
                    // $('<span>').addClass('nav-label').text(text_process).appendTo($a);

                    if(spanText == getLanguageValue('Task-management')){
                        $('<span>').addClass('nav-label').text(spanText).appendTo($a);
                        $a.parent("li").addClass('task-management');
                    }else{
                        $('<span>').addClass('nav-label').text(spanText).appendTo($a);
                    }
                    //  $('<span>').addClass('nav-label').text(spanText).appendTo($a);
                } else if(level === 1){
                     $('<i>').addClass(item.icon).appendTo($a);
                     var Tx = item.text === undefined ? '' : item.text;
                     $('<span>').text(Tx).appendTo($a);
                }else{
                    //处理过长的text，使用省略号代替
                    /**
                     * 对过长的item处理 2017年9月19日17:40:47 yangyuanzhu
                     */
                    // var text_process = item.text === undefined ? '' : item.text;
                    // if (text_process.length > 10) {
                    //     text_process = text_process.substring(0, 14) + "..";
                    // } 
                    //  $a.text(text_process);
                     $a.text(item.text === undefined ? '' : item.text);
                }
                if (item.childs && Object.prototype.toString.call(item.childs) === '[object Array]') {
                    var $ul = $('<ul>').addClass(switchLevel(level + 1)).appendTo($li);
                    render(item.childs, $ul, level + 1);
                    $('<span>').addClass('fa arrow').appendTo($a);
                }
                $a.on('click', function (e) {
                    e.preventDefault();
                    callback(e, $(this), item);

                    /** add by yht 实现菜单选中效果 start*/
                    $(".nav").find("a").each(function () {
                        $(this).removeClass("cur")
                    });
                    $(this).addClass("cur").siblings().removeClass("cur");
                    /** add by yht 实现菜单选中效果 end*/
                });
            });
        }

        // alert($(this));
        // console.log($(this));
        render(menuNodes, $(this), 0);
        // MetsiMenu
        $(this).metisMenu();

    };
})();
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


$(document).ready(function() {


    /**
     * 渲染菜单
     * getMenuNodes为渲染数据，一个数据
     */
    $('#side-menu').renderMenu(getMenuNodes(), function(event, el, data) {
        console.log(data);
        if (data.url && data.url != '' && data.url != '#') {
            menuItem(el);
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
    $('.check-link').click(function() {
        var button = $(this).find('i');
        var label = $(this).next('span');
        button.toggleClass('fa-check-square').toggleClass('fa-square-o');
        label.toggleClass('todo-completed');
        return false;
    });

    //固定菜单栏
    $(function() {
        $('.sidebar-collapse').slimScroll({
            size: '6px',
            height: '100%',
            railOpacity: 0.9,
            alwaysVisible: false
        });
    });


    //菜单切换
    //  $('.navbar-minimalize').click(function() {
    //      $("body").toggleClass("mini-navbar");
    //      SmoothlyMenu();
    //  });

    $('.nav-control').click(function() {
        $("body").toggleClass("mini-navbar");
        // SmoothlyMenu();
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
    $(window).scroll(function() {
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
            function() {
                $('#side-menu').fadeIn(500);
            }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function() {
                $('#side-menu').fadeIn(500);
            }, 300);
    } else {
        $('#side-menu').removeAttr('style');
    }
}

/**
 * 获取菜单节点数据
 * @function
 * @return     {array}
 */
function getMenuNodes() {

    var menuArr = [{
            id: 1,
            text: '首页',
            url: 'src/html/index/home.html',
            icon: 'fa fa-home'
        },
        {
            id: 2,
            text: '企业用户管理',
            url: 'src/html/user_management/enterprise_user_management.html',
            icon: 'fa fa-user',

        },
        {
            id: 3,
            text: '专家管理',
            url: 'src/html/expert_management/expert_management.html',
            icon: 'fa fa-user-secret',

        },
        {
            id: 4,
            text: '报告管理',
            url: 'src/html/report_management/query_application.html',
            icon: 'fa fa-file',

        }
    ];

    return menuArr;
}

(function() {
    $.fn.renderMenu = function(data, cb) {
        var menuNodes = data,
            callback = cb;
        if (!data || Object.prototype.toString.call(data) !== '[object Array]') {
            menuNodes = [];
        }
        if (!cb || Object.prototype.toString.call(cb) !== '[object Function]') {
            callback = function() {};
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
            $.each(attrs, function(index, item) {
                if (index != 'url' && index != 'text' && index != 'icon' && index != 'childs') {
                    el.attr('data-' + index, item);
                }
            });
        }

        var dataIndex = 0;

        function render(nodes, el, level) {
            if (level === undefined || level < 0) level = 0;
            $.each(nodes, function(index, item) {
                var $li = $('<li>').appendTo(el);
                var $a = $('<a>').attr({ 'href': (item.url && item.url != '') ? item.url : '#', 'data-index': dataIndex++ }).appendTo($li);
                addAttrs($a, item);
                if (level === 0) {
                    $('<i>').addClass(item.icon).appendTo($a);
                    $('<span>').addClass('nav-label').text(item.text === undefined ? '' : item.text).appendTo($a);
                } else {
                    $a.text(item.text === undefined ? '' : item.text);
                }
                if (item.childs && Object.prototype.toString.call(item.childs) === '[object Array]') {
                    var $ul = $('<ul>').addClass(switchLevel(level + 1)).appendTo($li);
                    render(item.childs, $ul, level + 1);
                    $('<span>').addClass('fa arrow').appendTo($a);
                }
                $a.on('click', function(e) {
                    e.preventDefault();
                    callback(e, $(this), item);
                    // //诸葛io
                    // try {
                    //     if (zhugeSwitch == 1) {
                    //         zhuge.track('业务模块切换', { "模块": e.target.innerText });
                    //     }
                    // } catch (error) {

                    // }

                    /** add by yht 实现菜单选中效果 start*/
                    $(".nav").find("a").each(function() {
                        $(this).removeClass("cur")
                    });
                    $(this).addClass("cur").siblings().removeClass("cur");
                    /** add by yht 实现菜单选中效果 end*/
                });
            });
        }

        render(menuNodes, $(this), 0);

        // MetsiMenu
        $(this).metisMenu();

    };
})();
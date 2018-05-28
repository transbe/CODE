/**
 * @author: lizhenzhen
 * @date: 2017-03-02
 * @last modified by:lizhenzhen
 * @last modified time: 2017-04-13 
 * @file:皮肤设置
 */
$(function() {

    var skinSelect = 0; // 选择皮肤的标识（下标）
    getBoxH(); // 设置盒子高度

    // 窗口大小发生变化时，重新设置高度
    window.onresize = function() {
        getBoxH(); // 设置盒子高度
    }

    // 鼠标悬停效果
    var dls = $(".setSkin-box dl");
    for (var i = 0; i < dls.length; i++) {
        (
            function(i) {
                $(dls[i]).mouseenter(function() {
                    $(this).addClass("showBorder");
                    $(this).siblings('dl').removeClass("showBorder");
                    // $(this).children('dd').show();
                }).mouseleave(function() {
                    $(this).removeClass("showBorder");
                    // $(this).children('dd').hide();
                });

                $(dls[i]).bind("click", function() {
                    // $(this).addClass("showBorder");
                    // $(this).siblings('dl').removeClass("showBorder");
                    $(this).children('dd').show();
                    $(this).siblings('dl').children('dd').hide();
                    skinSelect = i;
                    console.log(skinSelect);
                })
            }
        )(i)
    }
    $(dls[0]).trigger("click");

});

function bb() {
    return 1;
}

// 设置盒子高度
function getBoxH() {
    var winH = $(window).height();
    var boxPd = parseInt($(".container").css("paddingTop"));
    $(".setSkin-box").css({ height: (winH - boxPd * 2) + "px" });
}
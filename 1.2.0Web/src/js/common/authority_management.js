/**
 * @author: lizhenzhen
 * @date: 2017-04-21
 * @last modified by: lizhenzhen
 * @last modified time: 2017-04-21 
 * @file:阴保工程师与现场检测人员管理权限
 */
$(function() {
    // 通过角色判断显示隐藏某些按钮
    var roleNameNum = parseInt(lsObj.getLocalStorage('params'));
    // console.log(roleNameNum);
    var taskStatus = decodeURI(getParameter('taskStatus')) //任务状态
    // 现场检测人员
    if (roleNameNum == 2) {
        // 任务页面按钮不做处理，全部隐藏
        // console.log("现场检测人员");
        // 查看任务及检测数据页面的显示与隐藏 

        $("#approved").css('display', "none"); // 任务状态 已审核隐藏
        $(".import-operate,.add-operate,.delete-operate").css('display', "none");
        $(".graph-operate,.task-static-operate").css('display', "inline-block");

        //任务进度布局，人员统计布局
        $('#taskProgressStyle').css('display', 'block');
        $('#lineStyle').css('display', 'block');
        $('#peopleStatisticsStyle').css('display', 'block');

        // 记录人显示
        $('#recorderStyle').css('display', "inherit");
        $('#rejected').css('display', 'none');

        // 调整检测数据部分的样式
        var iframWidth = $(window).width();
        setCheckDataStyle();
        $(window).bind("resize", setCheckDataStyle);

    } else if (roleNameNum == 3) {
        // 阴保工程师,现场检测人员 || 现场检测人员,阴保工程师
        // console.log("阴保工程师，现场检测人员");
        // 任务模块按钮的显示与隐藏
        $("#approved").css("display", "inline-block"); //显示已审核
        $("#detectUserStyle").css("display", "inherit"); //显示检测人员下拉框
        $("#yearStyle").css("display", "inherit"); //显示所属年度
        // toobar按钮

        // 查看任务及检测数据页面的显示与隐藏
        //任务进度布局，人员统计布局
        // $('#taskProgressStyle').css('display', 'block');
        // $('#lineStyle').css('display', 'block');
        // $('#peopleStatisticsStyle').css('display', 'block');

        //人员统计
        $('#taskStaticStyle').css('display', 'block');

        //任务驳回按钮
        $('#rejected').css('display', 'inline-block');

        if (taskStatus == '待领取' || taskStatus == '已审核') {
            $('#rejected').css('display', 'none')
        }
        setCheckDataStyle();
        $(window).bind("resize", setCheckDataStyle);
    } else {
        // console.log("管理员或者阴保工程师");
        // 任务模块按钮的显示与隐藏
        $("#approved").css("display", "inline-block"); //显示已审核
        $("#detectUserStyle").css("display", "inherit"); //显示检测人员下拉框
        $("#yearStyle").css("display", "inherit"); //显示所属年度
        // toobar按钮

        // 查看任务及检测数据页面的显示与隐藏
        //人员统计
        $('#taskStaticStyle').css('display', 'block');
        //任务驳回按钮
        if(!judgePrivilege()){
            $('#rejected').css('display', 'inline-block');
        }
        if (taskStatus == '待领取' || taskStatus == '已审核') {
            $('#rejected').css('display', 'none')
        }
         setCheckDataStyle();
        $(window).bind("resize", setCheckDataStyle);
    }

});

function setCheckDataStyle() {
    iframWidth = $(window).width();
    // console.log(iframWidth);
    if (iframWidth <= 1000) {
        //测试数据部分样式的设置
        $("#analysisResultM1,#analysisResultM3,#analysisResultM6,#analysisResultM7").css({
            flexBasis: "20.2%",
            // marginLeft: "33px"
            // border: "1px solid red"
        });
        $("#recorderStyle").css({
            // marginLeft: "12px",
            // border: "1px solid red"
        });
        $("#analysisResultM2,#analysisResultM4,#analysisResultM5,#analysisResultM8,#analysisResultM9,#analysisResultM10").css({
            flexBasis: "34.4%",
            // marginLeft: "33px"
        });
    } else if (iframWidth < 1366) {
        //测试数据部分样式的设置
        $("#analysisResultM1,#analysisResultM3,#analysisResultM6,#analysisResultM7").css({
            flexBasis: "20.8%",
            // marginLeft: "33px"
        });
        $("#recorderStyle").css({
            // marginLeft: "12px"
        });
        $("#analysisResultM2,#analysisResultM4,#analysisResultM5,#analysisResultM8,#analysisResultM9,#analysisResultM10").css({
            flexBasis: "32.8%",
            // marginLeft: "33px"
        });
    }
}
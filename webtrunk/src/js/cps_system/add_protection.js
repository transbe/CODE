/**
 * @file
 * @author  lizz
 * @desc 新增恒电位仪操作逻辑
 * @date  2017-11-28 
 * @last modified by 
 * @last modified time  2017-11-28 
 */


$(function () {
    changePageStyle("../../..");
    // firstLogin(); // 判断是否是第一次登陆，第一次展示向导

    //时间插件
    $("#productionDate").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month"
    })
    $("#installationDate").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month"
    })
})
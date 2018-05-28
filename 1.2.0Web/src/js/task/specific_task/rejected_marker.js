/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:驳回检测数据
 */
var markerNumber = decodeURI(getParameter("markerNumber")); //获取测试桩编号
var pipelineName = decodeURI(getParameter("pipelineName")); //获取管线名称
var objectID = getParameter("objectID");    //获取数据id
var taskID = getParameter("taskID");    //获取任务ID
var markerID = getParameter("markerID");    //获取测试桩ID
var detectMethod = getParameter("detectMethod");    //获取检测方法
var token = getParameter("token");  //获取token
$(function () {
    showData(); //显示table数据
})

/**
 * @desc 显示table数据
 * @method showData
 */
function showData() {
    markerNumber = markerNumber.split(",")
    pipelineName = pipelineName.split(",")

    var str = "";
    for (var i = 0; i < markerNumber.length; i++) {
        str += "<tr><td>" + (i + 1) + "</td><td>" + markerNumber[i] + "</td><td>" + pipelineName[i] + "</td><td style = 'width:300px;word-wrap:break-word;word-break:break-all;'contentEditable='true'></td></tr>"
    }
    $('#rejected').append(str);
}

/**
 * @desc 确认提交
 * @method submitData
 */
function submitData() {
    var data = "[";
    objectID = objectID.split(",")
    taskID = taskID.split(",")
    markerID = markerID.split(",")
    for (var i = 0; i < markerNumber.length; i++) {
        if (i != objectID.length - 1) {
            data += '{"objectId":"' + objectID[i] + '", "taskId": "' + taskID[i] + '", "markerId":"' + markerID[i] + '","remark":"' + $("#rejected tr").eq(i + 1).find("td").eq(3).text() + '"},';
        } else {
            data += '{"objectId":"' + objectID[i] + '", "taskId": "' + taskID[i] + '", "markerId":"' + markerID[i] + '","remark":"' + $("#rejected tr").eq(i + 1).find("td").eq(3).text() + '"}';
        }
    }
    data += "]";
    var flag = false;
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/rejectDetectionData?token=" + token,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: "post",
        data: data,
        async: false,
        success: function (result) {
            if (result.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('驳回检测数据', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                parent.layer.msg("驳回成功！", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-success"
                });
                flag = true;
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('驳回检测数据', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (error) {

                }
                parent.layer.confirm('驳回出错！', {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
                flag = false;
            }
        }

    })
    return flag;
}
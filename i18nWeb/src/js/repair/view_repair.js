/**
 * @file
 * @author: lixiaolong
 * @desc:测试桩查看
 * @date: 2017-07-26
 */

var objectId = getParameter("objectId") //获取测试桩ID
var token = lsObj.getLocalStorage('token'); //获取token
$(document).ready(function () {
    changePageStyle("../..");
    viewData();
});

/**
 * @desc 回填表单信息
 */
function viewData() {
    var url = handleURL('/cloudlink-corrosionengineer/equipment/query?token=' + token);
    $.ajax({
        // url: '/cloudlink-corrosionengineer/equipment/query?token=' + token,
        url: url,
        dataType: "json",
        method:"get",
        cache: false,
        data: {
            'objectId': objectId
        },
        success: function (result) {
            if (result.success == 1) {
                var data=result.rows[0];
                // $("#objectId").html(data.objectId);
                $("#orderNum").html(data.orderNum);
				$("#repairTheme").html(data.repairTheme);
                $("#pipelineName").html(data.pipelineName);
				$("#markerZone").html(data.markerZone);
				$("#equipmentType").html(data.equipmentType);
				$("#riskType").html(data.riskType);
                $("#repairType").html(data.repairType);
                $("#emergencyLevel").html(data.emergencyLevel);
				$("#repairUser").html(data.repairUser);
				$("#repairUserContact").html(data.repairUserContact);
				$("#createUserName").html(data.createUserName);
				$("#createTime").html(data.createTime);
				$('#repairStatus').html(data.repairStatus);
                $('#positionDescription').html(data.positionDescription);
                if(data.repairStatus == "维修完成"){
                    $("#repairInfo").show();
                    $("#modifyUserName").html(data.modifyUserName);
                    $("#modifyTime").html(data.modifyTime);
                    $("#colseUserName").html(data.modifyUserName);
                    $("#closeTime").html(data.modifyTime);
                    $('#repairDescription').html(data.repairDescription);
                }
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('维修管理', {
                            '操作': '查看维修记录详情'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            } else {
                layer.msg(result.msg, {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}
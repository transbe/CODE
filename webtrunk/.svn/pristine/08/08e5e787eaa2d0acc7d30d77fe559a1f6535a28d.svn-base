/**
 * @file
 * @author: gaohui
 * @desc:测试桩排序
 * @date: 2017-03-02
 * @last modified by: lujingrui
 * @last modified time: 2017-06-12 10:29:22
 */

var pipelineId; //管线ID
var token; //token

var id = ""; //定义一个全局id变量
var len = ""; //定义一个全局len变量
var arr = []; //定义一个空的全局数组

/**
 * @desc 初始化方法
 */
$(document).ready(function () {
    changePageStyle("../..");
    pipelineId = getParameter("pipelineId");
    token = lsObj.getLocalStorage("token");
    sortMarker();
});

/**
 * @desc 测试桩排序
 */
function sortMarker() {
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/marker/selectMarkerForOrder?pipelineId=' + pipelineId + '&token=' + token),
        method: 'get',
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.markerList;
                var num = data.length
                var sortTable = document.getElementById("sortTable")
                var t = "";
                if (num == 0) {
                    t += "<tr><td colspan = '2'>暂无数据</td></tr>"
                    sortTable.innerHTML += t
                    // $(".sortable").removeClass("sortable");
                    return;
                };
                for (var i = 0; i < num; i++) {
                    t += "<tr ><td id='" + data[i].objectId + "'>" + (i + 1) + "</td><td>" + data[i].markerNumber + "</td></tr>";
                }
                sortTable.innerHTML += t
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    })
}

/**
 * @desc 测试桩排序
 */
$(".sortable").sortable({
    cursor: "move",
    items: "tr", //只是tr可以拖动
    opacity: 0.6, //拖动时，透明度为0.6
    revert: true, //释放时，增加动画
    scroll: true,
    axis: 'y',
    scrollSpeed: 20,
    update: function (event, ui) { //更新排序之后
        var categoryids = $(this).sortable("toArray");
        var $this = $(this);
        len = $("#sortTable tr").size(); //获取tr标签的个数
        for (var i = 0; i < len; i++) {
            $("#sortTable tr:eq(" + i + ") td:eq(0)").text(i + 1);
        }
    }
});
$(".sortable").disableSelection();

/**
 * @desc 保存调整顺序数据
 */
function saveSortMarker() {
    var result = false;
    var sortNumber = "";
    for (var index = 0; index < len; index++) { //创建一个数字数组
        arr[index] = index;
    }
    for (var i = 1; i < len + 1; i++) {
        var idValue = $("#sortTable tr:eq(" + (i - 1) + ") td:eq(0)").attr("id");
        id += idValue + ","
        sortNumber += i + ",";
    }
    $.ajax({
        url: '/cloudlink-corrosionengineer/marker/updateOrderAll?token=' + token,
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            'objectIds': id,
            'orderNumber': sortNumber
        }),
        success: function (res) {
            if (res.success == 1) {
                result = true;
                layer.msg(getLanguageValue("success"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('顺序调整测试桩', {
                            '结果': '成功'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('顺序调整测试桩', {
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
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    })
    return result;
}
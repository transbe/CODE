/**
 * @file
 * @author: gaohui
 * @desc:测试桩查看
 * @date: 2017-03-02
 * @last modified by: lujingrui
 * @last modified time: 2017-06-12 09:25:00
 */

var objectId = getParameter("objectId") //获取测试桩ID
var token = lsObj.getLocalStorage('token'); //获取token
$(document).ready(function () {
    changePageStyle("../..");
    $(".suspension").css("top",$(window).height()/3);
    var objectIds = lsObj.getLocalStorage("markerObjectIds");
    var objectArr = objectIds.split(",");
    var objectInodes = createNodes(objectArr);
    var currentNode = objectInodes[objectId];
    $(".suspension").click(function () {
        if(this.outerText == getLanguageValue("pre")){
            if(currentNode.preNode!=null&&currentNode.preNode!=""){
                objectId = currentNode.preNode;
                currentNode = objectInodes[currentNode.preNode];
                viewData();
            }
        }else{
            if(currentNode.nextNode!=null&&currentNode.nextNode!=""){
                objectId = currentNode.nextNode;
                currentNode = objectInodes[currentNode.nextNode];
                viewData();
            }
        }
    });

    viewData();
});

/**
 * @desc 回填表单信息
 */
function viewData() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/marker/queryMarkerById?token=' + token,
        dataType: "json",
        cache: false,
        data: {
            'objectId': objectId
        },
        success: function (result) {
            if (result.success == 1) {
                var data = result.markerInfo[0];
                $("#markerNumber").html(data.markerNumber);
                $("#pipelineName").html(data.pipelineName);
                $("#orderNumber").html(data.orderNumber);
                //判断该值是否为1，如果为1，则使复选框为选中的状态 
                var ss = "";
                if (data.isDrivepipe == 1) {
                    ss += ','+getLanguageValue("Casing");
                }
                if (data.isCrossParallelArea == 1) {
                    ss += ','+getLanguageValue("Parallel");
                }
                if (data.isInsulatedJoint == 1) {
                    ss += ','+getLanguageValue("Insulating");
                }
                if (data.isDirectionalDrilling == 1) {
                    ss += ','+getLanguageValue("Drainage");
                }
                if (data.isRecitifierNearest == 1) {
                    ss += ','+getLanguageValue("HDD");
                }
                if (data.isDrainageAnode == 1) {
                    ss += ','+getLanguageValue("Drain");
                }
                $('#createUser').html(data.createUserName)
                $('#createTime').html(data.createTime)
                $('#type').html(ss.slice(1))
                $("#mileage").html(data.mileage);
                $("#coordinateSystem").html(data.coordinateSystem);
                $("#x").html(data.x);
                $("#y").html(data.y);
                $("#position").html(data.position);
                $("#remark").html(data.remark);

                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('测试桩管理', {
                            '操作': '查看测试桩'
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
                title:getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}


//创建节点对象（上一个 下一个）
function createNodes(dataSource){
    var nodes = {}; 
    var len = dataSource.length;
    if(len>0){
        if(len>1){
            for(var i = 0;i < len;i++){
                nodes[dataSource[i]] = {};
                if(i==0){
                    nodes[dataSource[i]].preNode = null;
                    nodes[dataSource[i]].nextNode= dataSource[i+1];
                }else if(i==len-1){
                    nodes[dataSource[i]].preNode= dataSource[i-1];
                    nodes[dataSource[i]].nextNode = null;
                }else{
                    nodes[dataSource[i]].preNode= dataSource[i-1];
                    nodes[dataSource[i]].nextNode= dataSource[i+1];
                }
            }
        }else{
            nodes[dataSource[0]] = {};
            nodes[dataSource[0]].preNode = null;
            nodes[dataSource[0]].nextNode = null;
        }
    }
    return nodes;
}
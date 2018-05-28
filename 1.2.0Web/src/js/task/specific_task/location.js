/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:检测数据 数据定位
 */
function initMap() {
    // 比例尺控件 左下角
    var bottom_left_ScaleControl = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT
    });
    // 导航控件 右上角
    var bottom_right_navigation = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        offset: new BMap.Size(20, 40),
        type: BMAP_NAVIGATION_CONTROL_SMALL
    });
    //地图加载控件
    map.addControl(bottom_left_ScaleControl);
    map.addControl(bottom_right_navigation);
    map.addControl(new BMap.MapTypeControl());
    map.enableScrollWheelZoom(true);
    map.centerAndZoom(new BMap.Point(108.404, 32.915), 8);
}

/**
 * @desc 获取数据
 * @method dataLocation
 */
function dataLocation() {
    if ($mapO.is(":hidden")) {
        $mapO.slideDown();
        $mapBtn.attr("class", "map_up");
    }
    var data = $('#tb-all-task').bootstrapTable('getAllSelections');    //获取检测数据列表中选中的数据
    if (data.length > 0) {
        locationBmap(data); //地图定位
    } else if (data.length == 0) { //没有选中数据
        var url = "/cloudlink-corrosionengineer/task/getDetectionDataByTaskID?taskObjectID=" + objectId + "&token=" + token;
        $.ajax({
            url: url,
            type: "get",
            success: function (res) {
                if (res.success == 1) {
                    locationBmap(res.detectionDataBoList); //地图定位
                } else {
                    parent.layer.confirm("定位出错", {
                        title: "提示",
                        btn: ['确定'], //按钮
                        skin: 'self'
                    });
                }
            },
            error: function () {
                parent.layer.confirm("定位出错", {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
            }
        })

    }
    uncheck("dataLocation");    //取消选中状态
}

/**
 * @desc 地图定位
 * @method locationBmap
 * @param {*String} data
 */
function locationBmap(data) {
    //清除之前的maker
    var maxi = 0;
    map.clearOverlays();
    var string;
    // 添加地图图标 
    var myIcon = new BMap.Icon("/src/images/task/marker.png", new BMap.Size(32, 32));
    var maxx = parseFloat(data[0].x);
    var minx = parseFloat(data[0].x);
    var maxy = parseFloat(data[0].y);
    var miny = parseFloat(data[0].y);
    for (var i = 0; i < data.length; i++) {
        if(data[i].objectId== null || data[i].objectId==""){    //数据未检测
            continue;
        }
        if (maxx < parseFloat(data[i].x)) {
            maxx = parseFloat(data[i].x)
        }
        if (minx > parseFloat(data[i].x)) {
            minx = parseFloat(data[i].x)
        }
        if (maxy < parseFloat(data[i].y)) {
            maxy = parseFloat(data[i].y)
        }
        if (miny > parseFloat(data[i].y)) {
            miny = parseFloat(data[i].y)
        }
        var marker = new BMap.Marker(new BMap.Point(data[i].x, data[i].y), {
            icon: myIcon
        });
        if (data[i].markerNumber !== null) {
            (function (arg) {
                marker.addEventListener('mousedown', function () {
                    this.openInfoWindow(new BMap.InfoWindow(data[arg].markerNumber.toString()));
                })
            } (i))
        }
        map.addOverlay(marker);
    }
    if(isNaN((maxx + minx) / 2 )){  //是否是数值型
        return;
    }
    map.centerAndZoom(new BMap.Point((maxx + minx) / 2 + "", (maxy + miny) / 2 + ""), 10);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('数据定位', { '任务种类': 'M' + detectMethod });
        }
    } catch (error) {

    }

}
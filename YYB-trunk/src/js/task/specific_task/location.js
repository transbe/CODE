/**
 * @file
 * @author  gaohui
 * @desc 检测数据 数据定位
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:24:06
 */
function initMap() {
    // 比例尺控件 左下角
    var bottomLeftScaleControl = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT
    });
    // 导航控件 右上角
    var bottomRightNavigation = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        offset: new BMap.Size(20, 40),
        type: BMAP_NAVIGATION_CONTROL_SMALL
    });
    //地图加载控件
    map.addControl(bottomLeftScaleControl);
    map.addControl(bottomRightNavigation);
    map.addControl(new BMap.MapTypeControl());
    map.enableScrollWheelZoom(true);
    map.centerAndZoom(new BMap.Point(108.404, 32.915), 8);
}

/**
 * @desc 获取数据
 */
function dataLocation() {
    uncheck("dataLocation")
    if (mapContainer.is(":hidden")) {
        mapBtn.attr("class", "map-up");
        mapContainer.slideDown(300, function () {
            getDataAndLocation();
        });

    } else {
        getDataAndLocation();
    }
}
/**
 * @desc  获得数据并且定位到地图
 * 
 */
function getDataAndLocation() {
    var data = $('#tb-all-task').bootstrapTable('getAllSelections'); //获取检测数据列表中选中的数据
    if (data.length > 0) {
        locationBmap(data); //地图定位
    } else if (data.length == 0) { //没有选中数据
        var startMarkNum = $("#pipestartNumberName1").val() == null?'':$("#pipestartNumberName1").val();
        var endMarkNum = $("#pipeendNumberName1").val() == null?'':$("#pipeendNumberName1").val();
        var url = "/cloudlink-corrosionengineer/task/getDetectionDataByTaskID?taskId=" + objectId + "&token=" + token+'&pipelineId='+$("#pipeName1").val()+'&startMarkNum='+startMarkNum+'&endMarkNum='+endMarkNum+'&detectMethod='+detectMethod+'&detectStatus='
        +$("#detectStatus").val()+'&recorder='+$('#recorder').val()+'&detectResult='+items.detectResult+'&markNum='+$("#markerNumber").val()+'&markerStatus='+items.markerStatus+'&minDetectTime='+$("#minDetectTime").val()+'&maxDetectTime='+$("#markerNumber").val();
        $.ajax({
            url: url,
            type: "get",
            success: function (res) {
                if (res.success == 1) {
                    locationBmap(res.detectionDataBoList); //地图定位
                } else {
                    parent.layer.alert(getLanguageValue("location_error"), {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                parent.layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        })

    }
    uncheck("dataLocation"); //取消选中状态
}
/**
 * @desc 地图定位
 * @param {*String} data
 */
function locationBmap(data) {
    //清除之前的maker
    var maxi = 0;
    map.clearOverlays();
    var string;
    // 添加地图图标 
    var myIcon;
    var points = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].objectId == null || data[i].objectId == "") { //数据未检测
            continue;
        }
        if (detectMethod == 1) {
            if (data[i].analysisResult == 1) {
                myIcon = new BMap.Icon("/src/images/task/map_normal.png", new BMap.Size(32, 32));
            } else if (data[i].analysisResult == 2) {
                myIcon = new BMap.Icon("/src/images/task/map_dc.png", new BMap.Size(32, 32));
            } else if (data[i].analysisResult == 3) {
                myIcon = new BMap.Icon("/src/images/task/map_ac.png", new BMap.Size(32, 32));
            } else {
                myIcon = new BMap.Icon("/src/images/task/map_ac_dc.png", new BMap.Size(32, 32));
            }
        } else if (detectMethod == 2 || detectMethod == 3 || detectMethod == 6 || detectMethod >= 11) {
            console.log(detectMethod);
            if (data[i].analysisResult == 2) {
                myIcon = new BMap.Icon("/src/images/task/map_hc.png", new BMap.Size(32, 32));
            } else if (data[i].analysisResult == 3) {
                myIcon = new BMap.Icon("/src/images/task/map_lc.png", new BMap.Size(32, 32));
            } else {
                myIcon = new BMap.Icon("/src/images/task/map_normal.png", new BMap.Size(32, 32));
            }
        } else {
            myIcon = new BMap.Icon("/src/images/task/map_normal.png", new BMap.Size(32, 32));
        }
        var Point = new BMap.Point(data[i].x, data[i].y);
        points.push(Point);
        var marker = new BMap.Marker(Point, {
            icon: myIcon
        });
        if (!isNull(data[i].markerNumber)) {
            (function (arg) {
                marker.addEventListener('mousedown', function () {
                   
                    var analysisResult = data[arg].analysisResultVal;
                    if(detectMethod >= 11){
                        var result = data[arg].analysisResult;
                        switch(result){
                            case "1":
                                analysisResult = getLanguageValue("normal");
                                break;
                             case "2":
                                analysisResult = getLanguageValue("high");
                                break;
                                case "3":
                                analysisResult = getLanguageValue("low");
                                break;
                            default:
                                analysisResult = getLanguageValue("normal");
                                break;
                        }
                    }
                    this.openInfoWindow(new BMap.InfoWindow(getLanguageValue("markerNumber")+"：" + data[arg].markerNumber + "<br/>" + getLanguageValue("pipeline")+"：" + data[arg].pipelineName + "<br/>" + getLanguageValue("analysisResult")+"：" + analysisResult + "<br/>" + getLanguageValue("createUser")+"：" + data[arg].createUserName + "<br/>" + getLanguageValue("createTime")+"：" + data[arg].detectTime));
                    // this.openInfoWindow(new BMap.InfoWindow(getLanguageValue("TPnumber")+"：" + data[arg].markerNumber.toString() + "<br/>" + getLanguageValue("pipeline")+"：" + data[arg].pipelineName.toString() + "<br/>" + getLanguageValue("analysisResult")+"：" + data[arg].analysisResultVal.toString() + "<br/>" + getLanguageValue("createUser")+"：" + data[arg].createUserName.toString() + "<br/>" + getLanguageValue("createTime")+"：" + data[arg].detectTime.toString()));
                })
            }(i))
        }
        map.addOverlay(marker);
    }

    var view = map.getViewport(eval(points));
    var mapZoom = view.zoom;
    var centerPoint = view.center;
    map.centerAndZoom(centerPoint, mapZoom);
    try {
        if (zhugeSwitch == 1) {
            zhuge.track('数据定位', {
                '任务种类': 'M' + detectMethod
            });
        }
    } catch (error) {

    }

}
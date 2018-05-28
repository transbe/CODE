/**  
 * @author: lujingrui
 * @date: 2017 - 3 - 3 
 * @last modified by: lujingrui 
 * @last modified time: 2017 - 4 - 13
 * @file: 右侧逻辑图具体逻辑处理
*/
//逻辑图类型 (目录/逻辑图/已发布逻辑图/阴保管段)
var type = "";

/**
 * @desc 初始化方法
 * @method initChart
 */
function initChart() {
    type = getParameter("type");
    if (type == "chart") {//逻辑图
        if (judgePrivilege()) {//权限控制
            pageMeta.editable = false;
            $(".for-operation").hide();
             //隐藏左边工具栏
            visitPanel();
        }else{
            $("#save").show();
            $("#publish").show();
            $("#equipmentlist").hide();
            var timer = setInterval(save, 60 * 1000);
        }
    } else if (type == "publish") {//已发布逻辑图
        if (judgePrivilege()) {//权限控制
            $(".for-operation").hide();
        }else{
            if (parent.isNotExtract) {
                $("#extract").show();
            }
            $("#edit").show();
            $("#equipmentlist").hide();
        }
        //隐藏左边工具栏
        visitPanel();
        $("#shapepanel").hide();
        //设置画布不可编辑
        pageMeta.editable = false;
    } else if (type == "file") {//管段
        if (judgePrivilege()) {
            $(".for-operation").hide();
        }
        isGetetHighlight();
        //隐藏左边工具栏
        visitPanel();
        $("#shapepanel").hide();

        //设置画布不可编辑
        pageMeta.editable = false;
    }
    $("#equipmentlist").css("left", 35).css("top", 70);
}

/**
 * @desc 是否刷新页面(判断点击管段时是否刷新页面)
 * @method isGetetHighlight
 * @param {string} fileId 管段id
 */
function isGetetHighlight(fileId) {
    if (fileId != null && fileId != "" && fileId != undefined) {
        getHighlight(fileId);
    } else {
        var objectId = getParameter("fileId");
        getHighlight(objectId);
    }
}

/**
 * @desc 清空高亮
 * @method clearHighlight
 * @param {string} hightLightList 上一次高亮的元件
 */
var hightLightList = [];//存放上一次高亮的元件
function clearHighlight(hightLightList) {
    if (hightLightList.length > 0) {
        for (var i = 0; i < hightLightList.length; i++) {
            var id = hightLightList[i];
            // pageMeta.collection.getGeometryById(id).unSelect();
            pageMeta.collection.setWarning(id, false);
        }
    }
}

/**
 * @desc 高亮管段
 * @method getHighlight
 * @param {string} objectId 元件id
 */
function getHighlight(objectId) {
    $("#equipmentlist").show();
    $("#edit").hide();
    var token = lsObj.getLocalStorage("token");
    var chartName = decodeURI(getParameter("chartName"));
    $.ajax({
        url: '/cloudlink-corrosionengineer/cpsegment/getDeviceListBySegmentId?token=' + token + "&segmentId=" + objectId,
        // url: '/cloudlink-corrosionengineer/cpsegment/getDeviceCountBySegmentId?token='+token+"&segmentId="+objectId,
        method: 'get',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON'
    })
    .done(function(res) {
        // console.log(JSON.stringify(res));
        //name typeName remark
        if (res.success == 1) {
            //清除高亮
            clearHighlight(hightLightList);
            hightLightList.length = 0;
            var data = res.result;
            var str = "";
            for (var i = 0; i < data.length; i++) {
                var id = data[i].originId;
                pageMeta.collection.setWarning(id, true);
                hightLightList.push(id);
            }
        } else {
            parent.layer.confirm(res.msg, {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
        }
    })
    //设备列表
    $.ajax({
        url: '/cloudlink-corrosionengineer/cpsegment/getDeviceCountBySegmentId?token=' + token + "&segmentId=" + objectId,
        method: 'get',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON'
    })
    .done(function(res) {
        //name typeName remark
        if (res.success == 1) {
            $("#equipmentheader").html(chartName + " 设备列表");
            var data = res.result;
            // console.log(JSON.stringify(data));
            var str = '';
            //恒电位仪 Potentiostat
            if (data.Potentiostat != null && data.Potentiostat != undefined && data.Potentiostat != "" && data.Potentiostat.list.length > 0) {
                var rowspan = data.Potentiostat.list.length + 1;
                str += '<tr class="head-bg head-center" ><td colspan="5">恒电位仪</td> </tr><tr class="head-bg"><td>名称</td><td>规格型号</td> <td>输出电压</td> <td>输出电流</td> <td>所属</td></tr>';
                var list = data.Potentiostat.list;
                for (var i = 0; i < list.length; i++) {
                    str += '<tr><td>' + getStr(list[i].name) + '</td><td>' + getStr(list[i].specifications) + '</td> <td>' + getStr(list[i].outV) + '</td> <td>' + getStr(list[i].OutA) + '</td> <td>' + getStr(list[i].belongTo) + '</td></tr>'
                }
            }
            //绝缘装置 InsulatedJoint
            if (data.InsulatedJoint != null && data.InsulatedJoint != undefined && data.InsulatedJoint != "" && data.InsulatedJoint.list.length > 0) {
                var rowspan = data.InsulatedJoint.list.length + 1;
                str += '<tr class="head-bg head-center"><td colspan="5">绝缘装置</td></tr><tr class="head-bg"><td>名称</td><td >类型</td> <td colspan="3">安装形式</td></tr>';
                var list = data.InsulatedJoint.list;
                for (var i = 0; i < list.length; i++) {
                    str += '<tr><td>' + getStr(list[i].name) + '</td><td colspan="1">' + getStr(list[i].type) + '</td> <td colspan="3">' + getStr(list[i].installType) + '</td></tr>'
                }
            }
            //3PE管 3PE
            if (data['3PE'] != null && data['3PE'] != undefined && data['3PE'] != "" && data['3PE'].list.length > 0) {
                var rowspan = data['3PE'].list.length + 1;
                str += '<tr class="head-bg head-center"><td colspan="5">3PE管段</td></tr><tr class="head-bg"><td>名称</td><td>规格</td> <td>表面积</td> <td>套管桩(个)</td> <td>排流桩(个)</td></tr>';
                var list = data['3PE'].list;
                for (var i = 0; i < list.length; i++) {
                    str += '<tr><td>' + getStr(list[i].name) + '</td><td>' + getStr(list[i].specifications) + '</td> <td>' + getStr(list[i].area) + '</td> <td>' + getStr(list[i].markerTG) + '</td> <td>' + getStr(list[i].markerPL) + '</td></tr>';
                }
            }
            //非3PE管 N3PE
            if (data['N3PE'] != null && data['N3PE'] != undefined && data['N3PE'] != "" && data['N3PE'].list.length > 0) {
                var rowspan = data['N3PE'].list.length + 1;
                str += '<tr class="head-bg head-center"><td colspan="5">非3PE管段</td></tr><tr class="head-bg"><td>名称</td><td>规格</td> <td>表面积</td> <td>套管桩(个)</td> <td>排流桩(个)</td></tr>';
                var list = data['N3PE'].list;
                for (var i = 0; i < list.length; i++) {
                    str += '<tr><td>' + getStr(list[i].name) + '</td><td>' + getStr(list[i].specifications) + '</td> <td>' + getStr(list[i].area) + '</td> <td>' + getStr(list[i].markerTG) + '</td> <td>' + getStr(list[i].markerPL) + '</td></tr>';
                }
            }
            //站场,阀室 StationValve
            if (data.StationValve != null && data.StationValve != undefined && data.StationValve != "" && data.StationValve.list.length > 0) {
                var rowspan = data.StationValve.list.length + 1;
                str += '<tr class="head-bg head-center"><td colspan="5">站场,阀室</td></tr><tr class="head-bg"><td >名称</td><td colspan="4">类型</td></tr>';
                var list = data.StationValve.list;
                for (var i = 0; i < list.length; i++) {
                    str += '<tr><td colspan="1">' + getStr(list[i].name) + '</td><td colspan="4">' + getStr(list[i].type) + '</td></tr>';
                }
            }
            //其他 OtherDevice
            if (data.OtherDevice != null && data.OtherDevice != undefined && data.OtherDevice != "" && data.OtherDevice.list.length > 0) {
                var rowspan = data.OtherDevice.list.length + 1;
                str += '<tr class="head-bg head-center"><td colspan="5">其他</td></tr><tr class="head-bg"><td >名称</td><td colspan="4">类型</td></tr>';
                var list = data.OtherDevice.list;
                for (var i = 0; i < list.length; i++) {
                    if (getStr(list[i].type) == '三通' || getStr(list[i].type) == '大小头' || getStr(list[i].type) == '架空线') {
                        str += '<tr><td colspan="1">' + getStr(list[i].name) + '</td><td colspan="4">' + getStr(list[i].type) + '</td></tr>';
                    }
                }
            }

            $("#realEquipmentTable tbody").empty();
            $("#realEquipmentTable tbody").append(str);
        } else {
            parent.layer.confirm(res.msg, {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
        }
    })
}

/**
 * @desc 判断某个字段是否为空
 * @method getStr
 * @param {string} str 字符串非空验证
 * @return {string} 非空返回本身，为空返回空字符串
 */
function getStr(str) {
    if (str != null && str != undefined && str != "") {
        return str;
    } else {
        return '';
    }
}

/**
 * @desc 保存草稿(埋点，点击按钮保存)
 * @method saveChartForLog
 * @param {json} defination 逻辑图信息
 */
function saveChartForLog(defination) {
    var token = lsObj.getLocalStorage("token");
    var objectId = getParameter("objectId");
    var chartName = decodeURI(getParameter("chartName"));
    var folderId = getParameter("folderId");
    $.ajax({
        url: '/cloudlink-corrosionengineer/cpsegment/updateChart?token=' + token,
        method: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify({
            objectId: objectId,
            chartName: chartName,
            folderId: folderId,
            defination: defination,
            canvasWidth: parseInt($('#canvasWidth').val()),
            canvasLength: parseInt($('#canvasHeight').val())
        })
    })
    .done(function(res) {
        if (res.success == 1) {
            parent.layer.msg("保存成功！", { time: MSG_DISPLAY_TIME,skin: "self-success" });

            try {
                if (zhugeSwitch == 1) {
                    zhuge.track('保存逻辑图', { '结果': '成功' });
                }
            } catch (err) {
                //在此处理错误
            }
        } else {
            parent.layer.confirm(res.msg, {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track('保存逻辑图', { '结果': '失败' });
                }
            } catch (err) {
                //在此处理错误
            }
        }

    })
}

/**
 * @desc 保存草稿(不提示，自动保存)
 * @method saveChart
 * @param {json} defination 逻辑图信息
 */
function saveChart(defination) {
    var token = lsObj.getLocalStorage("token");
    var objectId = getParameter("objectId");
    var chartName = decodeURI(getParameter("chartName"));
    var folderId = getParameter("folderId");
    $.ajax({
        url: '/cloudlink-corrosionengineer/cpsegment/updateChart?token=' + token,
        method: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify({
            objectId: objectId,
            chartName: chartName,
            folderId: folderId,
            defination: defination,
            canvasWidth: parseInt($('#canvasWidth').val()),
            canvasLength: parseInt($('#canvasHeight').val())
        })
    })
    .done(function(res) {
        if (res.success == 1) {
            console.log('保存成功！');
        } 
    })
}

/**
 * @desc 根据设备类型获取中文名称
 * @method getTipStr
 * @param {array} 设备列表
 */
function getTipStr(list) {
    var name = "";
    for (var i = 0; i < list.length; i++) {
        name += attrHeaderName(list[i]) + ",";
    }
    name = name.substring(0, name.lastIndexOf(","));
    return name;
}

/**
 * @desc 发布逻辑图前判断
 * @method publishChart
 */
var noTextList=[];//未填写必填项的元件
function publishChart() {
    clearHighlight(noTextList);
    noTextList.length = 0;
    var metaList = pageMeta.collection.getGeometryAttribute();
    var isHaveStr = "";
    if (metaList != null && metaList.length > 0) {
        var nameList = [];
        var lengthList = [];
        var diameterLength = [];

        for (var i = 0; i < metaList.length; i++) {
            var ft = metaList[i].facilityType;
            //以下为必填 名称 其中 3PE管道 非3PE管道 架空线必须填长度和管径
            // 站场	FACILITY_STATION 
            // 阀室	FACILITY_VALVE
            // 3PE管道	LINE_3PE
            // 非3PE管道	LINE_N3PE
            // 架空线	FACILITY_ABOVEGROUNDPL
            // 三通	FACILITY_TEE
            // 大小头	FACILITY_REDUCER
            // 恒电位仪	FACILITY_RECTIFIER
            // 无保护装置绝缘接头	FACILITY_SPD
            // 有保护装置绝缘接头	FACILITY_PROTECTION
            var f_id=metaList[i].id;
            if ((ft == "FACILITY_STATION" || ft == "FACILITY_VALVE" || ft == "LINE_3PE" || ft == "LINE_N3PE" || ft == "FACILITY_ABOVEGROUNDPL" || ft == "FACILITY_TEE" || ft == "FACILITY_REDUCER" || ft == "FACILITY_RECTIFIER" || ft == "FACILITY_SPD" || ft == "FACILITY_PROTECTION") && metaList[i].text == "" && metaList[i].innerStation != 1) {
                if($.inArray(f_id, noTextList) == -1){
                    pageMeta.collection.setWarning(f_id, true);
                    noTextList.push(f_id);
                }
                if ($.inArray(ft, nameList) == -1) {
                    nameList.push(ft);
                }
                if (ft == "LINE_3PE" || ft == "LINE_N3PE" || ft == "FACILITY_ABOVEGROUNDPL" && metaList[i].innerStation != 1) {
                    if (metaList[i].length == "" || metaList[i].length == null || metaList[i].length == undefined && $.inArray(ft, lengthList) == -1) {
                        lengthList.push(ft);

                    }
                    if (metaList[i].diameter == "" || metaList[i].diameter == null || metaList[i].diameter == undefined && $.inArray(ft, diameterLength) == -1 && metaList[i].innerStation != 1) {
                        diameterLength.push(ft);
                    }
                }
            }

        }
        if (getTipStr(nameList) != "") {
            isHaveStr += "存在未填写名称的" + getTipStr(nameList) + "<br>";
        }
        if (getTipStr(lengthList) != "") {
            isHaveStr += "存在未填写长度的" + getTipStr(lengthList) + "<br>";
        }
        if (getTipStr(diameterLength) != "") {
            isHaveStr += "存在未填写管径的" + getTipStr(diameterLength) + "<br>";
        }
    }
    if (isHaveStr == "") {
        var chartName = decodeURI(getParameter("chartName"));
        parent.layer.prompt({ title: '请输入发布名称', value: chartName, skin: 'self' }, function(pass, index) {
            publishDetail(pass);
            parent.layer.close(index);
        });
    } else {

        isHaveStr += "请填写完整"
        parent.layer.confirm(isHaveStr, {
            title: "提示",
            btn: ['确定'], //按钮
            skin: 'self'
        });
    }
}

/**
 * @desc 发布方法具体逻辑
 * @method publishDetail
 * @param {string} pass 逻辑图名称
 */
var publishList = [];//暂时存放上次高亮的元素
function publishDetail(pass) {
    var token = lsObj.getLocalStorage("token");
    var objectId = getParameter("objectId");
    var folderId = getParameter("folderId");
    var defination = JSON.stringify(pageMeta.collection.getGeometryAttribute());
    $.ajax({
        url: '/cloudlink-corrosionengineer/cpsegment/publicChart?token=' + token,
        method: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify({
            objectId: objectId,
            chartName: pass,
            folderId: folderId,
            defination: defination
        })
    })
    .done(function(res) {
        // console.log(res);
        if (res.success == 1) {
            var resid = res.result.objectId;
            parent.refreshTree(resid);
            $("#save").hide();
            $("#publish").hide();
            $("#extract").show();
            $("#edit").show();
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track('发布逻辑图', { '结果': '成功' });
                }
            } catch (err) {
                //在此处理错误
            }
        } else if (res.success == -1) {
            // console.log(res);
            var data = res.result;
            if(data != null){
                clearHighlight(publishList);
                publishList.length = 0;
                for (var i = 0; i < data.length; i++) {
                    pageMeta.collection.setWarning(data[i], true);
                    publishList.push(data[i]);
                }
            }
            parent.layer.confirm(res.msg, {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track('发布逻辑图', { '结果': '失败' });
                }
            } catch (err) {
                //在此处理错误
            }
        } else {
            parent.layer.confirm(res.msg, {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track('发布逻辑图', { '结果': '失败' });
                }
            } catch (err) {
                //在此处理错误
            }
        }
    })
}

/**
 * @desc 改变为编辑状态
 * @method changeToEdit
 */
function changeToEdit() {
    var index = parent.layer.confirm('编辑将会删除已发布的管段，请确定编辑', {
        title: "提示",
        btn: ['确定', '取消'],
        skin: "self", //按钮
        yes: function() {
            var token = lsObj.getLocalStorage("token");
            var objectId = getParameter("objectId");
            var folderId = getParameter("folderId");
            var chartName = decodeURI(getParameter("chartName"));
            var defination = JSON.stringify(pageMeta.collection.getGeometryAttribute());
            $.ajax({
                    url: '/cloudlink-corrosionengineer/cpsegment/updateChart?token=' + token,
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'JSON',
                    data: JSON.stringify({
                        objectId: objectId,
                        chartName: chartName,
                        folderId: folderId,
                        defination: defination
                    })
                })
                .done(function(res) {
                    // console.log(res);
                    if (res.success == 1) {
                        parent.normalRefresh();
                        $("#save").show();
                        $("#publish").show();
                        $("#extract").hide();
                        $("#edit").hide();
                        parent.layer.close(index);

                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('删除逻辑图', { '结果': '成功' });
                            }
                        } catch (err) {
                            //在此处理错误
                        }
                    } else {
                        parent.layer.confirm(res.msg, {
                            title: "提示",
                            btn: ['确定'], //按钮
                            skin: 'self'
                        });
                        try {
                            if (zhugeSwitch == 1) {
                                zhuge.track('删除逻辑图', { '结果': '失败' });
                            }
                        } catch (err) {
                            //在此处理错误
                        }
                    }

                })
        },
        cancel: function() {
            layer.close(index);
        }
    });
}

/**
 * @desc 抽取阴保管段
 * @method extractSegment
 */
function extractSegment() {
    var token = lsObj.getLocalStorage("token");
    var objectId = getParameter("objectId");
    $.ajax({
        url: '/cloudlink-corrosionengineer/cpsegment/splitChart?token=' + token + "&objectId=" + objectId,
        method: "get",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
            // async: false,
    })
    .done(function(res) {
        if (res.success == 1) {
            parent.refreshTreeNoCbk();
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track('抽取阴保管段', { '结果': '成功' });
                }
            } catch (err) {
                //在此处理错误
            }
        } else {
            parent.layer.confirm(res.msg, {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
            try {
                if (zhugeSwitch == 1) {
                    zhuge.track('抽取阴保管段', { '结果': '失败' });
                }
            } catch (err) {
                //在此处理错误
            }
        }
    })
}

/**
 * @desc 显示逻辑图
 * @method getChartStr
 */
function getChartStr() {
    var token = lsObj.getLocalStorage("token");
    var objectId = getParameter("objectId");
    var dataArray;
    $.ajax({
            url: '/cloudlink-corrosionengineer/cpsegment/getChartById?token=' + token + "&objectId=" + objectId,
            method: "get",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false
        })
        .done(function(res) {
            // console.log(res);
            if (res.success == 1) {
                //  console.log(res.result.defination);
                var dataStr = decodeURI(res.result.defination);
                $('#canvasWidth').val(res.result.canvasWidth);
                $('#canvasHeight').val(res.result.canvasLength);
                dataArray = JSON.parse(dataStr);
            } else {
                parent.layer.confirm(res.msg, {
                    title: "提示",
                    btn: ['确定'], //按钮
                    skin: 'self'
                });
            }

        })
    return dataArray;
}

/**
 * @desc 属性窗口显隐
 * @method isAttrShow
 */
function isAttrShow() {
    if ($('#attributepanel').css('display') == 'none') {
        $('#attributepanel').show();
    } else {
        $('#attributepanel').hide();
    }
}

/**
 * @desc 点击恒电位仪查看或选桩
 * @method selectMarker_hd
 * @param {string} id 恒电位仪id
 */
function selectMarker_hd(id) {
    var chartId = getParameter("objectId");
    var token = lsObj.getLocalStorage("token");
    if (type != 'chart') {
        var parameter = {
            "potentiostatId": id,
            "chartId": chartId
        };
        $.ajax({
            type: "get",
            url: "/cloudlink-corrosionengineer/cpsegment/getPotentiostatRelationMarker?token=" + token,
            contentType: "application/json; charset=utf-8",
            data: parameter,
            dataType: "json",
            success: function(res) {
                if (res.success == 1) {
                    var data = res.result;
                    // console.log(JSON.stringify(data));
                    if (data != null && data != "" && data != undefined) {
                        // var markerid=data.objectid;
                        var index = window.top.layer.open({
                            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                            title: '查看测试桩',
                            area: ['950px', '600px'],
                            btn: ['关闭'],
                            no: function(index, layero) {
                                var ab = layero.find('iframe')[0].contentWindow;
                                ab.viewData();
                            },
                            btn2: function(index, layero) {},
                            content: rootPath + "/src/html/marker/view_marker.html?objectId=" + data.objectId
                        })
                    } else {
                        layer.msg("无测试桩", { time: MSG_DISPLAY_TIME,skin: "self-success" });
                    }
                } else {
                    parent.layer.confirm("错误信息：" + res.msg, {
                        title: "提示",
                        btn: ['确定', '取消'], //按钮
                        skin: 'self'
                    });
                }
            }
        });
    } else {
        var index = window.top.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: '测试桩',
            area: ['950px', '600px'],
            btn: ['提交', '取消'],
            yes: function(index, layero) {
                var windowObj = layero.find('iframe')[0].contentWindow;
                var flag = windowObj.update_hd();
                if (flag) {
                    window.top.layer.close(index);
                }
            },
            btn2: function(index, layero) {
            },
            content: rootPath + "/src/html/segment/svg/rectifier_select_marker.html?potentiostatId=" + id + "&chartId=" + chartId
        });
    }
}

/**
 * @desc 点击管道选桩或者查看桩
 * @method selectMarker_gd
 * @param {string} id 管道id
 */
function selectMarker_gd(id) {
    var chartId = getParameter("objectId");
    if (type != 'chart') {
        var index = window.top.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: '查看测试桩',
            area: ['950px', '600px'],
            btn: ['确认'],
            yes: function(index, layero) {
                window.top.layer.close(index);
            },
            content: rootPath + "/src/html/segment/svg/view_line_marker.html?pipeId=" + id + "&chartId=" + chartId
        });
    } else {
        var index = window.top.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: '测试桩',
            area: ['950px', '600px'],
            btn: ['提交', '取消'],
            yes: function(index, layero) {
                var windowObj = layero.find('iframe')[0].contentWindow;
                var flag = windowObj.update_gd();
                if (flag) {
                    window.top.layer.close(index);
                }
            },
            btn2: function(index, layero) {
            },
            content: rootPath + "/src/html/segment/svg/line_select_marker.html?pipeId=" + id + "&chartId=" + chartId
        });
    }
}

/**
 * @desc 判断选择的shape有没有关联测试桩，如有则删除
 * @method isHaveMarker
 */
function isHaveMarker() {
    var shapeList = pageMeta.selectedShapeList;
    //FACILITY_RECTIFIER 恒电位仪 LINE_3PE 3PE管道
    var idshd = "";
    var idspe = "";

    for (var i = 0; i < shapeList.length; i++) {
        if (shapeList[i].facilityType == "FACILITY_RECTIFIER") {
            idshd += shapeList[i].id + ",";
        }
        if (shapeList[i].facilityType == "LINE_3PE") {
            idspe += shapeList[i].id + ",";
        }
    }
    idshd = idshd.substring(0, idshd.lastIndexOf(","));
    idspe = idspe.substring(0, idspe.lastIndexOf(","));
    if (idshd == "" && idspe == "") {
        clearShape(false);
    } else if (idshd == "" && idspe != "") {
        var index = parent.layer.confirm("将删除选中管道关联的测试桩，是否确认删除", {
            title: "提示",
            btn: ['确认', '取消'], //按钮 //按钮
            skin: 'self',
            yes: function() {
                deleteDeviceRelationMarker(idshd, idspe, "delete");
                parent.layer.close(index);
            }
        });

    } else if (idshd != "" && idspe == "") {
        var index = parent.layer.confirm("将删除选中恒电位仪关联的测试桩，是否确认删除", {
            title: "提示",
            btn: ['确认', '取消'], //按钮 //按钮
            skin: 'self',
            yes: function() {
                deleteDeviceRelationMarker(idshd, idspe, "delete");
                parent.layer.close(index);
            }
        });
    } else {
        var index = parent.layer.confirm("将删除选中管道和恒电位仪关联的测试桩，是否确认删除", {
            title: "提示",
            btn: ['删除', '取消'], //按钮 //按钮
            skin: 'self',
            yes: function() {
                deleteDeviceRelationMarker(idshd, idspe, "delete");
                parent.layer.close(index);
            }
        });
    }
}

/**
 * @desc 删除恒电位仪和管道关联的测试桩
 * @method compliteArray
 * @param {string} idshd 恒电位仪id
 * @param {string} idspe 管道id
 * @return {string} is_delete 是否删除
 */
function deleteDeviceRelationMarker(idshd, idspe, is_delete) {
    var chartId = getParameter("objectId");
    var token = lsObj.getLocalStorage("token");
    $.ajax({
        url: '/cloudlink-corrosionengineer/cpsegment/deleteDeviceRelationMarker?token=' + token + "&chartId=" + chartId + "&pipeId=" + idspe + "&potentiostatId=" + idshd,
        method: "get",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false
    })
    .done(function(res) {
        // console.log(res);
        if (res.success == 1) {
            if (is_delete == "delete") {
                clearShape(false);
            }
        } else {
            parent.layer.confirm(res.msg, {
                title: "提示",
                btn: ['确定'], //按钮
                skin: 'self'
            });
        }

    })
}

/**
 * @desc 比较两个数组中相同的项，并把其中一个数组中与另一数组中相同的项移除，返回剩余的项（撤销或恢复的时候比较前后的数组不一样的地方）
 * @method compliteArray
 * @param {array} arr1 
 * @param {array} arr2
 * @return {array}
 */
function compliteArray(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i].id == arr2[j].id) {
                arr1.splice(i, 1);
                i--;
                break;
            }
        }
    }
    return arr1;
}

//属性配置
var ChartConfig = {
    //输入框配置列表  
    'textInputList': [{
            label: '字体大小',
            name: 'textSize',
            inputtype: 'select',
            type: 'int',
            item: [ //0
                { label: '8px', value: 8 },
                { label: '9px', value: 9 },
                { label: '10px', value: 10 },
                { label: '11px', value: 11 },
                { label: '12px', value: 12 },
                { label: '13px', value: 13 },
                { label: '14px', value: 14 },
                { label: '15px', value: 15 },
                { label: '16px', value: 16 },
                { label: '17px', value: 17 },
                { label: '18px', value: 18 },
                { label: '19px', value: 19 },
                { label: '20px', value: 20 },
                { label: '21px', value: 21 },
                { label: '22px', value: 22 },
                { label: '23px', value: 23 },
                { label: '24px', value: 24 },
                { label: '25px', value: 25 },
                { label: '26px', value: 26 },
                { label: '27px', value: 27 },
                { label: '28px', value: 28 },
                { label: '29px', value: 29 },
                { label: '30px', value: 30 }
            ]
        }, {
            label: '字体类型',
            name: 'textFamily',
            inputtype: 'select',
            type: 'string',
            item: [ //1
                { label: '微软雅黑', value: '微软雅黑' },
                { label: '宋体', value: '宋体' }
            ]
        }, {
            label: '站内\站外',
            name: 'innerStation',
            inputtype: 'select',
            type: 'int',
            item: [ //10 2
                { label: '站外', value: 0 },
                { label: '站内', value: 1 }
            ]
        },
        {
            label: '名称',
            name: 'text',
            inputtype: 'input',
            type: 'string' //2 3
        }, {
            label: '长度(km)',
            name: 'length',
            inputtype: 'input',
            type: 'double' //3 4
        }, {
            label: '管径(mm)',
            name: 'diameter',
            inputtype: 'input',
            type: 'double' //4 5
        }, {
            label: '壁厚(mm)',
            name: 'wallThickness',
            inputtype: 'input',
            type: 'double' //5 6
        },
        {
            label: '材质',
            name: 'material',
            inputtype: 'input',
            type: 'string' //6 7
        }, {
            label: '规格',
            name: 'specifications',
            inputtype: 'input',
            type: 'string' //7 8
        },
        // {
        // 	label : '安装类型', name : 'installType',inputtype : 'input', type : 'string'
        // },
        {
            label: '安装类型',
            name: 'installType',
            inputtype: 'select',
            type: 'string',
            item: [ //8 9
                { label: '地上', value: '地上' },
                { label: '地下', value: '地下' }
            ]
        },
        {
            label: '测试桩',
            name: 'marker',
            inputtype: 'button',
            type: 'string',
            buttontext: '选桩',
            buttontextview: '查看',
            click: function(id) { selectMarker_hd(id) } //9 10
        },
        // {label : '站内\站外', name : 'innerStation', inputtype : 'select', type : 'int', item : [//10
        // 		{label : '站外', value : 0,},
        //         {label : '站内', value : 1,}
        // ]},
        {
            label: '测试桩分布',
            name: 'markerList',
            inputtype: 'button',
            type: 'string',
            buttontext: '选桩',
            buttontextview: '查看',
            click: function(id) { selectMarker_gd(id) } //11
        }, {
            label: '名称1',
            name: 'realtext',
            inputtype: 'input',
            type: 'string' //2
        }
    ],
    //节点属性显示配置
    'nodeAttributeConfig': {
        FACILITY_STATION: [0, 1, 3], // 场站
        FACILITY_VALVE: [0, 1, 3], // 阀室
        FACILITY_ABOVEGROUNDPL: [0, 1, 3, 4, 5, 6], // 架空线
        FACILITY_TEE: [0, 1, 3], // 三通
        FACILITY_REDUCER: [0, 1, 3], // 大小头
        FACILITY_RECTIFIER: [0, 1, 3, 8, 10], // 恒电位仪
        FACILITY_SHALLOWANODEBED: [0, 1, 3, 7], // 浅埋阳极地床
        FACILITY_DEEPANODEBED: [0, 1, 3, 7], // 深井阳极地床
        FACILITY_SPD: [0, 1, 3, 9], // 无保护装置绝缘接头
        FACILITY_PROTECTION: [0, 1, 3, 9], // 有保护装置绝缘接头
        FACILITY_FIKWITHOUTSPD: [0, 1, 2, 9], // 无保护装置绝缘法兰
        FACILITY_FIKWITHSPD: [0, 1, 2, 9], // 有保护装置绝缘法兰
        FACILITY_CABLECONNECTION: [], // 连接点
        FACILITY_PIPECABLECONNECTION: [], // 管道连接点
        LINE_3PE: [0, 1, 2, 3, 4, 5, 6, 11], // 3PE管道
        LINE_N3PE: [0, 1, 2, 3, 4, 5, 6, 11], // 非3PE管道
        LINE_ANODECABLE: [0, 1, 3, 8], // 阳极电缆
        LINE_CATHODECABLE: [0, 1, 3, 8], // 阴极电缆
        LINE_WIRE: [0, 1, 3, 8], // 跨接电缆
        LINE_CONNECTIONLINE: [0, 1, 3], // 连接线
    }
}
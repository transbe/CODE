/**  
 * @file
 * @author: lujingrui
 * @desc: 右侧逻辑图具体逻辑处理
 * @date: 2017-03-03 
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:30:38
 */

//逻辑图类型 (目录/逻辑图/已发布逻辑图/阴保管段)
var type = "";

/**
 * @desc 初始化方法
 */
function initChart() {
    type = getParameter("type");
    if (type == "chart") { //逻辑图
        if (judgePrivilege()) { //权限控制
            pageMeta.editable = false;
            $(".for-operation").hide();
            //隐藏左边工具栏
            visitPanel();
        } else {
            $("#save").show();
            $("#publish").show();
            $("#equipmentlist").hide();
            var timer = setInterval(save, 60 * 1000);
        }
    } else if (type == "publish") { //已发布逻辑图
        if (judgePrivilege()) { //权限控制
            $(".for-operation").hide();
        } else {
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
    } else if (type == "file") { //管段
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
 * @param {string} hightLightList 上一次高亮的元件
 */
var hightLightList = []; //存放上一次高亮的元件
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
 * @param {string} objectId 元件id
 */
var _EquipmentList = getLanguageValue("Equipment-List");

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
        .done(function (res) {
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
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
    //设备列表
    $.ajax({
            url: '/cloudlink-corrosionengineer/cpsegment/getDeviceCountBySegmentId?token=' + token + "&segmentId=" + objectId,
            method: 'get',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON'
        })
        .done(function (res) {
            //name typeName remark
            if (res.success == 1) {
                $("#equipmentheader").html(_EquipmentList + ":" + chartName);
                var data = res.result;
                // console.log(JSON.stringify(data));
                var str = '';
                var areaSum = 0;
                var lineOutputCurrentSum = "";
                if (data['3PE'] != null && data['3PE'] != undefined && data['3PE'] != "" && data['3PE'].list.length > 0) {
                    var list = data['3PE'].list;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].area != null && list[i].area != "") {
                            areaSum += Number(list[i].area);
                        }
                        if (list[i].totalsumCurrentFromPlToAnode != null && list[i].totalsumCurrentFromPlToAnode != "") {
                            lineOutputCurrentSum = (Number(list[i].totalsumCurrentFromPlToAnode) + Number(lineOutputCurrentSum)).toString();
                        }
                    }
                }
                //非3PE管 N3PE
                if (data['N3PE'] != null && data['N3PE'] != undefined && data['N3PE'] != "" && data['N3PE'].list.length > 0) {
                    var list = data['N3PE'].list;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].area != null && list[i].area != "") {
                            areaSum += Number(list[i].area);
                        }
                        if (list[i].totalsumCurrentFromPlToAnode != null && list[i].totalsumCurrentFromPlToAnode != "") {
                            lineOutputCurrentSum = (Number(list[i].totalsumCurrentFromPlToAnode) + Number(lineOutputCurrentSum)).toString();
                        }
                    }
                }
                var outASum = "";
                //恒电位仪 Potentiostat
                if (data.Potentiostat != null && data.Potentiostat != undefined && data.Potentiostat != "" && data.Potentiostat.list.length > 0) {
                    str += '<tr class="head-bg head-center" ><td colspan="8">' + getLanguageValue("Rectifier") + '</td> </tr><tr class="head-bg"><td>' + getLanguageValue("Name") + '</td><td>' + getLanguageValue("Specifications") + '</td> <td>' + getLanguageValue("Set-Potential") + '</td> <td>' + getLanguageValue("Set-OFF-Potential") + '</td> <td>' + getLanguageValue("IR_drop") + '</td> <td>' + getLanguageValue("Output-Current") + '</td> <td>' + getLanguageValue("Output-Voltage") + '</td> <td>' + getLanguageValue("belong_to") + '</td></tr>';
                    var list = data.Potentiostat.list;
                    for (var i = 0; i < list.length; i++) {
                        var IRdrop = "";
                        if (list[i].spfr != null && list[i].spfr != "" && list[i].sopfr != null && list[i].sopfr != "") {
                            IRdrop = (Number(list[i].sopfr) - Number(list[i].spfr)).toString();
                        }
                        if (list[i].OutA != null && list[i].OutA != "") {
                            if (outASum != "") {
                                outASum = (Number(list[i].OutA) + Number(outASum)).toString();
                            } else {
                                outASum = (Number(list[i].OutA)).toString();
                            }
                        }
                        if (i == 0) {
                            str += '<tr><td>' + getStr(list[i].name) + '</td><td>' + getStr(list[i].specifications) + '</td> <td>' + getStr(list[i].spfr) + '</td><td>' + getStr(list[i].sopfr) + '</td><td>' + IRdrop + '</td> <td>' + getStr(list[i].OutA) + '</td> <td>' + getStr(list[i].outV) + '</td> <td>' + getStr(list[i].belongTo) + '</td></tr>'
                        } else {
                            str += '<tr><td>' + getStr(list[i].name) + '</td><td>' + getStr(list[i].specifications) + '</td> <td>' + getStr(list[i].spfr) + '</td><td>' + getStr(list[i].sopfr) + '</td><td>' + IRdrop + '</td> <td>' + getStr(list[i].OutA) + '</td> <td>' + getStr(list[i].outV) + '</td> <td>' + getStr(list[i].belongTo) + '</td></tr>'
                        }
                    }
                }
                var ampereDensity = ((Number(lineOutputCurrentSum) / 1000 + Number(outASum)) / Number(areaSum) * 1000).toFixed(3);
                str += '<tr class="head-bg head-center"><td colspan="9">' + getLanguageValue("current_density") + '</td></tr><tr class="head-bg">';
                str += '<tr><td colspan="8">' + ampereDensity + '</td></tr>';
                //3PE管 3PE
                if (data['3PE'] != null && data['3PE'] != undefined && data['3PE'] != "" && data['3PE'].list.length > 0) {
                    str += '<tr class="head-bg head-center"><td colspan="8">' + getLanguageValue("3LPE-Pipeline") + '</td></tr><tr class="head-bg"><td>' + getLanguageValue("Name") + '</td><td colspan="2">' + getLanguageValue("Specifications") + '(km)*(mm)*(mm)' + '</td> <td colspan="1">' + getLanguageValue("surface_area") + '</td> <td colspan="2">' + getLanguageValue("Casing") + '</td> <td colspan="2">' + getLanguageValue("Drainage") + '</td></tr>';
                    var list = data['3PE'].list;
                    for (var i = 0; i < list.length; i++) {
                        str += '<tr><td>' + getStr(list[i].name) + '</td><td colspan="2">' + getStr(list[i].specifications) + '</td> <td colspan="">' + getStr(list[i].area) + '</td> <td colspan="2">' + getStr(list[i].markerTG) + '</td> <td colspan="2">' + getStr(list[i].markerPL) + '</td></tr>';
                    }
                }
                //非3PE管 N3PE
                if (data['N3PE'] != null && data['N3PE'] != undefined && data['N3PE'] != "" && data['N3PE'].list.length > 0) {
                    str += '<tr class="head-bg head-center"><td colspan="9">' + getLanguageValue("Non-3LPE-Pipeline") + '</td></tr><tr class="head-bg"><td>' + getLanguageValue("Name") + '</td><td colspan="2">' + getLanguageValue("Specifications") + '(km)*(mm)*(mm)' + '</td> <td colspan="1">' + getLanguageValue("surface_area") + '</td> <td colspan="2">' + getLanguageValue("Casing") + '</td> <td colspan="2">' + getLanguageValue("Drainage") + '</td></tr>';
                    var list = data['N3PE'].list;
                    for (var i = 0; i < list.length; i++) {
                        str += '<tr><td>' + getStr(list[i].name) + '</td><td colspan="2">' + getStr(list[i].specifications) + '</td> <td colspan="1">' + getStr(list[i].area) + '</td> <td colspan="2">' + getStr(list[i].markerTG) + '</td> <td colspan="2">' + getStr(list[i].markerPL) + '</td></tr>';
                    }
                }
                //绝缘装置 InsulatedJoint
                if (data.InsulatedJoint != null && data.InsulatedJoint != undefined && data.InsulatedJoint != "" && data.InsulatedJoint.list.length > 0) {
                    str += '<tr class="head-bg head-center"><td colspan="8">' + getLanguageValue("Cathodic-isolations") + '</td></tr><tr class="head-bg"><td colspan="2">' + getLanguageValue("Name") + '</td><td colspan="2">' + getLanguageValue("Type") + '</td> <td colspan="5">' + getLanguageValue("Mounting_type") + '</td></tr>';
                    var list = data.InsulatedJoint.list;
                    for (var i = 0; i < list.length; i++) {
                        str += '<tr><td colspan="2">' + getStr(list[i].name) + '</td><td colspan="2">' + getStr(list[i].type) + '</td> <td colspan="4">' + getStr(list[i].installType) + '</td></tr>'
                    }
                }
                //站场,阀室 StationValve
                if (data.StationValve != null && data.StationValve != undefined && data.StationValve != "" && data.StationValve.list.length > 0) {
                    str += '<tr class="head-bg head-center"><td colspan="8">' + getLanguageValue("valve_cage") + '</td></tr><tr class="head-bg"><td colspan="3">' + getLanguageValue("Name") + '</td><td colspan="5">' + getLanguageValue("Type") + '</td></tr>';
                    var list = data.StationValve.list;
                    for (var i = 0; i < list.length; i++) {
                        str += '<tr><td colspan="3">' + getStr(list[i].name) + '</td><td colspan="5">' + getStr(list[i].type) + '</td></tr>';
                    }
                }
                //其他 OtherDevice
                if (data.OtherDevice != null && data.OtherDevice != undefined && data.OtherDevice != "" && data.OtherDevice.list.length > 0) {
                    str += '<tr class="head-bg head-center"><td colspan="8">' + getLanguageValue("Others") + '</td></tr><tr class="head-bg"><td colspan="3">' + getLanguageValue("Name") + '</td><td colspan="5">' + getLanguageValue("Type") + '</td></tr>';
                    var list = data.OtherDevice.list;
                    for (var i = 0; i < list.length; i++) {
                        if (getStr(list[i].type) == '三通' || getStr(list[i].type) == '大小头' || getStr(list[i].type) == '架空线') {
                            str += '<tr><td colspan="3">' + getStr(list[i].name) + '</td><td colspan="5">' + getStr(list[i].type) + '</td></tr>';
                        }
                    }
                }

                $("#realEquipmentTable tbody").empty();
                $("#realEquipmentTable tbody").append(str);
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
}

/**
 * @desc 判断某个字段是否为空
 * @param {string} str 字符串非空验证
 * @returns {string} 非空返回本身，为空返回空字符串
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
 * @param {json} defination 逻辑图信息
 */
function saveChartForLog(defination, defaultIndex) {
    console.log("##############");
    console.log(defaultIndex);
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
                canvasLength: parseInt($('#canvasHeight').val()),
                elementNum: defaultIndex.join(',')
            })
        })
        .done(function (res) {
            if (res.success == 1) {
                parent.layer.msg(getLanguageValue("save_successfully"), {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });

                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('保存逻辑图', {
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
                        tjSdk.track('保存逻辑图', {
                            '结果': '失败'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            }

        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
}

/**
 * @desc 保存草稿(不提示，自动保存)
 * @param {json} defination 逻辑图信息
 */
function saveChart(defination, defaultIndex) {
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
                canvasLength: parseInt($('#canvasHeight').val()),
                elementNum: defaultIndex.join(',')
            })
        })
        .done(function (res) {
            if (res.success == 1) {
                console.log('保存成功！');
            }
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
}

/**
 * @desc 根据设备类型获取中文名称
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
 * 以下为必填 名称 其中 3PE管道 非3PE管道 架空线必须填长度和管径
    站场	FACILITY_STATION  名称不能重复
    阀室	FACILITY_VALVE 名称不能重复
    3PE管道	LINE_3PE
    非3PE管道	LINE_N3PE
    架空线	FACILITY_ABOVEGROUNDPL
    三通	FACILITY_TEE
    大小头	FACILITY_REDUCER
    恒电位仪	FACILITY_RECTIFIER 名称不能重复
    无保护装置绝缘接头	FACILITY_SPD 名称不能重复
    有保护装置绝缘接头	FACILITY_PROTECTION 名称不能重复
 */

var noTextList = []; //未填写必填项的元件
function publishChart() {
    var stationNameList = []; //存放所有站场名字 用来判断是否重复
    var valveNameList = []; //存放所有阀室名字 用来判断是否重复
    var rectifierNameList = []; //存放所有恒电位仪名字 用来判断是否重复
    var spdNameList = []; //存放所有无保护装置绝缘接头名字 用来判断是否重复
    var protectionNameList = []; //存放所有有保护装置绝缘接头名字 用来判断是否重复

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
            var f_id = metaList[i].id;

            if ((ft == "FACILITY_STATION" || ft == "FACILITY_VALVE" || ft == "LINE_3PE" || ft == "LINE_N3PE" || ft == "FACILITY_ABOVEGROUNDPL" || ft == "FACILITY_TEE" || ft == "FACILITY_REDUCER" || ft == "FACILITY_RECTIFIER" || ft == "FACILITY_SPD" || ft == "FACILITY_PROTECTION") && metaList[i].text == "" && metaList[i].innerStation != 1) {
                if ($.inArray(f_id, noTextList) == -1) {
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
            //判断是否重名
            if (ft == "FACILITY_STATION") {
                stationNameList.push(metaList[i].text);
            } else if (ft == "FACILITY_VALVE") {
                valveNameList.push(metaList[i].text);
            } else if (ft == "FACILITY_RECTIFIER") {
                rectifierNameList.push(metaList[i].text);
            } else if (ft == "FACILITY_SPD") {
                spdNameList.push(metaList[i].text);
            } else if (ft == "FACILITY_PROTECTION") {
                protectionNameList.push(metaList[i].text);
            }
        }
        if (getTipStr(nameList) != "") {
            isHaveStr += getLanguageValue("name_filled_in") + getTipStr(nameList) + "<br>";
        }
        if (getTipStr(lengthList) != "") {
            isHaveStr += getLanguageValue("length_filled_in") + getTipStr(lengthList) + "<br>";
        }
        if (getTipStr(diameterLength) != "") {
            isHaveStr += getLanguageValue("diameter_filled_in") + getTipStr(diameterLength) + "<br>";
        }
        if (hasTwoSame(stationNameList) == true) {
            isHaveStr += getLanguageValue("duplicated_Station") + "<br>";
        }
        if (hasTwoSame(valveNameList) == true) {
            isHaveStr += getLanguageValue("duplicated_Valve_Station") + "<br>";
        }
        if (hasTwoSame(rectifierNameList) == true) {
            isHaveStr += getLanguageValue("duplicated_Rectifier") + "<br>";
        }
        if (hasTwoSame(spdNameList) == true) {
            isHaveStr += getLanguageValue("duplicated_Insulation_Joint") + "<br>";
        }
        if (hasTwoSame(protectionNameList) == true) {
            isHaveStr += getLanguageValue("duplicated_Insulation_Joint_with_arrester") + "<br>";
        }

    }
    if (isHaveStr == "") {
        var chartName = decodeURI(getParameter("chartName"));
        parent.layer.prompt({
            title: getLanguageValue("enter_release_name"),
            value: chartName,
            skin: 'self'
        }, function (pass, index) {
            publishDetail(pass);
            parent.layer.close(index);
        });
    } else {

        // isHaveStr += getLanguageValue("complete")
        parent.layer.alert(isHaveStr, {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
    }
}

/**
 * @desc 判断一个list中是否存在重复的元素
 * @param {*} list 
 */
function hasTwoSame(list) {
    if (list.length > 0) {
        var str = "," + list.join(",") + ",";
        for (var i = 0; i < list.length; i++) {
            if (str.indexOf("," + list[i] + ",") != str.lastIndexOf("," + list[i] + ",")) {
                return true;
            }
        }
    }
    return false;
}

/**
 * @desc 发布方法具体逻辑
 * @param {string} pass 逻辑图名称
 */
var publishList = []; //暂时存放上次高亮的元素
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
        .done(function (res) {
            // console.log(res);
            if (res.success == 1) {
                var resid = res.result.objectId;
                parent.refreshTree(resid);
                $("#save").hide();
                $("#publish").hide();
                $("#extract").show();
                $("#edit").show();
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('发布逻辑图', {
                            '结果': '成功'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            } else if (res.success == -1) {
                // console.log(res);
                var data = res.result;
                if (data != null) {
                    clearHighlight(publishList);
                    publishList.length = 0;
                    for (var i = 0; i < data.length; i++) {
                        pageMeta.collection.setWarning(data[i], true);
                        publishList.push(data[i]);
                    }
                }
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('发布逻辑图', {
                            '结果': '失败'
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
                        tjSdk.track('发布逻辑图', {
                            '结果': '失败'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            }
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
}

/**
 * @desc 改变为编辑状态
 */
function changeToEdit() {
    var index = parent.layer.confirm(getLanguageValue("editor_will_delete"), {
        title: getLanguageValue("tip"),
        btn: [getLanguageValue("OK"), getLanguageValue("cancel")],
        skin: "self", //按钮
        yes: function () {
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
                .done(function (res) {
                    // console.log(res);
                    if (res.success == 1) {
                        parent.normalRefresh();
                        $("#save").show();
                        $("#publish").show();
                        $("#extract").hide();
                        $("#edit").hide();
                        parent.layer.close(index);

                        try {
                            if (tjSwitch == 1) {
                                tjSdk.track('删除逻辑图', {
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
                                tjSdk.track('删除逻辑图', {
                                    '结果': '失败'
                                });
                            }
                        } catch (err) {
                            //在此处理错误
                        }
                    }

                })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                    // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                    layer.alert(NET_ERROR_MSG, {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                })
        },
        cancel: function () {
            layer.close(index);
        }
    });
}

/**
 * @desc 抽取阴保管段
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
        .done(function (res) {
            if (res.success == 1) {
                parent.refreshTreeNoCbk();
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('抽取阴保管段', {
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
                        tjSdk.track('抽取阴保管段', {
                            '结果': '失败'
                        });
                    }
                } catch (err) {
                    //在此处理错误
                }
            }
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
}

/**
 * @desc 显示逻辑图
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
        .done(function (res) {
            // console.log(res);
            if (res.success == 1) {
                // console.log(res.result.defination);
                var dataStr = decodeURI(res.result.defination);
                // console.log(dataStr);
                $('#canvasWidth').val(res.result.canvasWidth);
                $('#canvasHeight').val(res.result.canvasLength);

                if (res.result.elementNum !== ''&&res.result.elementNum !== null) {
                    var strArr = res.result.elementNum.split(",");
                //    console.log(res.result.elementNum);
                //    console.log("__________");
                   defaultIndex=[];
                    strArr.forEach(function(data,index,arr){  //字符串数组转成int
                        defaultIndex.push(+data);  
                    }); 
                   
                }else{
                    defaultIndex=defaultIndex;
                }

                // console.log(defaultIndex);/
                dataArray = JSON.parse(dataStr);
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }

        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
    return dataArray;
}

/**
 * @desc 属性窗口显隐
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
            success: function (res) {
                if (res.success == 1) {
                    var data = res.result;
                    // console.log(JSON.stringify(data));
                    if (data != null && data != "" && data != undefined) {
                        // var markerid=data.objectid;
                        var index = window.top.layer.open({
                            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                            title: getLanguageValue("View_test_pile"),
                            area: ['950px', '600px'],
                            btn: [getLanguageValue("close")],
                            skin: 'self-iframe',
                            no: function (index, layero) {
                                var ab = layero.find('iframe')[0].contentWindow;
                                ab.viewData();
                            },
                            btn2: function (index, layero) {},
                            content: rootPath + "/src/html/marker/view_marker.html?objectId=" + data.objectId
                        })
                    } else {
                        layer.msg(getLanguageValue("No_test_pile"), {
                            time: MSG_DISPLAY_TIME,
                            skin: "self-msg"
                        });
                    }
                } else {
                    parent.layer.alert("错误信息：" + res.msg, {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        });
    } else {
        var index = window.top.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("Test_pile"),
            area: ['950px', '600px'],
            btn: [getLanguageValue("submit"), getLanguageValue("cancel")],
            skin: 'self-iframe',
            yes: function (index, layero) {
                var windowObj = layero.find('iframe')[0].contentWindow;
                var flag = windowObj.update_hd();
                if (flag) {
                    window.top.layer.close(index);
                }
            },
            btn2: function (index, layero) {},
            content: rootPath + "/src/html/segment/svg/rectifier_select_marker.html?potentiostatId=" + id + "&chartId=" + chartId
        });
    }
}

/**
 * @desc 点击管道选桩或者查看桩
 * @param {string} id 管道id
 */
function selectMarker_gd(id) {
    var chartId = getParameter("objectId");
    var token = lsObj.getLocalStorage("token");
    var beginShapeId; //从前台查出的管道上游关联设备id
    var endShapeId; //从前台查出的管道上游关联设备id
    var beginShapeFacilityType; //管道上游关联设备类型
    var endShapeFacilityType; //管道下游关联设备类型
    var beginShapeName; //管道上游关联设备名称
    var endShapeName; //管道下游关联设备名称

    var closetoDeviceId_1; //从后台查出的管道上游关联设备id
    var closetoDeviceId_2; //从后台查出的管道下游关联设备id

    var defination = pageMeta.collection.getGeometryAttribute();
    var hasFacility = 0;
    for (var i = 0; i < defination.length; i++) {
        if (id == defination[i].id) {
            if (defination[i].beginShape) {
                beginShapeId = defination[i].beginShape;
                hasFacility++;
            }
            if (defination[i].endShape) {
                endShapeId = defination[i].endShape;
                hasFacility++;
            }
            break;
        }
    }
    //此处存在判断：1. 前台管道两端其中一端或两端未连接设备
    if (hasFacility != 2) {
        parent.layer.alert(getLanguageValue("the_pipe_connect"), {
            title: getLanguageValue("tip"),
            skin: 'self-alert'
        });
        return;
    }
    //从后台查询该管道是两端设备及其顺序
    $.ajax({
            url: '/cloudlink-corrosionengineer/cpsegment/getPipeClosetoDevice?token=' + token + "&chartId=" + chartId + "&pipeId=" + id,
            method: "get",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false
        })
        .done(function (res) {
            if (res.success == 1) {
                var markerList = res.dataList;
                if (markerList.length > 0 && !isNull(markerList[0].closetoDeviceId) && !isNull(markerList[1].closetoDeviceId)) {
                    if (markerList[0].orderNum - 0 < markerList[1].orderNum - 0) {
                        closetoDeviceId_1 = markerList[0].closetoDeviceId;
                        closetoDeviceId_2 = markerList[1].closetoDeviceId;
                    } else {
                        closetoDeviceId_1 = markerList[1].closetoDeviceId;
                        closetoDeviceId_2 = markerList[0].closetoDeviceId;
                    }
                    console.log(closetoDeviceId_1);
                    console.log(closetoDeviceId_2);
                }
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })

    /**
     * 判断测试桩两段连接设备的顺序
     * 此处存在判断：2.后台结果为空，或其中一个为空，则用前台结果；
     * 3. 后台返回不为空，前台未修改
     * 4. 后台返回结果不会空，前台已修改，则用前台结果
     */

    if ((beginShapeId == closetoDeviceId_1 && endShapeId == closetoDeviceId_2) || (beginShapeId == closetoDeviceId_2 && endShapeId == closetoDeviceId_1)) {
        beginShapeId = closetoDeviceId_1;
        endShapeId = closetoDeviceId_2
    }
    for (var i = 0; i < defination.length; i++) {
        if (beginShapeId == defination[i].id) {
            beginShapeFacilityType = defination[i].facilityType;
            beginShapeName = encodeURI(defination[i].text);
        } else if (endShapeId == defination[i].id) {
            endShapeFacilityType = defination[i].facilityType;
            endShapeName = encodeURI(defination[i].text);
        }
        if (beginShapeFacilityType != undefined && endShapeFacilityType != undefined) {
            break;
        }
    }
    if (type != 'chart') {
        var index = window.top.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("View_test_pile"),
            area: ['950px', '600px'],
            btn: [getLanguageValue("OK")],
            skin: 'self-iframe',
            yes: function (index, layero) {
                window.top.layer.close(index);
            },
            content: rootPath + "/src/html/segment/svg/view_line_marker.html?pipeId=" + id + "&chartId=" + chartId
        });
    } else {
        var index = window.top.layer.open({
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            title: getLanguageValue("View_test_pile"),
            area: ['1200px', '600px'],
            btn: [getLanguageValue("submit"), getLanguageValue("cancel")],
            skin: 'self-iframe',
            yes: function (index, layero) {
                var windowObj = layero.find('iframe')[0].contentWindow;
                var flag = windowObj.update_gd();
                if (flag) {
                    window.top.layer.close(index);
                }
            },
            btn2: function (index, layero) {},
            content: rootPath + "/src/html/segment/svg/line_select_marker.html?pipeId=" + id + "&chartId=" + chartId + "&beginShapeId=" + beginShapeId + "&endShapeId=" + endShapeId + "&beginShapeFacilityType=" + beginShapeFacilityType + "&endShapeFacilityType=" + endShapeFacilityType + "&beginShapeName=" + beginShapeName + "&endShapeName=" + endShapeName
        });
    }
}

/**
 * @desc 判断选择的shape有没有关联测试桩，如有则删除
 */
function isHaveMarker() {
    var shapeList = pageMeta.selectedShapeList;
    if (shapeList.length <= 0 && pageMeta.selectedBean) {
        shapeList.push(pageMeta.selectedBean);
    }
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
        var index = parent.layer.confirm(getLanguageValue("selected_pipe_deleted"), {
            title: getLanguageValue("tip"),
            btn: [getLanguageValue("OK"), getLanguageValue("cancel")],
            skin: 'self',
            yes: function () {
                deleteDeviceRelationMarker(idshd, idspe, "delete");
                parent.layer.close(index);
            }
        });

    } else if (idshd != "" && idspe == "") {
        var index = parent.layer.confirm(getLanguageValue("test_pile_is_deleted"), {
            title: getLanguageValue("tip"),
            btn: [getLanguageValue("OK"), getLanguageValue("cancel")],
            skin: 'self',
            yes: function () {
                deleteDeviceRelationMarker(idshd, idspe, "delete");
                parent.layer.close(index);
            }
        });
    } else {
        var index = parent.layer.confirm(getLanguageValue("Check_test_pile_is_deleted"), {
            title: getLanguageValue("tip"),
            btn: [getLanguageValue("OK"), getLanguageValue("cancel")],
            skin: 'self',
            yes: function () {
                deleteDeviceRelationMarker(idshd, idspe, "delete");
                parent.layer.close(index);
            }
        });
    }
}

/**
 * @desc 删除恒电位仪和管道关联的测试桩
 * @param {string} idshd 恒电位仪id
 * @param {string} idspe 管道id
 * @returns {string} is_delete 是否删除
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
        .done(function (res) {
            // console.log(res);
            if (res.success == 1) {
                if (is_delete == "delete") {
                    clearShape(false);
                }
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }

        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        })
}

/**
 * @desc 比较两个数组中相同的项，并把其中一个数组中与另一数组中相同的项移除，返回剩余的项（撤销或恢复的时候比较前后的数组不一样的地方）
 * @param {array} arr1 
 * @param {array} arr2
 * @returns {array}
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
// var _TextSize = getLanguageValue("");
// var _TextFamily = getLanguageValue("");
// var 微软雅黑 = getLanguageValue("");
// var 宋体 = getLanguageValue("");
// var 站外 = getLanguageValue("");
// var 站内 = getLanguageValue("");
// var 名称 = getLanguageValue("");
// var 长度 = getLanguageValue("");
// var 管径 = getLanguageValue("");
// var 壁厚 = getLanguageValue("");
// var 材质 = getLanguageValue("");
// var 规格 = getLanguageValue("");
// var 安装类型 = getLanguageValue("");
// var 地上 = getLanguageValue("");
// var 地下 = getLanguageValue("");
// var 测试桩 = getLanguageValue("");
// var 选桩 = getLanguageValue("");
// var 查看 = getLanguageValue("");
// var 测试桩分布 = getLanguageValue("");
// var 名称1 = getLanguageValue("");
//属性配置
var ChartConfig = {
    //输入框配置列表  
    'textInputList': [{
            label: getLanguageValue("font_size"),
            name: 'textSize',
            inputtype: 'select',
            type: 'int',
            item: [ //0
                {
                    label: '8px',
                    value: 8
                },
                {
                    label: '9px',
                    value: 9
                },
                {
                    label: '10px',
                    value: 10
                },
                {
                    label: '11px',
                    value: 11
                },
                {
                    label: '12px',
                    value: 12
                },
                {
                    label: '13px',
                    value: 13
                },
                {
                    label: '14px',
                    value: 14
                },
                {
                    label: '15px',
                    value: 15
                },
                {
                    label: '16px',
                    value: 16
                },
                {
                    label: '17px',
                    value: 17
                },
                {
                    label: '18px',
                    value: 18
                },
                {
                    label: '19px',
                    value: 19
                },
                {
                    label: '20px',
                    value: 20
                },
                {
                    label: '21px',
                    value: 21
                },
                {
                    label: '22px',
                    value: 22
                },
                {
                    label: '23px',
                    value: 23
                },
                {
                    label: '24px',
                    value: 24
                },
                {
                    label: '25px',
                    value: 25
                },
                {
                    label: '26px',
                    value: 26
                },
                {
                    label: '27px',
                    value: 27
                },
                {
                    label: '28px',
                    value: 28
                },
                {
                    label: '29px',
                    value: 29
                },
                {
                    label: '30px',
                    value: 30
                }
            ]
        }, {
            label: getLanguageValue("font_Family"),
            name: 'textFamily',
            inputtype: 'select',
            type: 'string',
            item: [ //1
                {
                    label: '微软雅黑',
                    value: '微软雅黑'
                },
                {
                    label: '宋体',
                    value: '宋体'
                }
            ]
        }, {
            label: getLanguageValue("in&out"),
            name: 'innerStation',
            inputtype: 'select',
            type: 'int',
            item: [ //10 2
                {
                    label: getLanguageValue("out"),
                    value: 0
                },
                {
                    label: getLanguageValue("in"),
                    value: 1
                }
            ]
        },
        {
            label: getLanguageValue("Name"),
            name: 'text',
            inputtype: 'input',
            type: 'string' //2 3
        }, {
            label: getLanguageValue("Length"),
            name: 'length',
            inputtype: 'input',
            type: 'double' //3 4
        }, {
            label: getLanguageValue("diameter"),
            name: 'diameter',
            inputtype: 'input',
            type: 'double' //4 5
        }, {
            label: getLanguageValue("wall_thickness"),
            name: 'wallThickness',
            inputtype: 'input',
            type: 'double' //5 6
        },
        {
            label: getLanguageValue("Material"),
            name: 'material',
            inputtype: 'input',
            type: 'string' //6 7
        }, {
            label: getLanguageValue("Specifications"),
            name: 'specifications',
            inputtype: 'input',
            type: 'string' //7 8
        },
        // {
        // 	label : '安装类型', name : 'installType',inputtype : 'input', type : 'string'
        // },
        {
            label: getLanguageValue("Type"),
            name: 'installType',
            inputtype: 'select',
            type: 'string',
            item: [ //8 9
                {
                    label: getLanguageValue("Ground"),
                    value: '地上'
                },
                {
                    label: getLanguageValue("underground"),
                    value: '地下'
                }
            ]
        },
        {
            label: getLanguageValue("Test_pile"),
            name: 'marker',
            inputtype: 'button',
            type: 'string',
            buttontext: getLanguageValue("Piling-chosen"),
            buttontextview: getLanguageValue("view"),
            click: function (id) {
                selectMarker_hd(id)
            } //9 10
        },
        // {label : '站内\站外', name : 'innerStation', inputtype : 'select', type : 'int', item : [//10
        // 		{label : '站外', value : 0,},
        //         {label : '站内', value : 1,}
        // ]},
        {
            label: getLanguageValue("Test_pile_distribution"),
            name: 'markerList',
            inputtype: 'button',
            type: 'string',
            buttontext: getLanguageValue("Piling-chosen"),
            buttontextview: getLanguageValue("view"),
            click: function (id) {
                selectMarker_gd(id)
            } //11
        }, {
            label: getLanguageValue("Name1"),
            name: 'realtext',
            inputtype: 'input',
            type: 'string' //12
        }, {
            // label: '0',
            name: 'defaultText', //默认属性值
            inputtype: 'radio',
            value: 0,
            type: 'string' //13
        }
    ],
    //节点属性显示配置
    'nodeAttributeConfig': {
        /*************************************************************/
        /*
         * @author lizhenzhen
         * @desc 去除字体大小和字体类型设置
         */
        FACILITY_STATION: [3, 13], // 场站
        FACILITY_VALVE: [3, 13], // 阀室
        FACILITY_ABOVEGROUNDPL: [3, 4, 5, 6, 13], // 架空线
        FACILITY_TEE: [3, 13], // 三通
        FACILITY_REDUCER: [3, 13], // 大小头
        FACILITY_RECTIFIER: [3, 8, 10, 13], // 恒电位仪
        FACILITY_SHALLOWANODEBED: [3, 7], // 浅埋阳极地床
        FACILITY_DEEPANODEBED: [3, 7], // 深井阳极地床
        FACILITY_SPD: [3, 9, 13], // 无保护装置绝缘接头
        FACILITY_PROTECTION: [3, 9, 13], // 有保护装置绝缘接头
        FACILITY_FIKWITHOUTSPD: [2, 9], // 无保护装置绝缘法兰
        FACILITY_FIKWITHSPD: [2, 9], // 有保护装置绝缘法兰
        FACILITY_CABLECONNECTION: [], // 连接点
        FACILITY_PIPECABLECONNECTION: [], // 管道连接点
        LINE_3PE: [2, 3, 4, 5, 6, 11, 13], // 3PE管道
        LINE_N3PE: [2, 3, 4, 5, 6, 11, 13], // 非3PE管道
        LINE_ANODECABLE: [3, 8], // 阳极电缆
        LINE_CATHODECABLE: [3, 8], // 阴极电缆
        LINE_WIRE: [3, 8], // 跨接电缆
        LINE_CONNECTIONLINE: [3], // 连接线
        /*************************************************************/

        // FACILITY_STATION: [0, 1, 3], // 场站
        // FACILITY_VALVE: [0, 1, 3], // 阀室
        // FACILITY_ABOVEGROUNDPL: [0, 1, 3, 4, 5, 6], // 架空线
        // FACILITY_TEE: [0, 1, 3], // 三通
        // FACILITY_REDUCER: [0, 1, 3], // 大小头
        // FACILITY_RECTIFIER: [0, 1, 3, 8, 10], // 恒电位仪
        // FACILITY_SHALLOWANODEBED: [0, 1, 3, 7], // 浅埋阳极地床
        // FACILITY_DEEPANODEBED: [0, 1, 3, 7], // 深井阳极地床
        // FACILITY_SPD: [0, 1, 3, 9], // 无保护装置绝缘接头
        // FACILITY_PROTECTION: [0, 1, 3, 9], // 有保护装置绝缘接头
        // FACILITY_FIKWITHOUTSPD: [0, 1, 2, 9], // 无保护装置绝缘法兰
        // FACILITY_FIKWITHSPD: [0, 1, 2, 9], // 有保护装置绝缘法兰
        // FACILITY_CABLECONNECTION: [], // 连接点
        // FACILITY_PIPECABLECONNECTION: [], // 管道连接点
        // LINE_3PE: [0, 1, 2, 3, 4, 5, 6, 11], // 3PE管道
        // LINE_N3PE: [0, 1, 2, 3, 4, 5, 6, 11], // 非3PE管道
        // LINE_ANODECABLE: [0, 1, 3, 8], // 阳极电缆
        // LINE_CATHODECABLE: [0, 1, 3, 8], // 阴极电缆
        // LINE_WIRE: [0, 1, 3, 8], // 跨接电缆
        // LINE_CONNECTIONLINE: [0, 1, 3], // 连接线
    }
}
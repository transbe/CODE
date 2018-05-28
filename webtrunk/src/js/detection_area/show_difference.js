/**
 * @file
 * @author zhangyi
 * @desc 比较更改的测试桩类型
 * @date 2017-06-22
 * @last modified by zhangyi
 * @last modified time 2017-06-22 15:03:29
 */

var markerDataJSON = JSON.parse(lsObj.getLocalStorage("amJSON")); // 获取比较的测试桩数据
var token = lsObj.getLocalStorage("token"); // token

$(function() {
    changePageStyle("../../../src");
    loadTable();
});

/**
 * @desc 加载网格化数据
 */
function loadTable() {
    $("#markerTable").bootstrapTable({
        data: concat(markerDataJSON.oldMarkerList, markerDataJSON.newMarkerList),
        showRefresh: false,
        sidePagination: 'client',
        columns: [{
            checkbox: true
        }, {
            field: 'objectId',
            visible: false
        }, {
            title: getLanguageValue("No."),
            formatter: function(value, row, index) {
                return index + 1;
            }
        }, {
            field: 'markerNumber',
            title: getLanguageValue("markerNumber"),
            width: '20%'
        }, {
            field: 'newMarkerType',
            title: getLanguageValue("Current_test_pile_type"),
            width: '40%'
        }, {
            field: 'oldMarkerType',
            title: getLanguageValue("Previous_test_pile_type"),
            width: '40%'
        }]
    });
}

/**
 * @desc 将原测试桩数据与更改后的测试桩数据整合
 * @param {array} oldArr    原测试桩类型数据
 * @param {array} newArr    更改后的测试桩数据整
 * @returns {array}
 */
function concat(oldArr, newArr) {
    var newDataArr = [];
    for (var i = 0; i < oldArr.length; i++) {
        if (oldArr[i].objectId == newArr[i].objectId) {
            var obj = new Object();
            obj.objectId = oldArr[i].objectId;
            obj.markerNumber = oldArr[i].markerNumber;
            obj.newMarkerType = convertMarkerType("isDrivepipe", newArr[i].isDrivepipe);
            obj.newMarkerType += convertMarkerType("isCrossParallelArea", newArr[i].isCrossParallelArea);
            obj.newMarkerType += convertMarkerType("isInsulatedJoint", newArr[i].isInsulatedJoint);
            obj.newMarkerType += convertMarkerType("isRecitifierNearest", newArr[i].isRecitifierNearest);
            obj.newMarkerType += convertMarkerType("isDrainageAnode", newArr[i].isDrainageAnode);
            obj.oldMarkerType = convertMarkerType("isDrivepipe", oldArr[i].isDrivepipe);
            obj.oldMarkerType += convertMarkerType("isCrossParallelArea", oldArr[i].isCrossParallelArea);
            obj.oldMarkerType += convertMarkerType("isInsulatedJoint", oldArr[i].isInsulatedJoint);
            obj.oldMarkerType += convertMarkerType("isRecitifierNearest", oldArr[i].isRecitifierNearest);
            obj.oldMarkerType += convertMarkerType("isDrainageAnode", oldArr[i].isDrainageAnode);
            if (obj.newMarkerType.lastIndexOf("，") > 0) {
                obj.newMarkerType = obj.newMarkerType.substring(0, obj.newMarkerType.lastIndexOf("，"));
            }
            if (obj.oldMarkerType.lastIndexOf("，") > 0) {
                obj.oldMarkerType = obj.oldMarkerType.substring(0, obj.oldMarkerType.lastIndexOf("，"));
            }
            newDataArr.push(obj);
        }
    }
    return newDataArr;
}

/**
 * @desc 获取桩类型中文
 * @param {string} markerType 
 * @param {int} typeValue  1选中0未选中
 */
function convertMarkerType(markerType, typeValue) {
    if (typeValue == 1) {
        switch (markerType) {
            case "isDrivepipe": // isM4
                // return "套管测试桩，";
                return getLanguageValue("Casing");
            case "isCrossParallelArea": // isM5
                // return "交叉平行，";
                return getLanguageValue("Parallel");
            case "isInsulatedJoint": // isM8
                // return "绝缘接头桩，";
                 return getLanguageValue("Insulating");
            case "isRecitifierNearest": // isM9
                // return "汇流桩，";
                 return getLanguageValue("Drain");
            case "isDrainageAnode": // isM10
                // return "排流桩";
                 return getLanguageValue("Drainage");
            default:
                return "";
        }
    }
    return "";
}
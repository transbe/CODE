/**  
 * @file
 * @author: lujingrui
 * @desc: 管道选择的测试桩列表
 * @date: 2017-03-03 
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:30:38
 */

$(function() {
    loadTable();
});

/**
 * @desc 加载测试桩table
 */
function loadTable() {
    changePageStyle("../../..");
    var token = lsObj.getLocalStorage("token");
    var pipeId = getParameter("pipeId");
    var chartId = getParameter("chartId");
    $('#select_marker').bootstrapTable({
        url: "/cloudlink-corrosionengineer/cpsegment/getPipeRelationMarkerBo?token=" + token,
        method: 'get', //请求方式（*）
        sidePagination: "client", 
        queryParams: function(params) {
            params.pipeId = pipeId;
            params.chartId = chartId;
            return params;
        },
        columns: [
            [
                {
                    field: 'sequence',
                    title: getLanguageValue("No."),
                    rowspan: 2
                },
                {
                    field: 'markerNumber',
                    title: getLanguageValue("TP_Number"),
                    sortable: true,
                    rowspan: 2,
                    width:"10%"
                },
                {
                    field: 'pipelineName',
                    title: getLanguageValue("Pipeline"),
                    sortable: true,
                    rowspan: 2,
                    width:"9%"
                },
                {
                    field: 'mileage',
                    title: getLanguageValue("Distance")+'<br/>(km)',
                    sortable: true,
                    rowspan: 2,
                    width:"9%"
                }, {
                    title: getLanguageValue("Types_TP"),
                    colspan: 6,
                    width:"54%"
                }, {
                    field: 'Operation',
                    title: getLanguageValue("Action"),
                    rowspan: 2,
                    width:"9%",
                    formatter: function(value, row, index) {
                        var res = "<a href='#'><i class='glyphicon glyphicon-eye-open'  title='"+getLanguageValue("View")+"' onclick=\"viewMarker('" + row.objectId + "')\"></i></a>";
                        return res;
                    }
                }
            ],
             [
                {

                    field: 'isDrivepipe',
                    title: getLanguageValue("Casing"),
                    sortable: true,
                    width:"9%",
                    formatter: function(value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify'  title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {

                    field: 'isCrossParallelArea',
                    title: getLanguageValue("Parallel_Crossing"),
                    sortable: true,
                    width:"9%",
                    formatter: function(value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {

                    field: 'isInsulatedJoint',
                    title: getLanguageValue("Insulating_Joint"),
                    sortable: true,
                    width:"9%",
                    formatter: function(value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {

                    field: 'isDrainageAnode',
                    title: getLanguageValue("Drainage"),
                    sortable: true,
                    width:"9%",
                    formatter: function(value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {

                    field: 'isDirectionalDrilling',
                    title: getLanguageValue("HDD"),
                    sortable: true,
                    width:"9%",
                    formatter: function(value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                },
                {

                    field: 'isRecitifierNearest',
                    title: getLanguageValue("Drain_Point"),
                    sortable: true,
                    width:"9%",
                    formatter: function(value) {
                        if (value != null && value != "") {
                            return "<span class='Maymodify' title='" + value +
                                "'>&#10004;</span>";
                        } else {
                            return "<span class='Maymodify' title='0'>" + "-" + "</span>";
                        }
                    }
                }
            ]
        ],
        onLoadSuccess: function(rows) {
        },
        onDblClickRow: function(row) {
            viewMarker(row.objectId);
        },
        responseHandler: function(res) {
            if (res.success == 1) {
                var data = res.result;
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].sequence = i + 1;
                    }
                } else {
                    data = [];
                }
                return data;
            } else {
                layer.alert(getLanguageValue("Error_Info")+ res.msg, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        },
    });
}

/**
 * @desc 测试桩查看
 * @param {string} objectid 测试桩id
 */
function viewMarker(objectid) {
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: getLanguageValue("View_test_pile"),
        area: ['950px', '600px'],
        btn: [getLanguageValue("cancle")],
        skin: 'self-iframe',
        no: function(index, layero) {
            var ab = layero.find('iframe')[0].contentWindow;
            ab.viewData();
        },
        btn2: function(index, layero) {},
        content: rootPath + "/src/html/marker/view_marker.html?objectId=" + objectid
    })
}
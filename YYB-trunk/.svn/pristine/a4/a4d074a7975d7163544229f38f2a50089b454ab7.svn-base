// var colors = ['#5793f3', '#d14a61', '#675bba'];
var colors = ['#5793f3'];
//echarts图表配置参数
option = {
    title: {
        text: getLanguageValue("js.param.graphHead"),
        x: 'center'
    },
    color: colors,
    tooltip: {
        trigger: 'none',
        axisPointer: {
            type: 'cross'
        }
    },
    grid: {
        top: 70,
        bottom: 50,
        left: 50,
        right:0
    },
    xAxis: {
        name: getLanguageValue("js.param.x"),
        nameLocation: 'middle',
        nameGap: 20,
        type: 'category',
        axisTick: {
            alignWithLabel: true
        },
        axisLine: {
            onZero: false,
        },
        axisPointer: {
            label: {
                formatter: function (params) {
                    return params.value +
                        (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                }
            }
        },
        axisLabel:{
            interval:1
        },
        data: []
    },
    yAxis: {
        name: getLanguageValue("js.param.y"),
        type: 'value'
    }, grid:{
        x:80,
        y:50,
        x2:0,
        y2:40
    },
    series: {
        type: 'line',
        smooth: true,
        data: []
    }
};
var myChart = echarts.init(document.getElementById('echart')); //实例化一个echart对象
var xAxisData = []; //echart图表X轴数据
var yAxisData = []; //echart图表Y轴数据
/**
 * @desc 表单校验
 */
$('#calculation').bootstrapValidator({
    fields: {
        x: {
            validators: {
                notEmpty: {},
                stringLength: {
                    min: 1
                },
            }
        },
        Re: {
            validators: {
                notEmpty: {},
                numeric:{},
                stringLength: {
                    min: 1
                },
            }
        },
        rayI: {
            validators: {
                notEmpty: {},
                numeric:{},
                stringLength: {
                    min: 1
                },
            }
        },
        rho: {
            validators: {
                notEmpty: {},
                numeric:{},
                stringLength: {
                    min: 1
                },
            }
        }
    }
});
$(function () {
    $(".column-style").css("height", $(Window).height() - 5);
    myChart.setOption(option);
        //绑定事件
        // console.log("进入绑定");
        $(".left").click(function () {
            $(".left").hide();
        });
});

function setR() {
    var num1 = $("#Re").val();
    var num2 = $("#rho").val();
    if (num1 != null && num1 != "" && num2 != null && num2 != "") {
        $("#re").val((num2 / (2 * Math.PI * num1)).toFixed(2));
    }
}
/**
 * @desc 选择计算
 */
function towerLinkEarthDistance() {
    xAxisData = [];
    yAxisData = [];
    // var $x = $("#x").val();
    $rho = $("#rho").val();
    $Re = $("#Re").val();
    $rayI = $("#rayI").val();
    var x = "";
    for(var i=0;i<51;i++){
        if(i==50){
            x = x +i;
        }else{
            x = x +i + ",";
        }
    }
    var isValidForm = $('#calculation').data('bootstrapValidator');
    isValidForm.validate();
    var params = {
        "x": x,
        "rho": $rho,
        "Re": $Re,
        "rayI": $rayI
    };
    if (isValidForm.isValid()) {
        $.ajax({
            url: '/cloudlink-corrosionengineer/cpTool/towerLinkEarthDistance?token=' + lsObj.getLocalStorage('token'),
            dataType: "json",
            method: 'get',
            async: true,
            data: params,
            success: function (res) {
                if (res.success == 1) {
                    var data = res.calculateResult;
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            xAxisData.push(parseInt(data[i].x));
                            yAxisData.push(data[i].value);
                        }
                    }
                    option.xAxis.data = xAxisData;
                    option.series.data = yAxisData;
                    myChart.setOption(option, true);
                } else {
                    parent.layer.alert(res.msg, {
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
        return false
    }
}
/**
 * @desc 重置输入参数表单
 */
$("#clearBtn").click(function () {
    // var obj = $("input");
    // $.each(obj, function (i, item) {
    //     $(item).val(null);
    // });
    $("#rho").val(null);
    $("#Re").val(null);
    $("#re").val(null);
    $("#rayI").val(null);
    option.xAxis.data = [];
    option.series.data = [];
    myChart.setOption(option, true);
});
//注册点击事件：距接地体边缘距离-X是否输入一个等差数列
// $("#x").click(function() {
//     var index = layer.confirm("输入一个等差数列", {
//         title: "提示",
//         skin: 'self', //按钮
//     }, function () {
//         layer.close(index);
//         $(".arithmetic_progression").show();
//     }, function(){
//         $("#x").focus(); 
//     });
// });
function showArithmetic() {
    $(".arithmetic_progression").fadeToggle();
}
/**
 * @desc 生成等差数列
 */
function generateArithmeticProgression() {
    var firstNumber = $("#firstNumber").val() != "" ? Number($("#firstNumber").val()) : "";
    var interval = $("#interval").val() != "" ? Number($("#interval").val()) : "";
    var total = $("#total").val() != "" ? Number($("#total").val()) : "";
    if (firstNumber != "" && interval != "" && total != "") {
        var xArr = [];
        for (var i = 0; i < total; i++) {
            xArr.push((interval * i + firstNumber).toFixed(2));
        }
        var xStr = xArr.join();
        //console.log(xStr);
        $("#x").val(xStr);
        $(".arithmetic_progression").hide();
    }
}
// var colors = ['#5793f3', '#d14a61', '#675bba'];
var colors = ['#5793f3', '#d14a61', '#675bba'];
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
        left: 33
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
            interval:""
        },
        data: []
    },
    yAxis: {
        name: getLanguageValue("js.param.y"),
        type: 'value'
    },
    grid: {
        x: 80,
        y: 50,
        x2: 0,
        y2: 40
    },
    series: {
        
        type: 'line',
        smooth: true,
        data: []
    }
};
var myChart = echarts.init(document.getElementById('echart'));
var xAxisData = [];
var yAxisData = [];
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
        Lanode: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        H: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        rho: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        outputI: {
            validators: {
                notEmpty: {},
                numeric: {},
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
});

function setL() {
    var num1 = $("#Lanode").val();
    var num2 = $("#H").val();
    if (num1 != null && num1 != "" && num2 != null && num2 != "") {
        $("#L").val(Number(num1) + Number(num2));
    }
}
/**
 * @desc 选择计算
 */
function selectAddressCalculate() {
    xAxisData = [];
    yAxisData = [];
    var $x = Number($("#x").val());
    var x = "";
    if($x<150){
        option.xAxis.axisLabel.interval = 1;
    }else{
        option.xAxis.axisLabel.interval = 4;
    }
    for(var i=0;i<$x;i++){
        if(i == $x-1){
            x = x + i;
        }else{
            x = x + i + ",";
        }
    }
    $Lanode = $("#Lanode").val();
    $H = $("#H").val();
    $L = $("#L").val();
    $rho = $("#rho").val();
    $outputI = $("#outputI").val();


    var isValidForm = $('#calculation').data('bootstrapValidator');
    isValidForm.validate();
    var params = {
        "x": x,
        "Lanode": $Lanode,
        "H": $H,
        "L": $L,
        "rho": $rho,
        "outputI": $outputI
    };
    if (isValidForm.isValid()) {
        $.ajax({
            url: '/cloudlink-corrosionengineer/cpTool/selectAddressCalculate?token=' + lsObj.getLocalStorage('token'),
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
 * @desc 重置form表单
 */
$("#clearBtn").click(function () {
    var obj = $("input");
    $.each(obj, function (i, item) {
        $(item).val(null);
    });
    option.xAxis.data = [];
    option.series.data = [];
    myChart.setOption(option, true);
});
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
        console.log(interval)
        var xArr = [];
        for (var i = 0; i < total; i++) {
            xArr.push((interval * i + firstNumber).toFixed(2));

        }
        var xStr = xArr.join();
        $("#x").val(xStr);
        $(".arithmetic_progression").hide();
    }
}
//更换原理图
function changeBackgroudURL() {
    //更换背景图片
    //暂时处理 针对不同的主题 此图片不同 需要重新定方案
   
    var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
    if (language == "en") {
        // console.log($("#img-2"))
        // $("#img-2").css("src", "url('src/images/toolkit/u36986_en.png') no-repeat center right");
        // console.log($(".img-2").attr('src'))
        $(".img-2").attr('src','../../images/toolkit/u36986_en.png'); 
        // console.log($(".img-2").attr('src'))
    }
}


(function () {
    changeBackgroudURL();
   
})()
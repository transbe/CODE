$(function() {
    changePageStyle("../..");

    $("#selectR1Way").on("click", "input[type=radio]", function() {
        if ($(this).val() == 2) {
            $(".way1").hide();
            $(".way2").show();
        } else {
            $(".way2").hide();
            $(".way1").show()
        }
        $("#C1").val(null);
        $("#C2").val(null);

        $("#L1").val(null);
        $("#D").val(null);

        $("#R1").val(null);
        $("#E1").val(null);
    });

})


/**
 * @desc 求E1
 */
function setE1() {
    var C1 = $("#C1").val();
    var C2 = $("#C2").val();
    var L1 = $("#L1").val();
    var D = $("#D").val();
    var T = $("#t").val();
    var R0 = $("#R0").val();
    var R1 = $("#R1").val();
    if (!isNull(C1) && !isNull(C2) && !isNull(R0)) {
        $("#R1").val((C2 / 2 * Math.PI * (360 - C1 / (2 * Math.PI * R0) * 360)).toFixed(2));
    }
    if (!isNull(L1) && !isNull(D)) {
        $("#R1").val((((L1 * L1) / 4 - D * D) / (2 * D)).toFixed(2));
    }
    R1 = $("#R1").val();
    if (!isNull(T) && !isNull(R0) && !isNull(R1)) {
        $("#E1").val((1 / 2 * T * (1 / R0 - 1 / R1)).toFixed(2));
    }
}

/**
 * @desc 求E2
 */
function setE2() {
    console.log("setE2");
    var L2 = $("#L2").val();
    var D = $("#D").val();
    var t = $("#t").val();

    var typeVal = $("#selectR1Way").find("input:checked").val();
    if (typeVal == 2) {
        D = $("#D").val();
    } else {
        D = $("#DD").val();
    }

    if (!isNull(L2) && !isNull(D)) {
        $("#R2").val((((L2 * L2) / 4 - D * D) / (2 * D)).toFixed(2));
    }
    if (!isNull(L2) && !isNull(D) && !isNull(t)) {
        var R2 = (((L2 * L2) / 4 - D * D) / (2 * D)).toFixed(2);
        $("#E2").val((-(1 / 2) * (t / R2)).toFixed(2))
    }
}

/**
 * @desc 求E3
 */
function setE3() {
    console.log("setE3");
    var d = $("#d").val();
    var L = $("#L").val();

    if (!isNull(d) && !isNull(L)) {
        $("#E3").val(((1 / 2) * (d / L) ^ 2).toFixed(2))
    }
}


/**
 * @desc 点击进行计算
 */
function calculate() {
    console.log("calculate");
    var E1 = $("#E1").val();
    var E2 = $("#E2").val();
    var E3 = $("#E3").val();
    var isValidForm = $('#calculation').data('bootstrapValidator');
    isValidForm.validate();
    if (isValidForm.isValid()) {
        if (!isNull(E1) && !isNull(E2) && !isNull(E3)) {
            $("#Ei").val(((E1 ^ 2 - E1 * (E2 + E3) + (E2 + E3) ^ 2) ^ (1 / 2)).toFixed(2));
            $("#E0").val(((E1 ^ 2 + E1 * (-E2 + E3) + (-E2 + E3) ^ 2) ^ (1 / 2)).toFixed(2));
        }
        $(".result").show();
    } else {
        return false
    }
}

/**
 * @desc 重置输入参数表单
 */
$("#clearBtn").click(function() {
    $("#t").val(null);
    $("#R0").val(null);

    $("#C1").val(null);
    $("#C2").val(null);

    $("#L1").val(null);
    $("#D").val(null);

    $("#R1").val(null);
    $("#E1").val(null);

    $("#L2").val(null);
    $("#DD").val(null);

    $("#R2").val(null);
    $("#E2").val(null);

    $("#d").val(null);
    $("#L").val(null);
    $("#E3").val(null);

    $("#Ei").val(null);
    $("#E0").val(null);

    $("#conclusion").html("");
    var isValidForm = $('#calculation').data('bootstrapValidator');
    isValidForm.resetForm();
});

/**
 * @desc 表单校验
 */
$('#calculation').bootstrapValidator({
    fields: {
        t: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        R0: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        C1: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        C2: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        L1: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        D: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        L2: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        DD: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        d: {
            validators: {
                notEmpty: {},
                numeric: {},
                stringLength: {
                    min: 1
                },
            }
        },
        L: {
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
/**
 * @file
 * @author lizhenzhen
 * @desc bootstrapValidator扩展自定义验证规则
 * @date 2017-05-22
 * @last modified by lizhenzhen
 * @last modified time 2017-06-14 14:23:29
 */


(function($) {
    /*
     * 重写BootstrapValidator的validateField方法
     * 
     * 重写的原因：
     *      该插件如果给它的某一个验证项不设置验证notEmpty,同时不对插件原本的实时验证做出更改（意思是开启实时验证），当鼠标只要聚焦在改验证项上时，即开启验证,当把里面的内容删除完时，还是开启验证的，会有个验证通过的“对号”图标。
     * 解决的问题：
     *      解决了，不设置验证notEmpty，同时鼠标聚焦、失焦时数据为空时的校验
     * 
     */

    var bvConstructor = $.fn.bootstrapValidator.Constructor;
    bvConstructor.prototype.validateField = function(field) {
        var fields = $([]);
        switch (typeof field) {
            case 'object':
                fields = field;
                field = field.attr('data-bv-field');
                break;
            case 'string':
                fields = this.getFieldElements(field);
                break;
            default:
                break;
        }
        var name = field;
        var testNotEmpty = this.options.fields[name].validators.notEmpty;
        var inputType = $(fields).prop("type");
        var valTest = $(fields).val();
        var testStringLength = this.options.fields[name].validators.stringLength;
        if (testStringLength != undefined) {
            var testStringLengthMax = this.options.fields[name].validators.stringLength.max;
            var testStringLengthMin = this.options.fields[name].validators.stringLength.min;
            var nodeType = fields[0].nodeName;
            if (testNotEmpty == undefined && nodeType == "TEXTAREA" && testStringLengthMin == undefined && (valTest == "" || valTest == null || valTest == undefined)) {
                this.options.fields[field].enabled = false;
                return this;
            }
        }
        if (testNotEmpty == undefined && inputType == "text" && (valTest == "" || valTest == null || valTest == undefined)) {
            // console.log("没有非空验证");
            this.options.fields[field].enabled = false;
        } else {
            // console.log("有非空验证");
            this.options.fields[field].enabled = true;
        }

        if (fields.length === 0 || (this.options.fields[field] && this.options.fields[field].enabled === false)) {
            return this;
        }

        var that = this,
            type = fields.attr('type'),
            total = ('radio' === type || 'checkbox' === type) ? 1 : fields.length,
            updateAll = ('radio' === type || 'checkbox' === type),
            validators = this.options.fields[field].validators,
            verbose = this.options.fields[field].verbose === 'true' || this.options.fields[field].verbose === true || this.options.verbose === 'true' || this.options.verbose === true,
            validatorName,
            validateResult;

        for (var i = 0; i < total; i++) {
            var $field = fields.eq(i);
            if (this._isExcluded($field)) {
                continue;
            }

            var stop = false;
            for (validatorName in validators) {
                if ($field.data('bv.dfs.' + validatorName)) {
                    $field.data('bv.dfs.' + validatorName).reject();
                }
                if (stop) {
                    break;
                }

                // Don't validate field if it is already done
                var result = $field.data('bv.result.' + validatorName);
                if (result === this.STATUS_VALID || result === this.STATUS_INVALID) {
                    this._onFieldValidated($field, validatorName);
                    continue;
                } else if (validators[validatorName].enabled === false) {
                    this.updateStatus(updateAll ? field : $field, this.STATUS_VALID, validatorName);
                    continue;
                }

                $field.data('bv.result.' + validatorName, this.STATUS_VALIDATING);
                validateResult = $.fn.bootstrapValidator.validators[validatorName].validate(this, $field, validators[validatorName]);

                // validateResult can be a $.Deferred object ...
                if ('object' === typeof validateResult && validateResult.resolve) {
                    this.updateStatus(updateAll ? field : $field, this.STATUS_VALIDATING, validatorName);
                    $field.data('bv.dfs.' + validatorName, validateResult);

                    validateResult.done(function($f, v, response) {
                        // v is validator name
                        $f.removeData('bv.dfs.' + v).data('bv.response.' + v, response);
                        if (response.message) {
                            that.updateMessage($f, v, response.message);
                        }

                        that.updateStatus(updateAll ? $f.attr('data-bv-field') : $f, response.valid ? that.STATUS_VALID : that.STATUS_INVALID, v);

                        if (response.valid && that._submitIfValid === true) {
                            // If a remote validator returns true and the form is ready to submit, then do it
                            that._submit();
                        } else if (!response.valid && !verbose) {
                            stop = true;
                        }
                    });
                }
                // ... or object { valid: true/false, message: 'dynamic message' }
                else if ('object' === typeof validateResult && validateResult.valid !== undefined && validateResult.message !== undefined) {
                    $field.data('bv.response.' + validatorName, validateResult);
                    this.updateMessage(updateAll ? field : $field, validatorName, validateResult.message);
                    this.updateStatus(updateAll ? field : $field, validateResult.valid ? this.STATUS_VALID : this.STATUS_INVALID, validatorName);
                    if (!validateResult.valid && !verbose) {
                        break;
                    }
                }
                // ... or a boolean value
                else if ('boolean' === typeof validateResult) {
                    $field.data('bv.response.' + validatorName, validateResult);
                    this.updateStatus(updateAll ? field : $field, validateResult ? this.STATUS_VALID : this.STATUS_INVALID, validatorName);
                    if (!validateResult && !verbose) {
                        break;
                    }
                }
            }
        }

        return this;
    }
}(window.jQuery));;

(function($) {
    $.fn.bootstrapValidator.i18n.coordinates = $.extend($.fn.bootstrapValidator.i18n.coordinates || {}, {
        'default': 'Please enter the coordinates of the correct format', // 默认
    });

    $.fn.bootstrapValidator.validators.coordinates = {
        /*
         *  坐标轴的判断
         * @param {BootstrapValidator} validator Validate plugin instance
         * @param {jQuery} $field Field element
         * @param {Object} [options]
         * @returns {Boolean}
         */

        validate: function(validator, $field, options) {
            var value = $field.val();
            return /^[\-\+]?[0-9]+.?[0-9]*$/.test(value);
        }
    };
}(window.jQuery));;

(function($) {
    $.fn.bootstrapValidator.i18n.mobilePhone = $.extend($.fn.bootstrapValidator.i18n.mobilePhone || {}, {
        'default': 'Please enter a valid cell phone number', // 默认
    });

    $.fn.bootstrapValidator.validators.mobilePhone = {
        /*
         *  手机号码的判断
         * @param {BootstrapValidator} validator Validate plugin instance
         * @param {jQuery} $field Field element
         * @param {Object} [options]
         * @returns {Boolean}
         */

        validate: function(validator, $field, options) {
            var value = $field.val();
            return /^1\d{10}$/.test(value);
        }
    };
}(window.jQuery));;

// (function($) {
//     $.fn.bootstrapValidator.i18n.mobileOrPhone = $.extend($.fn.bootstrapValidator.i18n.mobileOrPhone || {}, {
//         'default': 'Please enter a valid cell phone number', // 默认
//     });

//     $.fn.bootstrapValidator.validators.mobileOrPhone = {
//         /*
//          *  手机号码的判断
//          * @param {BootstrapValidator} validator Validate plugin instance
//          * @param {jQuery} $field Field element
//          * @param {Object} [options]
//          * @returns {Boolean}
//          */

//         validate: function(validator, $field, options) {
//             var value = $field.val();
//             return /(^(\/d\{3,4}-)?\/d\{7,8})$|(13[0-9]{9})/.test(value);
//         }
//     };
// }(window.jQuery));;
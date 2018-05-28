 //重载当前页面后，语言下拉框的选择
       // console.log(lsObj.getLocalStorage('i18nLanguage'));

        $(document).ready(function () {
            
            var language = localStge.getLocalStorage('i18nLanguage');
            if (language == "" || language == undefined || language == null) {
                language = 'zh';
            }
            console.log(language);
            // localStge.setLocalStorage('i18nLanguage', language);
            //加载页面
            try {
               $("#languageSelect").find("option[value='" + language + "']").attr("selected", true);
            } catch (e) {
                console.log(e);
            }

        });
        //切换语言
        $("#languageSelect").change(function () {
            //语言选择
            var languageSelect = $("#languageSelect").val();
            localStge.setLocalStorage('i18nLanguage', languageSelect);
            //加载页面
            document.location.reload();
        });
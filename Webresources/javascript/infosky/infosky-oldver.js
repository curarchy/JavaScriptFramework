/**************************************************************
* infosky.core
*---------------------------------------------------------------------------------------
* Copyright InfoSky Corporation. All rights reserved.
* Author: Chenhy(chenhy@infosky.com.cn) 
* Create Date: 2012-01-20
***************************************************************/
(function ($) {
    $.extend({ InfoSky: function () { } });
    $.fn.extend({});
    $.extend($.InfoSky, {
        EncodeUrl: function (str) { return escape(str).replace(/\*/g, "%2A").replace(/\+/g, "%2B").replace(/-/g, "%2D").replace(/\./g, "%2E").replace(/\//g, "%2F").replace(/@/g, "%40").replace(/_/g, "%5F"); },
        DecodeUrl: function (str) { return unescape(str); },
        EncodeHtml: function (str) { return str.replace(/</g, "%3C").replace(/>/g, "%3E"); },
        EncodeOriHtml: function (str) { return str.replace(/</g, "&lt;").replace(/>/g, "&gt;"); },
        RemoveSpCharacter: function (str) {
            if (!str) return "";
            return str.replace(/\//g, "").replace(/%/g, "").replace(/\?/g, "").replace(/</g, "").replace(/>/g, "").replace(/\*/g, "").replace(/\\/g, "").replace(/"/g, "").replace(/#/g, "").replace(/\|/g, "").replace(/&/g, "").replace(/\./g, "").replace(/:/g, "").replace(/\+/g, "");
        },
        BuildUrl: function (name) { return Environment[name]; },
        BuildTimeStampUrl: function (name) {
            var url = $.InfoSky.BuildUrl(name);
            url += ("?stamp=" + Math.random());
            return url;
        },
        StopBubble: function (e) {
            if (e && e.stopPropagation)
                e.stopProgation();
            else
                window.event.cancelBubble = true;
        },
        HrefTo: function (url, newwin) {
            if (newwin) 
                open(url);
            else 
                location.href = url;
        },
        TrimLeft: function (str) { return str == null ? "" : str.toString().replace(/^\s+/, ""); },
        TrimRight: function (str) { return str == null ? "" : str.toString().replace(/\s+$/, ""); },
        Trim: function (v) { return v == null ? "" : v.replace(/^\s+|\s+$/g, "") },
        PadLeft: function (str, c, count) { while (str.length < count) { str = c + str; } return str; },
        PadRight: function (str, c, count) { while (str.length < count) { str += c; } return str; },
        IsNullOrEmpty: function (str) { return !(typeof (str) === "string" && str.replace(/^\s+|\s+$/g, "").length != 0); },
        // helper:
        // $.InfoSky.StringFormat("{0} xxx {1}","a","b")  =>>  "a xxx b"
        // $.InfoSky.StringFormat("{0} xxx {1}",["a","b"]) =>> "a xxx b"
        // $.InfoSky.StringFormat("{{0}} xxx {{1}}",{"0":"hello","1":"world"}) =>> "hello xxx world"
        StringFormat: function (source, params) {
            if (arguments.length == 1)
                return function () {
                    var args = $.makeArray(arguments);
                    args.unshift(source);
                    return $.InfoSky.StringFormat.apply(this, args);
                };
            if (arguments.length == 2 && typeof (arguments[1]) == "object" && arguments[1].constructor != Array) {
                var obj = arguments[1];
                var beginchar = "{{";
                var endchar = "}}";
                return source.replace(new RegExp(beginchar + "([^\\[\\]]*?)" + endchar, "igm"), function ($, $1) {
                    return obj[$1] ? obj[$1] : $;
                });
            }
            if (arguments.length > 2 && (params || "").constructor != Array) { params = $.makeArray(arguments).slice(1); }
            if ((params || "").constructor != Array) { params = [params]; }
            $.each(params || "", function (i, n) { source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n); });
            return source;
        },
        IsNumeric: function (obj) { return !isNaN(parseFloat(obj)) && isFinite(obj); },
        KeyCode: { Tab: 9, Enter: 13, A: 65, Z: 90, Shift_A: 97, Shift_Z: 122 },
        Cookie: {
            get: function (name) {
                var cookieName = encodeURIComponent(name) + "=",
                cookieStart = document.cookie.indexOf(cookieName),
                cookieValue = null;
                if (cookieStart > -1) {
                    var cookieEnd = document.cookie.indexOf(";", cookieStart);
                    if (cookieEnd == -1) {
                        cookieEnd = document.cookie.length;
                    }
                    cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
                }
                return cookieValue;
            },
            set: function (name, value, expires, path, domain, secure) {
                var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
                if (expires instanceof Date)
                    cookieText += "; expires=" + expires.toGMTString();
                if (path)
                    cookieText += "; path=" + path;
                if (domain)
                    cookieText += "; domain=" + domain;
                if (secure)
                    cookieText += "; secure";
                document.cookie = cookieText;
            },
            unset: function () { }
        },
        Unique: function (arr) {
            var hash = {}, result = [];
            for (var i = 0, l = arr.length; i < l; ++i) {
                if (!hash.hasOwnProperty(arr[i])) {
                    hash[arr[i]] = true;
                    result.push(arr[i]);
                }
            }
            return result;
        },
        BuildResource: function (key) {
            if (typeof clientmessage != "undefined" && clientmessage && clientmessage[key])
                return decodeURIComponent(clientmessage[key].replace(/\+/g, " "));
            return "";
        },
        //根据id取数据，返回对象
        //obj：对象
        //params：数组、单个或多个string，控件id
        BuildJsonDataByIDs: function (obj) {
            obj = obj || {};
            var ids = [];
            if (arguments.length > 2)
                ids = $.makeArray(arguments).slice(1);
            else if (arguments.length == 2) {
                if (typeof (arguments[1]) == "object" && arguments[1].constructor == Array)
                    ids = arguments[1];
                else
                    ids = [arguments[1]];
            }
            $.each(ids, function (i, n) {
                var item = $("#" + n);
                if (item.is("[type=checkbox]")) {
                    obj[n] = item.is(":checked");
                }
                else {
                    var temp = $.trim($("#" + n).val()) || $("#" + n).attr("dftvalue");
                    if (temp !== undefined) {
                        obj[n] = temp;
                    }
                    else if (temp === undefined && $("#" + n).attr("sendnull") !== "true") {
                        obj[n] = "";
                    }
                }
            });
            return obj;
        },
        //根据name取数据，返回数据
        //area：区域（便于去掉克隆原本）
        //params：数组、单个或多个string，控件name
        BuildJsonArrayByNames: function (area) {
            var obj = {};
            var result = [];
            var names = [];
            if (arguments.length > 2)
                names = $.makeArray(arguments).slice(1);
            else if (arguments.length == 2) {
                if (typeof (arguments[1]) == "object" && arguments[1].constructor == Array)
                    names = arguments[1];
                else
                    names = [arguments[1]];
            }
            $.each($(area).find("[name=" + names[0] + "\]"), function (index) {
                $.each(names, function (i, n) {
                    var temp = $.trim($($(area).find("[name=" + n + "\]")[index]).val() || $($(area).find("[name=" + n + "\]")[index]).attr("dftvalue"));
                    if (temp !== undefined) {
                        obj[n] = temp;
                    }
                    else if (temp === undefined && $($(area).find("[name=" + n + "\]")[index]).attr("sendnull") !== "true") {
                        obj[n] = "";
                    }
                });
                result.push(obj);
                obj = {};
            });
            return result;
        }
    });
})(jQuery);

window.usingNamespace = function (a) {
    var ro = window;
    if (!(typeof (a) === "string" && a.length != 0)) { return ro; }
    var co = ro;
    var nsp = a.split(".");
    for (var i = 0; i < nsp.length; i++) {
        var cp = nsp[i];
        if (!ro[cp]) { ro[cp] = {}; };
        co = ro = ro[cp];
    };
    return co;
};

/**************************************************************
* infosky.ui
*---------------------------------------------------------------------------------------
* Copyright InfoSky Corporation. All rights reserved.
* Author: Chenhy(chenhy@infosky.com.cn) 
* Create Date: 2012-02-14
***************************************************************/
(function ($, undefined) {
    $.widget("infosky.uiscroll", {
        options: {
            interval: 5000,
            displaycount: 5,
            animatespeed: 200,
            animatetype: "fade",
            shownum: true,
            curgroup: 1,
            animate:true
        },
        _create: function () {
            var element = this.element;
            this.options.lis = element.find("li").hide().length;
            this.options.ligroups = Math.ceil(this.options.lis / this.options.displaycount);
            if (this.options.shownum) { this._initnumbers(); }
            element.find("li:lt(" + (this.options.displaycount) + ")").show();
            if(this.options.animate){
                this.startanimate();
            }
        },
        _initnumbers: function () {
            var element = this.element;
            var slidespan = "";
            for (var i = 0; i < this.options.ligroups; i++) {
                slidespan += ("<span class='" + (i == 0 ? "curr" : "") + "'>" + (i + 1) + "</span>");
            }
            slidespan = "<div class='slidediv'>" + slidespan + "</div>";
            element.after(slidespan);
            element.next().find("span").bind("mouseover.uiscroll", function () {
                element.uiscroll("stopanimate");
                var index = $(this).prevAll().length;
                element.uiscroll("showbyindex", index);
            })
            .bind("mouseout.uiscroll", function () { element.uiscroll("startanimate"); });
        },
        hidecur: function () {
            var element = this.element;
            var start = this.options.displaycount * (this.options.curgroup - 1);
            var tohide;
            if (start == 0) { tohide = element.find("li:lt(" + this.options.displaycount + ")"); }
            else { tohide = element.find("li:gt(" + (start - 1) + ")" + ":lt(" + this.options.displaycount + ")"); }
            tohide.hide(this.options.animatetype, {}, this.options.animatespeed, function () { element.uiscroll("shownext"); }); //.promise().done(function () {
            //element.uiscroll("shownext");
            //});
        },
        showbyindex: function (index) {
            var element = this.element;
            this.options.curgroup = index + 1;
            var start = this.options.displaycount * (this.options.curgroup - 1);
            var toshow = element.find("li:gt(" + (start - 1) + ")" + ":lt(" + this.options.displaycount + ")");
            if (toshow.length == 0 || start == 0) {
                toshow = element.find("li:lt(" + this.options.displaycount + ")");
            }
            element.find("li").hide();
            toshow.show();
            element.next().find(".curr").removeClass("curr");
            element.next().find("span:eq(" + (this.options.curgroup - 1) + ")").addClass("curr");
        },
        shownext: function () {
            var element = this.element;
            var curgroup = ((this.options.curgroup + 1) > this.options.ligroups) ? 1 : (this.options.curgroup + 1);
            this.options.curgroup = curgroup;
            var start = this.options.displaycount * (curgroup - 1);
            var toshow = element.find("li:gt(" + (start - 1) + ")" + ":lt(" + this.options.displaycount + ")");
            if (toshow.length == 0 || start == 0) {
                toshow = element.find("li:lt(" + this.options.displaycount + ")");
            }
            toshow.show(this.options.animatetype, {}, this.options.animatespeed);
            element.next().find(".curr").removeClass("curr");
            element.next().find("span:eq(" + (curgroup - 1) + ")").addClass("curr");
        },
        stopanimate: function () {
            var element = this.element;
            clearInterval(this.options.intervalkey);
            element.stop(true, true);
        },
        startanimate: function () {
            var element = this.element;
            this.options.intervalkey = setInterval(function () { element.uiscroll("hidecur"); }, this.options.interval);
        },
        spanmousein: function (index) { this.stopanimate(); },
        spanmouseout: function (index) { this.startanimate(); }
    });
} (jQuery));

(function ($, undefined) {
    $.widget("infosky.uitab", {
        options:{
            cssclass:"tabcur"
        },
        _create: function () {
            var element = this.element;
            var option = this.options;
            element.find("li[tabgroup],a[tabgroup],input:radio[tabgroup]").bind("click.uitab", function () {
                var group = $(this).attr("tabgroup");
                if ($(this).is("input:radio")) {
                    $("*[tabgroup=" + group + "]").each(function(index,item){
                        $("#" + $(item).attr("tabtarget")).hide();
                    });
                    $("#" + $(this).attr("tabtarget")).show();
                }
                else {
                    if (!$(this).hasClass(option.cssclass))
                        element.find("*[tabgroup=" + group + "]").removeClass(option.cssclass);
                    $(this).addClass(option.cssclass);
                    $("*[tabgroup=" + group + "]").each(function(index,item){
                        $("#" + $(item).attr("tabtarget")).hide();
                    });
                    $("#" + $(this).attr("tabtarget")).show();
                }
            });
        }
    });
} (jQuery));

$.fn.extend({
    uisetdefaultmsg: function (isclear) {
        var classname = $(this).attr("dftclass") || "nfade";
        var msg = this.attr("dftmsg");
        if (isclear === undefined) {
            this.bind("blur.dftmsg", function () {
                if (!$(this).val().length) {
                    $(this).val(msg).addClass(classname);
                }
            })
            .bind("focus.dftmsg", function () {
                $(this).removeClass(classname);
                if ($(this).val().toUpperCase() == msg.toUpperCase()) {
                    $(this).val("");
                }
            });
            if (!$(this).val().length) {
                $(this).val(msg).addClass(classname);
            }
            if ($(this).val().toUpperCase() == msg.toUpperCase()) {
                $(this).addClass(classname);
            }
            else {
                $(this).removeClass(classname);
            }
        }
        else if (isclear === false) {
            $(this).removeClass(classname);
            if ($(this).val().toUpperCase() == msg.toUpperCase()) {
                $(this).val("");
            }
        }
        else if (isclear === true) {
            if (!$(this).val().length && !$(this).is(":focus")) {
                $(this).val(msg).addClass(classname);
            }
        }
    },
    uisetplaceholder: function (isclear) {
        var classname = $(this).attr("pldclass") || "nfade";
        var msg = this.attr("placeholder");
        if (isclear === undefined) {
            this.bind("blur.placeholder", function () {
                if (!$(this).val().length) {
                    $(this).val(msg).addClass(classname);
                }
            })
            .bind("focus.placeholder", function () {
                $(this).removeClass(classname);
                if ($(this).val().toUpperCase() == msg.toUpperCase()) {
                    $(this).val("");
                }
            });
            if (!$(this).val().length) {
                $(this).val(msg).addClass(classname);
            }
            if ($(this).val().toUpperCase() == msg.toUpperCase()) {
                $(this).addClass(classname);
            }
            else {
                $(this).removeClass(classname);
            }
        }
        else if (isclear === false) {
            $(this).removeClass(classname);
            if ($(this).val().toUpperCase() == msg.toUpperCase()) {
                $(this).val("");
            }
        }
        else if (isclear === true) {
            if (!$(this).val().length) {
                $(this).val(msg).addClass(classname);
            }
        }
    }
});

$.extend({ uirestradio: function () {
    $("input:radio").bind("focus.uireset", function () { $(this).blur(); });
},
    uiscrollto: function (param, time) {
        $("html,body").animate({ scrollTop: $.InfoSky.IsNumeric(param) ? param : param.offset().top }, /^\d*$/.test(time) ? time : 400);
    },
    uisetdefaultmsg: function (isclear) {
        $("input[dftmsg],textarea[dftmsg]").each(function (index, item) {
            $(item).uisetdefaultmsg(isclear);
        });
    },
    uisetplaceholder: function (isclear) {
        if ('placeholder' in document.createElement('input'))
            return;
        else {
            $("[placeholder]").each(function (index, item) {
                $(item).uisetplaceholder();
            });
        }
    },
    uiblink: function (item, color, oricolor) {
        $(item).queue(function (next) {
            color = color || "#FF7171";
            oricolor = oricolor || $(item).css("backgroundColor");
            $(item).animate({ backgroundColor: color }, "fast").animate({ backgroundColor: oricolor }, "fast").animate({ backgroundColor: color }, "fast").animate({ backgroundColor: oricolor }, "fast");
            next();
        }
        );
    }
}); 

(function ($) {
    $.extend({ uigallery: {} });
    $.extend($.uigallery, {
        options: {
            count: 7,
            speed: 500
        },
        init: function (option) {
            var options = $.extend({}, $.uigallery.options, option || {});
            if ($(options.items).length <= $.uigallery.options.count){
                $(options.left).hide();
                $(options.right).hide();
                return;}
            $(options.left).bind("click.uigallery", function () {$.uigallery.goleft(options);});
            $(options.right).bind("click.uigallery", function () {$.uigallery.goright(options); });
        },
        goleft: function (opt) {
            if($(opt.container).is(".moving"))
                return;
            var width = $(opt.items).first().width();
            $(opt.container).addClass("moving").append($(opt.items).first().clone());
            $(opt.container).animate({left: ("-="+ width + "px")}, opt.speed,function(){
                $(opt.items).first().remove();
                $(opt.container).animate({left: ("+="+ width + "px")},0);
                $(opt.container).removeClass("moving");
            });
        },
        goright: function (opt) {
            if($(opt.container).is(".moving"))
                return;
            var width = $(opt.items).first().width();
            $(opt.container).addClass("moving").animate({left: ("-="+ width + "px")},0);
            $(opt.container).prepend($(opt.items).last().clone());
            $(opt.container).animate({left: ("+="+ width + "px")}, opt.speed,function(){
                $(opt.items).last().remove();
                $(opt.container).removeClass("moving");
            });
        }
    });
})(jQuery);

/**************************************************************
* infosky.validator.2.0
*---------------------------------------------------------------------------------------
* Copyright InfoSky Corporation. All rights reserved.
* Author: Chenhy(chenhy@infosky.com.cn) 
* Create Date: 2011-02-20
* Revision History:
*      Date         Author               Description
*   2012-1-29    chenhy                ver 2.0  
***************************************************************/
(function ($, undefined) {
    $.widget("infosky.validator", {
        options: {
            //            errorformat: { border: false, tip: true, animate: false, container: false, position: { x: 0, y: 0, at: "bottom" }, showtxt: true },
            //            infoformat: { show: true, position: { x: 0, y: 0, at: "bottom" }, animate: false, showtxt: true },
            //            initformat: { show: true, position: { x: 0, y: 0, at: "bottom" }, showtxt: true },
            //            focusformat: { show: true, position: { x: 0, y: 0, at: "bottom" }, animate: false, showtxt: true },
            //            successformat: { show: false, position: { x: 0, y: 0, at: "bottom" }, animate: false, showtxt: true },
            //            msg: { Init: "", Focus: "", Success: "" },
            ignore: "ignore",
            //            keypress: false,
            //            capslock: false,
            //            onblur: true,
            rules: {},
            group: "default-group",
            //            ids: { errorid: "errorfor", infomationid: "infofor", initid: "initfor", focusid: "focusfor", successid: "successfor" },
            autoscroll: false,
            autofocus: false,
            tempid: 100,
            errormsg: [],
            isalert:true
        },
        _create: function () {
            var element = this.element;
            if (element.filter("." + this.options.ignore).length > 0) { return; }
            else {
                //                if (element.attr("id") == undefined || $.InfoSky.IsNullOrEmpty(element.attr("id"))) {
                //                    return;
                //                }
                $.extend(true, this.options, $.parseJSON(element.attr("validation")));
                //                this._idformat();
                //                if (this.options.initformat.show && this.options.msg["Init"].length > 0) {
                //                    this.addinit(this.options.msg["Init"]);
                //                }
                //                this._bindevent();
                if(this.options.numonly){
                    element.bind("keypress", function (event) {
                        return CKS.Common.InputOnlyNum(event);
                    });
                }
            }
        },
        validate: function () {
            var obj = this;
            var element = this.element;
            var result = true;
            var msg = "";
            $(this.options.rules).each(function (index, item) {
                var isOr = $.validator.valicheck("IsOr", item[0]);
                if (isOr && result) return false;
                else if (!isOr && !result) return true;
                else {
                    if (isOr) result = true;
                    var rule = isOr ? $.validator.rules[item[0].slice(2)] : $.validator.rules[item[0]];
                    if (rule == undefined) { return true; }
                    var resultFlag = rule.method.call(element, element.val(), item.concat().slice(1));
                    if (!resultFlag) {
                        result = false;
                        msg = obj.options.msg == undefined ? undefined : obj.options.msg[isOr ? item[0].slice(2) : item[0]];
                        msg = $.InfoSky.StringFormat(msg == undefined ? $.validator.rules[isOr ? item[0].slice(2) : item[0]].msg : msg, item.concat().slice(1));
                    }
                }
            });
            //            if (result) {
            //                this.removeerror();
            //                if (this.options.successformat.show) {
            //                    this.addsuccess(this.options.msg["Success"]);
            //                }
            //            }
            //            else { this.adderror(msg); }
            if (!result) {
                $.infosky.validator.errormsg.push({ "item": element, "msg": msg });
            }
            return result;
        },
        validategroup: function (group) {
            return group == this.options.group ? this.validate() : true;
        },
        scrollto: function () {
            $.uiscrollto(this.element);
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
    $.extend({ validator: function () { } });
    $.extend($.validator, {
        rules: {
            IsOr: { method: function (value) { return /^\|\|/.test(value); }, msg: "以||开头" },
            Required: { method: function (value) { return (value == null || value == undefined || value == "undefined") ? false : (value.length > 0); }, msg: "该字段必填" },
            NotRequired: { method: function (value) { return value.length == 0 }, msg: "该处无需填写" },
            MinLength: { method: function (value, param) { return value.length >= param[0] }, msg: "不能少于{0}位" },
            MaxLength: { method: function (value, param) { return value.length <= param[0] }, msg: "不能超过{0}位" },
            LengthRange: { method: function (value, param) { return value.length >= param[0] && value.length <= param[1] }, msg: "请输入{0}至{1}位之间" },
            Min: { method: function (value, param) { return value >= param[0] }, msg: "最小值为{0}" },
            Max: { method: function (value, param) { return value <= param[0] }, msg: "最大值为{0}" },
            Range: { method: function (value, param) { if (/^((\d+\.)?\d+)?d*$/.test(value) && value != "") { return value >= param[0] && value <= param[1] } return false; }, msg: "请输入{0}至{1}之间" },
            IsASCII: { method: function (value) { return /^[\u0021-\u007E]*$/.test(value); }, msg: "只能输入英文或半角符号" },
            IsInt: { method: function (value) { return /^\d*$/.test(value); }, msg: "请输入整数" },
            IsFloat: { method: function (value) { return /^((\d+\.)?\d+)?d*$/.test(value); }, msg: "请输入数字" },
            IsDigits: { method: function (value) { return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value); }, msg: "请输入数字" },
            IsEmail: { method: function (value) { return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/.test(value); }, msg: "email格式不正确" },
            IsCharacter: { method: function (value) { return /^([a-zA-Z])*$/.test(value); }, msg: "请输入字母" },
            IsCharacterOrInteger: { method: function (value) { return /^([A-Za-z0-9])*$/.test(value); }, msg: "请输入字母或整数" },
            EqualTo: { method: function (value, param) { return value == $(param[0]).val(); }, msg: "两次输入不一致" },
            Ajax: { method: function () { } },
            IsUrl: { method: function (value) { return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(value); }, msg: "请输入合法的网址，以http://开头" },
            IsPhone: { method: function (value) { return /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value); }, msg: "电话号码不正确，格式:区号-号码" }
        },
        appendnewrule: function (name, fun, msg) {
            $.validator.rules[name] = { method: fun, msg: msg };
        },
        initvalidator: function (area) {
            if (area !== undefined && area.length) {
                area.find("*[validation]").each(function (index, item) { $(item).validator(); });
            }
            else {
                $("*[validation]").each(function (index, item) { $(item).validator(); });
            }
        },
        removeallerror: function () {
            $(".errortips").remove();
            $(".input-error").removeClass("input-error");
        },
        removeall: function () {
            $(".form-tips").remove();
            $(".input-error").removeClass("input-error");
        },
        validate: function (group) {
            $.infosky.validator.errormsg = [];
            group = group == undefined ? "default-group" : group;
            var result = 0;
            var firsterror;
            $("*[validation]:visible").each(function (index, item) {
                if (!$(item).validator("validategroup", group)) {
                    if (result == 0) { firsterror = item; } result++;
                }
            });
            if (result > 0 && $(firsterror).validator("option").autoscroll) {
                $(firsterror).validator("scrollto");
            }

            if (result) {
                if($.infosky.validator.prototype.options.isalert){
                    var msgBase ="{0}:{1}";
                    var msg="";
                    var count = 5;
                    $($.infosky.validator.errormsg).each(function (index, item) {
                        if(index >=count)
                            return false;
                        msg += $.InfoSky.StringFormat(msgBase, item["item"].attr("tag") || "错误", item["msg"]);
                        msg += "\r\n";
                    });
                    if ($.infosky.validator.errormsg.length > count){
                        msg+="......";
                    }
                    alert(msg);
                    if($.infosky.validator.errormsg[0]["item"].length){
                        $.infosky.validator.errormsg[0]["item"].focus();
                        $.uiblink($.infosky.validator.errormsg[0]["item"],null,"#ffffff");
                    }
                }
                else{
                    var divBase = "<div class=\"vali-error\">{0}</div>";
                    var msgBase = "<span onclick=\"$.validator.addError('{2}');\"><span class=\"title\">{0}：</span><span class=\"msg\">{1}</span></span></br>";
                    var msg = "";
                    var showErrorMaxNum = 8;
                    var firstErrorId = "";
                    $($.infosky.validator.errormsg).each(function (index, item) {
                        if (index >= (showErrorMaxNum)) {
                            return false;
                        }
                        if (index == 0) { firstErrorId = item["item"].attr("id"); }
                        msg += $.InfoSky.StringFormat(msgBase, item["item"].attr("tag") || "错误", item["msg"], item["item"].attr("id"));
                    });
                    if ($.infosky.validator.errormsg.length > showErrorMaxNum) {
                        msg += $.InfoSky.StringFormat("</br><span class=\"title\">等共  {0}  条错误</span>", $.infosky.validator.errormsg.length);
                    }
                    msg = $.InfoSky.StringFormat(divBase, msg);
                    if (art.dialog.list["vali-dialog"] != null) {
                        art.dialog.list["vali-dialog"].close();
                    }
                    $.uialert({
                        content: msg,
                        id: "vali-dialog",
                        type: "failure"
                    });
                }
            }
            return result;
        },
        addError: function (id) {
            if (id === "#" || id == '') {
                return;
            }
            var element = $("#" + id);
            if (element.length) {
                $.uiscrollto(element);
            }
        },
        valicheck: function (methodName, value, param) {
            var rule = $.validator.rules[methodName];
            if (rule == undefined) { return false; }
            return rule.method.call(this, value, param);
        },
        reseterrorposition: function () {
            $("*[validation]").each(function (index, item) { $(item).validator("reseterrorposition"); });
        }
    });
} (jQuery));

/**************************************************************
* infosky.validator.method
*---------------------------------------------------------------------------------------
* Copyright InfoSky Corporation. All rights reserved.
* Author: Chenhy(chenhy@infosky.com.cn) 
* Create Date: 2012-01-29
***************************************************************/
(function () {
    $.validator.appendnewrule("IsMoney", function (value) { return /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/.test(value); }, "请输入货币格式");
    $.validator.appendnewrule("IsTime", function (value) { return /^([01]\d|2[0-3])(:[0-5]\d){0,2}$/.test(value); }, "请输入时间格式，00:00 至 23:59");
    $.validator.appendnewrule("IsAWBNo", function (value) {
        var array = value.split("-");
        if (array[0].length != 3) { return false; }
        var awbNo = array[1].replace(" ", "");
        if (awbNo.length != 8) { return false; }
        return (awbNo.substr(0, 7) % 7 == awbNo.substr(7, 1));
    }, "请输入正确的运单格式");
    $.validator.appendnewrule("IsFloat2", function (value) { return /^\d*(\d(\.\d{1,2})?)?$/.test(value); }, "请输入整数或者最多2位小数");
    $.validator.appendnewrule("IsDate", function (value) { return /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^\s{0}$))/.test(value); }, "日期格式不正确");
    $.validator.appendnewrule("RatePubItem",function(value){
        var element = this;
        var tr=$(this).closest("tr");
        var result = true;
        tr.find("input").each(function(index,item){
            if($(item).val().length)
            {result=false;
        }});
        return result;
    },"");
})(jQuery);
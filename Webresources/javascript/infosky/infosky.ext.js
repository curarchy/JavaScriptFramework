/*************************************************************
 * infosky.funnySelect
 *------------------------------------------------------------
 * Copyright InfoSky Corporation. All rights reserved.
 * Author: Chenhy(chenhy@infosky.com.cn)
 * Create Date: 2013-06-17
 ************************************************************/

(function() {
    _$ = _$ || {};
    _$.funnySelect = function(item) {
        this.item = item;
    };

    var _option = {
        displayCount: 7,
        offsetX: 25,
        offsetY: 30
    },
        _item = "<li class='{1}'><span>{0}</span></li>",
        _div = "<div class='{0}'><ul></ul></div>";

    var _init = function(input, select, option) {
        option.data = [];
        $(select).children().each(function(index, item) {
            if ($(item).is("optgroup")) {
                option.data.push({
                    nodeType: "group",
                    value: $(item).attr("label")
                });
                $(item).find("option").each(function(index, optItem) {
                    option.data.push({
                        nodeType: "option",
                        value: $(optItem).attr("value"),
                        key: $(optItem).html()
                    });
                });
            } else if ($(item).is("option")) {
                option.data.push({
                    nodeType: "option",
                    value: $(item).attr("value"),
                    key: $(item).html()
                });
            }
        });

        $(document).on("click.funnySelect", function(e) {
            if (option.popDiv) {
                if ($.contains(option.input.get(0), e.target) || option.input.get(0) === e.target) {
                    return false;
                } else {
                    _hide();
                }
            }
        });

        $(input).on("click.funnySelect", function() {
            _show(input, option, 1);
        }).on("keydown", function(e) {
            switch (e.keyCode) {
                case 9: //tab
                    return;
                case 13:
                    //enter
                    if ($("#" + option.popID + ":visible").length) {
                        _setVal(option, $("#" + option.popID).find(".selectItem").first().data("autoData"), "enter");
                        e.preventDefault();
                    }
                    return;
                case 38:
                    //↑
                    _toUp(option);
                    break;
                case 40:
                    //↓
                    _toDown(option);
                    break;
                case 33:
                    //pageUp
                    _prevPage(option);
                    break;
                case 34:
                    //pageDown
                    _nextPage(option);
                    break;
                default:
                    break;
            }
        });
    };

    var _toUp = function(option) {
        var visibles = option.popDiv.find(".funnySelectLi:visible").css({
            left: "-=" + option.offsetX,
            top: "+=" + option.offsetY
        });
        visibles.first().removeClass("liSelected");
        visibles.last().hide();
        var last = option.popDiv.find(".funnySelectLi").last();
        last.css({
            left: visibles.first().offset().left + option.offsetX,
            top: visibles.first().offset().top - option.offsetY - 2
        }).addClass("liSelected").show().detach().prependTo(option.popDiv.find("ul"));
    };

    var _toDown = function(option) {
        var visibles = option.popDiv.find(".funnySelectLi:visible").css({
            left: "+=" + option.offsetX,
            top: "-=" + option.offsetY
        });
        visibles.first().removeClass("liSelected").hide().detach().appendTo(option.popDiv.find("ul"));
        var last = visibles.last();
        visibles.last().next().css({
            left: last.offset().left - option.offsetX,
            top: last.offset().top + option.offsetY - 2
        }).show();

        option.popDiv.find(".funnySelectLi:visible").first().addClass("liSelected");
    };


    var _show = function(input, option, index) {
        var begin, end;
        if (!option.popLis) {
            option.popLis = option.popLis || [];
            option.popDiv = $(_$.stringFormat(_div, "tptDiv funnySelectDiv"));
            var ul = option.popDiv.find("ul");
            $.each(option.data, function(index, item) {
                var li = null;
                if (item.nodeType === "option") {
                    li = $(_$.stringFormat(_item, item.key, "selectItem funnySelectLi"));
                    li.data("selectData", item).hide();
                    option.popLis.push(li);
                    ul.append(li);
                    if (index === 0) {
                        li.addClass("liSelected");
                    }
                }
            });
            $("body").append(option.popDiv);
            var position = input.offset();
            var top = position.top - 2;
            var left = position.left + input.outerWidth() + 4;
            begin = 0;
            end = Math.min(option.displayCount, option.popLis.length);
            for (var i = begin; i < end; i++) {
                option.popLis[i].css({
                    "top": top + i * option.offsetY + "px",
                    "left": left - i * option.offsetX + "px"
                }).show();
            }
        } else {
            begin = 0;
            end = Math.min(option.displayCount, option.popLis.length);
            option.popDiv.find(".funnySelectLi:lt(" + end + ")").show();
        }
    };

    var _hide = function() {
        $(".funnySelectLi:visible").hide();
    };

    $.extend(_$.funnySelect, {
        init: function(input, select, option) {
            option = $.extend({}, _option, option);
            option.input = input;
            _init(input, select, option);
        }
    });
})();
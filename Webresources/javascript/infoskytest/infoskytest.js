(function() {

    test("eniverment symble", function() {
        ok(infosky === _$, "eniverment symble!");
    });

    test("string", function() {
        var str = " abcde ";
        ok(_$.trimLeft(str) === "abcde ", "trimLeft!");
        ok(_$.trimRight(str) === " abcde", "trimRight!");
        ok(_$.trim(str) === "abcde", "trim!");
        ok(_$.padLeft(str, 'a', 10) === "aaa abcde ", "padleft!");
        ok(_$.padRight(str, 'a', 10) === " abcde aaa", "padright!");
    });


    test("object-judge", function() {
        var items = ["\"\"", "'      '", "1", "null", "undefined", "0", "[]", '[""]'];
        var items2 = ["\"a\""];
        $.each(items, function(index, item) {
            ok(_$.isNullOrEmpty(eval(item)), "isNullOrEmpty" + "----" + item);
        });
        $.each(items2, function(index, item) {
            ok(!_$.isNullOrEmpty(eval(item)), "! isNullOrEmpty" + "----" + item);
        });
    });

    test("random", function() {
        for (i = 1; i < 100; i++) {
            var temp = _$.random(i);
            ok(0 <= temp && temp < i, temp);
        }
    });
})();
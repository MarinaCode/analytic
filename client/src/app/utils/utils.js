/**
 * Created by Marina on 14.11.2016.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = (function () {
    function Utils() {
    }
    Utils.checkState = function (length, c1, c2) {
        if (length > 0) {
            if (length >= c1 && length <= c2) {
                return 0;
            }
            else
                return 1;
        }
        else
            return 2;
    };
    Utils.isContain = function (data) {
        return data ? true : false;
    };
    Utils.percent = function (a, count) {
        return (100 * a / count).toPrecision(3);
    };
    Utils.arithmeticAverage = function (argument) {
        var sum = 0;
        for (var i = 0; i < argument[i]; i++) {
            return sum == 0 ? sum : (sum / argument.length);
        }
    };
    Utils.regEmail = function (e) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(e);
    };
    Utils.checkData = function (length, data) {
        return data.length > length;
    };
    return Utils;
}());
exports.Utils = Utils;

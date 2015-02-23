var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenWhile = (function (_super) {
        __extends(TokenWhile, _super);
        function TokenWhile(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenWhile;
    })(TSC.Token);
    TSC.TokenWhile = TokenWhile;
})(TSC || (TSC = {}));

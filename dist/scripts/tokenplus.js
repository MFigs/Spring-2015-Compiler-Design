var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenPlus = (function (_super) {
        __extends(TokenPlus, _super);
        function TokenPlus(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenPlus;
    })(TSC.Token);
    TSC.TokenPlus = TokenPlus;
})(TSC || (TSC = {}));

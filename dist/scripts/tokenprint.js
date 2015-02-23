var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenPrint = (function (_super) {
        __extends(TokenPrint, _super);
        function TokenPrint(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenPrint;
    })(TSC.Token);
    TSC.TokenPrint = TokenPrint;
})(TSC || (TSC = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenString = (function (_super) {
        __extends(TokenString, _super);
        function TokenString(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenString;
    })(TSC.Token);
    TSC.TokenString = TokenString;
})(TSC || (TSC = {}));

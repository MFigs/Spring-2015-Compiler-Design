var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenEOF = (function (_super) {
        __extends(TokenEOF, _super);
        function TokenEOF(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
        }
        return TokenEOF;
    })(TSC.Token);
    TSC.TokenEOF = TokenEOF;
})(TSC || (TSC = {}));

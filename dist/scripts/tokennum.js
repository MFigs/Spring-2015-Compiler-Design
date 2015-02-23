var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSC;
(function (TSC) {
    var TokenNum = (function (_super) {
        __extends(TokenNum, _super);
        function TokenNum(tokenVal, lineNum) {
            _super.call(this, tokenVal, lineNum);
            this.numericValue = parseInt(tokenVal);
        }
        return TokenNum;
    })(TSC.Token);
    TSC.TokenNum = TokenNum;
})(TSC || (TSC = {}));

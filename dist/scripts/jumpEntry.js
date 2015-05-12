var TSC;
(function (TSC) {
    var JumpEntry = (function () {
        function JumpEntry(start) {
            this.jumpVariableName = "j" + _JumpVarCounter;
            _JumpVarCounter++;
            this.distance = 0;
            this.startPosition = start;
        }
        return JumpEntry;
    })();
    TSC.JumpEntry = JumpEntry;
})(TSC || (TSC = {}));

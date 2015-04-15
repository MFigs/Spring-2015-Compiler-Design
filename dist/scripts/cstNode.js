var TSC;
(function (TSC) {
    var CSTNode = (function () {
        function CSTNode(printVal) {
            this.parent = null;
            this.children = new Array();
            this.isRoot = false;
            this.childCount = 0;
            this.printValue = "";
            this.lineNum = 0;
            this.printValue = printVal;
            this.lineNum = currentToken.lineNumber;
        }
        CSTNode.prototype.addChild = function (child) {
            child.parent = this;
            this.children.push(child);
            this.childCount++;
        };
        return CSTNode;
    })();
    TSC.CSTNode = CSTNode;
})(TSC || (TSC = {}));

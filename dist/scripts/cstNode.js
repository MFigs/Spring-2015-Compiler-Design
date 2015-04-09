var TSC;
(function (TSC) {
    var CSTNode = (function () {
        function CSTNode(printVal) {
            this.isRoot = false;
            this.childCount = 0;
            this.printValue = "";
            this.printValue = printVal;
        }
        CSTNode.prototype.addChild = function (child) {
            child.parent = this;
            this.children[this.childCount] = child;
            this.childCount++;
        };
        return CSTNode;
    })();
    TSC.CSTNode = CSTNode;
})(TSC || (TSC = {}));

module TSC {

    export class ASTNode {

        public parent: TSC.ASTNode;
        public children: Array<TSC.ASTNode>;
        public isRoot: boolean = false;
        public childCount: number = 0;
        public printValue: string = "";

        public constructor(printVal: string) {
            this.printValue = printVal;
        }

        public addChild(child: TSC.ASTNode) {

            child.parent = this;
            this.children[this.childCount] = child;
            this.childCount++;

        }

    }

}
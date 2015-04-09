module TSC {

    export class CSTNode {

        public parent: TSC.CSTNode;
        public children: Array<TSC.CSTNode>;
        public isRoot: boolean = false;
        public childCount: number = 0;
        public printValue: string = "";

        public constructor(printVal: string) {
            this.printValue = printVal;
        }

        public addChild(child: TSC.CSTNode) {

            child.parent = this;
            this.children[this.childCount] = child;
            this.childCount++;

        }

    }

}
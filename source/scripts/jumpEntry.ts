module TSC {

    export class JumpEntry {

        public jumpVariableName: string;
        public distance: number;
        public startPosition: number;

        constructor(start: number) {

            this.jumpVariableName = "j" + _JumpVarCounter;
            _JumpVarCounter++;
            this.distance = 0;
            this.startPosition = start;

        }

    }

}
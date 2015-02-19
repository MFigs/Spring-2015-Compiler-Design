module TSC {
    
    export class TokenNum extends Token {

        public numericValue: number;

        public constructor(tokenVal: string, lineNum: number) {

            super(tokenVal, lineNum);
            this.numericValue = parseInt(tokenVal);

        }

    }

}
module TSC {
    
    export class TokenEOF extends Token {

        public constructor(tokenVal: string, lineNum: number) {

            super(tokenVal, lineNum);

        }

    }

}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONStream = void 0;
// prettier-ignore
const Char = {
    tab: 0x09,
    lineFeed: 0x0A,
    carriageReturn: 0x0D,
    space: 0x20,
    doubleQuote: 0x22,
    comma: 0x2C,
    colon: 0x3A,
    openBracket: 0x5B,
    backslash: 0x5C,
    closeBracket: 0x5D,
    openBrace: 0x7B,
    closeBrace: 0x7D, // }
};
var State;
(function (State) {
    State[State["INVALID"] = 0] = "INVALID";
    // read {
    State[State["ROOT"] = 1] = "ROOT";
    // read , } or check for "
    State[State["NEXT_KEY"] = 2] = "NEXT_KEY";
    // read , or check for ]
    State[State["NEXT_ARRAY_ITEM"] = 3] = "NEXT_ARRAY_ITEM";
    // read [
    State[State["START_ARRAY"] = 4] = "START_ARRAY";
    // read ]
    State[State["END_ARRAY"] = 5] = "END_ARRAY";
    // strings, objects, arrays
    State[State["VALUE"] = 6] = "VALUE";
    // read :
    State[State["END_VALUE_KEY"] = 7] = "END_VALUE_KEY";
    // read ,
    State[State["END_VALUE_ROOT"] = 8] = "END_VALUE_ROOT";
    // read ,
    State[State["END_VALUE_ARRAY"] = 9] = "END_VALUE_ARRAY";
})(State || (State = {}));
const isPrimitiveTerminator = (c) => c === Char.comma || c === Char.closeBrace || c === Char.closeBracket;
const isWhitespace = (c) => c === Char.carriageReturn || c === Char.lineFeed || c === Char.space || c === Char.tab;
/*
    Allows streaming big JSON files
    >2GB, >4GB, etc

    It assumes the root is always an object
    Only keys on the root can be listened

    This class expects well-formed JSONs

    TODO: as of now, the `push` method in this class is 25% of the total CPU time.
          we should try to move this to a WASM module.
*/
class JSONStream {
    constructor() {
        this.objectCallbacks = {};
        this.arrayCallbacks = {};
        this.state = State.ROOT;
        this.next = State.INVALID;
        this.index = 0;
        this.buffer = "";
        this.valueStart = 0;
        this.valueEnd = 0;
        this.slashed = false;
        this.quotes = false;
        this.brackets = 0;
        this.braces = 0;
        this.primitive = true;
    }
    parseValue() {
        return JSON.parse(this.buffer.slice(this.valueStart, this.valueEnd + 1));
    }
    push(chunk) {
        this.buffer += chunk;
        const len = this.buffer.length;
        if (len === 0)
            return;
        let i = this.index;
        let c = this.buffer.charCodeAt(i);
        while (c > 0) {
            // console.log(c, String.fromCharCode(c), chunk.substring(i - 5, i + 5), this.state);
            switch (this.state) {
                case State.ROOT:
                    if (c === Char.openBrace)
                        this.state = State.NEXT_KEY;
                    else if (!isWhitespace(c))
                        throw new Error("Expected {");
                    break;
                case State.NEXT_KEY:
                    if (c === Char.doubleQuote || c === Char.comma) {
                        // read key
                        this.state = State.VALUE;
                        this.next = State.END_VALUE_KEY;
                        if (c === Char.doubleQuote) {
                            // let VALUE consume the quote
                            this.valueStart = this.valueEnd = i;
                            continue; // (don't i++)
                        }
                        else {
                            this.valueStart = this.valueEnd = i + 1;
                        }
                    }
                    else if (c === Char.closeBrace)
                        this.state = State.ROOT;
                    else if (!isWhitespace(c))
                        throw new Error('Expected ", comma or }');
                    break;
                case State.NEXT_ARRAY_ITEM:
                    if (c === Char.comma) {
                        // read next item
                        this.valueStart = this.valueEnd = i + 1;
                        this.state = State.VALUE;
                        this.next = State.END_VALUE_ARRAY;
                    }
                    else if (c === Char.closeBracket) {
                        this.state = State.END_ARRAY;
                        this.next = State.INVALID;
                        // dont consume ], let END_ARRAY handle it
                        continue; // (don't i++)
                    }
                    else if (!isWhitespace(c))
                        throw new Error("Expected , or ]");
                    break;
                case State.START_ARRAY:
                    if (c === Char.openBracket) {
                        // read first item
                        this.valueStart = this.valueEnd = i + 1;
                        this.state = State.VALUE;
                        this.next = State.END_VALUE_ARRAY;
                    }
                    else if (!isWhitespace(c))
                        throw new Error("Expected [");
                    break;
                case State.END_ARRAY:
                    if (c === Char.closeBracket)
                        this.state = State.NEXT_KEY;
                    else if (!isWhitespace(c))
                        throw new Error("Expected ]");
                    break;
                case State.VALUE:
                    if (this.brackets === 0 &&
                        this.braces === 0 &&
                        this.quotes === false &&
                        this.primitive &&
                        isPrimitiveTerminator(c)) {
                        // console.log("key", this.key, "value", this.value);
                        this.state = this.next;
                        this.next = State.INVALID;
                        // don't consume the terminator, let the next state handle it
                        continue; // (don't i++)
                    }
                    this.valueEnd = i;
                    if (isWhitespace(c))
                        break;
                    else if (c === Char.backslash) {
                        this.slashed = !this.slashed;
                        break;
                    }
                    else if (c === Char.doubleQuote) {
                        this.primitive = false;
                        if (this.slashed) {
                            this.slashed = false;
                            break;
                        }
                        this.quotes = !this.quotes;
                    }
                    // anything else is not escaped
                    this.slashed = false;
                    if (this.quotes)
                        break;
                    if (c === Char.openBracket)
                        this.brackets++;
                    else if (c === Char.openBrace)
                        this.braces++;
                    else if (c === Char.closeBracket)
                        this.brackets--;
                    else if (c === Char.closeBrace)
                        this.braces--;
                    const sameLevel = this.brackets === 0 && this.braces === 0;
                    this.primitive = this.primitive && sameLevel;
                    if (!this.primitive && sameLevel) {
                        // console.log("key", this.key, "value", this.value);
                        this.primitive = true;
                        this.state = this.next;
                        this.next = State.INVALID;
                    }
                    break;
                case State.END_VALUE_ROOT:
                    if (this.key in this.objectCallbacks) {
                        // emit in root
                        // console.log("EMITTING IN ROOT", this.key, this.value);
                        this.objectCallbacks[this.key](this.parseValue());
                    }
                    // read next key
                    this.state = State.NEXT_KEY;
                    continue;
                case State.END_VALUE_KEY:
                    if (c === Char.colon) {
                        this.key = this.parseValue();
                        if (typeof this.key !== "string")
                            throw new Error("Expected string on key");
                        if (this.key in this.arrayCallbacks) {
                            // start array
                            this.state = State.START_ARRAY;
                            this.next = State.INVALID;
                        }
                        else {
                            // read value directly
                            this.valueStart = this.valueEnd = i + 1;
                            this.state = State.VALUE;
                            this.next = State.END_VALUE_ROOT;
                        }
                    }
                    else if (!isWhitespace(c))
                        throw new Error("Expected :");
                    break;
                case State.END_VALUE_ARRAY:
                    // console.log("EMITTING ARRAY", this.key, this.value);
                    this.arrayCallbacks[this.key](this.parseValue());
                    // read next item
                    this.state = State.NEXT_ARRAY_ITEM;
                    continue;
                default:
                    throw new Error("Invalid JSON state: " + this.state);
            }
            i++;
            c = this.buffer.charCodeAt(i);
        }
        const base = Math.min(i, this.valueStart);
        this.buffer = this.buffer.slice(base);
        this.index = i - base;
        this.valueEnd -= base;
        this.valueStart -= base;
    }
    // Object from the root which match the key will be emitted completely
    onObject(key, callback) {
        this.objectCallbacks[key] = callback;
        return this;
    }
    // Arrays from the root which match the key will be emitted element by element
    onArrayItem(key, callback) {
        this.arrayCallbacks[key] = callback;
        return this;
    }
}
exports.JSONStream = JSONStream;

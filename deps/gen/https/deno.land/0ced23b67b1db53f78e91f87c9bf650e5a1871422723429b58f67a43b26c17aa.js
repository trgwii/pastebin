import { deepAssign } from "../_util/deep_assign.ts";
import { assert } from "../_util/assert.ts";
class TOMLError extends Error {
}
class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class ParserGroup {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.arrValues = [];
        this.objValues = {};
    }
}
class ParserContext {
    constructor() {
        this.output = {};
    }
}
class Parser {
    constructor(tomlString) {
        this.tomlLines = this._split(tomlString);
        this.context = new ParserContext();
    }
    _sanitize() {
        const out = [];
        for (let i = 0; i < this.tomlLines.length; i++) {
            const s = this.tomlLines[i];
            const trimmed = s.trim();
            if (trimmed !== "") {
                out.push(s);
            }
        }
        this.tomlLines = out;
        this._removeComments();
        this._mergeMultilines();
    }
    _removeComments() {
        function isFullLineComment(line) {
            return line.match(/^#/) ? true : false;
        }
        function stringStart(line) {
            const m = line.match(/(?:=\s*\[?\s*)("""|'''|"|')/);
            if (!m) {
                return false;
            }
            openStringSyntax = m[1];
            return true;
        }
        function stringEnd(line) {
            const reg = RegExp(`(?<!(=\\s*))${openStringSyntax}(?!(.*"))`);
            if (!line.match(reg)) {
                return false;
            }
            openStringSyntax = "";
            return true;
        }
        const cleaned = [];
        let isOpenString = false;
        let openStringSyntax = "";
        for (let i = 0; i < this.tomlLines.length; i++) {
            const line = this.tomlLines[i];
            if (!isOpenString && stringStart(line)) {
                isOpenString = true;
            }
            if (isOpenString && stringEnd(line)) {
                isOpenString = false;
            }
            if (!isOpenString && !isFullLineComment(line)) {
                const out = line.split(/(?<=([\,\[\]\{\}]|".*"|'.*'|\w(?!.*("|')+))\s*)#/gi);
                cleaned.push(out[0].trim());
            }
            else if (isOpenString || !isFullLineComment(line)) {
                cleaned.push(line);
            }
            if (isOpenString && (openStringSyntax === "'" || openStringSyntax === '"')) {
                throw new TOMLError(`Single-line string is not closed:\n${line}`);
            }
        }
        if (isOpenString) {
            throw new TOMLError(`Incomplete string until EOF`);
        }
        this.tomlLines = cleaned;
    }
    _mergeMultilines() {
        function arrayStart(line) {
            const reg = /.*=\s*\[/g;
            return reg.test(line) && !(line[line.length - 1] === "]");
        }
        function arrayEnd(line) {
            return line[line.length - 1] === "]";
        }
        function stringStart(line) {
            const m = line.match(/.*=\s*(?:\"\"\"|''')/);
            if (!m) {
                return false;
            }
            return !line.endsWith(`"""`) || !line.endsWith(`'''`);
        }
        function stringEnd(line) {
            return line.endsWith(`'''`) || line.endsWith(`"""`);
        }
        function isLiteralString(line) {
            return line.match(/'''/) ? true : false;
        }
        const merged = [];
        let acc = [], isLiteral = false, capture = false, captureType = "", merge = false;
        for (let i = 0; i < this.tomlLines.length; i++) {
            const line = this.tomlLines[i];
            const trimmed = line.trim();
            if (!capture && arrayStart(trimmed)) {
                capture = true;
                captureType = "array";
            }
            else if (!capture && stringStart(trimmed)) {
                isLiteral = isLiteralString(trimmed);
                capture = true;
                captureType = "string";
            }
            else if (capture && arrayEnd(trimmed)) {
                merge = true;
            }
            else if (capture && stringEnd(trimmed)) {
                merge = true;
            }
            if (capture) {
                if (isLiteral) {
                    acc.push(line);
                }
                else {
                    acc.push(trimmed);
                }
            }
            else {
                if (isLiteral) {
                    merged.push(line);
                }
                else {
                    merged.push(trimmed);
                }
            }
            if (merge) {
                capture = false;
                merge = false;
                if (captureType === "string") {
                    merged.push(acc
                        .join("\n")
                        .replace(/"""/g, '"')
                        .replace(/'''/g, `'`)
                        .replace(/\n/g, "\\n"));
                    isLiteral = false;
                }
                else {
                    merged.push(acc.join(""));
                }
                captureType = "";
                acc = [];
            }
        }
        this.tomlLines = merged;
    }
    _unflat(keys, values = {}, cObj = {}) {
        const out = {};
        if (keys.length === 0) {
            return cObj;
        }
        else {
            if (Object.keys(cObj).length === 0) {
                cObj = values;
            }
            const key = keys.pop();
            if (key) {
                out[key] = cObj;
            }
            return this._unflat(keys, values, out);
        }
    }
    _groupToOutput() {
        assert(this.context.currentGroup != null, "currentGroup must be set");
        const arrProperty = this.context.currentGroup.name
            .replace(/"/g, "")
            .replace(/'/g, "")
            .split(".");
        let u = {};
        if (this.context.currentGroup.type === "array") {
            u = this._unflat(arrProperty, this.context.currentGroup.arrValues);
        }
        else {
            u = this._unflat(arrProperty, this.context.currentGroup.objValues);
        }
        deepAssign(this.context.output, u);
        delete this.context.currentGroup;
    }
    _split(str) {
        const out = [];
        out.push(...str.split("\n"));
        return out;
    }
    _isGroup(line) {
        const t = line.trim();
        return t[0] === "[" && /\[(.*)\]/.exec(t) ? true : false;
    }
    _isDeclaration(line) {
        return line.split("=").length > 1;
    }
    _createGroup(line) {
        const captureReg = /\[(.*)\]/;
        if (this.context.currentGroup) {
            this._groupToOutput();
        }
        let type;
        let m = line.match(captureReg);
        assert(m != null, "line mut be matched");
        let name = m[1];
        if (name.match(/\[.*\]/)) {
            type = "array";
            m = name.match(captureReg);
            assert(m != null, "name must be matched");
            name = m[1];
        }
        else {
            type = "object";
        }
        this.context.currentGroup = new ParserGroup(type, name);
    }
    _processDeclaration(line) {
        const idx = line.indexOf("=");
        const key = line.substring(0, idx).trim();
        const value = this._parseData(line.slice(idx + 1));
        return new KeyValuePair(key, value);
    }
    _parseData(dataString) {
        dataString = dataString.trim();
        switch (dataString[0]) {
            case '"':
            case "'":
                return this._parseString(dataString);
            case "[":
            case "{":
                return this._parseInlineTableOrArray(dataString);
            default: {
                const match = /#.*$/.exec(dataString);
                if (match) {
                    dataString = dataString.slice(0, match.index).trim();
                }
                switch (dataString) {
                    case "true":
                        return true;
                    case "false":
                        return false;
                    case "inf":
                    case "+inf":
                        return Infinity;
                    case "-inf":
                        return -Infinity;
                    case "nan":
                    case "+nan":
                    case "-nan":
                        return NaN;
                    default:
                        return this._parseNumberOrDate(dataString);
                }
            }
        }
    }
    _parseInlineTableOrArray(dataString) {
        const invalidArr = /,\]/g.exec(dataString);
        if (invalidArr) {
            dataString = dataString.replace(/,]/g, "]");
        }
        if ((dataString[0] === "{" && dataString[dataString.length - 1] === "}") ||
            (dataString[0] === "[" && dataString[dataString.length - 1] === "]")) {
            const reg = /([a-zA-Z0-9-_\.]*) (=)/gi;
            let result;
            while ((result = reg.exec(dataString))) {
                const ogVal = result[0];
                const newVal = ogVal
                    .replace(result[1], `"${result[1]}"`)
                    .replace(result[2], ":");
                dataString = dataString.replace(ogVal, newVal);
            }
            return JSON.parse(dataString);
        }
        throw new TOMLError("Malformed inline table or array literal");
    }
    _parseString(dataString) {
        const quote = dataString[0];
        if (dataString.startsWith(`"\\n`)) {
            dataString = dataString.replace(`"\\n`, `"`);
        }
        else if (dataString.startsWith(`'\\n`)) {
            dataString = dataString.replace(`'\\n`, `'`);
        }
        if (dataString.endsWith(`\\n"`)) {
            dataString = dataString.replace(`\\n"`, `"`);
        }
        else if (dataString.endsWith(`\\n'`)) {
            dataString = dataString.replace(`\\n'`, `'`);
        }
        let value = "";
        for (let i = 1; i < dataString.length; i++) {
            switch (dataString[i]) {
                case "\\":
                    i++;
                    switch (dataString[i]) {
                        case "b":
                            value += "\b";
                            break;
                        case "t":
                            value += "\t";
                            break;
                        case "n":
                            value += "\n";
                            break;
                        case "f":
                            value += "\f";
                            break;
                        case "r":
                            value += "\r";
                            break;
                        case "u":
                        case "U": {
                            const codePointLen = dataString[i] === "u" ? 4 : 6;
                            const codePoint = parseInt("0x" + dataString.slice(i + 1, i + 1 + codePointLen), 16);
                            value += String.fromCodePoint(codePoint);
                            i += codePointLen;
                            break;
                        }
                        case "\\":
                            value += "\\";
                            break;
                        default:
                            value += dataString[i];
                            break;
                    }
                    break;
                case quote:
                    if (dataString[i - 1] !== "\\") {
                        return value;
                    }
                    break;
                default:
                    value += dataString[i];
                    break;
            }
        }
        throw new TOMLError("Incomplete string literal");
    }
    _parseNumberOrDate(dataString) {
        if (this._isDate(dataString)) {
            return new Date(dataString);
        }
        if (this._isLocalTime(dataString)) {
            return dataString;
        }
        const hex = /^(0(?:x|o|b)[0-9a-f_]*)/gi.exec(dataString);
        if (hex && hex[0]) {
            return hex[0].trim();
        }
        const testNumber = this._isParsableNumber(dataString);
        if (testNumber !== false && !isNaN(testNumber)) {
            return testNumber;
        }
        return String(dataString);
    }
    _isLocalTime(str) {
        const reg = /(\d{2}):(\d{2}):(\d{2})/;
        return reg.test(str);
    }
    _isParsableNumber(dataString) {
        const m = /((?:\+|-|)[0-9_\.e+\-]*)[^#]/i.exec(dataString);
        if (!m) {
            return false;
        }
        else {
            return parseFloat(m[0].replace(/_/g, ""));
        }
    }
    _isDate(dateStr) {
        const reg = /\d{4}-\d{2}-\d{2}/;
        return reg.test(dateStr);
    }
    _parseDeclarationName(declaration) {
        const out = [];
        let acc = [];
        let inLiteral = false;
        for (let i = 0; i < declaration.length; i++) {
            const c = declaration[i];
            switch (c) {
                case ".":
                    if (!inLiteral) {
                        out.push(acc.join(""));
                        acc = [];
                    }
                    else {
                        acc.push(c);
                    }
                    break;
                case `"`:
                    if (inLiteral) {
                        inLiteral = false;
                    }
                    else {
                        inLiteral = true;
                    }
                    break;
                default:
                    acc.push(c);
                    break;
            }
        }
        if (acc.length !== 0) {
            out.push(acc.join(""));
        }
        return out;
    }
    _parseLines() {
        for (let i = 0; i < this.tomlLines.length; i++) {
            const line = this.tomlLines[i];
            if (this._isGroup(line)) {
                if (this.context.currentGroup &&
                    this.context.currentGroup.type === "array") {
                    this.context.currentGroup.arrValues.push(this.context.currentGroup.objValues);
                    this.context.currentGroup.objValues = {};
                }
                if (!this.context.currentGroup ||
                    (this.context.currentGroup &&
                        this.context.currentGroup.name !==
                            line.replace(/\[/g, "").replace(/\]/g, ""))) {
                    this._createGroup(line);
                    continue;
                }
            }
            if (this._isDeclaration(line)) {
                const kv = this._processDeclaration(line);
                const key = kv.key;
                const value = kv.value;
                if (!this.context.currentGroup) {
                    this.context.output[key] = value;
                }
                else {
                    this.context.currentGroup.objValues[key] = value;
                }
            }
        }
        if (this.context.currentGroup) {
            if (this.context.currentGroup.type === "array") {
                this.context.currentGroup.arrValues.push(this.context.currentGroup.objValues);
            }
            this._groupToOutput();
        }
    }
    _cleanOutput() {
        this._propertyClean(this.context.output);
    }
    _propertyClean(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            if (k) {
                let v = obj[k];
                const pathDeclaration = this._parseDeclarationName(k);
                delete obj[k];
                if (pathDeclaration.length > 1) {
                    const shift = pathDeclaration.shift();
                    if (shift) {
                        k = shift.replace(/"/g, "");
                        v = this._unflat(pathDeclaration, v);
                    }
                }
                else {
                    k = k.replace(/"/g, "");
                }
                obj[k] = v;
                if (v instanceof Object) {
                    this._propertyClean(v);
                }
            }
        }
    }
    parse() {
        this._sanitize();
        this._parseLines();
        this._cleanOutput();
        return this.context.output;
    }
}
function joinKeys(keys) {
    return keys
        .map((str) => {
        return str.match(/[^A-Za-z0-9_-]/) ? `"${str}"` : str;
    })
        .join(".");
}
class Dumper {
    constructor(srcObjc) {
        this.maxPad = 0;
        this.output = [];
        this.srcObject = srcObjc;
    }
    dump() {
        this.output = this._parse(this.srcObject);
        this.output = this._format();
        return this.output;
    }
    _parse(obj, keys = []) {
        const out = [];
        const props = Object.keys(obj);
        const propObj = props.filter((e) => {
            if (obj[e] instanceof Array) {
                const d = obj[e];
                return !this._isSimplySerializable(d[0]);
            }
            return !this._isSimplySerializable(obj[e]);
        });
        const propPrim = props.filter((e) => {
            if (obj[e] instanceof Array) {
                const d = obj[e];
                return this._isSimplySerializable(d[0]);
            }
            return this._isSimplySerializable(obj[e]);
        });
        const k = propPrim.concat(propObj);
        for (let i = 0; i < k.length; i++) {
            const prop = k[i];
            const value = obj[prop];
            if (value instanceof Date) {
                out.push(this._dateDeclaration([prop], value));
            }
            else if (typeof value === "string" || value instanceof RegExp) {
                out.push(this._strDeclaration([prop], value.toString()));
            }
            else if (typeof value === "number") {
                out.push(this._numberDeclaration([prop], value));
            }
            else if (typeof value === "boolean") {
                out.push(this._boolDeclaration([prop], value));
            }
            else if (value instanceof Array &&
                this._isSimplySerializable(value[0])) {
                out.push(this._arrayDeclaration([prop], value));
            }
            else if (value instanceof Array &&
                !this._isSimplySerializable(value[0])) {
                for (let i = 0; i < value.length; i++) {
                    out.push("");
                    out.push(this._headerGroup([...keys, prop]));
                    out.push(...this._parse(value[i], [...keys, prop]));
                }
            }
            else if (typeof value === "object") {
                out.push("");
                out.push(this._header([...keys, prop]));
                if (value) {
                    const toParse = value;
                    out.push(...this._parse(toParse, [...keys, prop]));
                }
            }
        }
        out.push("");
        return out;
    }
    _isSimplySerializable(value) {
        return (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            value instanceof RegExp ||
            value instanceof Date ||
            value instanceof Array);
    }
    _header(keys) {
        return `[${joinKeys(keys)}]`;
    }
    _headerGroup(keys) {
        return `[[${joinKeys(keys)}]]`;
    }
    _declaration(keys) {
        const title = joinKeys(keys);
        if (title.length > this.maxPad) {
            this.maxPad = title.length;
        }
        return `${title} = `;
    }
    _arrayDeclaration(keys, value) {
        return `${this._declaration(keys)}${JSON.stringify(value)}`;
    }
    _strDeclaration(keys, value) {
        return `${this._declaration(keys)}"${value}"`;
    }
    _numberDeclaration(keys, value) {
        switch (value) {
            case Infinity:
                return `${this._declaration(keys)}inf`;
            case -Infinity:
                return `${this._declaration(keys)}-inf`;
            default:
                return `${this._declaration(keys)}${value}`;
        }
    }
    _boolDeclaration(keys, value) {
        return `${this._declaration(keys)}${value}`;
    }
    _dateDeclaration(keys, value) {
        function dtPad(v, lPad = 2) {
            return v.padStart(lPad, "0");
        }
        const m = dtPad((value.getUTCMonth() + 1).toString());
        const d = dtPad(value.getUTCDate().toString());
        const h = dtPad(value.getUTCHours().toString());
        const min = dtPad(value.getUTCMinutes().toString());
        const s = dtPad(value.getUTCSeconds().toString());
        const ms = dtPad(value.getUTCMilliseconds().toString(), 3);
        const fData = `${value.getUTCFullYear()}-${m}-${d}T${h}:${min}:${s}.${ms}`;
        return `${this._declaration(keys)}${fData}`;
    }
    _format() {
        const rDeclaration = /(.*)\s=/;
        const out = [];
        for (let i = 0; i < this.output.length; i++) {
            const l = this.output[i];
            if (l[0] === "[" && l[1] !== "[") {
                if (this.output[i + 1] === "") {
                    i += 1;
                    continue;
                }
                out.push(l);
            }
            else {
                const m = rDeclaration.exec(l);
                if (m) {
                    out.push(l.replace(m[1], m[1].padEnd(this.maxPad)));
                }
                else {
                    out.push(l);
                }
            }
        }
        const cleanedOutput = [];
        for (let i = 0; i < out.length; i++) {
            const l = out[i];
            if (!(l === "" && out[i + 1] === "")) {
                cleanedOutput.push(l);
            }
        }
        return cleanedOutput;
    }
}
export function stringify(srcObj) {
    return new Dumper(srcObj).dump().join("\n");
}
export function parse(tomlString) {
    tomlString = tomlString.replace(/\r\n/g, "\n").replace(/\\\n/g, "\n");
    return new Parser(tomlString).parse();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9tbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvbWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QyxNQUFNLFNBQVUsU0FBUSxLQUFLO0NBQUc7QUFFaEMsTUFBTSxZQUFZO0lBQ2hCLFlBQW1CLEdBQVcsRUFBUyxLQUFjO1FBQWxDLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFTO0lBQUcsQ0FBQztDQUMxRDtBQUVELE1BQU0sV0FBVztJQUlmLFlBQW1CLElBQVksRUFBUyxJQUFZO1FBQWpDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBSHBELGNBQVMsR0FBYyxFQUFFLENBQUM7UUFDMUIsY0FBUyxHQUE0QixFQUFFLENBQUM7SUFFZSxDQUFDO0NBQ3pEO0FBRUQsTUFBTSxhQUFhO0lBQW5CO1FBRUUsV0FBTSxHQUE0QixFQUFFLENBQUM7SUFDdkMsQ0FBQztDQUFBO0FBRUQsTUFBTSxNQUFNO0lBR1YsWUFBWSxVQUFrQjtRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFDRCxTQUFTO1FBQ1AsTUFBTSxHQUFHLEdBQWEsRUFBRSxDQUFDO1FBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sT0FBTyxHQUFHLENB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
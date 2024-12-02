"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastTextLID176Model = exports.FastTextModel = void 0;
const Languages_1 = require("@pipeline/Languages");
/** FastText model wrapper. Only allows to run predict */
class FastTextModel {
    constructor(model) {
        this.model = model;
    }
    /**
     * Make a prediction for a single line of text.
     *
     * @param text the text to predict
     * @param k return top `k` predictions
     * @param threshold only return predictions with a probability higher than `threshold`
     * @returns an array of [probability, label] pairs
     */
    predict(text, k = 1, threshold = 0.0) {
        const predictions = this.model.predict(text, k, threshold);
        const len = predictions.size();
        const res = [];
        for (let i = 0; i < len; i++)
            res.push(predictions.get(i));
        return res;
    }
    static async load(modelPath, env) {
        // load assets and model
        const fastTextModuleJs = await env.loadAsset(`/fasttext/fasttext_wasm.js`, "text");
        const fastTextModuleWasm = await env.loadAsset(`/fasttext/fasttext_wasm.wasm`, "arraybuffer");
        const model = new Uint8Array(await env.loadAsset(modelPath, "arraybuffer"));
        // instantiate module using eval :)
        const fastTextModuleFn = new Function(fastTextModuleJs + `; return Module;`)();
        const fastTextModule = (await fastTextModuleFn({ wasmBinary: fastTextModuleWasm }));
        // write the input model to the fake filesystem as "model.bin"
        // NOTE: writeFile is not available since the closure compiler optimized it out (but we still have open, write and close)
        // we could configure CC to keep it but it's not worth it, this works
        const { FS } = fastTextModule;
        const stream = FS.open("model.bin", "w+");
        FS.write(stream, model, 0, model.length, 0);
        FS.close(stream);
        // create the C++ class FastText and load the model "model.bin" from the fake filesystem
        const fastText = new fastTextModule.FastText();
        fastText.loadModel("model.bin");
        return new FastTextModel(fastText);
    }
}
exports.FastTextModel = FastTextModel;
/**
 * Language identification model provided by fastText themselves.
 *
 * https://fasttext.cc/docs/en/language-identification.html
 */
class FastTextLID176Model {
    constructor(model) {
        this.model = model;
    }
    /**
     * Identify the language of the given text.
     *
     * @param line text to identify language, **must be a single line** and not contain newlines
     * @returns ISO 639-2/3 code and accuracy
     */
    identifyLanguage(line) {
        const result = this.model.predict(line, 1, 0.0);
        const code = result[0][1].slice(9); // "__label__".length === 9
        return {
            iso639: code,
            iso639index: (0, Languages_1.getLanguageIndexByCode)(code),
            accuracy: result[0][0],
        };
    }
    /** Loads the `lid.176.ftz` model */
    static async load(env) {
        return new FastTextLID176Model(await FastTextModel.load("/data/models/lid.176.ftz", env));
    }
}
exports.FastTextLID176Model = FastTextLID176Model;

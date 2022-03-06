/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const fs = __webpack_require__(2);
const const_1 = __webpack_require__(3);
const filesystem_1 = __webpack_require__(4);
const utils_1 = __webpack_require__(6);
function activate(context) {
    let startRecording = vscode.commands.registerCommand(const_1.COMMAND_START_RECORDING, () => __awaiter(this, void 0, void 0, function* () {
        const filename = yield (0, utils_1.showInput)("", "Enter the filename where you want to save session recording");
        const rekoderSavingURI = yield (0, filesystem_1.initRekorderFolder)(filename);
        console.log("result : ", rekoderSavingURI);
        let ws = fs.createWriteStream(rekoderSavingURI);
        let changes = [];
        vscode.workspace.onDidChangeTextDocument(logChanges);
        function logChanges(e) {
            if (changes.length > 0) {
                if (e.document.uri.path !== changes[changes.length - 1].file) {
                    console.log("change document");
                }
            }
            e.contentChanges.forEach((c) => {
                let change = {
                    file: e.document.uri.path,
                    language: "ts",
                    selection: "",
                    value: c.text,
                    timestamp: new Date(),
                    type: "",
                    position: [],
                };
                changes.push(change);
                console.log(changes);
                ws.write(c.text);
            });
            console.log(changes);
        }
    }));
    context.subscriptions.push(startRecording);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.COMMAND_START_RECORDING = void 0;
exports.COMMAND_START_RECORDING = "rekoder.startRecording";


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initRekorderFolder = exports.getProjectPath = exports.createDir = exports.createFile = exports.showErrorMessage = void 0;
const path = __webpack_require__(5);
const fs_1 = __webpack_require__(2);
const vscode_1 = __webpack_require__(1);
const utils_1 = __webpack_require__(6);
const fs = (__webpack_require__(2).promises);
const EXTENSION = ".rekoder";
function exists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.access(path);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function showErrorMessage(message) {
    vscode_1.window.showErrorMessage(typeof message === "string" ? message : JSON.stringify(message));
}
exports.showErrorMessage = showErrorMessage;
function createFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs.writeFile(path, "");
        }
        catch (e) {
            console.log("e : ", e);
            return e;
        }
    });
}
exports.createFile = createFile;
function createDir(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.mkdir(path);
            return [true, null];
        }
        catch (err) {
            if (err.code !== "EEXIST") {
                return [true, null];
            }
            return [false, err];
        }
    });
}
exports.createDir = createDir;
const getProjectPath = () => __awaiter(void 0, void 0, void 0, function* () {
    const workspaceUri = (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders[0].uri.fsPath) ||
        "";
    const extensionUri = path.join(workspaceUri, EXTENSION);
    if (!(0, fs_1.existsSync)(extensionUri)) {
        const [success, err] = yield createDir(extensionUri);
        if (!success) {
            showErrorMessage(err);
        }
    }
    return extensionUri;
});
exports.getProjectPath = getProjectPath;
function initRekorderFolder(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const rekoderSavingURI = yield (0, exports.getProjectPath)();
        const name = (filename || Date.now()) + EXTENSION;
        const filePath = rekoderSavingURI + "/" + name;
        const fileExist = yield exists(filePath);
        if (fileExist) {
            (0, utils_1.showWarning)("File already exist, session recording will be appended to " + name);
        }
        else {
            yield createFile(filePath);
            console.log("filename was added : ");
            (0, utils_1.showInfo)("Session file created successfully!");
        }
        return filePath;
    });
}
exports.initRekorderFolder = initRekorderFolder;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showInput = exports.showWarning = exports.showError = exports.showInfo = void 0;
const vscode = __webpack_require__(1);
function showInfo(message) {
    vscode.window.showInformationMessage(message);
}
exports.showInfo = showInfo;
function showError(message) {
    vscode.window.showErrorMessage(message);
}
exports.showError = showError;
function showWarning(message) {
    vscode.window.showWarningMessage(message);
}
exports.showWarning = showWarning;
function showInput(placeHolder, prompt = "") {
    return vscode.window.showInputBox({
        placeHolder,
        prompt,
    });
}
exports.showInput = showInput;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map
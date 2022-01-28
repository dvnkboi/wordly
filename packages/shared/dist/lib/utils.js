"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.words = exports.getWordArray = exports.alpha = exports.wait = exports.map = void 0;
function map(x, in_min, in_max, out_min, out_max) {
    return Math.max(Math.min((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min, out_max), out_min);
}
exports.map = map;
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.wait = wait;
exports.alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
function getWordArray(word) {
    const wordArray = [];
    for (const letter of word) {
        wordArray.push({
            ltr: letter,
            isGuessed: letter != " " ? false : true,
        });
    }
    return wordArray;
}
exports.getWordArray = getWordArray;
exports.words = [
    "CLOUD COMPUTING",
    "BIG DATA",
    "BUISNESS INTEL",
    "DATABASE",
    "ENSAT",
    "WEBINAIRES",
    "GENIE INFO",
    "COMPUTER SCIENCE",
    "METHODE AGILE",
    "SCRUM",
    "TRELLO",
    "GITHUB",
];
//# sourceMappingURL=utils.js.map
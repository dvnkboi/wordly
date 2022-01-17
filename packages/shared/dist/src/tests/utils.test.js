"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('utils', () => {
    it('linearly map of number that is within a range to another range', () => {
        expect((0, index_1.map)(5, 0, 10, 0, 100)).toBe(50);
        expect((0, index_1.map)(1, 0, 10, 0, 100)).toBe(10);
        expect((0, index_1.map)(0, 0, 10, 0, 100)).toBe(0);
        expect((0, index_1.map)(10, 0, 10, 0, 100)).toBe(100);
        expect((0, index_1.map)(100, 0, 10, 0, 100)).toBe(100);
        expect((0, index_1.map)(-10, 0, 10, 0, 100)).toBe(0);
    });
    it('wait for a given time', async () => {
        const start = Date.now();
        await (0, index_1.wait)(100);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(100);
    });
    it('gets word array from a word', () => {
        expect((0, index_1.getWordArray)('hello world')).toEqual([
            {
                ltr: 'h',
                isGuessed: false
            },
            {
                ltr: 'e',
                isGuessed: false
            },
            {
                ltr: 'l',
                isGuessed: false
            },
            {
                ltr: 'l',
                isGuessed: false
            },
            {
                ltr: 'o',
                isGuessed: false
            },
            {
                ltr: " ",
                isGuessed: true
            },
            {
                ltr: 'w',
                isGuessed: false
            },
            {
                ltr: 'o',
                isGuessed: false
            },
            {
                ltr: 'r',
                isGuessed: false
            },
            {
                ltr: 'l',
                isGuessed: false
            },
            {
                ltr: 'd',
                isGuessed: false
            }
        ]);
    });
});
//# sourceMappingURL=utils.test.js.map
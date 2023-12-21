"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertString = exports.assertError = exports.assert = void 0;
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}
exports.assert = assert;
function assertError(value, message) {
    assert(value instanceof Error, message !== null && message !== void 0 ? message : 'Invalid error value');
}
exports.assertError = assertError;
function assertString(value, message) {
    assert(typeof value === 'string', message !== null && message !== void 0 ? message : 'Invalid string value');
}
exports.assertString = assertString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0LnV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL0NUL3V0aWxzL2Fzc2VydC51dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFnQixNQUFNLENBQUMsU0FBa0IsRUFBRSxPQUFlO0lBQ3hELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ2pEO0FBQ0gsQ0FBQztBQUpELHdCQUlDO0FBRUQsU0FBZ0IsV0FBVyxDQUN6QixLQUFjLEVBQ2QsT0FBZ0I7SUFFaEIsTUFBTSxDQUFDLEtBQUssWUFBWSxLQUFLLEVBQUUsT0FBTyxhQUFQLE9BQU8sY0FBUCxPQUFPLEdBQUkscUJBQXFCLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBTEQsa0NBS0M7QUFFRCxTQUFnQixZQUFZLENBQzFCLEtBQWMsRUFDZCxPQUFnQjtJQUVoQixNQUFNLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLHNCQUFzQixDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUxELG9DQUtDIn0=
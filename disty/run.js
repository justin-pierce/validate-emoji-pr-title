"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core_1 = require("@actions/core");
const run = (context) => {
    var _a, _b;
    const { eventName } = context;
    (0, core_1.info)(`Event name: ${eventName}`);
    if (eventName !== "pull_request") {
        (0, core_1.setFailed)(`Invalid event: ${eventName}, it should be use on pull_request`);
        return;
    }
    const pullRequestTitle = (_b = (_a = context === null || context === void 0 ? void 0 : context.payload) === null || _a === void 0 ? void 0 : _a.pull_request) === null || _b === void 0 ? void 0 : _b.title;
    (0, core_1.info)(`Pull Request title ts: "${pullRequestTitle}"`);
    const regex = RegExp((0, core_1.getInput)("regexp"), (0, core_1.getInput)("flags"));
    const helpMessage = (0, core_1.getInput)("helpMessage");
    if (!regex.test(pullRequestTitle)) {
        let message = `Pull Request title "${pullRequestTitle}" failed to pass match regexp - ${regex}
`;
        if (helpMessage) {
            message = message.concat(helpMessage);
        }
        (0, core_1.setFailed)(message);
    }
};
exports.run = run;

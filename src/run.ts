import { info, setFailed, getInput } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import * as fs from 'fs';
import toml from '@iarna/toml';


export const run = (context: Context) => {
  const { eventName } = context;
  info(`Event name: ${eventName}`);

  if (eventName !== "pull_request") {
    setFailed(`Invalid event: ${eventName}, it should be use on pull_request`);
    return;
  }

  const pullRequestTitle = context?.payload?.pull_request?.title;

  info(`Pull Request title ts: "${pullRequestTitle}"`);


  const tomlContent = fs.readFileSync('pyproject.toml', 'utf-8');
  const parsedData = toml.parse(tomlContent);

  info(`TOML: "${parsedData}"`);

  const regex = RegExp(getInput("regexp"), getInput("flags"));
  const helpMessage = getInput("helpMessage");
  if (!regex.test(pullRequestTitle)) {
    let message = `Pull Request title "${pullRequestTitle}" failed to pass match regexp - ${regex}
`;
    if (helpMessage) {
      message = message.concat(helpMessage);
    }

    setFailed(message);
  }
};

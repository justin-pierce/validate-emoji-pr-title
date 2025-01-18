import { info, setFailed, getInput } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import * as fs from 'fs';
import toml, {JsonMap} from '@iarna/toml';


export const run = (context: Context) => {
  const { eventName } = context;
  info(`Event name: ${eventName}`);

  if (eventName !== "pull_request") {
    setFailed(`Invalid event: ${eventName}, it should be use on pull_request`);
    return;
  }

  const pullRequestTitle = context?.payload?.pull_request?.title;

  info(`Pull Request title ts: "${pullRequestTitle}"`);

  // [tool.semantic_release.commit_parser_options]
  // major_tags = ["🚨"]
  // minor_tags = [
  //   "✨"
  // ]
  // patch_tags = [
  //   "🐛", "🏎", "🔒", "🧼"
  // ]
  // non_triggering_tags = [
  //   "👷", "📝", "♻️", "🧪"
  // ]


  const tomlContent = fs.readFileSync('pyproject.toml', 'utf-8');
  const parsedData: any = toml.parse(tomlContent);

  const tagParent = parsedData.tool.semantic_release.commit_parser_options;

  const majorTags: [] = tagParent.major_tags;
  const minorTags: [] = tagParent.minor_tags;
  const patchTags: [] = tagParent.patch_tags;
  const otherTags: [] = tagParent.non_triggering_tags;

  const allTags = [...majorTags, ...minorTags, ...patchTags, ...otherTags];

  info(`allTags: "${allTags}"`);

  const prFirstChar: string = pullRequestTitle.substring(0, 1);

  info(`prFirstChar: "${prFirstChar}"`);

  const isValid: boolean = allTags.includes(prFirstChar as never);

  info(`isValid: "${isValid}"`);

  if (!isValid) {
    setFailed(`Pull Request title "${pullRequestTitle}" failed to start with a valid emoji: ${allTags}`);
  }
};

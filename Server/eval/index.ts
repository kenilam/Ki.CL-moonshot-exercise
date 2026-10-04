import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { locate } from '../review/locate';
import { MODEL, propose } from '../review/model';
import type { Edit } from '../review/schema';

import { CASES, type Case } from './cases';

/*
 * Runs every case against the real model and prints what passed. It costs a
 * model call per case, so it is run by hand, not in CI: `yarn eval`.
 */

try {
  process.loadEnvFile(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env')
  );
} catch {
  // ANTHROPIC_API_KEY may already be in the environment.
}

const overlaps = (text: string, edit: Edit, phrase: string) => {
  const start = text.indexOf(phrase);
  const end = start + phrase.length;

  return start !== -1 && edit.start < end && start < edit.end;
};

async function run({
  flag,
  keep,
  kind,
  name,
  rejected,
  reviewedAs,
  text,
}: Case) {
  const proposal = await propose(kind, text);
  const { edits: proposed, rejection } = proposal;
  const edits = locate(text, proposed);

  const missed = flag.filter(
    (phrase) => !edits.some((edit) => edit.quote.includes(phrase))
  );
  const touched = keep.filter((phrase) =>
    edits.some((edit) => overlaps(text, edit, phrase))
  );

  return {
    dropped: proposed.length - edits.length,
    edits: edits.length,
    missed,
    name,
    passed:
      Boolean(rejected) === Boolean(rejection) &&
      proposal.reviewedAs === (reviewedAs ?? kind) &&
      !missed.length &&
      !touched.length,
    reviewedAs: proposal.reviewedAs,
    rejection,
    touched,
  };
}

console.log(`Model: ${MODEL}\n`);

const results = [];

for (const item of CASES) {
  const result = await run(item);

  results.push(result);

  console.log(
    `${result.passed ? 'pass' : 'FAIL'}  ${result.name}  (${result.edits} edits, ${result.dropped} dropped)`
  );
  if (result.reviewedAs !== CASES[results.length - 1].kind) {
    console.log(`      reviewed as: ${result.reviewedAs}`);
  }
  if (result.rejection) {
    console.log(`      rejected: ${result.rejection}`);
  }
  result.missed.forEach((phrase) => console.log(`      missed: ${phrase}`));
  result.touched.forEach((phrase) => console.log(`      touched: ${phrase}`));
}

const passed = results.filter((result) => result.passed).length;
const dropped = results.reduce((sum, result) => sum + result.dropped, 0);

console.log(`\n${passed}/${results.length} passed, ${dropped} edits dropped`);

process.exitCode = passed === results.length ? 0 : 1;

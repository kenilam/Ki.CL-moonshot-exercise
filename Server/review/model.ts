import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

import { render, SYSTEM } from './prompt';
import { ProposedEdits, type Kind, type Proposal } from './schema';

const MODEL = process.env.MOONSHOT_MODEL || 'claude-opus-5-5';

let client: Anthropic | null = null;

class ReviewError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

/** Asks the model for edits. Throws a ReviewError the API can show as is. */
async function propose(kind: Kind, text: string): Promise<Proposal> {
  // A key that isn't scoped to a workspace has to name one on every request.
  client ??= new Anthropic({
    defaultHeaders: process.env.ANTHROPIC_WORKSPACE_ID
      ? { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID }
      : undefined,
  });

  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    // A declined request is re-run on Anthropic's recommended model instead.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: {
      // Opus 5.5 defaults to medium; set so a model change does not move it.
      effort: 'medium',
      format: zodOutputFormat(ProposedEdits),
    },
    system: [
      { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: render(kind, text) }],
  });

  if (response.stop_reason === 'refusal') {
    throw new ReviewError('The model declined to review this text.', 422);
  }

  if (response.stop_reason === 'max_tokens' || !response.parsed_output) {
    throw new ReviewError('The review came back incomplete. Try again.', 502);
  }

  return response.parsed_output;
}

export { MODEL, propose, ReviewError };

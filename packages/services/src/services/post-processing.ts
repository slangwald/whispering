import type { Effect } from 'effect';
import { Context, Data } from 'effect';

export class PostProcessingError extends Data.TaggedError('PostProcessingError')<{
	message: string;
	origError?: unknown;
}> {}

export class PleaseEnterApiKeyError extends Data.TaggedError('PleaseEnterApiKeyError') {}

export class InvalidApiKeyError extends Data.TaggedError('InvalidApiKeyError') {}

export class PostProcessingService extends Context.Tag('PostProcessingService')<
	PostProcessingService,
	{
		readonly postprocess: (
			text: string,
			promptPrompt: string,
			options: { apiKey: string; outputLanguage: string }
		) => Effect.Effect<string, PostProcessingError | PleaseEnterApiKeyError | InvalidApiKeyError>;
	}
>() {}

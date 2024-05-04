import { Effect } from 'effect';
import { Layer } from 'effect';
import { PostProcessingError } from '../../services/post-processing';
import {
	PostProcessingService,
	InvalidApiKeyError,
	PleaseEnterApiKeyError
} from '../../services/post-processing';

function isString(input: unknown): input is string {
	return typeof input === 'string';
}

class CompletionFetchError extends PostProcessingError {
	constructor({ fetchError }: { fetchError: unknown }) {
		super({
			message: 'Failed to fetch response from Completions API',
			origError: fetchError
		});
	}
}

export const CompletionPostProcessingService = Layer.succeed(
	PostProcessingService,
	PostProcessingService.of({
		postprocess: (text, systemPrompt, { apiKey, outputLanguage }) =>
			Effect.gen(function* (_) {
				console.log(text, systemPrompt, { apiKey, outputLanguage });
				const input = {
					model: 'gpt-4-turbo',
					messages: [
						{
							role: 'system',
							content:
								'You are an expert grammar corrector. The input further down was directly pulled from ' +
								'an audio transcription. Correct it lightly, remove any common fillers (uh, uhm, er). ' +
								'Just respond with the corrected version, no intro or summaries.'
						},
						{
							role: 'user',
							content: text
						}
					]
				};
				const data = yield* _(
					Effect.tryPromise({
						try: () =>
							fetch('https://api.openai.com/v1/chat/completions', {
								method: 'POST',
								headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
								body: JSON.stringify(input)
							}).then((res) => res.json()),
						catch: (error) => new CompletionFetchError({ fetchError: error })
					})
				);
				return data.choices[0].message.content;
			})
	})
);

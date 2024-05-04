import { ClipboardServiceLive } from '@repo/services/implementations/clipboard/web.js';
import { RecordingsDbServiceLiveIndexedDb } from '@repo/services/implementations/recordings-db/indexed-db.ts';
import { TranscriptionServiceLiveWhisper } from '@repo/services/implementations/transcription/whisper.ts';
import { CompletionPostProcessingService } from '@repo/services/implementations/post-processing/completions.ts';
import { Effect } from 'effect';
import { createRecordings } from './create-recordings';

export const recordings = createRecordings.pipe(
	Effect.provide(RecordingsDbServiceLiveIndexedDb),
	Effect.provide(TranscriptionServiceLiveWhisper),
	Effect.provide(CompletionPostProcessingService),
	Effect.provide(ClipboardServiceLive),
	Effect.runSync
);

recordings.sync.pipe(Effect.runPromise);

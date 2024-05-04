import AudioRecorder from 'audio-recorder-polyfill';
import { Effect, Layer } from 'effect';
import { RecorderError, RecorderService } from '../../services/recorder';

class GetNavigatorMediaError extends RecorderError {
	constructor({ message, origError }: { message: string; origError?: unknown }) {
		console.log(origError);
		super({ message, origError });
	}
}

class StopMediaRecorderError extends RecorderError {
	constructor({ message, origError }: { message: string; origError?: unknown }) {
		super({ message, origError });
	}
}

class EnumerateRecordingDevicesError extends RecorderError {
	constructor({ message, origError }: { message: string; origError?: unknown }) {
		super({ message, origError });
	}
}

let stream: MediaStream;
let mediaRecorder: MediaRecorder;
const recordedChunks: Blob[] = [];

const getMediaStream = (recordingDeviceId: string) =>
	Effect.tryPromise({
		try: () =>
			navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: recordingDeviceId } } }),
		catch: (error) =>
			new GetNavigatorMediaError({
				message: 'Error getting media stream',
				origError: error
			})
	});

const resetRecorder = () => {
	recordedChunks.length = 0;
	stream.getTracks().forEach((track) => track.stop());
};

export const RecorderServiceLiveWeb = Layer.succeed(
	RecorderService,
	RecorderService.of({
		startRecording: (recordingDeviceId) =>
			Effect.gen(function* (_) {
				stream = yield* _(getMediaStream(recordingDeviceId));
				recordedChunks.length = 0;
				mediaRecorder = new AudioRecorder(stream);
				mediaRecorder.addEventListener(
					'dataavailable',
					(event: BlobEvent) => {
						if (!event.data.size) return;
						recordedChunks.push(event.data);
					},
					{ once: true }
				);
				mediaRecorder.start();
			}),
		stopRecording: Effect.tryPromise({
			try: () =>
				new Promise<Blob>((resolve) => {
					mediaRecorder.addEventListener(
						'stop',
						() => {
							const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
							resolve(audioBlob);
							resetRecorder();
						},
						{ once: true }
					);
					mediaRecorder.stop();
				}),
			catch: (error) =>
				new StopMediaRecorderError({
					message: 'Error stopping media recorder and getting audio blob',
					origError: error
				})
		}).pipe(
			Effect.catchAll((error) => {
				resetRecorder();
				return error;
			})
		),
		enumerateRecordingDevices: Effect.tryPromise({
			try: async () => {
				await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
				const devices = await navigator.mediaDevices.enumerateDevices();
				return devices.filter((device) => device.kind === 'audioinput');
			},
			catch: (error) =>
				new EnumerateRecordingDevicesError({
					message: 'Error enumerating recording devices',
					origError: error
				})
		})
	})
);

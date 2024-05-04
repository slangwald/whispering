import persistedWritable from '@epicenterhq/svelte-persisted-writable';
import { z } from 'zod';

const settingsSchema = z.object({
	isCopyToClipboardEnabled: z.boolean(),
	isPasteContentsOnSuccessEnabled: z.boolean(),
	isPostProcessingEnabled: z.boolean(),
	currentGlobalShortcut: z.string(),
	apiKey: z.string(),
	outputLanguage: z.string()
});

type Settings = z.infer<typeof settingsSchema>;

const SETTINGS_DEFAULT: Settings = {
	isCopyToClipboardEnabled: true,
	isPasteContentsOnSuccessEnabled: false,
	isPostProcessingEnabled: true,
	currentGlobalShortcut: 'CommandOrControl+Shift+;',
	apiKey: '',
	outputLanguage: 'en'
};

export const settings = persistedWritable({
	key: 'whispering-settings',
	schema: settingsSchema,
	initialValue: SETTINGS_DEFAULT
});

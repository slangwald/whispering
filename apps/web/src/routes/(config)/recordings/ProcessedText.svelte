<script lang="ts">
	import { createRecordingViewTransitionName } from '$lib/create-view-transition-name';

	export let recordingId: string;
	export let processedText: string;

	function nl2br(str: string) {
		const breakTag = '<br/>';
		const replaceStr = '$1' + breakTag;
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
	}
</script>

<span
	style="view-transition-name: {createRecordingViewTransitionName({
		recordingId: recordingId,
		propertyName: 'processedText'
	})}"
>
	{processedText}
</span>

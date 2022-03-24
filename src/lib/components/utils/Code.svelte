<script lang="ts">
  import hljs from 'highlight.js';
  import type { TaskLanguage } from '$lib/utils/types/task';

  export let lang: TaskLanguage | string;
  export let code: string;
</script>

<pre><code>{@html hljs.highlight(code, { language: lang }).value}</code></pre>

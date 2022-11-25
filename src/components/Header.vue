<script setup lang="ts">
import { ref } from 'vue';
import IconShare from '~icons/icon-park-outline/share-two'
import { useOnlineCount } from '../libs/online';

let timerId: number | null = null;
const shareButtonText = ref('分享');

const pageLocation = window.location.href;

const { onlineCount } = useOnlineCount();

const delayRevertShareButton = () => {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => shareButtonText.value = '分享', 5000);
}

const copySuccess = () => {
  shareButtonText.value = '链接已复制';
  delayRevertShareButton();
}

const copyError = () => {
  shareButtonText.value = '复制链接失败';
  delayRevertShareButton();
}
</script>

<template>
  <div class="p-4 flex items-center lg:pr-0">
    <h1 class="text-xl flex-1 leading-8">校内 4K 转播</h1>
    <span class="flex-none text-sm mr-4 leading-8 relative before:block before:w-2 before:h-2 before:rounded-full before:bg-green-600 before:absolute before:-left-4 before:top-1/2 before:-translate-y-1">
      {{ onlineCount ?? 'N' }} 人在看
    </span>
    <button 
      class="flex-none btn btn-sm"
      v-clipboard:copy="pageLocation"
      v-clipboard:success="copySuccess"
      v-clipboard:error="copyError"
    >
      <IconShare class="mr-2"></IconShare>
      {{ shareButtonText }}
    </button>
  </div>
</template>
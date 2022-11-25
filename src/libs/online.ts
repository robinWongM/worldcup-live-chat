import { ref } from 'vue';
import { pb } from './backend';

const onlineCount = ref<number | undefined>(undefined);

const refreshCount = () => {
  fetch(pb.buildUrl('/api/online'))
      .then(res => res.json())
      .then(count => {
        onlineCount.value = Number.isSafeInteger(count) ? count : undefined;
      });
}

setInterval(() => {
  refreshCount();
}, 10000);

export const useOnlineCount = () => {
  refreshCount();

  return {
    onlineCount,
  }
}
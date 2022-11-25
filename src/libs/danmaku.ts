import { ref } from 'vue';
import { pb } from './backend';

interface MessagePacket {
  id: string;
  content: string;
  nickname: string;
  ipHash: string;
  created: string;
}

const hooks = {
  scrollToBottom: () => {},
  drawDanmaku: (content: string) => {},
};

const messages = ref<MessagePacket[]>([]);
const isDanmakuEnabled = ref(false);

pb.collection('messages').getList<MessagePacket>(1, 100, {
  sort: '-created',
}).then(result => {
  messages.value.push(...result.items.reverse());
  hooks.scrollToBottom();
});

pb.collection('messages').subscribe<MessagePacket>('*', (e) => {
  if (e.action === 'create') {
    messages.value.push(e.record);
    hooks.scrollToBottom();
    if (isDanmakuEnabled) {
      hooks.drawDanmaku(e.record.content);
    }
  } else if (e.action === 'update') {
    const oldRecordPos = messages.value.findIndex(old => old.id === e.record.id);
    if (oldRecordPos !== -1) {
      messages.value[oldRecordPos] = e.record;
    }
  }
});

const setDanmakuEnabled = (enabled: boolean) => isDanmakuEnabled.value = enabled;

export const useDanmaku = (scrollToBottom: typeof hooks.scrollToBottom) => {
  hooks.scrollToBottom = scrollToBottom;

  return {
    messages,
    isDanmakuEnabled,
    setDanmakuEnabled,
  };
}

export const registerDPlayer = (player: DPlayer.default) => {
  hooks.drawDanmaku = (content: string) => player.danmaku.draw({
    color: '#fff',
    text: content,
    type: 'top',
  });
}
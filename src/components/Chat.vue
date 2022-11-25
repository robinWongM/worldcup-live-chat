<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { pb } from '../libs/backend';
import { useDanmaku } from '../libs/danmaku';
import dayjs from 'dayjs';

const chatContainer = ref<HTMLElement | null>(null);
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

const { messages, isDanmakuEnabled, setDanmakuEnabled } = useDanmaku(scrollToBottom);

const nickname = ref('');
const toBeSetNickname = ref('');
const toBeSentMessage = ref('');

const send = () => {
  if (nickname.value.trim() === '') {
    alert('请先设置昵称。');
    return;
  }

  if (toBeSentMessage.value.trim() === '') {
    alert('发送的内容不能为空。');
    return;
  }

  pb.collection('messages').create({
    nickname: nickname.value,
    content: toBeSentMessage.value,
  });
  toBeSentMessage.value = '';
}

const setNickname = () => {
  nickname.value = toBeSetNickname.value;
}

const formatDate = (str: string) => dayjs(str).format('HH:mm:ss');

</script>

<template>
  <div class="p-4 flex flex-col flex-1 overflow-hidden lg:flex-none lg:w-96">
    <div class="flex-1 overflow-auto" ref="chatContainer">
      <div>
        <div v-for="message in messages" :key="message.id" class="mb-2">
          <span class="opacity-80">
            {{ message.nickname }}<span class="opacity-60">({{ message.ipHash }})</span>
          </span>:
          {{ message.content }}
          <time class="text-xs opacity-50">{{ formatDate(message.created) }}</time>
        </div>
      </div>
    </div>
    <div class="form-control">
      <div class="text-sm mb-2">
        <span v-if="nickname" class="mr-2">
          你的昵称：{{ nickname }}
        </span>
        <label for="nickname-modal" class="btn btn-sm">{{ nickname ? '更改' : '请先点此设置昵称' }}</label>
      </div>
      <div class="input-group">
        <input type="text" placeholder="友善评论，文明发言" class="input w-full" v-model="toBeSentMessage" @keypress.enter="send" />
        <button class="btn btn-square w-16" @click="send">
          发送
        </button>
      </div>
    </div>
    <div class="opacity-30 text-center text-xs mt-2">
      直播版权归<a href="https://www.douyin.com/fifaworldcup" target="_blank">抖音</a>所有
    </div>
  </div>

  <input type="checkbox" id="nickname-modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <input type="text" placeholder="取个名字" class="input input-bordered w-full" v-model="toBeSetNickname" autofocus/>
      <div class="modal-action">
        <label for="nickname-modal" class="btn" @click="setNickname">就它了</label>
      </div>
    </div>
  </div>
</template>

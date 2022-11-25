<script setup lang="ts">
import { ref } from 'vue';
import Chat from './components/Chat.vue';
import Player from './components/Player.vue';
import Header from './components/Header.vue';

const isDanmakuEnabled = ref(true);
const setDanmakuEnabled = (value: boolean) => isDanmakuEnabled.value = value;

</script>

<template>
  <div class="flex flex-col h-full lg:flex-row">
    <div class="flex-0 lg:flex-1 flex flex-col lg:flex-col-reverse">
      <Header></Header>
      <Player :isDanmakuEnabled="isDanmakuEnabled"></Player>
    </div>
    <Chat :isDanmakuEnabled="isDanmakuEnabled" @setDanmakuEnabled="setDanmakuEnabled" />
  </div>
</template>

<style scoped>

</style>

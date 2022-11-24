<script setup lang="ts">
import Chat from './components/Chat.vue';
import Player from './components/Player.vue';
</script>

<template>
  <div class="flex flex-col h-full lg:flex-row">
    <div class="flex-0 lg:flex-1 flex items-center">
      <Player></Player>
    </div>
    <Chat />
  </div>
</template>

<style scoped>

</style>

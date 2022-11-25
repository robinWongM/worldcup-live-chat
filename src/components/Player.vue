<script setup lang="ts">
import mpegts from 'mpegts.js';
import DPlayer from 'dplayer';
import { onMounted, onUnmounted, ref } from 'vue';

import { registerDPlayer } from '../libs/danmaku'; 

const container = ref<HTMLElement | null>(null);
let playerInstance: DPlayer | null = null;

onMounted(() => {
  const flvSource = {
    url: '/live/livestream.flv',
    type: 'mpegts',
  };
  const hlsSource = {
    url: '/live/livestream.m3u8',  
    type: 'normal',
  };

  playerInstance = new DPlayer({
    container: container.value,
    video: {
      ...(mpegts.getFeatureList().mseLivePlayback ? flvSource : hlsSource),
      customType: {
        // @ts-ignore
        mpegts: (video, player) => {
          const flvPlayer = mpegts.createPlayer({
            type: 'flv',
            isLive: true,
            url: video.src,
          }, {
            enableStashBuffer: false,
            liveBufferLatencyChasing: true,
            autoCleanupSourceBuffer: true,
          });
          player.on('destroy', () => {
            flvPlayer.destroy();
          });

          flvPlayer.attachMediaElement(video);
          flvPlayer.load();
        }  
      }
    },
    live: true,
  });

  registerDPlayer(playerInstance);
});

onUnmounted(() => playerInstance?.destroy());

</script>

<template>
  <div ref="container" class="w-full md:h-full"></div>
</template>
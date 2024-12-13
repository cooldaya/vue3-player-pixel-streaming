<script setup>
import PixelStreamingPlayer from "@/views/pixel-streaming-player.vue";
import { onMounted, ref } from "vue";
import { connectPixelStreaming, watchUEEvents } from "@/ue";
const playerInstanceRef = ref(null);

onMounted(() => {
  // 是否链接使用像素流模式、否则使用UE内嵌网页模式
  connectPixelStreaming(playerInstanceRef.value);
});

watchUEEvents({
  jumpurl: (data) => {
    console.log(data);
  },
});
</script>

<template>
  <div id="layout">
    <PixelStreamingPlayer ss="ws://10.1.10.17:1235" ref="playerInstanceRef" />
  </div>
</template>

<style scoped>
.w-500 {
  width: 500px;
}
.h-500 {
  height: 500px;
}

.left,
.right {
  height: 100%;
  position: fixed;
  z-index: 99;
  background-color: #f2f2f2;
  width: 160px;
  top: 0;
}

.pointer-events-none {
  pointer-events: none;
}
.pointer-events-auto {
  pointer-events: auto;
}

.left {
  left: 0;
}
.right {
  right: 0;
}
</style>

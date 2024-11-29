<script setup>
import PixelStreamingPlayer from "@/views/PixelStreamingPlayer.vue";
import { ref } from "vue";
const playerInstanceRef = ref(null);

const receiveUEMsg = ref("");
const opts = {
  sendMsg() {
    // 发送消息到UE
    playerInstanceRef.value.sendMsgToUE("打爆你狗头");
  },
  receiveUEMsg(msg) {
    // 接收UE消息
    console.log("receiveUEMsg", msg);
    receiveUEMsg.value += msg;
  },
};
</script>

<template>
  <div id="layout">
    <PixelStreamingPlayer
      ss="ws://10.1.10.17:1235"
      @receiveMessage="opts.receiveUEMsg"
      ref="playerInstanceRef"
    />
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

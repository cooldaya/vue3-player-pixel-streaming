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
  }
}
</script>

<template>
  <div id="layout">
    <div class="left pointer-events-none">
      <button @click="opts.sendMsg" class="pointer-events-auto">发送消息到UE</button>
      <div>
        <div>收到的ue消息:</div>{{ receiveUEMsg }}</div>
    </div>
    <PixelStreamingPlayer ss="ws://127.0.0.1" @receiveMessage="opts.receiveUEMsg" ref="playerInstanceRef" />
    <div class="right">sss</div>
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
.pointer-events-auto{
  pointer-events: auto;
}

.left {
  left: 0;
}
.right {
  right: 0;
}
</style>

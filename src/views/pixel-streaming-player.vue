<script setup>
// npm i @epicgames-ps/lib-pixelstreamingfrontend-ue5.2 @epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.2
import {
  Config,
  PixelStreaming,
} from "@epicgames-ps/lib-pixelstreamingfrontend-ue5.2";
import {
  Application,
  PixelStreamingApplicationStyle,
} from "@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.2";
import { onMounted } from "vue";
import { ref } from "vue";
const props = defineProps({
  ss: {
    type: String,
    default: "ws://127.0.0.1/",
  },
});

const loading = ref(true);

const emitter = defineEmits(["receiveMessage", "loaded"]);
let ueWebEmitter = null;
const pixelStreamingContainerRef = ref(null);

const STATE = {
  stream: null,
  application: null,
};

const initPixelStreaming = () => {
  // 控制UI样式
  const PixelStreamingApplicationStyles = new PixelStreamingApplicationStyle({
    // customStyles: {
    //   "#uiFeatures": {
    //     display: "none",
    //   },
    // },
  });
  PixelStreamingApplicationStyles.applyStyleSheet();

  // 像素流播放的一些配置
  const config = new Config({
    useUrlParams: true,
    initialSettings: {
      ss: props.ss, // 流媒体服务器地址
      AutoConnect: true, // 自动连接：如果为 true，应用启动时会自动连接到流媒体服务器。
      AutoPlayVideo: true, // 自动播放视频：如果为 true，在连接成功后视频将自动播放。
      StartVideoMuted: true, // 启动时静音：如果为 true，视频在开始播放时会处于静音状态。
      MinQP: 30, // 最小量化参数：用于控制视频编码的最小质量水平，数值越低，品质越好，但带宽消耗也越大。
      XRControllerInput: false, // XR 控制器输入：如果为 true，允许 XR（虚拟现实）控制器的输入。
      GamepadInput: false, // 游戏手柄输入：如果为 true，允许使用游戏手柄进行控制。
      TouchInput: false, // 触摸输入：如果为 true，允许在触摸屏设备上进行交互。
      HoveringMouse: true, // 鼠标悬停：如果为 true，允许鼠标悬停并与 UI 进行交互。
      HoveringMouseMode: true, // 鼠标悬停模式：如果为 true，激活鼠标悬停模式以增强 UI 交互体验。
      SuppressBrowserKeys: false, // 抑制浏览器按键：如果为 true，将抑制浏览器的某些键盘输入，以防止干扰应用内的控制。
      MatchViewportRes: true, // 匹配视窗分辨率：如果为 true，将调整视频分辨率以匹配视窗分辨率。
    },
  });

  const stream = new PixelStreaming(config);
  const application = new Application({
    stream,
    onColorModeChanged: (isLightMode) =>
      PixelStreamingApplicationStyles.setColorMode(isLightMode),
  });

  // 加载完毕 重写 onPlayStream 添加 loading 状态
  const onPlayStream = application.onPlayStream.bind(application);

  application.onPlayStream = (...args) => {
    onPlayStream(...args);
    loading.value = false;
    emitter("loaded");
  };

  // 添加到 dom
  pixelStreamingContainerRef.value.appendChild(application.rootElement);
  STATE.stream = stream;
  STATE.application = application;

  // 监听消息
  stream.addResponseEventListener("handle_responses", (data) => {
    emitter("receiveMessage", data);
    ueWebEmitter?.emit("receive-pixel-msg", data);
  });
};

onMounted(() => {
  initPixelStreaming();
});

// 导出接口
defineExpose({
  // 像素流发送消息给 UE
  sendMsgToUE: (payload) => {
    if (!STATE.stream) return;
    STATE.stream.emitUIInteraction(payload);
  },
  // 设置 WEB - UE - 像素流 通信的 emitter
  setUeWebEmitter: (emitter) => {
    (ueWebEmitter = emitter)

  },
});
</script>

<template>
  <div
    class="pixel-streaming-container"
    ref="pixelStreamingContainerRef"
    :class="{
      loaded: !loading,
    }"
  ></div>
</template>

<style scoped>
.pixel-streaming-container {
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  min-height: 100px; /** 最小高度 放置不可见 */
}
.pixel-streaming-container.loaded {
  opacity: 1;
}
</style>

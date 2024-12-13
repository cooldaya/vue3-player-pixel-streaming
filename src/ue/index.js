import ue, { ue5 } from "./linkUE";
import mitt from "mitt";
import { onBeforeUnmount } from "vue";

export const emitter = mitt();

let connectPixel = false;

// 向UE发送消息
/**
 *
 * @param {*} type we-event-name
 * @param {*} data {text:1}
 */
export const sendToUE = (type, data = {}) => {
  const params = {
    type,
    data,
  };

 

  if (connectPixel) {
    emitter.emit("send-pixel-msg", params); // 发送数据到像素流
    console.log("web发送数据到像素流-->", params);
  } else {
    ue5("WebToUE", params); // 发送数据到UE客户端
    console.log("web发送数据到UE客户端-->", params);
  }
};

// 提供给UE调用的接口
/**
 *
 * @param {*} _params {type: string, data: object}
 */
ue.interface.UEemit = function (_params) {
  console.log("UEemit --UE发送到web数据-->", _params);

  let params = _params;
  if (typeof _params === "string") params = JSON.parse(_params);

  const { type, data } = params;
  emitter.emit(type, data);
};

// 监听UE消息
/**
 *
 * @param {*} events {'ue-event-name':(data)=>{}}
 */
export const watchUEEvents = (events) => {
  for (const event in events) {
    emitter.on(event, events[event]);
  }

  onBeforeUnmount(() => {
    for (const event in events) {
      emitter.off(event, events[event]);
    }
  });
};

export const connectPixelStreaming = (pixelStreamingInstance) => {
  const psi = pixelStreamingInstance;
  if (!psi || !psi.setUeWebEmitter || !psi.sendMsgToUE)
    return console.warn("pixelStreamingInstance is not valid");
  connectPixel = true;
  pixelStreamingInstance.setUeWebEmitter(emitter);
  emitter.on("receive-pixel-msg", ue.interface.UEemit); // 监听pixel-msg事件，处理时替换成让UE发送消息的接口
  emitter.on("send-pixel-msg", psi.sendMsgToUE); // 发送数据到像素流
};


window.testAPI = {
  sendToUE,
  watchUEEvents,
}



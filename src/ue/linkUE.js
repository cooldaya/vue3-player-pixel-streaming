// ue.js - ESM version of the code

// Define the `ue` object and `ue.interface.broadcast` method
let ue = {};

if (typeof ue !== "object" || typeof ue.interface !== "object") {
  if (typeof ue !== "object") ue = {};
  ue.interface = {};

  ue.interface.broadcast = function (e, t) {
    if (typeof e === "string") {
      let o = [e, ""];
      if (t !== undefined) o[1] = t;
      const n = encodeURIComponent(JSON.stringify(o));
      if (
        typeof history === "object" &&
        typeof history.pushState === "function"
      ) {
        history.pushState({}, "", "#" + n);
        history.pushState({}, "", "#" + encodeURIComponent("[]"));
      } else {
        document.location.hash = n;
        document.location.hash = encodeURIComponent("[]");
      }
    }
  };
} else {
  (function (e) {
    ue.interface = {};
    ue.interface.broadcast = function (t, o) {
      if (typeof t === "string") {
        if (o !== undefined) {
          e.broadcast(t, JSON.stringify(o));
        } else {
          e.broadcast(t, "");
        }
      }
    };
  })(ue.interface);
}
window.ue = ue;
// Export `ue` as the default export
export default ue;

// Export `ue.interface.broadcast` as a named export
export const ue5 = ue.interface.broadcast;

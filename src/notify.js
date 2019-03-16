import { NOTIFY } from "./actions";

if (window.Notification) {
  if (window.Notification.permission === "default") {
    window.Notification.requestPermission();
  }
}

export default function notify() {
  return function(dispatch, getState) {
    let {
      settings: { notifications, timerSound },
      timer: { notified }
    } = getState();

    debugger;
    console.log(getState());

    if (!notified) {
      let audio;
      if (notifications && window.Notification) {
        let notification = new Notification("Your time is up!", {
          requireInteraction: true
        });

        notification.addEventListener("close", () => {
          if (audio) {
            audio.pause();
          }
        });
      }

      if (timerSound) {
        audio = new Audio(timerSound);
        audio.play();
      }
      dispatch({ type: NOTIFY });
    }
  };
}

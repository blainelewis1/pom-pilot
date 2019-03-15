if (window.Notification) {
  if (window.Notification.permission === "default") {
    window.Notification.requestPermission();
  }
}

export default function notify({ notifications, timerSound }) {
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
}

import api from "./api.js";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js");
    return registration;
  } catch (err) {
    console.error("Service worker registration failed:", err);
    return null;
  }
};

export const enablePushNotifications = async () => {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return { success: false, reason: "Push notifications not supported on this browser" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { success: false, reason: "Notification permission denied" };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const { publicKey } = await api.get("/notifications/vapid-public-key").then((r) => r.data);

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
    }

    await api.post("/users/seeker/me/push-subscription", { subscription });
    return { success: true };
  } catch (err) {
    console.error("Failed to subscribe for push notifications:", err);
    return { success: false, reason: err.message };
  }
};

export const fetchNotifications = () => api.get("/notifications").then((r) => r.data);
export const markNotificationRead = (id) => api.post(`/notifications/${id}/read`).then((r) => r.data);
export const markAllNotificationsRead = () => api.post("/notifications/read-all").then((r) => r.data);
export const toggleFollowEmployer = (employerId) =>
  api.post(`/users/seeker/me/toggle-follow-employer/${employerId}`).then((r) => r.data);

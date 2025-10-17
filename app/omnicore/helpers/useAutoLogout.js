import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

export function useAutoLogout(logout_After) {
  const logoutAfter = logout_After;
  const lastActivity = ref(Date.now());
  const router = useRouter();
  let timeout;

  const resetTimer = () => {
    lastActivity.value = Date.now();
    clearTimeout(timeout);
    timeout = setTimeout(handleLogout, logoutAfter);
  };

  async function handleLogout() {
    const { useAuthStore } = await import("../stores/authStore");
    const authStore = useAuthStore();
    authStore.logOutRequest(); // Internal cleanups

    localStorage.setItem("logout-event", Date.now().toString());

    if (router.currentRoute.value.path !== "/iam/auth/login") {
      router.push("/iam/auth/login");
    }
  }

  const activityEvents = ["mousemove", "keydown", "click"];

  const attachListeners = () => {
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
  };

  const detachListeners = () => {
    activityEvents.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });
  };

  onMounted(() => {
    attachListeners();
    timeout = setTimeout(handleLogout, logoutAfter);
  });

  onUnmounted(() => {
    detachListeners();
    clearTimeout(timeout);
  });
}

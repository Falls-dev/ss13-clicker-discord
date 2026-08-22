<template>
  <div class="discord-gate">
    <div class="gate-card">
      <img src="@/assets/art/misc/logo.png" alt="" />
      <h2>Space Clicker 13</h2>
      <p>{{ needsAuth ? $t("gate.authRequired") : $t("gate.body") }}</p>
      <button
        v-if="needsAuth"
        type="button"
        class="btn btn-primary"
        :disabled="busy"
        @click="retryAuth"
      >
        {{ busy ? $t("gate.authorizing") : $t("gate.authorize") }}
      </button>
      <a
        v-else
        class="btn btn-primary"
        href="https://discord.com/invite/HwbK9XQ"
        @click="openInvite"
      >
        {{ $t("gate.openDiscord") }}
      </a>
    </div>
  </div>
</template>

<script>
import { discordState, isDiscordActivity, openExternalLink, retryDiscordLogin, getSessionToken } from "@/discord/activity";
import { hydrateFromCloud, pushToCloud } from "@/state/cloudSave";

export default {
  name: "DiscordGate",
  data() {
    return {
      discordState,
      busy: false
    };
  },
  computed: {
    needsAuth() {
      return isDiscordActivity() && !(this.discordState.user || this.discordState.sessionToken);
    }
  },
  methods: {
    openInvite(event) {
      event.preventDefault();
      openExternalLink("https://discord.com/invite/HwbK9XQ");
    },
    async retryAuth() {
      if (this.busy) return;
      this.busy = true;
      try {
        await retryDiscordLogin();
        if (getSessionToken() || this.discordState.sessionToken) {
          await hydrateFromCloud(this.$store);
          pushToCloud(this.$store, true);
        }
      } catch (err) {
        this.discordState.authError = (err && err.message) || "oauth-failed";
      } finally {
        this.busy = false;
      }
    }
  }
};
</script>

<style scoped>
.discord-gate {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1b222b;
  color: #e8eef3;
  padding: 16px;
  box-sizing: border-box;
}
.gate-card {
  max-width: 420px;
  text-align: center;
  background: #2c343f;
  border-radius: 12px;
  padding: 24px 20px;
}
.gate-card img {
  width: 72px;
  height: 72px;
  image-rendering: pixelated;
  margin-bottom: 12px;
}
.gate-card p {
  margin: 12px 0 18px;
  opacity: 0.85;
}
</style>

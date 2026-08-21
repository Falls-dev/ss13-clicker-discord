<template>
  <div class="debug-root">
    <div v-if="open" class="debug-panel">
      <div class="debug-head">
        <strong>{{ $t("debug.title") }}</strong>
        <button class="btn btn-sm btn-secondary" @click="open = false">{{ $t("debug.close") }}</button>
      </div>
      <div class="debug-row">{{ $t("debug.user") }}: {{ userLabel }}</div>
      <div class="debug-row">{{ $t("debug.session") }}: {{ sessionLabel }}</div>
      <div class="debug-row">{{ $t("debug.locale") }}: {{ $i18n.locale }}</div>
      <div class="debug-row">{{ $t("debug.lastSync") }}: {{ lastSyncLabel }}</div>
      <div class="debug-row">{{ $t("debug.revision") }}: {{ cloudState.revision }}</div>
      <div class="debug-row">{{ $t("debug.saveSize") }}: {{ sizeKb }} KB</div>
      <div class="debug-error" v-if="cloudState.error">{{ cloudState.error }}</div>
      <div class="debug-actions">
        <button class="btn btn-sm btn-primary" @click="push">{{ $t("debug.push") }}</button>
        <button class="btn btn-sm btn-primary" @click="pull">{{ $t("debug.pull") }}</button>
        <button class="btn btn-sm btn-warning" @click="giveMoney">{{ $t("debug.giveMoney") }}</button>
        <button class="btn btn-sm btn-danger" @click="enableCheats">{{ $t("debug.enableCheats") }}</button>
      </div>
    </div>
    <button v-else class="debug-fab" @click="open = true">DBG</button>
  </div>
</template>

<script>
import { discordState, getSessionToken } from "@/discord/activity";
import { cloudState, pushToCloud, hydrateFromCloud, saveSizeBytes } from "@/cloud/save";

export default {
  name: "DebugPanel",
  data() {
    return {
      open: true,
      cloudState
    };
  },
  computed: {
    userLabel() {
      const user = discordState.user;
      if (!user) return this.$t("debug.guest");
      return (user.global_name || user.username || user.id) + " (" + user.id + ")";
    },
    sessionLabel() {
      const token = getSessionToken();
      return token ? token.slice(0, 8) + "…" : "—";
    },
    lastSyncLabel() {
      if (!cloudState.lastSync) return this.$t("settings.cloudNever");
      return new Date(cloudState.lastSync).toLocaleString();
    },
    sizeKb() {
      return (saveSizeBytes(this.$store) / 1024).toFixed(1);
    }
  },
  methods: {
    async push() {
      await pushToCloud(this.$store, false);
    },
    async pull() {
      await hydrateFromCloud(this.$store);
      this.$store.dispatch("chrono/updateOfflineTime");
      this.$store.dispatch("cleanup");
      this.$store.dispatch("_resume");
    },
    giveMoney() {
      this.$store.commit("inventory/changeItemCount", {
        itemId: "money",
        count: 1000000
      });
    },
    enableCheats() {
      this.$store.commit("cheats/enableCheats");
    }
  }
};
</script>

<style scoped>
.debug-root {
  pointer-events: none;
}
.debug-root * {
  pointer-events: auto;
}
.debug-panel {
  position: fixed;
  right: 8px;
  top: 8px;
  z-index: 4000;
  width: 280px;
  background: rgba(20, 24, 30, 0.94);
  color: #e8eef3;
  border: 1px solid #5b6b7a;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}
.debug-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.debug-row {
  opacity: 0.9;
  margin-bottom: 2px;
  word-break: break-all;
}
.debug-error {
  color: #ff8d8d;
  margin: 4px 0;
}
.debug-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}
.debug-fab {
  position: fixed;
  right: 8px;
  top: 8px;
  z-index: 4000;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #c45c12;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>

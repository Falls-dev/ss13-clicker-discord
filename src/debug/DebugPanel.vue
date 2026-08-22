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
      </div>
      <hr />
      <h6>{{ $t("debug.data") }}</h6>
      <div class="debug-actions">
        <button class="btn btn-sm btn-primary" @click="exportDataClicked">{{ $t("settings.exportData") }}</button>
        <button
          class="btn btn-sm btn-danger"
          :class="{'cheats-disabled': !fileData}"
          @click="importDataClicked"
        >{{ $t("settings.importData") }}</button>
        <input type="file" accept="application/JSON" @change="importDataChanged" />
        <button class="btn btn-sm btn-danger" @click="resetDataClicked">{{ $t("settings.resetAll") }}</button>
      </div>
      <hr />
      <h6>{{ $t("cheats.title") }}</h6>
      <button
        v-if="!cheatsEnabled"
        type="button"
        class="btn btn-sm btn-danger d-block mb-1"
        @click="openEnableCheats"
      >{{ $t("cheats.enable") }}</button>
      <div :class="{'cheats-disabled': !cheatsEnabled}">
        <div class="debug-actions">
          <button class="btn btn-sm btn-primary" @click="openItemSpawner">{{ $t("cheats.itemSpawner") }}</button>
          <button class="btn btn-sm btn-warning" @click="getSomeCash">{{ $t("cheats.getCash") }}</button>
          <button class="btn btn-sm btn-primary" @click="openSkillLeveler">{{ $t("cheats.levelJobs") }}</button>
          <button class="btn btn-sm btn-primary" @click="openLevelAllJobs">{{ $t("cheats.maxJobs") }}</button>
          <button class="btn btn-sm btn-primary" @click="completeCurrentValidhuntingTask">{{ $t("cheats.completeHunt") }}</button>
          <button class="btn btn-sm btn-primary" @click="giveResearchPoints">{{ $t("cheats.giveResearch") }}</button>
        </div>
        <div class="custom-control custom-switch">
          <input v-model="showAllActions" type="checkbox" class="custom-control-input" id="dbgShowAllActions" />
          <label class="custom-control-label" for="dbgShowAllActions">{{ $t("cheats.showAllActions") }}</label>
        </div>
        <div class="custom-control custom-switch">
          <input v-model="unlockAllJobs" type="checkbox" class="custom-control-input" id="dbgUnlockAllJobs" />
          <label class="custom-control-label" for="dbgUnlockAllJobs">{{ $t("cheats.unlockAllJobs") }}</label>
        </div>
        <div class="custom-control custom-switch">
          <input v-model="infiniteChrono" type="checkbox" class="custom-control-input" id="dbgInfiniteChrono" />
          <label class="custom-control-label" for="dbgInfiniteChrono">{{ $t("cheats.infiniteChrono") }}</label>
        </div>
        <div class="custom-control custom-switch">
          <input v-model="extraChronoOptions" type="checkbox" class="custom-control-input" id="dbgExtraChrono" />
          <label class="custom-control-label" for="dbgExtraChrono">{{ $t("cheats.extraChrono") }}</label>
        </div>
      </div>
    </div>
    <button v-else class="debug-fab" @click="open = true">DBG</button>
  </div>
</template>

<script>
import { EventBus } from "@/utils/eventBus.js";
import { discordState, getSessionToken } from "@/discord/activity";
import { cloudState, pushToCloud, hydrateFromCloud, saveSizeBytes } from "@/state/cloudSave";
import { reducer } from "@/state/store";
import ModalResetData from "@/components/Modals/ModalResetData";
import ModalLevelAllJobs from "@/components/Modals/ModalLevelAllJobs";
import ModalSkillLeveler from "@/components/Modals/ModalSkillLeveler";
import ModalEnableCheats from "@/components/Modals/ModalEnableCheats";

export default {
  name: "DebugPanel",
  data() {
    return {
      open: true,
      cloudState,
      discordState,
      fileData: null
    };
  },
  computed: {
    userLabel() {
      const user = this.discordState.user;
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
    },
    cheatsEnabled() {
      return this.$store.getters["cheats/cheatsEnabled"];
    },
    showAllActions: {
      get() {
        return this.$store.getters["cheats/showAllActions"];
      },
      set(value) {
        this.$store.commit("cheats/setShowAllActions", value);
      }
    },
    unlockAllJobs: {
      get() {
        return this.$store.getters["cheats/unlockAllJobs"];
      },
      set(value) {
        this.$store.commit("cheats/setUnlockAllJobs", value);
      }
    },
    infiniteChrono: {
      get() {
        return this.$store.getters["cheats/infiniteChrono"];
      },
      set(value) {
        this.$store.commit("cheats/setInfiniteChrono", value);
      }
    },
    extraChronoOptions: {
      get() {
        return this.$store.getters["cheats/extraChronoOptions"];
      },
      set(value) {
        this.$store.commit("cheats/setExtraChronoOptions", value);
      }
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
    exportDataClicked() {
      const file = new Blob([JSON.stringify(reducer(this.$store.state))], {
        type: "text/plain"
      });
      const el = document.createElement("a");
      const url = URL.createObjectURL(file);
      el.href = url;
      el.download = "SpaceStationIdleSave.json";
      document.body.appendChild(el);
      el.click();
      setTimeout(function () {
        document.body.removeChild(el);
        window.URL.revokeObjectURL(url);
      }, 0);
      EventBus.$emit("toast", { text: this.$t("toast.exported"), duration: 3000 });
      if (this.$store.getters["chrono/oldExport"]) {
        this.$store.dispatch("chrono/resetLastExport");
        EventBus.$emit("toast", { text: this.$t("toast.exportBonus"), duration: 4500 });
      }
    },
    importDataChanged(event) {
      this.fileData = null;
      const files = event.target.files;
      if (!files || files.length === 0) return;
      const reader = new FileReader();
      reader.addEventListener("load", (loadEvent) => {
        this.fileData = loadEvent.target.result;
      });
      reader.readAsText(files[0]);
    },
    importDataClicked() {
      if (!this.fileData) {
        EventBus.$emit("toast", { text: this.$t("toast.noImport"), duration: 3000 });
        return;
      }
      this.$store.dispatch("setData", JSON.parse(this.fileData));
      this.$store.dispatch("chrono/updateOfflineTime");
      EventBus.$emit("toast", { text: this.$t("toast.imported"), duration: 3000 });
    },
    resetDataClicked() {
      this.$modal.show(ModalResetData, {}, { height: "auto", width: "320px" });
    },
    openEnableCheats() {
      this.$modal.show(ModalEnableCheats, {}, { height: "auto", width: "420px" });
    },
    openItemSpawner() {
      this.$store.commit("setVisibleSidebarItem", "item-spawner");
    },
    openLevelAllJobs() {
      this.$modal.show(ModalLevelAllJobs, {}, { height: "auto", width: "320px" });
    },
    openSkillLeveler() {
      this.$modal.show(ModalSkillLeveler, {}, { height: "auto", width: "320px" });
    },
    getSomeCash() {
      this.$store.commit("inventory/changeItemCount", {
        itemId: "money",
        count: 1000000
      });
    },
    completeCurrentValidhuntingTask() {
      this.$store.dispatch("validhunting/completeTask", true);
      EventBus.$emit("toast", { text: this.$t("toast.taskComplete"), duration: 3000 });
    },
    giveResearchPoints() {
      this.$store.dispatch("research/cheatPoints", { root: true });
      EventBus.$emit("toast", { text: this.$t("toast.pointsAdded"), duration: 3000 });
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
  width: 320px;
  max-height: calc(100vh - 16px);
  overflow: auto;
  background: rgba(20, 24, 30, 0.96);
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
  margin-bottom: 8px;
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
.cheats-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none !important;
}
hr {
  border-color: #5b6b7a;
  margin: 8px 0;
}
h6 {
  margin: 0 0 6px;
}
</style>

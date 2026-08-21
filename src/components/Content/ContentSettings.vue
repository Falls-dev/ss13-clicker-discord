<template>
  <div class="content-settings">
    <content-header
      :text="$t('nav.settings')"
      :icon="require('@/assets/art/sidebar/gear.png')"
      color="rgb(231, 150, 28)"
    />
    <div class="content-container">
      <div class="row">
        <div class="col-12">
          <div class="content-block">
            <h5>{{ $t('settings.title') }}</h5>
            <hr />
            <div class="d-flex my-2 align-items-center">
              <span class="mr-2">{{ $t('settings.language') }}</span>
              <button class="btn btn-sm" :class="locale === 'en' ? 'btn-primary' : 'btn-secondary'" @click="setLang('en')">{{ $t('settings.english') }}</button>
              <button class="btn btn-sm ml-1" :class="locale === 'ru' ? 'btn-primary' : 'btn-secondary'" @click="setLang('ru')">{{ $t('settings.russian') }}</button>
            </div>
            <div class="mb-2">
              <h6>{{ $t('settings.cloudSave') }}</h6>
              <p class="mb-1">{{ cloudStatus }}</p>
              <p class="mb-1">{{ $t('settings.cloudLastSync', { time: lastSyncLabel }) }}</p>
              <button type="button" class="btn btn-primary my-1 d-block" @click="forceCloudSave">{{ $t('settings.forceSync') }}</button>
            </div>
            <button
              type="button"
              class="btn btn-primary my-1 d-block"
              @click="resetInfoClicked"
            >{{ $t('settings.resetTutorials') }}</button>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/sidebar/backpack.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="inventoryFullStop"
                  type="checkbox"
                  class="custom-control-input"
                  id="inventoryFullStop"
                />
                <label
                  class="custom-control-label"
                  for="inventoryFullStop"
                >{{ $t('settings.inventoryFullStop') }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/combat/items/ammo_b1.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="pocketsEmptyStop"
                  type="checkbox"
                  class="custom-control-input"
                  id="pocketsEmptyStop"
                />
                <label
                  class="custom-control-label"
                  for="pocketsEmptyStop"
                >{{ $t('settings.pocketsEmptyStop') }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/misc/shadowling.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="darkMode"
                  type="checkbox"
                  class="custom-control-input"
                  id="darkMode"
                />
                <label class="custom-control-label" for="darkMode">{{ $t('settings.darkMode') }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/chrono/icon.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="chronoPanelEnabled"
                  type="checkbox"
                  class="custom-control-input"
                  id="chronoPanelEnabled"
                />
                <label
                  class="custom-control-label"
                  for="chronoPanelEnabled"
                >{{ $t('settings.chronoPanel') }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/engineering/icon.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="showVirtualLevels"
                  type="checkbox"
                  class="custom-control-input"
                  id="showVirtualLevels"
                />
                <label
                  class="custom-control-label"
                  for="showVirtualLevels"
                >{{ $t('settings.showVirtualLevels', { level: maxLevel }) }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/combat/items/cloak/cloakmining.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="showXPNeeded"
                  type="checkbox"
                  class="custom-control-input"
                  id="showXPNeeded"
                />
                <label
                  class="custom-control-label"
                  for="showXPNeeded"
                >{{ $t('settings.showXPNeeded') }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/botany/seed.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="showFullValues"
                  type="checkbox"
                  class="custom-control-input"
                  id="showFullValues"
                />
                <label
                  class="custom-control-label"
                  for="showFullValues"
                >{{ $t('settings.showFullValues') }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/sidebar/trophy.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="showCompletionLines"
                  type="checkbox"
                  class="custom-control-input"
                  id="showCompletionLines"
                />
                <label
                  class="custom-control-label"
                  for="showCompletionLines"
                >{{ $t('settings.showCompletionLines') }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/shitposting/ghost.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="hideLockedJobs"
                  type="checkbox"
                  class="custom-control-input"
                  id="hideLockedJobs"
                />
                <label
                  class="custom-control-label"
                  for="hideLockedJobs"
                >{{ $t('settings.hideLockedJobs') }}</label>
              </div>
            </div>

            <div class="d-flex my-1">
              <img class="mx--2 mr-1" :src="require('@/assets/art/research/tools/toolGraytiding.png')" />
              <div class="custom-control custom-switch">
                <input
                  v-model="allButOne"
                  type="checkbox"
                  class="custom-control-input"
                  id="allButOne"
                />
                <label
                  class="custom-control-label"
                  for="allButOne"
                >{{ $t('settings.allButOne') }}</label>
              </div>
            </div>

            <button
              type="button"
              class="btn btn-primary my-1 d-block"
              @click="exportDataClicked"
            >{{ $t('settings.exportData') }}</button>
            <div class="d-flex flex-row align-items-center">
              <button
                type="button"
                class="btn btn-danger my-1 d-block flex-shrink-0 mr-2"
                :class="{'cheats-disabled': !fileData}"
                @click="importDataClicked"
              >{{ $t('settings.importData') }}</button>
              <input
                type="file"
                class="form-control-file"
                accept="application/JSON"
                @change="importDataChanged"
              />
            </div>
            <button
              type="button"
              class="btn btn-danger my-1 d-block"
              @click="resetDataClicked"
            >{{ $t('settings.resetAll') }}</button>
          </div>
        </div>
        <div class="col-12 mt-3">
          <div class="content-block">
            <h5>{{ $t('cheats.title') }}</h5>
            <hr />
            <button
              v-if="!cheatsEnabled"
              type="button"
              class="btn btn-danger my-1 d-block"
              @click="openEnableCheats"
            >{{ $t('cheats.enable') }}</button>
            <div :class="{'cheats-disabled': !cheatsEnabled}">
              <button
                type="button"
                class="btn btn-primary my-1 d-block"
                @click="openItemSpawner"
              >{{ $t('cheats.itemSpawner') }}</button>
              <button
                type="button"
                class="btn btn-primary my-1 d-block"
                @click="getSomeCash"
              >{{ $t('cheats.getCash') }}</button>
              <div class="custom-control custom-switch">
                <input
                  v-model="showAllActions"
                  type="checkbox"
                  class="custom-control-input"
                  id="showAllActions"
                />
                <label class="custom-control-label" for="showAllActions">{{ $t('cheats.showAllActions') }}</label>
              </div>
              <div class="custom-control custom-switch">
                <input
                  v-model="unlockAllJobs"
                  type="checkbox"
                  class="custom-control-input"
                  id="unlockAllJobs"
                />
                <label class="custom-control-label" for="unlockAllJobs">{{ $t('cheats.unlockAllJobs') }}</label>
              </div>
              <div class="custom-control custom-switch">
                <input
                  v-model="infiniteChrono"
                  type="checkbox"
                  class="custom-control-input"
                  id="infiniteChrono"
                />
                <label class="custom-control-label" for="infiniteChrono">{{ $t('cheats.infiniteChrono') }}</label>
              </div>
              <div class="custom-control custom-switch">
                <input
                  v-model="extraChronoOptions"
                  type="checkbox"
                  class="custom-control-input"
                  id="extraChronoOptions"
                />
                <label
                  class="custom-control-label"
                  for="extraChronoOptions"
                >{{ $t('cheats.extraChrono') }}</label>
              </div>
              <button
                type="button"
                class="btn btn-primary my-1 d-block"
                @click="openSkillLeveler"
              >{{ $t('cheats.levelJobs') }}</button>
              <button
                type="button"
                class="btn btn-primary my-1 d-block"
                @click="openLevelAllJobs"
              >{{ $t('cheats.maxJobs') }}</button>
              <button
                type="button"
                class="btn btn-primary my-1 d-block"
                @click="completeCurrentValidhuntingTask"
              >{{ $t('cheats.completeHunt') }}</button>
              <button
                type="button"
                class="btn btn-primary my-1 d-block"
                @click="giveResearchPoints"
              >{{ $t('cheats.giveResearch') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/utils/eventBus.js";
import ContentAbstract from "@/components/Content/ContentAbstract";
import ModalResetData from "@/components/Modals/ModalResetData";
import ModalLevelAllJobs from "@/components/Modals/ModalLevelAllJobs";
import ModalSkillLeveler from "@/components/Modals/ModalSkillLeveler";
import ModalEnableCheats from "@/components/Modals/ModalEnableCheats";
import { MAX_LEVEL } from "@/data/experience";
import { setLocale } from "@/i18n";
import { discordState } from "@/discord/activity";
import { cloudState, pushToCloud } from "@/cloud/save";

import ENEMIES from "@/data/enemies";
import { calcRobustness } from "@/utils/combatUtils";
import { reducer } from "@/state/store";

export default {
  extends: ContentAbstract,
  data() {
    return {
      fileData: null
    };
  },
  computed: {
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
    },
    showVirtualLevels: {
      get() {
        return this.$store.getters["settings/showVirtualLevels"];
      },
      set(value) {
        this.$store.commit("settings/setShowVirtualLevels", value);
      }
    },
    showXPNeeded: {
      get() {
        return this.$store.getters["settings/showXPNeeded"];
      },
      set(value) {
        this.$store.commit("settings/setShowXPNeeded", value);
      }
    },
    showFullValues: {
      get() {
        return this.$store.getters["settings/showFullValues"];
      },
      set(value) {
        this.$store.commit("settings/setShowFullValues", value);
      }
    },
    showCompletionLines: {
      get() {
        return this.$store.getters["settings/showCompletionLines"];
      },
      set(value) {
        this.$store.commit("settings/setShowCompletionLines", value);
      }
    },
    hideLockedJobs: {
      get() {
        return this.$store.getters["settings/hideLockedJobs"];
      },
      set(value) {
        this.$store.commit("settings/setHideLockedJobs", value);
      }
    },
    inventoryFullStop: {
      get() {
        return this.$store.getters["settings/inventoryFullStop"];
      },
      set(value) {
        this.$store.commit("settings/setInventoryFullStop", value);
      }
    },
    pocketsEmptyStop: {
      get() {
        return this.$store.getters["settings/pocketsEmptyStop"];
      },
      set(value) {
        this.$store.commit("settings/setPocketsEmptyStop", value);
      }
    },
    allButOne: {
      get() {
        return this.$store.getters["settings/allButOne"];
      },
      set(value) {
        this.$store.commit("settings/setAllButOne", value);
      }
    },
    chronoPanelEnabled: {
      get() {
        return this.$store.getters["settings/chronoPanelEnabled"];
      },
      set(value) {
        this.$store.commit("settings/setChronoPanelEnabled", value);
      }
    },
    darkMode: {
      get() {
        return this.$store.getters["settings/darkMode"];
      },
      set(value) {
        this.$store.commit("settings/setDarkMode", value);
      }
    },
    cheatsEnabled() {
      return this.$store.getters["cheats/cheatsEnabled"];
    },
    maxLevel() {
      return MAX_LEVEL;
    },
    locale() {
      return this.$i18n.locale;
    },
    cloudStatus() {
      const user = discordState.user;
      if (user) {
        return this.$t("settings.cloudSignedIn", {
          name: user.global_name || user.username || user.id
        });
      }
      return this.$t("settings.cloudGuest");
    },
    lastSyncLabel() {
      if (!cloudState.lastSync) return this.$t("settings.cloudNever");
      return new Date(cloudState.lastSync).toLocaleString();
    }
  },
  methods: {
    setLang(locale) {
      setLocale(locale);
      this.$store.commit("settings/setLocale", locale);
    },
    forceCloudSave() {
      pushToCloud(this.$store, false);
    },
    openEnableCheats() {
      this.$modal.show(
        ModalEnableCheats,
        {},
        { height: "auto", width: "420px" }
      );
    },
    resetInfoClicked() {
      this.$store.commit("info/resetAll");
      EventBus.$emit("toast", { text: this.$t("toast.tutorialsReset"), duration: 3000 });
    },
    exportDataClicked() {
      let file = new Blob([JSON.stringify(reducer(this.$store.state))], {
        type: "text/plain"
      });

      let el = document.createElement("a");
      let url = URL.createObjectURL(file);
      el.href = url;
      el.download = "SpaceStationIdleSave.json";
      document.body.appendChild(el);
      el.click();
      setTimeout(function() {
        document.body.removeChild(el);
        window.URL.revokeObjectURL(url);
      }, 0);

      EventBus.$emit("toast", { text: this.$t("toast.exported"), duration: 3000 });
      if(this.$store.getters["chrono/oldExport"]){
        this.$store.dispatch("chrono/resetLastExport");
        EventBus.$emit("toast", { text: this.$t("toast.exportBonus"), duration: 4500 });
      }
    },
    importDataChanged(event) {
      this.fileData = null;

      let files = event.target.files;
      if (files.length == 0) {
        return;
      }

      let reader = new FileReader();
      reader.addEventListener("load", event => {
        this.fileData = event.target.result;
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
    openItemSpawner() {
      this.$store.commit("setVisibleSidebarItem", "item-spawner");
    },
    openLevelAllJobs() {
      this.$modal.show(
        ModalLevelAllJobs,
        {},
        { height: "auto", width: "320px" }
      );
    },
    openSkillLeveler() {
      this.$modal.show(
        ModalSkillLeveler,
        {},
        { height: "auto", width: "320px" }
      );
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

      // In case I ever want to simulate this again:
      // let table = [
      //   ["Player Level", "Target", "Target Robust", "Count", "XP Reward"]
      // ];
      // let totalKills = 0;
      // let totalDamage = 0;
      // let pushTable = () => {
      //   let enemy = ENEMIES[this.$store.getters["validhunting/targetEnemyId"]];
      //   table.push([
      //     this.$store.getters["validhunting/level"],
      //     enemy.name,
      //     calcRobustness(enemy.stats, "enemy"),
      //     this.$store.getters["validhunting/targetCount"],
      //     this.$store.getters["validhunting/xpReward"].toLocaleString()
      //   ]);
      //   totalDamage += enemy.stats.maxHealth * this.$store.getters["validhunting/targetCount"];
      // };
      // while (this.$store.getters["validhunting/level"] < 50) {
      //   pushTable();
      //   totalKills += this.$store.getters["validhunting/targetCount"];
      //   this.$store.dispatch("validhunting/completeTask", true);
      // }
      // pushTable();
      // console.table(table);
      // console.log("Total damage:", totalDamage);
      // console.log("Final kill count:", totalKills);
    },
    giveResearchPoints() {
      this.$store.dispatch("research/cheatPoints", { root: true });
      EventBus.$emit("toast", { text: this.$t("toast.pointsAdded"), duration: 3000 });
    }
  }
};
</script>

<style scoped>
.cheats-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none !important;
}
.cheats-disabled * {
  pointer-events: none !important;
}
</style>

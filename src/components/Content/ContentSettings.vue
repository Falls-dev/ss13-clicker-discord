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
              <button
                v-if="showRetryLogin"
                type="button"
                class="btn btn-secondary my-1 d-block"
                @click="retryLogin"
              >{{ $t('settings.retryLogin') }}</button>
              <button type="button" class="btn btn-primary my-1 d-block" @click="forceCloudSave">{{ $t('settings.forceSync') }}</button>
              <p v-if="authLogText" class="mb-1 mt-2">{{ $t('settings.authLog') }}</p>
              <pre v-if="authLogText" class="auth-log mt-0 mb-0">{{ authLogText }}</pre>
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

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/utils/eventBus.js";
import ContentAbstract from "@/components/Content/ContentAbstract";
import { MAX_LEVEL } from "@/data/experience";
import { setLocale } from "@/i18n";
import { discordState, getSessionToken, retryDiscordLogin } from "@/discord/activity";
import { cloudState, pushToCloud } from "@/state/cloudSave";

export default {
  extends: ContentAbstract,
  data() {
    return {
      discordState,
      cloudState
    };
  },
  computed: {
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
    maxLevel() {
      return MAX_LEVEL;
    },
    locale() {
      return this.$i18n.locale;
    },
    cloudStatus() {
      const user = this.discordState.user;
      const token = getSessionToken() || this.discordState.sessionToken;
      if (user || token) {
        const name = user && (user.global_name || user.username || user.id);
        return this.$t("settings.cloudSignedIn", {
          name: name || this.$t("settings.cloudDiscordUser")
        });
      }
      if (this.discordState.active) return this.$t("settings.cloudDiscordFailed");
      return this.$t("settings.cloudGuest");
    },
    lastSyncLabel() {
      if (!this.cloudState.lastSync) return this.$t("settings.cloudNever");
      return new Date(this.cloudState.lastSync).toLocaleString();
    },
    showRetryLogin() {
      if (!this.discordState.active) return false;
      return !(this.discordState.user || getSessionToken() || this.discordState.sessionToken);
    },
    authLogText() {
      const lines = this.discordState.authLog || [];
      if (!lines.length) return "";
      return lines
        .map(function (line) {
          const data = line.data ? " " + JSON.stringify(line.data) : "";
          return (line.t || "") + " " + (line.msg || "") + data;
        })
        .join("\n");
    }
  },
  methods: {
    setLang(locale) {
      setLocale(locale);
      this.$store.commit("settings/setLocale", locale);
    },
    async retryLogin() {
      try {
        await retryDiscordLogin();
        if (getSessionToken() || this.discordState.sessionToken) {
          pushToCloud(this.$store, true);
        }
      } catch (err) {
        EventBus.$emit("toast", { text: this.$t("settings.cloudDiscordFailed"), duration: 3000 });
      }
    },
    forceCloudSave() {
      pushToCloud(this.$store, false);
    },
    resetInfoClicked() {
      this.$store.commit("info/resetAll");
      EventBus.$emit("toast", { text: this.$t("toast.tutorialsReset"), duration: 3000 });
    }
  }
};
</script>

<style scoped>
.auth-log {
  max-height: 220px;
  overflow: auto;
  padding: 0.6rem 0.7rem;
  font-size: 11px;
  line-height: 1.35;
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
}
</style>

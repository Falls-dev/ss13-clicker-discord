<template>
  <div>
    <content-header :text="$jobName(job)" :icon="job.icon" :color="job.color" />
    <div class="content-container">
      <div class="row mb-4 sticky">
        <div class="col-md-8 col-lg-9 col-xl-10">
          <experience-header :color="job.color" :jobId="jobId" />
        </div>
        <div class="mt-2 mt-md-0 col-md-4 col-lg-3 col-xl-2">
          <potion-header :jobId="jobId" />
        </div>
      </div>

      <job-info
        infoId="botany"
        :icon="require('@/assets/art/jobinfo/botany.png')"
        title="Daisy Holmes the Botanist says..."
        :options="[
					{name: 'Back'},
					{name: 'Seeds?', icon: require('@/assets/art/botany/seed.png'), iconClass:'mx--2'},
					{name: 'Plants?', icon: require('@/assets/art/botany/PlantPepperhot.png'), iconClass:'mx--2'},
					{name: 'Stats?', icon: require('@/assets/art/combat/precision.png'), iconClass:'mx--0'}
				]"
      >
        <template slot="Back">
          <i18n path="flavor.botany.back1" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/botany/icon.png')" />
            <b place="name">{{ $t('flavor.botany.botanist') }}</b>
          </i18n>
          <i18n path="flavor.botany.back2" tag="span">
            <img class="mx--2" place="icon" :src="require('@/assets/art/botany/PlantPepperhot.png')" />
            <b place="name">{{ $t('flavor.botany.plants') }}</b>
          </i18n>
        </template>
        <template slot="Seeds?">
          <i18n path="flavor.botany.seeds1" tag="span">
            <img class="mx--2" place="icon" :src="require('@/assets/art/botany/PlantPepperhot.png')" />
            <b place="name">{{ $t('flavor.botany.plant') }}</b>
          </i18n>
          <i18n path="flavor.botany.seeds2" tag="span">
            <img class="mx--0" place="cargoIcon" :src="require('@/assets/art/sidebar/cargo.png')" />
            <b place="cargo">{{ $t('flavor.botany.cargo') }}</b>
            <img class="mx--2" place="cashIcon" :src="require('@/assets/art/misc/coin-padded.png')" />
            <b place="cash">{{ $t('flavor.botany.cash') }}</b>
          </i18n>
        </template>
        <template slot="Plants?">
          <i18n path="flavor.botany.plantsHeal" tag="span">
            <img class="mx--2" place="plantIcon" :src="require('@/assets/art/botany/PlantPepperhot.png')" />
            <b place="plants">{{ $t('flavor.botany.plants') }}</b>
            <img class="mx--0" place="hpIcon" :src="require('@/assets/art/combat/health.gif')" />
            <b place="health">{{ $t('flavor.botany.health') }}</b>
          </i18n>
          <i18n path="flavor.botany.cook" tag="span">
            <i place="natural">{{ $t('flavor.botany.cookNatural') }}</i>
            <img class="mx--2" place="icon" :src="require('@/assets/art/cooking/icon.png')" />
            <b place="name">{{ $t('flavor.botany.cookVerb') }}</b>
          </i18n>
        </template>
        <template slot="Stats?">
          <span>{{ $t('flavor.botany.eat') }}</span>
          <i18n path="flavor.botany.statsFood" tag="span">
            <img class="mx--2" place="foodIcon" :src="require('@/assets/art/botany/PlantPepperhot.png')" />
            <b place="food">{{ $t('flavor.botany.food') }}</b>
            <img class="mx--0" place="s1" :src="require('@/assets/art/combat/precision.png')" />
            <img class="mx--1" place="s2" :src="require('@/assets/art/combat/skull.png')" />
            <img class="mx--2" place="s3" :src="require('@/assets/art/combat/black_shoes.png')" />
            <b place="stats">{{ $t('flavor.botany.combatStats') }}</b>
          </i18n>
          <i18n path="flavor.botany.statsEquip" tag="span">
            <img class="mx--0" place="s1" :src="require('@/assets/art/combat/precision.png')" />
            <img class="mx--1" place="s2" :src="require('@/assets/art/combat/skull.png')" />
            <img class="mx--2" place="s3" :src="require('@/assets/art/combat/black_shoes.png')" />
            <b place="stat">{{ $t('flavor.botany.stat') }}</b>
            <img class="mx--2" place="foodIcon" :src="require('@/assets/art/botany/PlantPepperhot.png')" />
            <b place="food">{{ $t('flavor.botany.food') }}</b>
          </i18n>
        </template>
      </job-info>

      <div class="row my-3" v-if="this.$store.getters['upgrades/get']('botanyTrays')">
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
          <div class="content-block">
            <div class="d-flex flex-row align-items-center">
              <img :src="require('@/assets/art/botany/upgrade1.png')" />
              <h5 class="mb-1">{{ $t('ui.upgrades') }}</h5>
            </div>
            <div class="custom-control custom-switch mt-1">
              <input
                v-model="upgradeLeftEnabled"
                type="checkbox"
                class="custom-control-input"
                id="upgradeLeftEnabled"
              />
              <label class="custom-control-label" for="upgradeLeftEnabled">{{ $t('ui.upgradeLeft') }}</label>
            </div>
            <div
              class="custom-control custom-switch mt-1"
              v-if="this.$store.getters['upgrades/get']('botanyTrays') > 1"
            >
              <input
                v-model="upgradeRightEnabled"
                type="checkbox"
                class="custom-control-input"
                id="upgradeRightEnabled"
              />
              <label class="custom-control-label" for="upgradeRightEnabled">{{ $t('ui.upgradeRight') }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="tier row" v-for="(tierEntries, tier) in viewableTieredActions" :key="tier">
        <div class="col-12">
          <span class="tier-text">{{ $t('ui.tier', { n: tier+1 }) }}</span>
        </div>
        <div
          class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
          v-for="[actionId, action] in tierEntries"
          :key="actionId"
        >
          <generic-action
            :jobId="jobId"
            :actionName="'GROW'"
            :action="action"
            :actionId="actionId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findLastIndex } from "lodash";
import { JOB } from "@/data/botany";
import ContentAbstract from "@/components/Content/ContentAbstract";
import ExperienceHeader from "@/components/Content/ExperienceHeader";
import PotionHeader from "@/components/Content/PotionHeader";
import GenericAction from "@/components/Content/GenericAction";
import { mapState } from "vuex";
export default {
  extends: ContentAbstract,
  components: { GenericAction, ExperienceHeader, PotionHeader },
  computed: {
    jobId() {
      return "botany";
    },
    job() {
      return JOB;
    },
    viewableTieredActions() {
      let entries = this.$store.getters[this.jobId + "/filteredActionEntries"];

      let highestTier = 0;
      entries.forEach(entry => {
        highestTier = Math.max(entry[1].tier, 0);
      });
      let tiers = [];
      for (let t = 0; t < highestTier; t++) tiers.push([]);

      for (let entry of entries) {
        let tier = entry[1].tier;
        tiers[tier - 1].push(entry);
      }

      return tiers;
    },
    upgradeLeftEnabled: {
      get() {
        return this.$store.getters["botany/upgradeLeftEnabled"];
      },
      set(value) {
        this.$store.commit("botany/setUpgradeLeftEnabled", value);
      }
    },
    upgradeRightEnabled: {
      get() {
        return this.$store.getters["botany/upgradeRightEnabled"];
      },
      set(value) {
        this.$store.commit("botany/setUpgradeRightEnabled", value);
      }
    }
  }
};
</script>


<style scoped>
.tier-text {
  font-size: 20;
  font-weight: bold;
  color: rgba(245, 245, 245, 0.555);
}
</style>
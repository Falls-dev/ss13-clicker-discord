<template>
  <div class="d-flex flex-column align-items-center">
    <div class="stats-panel d-flex flex-row flex-wrap justify-content-center">
      <stat-panel-item
        :name="$t('combat.maxHealth')"
        :description="$t('combat.maxHealthDesc')"
        :icon="require('@/assets/art/combat/health.gif')"
        :value="fixedStats.maxHealth"
      />
      <stat-panel-item
        :name="$t('combat.regen')"
        :description="$t('combat.regenDesc')"
        :icon="require('@/assets/art/combat/regen.gif')"
        :value="fixedStats.regen"
      />
      <stat-panel-item
        :name="$t('jobs.evasion')"
        :description="$t('combat.evasionDesc')"
        :icon="require('@/assets/art/combat/black_shoes.png')"
        :value="fixedStats.evasion"
      />
      <stat-panel-item
        :name="$t('jobs.command')"
        :description="$t('combat.commandDesc')"
        :icon="require('@/assets/art/combat/command.png')"
        :value="fixedStats.command"
      />
      <stat-panel-item
        :name="$t('combat.bruteProtection')"
        :description="$t('combat.bruteProtectionDesc')"
        :icon="require('@/assets/art/combat/armor-brute.png')"
        :value="fixedStats.bruteProtection"
        :showPercent="true"
      />
      <stat-panel-item
        :name="$t('combat.burnProtection')"
        :description="$t('combat.burnProtectionDesc')"
        :icon="require('@/assets/art/combat/armor-burn.png')"
        :value="fixedStats.burnProtection"
        :showPercent="true"
      />
      <stat-panel-item
        :name="$t('jobs.precision')"
        :description="$t('combat.precisionDesc')"
        :icon="require('@/assets/art/combat/precision.png')"
        :value="fixedStats.precision"
      />
      <stat-panel-item
        :name="$t('combat.power')"
        :description="$t('combat.powerDesc')"
        :icon="require('@/assets/art/combat/skull.png')"
        :value="fixedStats.power"
      />
      <stat-panel-item
        :name="$t('combat.luck')"
        :description="$t('combat.luckDesc')"
        :icon="require('@/assets/art/combat/luck.png')"
        :value="fixedStats.luck"
        :showPercent="true"
      />
      <div
        v-if="stats.damageType"
        :id="id+'-damage-type'"
        class="attack-type stat-detail d-flex flex-row align-items-center"
      >
        <span class="mr-1">{{ $t('combat.type') }}</span>
        <img class="attack-type-image mr-1" :src="damageTypeImage" />
      </div>
    </div>
    <b-popover
      v-if="stats.damageType"
      :target="id+'-damage-type'"
      triggers="hover"
      placement="top"
      delay="0"
      :customClass="`${$store.getters['settings/darkModeClass']} no-pointer-events`"
    >
      <div class="d-flex flex-column align-items-center">
        <h6>{{ $t('combat.damageType', { type: stats.damageType.toUpperCase() }) }}</h6>
        <span>{{ $t('combat.damageTypeDesc', { type: stats.damageType }) }}</span>
      </div>
    </b-popover>
  </div>
</template>

<script>
import { clone } from "lodash";
import { fixProtection } from "@/utils/combatUtils";
import StatPanelItem from "@/components/Content/Combat/StatPanelItem";

const BRUTE_ICON = require("@/assets/art/combat/brute-damage.png");
const BURN_ICON = require("@/assets/art/combat/burn-damage.png");

export default {
  props: ["stats", "showAll"],
  components: { StatPanelItem },
  computed: {
    id() {
      return this._uid.toString();
    },
    fixedStats() {
      let fixedStats = clone(this.stats);
      return fixProtection(fixedStats);
    },
    damageTypeImage() {
      return this.stats.damageType == "brute" ? BRUTE_ICON : BURN_ICON;
    },
  },
};
</script>

<style scoped>
.no-pointer-events {
  pointer-events: none;
}
.stats-panel {
  max-width: 160px;
  min-width: 130px;
}
.attack-type-image {
  min-width: 15px;
  width: 15px;
  height: 15px;
}

.stat-detail,
.stats-panel >>> .stat-detail {
  display: inline-block;
  width: 50%;
  min-width: 64px;
  padding: 2px 4px;
  border: 1px solid rgba(149, 154, 185, 0.246);
  background-color: rgba(124, 200, 255, 0.24);
  min-height: 36px;
}
</style>
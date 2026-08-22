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
        infoId="graytiding"
        :icon="require('@/assets/art/jobinfo/graytiding.png')"
        title="Lexia Black the Assistant says..."
        :options="[
					{name: 'Back'},
					{name: '&quot;Graytiding&quot;?', icon: require('@/assets/art/graytiding/icon.png'), iconClass:'mx--0'},
					{name: 'Loot?', icon: require('@/assets/art/graytiding/junk.png'), iconClass:'mx--0'},
					{name: 'Risk?', icon: require('@/assets/art/jobinfo/shitcurity.png'), iconClass:'mx--1'},
          {name: '&quot;Cleaning&quot;?', icon: require('@/assets/art/jobinfo/janitor.png'), iconClass:'mx--1'},
				]"
      >
        <template slot="Back">
          <span>
            Some may say
            <img class="mx--0" :src="require('@/assets/art/graytiding/icon.png')" />
            <b>Graytiding</b>. isn't a
            <i>real</i> job.
          </span>
          <span>{{ $t('flavor.graytiding.right') }}</span>
          <span>{{ $t('flavor.graytiding.art') }}</span>
        </template>
        <template slot="&quot;Graytiding&quot;?">
          <span>{{ $t('flavor.graytiding.funding') }}</span>
          <span>{{ $t('flavor.graytiding.take') }}</span>
          <span>
            <img class="mx--0" :src="require('@/assets/art/jobinfo/shitcurity.png')" />
            <b>Some</b> may call it theft, but others recognize it for the art it is as
            <i>"Graytiding"</i>.
          </span>
        </template>
        <template slot="Loot?">
          <span>
            When you're under pressure, you'll probably only be able to snag some
            <img
              class="mx--0"
              :src="require('@/assets/art/graytiding/junk.png')"
            />
            <b>Junk</b> before you'll find
            <img
              class="mx--0"
              :src="require('@/assets/art/jobinfo/shitcurity.png')"
            />
            <b>Security</b> on your tail.
          </span>
          <span>
            Maybe you can find some use for it with a bit of
            <img
              class="mx--2"
              :src="require('@/assets/art/tinkering/icon.png')"
            />
            <b>Tinkering</b>.
          </span>
          <span>
            Beyond that, what you'll find will really depend on the
            <img
              class="mx--0"
              :src="require('@/assets/art/graytiding/Mining.png')"
            />
            <b>Department</b> you're raiding.
          </span>
          <span>
            Oh, and be on the look out for
            <img
              class="mx--0"
              :src="require('@/assets/art/combat/items/limb/glove_yellow.png')"
            />
            <b>Gloves</b> and
            <img class="mx--2" :src="require('@/assets/art/combat/items/limb/shoe_jackboots.png')" />
            <b>Shoes</b>. They're especially rare.
          </span>
        </template>
        <template slot="Risk?">
          <span>{{ $t('flavor.graytiding.legal') }}</span>
          <span>
            If you get caught, our friends at
            <img
              class="mx--0"
              :src="require('@/assets/art/jobinfo/shitcurity.png')"
            />
            <b>Shitcurity</b> will be sure to teach you a lesson.
          </span>
          <span>
            Best to stock up on some
            <img
              class="mx--2"
              :src="require('@/assets/art/cooking/burger1.png')"
            />
            <b>Food</b> to keep your
            <img class="mx--0" :src="require('@/assets/art/combat/health.gif')" />
            <b>Health</b> up.
            <img class="mx--0" :src="require('@/assets/art/botany/icon.png')" />
            <b>Botany</b> and
            <img class="mx--0" :src="require('@/assets/art/cooking/icon.png')" />
            <b>Cooking</b> can help you there.
          </span>
          <span>
            One more thing, if you don't already have one, you should consider picking up an
            <img
              class="mx--0"
              :src="require('@/assets/art/combat/upgrades/autoeat.png')"
            />
            <b>Auto-Eat Upgrade</b> from
            <img class="mx--0" :src="require('@/assets/art/sidebar/cargo.png')" />
            <b>Cargo</b>.
          </span>
        </template>
        <template slot="&quot;Cleaning&quot;?">
          <i18n path="flavor.graytiding.disguise" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/graytiding/icon.png')" />
            <b place="name">{{ $t('flavor.graytiding.graytiders') }}</b>
          </i18n>
          <i18n path="flavor.graytiding.blind" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/jobinfo/janitor.png')" />
            <b place="name">{{ $t('flavor.graytiding.janitor') }}</b>
          </i18n>
          <i18n path="flavor.graytiding.slip" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/chemistry/lube.png')" />
            <b place="name">{{ $t('flavor.graytiding.slipName') }}</b>
          </i18n>
          <i18n path="flavor.graytiding.galoshes" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/research/galoshes.png')" />
            <b place="name">{{ $t('flavor.graytiding.galoshesName') }}</b>
            <img class="mx--0" place="researchIcon" :src="require('@/assets/art/research/researchJobIcon.png')" />
            <b place="research">{{ $t('flavor.graytiding.researchName') }}</b>
          </i18n>
        </template>
      </job-info>


      <!-- Health/food box -->
      <div class="row food my-2">
        <div class="col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4">
          <div class="content-block">
            <progress-bar
              class="mb-2 black-background"
              :progress="health / maxHealth"
              :text="`${Math.round(health)}/${maxHealth}`"
              :customClass="'bg-danger'"
            />
            <food-panel />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        class="tier row"
        v-for="(typedEntry, tier) in Object.entries(viewableTypedActionEntries)"
        :key="tier"
      >
        <div class="col-12">
          <span class="type-text text-uppercase">{{ $actionType(typedEntry[0]) }}</span>
        </div>
        <div
          class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
          v-for="[actionId, action] in typedEntry[1]"
          :key="actionId"
        >
          <generic-action
            :jobId="jobId"
            :actionName="'GRAYTIDE'"
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
import { JOB } from "@/data/graytiding";
import ContentAbstract from "@/components/Content/ContentAbstract";
import ExperienceHeader from "@/components/Content/ExperienceHeader";
import GenericAction from "@/components/Content/GenericAction";
import PotionHeader from "@/components/Content/PotionHeader";
import ProgressBar from "@/components/ProgressBar";
import FoodPanel from "@/components/Content/Combat/FoodPanel";
import { mapState } from "vuex";
export default {
  extends: ContentAbstract,
  components: {
    GenericAction,
    ExperienceHeader,
    PotionHeader,
    ProgressBar,
    FoodPanel
  },
  computed: {
    jobId() {
      return "graytiding";
    },
    job() {
      return JOB;
    },
    viewableTypedActionEntries() {
      let entries = this.$store.getters[this.jobId + "/filteredActionEntries"];

      let toReturn = {}; // type: [entries]
      for (let entry of entries) {
        let type = entry[1].type;
        if (!toReturn[type]) toReturn[type] = [entry];
        else toReturn[type].push(entry);
      }
      return toReturn;
    },
    health() {
      return this.$store.getters["playerMob/health"];
    },
    maxHealth() {
      return this.$store.getters["playerMob/stats"].maxHealth;
    }
  }
};
</script>


<style scoped>
.type-text {
  font-size: 20;
  font-weight: bold;
  color: rgba(245, 245, 245, 0.555);
}
</style>
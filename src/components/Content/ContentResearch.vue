<template>
  <div>

    <!-- Top bar with job icon/name (values loaded from src/data/research.js) -->
    <content-header :text="$jobName(job)" :icon="job.icon" :color="job.color" />


    <div class="content-container">

      <!-- XP bar and chem slot -->
      <div class="row mb-4 sticky">
        <div class="col-md-8 col-lg-9 col-xl-10">
          <experience-header :color="job.color" :jobId="jobId" />
        </div>
        <div class="mt-2 mt-md-0 col-md-4 col-lg-3 col-xl-2">
          <potion-header :jobId="jobId" />
        </div>
      </div>

      <!-- Tutorial box -->
      <job-info
        infoId="research"
        :icon="require('@/assets/art/jobinfo/research.png')"
        title="Magni Bronzebeard the Research Director says..."
        :options="[
          {name: 'Back'},
          {name: 'Research?', icon: require('@/assets/art/research/researchIcon.png'), iconClass:'mx--0'},
		      {name: 'Development?', icon: require('@/assets/art/research/protolathe.png'), iconClass:'mx--0'},
		      {name: 'TOOLs?', icon: require('@/assets/art/research/tools/toolGraytiding.png'), iconClass:'mx--0'},
          {name: 'Destructive Analyzer?', icon: require('@/assets/art/research/destructive_analyzer.gif'), iconClass:'mx--0'},
          {name: 'Points Bank?', icon: require('@/assets/art/research/points_bank.gif'), iconClass:'mx--0'},
        ]"
      >
        <template slot="Back">
          <span>
            Who let you in here? You're not a scientist. Oh, well... I suppose as long as you bring us 
            <img
              :src="require('@/assets/art/mining/SheetDiamond.png')"
            />
            <b>Precious Ores,</b> I'll let you use our Research and Development facilities.
          </span>
        </template>
        <template slot="Research?">
          <span>{{ $t('flavor.research.strive') }}</span>
          <i18n path="flavor.research.analyzer" tag="span">
            <img place="icon" :src="require('@/assets/art/research/destructive_analyzer.gif')" />
            <b place="name">{{ $t('flavor.research.analyzerName') }}</b>
          </i18n>
          <span>{{ $t('flavor.research.stuck') }}</span>
        </template>
        <template slot="Development?">
          <i18n path="flavor.research.tools" tag="span">
            <img place="icon" :src="require('@/assets/art/research/tools/toolGraytiding.png')" />
            <b place="name">{{ $t('flavor.research.toolsName') }}</b>
          </i18n>
          <span>{{ $t('flavor.research.example') }}</span>
        </template>
        <template slot="TOOLs?">
          <i18n path="flavor.research.chems" tag="span">
            <img class="mx--2" place="icon" :src="require('@/assets/art/chemistry/faunaPerfume.png')" />
            <b place="name">{{ $t('flavor.research.chemsName') }}</b>
          </i18n>
          <span>{{ $t('flavor.research.useTool') }}</span>
          <span>{{ $t('flavor.research.noBoth') }}</span>
        </template>
        <template slot="Destructive Analyzer?">
          <span>{{ $t('flavor.research.feed') }}</span>
          <i18n path="flavor.research.mouth" tag="span">
            <img place="icon" :src="require('@/assets/art/research/destructive_analyzer.gif')" />
            <b place="name">{{ $t('flavor.research.analyzerName') }}</b>
          </i18n>
          <span>{{ $t('flavor.research.reroll') }}</span>
          <span>{{ $t('flavor.research.recipes') }}</span>
        </template>
        <template slot="Points Bank?">
          <i18n path="flavor.research.points" tag="span">
            <img place="icon" :src="require('@/assets/art/research/researchIcon.png')" />
            <b place="name">{{ $t('flavor.research.pointsName') }}</b>
          </i18n>
          <i18n path="flavor.research.bank" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/sidebar/cargo.png')" />
            <b place="name">{{ $t('flavor.research.cargo') }}</b>
          </i18n>
          <span>{{ $t('flavor.research.level') }}</span>
        </template>
      </job-info>

      <!-- Research bank bar -->
      <div class="row mb-2">
        <div class="col-md-8 col-lg-9 col-xl-12">
          <research-bank :color="job.color" :jobId="jobId" />
        </div>
      </div>

      <!-- Bounty Box -->
      <div class="content-block d-flex flex-column align-items-center">
        <h5>
          <img
            :src="require('@/assets/art/research/destructive_analyzer.gif')"
          />
          <b> Destructive Analyzer </b>
          <img
            :src="require('@/assets/art/research/destructive_analyzer.gif')"
          />
        </h5>

        <div class="enemies w-100 mt-2">
          <research-bounty
          />
        </div>

      </div>

      <!-- Actions (generated from actions defined in src/data/research.js) -->

      <div
        class="tier row"
        v-for="(typedEntry, tier) in Object.entries(viewableTypedActionEntries)"
        :key="tier"
      >
        <div class="col-12">
          <span class="type-text text-uppercase">{{typedEntry[0]}}</span>
        </div>
        <div
          class="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
          v-for="[actionId, action] in typedEntry[1]"
          :key="actionId"
        >
          <generic-action
            :jobId="jobId"
            :actionName="'DEVELOP'"
            :action="action"
            :actionId="actionId"
          />
        </div>
      </div>

      <!-- Shop sections -->
      <div class="row">
        <div class="col-12">
          <shop-section v-for="(section, index) in sections" :key="index" :section="section" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { findLastIndex } from "lodash";
import { JOB } from "@/data/research";
import ContentAbstract from "@/components/Content/ContentAbstract";
import ExperienceHeader from "@/components/Content/ExperienceHeader";
import ResearchBank from "@/components/Content/ResearchBank";
import PotionHeader from "@/components/Content/PotionHeader";
import GenericAction from "@/components/Content/GenericAction";
import { mapState } from "vuex";
import ShopSection from "@/components/Content/Shop/ShopSection";
import { SECTIONS } from "@/data/recipesShop";//Dictates which file to load shop sections from
import ResearchBounty from "@/components/Content/ResearchBounty";
export default {
  extends: ContentAbstract,
  components: { GenericAction, ExperienceHeader, ResearchBank, PotionHeader, ShopSection, ResearchBounty },
  computed: {
    jobId() {
      return "research";
    },
    job() {
      return JOB;
    },
    viewableActions() {
      return this.$store.getters[this.jobId + "/filteredActionEntries"];
    },
    sections() {//Enables shop sections to load properly
      return SECTIONS;
    },
    rndPoints() {
      return this.$store.getters["research/rndPoints"];
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
  }
};
</script>

<style scoped>
.type-text {
  font-size: 20;
  font-weight: bold;
  color: rgba(245, 245, 245, 0.555);
}
img {
  width: 32px;
}
</style>

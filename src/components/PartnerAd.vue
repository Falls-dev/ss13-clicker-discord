<template>
  <div v-if="ad" class="partner-ad">
    <p class="mb-1">{{ ad.text }}</p>
    <a :href="ad.url" @click.prevent="open">{{ ad.url }}</a>
  </div>
</template>

<script>
import { openExternalLink } from "@/discord/activity";

const ADS = [
  {
    id: "darkParadise",
    url: "https://discord.gg/zB6uB7Qkt"
  },
  {
    id: "tgmc",
    url: "https://discord.gg/KHvHxgJdr"
  }
];

export default {
  name: "PartnerAd",
  props: {
    force: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ad() {
      if (!this.force && !this.$store.getters["chrono/showPartnerAd"]) return null;
      const away = this.$store.getters["chrono/lastAway"] || Date.now();
      const pick = ADS[Math.abs(Math.floor(away / 60000)) % ADS.length];
      return {
        text: this.$t("partner." + pick.id),
        url: pick.url
      };
    }
  },
  methods: {
    open() {
      if (this.ad) openExternalLink(this.ad.url);
    }
  }
};
</script>

<style scoped>
.partner-ad {
  margin-top: 0.75rem;
  padding: 0.6rem 0.75rem;
  max-width: 420px;
  background: rgba(28, 160, 221, 0.12);
  border: 1px solid rgba(28, 160, 221, 0.45);
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
}
.partner-ad a {
  color: #3ac5ff;
  word-break: break-all;
}
</style>

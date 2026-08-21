<template>
  <button class="btn btn-primary d-flex flex-column align-items-center" @click="completeTask">
    <p>{{ $t('toast.taskComplete') }}</p>
    <div>
      <span class="mr-1 validhunting-desc">{{ $t('combat.reward') }}</span>
      <span>+{{validhuntingXP | cleanNum}}</span>
      <img :src="validhuntingIcon" />
      <span>XP</span>
    </div>
  </button>
</template>

<script>
import { JOB as VALIDHUNTING_JOB } from "@/data/validhunting";
export default {
  computed: {
    validhuntingXP() {
      return this.$store.getters["validhunting/xpReward"];
    },
    validhuntingIcon() {
      return VALIDHUNTING_JOB.icon;
    }
  },
  methods: {
    completeTask() {
      this.$store.dispatch("validhunting/completeTask");
    }
  }
};
</script>
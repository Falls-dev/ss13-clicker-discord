<template>
  <div class="d-flex flex-column align-items-center m-3 text-center">
    <h3 class="text-center mb-3">{{ $t('modal.welcomeTitle') }}</h3>
    <span>{{ $t('modal.welcomeBody') }}</span>
    <span class="mt-2 description">{{ $t('modal.welcomeGained') }}</span>
    <span>{{gainText}}</span>
    <span class="mt-2 description">{{ $t('modal.welcomeTime') }}</span>
    <span>{{remainingTimeText}}</span>
    <span v-if="oldExport"><br><b class="chrono">{{ $t('modal.welcomeExport') }}</b></span>
    <button class="btn btn-primary mt-3" @click="confirmationClicked">{{ $t('modal.ok') }}</button>
  </div>
</template>

<script>
export default {
  computed: {
    remainingTimeText() {
      return this.$store.getters["chrono/remainingTimeText"];
    },
    gainText() {
      return this.$store.getters["chrono/lastGainText"];
    },
    oldExport() {
      return this.$store.getters["chrono/oldExport"];
    }
  },
  methods: {
    confirmationClicked() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.chrono {
  color: rgb(28, 160, 221);
  max-width: 130px;
  font-size: 14px;
}
</style>

<template>
  <div class="d-flex flex-column align-items-center m-5">
    <h3 class="text-center">{{ $t('modal.cheatsTitle') }}</h3>

    <div class="cheater my-3">
      <p>{{ $t('modal.cheatsLine1') }}</p>
      <p>{{ $t('modal.cheatsLine2') }}</p>
      <p>{{ $t('modal.cheatsLine3') }}</p>
      <p>{{ $t('modal.cheatsLine4') }}</p>
      <p>{{ $t('modal.cheatsLine5') }}</p>
      <p>{{ $t('modal.cheatsLine6') }}</p>
    </div>

    <h5 class="mb-3">{{ $t('modal.cheatsIrreversible') }}</h5>

    <button class="btn btn-danger" @click="enableCheats">{{ $t('modal.cheatsEnable') }}</button>
  </div>
</template>

<script>
export default {
  methods: {
    enableCheats() {
      this.$store.commit("cheats/enableCheats");
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.cheater {
  margin: auto;
  text-align: center;
  font-style: italic;
  color: rgb(179, 179, 179);
  font-size: 14px;
}
</style>
<template>
  <div class="d-flex flex-column align-items-center m-5">
    <h3 class="text-center mb-4">{{ $t('modal.resetTitle') }}</h3>
    <button class="btn btn-danger" @click="resetClicked">{{ $t('modal.resetButton') }}</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["resetData"]),
    resetClicked() {
      this.resetData();
      this.$emit("close");
    }
  }
};
</script>

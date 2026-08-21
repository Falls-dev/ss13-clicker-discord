<template>
  <div class="d-flex flex-column align-items-center p-3 text-center">
    <h4 class="my-1">{{ $t('modal.deathTitle') }}</h4>
    <img class="mx--0 crit" :src="require('@/assets/art/combat/health-crit.gif')" />
    <div v-if="lostItem">
      <p>{{ $t('modal.deathStolen') }}</p>
      <h4>{{ $t('modal.deathLost') }}</h4>
      <h4>
        <img class="mx--0" :src="lostItem.icon" />
        {{lostItem.name}}!
      </h4>
    </div>
    <div v-else>
      <p class="my-2">{{ $t('modal.deathNothingEquipped') }}</p>
      <h4>{{ $t('modal.deathNothing') }}</h4>
    </div>
  </div>
</template>

<script>
import ITEMS from "@/data/items";

export default {
  props: ["lostItemId"],
  computed: {
    lostItem() {
      return ITEMS[this.lostItemId];
    }
  }
};
</script>

<style scoped>
.crit {
  width: 64px;
  margin-bottom: -1.5rem;
}
</style>
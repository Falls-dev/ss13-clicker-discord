<template>
  <div class="content-shop">
    <content-header :text="$t('nav.cargo')" :icon="require('@/assets/art/sidebar/cargo.png')" color="#febb33" />
    <div class="content-container">
      <job-info
        infoId="shop"
        :icon="require('@/assets/art/jobinfo/shop.png')"
        title="Brick Carr the Quartermaster says..."
        :options="[
					{name: 'Back'},
					{name: 'Inventory?', icon: require('@/assets/art/sidebar/backpack.png'), iconClass:'mx--1'},
					{name: 'Seeds?', icon: require('@/assets/art/botany/seed.png'), iconClass:'mx--1'},
					{name: 'New Jobs?', icon: require('@/assets/art/cooking/icon.png'), iconClass:'mx--1'},
					{name: 'Job Upgrades?', icon: require('@/assets/art/mining/upgrade1.png'), iconClass:'mx--1'},
					{name: 'Gambling?', icon: require('@/assets/art/shop/items/hatcrate.png'), iconClass:'mx--1'},
					{name: 'Capes?', icon: require('@/assets/art/combat/items/cloak/capcloak.png'), iconClass:'mx--1'},
					{name: 'Resistance?', icon: require('@/assets/art/jobinfo/cargo_banner.png'), iconClass:'mx--1'}
				]"
      >
        <template slot="Back">
          <span>{{ $t('flavor.shop.back1') }}</span>
          <span>{{ $t('flavor.shop.back2') }}</span>
        </template>
        <template slot="Inventory?">
          <i18n path="flavor.shop.inventory1" tag="span">
            <img class="mx--2" place="icon" :src="require('@/assets/art/sidebar/backpack.png')" />
            <b place="name">{{ $t('flavor.shop.inventorySpace') }}</b>
          </i18n>
          <span>{{ $t('flavor.shop.inventory2') }}</span>
        </template>
        <template slot="Seeds?">
          <i18n path="flavor.shop.seeds1" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/botany/icon.png')" />
            <b place="name">{{ $t('jobs.botany') }}</b>
          </i18n>
          <span>{{ $t('flavor.shop.seeds2') }}</span>
        </template>
        <template slot="New Jobs?">
          <i18n path="flavor.shop.jobs1" tag="span">
            <span place="icons">
              <img class="mx--0" :src="require('@/assets/art/cooking/icon.png')" />
              <img class="mx--0" :src="require('@/assets/art/xenobio/icon.gif')" />
              <img class="mx--0" :src="require('@/assets/art/shitposting/icon.png')" />
            </span>
            <b place="name">{{ $t('flavor.shop.jobsWord') }}</b>
          </i18n>
          <span>{{ $t('flavor.shop.jobs2') }}</span>
        </template>
        <template slot="Job Upgrades?">
          <span>{{ $t('flavor.shop.upgrades1') }}</span>
          <span>{{ $t('flavor.shop.upgrades2') }}</span>
          <i18n path="flavor.shop.upgrades3" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/validhunting/icon.png')" />
            <b place="name">{{ $t('flavor.shop.combatExpertise') }}</b>
          </i18n>
        </template>

        <template slot="Capes?">
          <i18n path="flavor.shop.capes1" tag="span">
            <img class="mx--2" place="icon" :src="require('@/assets/art/combat/items/cloak/capcloak.png')" />
            <b place="name">{{ $t('flavor.shop.cape') }}</b>
          </i18n>
          <i18n path="flavor.shop.capes2" tag="span">
            <img class="mx--2" place="icon" :src="require('@/assets/art/combat/items/cloak/capcloak.png')" />
            <b place="name">{{ $t('flavor.shop.capesWord') }}</b>
            <img class="mx--0" place="upgradeIcon" :src="require('@/assets/art/mining/upgrade1.png')" />
            <b place="upgrade">{{ $t('flavor.shop.upgradeWord') }}</b>
          </i18n>
        </template>
        <template slot="Gambling?">
          <span>{{ $t('flavor.shop.gambling1') }}</span>
          <span>{{ $t('flavor.shop.gambling2') }}</span>
          <i18n path="flavor.shop.gambling3" tag="span">
            <img class="mx--0" place="icon" :src="require('@/assets/art/shop/items/hatcrate.png')" />
            <b place="name">{{ $t('flavor.shop.hatCrate') }}</b>
          </i18n>
        </template>
        <template slot="Resistance?">
          <span>{{ $t('flavor.shop.resistance1') }}</span>
          <span>{{ $t('flavor.shop.resistance2') }}</span>
        </template>
      </job-info>

      <div class="row">
        <div class="col-12">
          <shop-section v-for="(section, index) in sections" :key="index" :section="section" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentAbstract from "@/components/Content/ContentAbstract";
import ShopSection from "@/components/Content/Shop/ShopSection";
import { SECTIONS } from "@/data/shop";
export default {
  extends: ContentAbstract,
  components: { ShopSection },
  computed: {
    sections() {
      return SECTIONS;
    }
  }
};
</script>

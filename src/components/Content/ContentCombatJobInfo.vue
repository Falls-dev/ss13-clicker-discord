<template>
  <job-info
    infoId="combat"
    :icon="require('@/assets/art/jobinfo/combat.png')"
    title="Fred Best the Head of Security says..."
    :options="[
					{name: 'Back'},
					{name: 'Equipment?', icon: require('@/assets/art/combat/equipment/limb.png'), iconClass:'mx--0'},
					{name: 'Stats?', icon: require('@/assets/art/combat/precision.png'), iconClass:'mx--0'},
					{name: 'Robustness?', icon: require('@/assets/art/jobinfo/robustness.png'), iconClass:'mx--0'},
					{name: 'Health?', icon: require('@/assets/art/combat/health.gif'), iconClass:'mx--0'},
					{name: 'Enemies?', icon: require('@/assets/art/combat/enemies/mouse.png'), iconClass:'mx--2'},
					{name: 'Loot?', icon: require('@/assets/art/misc/coin-padded.png'), iconClass:'mx--2'},
					{name: 'Combat Focus?', icon: require('@/assets/art/jobinfo/combatFocus.png'), iconClass:'mx--1'},
					{name: 'Damage Types?', icon: require('@/assets/art/combat/armor-brute.png'), iconClass:'mx--1'},
					{name: 'Validhunting?', icon: require('@/assets/art/validhunting/icon.png'), iconClass:'mx--1'},
					{name: 'Bosses?', icon: require('@/assets/art/combat/enemies/boss/legion3_anim.gif'), iconClass:'mx--1'},
					{name: 'Legality?', icon: require('@/assets/art/jobinfo/spacelaw.png'), iconClass:'mx--2'}
				]"
  >
    <template slot="Back">
      <i18n path="flavor.combat.mouse" tag="span">
        <img class="mx--2" place="mouseIcon" :src="require('@/assets/art/combat/enemies/mouse.png')" />
        <b place="mouse">{{ $t('flavor.combat.mouseName') }}</b>
        <img class="mx--0 legion" place="bossIcon" :src="require('@/assets/art/combat/enemies/boss/legion3_anim.gif')" />
        <b place="boss">{{ $t('flavor.combat.bossName') }}</b>
      </i18n>
      <span>{{ $t('flavor.combat.back1') }}</span>
    </template>
    <template slot="Equipment?">
      <span>{{ $t('flavor.combat.equipment1') }}</span>
      <i18n path="flavor.combat.equipped" tag="span">
        <img class="mx--0" place="icon" :src="require('@/assets/art/combat/equipment/limb.png')" />
        <b place="name">{{ $t('flavor.combat.equippedName') }}</b>
      </i18n>
      <i18n path="flavor.combat.eqWeapon" tag="span">
        <img class="mx--0" place="weaponIcon" :src="require('@/assets/art/combat/equipment/hand.png')" />
        <b place="weapon">{{ $t('flavor.combat.weapon') }}</b>
        <img class="mx--0" place="chestIcon" :src="require('@/assets/art/combat/equipment/chest.png')" />
        <b place="chest">{{ $t('flavor.combat.chest') }}</b>
      </i18n>
      <i18n path="flavor.combat.eqSource" tag="span">
        <img class="mx--0" place="tinkerIcon" :src="require('@/assets/art/tinkering/icon.png')" />
        <b place="tinkering">{{ $t('flavor.combat.tinkering') }}</b>
        <img class="mx--0" place="fabIcon" :src="require('@/assets/art/fabrication/icon.png')" />
        <b place="fabrication">{{ $t('flavor.combat.fabrication') }}</b>
      </i18n>
    </template>
    <template slot="Stats?">
      <i18n path="flavor.combat.statsIntro" tag="span">
        <img class="mx--0" place="eqIcon" :src="require('@/assets/art/combat/equipment/limb.png')" />
        <b place="equipment">{{ $t('flavor.combat.equipment') }}</b>
        <img class="mx--0" place="focusIcon" :src="require('@/assets/art/jobinfo/combatFocus.png')" />
        <b place="focus">{{ $t('flavor.combat.focus') }}</b>
      </i18n>
      <li>
        <i18n path="flavor.combat.precisionDesc" tag="span">
          <img class="mx--0" place="icon" :src="require('@/assets/art/combat/precision.png')" />
          <b place="name">{{ $t('flavor.combat.precision') }}</b>
        </i18n>
      </li>
      <li>
        <i18n path="flavor.combat.powerDesc" tag="span">
          <img class="mx--2" place="icon" :src="require('@/assets/art/combat/skull.png')" />
          <b place="name">{{ $t('flavor.combat.power') }}</b>
        </i18n>
        <i18n path="flavor.combat.powerSkills" tag="span">
          <img class="mx--0" place="meleeIcon" :src="require('@/assets/art/combat/meleePower.png')" />
          <b place="melee">{{ $t('flavor.combat.melee') }}</b>
          <img class="mx--0" place="gunIcon" :src="require('@/assets/art/combat/rangedPower.png')" />
          <b place="guns">{{ $t('flavor.combat.guns') }}</b>
          <img class="mx--0" place="eqIcon" :src="require('@/assets/art/combat/equipment/limb.png')" />
          <b place="equipment">{{ $t('flavor.combat.equipment') }}</b>
        </i18n>
      </li>
      <li>
        <i18n path="flavor.combat.evasionDesc" tag="span">
          <img class="mx--2" place="icon" :src="require('@/assets/art/combat/black_shoes.png')" />
          <b place="name">{{ $t('flavor.combat.evasion') }}</b>
        </i18n>
      </li>
      <li>
        <i18n path="flavor.combat.commandDesc" tag="span">
          <img class="mx--2" place="icon" :src="require('@/assets/art/combat/command.png')" />
          <b place="name">{{ $t('flavor.combat.command') }}</b>
        </i18n>
      </li>
      <i18n path="flavor.combat.eqOnly" tag="span">
        <img class="mx--0" place="icon" :src="require('@/assets/art/combat/equipment/limb.png')" />
        <b place="equipment">{{ $t('flavor.combat.equipment') }}</b>
      </i18n>
      <li>
        <i18n path="flavor.combat.maxHealthDesc" tag="span">
          <img class="mx--0" place="icon" :src="require('@/assets/art/combat/health.gif')" />
          <b place="name">{{ $t('flavor.combat.maxHealth') }}</b>
        </i18n>
      </li>
      <li>
        <i18n path="flavor.combat.regenDesc" tag="span">
          <img class="mx--0" place="icon" :src="require('@/assets/art/combat/regen.gif')" />
          <b place="name">{{ $t('flavor.combat.regen') }}</b>
        </i18n>
      </li>
      <li>
        <i18n path="flavor.combat.protDesc" tag="span">
          <img class="mx--1" place="bruteIcon" :src="require('@/assets/art/combat/armor-brute.png')" />
          <b place="brute">{{ $t('flavor.combat.bruteProt') }}</b>
          <img class="mx--1" place="burnIcon" :src="require('@/assets/art/combat/armor-burn.png')" />
          <b place="burn">{{ $t('flavor.combat.burnProt') }}</b>
        </i18n>
      </li>
      <li>
        <i18n path="flavor.combat.luckDesc" tag="span">
          <img class="mx--0" place="icon" :src="require('@/assets/art/combat/luck.png')" />
          <b place="name">{{ $t('flavor.combat.luck') }}</b>
        </i18n>
      </li>
    </template>
    <template slot="Robustness?">
      <i18n path="flavor.combat.robustIntro" tag="span">
        <img class="mx--0" place="icon" :src="require('@/assets/art/jobinfo/robustness.png')" />
        <b place="name">{{ $t('flavor.combat.robustName') }}</b>
        <img class="mx--0" place="s1" :src="require('@/assets/art/combat/precision.png')" />
        <img class="mx--1" place="s2" :src="require('@/assets/art/combat/skull.png')" />
        <img class="mx--2" place="s3" :src="require('@/assets/art/combat/black_shoes.png')" />
        <b place="stats">{{ $t('flavor.combat.stats') }}</b>
      </i18n>
      <i18n path="flavor.combat.robustRule" tag="span">
        <img class="mx--0" place="icon" :src="require('@/assets/art/jobinfo/robustness.png')" />
        <b place="name">{{ $t('flavor.combat.robust') }}</b>
      </i18n>
    </template>
    <template slot="Health?">
      <i18n path="flavor.combat.healthCrit" tag="span">
        <img class="mx--0" place="icon" :src="require('@/assets/art/combat/health-crit.gif')" />
        <b place="name">{{ $t('flavor.combat.crit') }}</b>
      </i18n>
      <i18n path="flavor.combat.stolen" tag="span">
        <img class="mx--2" place="someoneIcon" :src="require('@/assets/art/jobinfo/inventory.png')" />
        <b place="someone">{{ $t('flavor.combat.someone') }}</b>
        <img class="mx--0" place="eqIcon" :src="require('@/assets/art/combat/equipment/limb.png')" />
        <b place="equipment">{{ $t('flavor.combat.equipment') }}</b>
      </i18n>
      <i18n path="flavor.combat.healthKeep" tag="span">
        <img class="mx--0" place="hpIcon" :src="require('@/assets/art/combat/health.gif')" />
        <b place="health">{{ $t('flavor.combat.health') }}</b>
        <img class="mx--2" place="foodIcon" :src="require('@/assets/art/cooking/burger1.png')" />
        <b place="food">{{ $t('flavor.combat.food') }}</b>
        <img class="mx--0" place="botanyIcon" :src="require('@/assets/art/botany/icon.png')" />
        <b place="botany">{{ $t('flavor.combat.botany') }}</b>
        <img class="mx--0" place="cookIcon" :src="require('@/assets/art/cooking/icon.png')" />
        <b place="cooking">{{ $t('flavor.combat.cooking') }}</b>
      </i18n>
    </template>
    <template slot="Enemies?">
      <i18n path="flavor.combat.enemiesPick" tag="span">
        <img class="mx--0" place="zoneIcon" :src="require('@/assets/art/combat/zones/maint.png')" />
        <b place="zones">{{ $t('flavor.combat.zones') }}</b>
        <img class="mx--2" place="targetIcon" :src="require('@/assets/art/combat/enemies/mouse.png')" />
        <b place="target">{{ $t('flavor.combat.target') }}</b>
      </i18n>
      <i18n path="flavor.combat.enemiesCareful" tag="span">
        <img class="mx--0" place="icon" :src="require('@/assets/art/jobinfo/robustness.png')" />
        <b place="robust">{{ $t('flavor.combat.robust') }}</b>
      </i18n>
      <i18n path="flavor.combat.enemiesValid" tag="span">
        <img class="mx--2" place="icon" :src="require('@/assets/art/validhunting/icon.png')" />
        <b place="validhunting">{{ $t('flavor.combat.validhunting') }}</b>
      </i18n>
    </template>
    <template slot="Loot?">
      <i18n path="flavor.combat.lootKill" tag="span">
        <img class="mx--2" place="enemyIcon" :src="require('@/assets/art/combat/enemies/mouse.png')" />
        <b place="enemy">{{ $t('flavor.combat.enemy') }}</b>
        <img class="mx--2" place="lootIcon" :src="require('@/assets/art/misc/coin-padded.png')" />
        <b place="loot">{{ $t('flavor.combat.loot') }}</b>
      </i18n>
      <i18n path="flavor.combat.lootStuff" tag="span">
        <img class="mx--2" place="moneyIcon" :src="require('@/assets/art/misc/coin-padded.png')" />
        <b place="money">{{ $t('flavor.combat.money') }}</b>
        <img class="mx--2" place="meatIcon" :src="require('@/assets/art/cooking/meatAnimal.png')" />
        <b place="meats">{{ $t('flavor.combat.meats') }}</b>
        <img class="mx--2" place="stuffIcon" :src="require('@/assets/art/combat/items/face_clown.png')" />
        <b place="stuff">{{ $t('flavor.combat.stuff') }}</b>
        <img class="mx--2" place="enemyIcon" :src="require('@/assets/art/combat/enemies/mouse.png')" />
        <b place="enemy">{{ $t('flavor.combat.enemyPossess') }}</b>
      </i18n>
      <i18n path="flavor.combat.lootCollect" tag="span">
        <img class="mx--2" place="lootIcon" :src="require('@/assets/art/misc/coin-padded.png')" />
        <b place="loot">{{ $t('flavor.combat.loot') }}</b>
        <img class="mx--0" place="runIcon" :src="require('@/assets/art/combat/run.png')" />
        <b place="run">{{ $t('flavor.combat.runAway') }}</b>
      </i18n>
    </template>
    <template slot="Combat Focus?">
      <i18n path="flavor.combat.focusSwitch" tag="span">
        <img class="mx--0" place="focusIcon" :src="require('@/assets/art/jobinfo/combatFocus.png')" />
        <b place="focus">{{ $t('flavor.combat.focus') }}</b>
        <img class="mx--0" place="s1" :src="require('@/assets/art/combat/precision.png')" />
        <img class="mx--1" place="s2" :src="require('@/assets/art/combat/skull.png')" />
        <img class="mx--2" place="s3" :src="require('@/assets/art/combat/black_shoes.png')" />
        <b place="stats">{{ $t('flavor.combat.primaryStats') }}</b>
      </i18n>
      <span>{{ $t('flavor.combat.focus1') }}</span>
      <i18n path="flavor.combat.focusXp" tag="span">
        <img class="mx--2" place="icon" :src="require('@/assets/art/combat/enemies/mouse.png')" />
        <b place="enemy">{{ $t('flavor.combat.enemy') }}</b>
      </i18n>
      <i18n path="flavor.combat.focusOverkill" tag="span">
        <img class="mx--2" place="icon" :src="require('@/assets/art/combat/enemies/mouse.png')" />
        <b place="enemy">{{ $t('flavor.combat.enemy') }}</b>
      </i18n>
    </template>
    <template slot="Damage Types?">
      <i18n path="flavor.combat.damageIntro" tag="span">
        <img class="mx--0" place="bruteIcon" :src="require('@/assets/art/combat/brute-damage.png')" />
        <b place="brute">{{ $t('flavor.combat.brute') }}</b>
        <img class="mx--0" place="burnIcon" :src="require('@/assets/art/combat/burn-damage.png')" />
        <b place="burn">{{ $t('flavor.combat.burn') }}</b>
      </i18n>
      <i18n path="flavor.combat.damageWeapon" tag="span">
        <img class="mx--1" place="w1" :src="require('@/assets/art/combat/items/melee_c4.png')" />
        <img class="mx--0" place="w2" :src="require('@/assets/art/combat/items/gune_tesla.png')" />
        <b place="weapon">{{ $t('flavor.combat.weapon') }}</b>
      </i18n>
      <i18n path="flavor.combat.damageProt" tag="span">
        <img class="mx--2" place="p1" :src="require('@/assets/art/combat/armor-brute.png')" />
        <img class="mx--2" place="p2" :src="require('@/assets/art/combat/armor-burn.png')" />
        <b place="protection">{{ $t('flavor.combat.protection') }}</b>
        <img class="mx--0" place="d1" :src="require('@/assets/art/combat/brute-damage.png')" />
        <img class="mx--0" place="d2" :src="require('@/assets/art/combat/burn-damage.png')" />
        <b place="damageType">{{ $t('flavor.combat.damageType') }}</b>
      </i18n>
    </template>
    <template slot="Validhunting?">
      <i18n path="flavor.combat.validTask" tag="span">
        <img class="mx--2" place="icon" :src="require('@/assets/art/validhunting/icon.png')" />
        <b place="name">{{ $t('flavor.combat.validQuoted') }}</b>
      </i18n>
      <i18n path="flavor.combat.validTurnin" tag="span">
        <img class="mx--2" place="enemyIcon" :src="require('@/assets/art/combat/enemies/mouse.png')" />
        <b place="enemies">{{ $t('flavor.combat.enemies') }}</b>
        <img class="mx--2" place="vhIcon" :src="require('@/assets/art/validhunting/icon.png')" />
        <b place="validhunting">{{ $t('flavor.combat.validhunting') }}</b>
      </i18n>
      <i18n path="flavor.combat.validShop" tag="span">
        <img class="mx--2" place="vhIcon" :src="require('@/assets/art/validhunting/icon.png')" />
        <b place="validhunting">{{ $t('flavor.combat.validhunting') }}</b>
        <img class="mx--1" place="jobIcon" :src="require('@/assets/art/mining/upgrade1.png')" />
        <b place="jobs">{{ $t('flavor.combat.jobUpgrades') }}</b>
        <img class="mx--1" place="combatIcon" :src="require('@/assets/art/combat/upgrades/autoeat.png')" />
        <b place="combat">{{ $t('flavor.combat.combatUpgrades') }}</b>
        <img class="mx--0" place="cargoIcon" :src="require('@/assets/art/sidebar/cargo.png')" />
        <b place="cargo">{{ $t('flavor.combat.cargo') }}</b>
      </i18n>
      <i18n path="flavor.combat.validHarder" tag="span">
        <img class="mx--2" place="vhIcon" :src="require('@/assets/art/validhunting/icon.png')" />
        <b place="validhunting">{{ $t('flavor.combat.validhunting') }}</b>
        <img class="mx--0" place="robustIcon" :src="require('@/assets/art/jobinfo/robustness.png')" />
        <b place="robust">{{ $t('flavor.combat.robust') }}</b>
        <img class="mx--0" place="enemyIcon" :src="require('@/assets/art/combat/enemies/ai_anim.gif')" />
        <b place="enemies">{{ $t('flavor.combat.enemies') }}</b>
      </i18n>
    </template>
    <template slot="Bosses?">
      <span>{{ $t('flavor.combat.bosses1') }}</span>
      <i18n path="flavor.combat.bossesBuy" tag="span">
        <img class="mx--1" place="docIcon" :src="require('@/assets/art/validhunting/doc10.png')" />
        <b place="docs">{{ $t('flavor.combat.bountyDocs') }}</b>
        <img class="mx--1" place="enemyIcon" :src="require('@/assets/art/combat/enemies/cargo_tech.png')" />
        <b place="enemies">{{ $t('flavor.combat.enemies') }}</b>
        <img class="mx--0" place="ticketIcon" :src="require('@/assets/art/shop/items/ticket20.png')" />
        <b place="ticket">{{ $t('flavor.combat.ticket') }}</b>
        <img class="mx--0" place="bossIcon" :src="require('@/assets/art/combat/enemies/boss/legion3_anim.gif')" />
        <b place="boss">{{ $t('flavor.combat.boss') }}</b>
      </i18n>
      <i18n path="flavor.combat.bossesDrop" tag="span">
        <img class="mx--0" place="bossIcon" :src="require('@/assets/art/combat/enemies/boss/legion3_anim.gif')" />
        <b place="bosses">{{ $t('flavor.combat.bosses') }}</b>
        <img class="mx--2" place="currIcon" :src="require('@/assets/art/shop/items/telecrystal.png')" />
        <b place="currency">{{ $t('flavor.combat.currency') }}</b>
        <img class="mx--0" place="boxIcon" :src="require('@/assets/art/shop/items/syndiedroppod.png')" />
        <b place="boxes">{{ $t('flavor.combat.lootBoxes') }}</b>
        <img class="mx--0" place="cargoIcon" :src="require('@/assets/art/sidebar/cargo.png')" />
        <b place="cargo">{{ $t('flavor.combat.cargo') }}</b>
      </i18n>
      <i18n path="flavor.combat.bossesGear" tag="span">
        <img class="mx--0" place="eqIcon" :src="require('@/assets/art/combat/equipment/limb.png')" />
        <b place="equipment">{{ $t('flavor.combat.equipment') }}</b>
        <img class="mx--0" place="foodIcon" :src="require('@/assets/art/cooking/burger1.png')" />
        <b place="food">{{ $t('flavor.combat.food') }}</b>
      </i18n>
    </template>
    <template slot="Legality?">
      <span>{{ $t('flavor.combat.legality1') }}</span>
      <i18n path="flavor.combat.legalityHumans" tag="span">
        <img class="mx--2" place="icon" :src="require('@/assets/art/combat/enemies/goodclown.png')" />
        <b place="name">{{ $t('flavor.combat.humanEnemies') }}</b>
      </i18n>
      <span>{{ $t('flavor.combat.legality2') }}</span>
    </template>
  </job-info>
</template>

<script>
import JobInfo from "@/components/Content/JobInfo";
export default {
  components: { JobInfo }
};
</script>

<style scoped>
.legion {
  margin-left: 0.75rem;
  margin-right: 0.75rem;
  animation: MoveUpDown 3s ease-in-out infinite;
}

@media (max-width: 1900px) {
  .legion {
    margin-left: 0rem;
    margin-right: 0rem;
    animation: MoveUpDownSmaller 3s ease-in-out infinite;
  }
}

@keyframes MoveUpDown {
  0%,
  100% {
    transform: scale(2) translate(0px, 4px);
  }
  50% {
    transform: scale(2) translate(0px, -4px);
  }
}
@keyframes MoveUpDownSmaller {
  0%,
  100% {
    transform: scale(1) translate(0px, 2px);
  }
  50% {
    transform: scale(1) translate(0px, -2px);
  }
}

li {
  margin-left: 4px;
  list-style-type: disc;
  list-style-position: inside;
  text-indent: -1.3em;
  padding-left: 1.3em;
  margin: 6px 0px;
}
li span {
  position: relative;
  left: -2px;
}
</style>

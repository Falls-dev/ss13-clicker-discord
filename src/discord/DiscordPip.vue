<template>
  <div class="discord-pip">
    <div class="pip-card">
      <img class="pip-logo" src="@/assets/art/misc/logo-square.png" alt="" />
      <div class="pip-copy">
        <div class="pip-title">SS13 Idle</div>
        <div class="pip-user" v-if="userName">{{ userName }}</div>
        <div class="pip-status">{{ statusText }}</div>
        <div class="pip-meta">
          <span>{{ money | cleanNum }}₡</span>
          <span>{{ playerHealth }}/{{ playerMaxHealth }} HP</span>
          <span v-if="chronoSpeed != 1">{{ chronoSpeed }}x</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ALL_JOBS } from "@/data/jobs";
import ENEMIES from "@/data/enemies";
import { discordState } from "@/discord/activity";

export default {
  name: "DiscordPip",
  computed: {
    userName() {
      const user = discordState.user;
      if (!user) return "";
      return user.global_name || user.username || "";
    },
    money() {
      return this.$store.getters["inventory/money"] || 0;
    },
    playerHealth() {
      return Math.round(this.$store.getters["playerMob/health"] || 0);
    },
    playerMaxHealth() {
      const stats = this.$store.getters["playerMob/stats"];
      return stats && stats.maxHealth ? stats.maxHealth : 0;
    },
    chronoSpeed() {
      return this.$store.getters["chrono/speed"];
    },
    statusText() {
      const enemyId = this.$store.getters["combat/targetEnemy"];
      if (enemyId) {
        const enemy = ENEMIES[enemyId];
        return enemy && enemy.name ? this.$t("pip.fighting", { name: enemy.name }) : this.$t("pip.fighting", { name: enemyId });
      }
      for (let i = 0; i < ALL_JOBS.length; i++) {
        const job = ALL_JOBS[i];
        if (job.isCombat) continue;
        if (this.$store.getters[job.id + "/active"]) {
          return this.$jobName(job);
        }
      }
      return this.$t("pip.idle");
    }
  }
};
</script>

<style scoped>
.discord-pip {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1b222b;
  color: #f2f4f6;
  padding: 8px;
  box-sizing: border-box;
}
.pip-card {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 420px;
  background: #2c343f;
  border-radius: 10px;
  padding: 10px 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}
.pip-logo {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  image-rendering: pixelated;
  flex-shrink: 0;
}
.pip-copy {
  min-width: 0;
  flex: 1;
}
.pip-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.1;
}
.pip-user,
.pip-status,
.pip-meta {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.72);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pip-meta {
  display: flex;
  gap: 8px;
}
</style>

<template>
  <div class="discord-gate">
    <div class="gate-card">
      <img src="@/assets/art/misc/logo.png" alt="" />
      <h2>Space Clicker 13</h2>
      <p>{{ $t("gate.body") }}</p>
      <a class="btn btn-primary" href="https://discord.com/invite/HwbK9XQ" @click="openInvite">
        {{ $t("gate.openDiscord") }}
      </a>
    </div>
  </div>
</template>

<script>
import { openExternalLink } from "@/discord/activity";
export default {
  name: "DiscordGate",
  methods: {
    openInvite(event) {
      event.preventDefault();
      openExternalLink("https://discord.com/invite/HwbK9XQ");
    }
  }
};
</script>

<style scoped>
.discord-gate {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1b222b;
  color: #e8eef3;
  padding: 16px;
  box-sizing: border-box;
}
.gate-card {
  max-width: 420px;
  text-align: center;
  background: #2c343f;
  border-radius: 12px;
  padding: 24px 20px;
}
.gate-card img {
  width: 72px;
  height: 72px;
  image-rendering: pixelated;
  margin-bottom: 12px;
}
.gate-card p {
  margin: 12px 0 18px;
  opacity: 0.85;
}
</style>

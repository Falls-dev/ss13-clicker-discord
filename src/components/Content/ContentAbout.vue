<template>
  <div>
    <content-header
      :text="$t('nav.about')"
      :icon="require('@/assets/art/misc/logo-square.png')"
      color="rgb(150, 150, 150)"
    />
    <div class="content-container">
      <div class="row">
        <div class="col-12">
          <div class="content-block">
            <h4 class="mb-2">{{ $t('about.title') }}</h4>
            <p>
              <img class="no-pixel mx--0" :src="require('@/assets/art/misc/logo-square.png')" />
              {{ $t('about.p1') }}
            </p>
            <p>{{ $t('about.p2') }}</p>
            <p>{{ $t('about.p3') }}</p>
            <p>{{ $t('about.p4') }}</p>
          </div>
          <div class="content-block mt-3">
            <h4 class="mb-3">{{ $t('about.credits') }}</h4>
            <h5>{{ $t('about.developers') }}</h5>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/jobinfo/fabrication.png')" alt />
              <b class="mr-2">Thomas "Tabski" Bartlett:</b>
              <span>{{ $t('about.programming') }}</span>
            </div>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/combat/enemies/badviro.png')" alt />
              <b class="mr-2">Nathan "Nabski" Bartlett:</b>
              <span>{{ $t('about.contentBalance') }}</span>
            </div>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/misc/allFaces.gif')" alt />
              <b class="mr-2">GitHub Contributors:</b>
              <span>{{ $t('about.contributors') }}</span>
            </div>
            <h5 class="mt-3">{{ $t('about.otherPeople') }}</h5>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/misc/melvor.svg')" alt />
              <b class="mr-2">Malcs (aka MrFrux):</b>
              <span>Creator of Melvor Idle, this game's original inspiration</span>
            </div>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/misc/clown.png')" alt />
              <b class="mr-2">The Entire Space Station 13 Community:</b>
              <span>For the creation of all the open source art used in the project</span>
            </div>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/misc/claire.png')" alt />
              <b class="mr-2">Claire "Cemci" Marvinney:</b>
              <span>For the lovingly handpainted background image</span>
            </div>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/combat/enemies/bee_anim.gif')" alt />
              <b class="mr-2">bobbahbrown:</b>
              <span>For his help organizing /tg/station data</span>
            </div>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/combat/enemies/bald_visitor.png')" alt />
              <b class="mr-2">"Jerry Derpington":</b>
              <span>First Playtester</span>
            </div>
            <div class="my-3">
              <img class="mx--0" :src="require('@/assets/art/misc/clark.png')" alt />
              <b class="mr-2">Gogodapogostick,</b>
              <img class="mx--0" :src="require('@/assets/art/misc/orange.png')" alt />
              <b class="mr-2">Citrusgender,</b>
              <img class="mx--0" :src="require('@/assets/art/misc/frog.png')" alt />
              <b class="mr-2">Armhulen,</b> and
              <img class="mx--0" :src="require('@/assets/art/misc/berry.png')" alt />
              <b class="mr-2">Sunberry:</b>
              <span>Second Round Playtesters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentAbstract from "@/components/Content/ContentAbstract";

export default {
  extends: ContentAbstract
};
</script>

<style scoped>
img {
  width: 32px;
}
</style>
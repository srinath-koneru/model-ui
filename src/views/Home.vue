<template>
  <div class="home" style="height: 100%">
    <ModelUI />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ModelUI from "../components/ModelUI.vue";

@Component({
  components: {
    ModelUI,
  },
})
export default class Home extends Vue {}
</script>

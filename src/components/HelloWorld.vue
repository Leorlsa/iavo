<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    msg: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>
h1 {
  font-size: 2em;
}
</style>

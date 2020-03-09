<template>
  <div>
    public-pool1
    <div>
      <router-link :to="'/'">go process-pool</router-link>
    </div>
    <div>
      <a href="/">go process-pool</a>
    </div>
  </div>
</template>
<script>
export default {
  name: "public-pool",
  asyncData({ store }) {
    return store.dispatch("changeTestData");
  },
  created() {
    // console.log(this.$store);
  }
};
</script>

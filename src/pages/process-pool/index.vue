<template>
  <div class="wrap">
    131
    {{text}}
    <input />
    <div>
      <router-link :to="'/public-pool'">go public-pool</router-link>
    </div>
    <div>
      <a href="/public-pool">go public-pool</a>
    </div>
    <!-- <el-form ref="form" :model="form" label-width="80px"></el-form> -->
  </div>
</template>
<script>
export default {
  name: "process-pool",
  asyncData({ store }) {
    return store.dispatch("changeTestData");
  },
  computed: {
    text() {
      return this.$store.state["testData"];
    }
  },
  created() {
    // console.log(this.$store.state);
  }
};
</script>
<style lang="less" scoped>
.wrap {
  color: #f00;
}
.good {
  color: #ff0000;
}
</style>

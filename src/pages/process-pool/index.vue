<template>
  <div class="wrap">
    12311111xxx1
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
  name: "process-pool"
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

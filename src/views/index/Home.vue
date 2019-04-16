<template>
  <div class="index-home-page">
    <template v-if="!isLoading">
      <router-view></router-view>
    </template>
    <template v-else>
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      isLoading: true
    };
  },
  mounted() {
    this.isLoading = false;
  },
  methods: {
    goindex: () => {
      window.location.href = '/index.html';
    }
  }
};
</script>
<style>
@import '../../assets/css/common/reset.css';
@import '../../assets/css/common/common.css';
@import '../../assets/css/index.css';
</style>

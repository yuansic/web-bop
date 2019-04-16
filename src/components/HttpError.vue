<template>
  <div class="fullScreen-http">
    <div v-if="errortype == 403" class="http-error-content error-403">
      <img class="foerror-img" src="../assets/img/http403.jpg" alt="" />
      <div class="mt-20">您没有查看当前页面的权限</div>
      <div>
        <span class="font-default pointer hide" @click="handleBack">返回首页</span>
      </div>
    </div>
    <div v-if="errortype == 404" class="http-error-content error-404">
      <img class="foerror-img" src="../assets/img/http404.jpg" alt="" />
      <div class="mt-20">抱歉！页面找不到了~</div>
      <div>
        <span class="font-default pointer hide" @click="handleBack">返回首页</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      errortype: 403
    };
  },
  created() {
    this.errortype = this.$route.params.code || 403;
  },
  methods: {
    handleBack() {
      // 历史记录后退会出问题
      // window.history.go(-1);
      window.location.href = './index.html';
    }
  }
};
</script>
<style lang="postcss">
.fullScreen-http {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-sizing: border-box;
  .http-error-content {
    position: absolute;
    left: 50%;
    top: 50%;
    text-align: center;
  }
  .error-403 {
    width: 180px;
    margin-left: -90px;
    margin-top: -92.5px;
    .error-img {
      width: 160px;
    }
  }
  .error-404 {
    width: 350px;
    margin-left: -175px;
    margin-top: -100px;
    .error-img {
      width: 342px;
    }
  }
}
</style>

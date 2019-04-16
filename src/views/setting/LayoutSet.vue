<template>
  <div class="layout-set">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>布局设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <div class="item-header">布局设置</div> -->
    <div class="setting-pwdbox">
      <p class="font-orange mb-30">这些设置将应用到所有页面</p>
      <div>
        <span>宽度设置：</span>
        <el-radio-group v-model="g_config.fullScreen" @change="setLayout">
          <el-radio :label="true">全屏</el-radio>
          <el-radio :label="false">居中</el-radio>
        </el-radio-group>
      </div>
      <div class="mt-10">
        <span>左侧菜单：</span>
        <el-radio-group v-model="g_config.isCollapse" @change="setLayout">
          <el-radio :label="false">展开</el-radio>
          <el-radio :label="true">收起</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data: function() {
    return {
      title: ''
    };
  },
  methods: {
    setLayout: function() {
      var g_config = this.$store.state.g_config;
      localStorage.setItem('g_config', JSON.stringify(g_config));
    }
  },
  computed: {
    ...mapState({
      g_config: state => state.g_config
    })
  }
};
</script>
<style></style>

<template>
  <div class="notice-detail">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>消息通知</el-breadcrumb-item>
      <el-breadcrumb-item>系统消息</el-breadcrumb-item>
    </el-breadcrumb>
    <div>{{ title }}</div>
  </div>
</template>

<script>
import Validator from '@/utils/Validator';
import axios from '@/utils/axios';
import api from '@/api/notice.api.js';
export default {
  data: function() {
    return {
      title: '消息内容'
    };
  },
  created() {},
  methods: {}
};
</script>

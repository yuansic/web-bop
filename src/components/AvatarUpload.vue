<template>
  <div>
    <el-upload
      class="avatar-uploader"
      list-type="picture-card"
      :ref="uploadref"
      :action="uploadAction"
      :headers="uploadHeader"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-error="handleError"
      :on-success="handleSuccess"
      :on-change="handleChange"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar-uupload-preview" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div v-if="!hidetip" class="mt-10 font-size13 font-gray">
      请选择
      <span class="font-red">jpg,png,jpeg</span>格式的照片上传,图片质量最大为
      <span class="font-red">{{ imgSize }}M</span>
    </div>
  </div>
</template>
<script>
import api from '@/api/base.api.js';
import Validator from '@/utils/Validator';
export default {
  props: {
    defaultFiles: {
      type: String
    },
    hidetip: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      uploadAction: api.upload,
      uploadHeader: {
        Authorization: localStorage.getItem('Authorization') || ''
      },
      imageUrl: '', // 预览地址bold
      responseUrl: '', // 服务器返回的地址
      imgSize: Validator.imgLimit
    };
  },
  computed: {
    uploadref() {
      return this.ref + 'upload';
    }
  },
  watch: {
    defaultFiles: function(newValue, oldValue) {
      this.imageUrl = newValue;
      this.responseUrl = newValue;
    }
  },
  created() {
    this.imageUrl = this.defaultFiles;
    this.responseUrl = this.defaultFiles;
  },
  methods: {
    // 图片上传前钩子
    beforeUpload(file) {
      // 上传之前 验证文件格式
      const isImage =
        file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';

      const isSize = file.size / 1024 / 1024 < this.imgSize;

      if (!isImage) this.$message.error('上传图片只能是 jpg,png,jpeg 格式!');
      if (!isSize) this.$message.error(`上传图片大小不能超过 ${this.imgSize}MB!`);
      return isImage && isSize;
    },
    // 图片上传出错钩子
    handleError(err, file, fileList) {
      this.$message.error('发生错误，上传失败');
    },
    handleChange(file, fileList) {},
    // 图片上传成功钩子
    handleSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.imageUrl = file.url;
        this.responseUrl = file.response.data.fileUri;
      } else {
        this.$message.error(response.message || '上传失败');
      }
    },
    // 获取upload表单中的上传文件信息
    getUploadFiles(isloc = false) {
      if (isloc) {
        return this.imageUrl || ''; // 取本地blod路径
      } else {
        return this.responseUrl || ''; // 取服务器返回的路径
      }
    }
  }
};
</script>
<style lang="postcss">
.avatar-uploader {
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 106px;
    border-radius: 2px;
  }
  .el-upload--picture-card img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .el-upload-list--picture-card {
    .el-progress {
      width: 80px !important;
    }
    .el-progress-circle {
      width: 80px !important;
    }
    .el-progress {
      top: 75%;
    }
    .el-progress .el-progress__text {
      top: 30%;
    }
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      border-radius: 2px;
    }
  }
}
</style>

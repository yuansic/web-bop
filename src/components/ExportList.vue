<template>
  <span>
    <el-button size="small" class="ml-5" @click="showExportBox">导出表格</el-button>
    <el-dialog title="导出表格" width="400px" center :visible.sync="dialogVisible">
      <div class="text-c mb-5" v-if="!isSelctTime">您未选择时间段，是否确认导出全部查询结果？</div>
      <div v-else>
        <div class="text-c mb-5">是否确认导出以下时段的查询结果？</div>
        <div class="text-c font-size14">
          开始时间：<span class="font-orange">{{ exportFilter.startTime }}</span>
        </div>
        <div class="text-c font-size14">
          结束时间：<span class="font-orange">{{ exportFilter.endTime }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>
// import axios from 'axios';
export default {
  props: {
    exportFilter: {
      type: Object
    },
    count: {
      type: Number,
      default: 0
    },
    exportUrl: {
      type: String
    }
  },
  data: function() {
    return {
      dialogVisible: false
    };
  },
  computed: {
    isSelctTime: function() {
      if (this.exportFilter.startTime && this.exportFilter.endTime != '') {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    showExportBox() {
      if (this.count == 0) {
        this.$message.error('未查询到数据');
        return;
      }
      this.dialogVisible = true;
    },
    exportSubmit() {
      const token = localStorage.getItem('Authorization') || '';

      let exportListUrl = this.exportUrl;
      exportListUrl += '?token=' + token;
      for (const filter in this.exportFilter) {
        if (this.exportFilter.hasOwnProperty(filter)) {
          exportListUrl += '&' + filter + '=' + this.exportFilter[filter];
        }
      }
      this.dialogVisible = false;
      window.location.href = exportListUrl;

      // axios({
      //     method: 'GET',
      //     url: this.exportUrl,
      //     params: this.exportFilter,
      //     backself: true,
      //     responseType: 'blob'
      // }).then((response) => {
      //     this.dialogVisible = false;
      //     var blob = new Blob([response], { type: 'application/vnd.ms-excel' });
      //     var objectUrl = URL.createObjectURL(blob);
      //     let link = document.createElement('a');
      //     link.style.display = 'none';
      //     link.href = objectUrl;
      //     link.setAttribute('download', '文件.xls');
      //     document.body.appendChild(link);
      //     link.click();
      //     document.body.removeChild(link);
      // });
    }
  }
};
</script>

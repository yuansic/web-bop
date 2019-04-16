/*
 * 列表页混入对象
 * pageNo: 页码
 * pageSize: 每页条数
 * tableOptions:工具栏筛选字段
 * sendOptions:发送请求实际字段
 * */
var listMixin = {
  data() {
    return {
      pageNo: 1,
      pageSize: 20,
      tableOptions: {},
      sendOptions: {}
    };
  },
  methods: {
    // 筛选查询
    handleSearch() {
      this.sendOptions = { ...this.tableOptions };
      // 在第一页时直接查询  不在第一页时通过设置currentpage来自动改变数据
      // this.pageNo == 1 ? this.axiosRequest() : (this.pageNo = 1);

      /*
       * 2018年7月31日 14:44:18代码修改 不用再设置currentpage来获取数据
       * element已修复这个问题 currentpage仅响应用户交互 手动设置currentpage不再触发handleCurrentChange事件
       * https://element.faas.ele.me/2.4/#/zh-CN/component/changelog
       * https://github.com/ElemeFE/element/pull/10247
       * 同时导致删除数据不再触发handleCurrentChange 页面需要在删除操作后自行处理
       */
      this.pageNo = 1;
      this.fetchData();
    },
    // 分页change
    handleCurrentChange(val) {
      this.fetchData({ pageNo: val });
    }
  }
};
export default listMixin;

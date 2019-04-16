<template>
  <div>
    <div :class="['leftMenuBtn', { 'btn-shouqi': isCollapse, 'btn-zhankai': !isCollapse }]">
      <i
        :title="isCollapse ? '展开' : '收起'"
        class="iconfont font-size24"
        :class="[{ 'icon-zhankai': isCollapse, 'icon-shouqi': !isCollapse }]"
        @click="changeCollapse"
      ></i>
    </div>
    <div class="submenu">
      <el-menu
        router
        :default-active="sideAction"
        :default-openeds="defaultOpens"
        :collapse="isCollapse"
      >
        <template v-for="(el, idx) in sideData">
          <el-submenu
            v-if="el.children && el.children.length != 0"
            :index="idx.toString()"
            :key="idx"
          >
            <template slot="title">
              <i v-if="el.icon" class="iconfont submenu-icon" :class="el.icon"></i>
              <span slot="title">{{ el.name }}</span>
            </template>
            <template v-for="sub in el.children">
              <el-menu-item :index="sub.href" :key="sub.href">
                <i v-if="sub.icon" class="iconfont submenu-icon" :class="sub.icon"></i>
                <span slot="title" class="pl-5">{{ sub.name }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item
            v-if="!el.children || el.children.length === 0"
            :index="el.href"
            :key="idx.toString()"
            class="parent-item"
          >
            <i v-if="el.icon" class="iconfont submenu-icon" :class="el.icon"></i>
            <span slot="title">{{ el.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    navActive: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    sideData() {
      let pageMenu = this.menuTree.filter(item => item.href === this.navActive);
      pageMenu = pageMenu[0] || {};
      const children = pageMenu.children || [];
      return children;
    },
    defaultOpens() {
      let arr = [];
      for (var i = 0; i < this.sideData.length; i++) {
        arr.push(i.toString());
      }
      return arr;
    },
    ...mapState({
      menuTree: state => state.menuTree,
      permission: state => state.permission,
      sideAction: state => state.sideAction,
      isCollapse: state => state.g_config.isCollapse
    })
  },
  methods: {
    changeCollapse: function() {
      var g_config = this.$store.state.g_config;
      g_config.isCollapse = !g_config.isCollapse;
      localStorage.setItem('g_config', JSON.stringify(g_config));
    }
  }
};
</script>

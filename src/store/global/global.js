function getGlobal() {
  var g_config = localStorage.getItem('g_config');
  if (g_config === undefined || g_config === null || g_config == '') {
    return {
      isCollapse: false,
      fullScreen: true
    };
  } else {
    try {
      g_config = JSON.parse(g_config);
      return g_config;
    } catch (e) {
      return {
        isCollapse: false,
        fullScreen: true
      };
    }
  }
}

var web_global = getGlobal();
export default web_global;

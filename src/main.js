import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/font/iconfont.css";
import {
  Form,
  FormItem,
  Button,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Tooltip,
  Dialog,
  MessageBox,
  Tag,
  Alert,
  Tabs,
  TabPane,
  CheckboxGroup,
  Checkbox,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Radio,
  RadioGroup,
  Switch,
  Select,
  Option,
} from "element-ui";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";
// 在 request 拦截器中 展示进度条 NProgress.start()
axios.interceptors.request.use((config) => {
  return config;
});
axios.interceptors.response.use((config) => {
  return config;
});
Vue.prototype.$http = axios;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Pagination);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.config.productionTip = false;

Vue.filter("dateFormat", function(originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  // padStart字符串不足两位用0填充
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");
  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

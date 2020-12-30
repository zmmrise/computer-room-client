import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [{
    path: "/",
    redirect: "/login",
  },
  {
    path: "/register",
    component: () => import("../components/register/Register"),
  },
  {
    path: "/login",
    component: () => import("../components/login/Login"),
  },
  {
    path: "/home",
    component: () => import("../components/home/Home"),
    children: [{
        path: "/home",
        redirect: "/welcome",
      },
      {
        path: "/welcome",
        component: () => import("../components/welcome/Welcome"),
      },
      {
        path: "/student/list",
        component: () => import("../components/student-list/StudentList"),
      },
      {
        path: "/student/pay",
        component: () => import("../components/student-pay/StudentPay")
      },
      {
        path: "/right/list",
        component: () => import("../components/power/Rights")
      },
      {
        path: "/role/list",
        component: () => import("../components/power/Roles")
      },
      {
        path: "/computer/list",
        component: () => import("../components/computer/ComputerList"),
      },
      {
        path: "/roominfo",
        component: () => import("../components/room-info/RoomInfo")
      },
      {
        path: "/report",
        component: () => import("../components/report/Report")
      },

    ],
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == "/login" || to.path == "/register") return next();
  //获取sessionStorage的token

  const token = window.sessionStorage.getItem("token");
  if (!token) {
    return next("/login");
  } else {
    next();
  }
});
export default router;
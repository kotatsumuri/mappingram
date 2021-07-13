import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import welcome from "../views/welcome.vue";
import login from "../views/login.vue";
import newaccount from "../views/newaccount.vue";
import zikken1 from "../views/zikken1.vue";
import buttontest from "../views/Buttontest.vue";
import firebase from 'firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/",
    name: "welcome",
    component: welcome,
  },
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/newaccount",
    name: "newaccount",
    component: newaccount,
  },
  {
    path: "/zikken1",
    name: "zikken1",
    component: zikken1,
  },
  {
    path: "/buttontest",
    name: "buttontest",
    component: buttontest
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeResolve((to, from , next) => {
  if(to.path == '/' || to.path == 'newaccount' || to.path == 'login') { 
    next();
  }
  else {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        next();
      }
      else {
        next({path: '/'});
      }})
  }
});

export default router;

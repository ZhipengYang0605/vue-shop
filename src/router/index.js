import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import DashBoard from './../views/dashboard/DashBoard.vue';
const Home = () => import("./../views/home/Home.vue");
const Category = () => import("./../views/category/Category.vue");
const shopCar = () => import("./../views/shopCar/shopCar.vue");
const Mine = () => import("./../views/mine/Mine.vue");

// 引入填写订单组件
const Order = () => import("./../views/order/Order.vue");
const Address = () => import("./../views/order/children/Address.vue");
const AddAddress = () => import("./../views/order/children/children/AddAddress.vue");
const EditAddress = () => import("./../views/order/children/children/EditAddress.vue");
const GoodsDetail = () => import("./../views/order/children/GoodsDetail.vue");

// 引入login组件
const Login = () => import("./../views/login/Login.vue");
const UserCenter = () => import("./../views/mine/children/userCenter.vue")


Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/dashboard'},
  {
	path: '/dashboard',
	name: 'dashboard',
	component: DashBoard,
	children: [
		{path: '/dashboard', redirect: '/dashboard/home'},
		{path: 'home', name: 'home', component: Home, meta:{keepAlive:true} },
		{path: 'category', name: 'category', component: Category, meta:{keepAlive:true}},
		{path: 'shopCar', name: 'shopCar', component: shopCar},
		{
			path: 'mine', 
			name: 'mine', 
			component: Mine,
			children: [
				{ path:'userCenter', name:'userCenter', component: UserCenter },
			]
		},
	]
  },
  {
	  path:'/confirmOrder', 
	  name: 'order', 
	  component: Order,
	  children: [
		  {
			  path:'myAddress',
			   name: 'address', 
			   component: Address,
				// 添加和编辑地址路由
			   children: [
					{path: 'addAddress', name: 'addAddress', component: AddAddress},
					{path: 'editAddress', name: 'editAddress', component: EditAddress},
			   ]
		   },
		   {
			   path: 'goodsDetail',
			   name: 'goodsDetail',
			   component: GoodsDetail,
		   }

	  ]
  },
  // login路由
  {path:'/login', name: 'login', component: Login}   
]

const router = new VueRouter({
  routes,
})

export default router;

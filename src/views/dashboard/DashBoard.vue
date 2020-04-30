<template>
  <div id="dashboard">
    <van-tabbar v-model="active" active-color="#75a342">
      <van-tabbar-item replace to="/dashboard/home">
        <span>首页</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? home_icon.active : home_icon.inactive"
        />
      </van-tabbar-item>

	  <van-tabbar-item replace to="/dashboard/category">
        <span>分类</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? category_icon.active : category_icon.inactive"
        />
      </van-tabbar-item>

	  <van-tabbar-item replace to="/dashboard/shopCar" :info="goodsNum > 0 ? goodsNum:''">
        <span>购物车</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? shopcar_icon.active : shopcar_icon.inactive"
        />
      </van-tabbar-item>

	  <van-tabbar-item replace to="/dashboard/mine">
        <span>我的</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? mine_icon.active : mine_icon.inactive"
        />
      </van-tabbar-item>
    </van-tabbar> 
    <keep-alive>
      <router-view v-if="this.$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!this.$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import {rqsServerShopCar} from './../../service/api/index'
import {setStore,getStore} from './../../config/globle'
import {Toast} from 'vant'
export default {
  data() {
    return {
      active: Number(sessionStorage.getItem('tabBarActiveIndex')) || 0,
      home_icon: {
        active: require("./../../images/tabbar/home_selected.png"),
        inactive: require("./../../images/tabbar/home_default.png")
	  },
	  category_icon: {
        active: require("./../../images/tabbar/category_selected.png"),
        inactive: require("./../../images/tabbar/category_default.png")
	  },
	  shopcar_icon: {
        active: require("./../../images/tabbar/shoppingcart_selected.png"),
        inactive: require("./../../images/tabbar/shoppingcart_default.png")
	  },
	  mine_icon: {
        active: require("./../../images/tabbar/mine_selected.png"),
        inactive: require("./../../images/tabbar/mine_default.png")
	  },
    };
  },
  watch: {
    active(value){
      let tabBarActiveIndex = value > 0 ? value:0;
      // 将数据缓存到本地
      sessionStorage.setItem('tabBarActiveIndex',value);
    }
  },
  computed:{
    ...mapState(["shopCar","userInfo"]),
    goodsNum () {
      if(this.shopCar) {
        // 购物车总数量
        let num = 0;
        Object.values(this.shopCar).forEach((goods)=>{
          num += goods.num; 
        })
        return num;

      } else {
        return 0;
      }
    }
  },
  mounted () {
    // 1.自动登录
    this.rqsUserInfo();
    //2. 获取购物车中的数据
    // this.INIT_SHOP_CAR();
    this.getServerShopCar();
  },
  methods: {
    ...mapMutations(["INIT_SHOP_CAR"]),
    ...mapActions(["rqsUserInfo"]),
    // 1. 从服务器上请求购物车数据
    async getServerShopCar () {
      // 判断是否登录
      if(this.userInfo.token){
        let result = await rqsServerShopCar(this.userInfo.token);
        if(result.success_code === 200) {
          // 转换数据格式
          let shopCar = {};
          result.data.forEach((value)=>{
            shopCar[value.goods_id] = {
              'num' : value.num,
              'id' : value.goods_id,
              'name' : value.goods_name,
              'image' : value.small_image,
              'price':value.goods_price,
              'checked': value.checked
            }
          });

          // 将购物车数据存储到本地
          setStore('shopCar',shopCar);
          // 初始化购物车
          this.INIT_SHOP_CAR();
        }
      }
    },
  }
};
</script>

<style lang="less" scoped>
#dashboard {
  width: 100%;
  height: 100%;
}
</style>

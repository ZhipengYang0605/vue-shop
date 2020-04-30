<template>
  <div id="order">
    <!-- 1.导航栏 -->
    <van-nav-bar
      title="填写订单"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      :fixed="true"
      :border="true"
    />
    <!-- 2.选择收货地址 -->
    <van-contact-card
      :type="address_type"
      add-text="选择收货地址"
      :name="address_name"
      :tel="address_phone"
      @click="chooseAddress()"
      style="margin-top: 3rem"
    />

    <!-- 3.Address.vue的路由出口 -->
    <transition name="address" mode="out-in">
      <router-view></router-view>
    </transition>

    <!-- 4. 单元格 -->
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell
        title="送达时间"
        :value="arriveTime"
        is-link
        @click="showDataSelect"
      />

      <!-- GoodsDetail 入口 -->
      <router-link to="/confirmOrder/goodsDetail">
        <van-cell :value="`共${goodsCount}件`" is-link :center="true">
        <template slot="title">
          <img :src="goods.image" style="width:3rem" v-for="goods in selectThreeGoods" :key="goods.id"/>
        </template>
      </van-cell>
      </router-link>
      
    </van-cell-group>
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="支付方式" value="微信" />
    </van-cell-group>
    <van-cell title="备注" style="margin-top: 0.6rem;">
      <input type="text" placeholder="选填，备注您的特殊需求" v-model="noticeMsg" style="text-align: right"/>
    </van-cell>
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="商品金额" :value="`￥${goodsPrice}`" />
    </van-cell-group>
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="配送费" :value="`￥${expressMoney}`" />
    </van-cell-group>
    <!--5. 支付按钮 -->
    <van-submit-bar :price="totalPrice" button-text="提交订单" @submit="onSubmit" />
    <!-- 6.弹出层 -->
    <van-popup v-model="dataShow" round position="bottom" :style="{ height: '30%' }">
      <!-- 时间选择 -->
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="onCencel"
        @confirm="onConfirm"
      ></van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
import PubSub from "pubsub-js";
import Moment from "moment";
import {mapState} from 'vuex';
import {
  getAllSelectedGoods,
  postOrder,
  delAllSelectedGoods,
  getWXCode
} from './../../service/api/index'
import {Toast} from 'vant'

export default {
  data() {
    return {
      // 1. 地址数据
      address_type: "add", // 收货地址类型
      address_name: null, // 收货人名字
      address_phone: null, //收货人手机号
      address_id: null, //选中地址ID

      // 2. 送达时间
      dataShow: false, //弹出层是否弹出
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      arriveTime: '请选择送达时间',
      noticeMsg: null, //备注信息
    };
  },
  computed:{
    ...mapState(["shopCar","userInfo"]),
    // 1.选中商品的数量
    goodsCount(){
      let count = 0;
      Object.values(this.shopCar).forEach((goods,index)=>{
        if(goods.checked){
          count++;
        }
      });
      return count;
    },
    // 2.选中且显示的商品
    selectThreeGoods(){
      let selectArr = [];
      Object.values(this.shopCar).forEach((goods,index)=>{
        if(goods.checked){
          selectArr.push(goods);
        }
      });
      // 截取前三个数组
      return selectArr.splice(0,3);
    },
    // 3.商品的总价格（不加配送费的价格）
    goodsPrice(){
      let selectArr = [];
      let goodsPrice = 0;
      Object.values(this.shopCar).forEach((goods,index)=>{
        if(goods.checked){
          goodsPrice += goods.price*goods.num;
        }
      });
      return goodsPrice.toFixed(2);
    },
    // 4.配送费
    expressMoney(){
      return (this.goodsPrice > 30 ? 0 : 6).toFixed(2);
    },
    // 5.实付总金额
    totalPrice(){
      return (parseFloat(this.goodsPrice) + parseFloat(this.expressMoney))*100;
    }
  },
  methods: {
    // 1.填写订单点击左边返回上一步
    onClickLeft() {
      this.$router.back();
    },
    // 2.点击跳转到选择地址页面
    chooseAddress() {
      this.$router.push("/confirmOrder/myAddress");
    },
    // 3.提交订单支付按钮
    async onSubmit() {
      // 3.1 作条件判断
      if(!this.address_id) { // 地址没填
        Toast({
          message: '请选择收货地址！',
          duration: 1000
        })
        return;
      };

      if(this.arriveTime === '请选择送达时间'){ // 送达时间没选
          Toast({
            message: '请选择送达时间！',
            duration: 1000
          })
          return;
      };

      if(!this.noticeMsg) { //备注信息没填
        Toast({
          message: '请备注信息!',
          duration: 1000
        })
      };

      // 3.2 处理订单的特务逻辑
      if(this.userInfo.token){
        // 3.2.1查询所有选中的商品
        let selectGoods = await getAllSelectedGoods(this.userInfo.token);
        if(selectGoods.success_code){
          // 3.2.2 创建表单
          // user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price
          let createOrder = await postOrder(this.userInfo.token, this.address_id, this.arriveTime, selectGoods.data,this.noticeMsg,this.goodsPrice,this.expressMoney);
          console.log(createOrder);
          // 3.2.3 删除购车中的商品
          if(createOrder.success_code === 200) {
            let delPayGoods = await delAllSelectedGoods(this.userInfo.token);
            // 3.2.4 发起微信支付
            if(delPayGoods.success_code === 200) {
              let payWXUrl = await getWXCode(createOrder.data.order_id, 1);
              console.log(payWXUrl);
            }
          }
        }
      }
    },
    // 4.点击显示选择日期组件
    showDataSelect() {
      this.dataShow = true;
    },
    // 5.点击取消，隐藏弹出层
    onCencel(){
      this.dataShow = false;
    },
    // 6.点击确认，获取所选择的时间
    onConfirm(value){
      // 格式化时间
      this.arriveTime = Moment(value).format('YYYY-MM-DD hh:mm');
      this.dataShow = false;
    }
  },
  mounted() {
    // 订阅消息
    PubSub.subscribe("userAddress", (msg, address) => {
      if (msg === "userAddress") {
        this.address_type = "edit";
        this.address_name = address.name;
        this.address_phone = address.tel;
        this.address_id = address.address_id;
      }
    });
  },
  beforeDestroy() {
    PubSub.unsubscribe("userAddress");
  }
};
</script>

<style scoped>
#order {
  width: 100%;
  height: 100%;
  background-color: #e7e7e7;
}

/* 转场动画 */
.address-enter-active,
.address-leave-active {
  transition: all 0.5s;
}
.address-enter,
.address-leave {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>

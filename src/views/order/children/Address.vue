<template>
  <div id="address">
    <!-- 1.导航栏 -->
    <van-nav-bar
      title="我的地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      :fixed="true"
      :border="true"
    />

    <!-- 2.mixin-arguments-1地址列表 -->
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelectBack"
    ></van-address-list>

    <!-- 3.AddAddress和editAddress 出口 -->
    <transition mode="out-in" name="address">
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import { Toast } from "vant";
import {getUserAddress} from './../../../service/api/index';
import {mapState} from 'vuex';
import PubSub from 'pubsub-js';

export default {
  methods: {
    // 1. 点击返回上一级
    onClickLeft() {
      this.$router.back();
    },
    // 2.前往增加地址页面
    onAdd() {
      this.$router.push("/confirmOrder/myAddress/addAddress");
    },
    // 3.前往编辑地址页面
    onEdit(item, index) {
      this.$router.push("/confirmOrder/myAddress/editAddress?address_id="+item.address_id);
    },
    // 4.获取当前用户地址
    async initCurrentAddress(){
      // 发起请求
      let result = await getUserAddress(this.userInfo.token);
      // console.log(result);
      if(result.success_code === 200) {
        // 处理数据
        let listArr = result.data;
        this.list = [];
        listArr.forEach((address, index)=>{
          let addressObj = {
            id: String(index + 1),
            name: address.address_name,
            tel: address.address_phone,
            address: address.address_area + address.address_area_detail,
            address_id: address._id,
            user_id: address.user_id
          }
          this.list.push(addressObj);
        });
      }
    },
    // 5.选中地址
    onSelectBack(item, index){
      // 返回上一级
      if(item){
        this.$router.back();
        console.log(item)
        // 发布消息，传递参数item
        PubSub.publish('userAddress', item);
      }
    }
  },
  computed: {
    ...mapState(["userInfo",]),
  },
  mounted(){
    // 初始化地址信息
    this.initCurrentAddress();
    // 订阅消息
    PubSub.subscribe('backToAddress',(msg, index)=>{
      if( msg == 'backToAddress' ) {
        this.initCurrentAddress();
      }
    })
  },
  data() {
    return {
      chosenAddressId: "1",
      list: []
    };
  },
  beforeDestroy(){
    // 销毁消息订阅
    PubSub.unsubscribe('backToAddress');
  }
};
</script>

<style scoped>
#address {
  position: absolute;
  top: 2.3rem;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  width: 100%;
  z-index: 998;
}

/* 转场动画 */
.address-enter-active,
.address-leave-active {
  transition: all 0.5s;
}
.address-enter,
.address-leave {
  transform: translate3d(0, 0, 0);
  opacity: 0;
}
</style>

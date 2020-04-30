<template>
  <div  id="mine" v-if="userInfo.token">
    <!-- 1.导航栏 -->
    <van-nav-bar
      style="background:#3bba63;"
      title="我的"
      :fixed="true"
      :border="false"
    />

    <!-- 2.资料 -->
    <van-cell-group style="margin-top:2.4rem;">
      <van-cell 
        style="background:#3bba63;"
        @click="$router.push('/dashboard/mine/userCenter')"
      >
        <template slot="title">
          <div class="personMsg">
            <img :src="userInfo.icon_url" class="iconImage" />
            <div class="personInfo">
              <span>{{userInfo.real_name}}</span>
              <span>手机：{{userInfo.phone}}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 3.订单 -->
    <van-cell-group>
      <van-cell
        icon="todo-list"
        title="我的订单"
        value="查看全部订单"
        is-link
      />
      <!-- 宫格 -->
      <van-grid>
        <van-grid-item
          v-for="(order, index) in orderData"
          :key="index"
          :icon="order.icon"
          :text="order.title"
        />
      </van-grid>
    </van-cell-group>
    <!-- 4.优惠券/收货地 -->
    <van-cell-group style="margin-top:0.6rem">
      <van-cell icon="gold-coin" title="我的优惠券" value="1张" is-link/>
      <van-cell icon="shop" title="我的收货地址" is-link/>
    </van-cell-group>

    <!-- 5.联系客服/意见反馈 -->
    <van-cell-group style="margin-top:0.6rem">
      <van-cell icon="service" title="联系客服" value="客服时间07:00-22:00" is-link/>
      <van-cell icon="comment-circle" title="意见反馈" is-link/>
    </van-cell-group>

    <!-- 买菜商城 -->
    <van-cell-group style="margin-top:0.6rem">
      <van-cell icon="bag" title="买菜商城" value="下载APP体验更佳" is-link/>
    </van-cell-group>

    <!-- 用户中心router出口 -->
    <router-view></router-view>
    <!-- <transition name="router-slider" mode="out-in">
        <router-view></router-view>
    </transition> -->
  </div>
  <!-- 选择登录方式组件 -->
  <SelectLogin v-else/>
</template>

<script>
import SelectLogin from './../login/SelelctLogin'
import {mapState} from 'vuex'
export default {
    data() {
        return {
            orderData: [
                {icon:'pending-payment', title:'待支付'},
                {icon:'logistics', title:'待收货'},
                {icon:'chat-o', title:'待评价'},
                {icon:'cash-back-record', title:'售后/退款'},
            ]
        }
    },
    computed:{
      ...mapState(["userInfo"])
    },
    components: {
      SelectLogin,
    }
};
</script>

<style lang="less" scoped>
#mine {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.van-nav-bar__title {
  font-size: 1rem;
  color: #fff;
}
.personMsg {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #fff;
}
.personMsg img {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 0.1rem solid #fff;
}
.personInfo {
  display: flex;
  flex-direction: column;
  margin-left: 0.8rem;
}
.van-cell__left-icon {
  color: orangered;
  font-size: 1rem;
}

/*转场动画*/
    // .router-slider-enter-active, .router-slider-leave-active{
    //     transition: all 0.3s;
    // }

    // .router-slider-enter, .router-slider-leave-active{
    //     transform: translate3d(2rem, 0, 0);
    //     opacity: 0;
    // }
</style>

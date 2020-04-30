<template>
  <div id="userCenter">
    <van-nav-bar
      title="用户中心"
      :fixed="true"
      :border="false"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 退出按钮 -->
    <button class="quitOut" @click="loginOut">退出登录</button>
  </div>
</template>

<script>
import {getLoginOut} from './../../../service/api/index';
import {mapMutations} from 'vuex';
import {Toast} from 'vant';
export default {
    methods: {
        ...mapMutations(["RESET_USER_INFO","CLEAR_SHOP_CAR"]),
        // 1.退出登录
        async loginOut(){
            let result = await getLoginOut();
            if(result.success_code === 200) {
              // 1. 清除用户信息数据
                this.RESET_USER_INFO();
                Toast({
                    message: '退出成功！',
                    duration: 1000,
                })
                // 2. 清除购物车数据
                this.CLEAR_SHOP_CAR();
            }
        },
    }
};
</script>

<style scoped>
#userCenter {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f5f5;
  z-index: 999999999;
}
.quitOut{
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    margin-top: 4rem;
    background-color: #FFF;
    color: #000;
    text-align: center;
}
</style>

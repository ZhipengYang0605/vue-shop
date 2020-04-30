<template>
  <div id="addAddress">
    <!--导航栏-->
    <van-nav-bar
      title="添加地址"
      left-arrow
      :fixed="true"
      :border="true"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <!-- 添加地址 -->
    <van-address-edit
      :area-list="areaList"
      show-postal
      show-set-default
      :search-result="searchResult"
      @save="onSave"
      @change-detail="onChangeDetail"
      style="margin-top: 3rem"
    >
    </van-address-edit>
  </div>
</template>

<script>
import { Toast } from "vant";
import areaList from "./../../../../config/area";
import {addUserAddress} from "./../../../../service/api/index"
import {mapState} from 'vuex'
import PubSub from 'pubsub-js'

export default {
  methods: {
    // 1. 点击返回上一级
    onClickLeft() {
      this.$router.back();
    },
    async onSave(content) {
      let result = await addUserAddress(this.userInfo.token, content.name, content.tel, content.province+content.city+content.county, content.addressDetail, content.postalCode, content.isDefault, content.province, content.city, content.county, content.areaCode);
      if(result.success_code === 200) {
        Toast({
          message:'添加地址成功！',
          duration: 1000
        });
        // 返回上一级
        this.$router.go(-1);
        // 发布消息
        PubSub.publish('backToAddress');
      } else {
        Toast({
          message:'添加地址失败！',
          duration: 1000
        });
      }
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: "黄龙万科中心",
            address: "杭州市西湖区"
          }
        ];
      } else {
        this.searchResult = [];
      }
    }
  },
  data() {
    return {
      areaList: areaList,
      searchResult: []
    };
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>

<style scoped>
#addAddress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 999;
}
</style>

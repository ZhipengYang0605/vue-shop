<template>
  <div id="editAddress">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      :fixed="true"
      :border="true"
    />

    <!-- 新增地址 -->
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-postal
      show-delete
      show-set-default
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      style="margin-top:3rem"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import areaList from "./../../../../config/area";
import { mapState } from "vuex";
import {
  changeUserAddress,
  getCurrentUserAddress,
  delUserAddress
} from "./../../../../service/api/index";
import PubSub from "pubsub-js";

export default {
  methods: {
    // 1. 点击返回上一级
    onClickLeft() {
      this.$router.back();
    },
    // 2. 修改地址
    async onSave(content) {
      if (this.userInfo.token) {
        //  address_id, user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode
        let result = await changeUserAddress(
          this.addressInfo.id,
          this.userInfo.token,
          content.name,
          content.tel,
          content.province + content.city + content.county,
          content.addressDetail,
          content.postalCode,
          content.isDefault,
          content.province,
          content.city,
          content.county,
          content.areaCode
        );
        if (result.success_code === 200) {
          Toast({
            message: "修改地址成功！",
            duration: 1000
          });
          // 返回上一级
          this.$router.back();
          // 发布修改地址成功通知
          PubSub.publish("backToAddress");
        }
      }
    },
    // 3. 点击删除
    async onDelete() {
      let result = await delUserAddress(this.addressInfo.id);
      if (result.success_code === 200) {
        Toast({
          message: "删除地址成功！",
          duration: 1000
        });
        // 返回上一级
        this.$router.back();
        // 发布修改地址成功通知
        PubSub.publish("backToAddress");
      }
    },
    // 4. 获取被点击的地址信息
    async getAddressInfo(addressId, userId) {
      let result = await getCurrentUserAddress(userId, addressId);
      if (result.success_code === 200) {
        this.addressInfo = {
          id: result.data._id,
          name: result.data.address_name,
          tel: result.data.address_phone,
          province: result.data.province,
          city: result.data.city,
          county: result.data.county,
          addressDetail: result.data.address_area_detail,
          areaCode: result.data.areaCode,
          postalCode: result.data.address_post_code,
          isDefault: result.data.address_tag
        };
      }
    }
  },
  data() {
    return {
      areaList: areaList,
      addressInfo: {}
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    if (this.$route.query.address_id) {
      if (this.userInfo.token) {
        this.getAddressInfo(this.$route.query.address_id, this.userInfo.token);
      }
    }
  }
};
</script>

<style scoped>
#editAddress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 9999;
}
</style>

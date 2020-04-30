<template>
  <div id="goodsDetail">
    <!-- 1.导航栏 -->
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
      :fixed="true"
      :border="true"
    />
    <!-- 2.商品数量 -->
    <van-cell-group style="margin-top: 3rem">
      <van-cell title="商品" :value="`共${selectGoodsCount}件`" />
    </van-cell-group>

    <!-- 3.商品展示 -->
    <van-card
      v-for="goods in selectArr" :key="goods.id"
      :num="goods.num"
      :price="goods.price"
      :title="goods.name"
      :thumb="goods.image"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["shopCar"]),
    // 1.选中商品的数量
    selectGoodsCount() {
      let count = 0;
      Object.values(this.shopCar).forEach((goods, index) => {
        if (goods.checked) {
          count++;
        }
      });
      return count;
    },
    // 2.选中商品数组详情
    selectArr () {
        let goodsArr = [];
        Object.values(this.shopCar).forEach((goods,index)=>{
            if(goods.checked){
                goodsArr.push(goods);
            }
        });
        return goodsArr;
    }
  }
};
</script>

<style scoped>
#goodsDetail {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 400;
  background-color: #f5f5f5;
}
</style>

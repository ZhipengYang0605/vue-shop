<template>
  <div id="cart" v-if="userInfo.token">
    <!--头部区域-->
    <header class="titleWrapper">
      <h4><strong>购物车</strong></h4>
      <button class="btn" @click="clearShopCar()">清除购物车</button>
    </header>
    <div class="contentWrapper">
      <!--中间内容-->
      <main class="contentWrapperList">
        <section>
          <div class="shopCartListCon" v-for="goods in shopCar" :key="goods.id">
            <div class="left">
              <a
                href="javascript:;"
                class="cartCheckBox"
                :checked="goods.checked"
                @click.stop="singleSelect(goods.id)"
              ></a>
            </div>
            <div class="center">
              <img :src="goods.image" alt="" />
            </div>
            <div class="right">
              <a href="#">{{ goods.name }}</a>
              <div class="bottomContent">
                <p class="shopPrice">{{ goods.price | moneyFormat }}</p>
                <div class="shopDeal">
                  <span @click="removeOutShopCar(goods.id, goods.num)">-</span>
                  <input disabled type="number" v-model="goods.num" />
                  <span
                    @click="
                      addToShopCar(
                        goods.id,
                        goods.name,
                        goods.small_image,
                        goods.price
                      )
                    "
                    >+</span
                  >
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <!--底部通栏-->
      <div class="tabBar">
        <div class="tabBarLeft">
          <a
            href="javascript:;"
            class="cartCheckBox"
            :checked="isSelectAll"
            @click.stop="selectAllGoods(isSelectAll)"
          ></a>
          <span style="font-size: 16px;">全选</span>
          <div class="selectAll">
            合计：<span class="totalPrice">{{ totalPrice | moneyFormat }}</span>
          </div>
        </div>
        <div class="tabBarRight">
          <a class="pay" @click="toPay">去结算({{ goodsCount }})</a>
        </div>
      </div>
    </div>
  </div>
  <SelectLogin v-else />
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Dialog, Toast } from "vant";
import SelectLogin from "./../login/SelelctLogin";
import { changeShopCarNum, clearServerShopCar, singerGoodsSelect, allGoodsSelect } from "./../../service/api/index";
export default {
  computed: {
    ...mapState(["shopCar", "userInfo"]),
    // 1.购物车内商品选中的数量
    goodsCount() {
      let goodsCount = 0;
      Object.values(this.shopCar).forEach(goods => {
        if (goods.checked) {
          goodsCount += 1;
        }
      });
      return goodsCount;
    },
    // 2.判断是否全选
    isSelectAll() {
      let tag = true;
      let arrLength = Object.values(this.shopCar).length;
      if (arrLength !== 0) {
        Object.values(this.shopCar).forEach(goods => {
          if (!goods.checked) {
            tag = false;
          }
        });
      } else {
        // 若购物车内没有商品则取消全选
        tag = false;
      }
      return tag;
    },
    // 3.购物车内商品总价
    totalPrice() {
      let totalPrice = 0;
      Object.values(this.shopCar).forEach(goods => {
        if (goods.checked) {
          totalPrice += goods.num * goods.price;
        }
      });
      return totalPrice;
    }
  },
  methods: {
    ...mapMutations([
      "REMOVE_GOODS",
      "ADD_GOODS",
      "SELECT_SINGLE_GOODS",
      "SELECT_ALL_GOODS",
      "CLEAR_SHOP_CAR"
    ]),
    // 1. 将商品移出购物车
    async removeOutShopCar(goodsId, goodsNum) {
      if (goodsNum > 1) {
        let result = await changeShopCarNum(
          this.userInfo.token,
          goodsId,
          "reduce"
        );
        if (result.success_code === 200) {
          this.REMOVE_GOODS({ goodsId });
        } else {
          Toast({
            message: "出错了~",
            duration: 1000
          });
        }
      } else if (goodsNum === 1) {
        //提示挽留信息
        Dialog.confirm({
          title: "温馨提示",
          message: "您确定要删除吗?"
        })
          .then(async () => {
            // on confirm
            let result = await changeShopCarNum(
              this.userInfo.token,
              goodsId,
              "reduce"
            );
            if (result.success_code === 200) {
              this.REMOVE_GOODS({ goodsId });
            } else {
              Toast({
                message: "出错了~",
                duration: 1000
              });
            }
          })
          .catch(() => {
            // on cancel do nothing
          });
      }
    },
    // 2. 添加商品
    async addToShopCar(goodsId, goodsName, smallImage, goodsPrice) {
      let result = await changeShopCarNum(this.userInfo.token, goodsId, "add");
      if (result.success_code === 200) {
        this.ADD_GOODS({
          goodsId,
          goodsName,
          smallImage,
          goodsPrice
        });
      } else {
        Toast({
          message: '出错了~',
          duration: 1000
        })
      }
    },
    // 3.选中单个商品
    async singleSelect(goodsId) {
      let result = await singerGoodsSelect(this.userInfo.token, goodsId);
      if(result.success_code === 200){
        this.SELECT_SINGLE_GOODS({ goodsId });
      }
    },
    // 4.全选与取消全选
    async selectAllGoods(isSelectAll) {
      let result = await allGoodsSelect(this.userInfo.token, isSelectAll);
      if(result.success_code === 200){
        this.SELECT_ALL_GOODS({ isSelectAll });
      }
    },
    // 5.清除购物车
    clearShopCar() {
      Dialog.confirm({
        title: "温馨提示",
        message: "您确定要清空购物车吗?"
      })
        .then( async () => {
          // on confirm
          let result = await clearServerShopCar(this.userInfo.token);
          if(result.success_code === 200){
              this.CLEAR_SHOP_CAR();
          }
        })
        .catch(() => {
          // on cancel do nothing
        });
    },
    // 6.判断跳转去结算页面的条件
    toPay(){
      if(this.goodsCount > 0) {
        this.$router.push('/confirmOrder')
      } else {
        Toast({
          message:'您的购物车为空，请前往选购商品！',
          duration: 1000
        })
      }
    },
  },
  components: {
    SelectLogin
  }
};
</script>

<style lang="less" scoped>
#cart {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.titleWrapper {
  width: 100%;
  height: 2.6rem;
  background: #fff;
  -webkit-background-size: 0.1rem 4.4rem;
  background-size: 0.1rem 4.4rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;

  display: flex;
  justify-content: center;
  align-items: center;
}
.titleWrapper .btn {
  position: absolute;
  right: 1rem;
  background-color: transparent;
  color: red;
  font-size: 0.75rem;
  cursor: pointer;
}
.contentWrapper {
  padding-top: 3.5rem;
}

/*列表内容*/
.contentWrapperList {
  padding-bottom: 6rem;
}

.contentWrapperList section {
  background-color: #fff;
}

.cartCheckBox {
  background: url("./images/shop-icon.png") no-repeat;
  -webkit-background-size: 2.5rem 5rem;
  background-size: 2.5rem 5rem;
  width: 1rem;
  height: 1rem;
}

.cartCheckBox[checked] {
  background-position: -1.2rem 0;
}

.shopCartListCon {
  display: flex;
  height: 6rem;
  border-bottom: 0.01rem solid #e0e0e0;
  margin-bottom: 0.7rem;
  padding: 0.5rem 0;
}

.shopCartListCon .left {
  /*background: purple;*/
  flex: 1;
  display: flex;
  /*justify-content: center;*/
}

.shopCartListCon .left a {
  display: inline-block;
  margin-top: 0.8rem;
  margin-left: 0.5rem;
}

.shopCartListCon .center {
  /*background: blue;*/
  flex: 3;
}

.shopCartListCon .center img {
  width: 100%;
  height: 100%;
}

.shopCartListCon .right {
  /*background: orangered;*/
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  position: relative;
}

.shopCartListCon .right a {
  height: 2.2rem;
  line-height: 1.2rem;
  overflow: hidden;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  color: #000;
}

.shopCartListCon .bottomContent {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.shopCartListCon .bottomContent .shopPrice {
  font-size: 0.8rem;
}

.shopCartListCon .right .shopDeal span {
  // display: inline-block;
  display: block;
  width: 1rem;
  height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
  float: left;
}

.shopCartListCon .right .shopDeal input {
  float: left;
  width: 2rem;
  height: 1.2rem;
  text-align: center;
  margin: 0 0.2rem;
  font-size: 0.8rem;
}

/*底部通栏*/
.tabBar {
  position: fixed;
  left: 0;
  bottom: 2.7rem;
  width: 100%;
  height: 2.5rem;
  background-color: #fff;

  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 0.01rem solid #e0e0e0;
}

.tabBarLeft {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

.tabBarLeft .selectAll {
  margin-left: 1rem;
  font-size: 1rem;
}

.totalPrice {
  color: #e9232c;
}

.tabBarRight .pay {
  width: 5rem;
  height: 2rem;
  background-color: #e9232c;
  border-radius: 1rem;
  margin-right: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: #fff;
}
</style>

<template>
  <div id="category">
    <!-- 1.头部区域 -->
    <Header />
    <!-- 2.分类导航条 -->
    <div v-if="!isShowLoading" class="listWrapper">
      <!-- 左边导航条部分 -->
      <div class="leftWrapper">
        <ul class="wrapper">
          <li class="categoryItem" 
            v-for="(itemLeft, index) in getCategoryData"
            :key="itemLeft.id"
            :class="{'selected': index == currentIndex}"
            @click="currentItem(index)"
            ref="menuList"
          >
            <span class="textWrapper">{{itemLeft.name}}</span>
          </li>
        </ul>
      </div>
      <!-- 右边详细内容 -->
      <contentView 
        :getCategoryDetailData="getCategoryDetailData"
      />
    </div>

    <van-loading
      color="#75a342"
      v-else
      position="absolute"
      top="40%"
      style="position:absolute; left: 50%; top:40%; transform: translateX(-50%)"
    >
      正在为您拼命加载
    </van-loading>
  </div>
</template>

<script>
// 1. 引入组件
import Header from "./components/header";
import contentView from './components/contentView'

// 2. 引入滑动组件
import BScroll from 'better-scroll';

// 3. 引入请求数据
import {getCategory, getCategoryDetail} from './../../service/api/index'

// 4. 引入消息发布组件
import PubSub from 'pubsub-js'
import { mapMutations } from 'vuex';

export default {
  components: {
    Header,
    contentView
  },
  data() {
    return {
      isShowLoading: true,
      getCategoryData: [],
      getCategoryDetailData: [],
      currentIndex: 0
    };
  },
  created () {
      this.initData();
  },
  methods: {
      // 请求数据
      async initData () {
          // 获取左边的数据
          let leftRes = await getCategory();
          if (leftRes.success) {
              this.getCategoryData = leftRes.data.cate;
          }
          // console.log(leftRes)

          // 获取右边的数据
          let rightRes = await getCategoryDetail('/lk001');
          if (rightRes.success) {
              this.getCategoryDetailData = rightRes.data.cate;
          }
        
        // 请求数据成功后修改isShowLoading的值
        this.isShowLoading = false;

        // 实现左边导航栏的滑动效果
        const options = { //解决better-scroll点击无效的问题
          scrollY: true, 
          scrollX: false,
          mouseWheel: true,
          click: true,
          taps: true,
          probeType:3
        }
        this.$nextTick(()=>{
            this.leftScroll = new BScroll('.leftWrapper', options);
        });

      },

      // 点击li，改变currentIndex
     async currentItem(index){
         // 1 改变索引
         this.currentIndex = index;

         // 2 滚动到对应的位置
         let menuList = this.$refs.menuList;
         let el = menuList[index];

         // 3 滚动到对应的位置上
         this.leftScroll.scrollToElement(el,300);

         // 4 请求右边的数据
        let rightRes = await getCategoryDetail('/lk00$(index+1)');
        if (rightRes.success) {
            this.getCategoryDetailData = rightRes.data.cate;
        }
     },

    //  引入添加商品到购物车中的方法
    ...mapMutations(['ADD_GOODS']),

  },
  mounted(){
    // 订阅消息   goodsId, goodsName, smallImage, goodsPrice
    PubSub.subscribe('categoryToCar', (msg, goods)=>{
      if(msg==='categoryToCar'){
        this.ADD_GOODS ({
          goodsId: goods.id,
          goodsName: goods.name,
          smallImage: goods.small_image,
          goodsPrice: goods.price
        });
      }
    })
  }
  
};
</script>

<style lang="less" scoped>
#category {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
}

.listWrapper {
  position: fixed;
  top: 50px;
  bottom: 50px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}

.leftWrapper {
  background-color: #f4f4f4;
  width: 5.3125rem;
  flex: 0 0 5.3125rem;
}

.categoryItem {
  padding: 0.75rem 0;
  border-bottom: solid 1px #e8e9e8;
  position: relative;
}

.categoryItem .textWrapper {
  line-height: 1.25rem;
  border-left: solid 0.1875rem transparent;
  padding: 0.3125rem 0.6875rem;
  font-size: 0.8125rem;
  color: #666666;
}

.categoryItem.selected {
  background: #fff;
}

.categoryItem.selected .textWrapper {
  border-left-color: #3cb963;
  font-weight: bold;
  font-size: 0.875rem;
  color: #333333;
}

@media (min-width: 960px) {
  .wrapper {
    border-right: 1px solid #e8e9e8;
  }

  .wrapper .categoryItem {
    background: #fff;
  }
}
</style>

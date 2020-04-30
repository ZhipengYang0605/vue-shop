<template>
  <div class="wrapper emptyWrapper">
    <div
        v-for="getCategoryDetail in getCategoryDetailData"
        :key="getCategoryDetail.id"
    >
      <div class="categoryTitle" style="top: 0">{{getCategoryDetail.name}}</div>
      <!--子列表-->
      <productItem :products="getCategoryDetail.products"/>
    </div>
  </div>
</template>

<script>
// 引入productItem組件
import productItem from './productItem'
export default {
    components: {
        productItem,
    },
    props: {
        getCategoryDetailData: Array
    }
};
</script>

<style scoped>
.wrapper {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* overflow-scrolling: touch; */
}

.wrapper {
  position: absolute;
  left: 5.3125rem;
  right: 0;
  bottom: 0;
  top: 0;
  background: #fff;
}

.categoryTitle {
  padding: 0 0.3125rem;
  height: 1.25rem;
  line-height: 1.25rem;
  font-size: 0.75rem;
  background: #f8f8f8;
  color: #666666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

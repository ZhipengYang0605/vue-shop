<template>
  <div>
    <div class="wrapper">
      <div class="locationWrapper">
        <svg viewBox="0 0 32 32" class="icon iconLocation">
          <path
            fill="#81838E"
            fill-rule="evenodd"
            d="M14.521 30.445c.817.738 2.142.75 2.958 0 0 0 11.521-9.82 11.521-17.158C29 5.95 23.18 0 16 0S3 5.949 3 13.287c0 7.339 11.521 17.158 11.521 17.158zM16 18a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"
          ></path>
        </svg>
        <span class="address">{{province}}</span>
        <svg viewBox="0 0 32 32" class="icon iconArrow">
          <path
            fill="#81838E"
            fill-rule="evenodd"
            d="M14.724 19.17c.783.784 2.05.788 2.837 0l5.047-5.047c1.173-1.172.776-2.123-.869-2.123H10.545c-1.652 0-2.04.952-.869 2.123l5.048 5.048z"
          ></path>
        </svg>
      </div>
      <div class="searchWrapper">
        <div class="searchContent">
          <div class="iconSearchWrapper">
            <svg viewBox="0 0 32 32" class="icon iconSearch">
              <path
                fill="#999"
                fill-rule="evenodd"
                d="M23.624 21.503c3.47-4.51 3.14-11.003-.992-15.135-4.491-4.49-11.773-4.49-16.264 0-4.49 4.491-4.49 11.773 0 16.264 4.132 4.131 10.625 4.462 15.135.992l4.66 4.66a1.5 1.5 0 1 0 2.121-2.121l-4.66-4.66zm-3.114-.993A8.5 8.5 0 1 0 8.49 8.49a8.5 8.5 0 0 0 12.02 12.02z"
              ></path>
            </svg>
          </div>
          <span class="searchPrompt">输入商品名称</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from 'vant'
  export default {
    data(){
      return {
        longitude: 0,// 经度
        latitude: 0, //纬度
        province: '', //省份
      }
    },
    methods: {
        // 获取定位
        getAddress(showPosition,showErr){
          let geolocation = new qq.maps.Geolocation("C7GBZ-FVA6O-R6MWD-SMHXD-7LEIH-ZSBDA", "myapp"); // 创建地址实例
          geolocation.getIpLocation(showPosition, showErr); //获取粗糙定位信息
        },
        // 成功的回调函数,返回参数position
        showPosition(position){
          console.log(position);
          this.province = position.province;
          this.latitude = position.lat;
          this.longitude = position.lng;
        },
        // 失败的回调函数
        showErr(){
          Toast({
            message: '获取地址失败!',
            duration: 1000
          })
          // 重新定位
          this.getAddress(this.showPosition,this.showErr);
        },
    },
    mounted(){
      this.getAddress(this.showPosition,this.showErr);
    }
  };
</script>

<style lang="less" scoped>
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  height: 3.125rem;
  line-height: 3.125rem;
  width: 100%;
  box-sizing: border-box;
  background: white;
  border-bottom: solid 1px #eeeeee;
  border-top: solid 1px #eeeeee;
}

.iconLocation {
  position: absolute;
  left: 0.3rem;
  top: 1.0625rem;
  width: 1.875rem;
  height: 1rem;
  vertical-align: middle;
}

.locationWrapper {
  float: left;
  height: 3.125rem;
  width: 40%;
  white-space: nowrap;
  opacity: 1;
}

.locationWrapper .address {
  padding-left: 1.7rem;
  display: inline-block;
  font-size: 0.8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 80%;
  vertical-align: middle;
}

.locationWrapper .iconArrow {
  vertical-align: middle;
}

.locationWrapper.wheel {
  opacity: 0;
  -webkit-transition: opacity 1.2s;
  transition: opacity 1.2s;
}

.searchWrapper {
  position: absolute;
  top: 0.625rem;
  right: 2%;
  line-height: 3.125rem;
  text-align: right;
  width: 50%;
  vertical-align: middle;
}

.searchWrapper.wheel {
  width: 96%;
  -webkit-transition: width 1s ease 0.2s;
  transition: width 1s ease 0.2s;
}

.searchContent {
  float: right;
  border-radius: 3.125rem;
  width: 100%;
  height: 1.875rem;
  line-height: 1.875rem;
  text-align: center;
  background: #f2f2f2;
}

.iconSearchWrapper {
  display: inline-block;
  width: 1.25rem;
  height: 100%;
}

.iconSearch {
  margin-top: 0.3125rem;
  width: 1.25rem;
  height: 1.25rem;
}

.searchPrompt {
  display: inline-block;
  vertical-align: top;
  margin-left: 0.25rem;
  text-align: center;
  font-size: 0.875rem;
  color: #999999;
}

@media (min-width: 320px) {
  .searchWrapper {
    width: 55%;
  }
}

@media (min-width: 375px) {
  .searchWrapper {
    width: 57%;
  }
}

@media (min-width: 414px) {
  .searchWrapper {
    width: 62%;
  }
}

.icon {
  fill: #999;
  width: 1rem;
  height: 1rem;
}
</style>

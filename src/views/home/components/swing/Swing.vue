<template>
    <div>
        <swiper :options="swiperOption" ref="mySwiper" id="swiper">
          <!-- slides -->
          <swiper-slide v-for="swing in swing_list" :key="swing.public_id">
			  <img :src="swing.icon_url" :alt="swing.icon_url">
		  </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        swiperOption: {
            notNextTick: true,
            //   分页
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            // 循环播放
            loop: true,
            // 切换时长
            autoplay: {
				delay: 1000,
				disableOnInteraction: false,
            },
            // 速度
            speed: 600,
        }
      }
    },
    computed : {
		swiper () {
			return this.$refs.mySwiper.swiper;
		}
	},
	mounted () {
		// this.swiper.slideTo(5, 1000, false);
	},
	props : {
		swing_list: Array,
	}
}
</script>

<style lang="less" scoped>
    #swiper{
        width: 100%;
        height: 16rem;
        background-color: #f5f5f5;
	}
	#swiper img{
		height: 100%;
		width: 100%;
	}
	#swiper .swiper-pagination-bullet-active {
		background-color: #75a342!important;
	}
</style>
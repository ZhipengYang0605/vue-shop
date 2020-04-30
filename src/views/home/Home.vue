<template>
    <div id="home">
        <div v-if="!isShowLoading">
            <!-- 头部区域 -->
            <Header/>
            <!-- 轮播图区域 -->
            <Swing :swing_list = "swing_list"/>
            <!-- 导航栏区域 -->
            <Nav :nav_list = "nav_list"/>
            <!-- 秒杀区域 -->
            <SecondSale :second_sale_product_list="second_sale_product_list"/>
            <!-- 猜你喜欢区域 -->
            <YouLike :you_like_product_list="you_like_product_list"/>
            <!-- 回顶部按钮 -->
            <MarkTop v-if="toTopStates" :scrollToTop="scrollToTop"/>
        </div>
        <van-loading 
            color="#75a342" v-else
            position = "absolute"
            top = "40%"
            style = "position:absolute; left: 50%; top:40%; transform: translateX(-50%)"
        > 
            正在为您拼命加载 
        </van-loading>
    </div>
</template>

<script>
    // 1.引入getHomeData方法
    import {getHomeData} from './../../service/api/index'

    // 2. 引入子组件
    import Header from './components/header/Header'
    import Swing from './components/swing/Swing'
    import Nav from './components/nav/Nav'
    import SecondSale from './components/secondsale/SecondSale'
    import YouLike from './components/youlike/YouLike'
    import MarkTop from './components/marktop/MarkTop'

    // 3.引入回顶部按钮函数
    import {showBack} from './../../config/globle'

    // 4.引入通知插件
    import PubSub from 'pubsub-js'

    // 5. vuex
    import {mapMutations,mapState} from 'vuex'

    // 6.引入API
    import {addShopCar} from './../../service/api/index'

    export default {
        created () {
            // 2 请求网络数据
            getHomeData().then((response)=>{
                // console.log(response);
                if ( response.success ) {
                    // 请求轮播图数据
                    this.swing_list = response.data.list[0].icon_list;
                    // 请求导航栏数据
                    this.nav_list = response.data.list[2].icon_list;
                    // 请求秒杀数据
                    this.second_sale_product_list = response.data.list[3].product_list;
                    // 请求猜你喜欢数据
                    this.you_like_product_list = response.data.list[12].product_list;

                    // 数据加载成功，将isShowLoading的值修改为false
                    this.isShowLoading = false;

                    // 处理回顶部函数
                    showBack((status)=>{
                        // console.log(status);
                        this.toTopStates = status;
                    });
                }
            }).catch(error=> {
                console.log(error);
            })
        },
        methods : {
            ...mapMutations(["ADD_GOODS"]),
            // 1.滚回顶部
            scrollToTop () {
                alert('hello');
            },
            // 2.处理购物车添加数据
            async dealAddShopCar(goods){
                let result = await addShopCar(this.userInfo.token, goods.id, goods.name, goods.price, goods.small_image);
                // console.log(result);
                if(result.success_code === 200) {
                    this.ADD_GOODS ({
                        goodsId: goods.id,
                        goodsName: goods.name,
                        smallImage: goods.small_image,
                        goodsPrice: goods.price
                    })
                }
            },

        },
        components: {
            Header,
            Swing,
            Nav,
            SecondSale,
            YouLike,
            MarkTop
        },
        data () {
            return {
                // 轮播图数据数组
                swing_list: [],
                isShowLoading: true,
                // 导航栏数据数组
                nav_list: [],
                // 秒杀数据数组
                second_sale_product_list: [],
                // 猜你喜欢
                you_like_product_list: [],
                // 是否显示回顶部按钮
                toTopStates: false,
            }
        },
        computed:{
            ...mapState(['userInfo']),
        },
        mounted(){
            PubSub.subscribe('homeAddToCar', (msg, goods)=>{
                if(msg === 'homeAddToCar') {
                    // 判断用户是否登录
                    if(this.userInfo.token){ // 已登录
                        this.dealAddShopCar(goods)
                    }else{ // 未登录
                        this.$router.push('/login')
                    }  
                } 
            })
        },
        beforeDestroy(){
            PubSub.unsubscribe('homeAddToCar');
        }
    }
</script>

<style lang='less' scoped>
    #home{
        width: 100%;
        height: 100%;
        background-color: #ccc;
       
    }
</style>
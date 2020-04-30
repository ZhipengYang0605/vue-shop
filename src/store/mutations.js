import {
    ADD_GOODS,
    INIT_SHOP_CAR,
    REMOVE_GOODS,
    SELECT_SINGLE_GOODS,
    SELECT_ALL_GOODS,
    CLEAR_SHOP_CAR,
    USER_INFO,
    INIT_USER_INFO,
    RESET_USER_INFO
} from './mutations-type'
import { setStore, getStore, removeStore} from '../config/globle';
import Vue from 'vue';

export default {
    // 1. 往购物车中添加数据
    [ADD_GOODS] (state, {goodsId, goodsName, smallImage, goodsPrice}) {
        let shopCar = state.shopCar;
        // 判断是否存在
        if(shopCar[goodsId]) {
            shopCar[goodsId]['num']++;
        } else { //不存在
            shopCar[goodsId] = {
                'num' : 1,
                'id' : goodsId,
                'name' : goodsName,
                'image' : smallImage,
                'price':　goodsPrice,
                'checked': true
            }
        }
        // 生成新对象
        state.shopCar = {...shopCar};

        //将数据存入本地
        setStore('shopCar',state.shopCar);
    },

    // 2.获取购物车数据（本地）
    [INIT_SHOP_CAR] (state) {
        let initCar = getStore('shopCar');
        if(initCar) {
            state.shopCar = JSON.parse(initCar);
        }
    },

    // 3.将商品从购物车中移除
    [REMOVE_GOODS](state, {goodsId}){
        let shopCar = state.shopCar;
        let goods = shopCar[goodsId];
        if(goods){ // 找到该商品
            if(goods['num'] > 0){
                goods['num']--;
                // 3.1 判断是否只有0个
                if(goods['num'] === 0){
                    delete shopCar[goodsId];
                }
            }else {
                goods = null;
            }
            // 3.2 同步数据
            state.shopCar = {...shopCar};
            setStore('shopCar', state.shopCar);
        } else {
            console.log('没有找到该商品！')
        }
    },

    // 4.选中单个商品
    [SELECT_SINGLE_GOODS] (state, {goodsId}){
        let shopCar = state.shopCar;
        let goods = shopCar[goodsId];
        if(goods) {
            if(goods.checked) { //若goods内有selected属性
                goods.checked = !goods.checked;
            } else { //若goods内无selected属性,则手动添加
                Vue.set(goods, 'checked', true);
            }

            //  同步数据
            state.shopCar = {...shopCar};
            setStore('shopCar', state.shopCar);

        }
    },

    // 5.选中与取消所有商品
    [SELECT_ALL_GOODS] (state,{isSelectAll}) {
        let shopCar = state.shopCar;
        Object.values(shopCar).forEach((goods)=>{
            if(goods.checked) { //若goods内有selected属性
                goods.checked = !isSelectAll;
            } else { //若goods内无selected属性,则手动添加
                Vue.set(goods, 'checked', !isSelectAll);
            }
        })
        // 
        state.shopCar = {...shopCar};
    },

    // 6.清空购物车
    [CLEAR_SHOP_CAR] (state) {
        state.shopCar = null;
        // 更新数据
        state.shopCar = {...state.shopCar };
        setStore('shopCar',state.shopCar);
    },
    // 7.存储用户数据到本地
    [USER_INFO](state,{userInfo}){
        state.userInfo = userInfo;
        setStore('userInfo',state.userInfo);
    },
    // 8.初始化用户信息
    [INIT_USER_INFO](state){
        let userInfo = getStore('userInfo');
        // 判断uerInfo是否为空数据
        if(userInfo){
            state.userInfo = JSON.parse(userInfo);
        }
    },
    // 9.退出登录
    [RESET_USER_INFO] (state) {
        state.userInfo = {};
        removeStore('userInfo');
    }
}
import ajax from './ajax'

// 1 定义基础路径
const BASE_URL = 'http://demo.itlike.com/web/xlmc'
// 2 请求首页数据
export const getHomeData = () => ajax(BASE_URL+'/api/homeApi');
// 3 请求分类页面数据
export const getCategory = () => ajax(BASE_URL+'/api/homeApi/categories');
export const getCategoryDetail = (preParam) => ajax(BASE_URL+'/api/homeApi/categoriesdetail'+preParam);

// 4 用户中心数据
const LOCAL_BASE_URL = 'http://demo.itlike.com/web/xlmc';
// 4.1 获取手机验证码
export const getValidationCode = (phone) => ajax(LOCAL_BASE_URL+'/api/send_code',{phone});
// 4.2 手机+验证码提交登录
export const phoneCodeLogin = (phone, code) => ajax(LOCAL_BASE_URL + '/api/login_code', {phone, code}, 'POST');
// 4.3 用户名登录 
export const pswLogin = (user_name, user_pwd, captcha) => ajax(LOCAL_BASE_URL + '/api/login_pwd', {user_name, user_pwd, captcha}, 'POST');
// 4.4 自动登录
export const getUserInfo = () => ajax(LOCAL_BASE_URL + '/api/userinfo');
// 4.5 退出登录
export const getLoginOut = () => ajax(LOCAL_BASE_URL + '/api/logout');

// 5 购物车接口
// 5.1 添加商品
export const addShopCar = (user_id, goods_id, goods_name, goods_price, small_image) => ajax(LOCAL_BASE_URL + '/api/cart/add',{user_id, goods_id, goods_name, goods_price, small_image},'POST');
// 5.2 获取购物车数据
export const rqsServerShopCar = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/search/'+user_id);
// 5.3 修改购物车中商品的数量
export const changeShopCarNum = (user_id, goods_id, type) => ajax(LOCAL_BASE_URL + '/api/cart/num', {user_id, goods_id, type}, 'POST');
// 5.4 清除购物车
export const clearServerShopCar = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/clear/'+user_id);
// 5.5 商品单选同步到服务器接口
export const singerGoodsSelect = (user_id, goods_id)=>ajax(LOCAL_BASE_URL + '/api/cart/singer_select', {user_id, goods_id}, 'POST');
// 5.6 商品全选同步到服务器
export const allGoodsSelect = (user_id, flag)=>ajax(LOCAL_BASE_URL + '/api/cart/all_select', {user_id, flag}, 'POST');
// 5.7 查询所有已经被选中的商品
export const getAllSelectedGoods = (user_id) => ajax(LOCAL_BASE_URL+ '/api/cart/selected/'+ user_id);
// 5.8 删除已经生成订单的商品
export const delAllSelectedGoods = (user_id) => ajax(LOCAL_BASE_URL+ '/api/cart/del_checked/'+ user_id);


// 6 地址接口
// 6.1 获取当前用户的地址
export const getUserAddress = (user_id) => ajax(LOCAL_BASE_URL+ '/api/address/search/'+ user_id);
// 6.2 新增地址接口
export const addUserAddress = ( user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode)=>ajax(LOCAL_BASE_URL + '/api/address/add', {user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode}, 'POST');
// 6.3 编辑用户地址
export const changeUserAddress = ( address_id, user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode)=>ajax(LOCAL_BASE_URL + '/api/address/edit', {address_id, user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode}, 'POST');
// 6.4 获取单条地址
export const getCurrentUserAddress = ( user_id, address_id)=>ajax(LOCAL_BASE_URL + '/api/address/one', {user_id, address_id}, 'POST');
// 6.5 删除用户地址
export const delUserAddress = (address_id) => ajax(LOCAL_BASE_URL+ '/api/address/del/'+ address_id);

// 7. 订单接口
// 7.1 提交订单
export const postOrder = ( user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price)=>ajax(LOCAL_BASE_URL + '/api/order/post', {user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price}, 'POST');
// 7.2 订单支付成功
export const orderPaySuccess = (user_id, order_id)=>ajax(LOCAL_BASE_URL + '/api/order/change_status', {user_id, order_id}, 'POST');
// 7.3 查询订单
export const getOrder = (user_id, status)=>ajax(LOCAL_BASE_URL + '/api/order/get', {user_id, status}, 'POST'); // pay will

// 8. 微信支付接口部署
/*支付接口白名单：demo.itlike.com */
// const PAY_URL = 'http://47.98.157.152/WXPayProject/pay';
const PAY_URL = '/pay';
// 8.1 获取支付的URL
export const getWXCode = (outTradeNo, totalFee) => ajax(PAY_URL+ '/createNative.do', {outTradeNo, totalFee});
// 8.2 查询是否支付成功
export const queryPayStatus = (out_trade_no) => ajax(PAY_URL+ '/queryPayStatus.do', {out_trade_no});




import Vue from 'vue';
// 1. 引入Tabbar
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar);
Vue.use(TabbarItem);

//  2. 引入加载
import { Loading } from 'vant';
Vue.use(Loading);

// 3.图片懒加载
import { Image } from 'vant';
Vue.use(Image);

// 4. 弹出提示框
import { Dialog } from 'vant';
Vue.use(Dialog);

// 5.引入导航栏
import { NavBar } from 'vant';
Vue.use(NavBar);

// 6.引入联系人
import { ContactCard, ContactList, ContactEdit } from 'vant';
Vue.use(ContactCard);
Vue.use(ContactList);
Vue.use(ContactEdit);

// 7.引入地址
import { AddressList } from 'vant';
Vue.use(AddressList);

// 8.新增地址
import { AddressEdit } from 'vant';
Vue.use(AddressEdit);

// 9. 单元格
import { Cell, CellGroup } from 'vant';
Vue.use(Cell);
Vue.use(CellGroup);

// 10. 支付组件
import { SubmitBar } from 'vant';
Vue.use(SubmitBar);

// 11.宫格
import { Grid, GridItem } from 'vant';
Vue.use(Grid);
Vue.use(GridItem);

// 12. 弹出层
import { Popup } from 'vant';
Vue.use(Popup);

// 13. 选择时间
import { DatetimePicker } from 'vant';
Vue.use(DatetimePicker);

// 14. 商品卡片
import { Card } from 'vant';
Vue.use(Card);

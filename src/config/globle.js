export const showBack = (callback) => {
    // 1.变量
    let docB = document.documentElement || document.body;
    let oldScrollTop, requestFrame;

    // 2.监听滑动
    document.addEventListener('scroll', ()=>{
        showBackFunc();
    },false)

    // 3. 监听触摸
    document.addEventListener('touchstart', () => {
        showBackFunc();
    },{passive:true})

    document.addEventListener('touchmove', () => {
        showBackFunc();
    },{passive:true})

    document.addEventListener('touchend', () => {
        oldScrollTop = docB.scrollTop;
        moveEnd();
    },{passive:true})

    const moveEnd = () => {
        // 函数节流
        requestFrame = requestAnimationFrame(()=>{
            if(docB.scrollTop !== oldScrollTop) {
                oldScrollTop = docB.scrollTop;
                moveEnd();
            } else {
                cancelAnimationFrame(requestFrame);
            }
            showBackFunc();
        })
    }
    // 判断是否达到目标点
    const showBackFunc = ()=>{
        // console.log(docB.scrollTop);
        if(docB.scrollTop >= 200 ) {
            callback(true);
        } else {
            callback(false);
        }
    }
}

// 本地存数据
export const setStore = (name, content) => {
    if(!name) return;
    if(typeof content !== 'string') {
        content = JSON.stringify(content);
        return window.localStorage.setItem(name, content);
    }
}

// 本地取数据
export const getStore = (name) => {
    if(!name) return;
    return window.localStorage.getItem(name);
}

// 删除本地数据
export const removeStore = (name) => {
    if(!name) return;
    return window.localStorage.removeItem(name);
}
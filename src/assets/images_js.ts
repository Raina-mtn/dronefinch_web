const images = import.meta.glob('./images/*.*', {eager: true});
const imagesMap = {};

// 循环所有图片，将图片名设置成键，值为导入该图片的地址
for (const key in images) {
    // let name = key.replace(/(\.\/images\/|\..*)/g, '')
    const name =key.split('/').slice(-1)[0].split('.')[0];
        
    // 抛出图片大对象后，文件页面直接引入后将图片的具体名称作为属性就能导入该图片
    imagesMap[name] = images[key].default;
}
    
export default imagesMap;
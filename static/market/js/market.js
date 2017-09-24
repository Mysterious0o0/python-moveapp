$(document).ready(function () {
    var alltypebtn = document.getElementById('alltypebtn')
    var showsortbtn = document.getElementById('showsortbtn')
    var sortdiv = document.getElementById('sortdiv')
    var typediv = document.getElementById('typediv')


    typediv.style.display = 'none'
    sortdiv.style.display = 'none'

    alltypebtn.addEventListener('click',function () {
        if (typediv.style.display == 'none') {
            typediv.style.display = 'block'
        }else {
            typediv.style.display = 'none'
        }
        sortdiv.style.display = 'none'
    },false)

    showsortbtn.addEventListener('click',function () {
        if (sortdiv.style.display == 'none') {
            sortdiv.style.display = 'block'
        }else {
            sortdiv.style.display = 'none'
        }
        typediv.style.display = 'none'
    },false)

    typediv.addEventListener('click',function () {
        typediv.style.display = 'none'
    },false)

    sortdiv.addEventListener('click',function () {
        sortdiv.style.display = 'none'
    },false)

    //window.location.pathname:获取当前网址的文件地址即/market/103581/0/0/
    var num = window.location.pathname
    num1 = num.match(/\d+/g)
    document.getElementById(num1[0]).setAttribute('class','yellowSlide')

    //修改购物车
    var addShoppings = document.getElementsByClassName('addShopping')
    var subShoppings = document.getElementsByClassName('subShopping')

    for(var i = 0; i < addShoppings.length; i++){
        addShopping = addShoppings[i]
        addShopping.addEventListener('click',function () {
            //获取标签
            pid = this.getAttribute('ga')
            //增加
            $.post("/changecart/0/",{"productid":pid}, function(data){
                if(data.status == 'success'){
                //添加成功。把span的innerHTML编程当前数量
                    document.getElementById(pid).innerHTML = data.data
                }else {
                    if (data.data ==-1){
                        window.location.href = 'http://127.0.0.1:8000/login/'
                    }
                }
            })

        })
    }
    for(var i = 0;i<subShoppings.length; i++){
        subShopping = subShoppings[i]
        subShopping.addEventListener('click',function () {
            //减少
            pid = this.getAttribute('ga')
            $.post('/changecart/1/',{'productid':pid},function (data) {
                if(data.status == 'success'){
                    //删除成功。把span的innerHTML编程当前数量
                    document.getElementById(pid).innerHTML = data.data
                }
            })

        })
    }


})

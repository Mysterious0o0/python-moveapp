$(document).ready(function () {
    var alltypebtn = document.getElementById('alltypebtn')
    var showsortbtn = document.getElementById('showsortbtn')
    var sortdiv = document.getElementById('sortdiv')
    var typediv = document.getElementById('typediv')


    typediv.style.display = 'none'
    sortdiv.style.display = 'none'

    alltypebtn.addEventListener('click',function () {
        typediv.style.display = 'block'
        sortdiv.style.display = 'none'
    },false)

    showsortbtn.addEventListener('click',function () {
        typediv.style.display = 'none'
        sortdiv.style.display = 'block'
    },false)

    typediv.addEventListener('click',function () {
        typediv.style.display = 'none'
    },false)

    sortdiv.addEventListener('click',function () {
        sortdiv.style.display = 'none'
    },false)


    // for(var i = 0;i < 11;i++){
    //     idtimes = "yellowSlide-"+"i"
    //     var yellow = document.getElementById(idtimes)
    //     yellow.style.display = 'none'
    // }

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

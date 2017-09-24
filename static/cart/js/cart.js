$(document).ready(function () {
    //修改购物车
    var addShoppings = document.getElementsByClassName('addShopping')
    var subShoppings = document.getElementsByClassName('subShopping')
    for(var i = 0;i<addShoppings.length; i++){
        addShopping = addShoppings[i]
        addShopping.addEventListener('click',function () {
            //获取标签
            pid = this.getAttribute('ga')
            //增加
            $.post('/changecart/0/',{'productid':pid},function (data) {
                if(data.status == 'success'){
                //添加成功。把span的innerHTML编程当前数量

                    document.getElementById(pid).innerHTML = data.data
                    document.getElementById(pid+'price').innerHTML = data.price
                    priceUpdata()
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
                    document.getElementById(pid+'price').innerHTML = data.price
                    if (data.data== 0){
                        // window.location.href='http:127.0.0.1:8000/cart'
                        var li = document.getElementById(pid + 'li')
                        li.parentNode.removeChild(li)
                        priceUpdata()
                    }
                }
            })

        })
    }
    var ischoses = document.getElementsByClassName('ischose')
    for(var j = 0;j < ischoses.length; j++){
        ischose = ischoses[j]
        ischose.addEventListener('click',function () {
            pid = this.getAttribute('goodsid')
            $.post("/changecart/2/",{'productid':pid},function (data) {
                if(data.status == 'success'){
                    // window.location.href='http:127.0.0.1:8000/cart'
                    var s = document.getElementById(pid+'a')
                    s.innerHTML = data.data
                    priceUpdata()
                }
            })

        },false)
    }
    function priceUpdata() {
        $.post("/allprice/0/",function (data) {
            if(data.status == 'success'){
                document.getElementById('money').innerHTML = data.price
                //全选判断
                document.getElementById('allchose').innerHTML = data.data
            }
        })
    }
    priceUpdata()

    // var allchose = document.getElementsByClassName('confirm')
    // allchose.addEventListener('click',function () {
    //     var str = '√'
    //     document.getElementById('allchose').innerHTML = data.data
    //
    //     $.post('/allprice/1/',function (data) {
    //         if(data.status == 'success'){
    //             console.log('success')
    //         }
    //     })
    // })


})
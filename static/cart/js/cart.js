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
                }
            })

        },false)
    }

    var ok = document.getElementById('ok')
    ok.addEventListener('click',function () {
        var f = confirm("是否确定下单？")
        if(f){
            $.post('/saveorder/',function (data) {
                if (data.status == 'success'){
                    window.location.href = 'http://127.0.0.1:8000/cart/'
                }
            })
        }
    })




})
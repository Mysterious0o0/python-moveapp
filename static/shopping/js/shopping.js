$(document).ready(function () {
    $.post("/allprice/0/",function (data) {
        if(data.status == 'success'){
            document.getElementById('money').innerHTML = data.price

        }
    })

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
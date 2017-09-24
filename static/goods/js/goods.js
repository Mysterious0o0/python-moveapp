$(document).ready(function () {
    // var addShopping = document.getElementsByClassName('addShopping')
    // addShopping.addEventListener('click',function () {
    $('#addShopping').click(function(){
        gid = this.getAttribute('ga')
        $.post('/changecart/0/',{"productid":gid},function (data) {
            if(data.status == 'success'){
               console.log("success")
                }else {
                    if (data.data ==-1){
                        window.location.href = 'http://127.0.0.1:8000/login/'
                    }
                }
        })
    });
})
$(document).ready(function () {
    var accunt = document.getElementById('accunt')
    var accunterr = document.getElementById('accunterr')
    var checkerr = document.getElementById('checkerr')

    var pass = document.getElementById('pass')
    var passerr = document.getElementById('passerr')


    var passwd = document.getElementById('passwd')
    var passwderr = document.getElementById('passwderr')



    accunt.addEventListener('focus',function () {
        accunterr.style.display = 'none'
        checkerr.style.display = 'none'
    },false)
    accunt.addEventListener('blur',function () {
        instr = this.value
        if (instr.length < 6||instr.length > 12){
            accunterr.style.display = 'block'
        }
        //验证是否被注册，调用ajax请求
        $.post("/checkuserid/",{"userid":instr},function (data) {
            if (data.status == "error"){
                checkerr.style.display = "block"
            }
        })
    },false)



    pass.addEventListener('focus',function () {
        passerr.style.display = 'none'
    },false)
    pass.addEventListener('blur',function () {
        instr = this.value
        if (instr.length < 6||instr.length > 12){
            passerr.style.display = 'block'
        }

    },false)


    passwd.addEventListener('focus',function () {
        passwderr.style.display = 'none'
    },false)
    passwd.addEventListener('blur',function () {
        instr = this.value
        if (pass.value!=instr){
            passwderr.style.display = 'block'
        }
    },false)
})
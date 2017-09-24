from django.shortcuts import render,redirect
from .models import Wheel,Nav,mustbuy,Shop,MainShow,FoodTypes,Goods,User,Cart,Order
# Create your views here.
import random ,time ,os
from django.conf import settings
def home(request):
    title = '主页'
    wheelsList = Wheel.objects.all()
    navList = Nav.objects.all()
    mustbuyList = mustbuy.objects.all()
    shopList = Shop.objects.all()
    shop1 = shopList[0]
    shop2 = shopList[1:3]
    shop3 = shopList[3:7]
    shop4 = shopList[7:11]
    mainList = MainShow.objects.all()

    return render(request,'axf/home.html',locals())
    # return render(request,'axf/home.html',{"title":"主页","wheelsList":wheelsList,"navList":navList,"mustbuyList":mustbuyList,"shop1":shop1,"shop2":shop2,"shop3":shop3,"shop4":shop4,"mainList":mainList})

def market(request,categoryid,cid,sortid):
    title = "闪送超市"
    leftSlider = FoodTypes.objects.all()

    if cid == '0':
        productList = Goods.objects.filter(categoryid=categoryid)
    else:
        productList = Goods.objects.filter(categoryid = categoryid,childcid = cid)

    group = leftSlider.get(typeid=categoryid)
    childList = []
    # 全部分类:0#进口水果:103534#国产水果:103533
    childnames = group.childtypenames
    arr1 = childnames.split('#')
    for str in arr1:
        arr2 = str.split(':')
        obj = {'childName':arr2[0],'childId':arr2[1]}
        childList.append(obj)
    # 排序
    if sortid == '1':
        productList = productList.order_by('productnum')
    elif sortid == '2':
        productList = productList.order_by('price')
    elif sortid == '3':
        productList = productList.order_by('-price')


    token = request.session.get('token')
    if token:
        user = User.objects.get(userToken=token)
        cartlist = Cart.objects.filter(userAccount=user.userAccount)
        for p in productList:
            for c in cartlist:
                if c.productid == p.productid:
                    p.num = c.productnum
                    continue

    return render(request,'axf/market.html',locals())

# 商品详页
def goods(request,categoryid,cid,sortid,goodsid):
    title:'商品详页'
    onegoods = Goods.objects.get(id=goodsid)
    print(onegoods)
    return render(request, 'axf/goods.html', locals())



def cart(request):
    title = '购物车'
    cartlist = []
    token = request.session.get('token')
    if token != None:
        user = User.objects.get(userToken=token)
        cartlist = Cart.objects.filter(userAccount=user.userAccount)

        return render(request, 'axf/cart.html', locals())
    else:
        return redirect('/login/')

# 购物车详情页
def cartgoods(request,goodsid):

    onegoods = Goods.objects.get(productid=goodsid)
    return render(request,'axf/goods.html',locals())
# 立即支付
def buy(request):
    taken = request.session.get('token')
    user = User.objects.get(userToken=taken)
    productid = request.POST.get('productid')
    cartlist = Goods.objects.get(productid=productid)
    return JsonResponse({'status':'success'})
    # return render(request,'axf/shopping.html',locals())



# 更改购物车
def changecart(request,flag):
    # 判断用户是否登录
    token = request.session.get('token')
    if token == None:
        return JsonResponse({'data':-1,'status':'error'})
    # 从html获取商品id
    productid = request.POST.get('productid')
    # 从商品id获取商品信息
    product = Goods.objects.get(productid=productid)
    # 有token值获取用户信息
    user = User.objects.get(userToken=token)

    if flag == '0':
        # 判断库存
        if product.storenums == 0:
            return JsonResponse({'data': -2, 'status': 'error'})
        # 拿用户的所有数据
        carts = Cart.objects.filter(userAccount=user.userAccount)
        c = None
        # 有没有订单，如果没有生成一条订单
        if carts.count() == 0:
            # 直接增加一条数据
            c = Cart.createcart(user.userAccount,productid,1,product.price,True,product.productimg,product.productlongname,False)
            c.save()
        else:
            # 有没有该产品订单
            try:
                c = carts.get(productid=productid)
                # 修改数量和价格
                c.productnum += 1
                c.productprice = "%.2f"%(float(product.price) * c.productnum)
                c.save()
            except Cart.DoesNotExist as e:
                # 直接增加一条订单
                c = Cart.createcart(user.userAccount, productid, 1, product.price, True, product.productimg,product.productlongname, False)
                c.save()
        # 库存减一
        product.storenums -= 1
        product.save()
        return JsonResponse({"data":c.productnum,'status':'success','price':c.productprice})

    elif flag == '1':
        # 拿用户的所有数据
        carts = Cart.objects.filter(userAccount=user.userAccount)
        c = None
        # 有没有订单，如果没有生成一条订单
        if carts.count() == 0:
            # 直接减加一条数据
            return JsonResponse({'data': -2, 'status': 'error'})
        else:
            # 有没有该产品订单
            try:
                c = carts.get(productid=productid)
                # 修改数量和价格
                c.productnum -= 1
                c.productprice = "%.2f" % (float(product.price) * c.productnum)
                if c.productnum == 0:
                    c.delete()
                else:
                    c.save()
            except Cart.DoesNotExist as e:
                return JsonResponse({'data': -2, 'status': 'error'})
        # 库存加一
        product.storenums += 1
        product.save()

        return JsonResponse({"data": c.productnum, 'status': 'success','price':c.productprice})

    elif flag == '2':
        carts = Cart.objects.filter(userAccount=user.userAccount)
        c = carts.get(productid=productid)
        c.isChose = not c.isChose
        c.save()
        str = ''
        if c.isChose :
            str = '√'
        return JsonResponse({'data':str,'status':'success'})


def allprice(request,flag):
    token = request.session.get('token')
    user = User.objects.get(userToken=token)
    carts = Cart.objects.filter(userAccount=user.userAccount,isChose=True)
    allcarts = Cart.objects.filter(userAccount=user.userAccount)
    if flag == '0':
    # 全选判断
        if(len(carts) == len(allcarts)):
            str = '√'
        else:
            str = ''
        allprice = 0
        for item in carts:
            allprice += float(item.productprice)
    return JsonResponse({'price':allprice,'data':str,'status':'success'})
    # elif flag == 1 :
    #     for everycart in allcarts:
    #         everycart.isChose = True
    #     everycart.save()
    #     str = '√'
    #     return JsonResponse({'data': str, 'status': 'success'})

def shopping(request):
    token = request.session.get('token')
    user = User.objects.get(userToken=token)
    cartlist = Cart.objects.filter(userAccount=user.userAccount,isChose=True)
    return render(request,'axf/shopping.html',locals())











def mine(request):
    title = '我的'
    username = request.session.get('username','未登录')
    return render(request,'axf/mine.html',locals())

#登录
from .forms.login import LoginForm
def login(request):
    if request.method == 'POST':
        f = LoginForm(request.POST)
        if f.is_valid():
            # 信息格式没多大问题，可以验证账号密码的正确性
            nameid= f.cleaned_data['username']
            pswd = f.cleaned_data['passwd']
            try:
                user = User.objects.get(userAccount=nameid)
                if user.userPasswd != pswd:
                    #c
                    return redirect('/login/')
            except User.DoesNotExist as e:
                #c
                return redirect('/login/')
            #登录成功
            user.userToken = str(time.time()+random.randrange(1,100000))
            user.save()
            request.session['username'] = user.userName
            request.session['token'] = user.userToken
            return redirect('/mine/')
        else:
            return render(request, 'axf/login.html', {'title': '登录', 'form': f,'error':f.errors})
    else:
        f = LoginForm()
        return render(request, 'axf/login.html',{'title':'登录','form':f})


# 注册
def register(request):
    if request.method == 'POST':
        userAccount = request.POST.get('userAccount')
        userPasswd = request.POST.get("userPasswd")
        userName = request.POST.get('userName')
        userPhone = request.POST.get('userPhone')
        userAdderss = request.POST.get('userAdderss')
        userRank = 0
        userToken = str(time.time()+random.randrange(1,100000))
        f = request.FILES['userImg']
        userImg = os.path.join(settings.MDEIA_ROOT,userAccount+'.png')
        with open(userImg,"wb") as fp:
            for data in f.chunks():
                fp.write(data)
        user = User.createuser(userAccount,userPasswd,userName,userPhone,userAdderss,userImg,userRank,userToken)
        user.save()
        request.session['username'] = userName
        request.session['token'] = userToken
        return redirect('/mine/')
    else:
        return render(request,'axf/register.html',{'title':'注册'})

# 退出登录
from django.contrib.auth import logout
def quit(request):
    logout(request)
    return redirect('/mine/')


from django.http import JsonResponse
def checkuserid(request):
    userid = request.POST.get('userid')
    try:
        user = User.objects.get(userAccount=userid)
        return JsonResponse({'data':"该用户已被注册",'status':"error"})
    except User.DoesNotExist as e :
        return JsonResponse({'data':"可以注册",'status':"success"})

# 保存订单
def saveorder(request):
    # 判断用户是否登录
    token = request.session.get('token')
    if token == None:
        return JsonResponse({'data': -1, 'status': 'error'})
    user = User.objects.get(userToken=token)
    carts = Cart.objects.filter(isChose=True)
    if carts.count() == 0:
        return JsonResponse({'data':-1,'status':'error'})
    oid = "%d"%(time.time()+random.randrange(1,10000))
    o = Order.createorder(oid,user.userAccount,0)
    o.save()
    for item in carts:
        item.isDelete = True
        item.orderid = oid
        item.save()
    #模型管理类(未支付订单)在model中添加模型管理了，进行重定向显示
    return JsonResponse({'status':'success'})



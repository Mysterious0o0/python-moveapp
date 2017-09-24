from django.conf.urls import url
from . import views
urlpatterns = [
    # 主页
    url(r'^home/$',views.home,name = 'home'),

    # 超市
    url(r'^market/(\d+)/(\d+)/(\d+)/$',views.market,name = 'market'),
    # 商品详情页
    url(r'^market/(\d+)/(\d+)/(\d+)/(\d+)/$',views.goods,name='goods'),

    # 购物车
    url(r'^cart/$',views.cart,name = 'cart'),
    # 下订单
    url(r'^saveorder/$',views.saveorder,name='saveorder'),
    # 更新购物车
    url(r'^changecart/(\d+)/$',views.changecart,name='changecart'),
    # 购物车商品
    url(r'^cartgoods/(\d+)/$',views.cartgoods,name='cartgoods'),
    # 总价格
    url(r'^allprice/$',views.allprice,name='allprice'),

    # 我的
    url(r'^mine/$',views.mine,name = 'mine'),
    # 登录
    url(r'^login/$',views.login,name='login'),
    # 注册
    url(r'^register/$',views.register,name='register'),
    # 验证账号是否被注册
    url(r'^checkuserid/$',views.checkuserid,name='checkuserid'),
    # 退出
    url(r'^quit/$',views.quit,name='quit'),










]
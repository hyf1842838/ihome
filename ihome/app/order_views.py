from datetime import datetime

from flask import Blueprint, render_template, jsonify, request, session

from app.models import House, Order, User
from utils.middleware import need_check

order_blue = Blueprint('order', __name__)


@order_blue.route('/booking/', methods=['GET'])
def booking():
    return render_template('booking.html')


@order_blue.route('/book_time/', methods=['POST'])
def book_time():
    start_time = request.form.get('start_time')
    end_time = request.form.get('end_time')
    house_id = request.form.get('house_id')
    if all([start_time, end_time, house_id]):
        begin_date = datetime.strptime(start_time, '%Y-%m-%d')
        end_date = datetime.strptime(end_time, '%Y-%m-%d')
        all_day = (end_date - begin_date).days
        if all_day >= 0:
            all_day += 1
            hous = House.query.get(house_id)
            pricess = hous.price * all_day
            orders = Order()
            orders.user_id = session['user_id']
            orders.house_id = house_id
            orders.begin_date = begin_date
            orders.end_date = end_date
            orders.days = all_day
            orders.house_price = hous.price
            orders.amount = pricess
            orders.add_update()
            return jsonify({'code': 200, 'msg': '请求成功'})
        return jsonify({'code': 2750, 'msg': '请选择正确的起始日期'})
    return jsonify({'code': 2760, 'msg': '请选择起始日期和结束日期'})


@order_blue.route('/orders/', methods=['GET'])
def orders():
    return render_template('orders.html')


@order_blue.route('/my_order/', methods=['GET'])
@need_check
def my_order():
    user_id = session['user_id']
    user = User.query.get(user_id)
    all_order = user.orders
    print(all_order)
    dict_order = [orde.to_dict() for orde in all_order]
    print(dict_order)
    return jsonify({'code': 200, 'msg': '请求成功', 'orders': dict_order})


# 客户订单
@order_blue.route('/lorder/', methods=['GET'])
@need_check
def lorder():
    return render_template('lorders.html')


@order_blue.route('/lorders_order/', methods=['GET'])
@need_check
def lorders_order():
    user_id = session['user_id']
    houses = House.query.filter_by(user_id=user_id)
    orderss = []
    for hous in houses:
        orderss.append([orde.to_dict() for orde in hous.orders])
    return jsonify({'code': 200, 'msg': '请求成功', 'orders': orderss})
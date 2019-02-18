import os
import uuid

from flask import Blueprint, render_template, session, jsonify, request

from app.models import User, House, Area, Facility, HouseImage
from utils.middleware import need_check

house_blue = Blueprint('house', __name__)


@house_blue.route('/house/', methods=['GET'])
@need_check
def house():
    return render_template('myhouse.html')


@house_blue.route('/myhouse/', methods=['GET'])
@need_check
def myhouse():
    # 1.获取用户
    user_id = session['user_id']
    user = User.query.get(user_id)
    if all([user.id_name, user.id_card]):
        return jsonify({'code': 200, 'msg': '已实名认证'})
    return jsonify({'code': 201, 'msg': '还未实名认证，无法发布新房源'})


@house_blue.route('/newhouse/', methods=['GET'])
@need_check
def newhosue():
    return render_template('newhouse.html')


@house_blue.route('/ne_house/', methods=['GET'])
@need_check
def ne_house():
    area = Area.query.all()
    facility = Facility.query.all()
    if all([area, facility]):
        dist = [dis.to_dict() for dis in area]
        faci = [fac.to_dict() for fac in facility]
        return jsonify({'code': 200, 'msg': '请求成功', 'data': dist, 'facility': faci})
    return jsonify({'code': 2600, 'msg': '没有该区域的地址'})


@house_blue.route('/newhouse/', methods=['POST'])
@need_check
def new_newhouse():
    # 1.获取数据
    tit = request.form.get('title')
    pri = request.form.get('price')
    ar_id = request.form.get('area_id')
    addr = request.form.get('address')
    room_co = request.form.get('room_count')
    are = request.form.get('acreage')
    uni = request.form.get('unit')
    cap = request.form.get('capacity')
    bed = request.form.get('beds')
    dep = request.form.get('deposit')
    min_day = request.form.get('min_days')
    max_day = request.form.get('max_days')
    fac = request.form.getlist('facility')

    if all([tit, pri, ar_id, addr, room_co, are, uni, cap, bed, dep, min_day, max_day, fac]):
        # 2.获取用户并添加属性
        user_id = session['user_id']
        hous = House()
        hous.title = tit
        hous.price = pri
        hous.area_id = ar_id
        hous.address = addr
        hous.room_count = room_co
        hous.acreage = are
        hous.unit = uni
        hous.capacity = cap
        hous.beds = bed
        hous.deposit = dep
        hous.min_days = min_day
        hous.max_days = max_day
        hous.user_id = user_id

        for fac_id in fac:
            facility = Facility.query.get(fac_id)
            hous.facilities.append(facility)
        hous.add_update()
        return jsonify({'code': 200, 'msg': '请求成功', 'house_id': hous.id})
    return jsonify({'code': 2700, 'msg': '请填写完所有信息'})


@house_blue.route('/image_house/', methods=['POST'])
@need_check
def image_house():
    # 1.获取图片
    image = request.files.get('house_image')
    # 2.获取房屋编号
    house_id = request.form.get('house_id')
    if image:
        # 3.获取媒体文件路径
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        STATIC_DIR = os.path.join(BASE_DIR, 'static')
        MEDIA_DIR = os.path.join(STATIC_DIR, 'media')
        # 4.生成图片名称
        filename = str(uuid.uuid4())
        a = image.mimetype.split('/')[-1]
        name = filename + '.' + a
        # 5.保存图片
        path = os.path.join(MEDIA_DIR, name)
        image.save(path)
        # 6.保存到数据库中
        hous = House.query.get(house_id)
        # 7.生成首图
        if not hous.index_image_url:
            hous.index_image_url = name
        # 8.生成图片对象并添加属性
        house_image = HouseImage()
        house_image.house_id = house_id
        house_image.url = name
        house_image.add_update()
        # 9.给房屋添加图片
        hous.images.append(house_image)
        hous.add_update()
        # 10.将已上传的图片展示到页面
        images = HouseImage.query.filter(HouseImage.house_id == house_id)
        image = [{'id': imag.id, 'house_id': imag.house_id, 'url': imag.url} for imag in images]
        return jsonify({'code': 200, 'msg': '请求成功', 'image': image})


@house_blue.route('/house_info/', methods=['GET'])
@need_check
def house_info():
    user_id = session['user_id']
    user = User.query.get(user_id)
    all_house = user.houses
    if all_house:
        house_list = [hous.to_dict() for hous in all_house]
        return jsonify({'code': 200, 'msg': '请求成功', 'houses': house_list})
    return jsonify({'code': 2550, 'msg': '暂时还没有房源,请前往添加'})


@house_blue.route('/detail/', methods=['GET'])
@need_check
def detail():
    return render_template('detail.html')


@house_blue.route('/detail/<int:id>/', methods=['GET'])
@need_check
def new_detail(id):
    hous = House.query.filter(House.id == id).first()
    if hous:
        return jsonify({'code': 200, 'msg': '请求成功', 'detail': hous.to_full_dict()})
    return jsonify({'code': 2700, 'msg': '没有相关房屋信息'})


@house_blue.route('/index/', methods=['GET'])
def index():
    return render_template('index.html')


@house_blue.route('/my_index/', methods=['GET'])
def my_index():
    hous = House.query.all()
    houses = [{'house_id': hou.id, 'imag': hou.index_image_url, 'title': hou.title} for hou in hous]
    areas = Area.query.all()
    area = [are.to_dict() for are in areas]
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        return jsonify({'code': 200, 'msg': '查询成功', 'data': {'houses': houses, 'area': area, 'user_name': user.name}})
    return jsonify({'code': 200, 'msg': '查询成功', 'data': {'houses': houses, 'area': area, 'user_name': ''}})


@house_blue.route('/search/', methods=['GET'])
def search():
    return render_template('search.html')


@house_blue.route('/area_display/', methods=['GET'])
def area_display():
    aid = request.args.get('aid')
    # aname = request.args.get('aname')
    # sd = request.args.get('sd')
    # ed = request.args.get('ed')
    houses = House.query.filter(House.area_id == aid)
    house_dict = [[hous.to_full_dict(), User.query.get(hous.user_id).avatar] for hous in houses]
    areas = Area.query.all()
    areaes = [area.to_dict() for area in areas]
    return jsonify({'code': 200, 'msg': '请求成功', 'areas': areaes, 'houses': house_dict})



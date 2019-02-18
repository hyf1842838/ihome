import random
import re

import os
import uuid

from flask import Blueprint, render_template, request, jsonify, session
from flask_login import LoginManager, login_user

from app.models import User
from utils.middleware import need_check

user_blue = Blueprint('user', __name__)


@user_blue.route('/register/', methods=['GET'])
def register():
    return render_template('register.html')


@user_blue.route('/register/', methods=['POST'])
def my_register():
    # 获取参数
    # 1.验证参数是否都填写了
    mobile = request.form.get('mobile')
    imagecode = request.form.get('imagecode')
    passwd = request.form.get('passwd')
    passwd2 = request.form.get('passwd2')
    if not all([mobile, imagecode, passwd, passwd2]):
        return jsonify({'code': 1001, 'msg': '请填写完整的参数'})

    # 2.验证手机号正确
    if not re.match('^1[3456789]\d{9}$', mobile):
        return jsonify({'code': 1002, 'msg': '手机号不正确'})
    # 3.验证图片验证码
    if session['img_code'] != imagecode:
        return jsonify({'code': 1003, 'msg': '验证码不正确'})

    # 4.密码和确认密码是否一致
    if passwd != passwd2:
        return jsonify({'code': 1004, 'msg': '密码不一致'})

    # 验证手机号是否被注册
    user = User.query.filter_by(phone=mobile).first()
    if user:
        return jsonify({'code': 1005, 'msg': '手机号已被注册，请重新注册'})
    # 创建注册信息
    user = User()
    user.phone = mobile
    user.name = mobile
    user.password = passwd
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@user_blue.route('/code/', methods=['GET'])
def get_code():
    # 获取验证码
    # 方式1：后端生成图片，并返回验证码图片的地址（不推荐）
    # 方式2：后端只生成随机参数，返回给页面，在页面中再生成图片(前端做)
    s = 'abcdefghijklmnopqrstuvwxyz1234567890'
    code = ''
    for i in range(4):
        code += random.choice(s)
    session['img_code'] = code
    return jsonify({'code': 200, 'msg': '请求成功', 'data': code})


login_manage = LoginManager()


@user_blue.route('/my_login/', methods=['GET'])
def my_login():
    return render_template('login.html')


@user_blue.route('/my_login/', methods=['POST'])
def my_login_in():
    # 实现登陆
    mobile = request.form.get('mobile')
    passwd = request.form.get('passwd')
    # 1.检验参数是否填写完整
    if not all([mobile, passwd]):
        return jsonify({'code': 1006, 'msg': '密码和账号不能为空'})
    # 2.获取手机号对应的用户信息
    user = User.query.filter(User.phone == mobile).first()
    if not user:
        return jsonify({'code': 1007, 'msg': '该账号没有被注册，请前往注册界面注册'})
    # 3.密码校验
    if user.check_pwd(passwd):
        # 4.登陆标志设置
        # session['user_id'] = user.id
        login_user(user)
        return jsonify({'code': 200, 'msg': '请求成功'})

    else:
        return jsonify({'code': 1008, 'msg': '密码错误'})


@login_manage.user_loader
def load_user(user_id):
    return User.query.filter(User.id == user_id).first()


@user_blue.route('/my/', methods=['GET'])
@need_check
def my():
    return render_template('my.html')


@user_blue.route('/user_info/', methods=['GET'])
def user_info():
    user_id = session['user_id']
    user = User.query.get(user_id)
    return jsonify({'code': 200, 'msg': '请求成功', 'data': user.to_basic_dict()})


@user_blue.route('/profile/', methods=['GET'])
@need_check
def profile():
    return render_template('profile.html')


# 修改头像
@user_blue.route('/profile/', methods=['PATCH'])
@need_check
def patch_profile():
    # 1.获取图片
    ima = request.files.get('avatar')
    if not ima:
        return jsonify({'code': 1009, 'msg': '上传图片不能为空'})
    else:
        # 2.获取项目路径
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # 3.获取媒体文件的路径
        STATIC_DIR = os.path.join(BASE_DIR, 'static')
        MEDIA_DIR = os.path.join(STATIC_DIR, 'media')
        # 4.生成随机图片名称
        filename = str(uuid.uuid4())
        # 5.获取图片的后缀
        a = ima.mimetype.split('/')[-1]
        # 6.生成文件名
        name = filename + '.' + a
        # 7.拼接图片地址
        path = os.path.join(MEDIA_DIR, name)
        # 8.将图片保存到media文件夹中
        ima.save(path)
        # 9.获取用户对象
        user_id = session['user_id']
        user = User.query.filter_by(id=user_id).first()
        # 10.给用户头像赋值并保存
        user.avatar = name
        user.add_update()
        return jsonify({'code': 200, 'msg': '请求成功', 'avatar': user.avatar})


# 修改姓名
@user_blue.route('/my_profile/', methods=['POST'])
@need_check
def my_profile():
    # 1.获取用户名
    name = request.form.get('name')
    if not name:
        return jsonify({'code': 1010, 'msg': '姓名不能为空'})
    else:
        user = User.query.filter(User.name == name).first()
        if user:
            return jsonify({'code': 1011, 'msg': '已存在该用户名，请重新输入'})
        else:
            user_id = session['user_id']
            user = User.query.get(user_id)
            user.name = name
            user.add_update()
            return jsonify({'code': 200, 'msg': '修改成功'})


@user_blue.route('/auth/', methods=['GET'])
def auth():
    return render_template('auth.html')


@user_blue.route('/auth/', methods=['POST'])
@need_check
def my_auth():
    # 1.获取用户名和身份证号
    real_name = request.form.get('real_name')
    id_card = request.form.get('id_card')
    # 2.判断用户名及身份证是否填写完全
    if not (2 <= len(real_name) <= 4 or len(id_card) == 18):
        return jsonify({'code': 2000, 'msg': '请填写合法的用户名(2至4个字符)或身份证号(18个字符)'})
    else:
        if re.search(r'[^\u4e00-\u9fa5]', real_name):
            return jsonify({'code': 2001, 'msg': '姓名中包含不合法的字符(请全部使用汉字)'})
        if not re.fullmatch(r'^\d{17}[xX\d]$', id_card):
            return jsonify({'code': 2002, 'msg': '身份证号不合法'})
        # 3.查询该身份证号是否已被用于实名认证过
        user = User.query.filter_by(id_card=id_card).first()
        if user:
            return jsonify({'code': 2003, 'msg': '该身份证号已被实名认证'})
        # 4.保存实名认证信息
        user_id = session['user_id']
        user = User.query.get(user_id)
        user.id_name = real_name
        user.id_card = id_card
        user.add_update()
        return jsonify({'code': 200, 'msg': '实名认证成功'})


@user_blue.route('/my_auth/', methods=['GET'])
@need_check
def display_auth():
    user_id = session['user_id']
    user = User.query.get(user_id)
    if user.id_name and user.id_card:
    # if all([user.id_name, user.id_card]):
        return jsonify({'code': 200, 'msg': '请求成功', 'data': user.to_auth_dict()})
    return jsonify({'code': 2500, 'msg': '请进行实名认证'})


@user_blue.route('/logout/', methods=['GET'])
def logout():
    del session['user_id']
    return jsonify({'code': 200, 'msg': '请求成功', 'errno': 0})

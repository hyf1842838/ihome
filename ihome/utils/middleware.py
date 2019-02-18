from functools import wraps

from flask import session, redirect, url_for

# 外层函数嵌套内层函数
# 外层函数返回内层函数
#内层函数调用外层函数的参数


def need_check(func):
    @wraps(func)
    def check_path(*args, **kwargs):
        if 'user_id' in session:
            # 判断session中是否存在登陆的标识user_id
            return func(*args, **kwargs)
        else:
            return redirect(url_for('user.my_login'))
    return check_path
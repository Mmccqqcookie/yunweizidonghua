#/usr/bin/env python
#-*- coding:utf-8 -*-

from  repository.userrepository import Userrepository
import datetime

class UserType():
    #用户类型
    USER_TYPE = (
        {'nid': 1, 'caption': '超级管理员'},
        {'nid': 2, 'caption': '普通用户'}
    )
    def __init__(self,user_type):
        self.nid = user_type

    def get_caption(self):
        caption = None
        for item in UserType.USER_TYPE:
            if item['nid'] == self.nid:
                caption = item['caption']
                break
        return caption
    caption = property(get_caption)


class MUser:
    def __init__(self,id,user,password,email,tel,user_type):
        self.id = id
        self.user = user
        self.password = password
        self.email = email
        self.tel = tel
        self.user_type = UserType(user_type)


class UserService:

    def __init__(self):
        self.userrepository = Userrepository()

    def check_login(self,user=None,email=None,password=None):
        if user:
            user_model = self.userrepository.check_user_password(user,password)
        if email:
            user_model = self.userrepository.check_email_password(email,password)

        if user_model:
            current_time = datetime.datetime.now()
            if user:
                self.userrepository.update_login_time(user,current_time)
            elif email:
                self.userrepository.update_login_time(email,current_time)
        return user_model

    def check_user_exist(self,email,tel):
        user_model = self.userrepository.check_email_tel(email,tel)
        return user_model

    def add_user(self,user,password,email,tel,user_type):
        self.userrepository.add_user(user,password,email,tel,user_type)

    def fetch_all_by_user(self):
        user_model = self.userrepository.fetch_all_by_user()
        return user_model

    def fetch_one_by_id(self,id):
        user_model = self.userrepository.fetch_one_by_id(id)
        return user_model

    def update_user_message(self,id,username,password,email,tel,user_type):
        self.userrepository.update_user_message(id,username,password,email,tel,user_type)

    def del_user_id(self,id):
        self.userrepository.del_user_id(id)

    def check_usermessage(self,username,email,tel):
        user_model = self.userrepository.check_usermessage(username,email,tel)
        return user_model


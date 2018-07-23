#/usr/bin/env python
#-*- coding:utf-8 -*-
from Service.User.ModelView import UserModelView
from Service.User.response import UserResponse
from Model.User.User import UserService as model_user_service
import Common.Session as CSession


class UserService:
    def __init__(self):
        self.ModelUserService = model_user_service()
        self.response = UserResponse()
        self.user = None
        self.email = None
        self.model = None
        self.fetch_all_by_usermessage = []


    def check_login(self,handler):
        try:
            email_val = handler.get_argument('email')
            password = handler.get_argument('password')
            if '@' in email_val:
                self.email = email_val
            else:
                self.user = email_val
            if self.email:
                self.model = self.ModelUserService.check_login(email=self.email,password=password)
            elif self.user:
                self.model = self.ModelUserService.check_login(user=self.user, password=password)
            if not self.model:
                raise Exception('用户名和密码错误')

            else:
                model_view = UserModelView(id=self.model.id,
                                           user=self.model.user,
                                           password=self.model.password,
                                           email=self.model.email,
                                           tel=self.model.tel,
                                           user_type_id=self.model.user_type.nid,
                                           user_type_caption=self.model.user_type.caption)
                self.response.model_view = model_view

        except Exception as e:
            self.response.status = False
            self.response.message = str(e)


        return self.response

    def fetch_all_by_user(self):
        self.model = self.ModelUserService.fetch_all_by_user()
        if self.model:
            for line in self.model:
                model_view = UserModelView(id=line.id,
                                           user=line.user,
                                           password=line.password,
                                           email=line.email,
                                           tel=line.tel,
                                           user_type_id=line.user_type.nid,
                                           user_type_caption=line.user_type.caption)
                self.fetch_all_by_usermessage.append(model_view)
            self.response.model_view = self.fetch_all_by_usermessage
        return self.response

    def check_base_usermessage(self,handler):
        email = handler.get_argument('email',None)
        tel = handler.get_argument('tel',None)
        try:
            self.model = self.ModelUserService.check_user_exist(email,tel)
            if self.model:
                raise Exception('邮箱、电话已存在')

        except Exception as e:
            self.response.status =False
            self.response.message = str(e)

        return self.response

    def Create_User(self,handler):
        user = handler.get_argument('username')
        password = handler.get_argument('password')
        email = handler.get_argument('email')
        tel = handler.get_argument
        user_type = handler.get_argument('inlineRadioOptions')
        self.ModelUserService.add_user(user, password, email, tel, user_type)

    def fetch_one_by_id(self,id):
        try:
            self.model = self.ModelUserService.fetch_one_by_id(id)

            if self.model :
                model_view = UserModelView(id=self.model.id,
                                           user=self.model.user,
                                           password=self.model.password,
                                           email=self.model.email,
                                           tel=self.model.tel,
                                           user_type_id=self.model.user_type.nid,
                                           user_type_caption=self.model.user_type.caption)
                self.response.model_view = model_view
            else:
                raise Exception('没有此用户')
        except Exception as e:
            self.response.status = False
            self.response.message = str(e)

        return self.response

    def update_user_message(self,handler):
        id = handler.get_argument('id')
        username = handler.get_argument('username')
        password = handler.get_argument('password')
        email = handler.get_argument('email')
        tel = handler.get_argument('tel')
        user_type = handler.get_argument('inlineRadioOptions')

        try:
            self.ModelUserService.update_user_message(id,username,password,email,tel,user_type)
        except Exception as e:
            self.response.message = str(e)
            self.response.status = False

        return self.response

    def del_user_id(self,id):
        try:
            self.ModelUserService.del_user_id(id)
        except Exception as e:
            self.response.message = str(e)
            self.response.status = False

        return self.response

    def check_usermessage_and_add(self,username,password,email,tel,user_type):

        try:
            self.model = self.ModelUserService.check_usermessage(username,email,tel)
            if self.model:
                raise Exception('用户中存在数据库中已有的用户名、密码、邮箱、电话')
            else:
                self.ModelUserService.add_user(username,password,email,tel,user_type)
                if self.ModelUserService.check_user_exist(email,tel):
                    self.response.message = '{0}添加成功'.format(username)
        except Exception as e:
            self.response.status = False
            self.response.message = str(e)

        return self.response
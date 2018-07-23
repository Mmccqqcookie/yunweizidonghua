#/usr/bin/env python
#-*- coding:utf-8 -*-

class UserModelView:
    def __init__(self, id,user,password,email,tel,user_type_id,user_type_caption):
        self.id = id
        self.user = user
        self.password = password
        self.email = email
        self.tel = tel
        self.user_type_id = user_type_id
        self.user_type_caption = user_type_caption

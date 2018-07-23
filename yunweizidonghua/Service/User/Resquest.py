#/usr/bin/env python
#-*- coding:utf-8 -*-


class user_resquest:
    def __init__(self,handle):
        self.handle = handle

    @property
    def user(self):
        return self.handle.get_argument('username')
    @property
    def email(self):
        return self.handle.get_argument('email')
    @property
    def password(self):
        return self.handle.get_argument('password')

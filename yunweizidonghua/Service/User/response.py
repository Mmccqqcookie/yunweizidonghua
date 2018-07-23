#/usr/bin/env python
#-*- coding:utf-8 -*-

class UserResponse:
    def __init__(self,status=True,message='',model_view=None):
        self.status = status
        self.message = message
        self.model_view = model_view
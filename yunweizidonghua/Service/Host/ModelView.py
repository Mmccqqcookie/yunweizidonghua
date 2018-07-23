#/usr/bin/env python
#-*- coding:utf-8 -*-

class HostModelView:
    def __init__(self, id,hostname,ip,memory,disk,status_type_id,status_type_caption):
        self.id = id
        self.hostname = hostname
        self.ip = ip
        self.memory = memory
        self.disk = disk
        self.status_type_id = status_type_id
        self.status_type_caption = status_type_caption



class AddhostuserView:
    def __init__(self,id,username,password):
        self.id = id
        self.username = username
        self.password = password

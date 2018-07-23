#/usr/bin/env python
#-*- coding:utf-8 -*-
from Model.Hosts.Hosts import HostService
from Model.Hosts.Hosts import AddhostuserService as addhostuser
from Service.Host.response import HostResponse
from Service.Host.ModelView import HostModelView
from Service.Host.ModelView import AddhostuserView


class HostsService:
    def __init__(self):
        self.model =None
        self.ModelHostService = HostService()
        self.response = HostResponse()
        self.fetch_all_by_hostmessage = []

    def fetch_all_by_host(self):
        self.model = self.ModelHostService.fetch_all_by_host()
        if self.model:
            for line in self.model:
                line = HostModelView(id=line.id, hostname=line.hostname,
                                     ip=line.ip, memory=line.memory, disk=line.disk,
                                     status_type_id=line.status_type.nid,
                                     status_type_caption=line.status_type.caption)
                self.fetch_all_by_hostmessage.append(line)
            self.response.model_view = self.fetch_all_by_hostmessage
        else:
            self.response.model_view = self.fetch_all_by_hostmessage

        return self.response

    def check_host_exist(self,handler):
        hostname = handler.get_argument('hostname')
        ip = handler.get_argument('ip')
        try:
            self.model = self.ModelHostService.check_host_exist(hostname,ip)
            if self.model:
                raise Exception('主机、ip已存在！！！')

        except Exception as e:
            self.response.message = str(e)
            self.response.status = False
        return self.response

    def Create_host(self,handler):
        hostname = handler.get_argument('hostname')
        ip = handler.get_argument('ip')
        memory = handler.get_argument('memory')
        disk = handler.get_argument('disk')
        status = handler.get_argument('inlineRadioOptions')
        self.ModelHostService.add_host(hostname,ip,memory,disk,status)

    def fetch_one_by_id(self,id):
        try:
            self.model = self.ModelHostService.fetch_one_by_id(id)
            if self.model:
                line = HostModelView(id=self.model.id, hostname=self.model.hostname,
                             ip=self.model.ip, memory=self.model.memory, disk=self.model.disk,
                             status_type_id=self.model.status_type.nid,
                             status_type_caption=self.model.status_type.caption)

                self.response.model_view = line
            else:
                raise Exception('数据查询出错了！！！')
        except Exception as e:
            self.response.message = str(e)
            self.response.status = False
        return self.response

    def update_host_message(self,handler):
        id = handler.get_argument('id')
        hostname = handler.get_argument('hostname')
        ip = handler.get_argument('ip')
        memory = handler.get_argument('memory')
        disk = handler.get_argument('disk')
        status = handler.get_argument('inlineRadioOptions')
        try:
            self.ModelHostService.update_host_message(id,hostname,ip,memory,disk,status)
        except Exception as e:
            self.response.message = str(e)
            self.response.status = False
        return  self.response

    def del_host_id(self,id):
        try:
            self.ModelHostService.del_host_id(id)
        except Exception as e:
            self.response.message = str(e)
            self.response.status = False
        return self.response

    def check_hostmessage_and_add(self,hostname,ip,memory,disk,status):
        try:
            self.model = self.ModelHostService.check_host_exist(hostname,ip)
            if self.model:
                raise Exception('主机添加错误：主机、ip已存在')
            else:
                self.ModelHostService.add_host(hostname,ip,memory,disk,status)
                if self.ModelHostService.check_host_exist(hostname,ip):
                    self.response.message = '{0}主机添加成功'.format(hostname)
        except Exception as e:
            self.response.status = False
            self.response.message = str(e)

        return  self.response


class AddhostuserService:
    def __init__(self):
        self.model = None
        self.ModeladdHostuserService = addhostuser()
        self.response = HostResponse()
        self.fetch_all_by_user_message = []

    def fetch_all_by_user(self):
        self.model = self.ModeladdHostuserService.fetch_all_by_user()
        if self.model:
            for i in self.model:
                result = AddhostuserView(id=i.id,username=i.username,password=i.password)
                self.fetch_all_by_user_message.append(result)
            self.response.model_view = self.fetch_all_by_user_message
        else:
            self.response.model_view = []
        return self.response

    def fetch_one_by_id(self,id):
        self.model = self.ModeladdHostuserService.fetch_one_by_id(id)
        if self.model:
            result = AddhostuserView(id=self.model.id,username=self.model.username,password=self.model.password)
            self.response.model_view = result
            return self.response

    def fetch_one_by_user(self,username):
        try:
            self.model = self.ModeladdHostuserService.fetch_one_by_user(username)
            if self.model:
                result = AddhostuserView(id=self.model.id,username=self.model.username,password=self.model.password)
                return result
            else:
                raise Exception('无此用户')
        except Exception as e:
            self.response.message = str(e)
            self.response.status = False

    def add_user(self,handler):
        try:
            username = handler.get_argument('host_user')
            password = handler.get_argument('host_user_password')
            if self.ModeladdHostuserService.fetch_one_by_user(username):
                raise Exception('用户已存在')
            else:
                self.ModeladdHostuserService.add_user(username,password)
                if not self.ModeladdHostuserService.fetch_one_by_user(username):
                    raise Exception('用户添加失败')
        except Exception as e:
            self.response.status = False
            self.response.message = str(e)
        return self.response

    def del_user(self,id):
        self.ModeladdHostuserService.del_user(id)

    def update_host_user(self,handler):
        id = handler.get_argument('host_user_id')
        username = handler.get_argument('host_user')
        password = handler.get_argument('host_user_password')
        self.ModeladdHostuserService.update_username(id,username,password)
        return self.response



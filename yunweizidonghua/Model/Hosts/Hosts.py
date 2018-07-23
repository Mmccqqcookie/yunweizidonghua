#/usr/bin/env python
#-*- coding:utf-8 -*-
from repository.hostsrepository import Hostsrepository
from repository.addhostuserrepository import Addhostuserrepository


class HostsStatusType:
    STATUS_TYPE = (
        {'nid':1,'caption':'在线'},
        {'nid':2,'caption':'下线'},
        {'nid':3,'caption':'维护'},
        {'nid':4,'caption':'报修'}
    )

    def __init__(self,status_type):
        self.nid = status_type

    def get_caption(self):
        caption = None
        for item in HostsStatusType.STATUS_TYPE:
            if self.nid == item['nid']:
                caption = item['caption']
                break
        return caption
    caption = property(get_caption)

class MHosts:
    def __init__(self,id,hostname,ip,memory,disk,status_type):
        self.id = id
        self.hostname = hostname
        self.ip = ip
        self.memory = memory
        self.disk = disk
        self.status_type = HostsStatusType(status_type)


class HostService:
    def __init__(self):
        self.hostsrepository = Hostsrepository()

    def fetch_all_by_host(self):
        host_model = self.hostsrepository.fetch_all_by_host()
        return host_model

    def check_host_exist(self,hostname,ip):
        host_model = self.hostsrepository.fetch_host_Ip(hostname,ip)
        return host_model

    def add_host(self,hostname,ip,memory,disk,status):
        self.hostsrepository.add_host(hostname,ip,memory,disk,status)

    def fetch_one_by_id(self,id):
        host_model = self.hostsrepository.fetch_one_by_id(id)
        return host_model

    def update_host_message(self,id,hostname,ip,memory,disk,status):
        self.hostsrepository.update_host_message(id,hostname,ip,memory,disk,status)

    def del_host_id(self,id):
        self.hostsrepository.del_host_id(id)

class AddhostuserService:
    def __init__(self):
        self.addhostuserservice = Addhostuserrepository()

    def fetch_all_by_user(self):
        result = self.addhostuserservice.fetch_all_by_username()
        return result

    def fetch_one_by_id(self,id):
        result = self.addhostuserservice.fetch_one_by_id(id)
        return result
    def fetch_one_by_user(self,username):
        result = self.addhostuserservice.fetch_one_by_username(username)
        return result

    def add_user(self,username,password):
        self.addhostuserservice.add_username(username,password)

    def update_username(self,id,username,password):
        self.addhostuserservice.update_username_password(id,username,password)

    def del_user(self,id):
        self.addhostuserservice.del_username(id)
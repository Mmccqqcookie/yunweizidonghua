#/usr/bin/env python
#-*- coding:utf-8 -*-
from DB.models import *
from Irepository.Irepository import IHostrepository
import Model.Hosts.Hosts


class Hostsrepository(IHostrepository):
    def __init__(self):
        self.db_coon = DBconon()
        self.Session = sessionmaker(bind=DBconon().engine())
        self.session = self.Session()
        self.fetch_all_by_hostmessage = []

    def fetch_all_by_host(self):
        result = self.session.query(Host).all()
        if result:
            for line in result:
                line = Model.Hosts.Hosts.MHosts(id=line.id, hostname=line.hostname, ip=line.ip, memory=line.memory, disk=line.disk, status_type=line.status)
                self.fetch_all_by_hostmessage.append(line)
            result = self.fetch_all_by_hostmessage
        else:
            result = self.fetch_all_by_hostmessage
        return result


    def fetch_host_Ip(self,hostname,ip):
        result = self.session.query(Host).filter(or_(Host.hostname==hostname,Host.ip==ip)).first()
        if result:
            result = Model.Hosts.Hosts.MHosts(id=result.id, hostname=result.hostname,
                                              ip=result.ip, memory=result.memory,
                                              disk=result.disk, status_type=result.status)
        else:
            return None

        return result

    def add_host(self,hostname,ip,memory,disk,status):
        self.session.add(Host(hostname=hostname,ip=ip,memory=memory,disk=disk,status=status))
        self.session.commit()

    def del_host(self, *args, **kwargs):
        pass

    def fetch_one_by_id(self,id):
        result = self.session.query(Host).filter_by(id=id).first()
        if result:
            result = Model.Hosts.Hosts.MHosts(id=result.id, hostname=result.hostname,
                                              ip=result.ip, memory=result.memory,
                                              disk=result.disk, status_type=result.status)
        else:
            return None

        return result

    def update_host_message(self,id,hostname,ip,memory,disk,status):
        self.session.query(Host).filter_by(id=id).update({
            'hostname':hostname,'ip':ip,'memory':memory,'disk':disk,'status':status
        })
        self.session.commit()

    def del_host_id(self,id):
        self.session.query(Host).filter_by(id=id).delete()
        self.session.commit()

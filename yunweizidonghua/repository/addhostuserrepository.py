#/usr/bin/env python
#-*- coding:utf-8 -*-

from DB.models import *
from Irepository.Irepository import IHost_user_message
import Model.Hosts.Hosts

class Addhostuserrepository(IHost_user_message):
    def __init__(self):
        self.db_coon = DBconon()
        self.Session = sessionmaker(bind=DBconon().engine())
        self.session = self.Session()
        self.fetch_all_by_hostmessage = []

    def fetch_all_by_username(self):
        result = self.session.query(Host_user_password).all()

        if not result:
            result = []
        return result

    def fetch_one_by_id(self,id):
        result = self.session.query(Host_user_password).filter_by(id=id).first()
        if not result:
            result = None
        return result

    def fetch_one_by_username(self,username):
        result = self.session.query(Host_user_password).filter_by(username=username).first()
        if not result:
            result = None
        return result

    def add_username(self,username,password):
        self.session.add(Host_user_password(username=username,password=password))
        self.session.commit()

    def update_username_password(self,id,username,password):
        self.session.query(Host_user_password).filter_by(id=id).update({'username':username,'password':password})
        self.session.commit()

    def del_username(self,id):
        self.session.query(Host_user_password).filter_by(id=id).delete()
        self.session.commit()

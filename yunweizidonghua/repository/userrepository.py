#/usr/bin/env python
#-*- coding:utf-8 -*-

from DB.models import *
import Model.User.User
from Irepository.Irepository import IUserrepository



class Userrepository(IUserrepository):
    def __init__(self):
        self.db_coon = DBconon()
        self.Session = sessionmaker(bind=DBconon().engine())
        self.session = self.Session()
        self.fetch_all_by_usermessage = []

    def check_user_password(self,user,password):
        result = None
        if user:
            result = self.session.query(User).filter_by(user=user,password=password).first()

        if result:
            result = Model.User.User.MUser(id=result.id,
                                           user=result.user,
                                           password=result.password,
                                           email = result.email,
                                           tel = result.tel,
                                           user_type = result.user_type)
        else:
            result = None

        return result

    def check_email_password(self,email,password):
        result = None
        if email:
            result = self.session.query(User).filter_by(email=email,password=password).first()

        if result:
            result = Model.User.User.MUser(id=result.id,
                                           user=result.user,
                                           password=result.password,
                                           email = result.email,
                                           tel = result.tel,
                                           user_type = result.user_type)
        else:
            result = None

        return result

    def fetch_all_by_user(self,*args,**kwargs):
        result = self.session.query(User).all()
        if result:
            for line in result:
                line = Model.User.User.MUser(id=line.id,user=line.user,password=line.password,
                                             email=line.email,tel=line.tel,user_type=line.user_type)
                self.fetch_all_by_usermessage.append(line)
            result = self.fetch_all_by_usermessage
        else:
            result = None

        return result

    def check_email_tel(self,email,tel):
        result = self.session.query(User).filter(or_(User.email==email,User.tel==tel)).first()
        return result

    def add_user(self,username,password,email,tel,user_type):
        print(username,password,email,tel,user_type)
        self.session.add(User(user=username,password=password,email=email,tel=tel,user_type=user_type))
        self.session.commit()

    def update_login_time(self,user_email,login_time):
        if '@' in user_email:
            email = user_email
            self.session.query(User).filter_by(email=email).update({'last_login':login_time})
        else:
            user = user_email
            self.session.query(User).filter_by(user=user).update({'last_login': login_time})
        self.session.commit()

    def fetch_one_by_id(self,id):
        result = self.session.query(User).filter_by(id=id).first()
        if result:
            result = Model.User.User.MUser(id=result.id,
                                           user=result.user,
                                           password=result.password,
                                           email=result.email,
                                           tel=result.tel,
                                           user_type=result.user_type)
        else:
            result = None
        return result

    def update_user_message(self,id,username,password,email,tel,user_type):
        self.session.query(User).filter_by(id=id).update({
            'user':username,'password':password,'email':email,'tel':tel,'user_type':user_type
        })
        self.session.commit()

    def del_user_id(self,id):
        self.session.query(User).filter_by(id=id).delete()
        self.session.commit()

    def check_usermessage(self,username,email,tel):
        result = self.session.query(User).filter(or_(User.user==username,User.email==email,
                                                     User.tel==tel)).first()
        if not result:
            result = None
        return result
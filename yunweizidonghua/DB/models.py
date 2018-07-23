#/usr/bin/env python
#-*- coding:utf-8 -*-


from sqlalchemy import Column
from sqlalchemy import Integer, VARCHAR, ForeignKey
from sqlalchemy import or_,and_

from DB.settings import *

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer,index=True,primary_key=True)
    user = Column(VARCHAR(20))
    password = Column(VARCHAR(12))
    email = Column(VARCHAR(20),unique=True)
    tel = Column(VARCHAR(11),unique=True)
    last_login = Column(VARCHAR(30))
    USER_TYPE =(
        {'nid':1,'caption':'超级管理员'},
        {'nid':2,'caption':'普通用户'}
    )
    user_type = Column(Integer)


class Group(Base):
    __tablename__ = 'group'
    id = Column(Integer,index=True,primary_key=True)
    group = Column(VARCHAR(20))


class Host(Base):
    __tablename__='hostmessage'
    id = Column(Integer,index=True,primary_key=True)
    hostname = Column(VARCHAR(20))
    ip = Column(VARCHAR(15))
    memory = Column(VARCHAR(5))
    disk = Column(VARCHAR(5))
    STATUS_TYPE = (
        {'nid':1,'caption':'在线'},
        {'nid':2,'caption':'下线'},
        {'nid':3,'caption':'维护'},
        {'nid':4,'caption':'报修'}
    )
    status = Column(Integer)



class Host_user_password(Base):
    __tablename__ = 'host_user_password'
    id = Column(Integer,index=True,primary_key=True)
    username = Column(VARCHAR(10))
    password = Column(VARCHAR(20))


class Shell_command(Base):
    __tablename__='not_execute_command'
    id = Column(Integer,primary_key=True)
    command=Column(VARCHAR(10))
    user_type = Column(Integer,ForeignKey('users.user_type'))


class Files_upload(Base):
    __tablename__='file_upload'
    id = Column(Integer,primary_key=True)
    file_save_path = Column(VARCHAR(50))
    SAVE_TIME = (
        {'nid':1,'caption':'1hour'},
        {'nid':2,'caption':'1day'},
        {'nid':3,'caption':'7day'}
    )
    save_time = Column(Integer)
def init_db():

    Base.metadata.create_all(DBconon().engine())

def drop_db():
    Base.metadata.drop_all(DBconon().engine())

init_db()
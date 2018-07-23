#/usr/bin/env python
#-*- coding:utf-8 -*-
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,relationship
from sqlalchemy import create_engine

db={
    "type":'mysql+pymysql',
    "user":'root',
    "password":'123456',
    "host":'192.168.1.25',
    "port":'3306',
    'DB':'yunweizidonghua',
    'charset':'utf8'
    }

class DBconon():
    def __init__(self):
        self.type = 'mysql+pymysql'
        self.user = 'root'
        self.password = 'root'
        self.host = '127.0.0.1'
        self.port = '3306'
        self.DB = 'yunweizidonghua'


    def engine(self):
        engine = create_engine("{type}://{user}:{password}@{host}:{port}/{DB}?charset=utf8".format(type=self.type,user=self.user,                                                                                password=self.password,host=self.host,
                                                                                           port=self.port,DB=self.DB), max_overflow=5)
        return engine

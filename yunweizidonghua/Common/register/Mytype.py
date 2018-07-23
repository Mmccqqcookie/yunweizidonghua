#/usr/bin/env python
#-*- coding:utf-8 -*-

class Mapper:
    __mapper_relation = {}

    @staticmethod
    def register(cls,value):
        Mapper.__mapper_relation[cls] = value

    @staticmethod
    def exits(cls):
        if cls in Mapper.__mapper_relation:
            return True
        return False

    @staticmethod
    def value(cls):
        return Mapper.__mapper_relation[cls]


class Mytype(type):
    def __call__(cls, *args, **kwargs):
        obj = cls.__new__(cls,*args,**kwargs)
        args_list = list(args)
        if Mapper.exits(cls):
            value = Mapper.value(cls)
            args_list.append(value)
        obj.__init__(*args_list,**kwargs)
        return obj
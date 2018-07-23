#/usr/bin/env python
#-*- coding:utf-8 -*-
import re


class BaseFrom():
    def validata(self,handle):
        flag = True
        error_dict_message = {}
        for key,val in self.__dict__.items():
            input_val = handle.get_argument(key)
            print(input_val)
            val.valid(key,input_val)
            if val.is_valid:
                pass
            else:
                flag = False
                error_dict_message[key] = val.error
        return error_dict_message


class EmailFiled():
    REGULAR = '\d+\@.*\.com'
    def __init__(self,error_dict=None,require=True):
        self.error_dict = {}
        if error_dict :
            self.error_dict.update(error_dict)
        self.require = require
        self.error = None
        self.value = None
        self.is_valid = False

    def check_valid(self,name,input_val):
        if not self.require:
            self.is_valid = True
            self.value = input_val
        else:
            if not input_val.strip():
                if self.error_dict.get('require',None):
                    self.error = self.error_dict['require']
                else:
                    self.error = '%s 不能为空' %name
            else:
                result = re.match(EmailFiled.REGULAR,input_val)
                if result:
                    self.is_valid = True
                    self.value = input_val
                else:
                    if self.error_dict.get('valid'):
                        self.error = self.error_dict['valid']
                    else:
                        self.error = '%s 是不合法的！！！' %name


class StringFiled():
    REGULAR = '\w+.*'
    def __init__(self,error_dict=None,require=True):
        self.error_dict = {}
        if error_dict :
            self.error_dict.update(error_dict)
        self.require = require
        self.error = None
        self.value = None
        self.is_valid = False

    def check_valid(self,name,input_val):
        if not self.require:
            self.is_valid = True
            self.value = input_val
        else:
            if not input_val.strip():
                if self.error_dict.get('require',None):
                    self.error = self.error_dict['require']
                else:
                    self.error = '%s 不能为空' %name
            else:
                result = re.match(EmailFiled.REGULAR,input_val)
                if result:
                    self.is_valid = True
                    self.value = input_val
                else:
                    if self.error_dict.get('valid'):
                        self.error = self.error_dict['valid']
                    else:
                        self.error = '%s 是不合法的！！！' %name

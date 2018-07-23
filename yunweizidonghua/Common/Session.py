#/usr/bin/env python
#-*- coding:utf-8 -*-
import hashlib
import time

coniter = {}
# import sys,os
# sys.path.append(os.path.dirname(__file__))
# print(sys.path)

class seesion:
    def __init__(self,handelr):
        self.handelr = handelr
        self.random_str = None


    def __gerater_random_str(self):
        obj = hashlib.md5()
        obj.update(bytes(str(time.time()), encoding='utf-8'))
        random_str = obj.hexdigest()
        return random_str

    def __setitem__(self, key, value):
        if not self.random_str:
            random_str = self.handelr.get_cookie('__ranstr__')
            if not random_str:
                random_str = self.__gerater_random_str()
                coniter[random_str] = {}
            else:
                if random_str in coniter.keys():
                    pass
                else:
                    random_str = self.__gerater_random_str()
                    coniter[random_str] = {}
            self.random_str = random_str
        coniter[self.random_str][key] = value
        self.handelr.set_cookie('__ranstr__',self.random_str)

    def __getitem__(self,key):
        random_str = self.handelr.get_cookie('__ranstr__')
        if not random_str:
            return None
        user_info_dict = coniter.get(random_str)
        if not user_info_dict:
            return None
        value = user_info_dict.get(key)
        return value

    def __delitem__(self, key):
        random_str = self.handelr.get_cookie('__ranstr__')
        coniter.pop(random_str)
        if not coniter.get(random_str,None):
            self.handelr.set_cookie('__ranstr__','')
#/usr/bin/env python
#-*- coding:utf-8 -*-
import random
import time

class Random_str():
    def __init__(self):
        self.old_str = ''
        self.new_str = ''
        self.suzi_list = []
        self.suzizuhe = random.randint(0,5)
    def random_str(self):
        for i in range(self.suzizuhe):
            suzisuiji = random.randint(0,5)
            if suzisuiji not in self.suzi_list:
                self.suzi_list.append(suzisuiji)
        for i in range(6):

            if i in self.suzi_list:
                a = random.randint(0,9)
                self.new_str = self.old_str + str(a)
            else:
                a = random.randint(65,122)
                if a in range(91,97):
                    a = random.randint(65,122)
                self.new_str = self.old_str + chr(a)
            self.old_str = self.new_str
        return self.new_str

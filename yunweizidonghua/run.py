#/usr/bin/env python
#-*- coding:utf-8 -*-
import os
import sys
sys.path.append('/var/www')
from Conf.application import *

if __name__ == '__main__':
    appliction.listen(8888)
    loop.start()

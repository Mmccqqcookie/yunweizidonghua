# /usr/bin/env python
# -*- coding:utf-8 -*-
import tornado.web
import tornado.ioloop
import tornado.httpserver
from Conf.urls import url
from webssh.handler import WebsshHandler,WsockHandler
from tornado.options import define

settings = {
    'template_path': 'view',
    'static_path': 'statics',
    'static_url_prefix': '/statics/',
    'debug':True,
    'login_url':'/',
    'autoreload':True
}
define('policy', default='warning',help='missing host key policy, reject|autoadd|warning')
define('hostFile', default='', help='User defined host keys file')
define('sysHostFile', default='', help='System wide host keys file')
loop = tornado.ioloop.IOLoop.current()
url.append(('/webssh$',WebsshHandler,dict(loop=loop,policy=None,host_keys_settings=None)))
url.append(('/webssh/ws',WsockHandler,dict(loop=loop)))
appliction = tornado.web.Application(url,**settings)
# httpserver = tornado.httpserver.HTTPServer(appliction)
# httpserver.bind(8888)
# httpserver.start(10)

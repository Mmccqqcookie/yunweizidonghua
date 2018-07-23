#/usr/bin/env python
#-*- coding:utf-8 -*-
from views import *
from webssh.views2 import *

url = [
    ( '/',LoginHandler),
    ('/logout',LogoutHandler),
    ('/index',IndexHandler),
    ('/users',UsersHandler),
    ('/add_users',AddUserHandler),
    ('/hosts',HostHandler),
    ('/add_host',AddHostHandler),
    ('/add_host_username',AddHostUsernameHandler),
    ('/host_user',HostUsernameHandler),
    ('/download_model/(?P<download_file>\w+)',DownloadHandler),
    ('/import/(?P<import_model>\w+)',ImportHandler),
    ('/update_edit/(?P<update_type>\w+)/(?P<update_type_id>\d+)',UpdateEditHandler),
    ('/del/(?P<del_type>\w+)/(?P<del_type_id>\d+)',DelHandler),
    # ('/webssh', WebsshHandler),
    ('/ssh_command',SshCommandHandler),
    ('/upload_file/(?P<upload_type>\w+)',UploadFileHandler),
    ('/import_project',ImportbashProjectHandler),
    ('/crontab',CrontabHandler),
]


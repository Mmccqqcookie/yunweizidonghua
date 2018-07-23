#/usr/bin/env python
#-*- coding:utf-8 -*-
import tornado.web
from views import BaseHandler
from webssh.ssh_connect import Webssh_exe_command
import json,time


class SshCommandHandler(BaseHandler):
    __ssh = None
    __current_time_ssh = None
    __curent_time_ssh_last = None
    @tornado.web.authenticated
    def get(self):
        SshCommandHandler.__current_time_ssh = time.time()
        if SshCommandHandler.__ssh:
            SshCommandHandler.__ssh.exit_term()
            SshCommandHandler.__ssh = None
        host = self.hostservice.fetch_all_by_host()
        host_user = self.addhostuserservice.fetch_all_by_user()
        self.render('CommandUpload/exe_command.html', login_user=self.current_user,
                    current_ssh_time=SshCommandHandler.__current_time_ssh,host=host.model_view,
                    host_user=host_user.model_view)

    def post(self, *args, **kwargs):
        command = self.get_argument('command')
        current_ssh_time = self.get_argument('current_ssh_time')
        command_data = None
        try:
            if float(current_ssh_time) == SshCommandHandler.__current_time_ssh:
                if not SshCommandHandler.__ssh:
                    host = self.get_argument('host')
                    host_user = self.get_argument('host_user').split('-')[0]
                    host_password = self.get_argument('host_password')
                    websssh = Webssh_exe_command(host,host_user,host_password)
                    websssh.ssh_connect_host()
                    SshCommandHandler.__ssh = websssh

                if command == 'q':
                    SshCommandHandler.__ssh.exit_term()
                    SshCommandHandler.__ssh = None
                    command_data = '正在退出shell'
                else:
                    command_data = SshCommandHandler.__ssh.exec_shell(command)
        except Exception as e:
            command_data = str(e)
        self.write(command_data)



class CrontabHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        host = self.hostservice.fetch_all_by_host()
        host_user = self.addhostuserservice.fetch_all_by_user()
        self.render('crontab/crontab.html',login_user=self.current_user,
                    host=host.model_view,host_user=host_user.model_view)
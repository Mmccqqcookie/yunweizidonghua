#/usr/bin/env python
#-*- coding:utf-8 -*-
import select
import sys
import time,paramiko,re

class Webssh_exe_command:
    def __init__(self,host,user,password):
        self.host = host
        self.port = 22
        self.username = user
        self.password = password
        self.s = paramiko.SSHClient()
        self.ssh = None

    def exec_shell(self,command=None):
        '''
            command：传入的要执行的shell命令
        '''
        self.ssh.send(command +'\n')
        time.sleep(0.3)
        result = self.ssh.recv(9999999)
        header_match = '(\[.+?@.+?\s.+?\]\#)'
        header_list = re.findall(header_match, str(result, encoding='utf-8'))
        if '[m' in header_list[-1]:
            header_list[-1] = header_list[-1].replace('[m','')
        result = (str(result,encoding='utf-8').replace(header_list[-1],'').replace(command,'').strip())
        command_data =  result
        command_data = command_data.replace('\033[01;32m','').replace('\033[0m','').replace('\033[01;34m','').replace('\033[01;31m','').replace('\033[m','')
        return command_data

    def ssh_connect_host(self):
        '''
            host：对应要连接的服务器ip
            port：对应连接服务器的端口
            username：对应访问服务器的用户名
        '''
        self.s.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.s.connect(hostname=self.host,port=self.port,username=self.username, password=self.password)
        self.ssh = self.s.invoke_shell()
        '''
            下面对应在secureCRT上执行命令的过程
        '''

    def exit_term(self):

        self.ssh.close()
        self.s.close()

    def Upload_file(self,localpath,remotepath):
        trans = paramiko.Transport((self.host, self.port))
        trans.connect(username=self.username, password=self.password)
        sftp = paramiko.SFTPClient.from_transport(trans)
        sftp.put(localpath=localpath, remotepath=remotepath)
        trans.close()
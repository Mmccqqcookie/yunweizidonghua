#/usr/bin/env python
#-*- coding:utf-8 -*-


class IUserrepository():
    def check_user_password(self,*args,**kwargs):
        '''
        单个数据接口
        :param user: 
        :param pwd: 
        :return: 
        '''

    def check_email_password(self,*args,**kwargs):
        '''
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def check_email_tel(self,*args,**kwargs):
        '''
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def check_usermessage(self,*args,**kwargs):
        '''
        
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def fetch_all_by_user(self,*args,**kwargs):
        '''
        所有的用户数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def check_user_email_tel(self,*args,**kwargs):
        '''
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def update_login_time(self,*args,**kwargs):
        '''
        修改Users表的数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def add_user(self,*args,**kwargs):
        '''
        增加新用户
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def fetch_one_by_id(self,*args,**kwargs):
        '''
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def update_user_message(self,*args,**kwargs):
        '''
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def del_user_id(self,*args,**kwargs):
        '''
        删除用户
        :param args: 
        :param kwargs: 
        :return: 
        '''


class IGrouprepository():
    def fetch_one_by_group(self, *args, **kwargs):
        '''
        单个数据接口
        :param user: 
        :param pwd: 
        :return: 
        '''

    def fetch_all_by_group(self, *args, **kwargs):
        '''
        所有的用户数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def update_group(self, *args, **kwargs):
        '''
        修改Users表的数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def add_group(self, *args, **kwargs):
        '''
        增加新用户
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def del_group(self, *args, **kwargs):
        '''
        删除用户
        :param args: 
        :param kwargs: 
        :return: 
        '''


class IHostrepository():
    def fetch_host_Ip(self, *args, **kwargs):
        '''
        单个数据接口
        :param user: 
        :param pwd: 
        :return: 
        '''

    def fetch_one_by_id(self,*args,**kwargs):
        '''
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def fetch_all_by_host(self, *args, **kwargs):
        '''
        所有的用户数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def check_hostmessage_and_add(self,*args,**kwargs):
        '''
        
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def update_host(self, *args, **kwargs):
        '''
        修改Users表的数据
        :param user: 
        :param pwd: 
        :return: 
        '''
    def update_host_message(self,*args,**kwargs):
        '''
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def add_host(self, *args, **kwargs):
        '''
        增加新用户
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def del_host_id(self, *args, **kwargs):
        '''
        删除用户
        :param args: 
        :param kwargs: 
        :return: 
        '''

class IHost_user_message():
    def fetch_all_by_username(self,*ars,**kwargs):
        '''
        
        :param ars: 
        :param kwargs: 
        :return: 
        '''

    def fetch_one_by_username(self,*args,**kwargs):
        '''
        
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def fetch_one_by_id(self,*args,**kwargs):
        '''
        
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def update_username_password(self,*args,**kwargs):
        '''
        
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def del_username(self,*args,**kwargs):
        '''
        
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def add_username(self,*args,**kwargs):
        '''
        
        :param args: 
        :param kwargs: 
        :return: 
        '''

class IShell_commandrepository():
    def fetch_one_by_shell_command(self, *args, **kwargs):
        '''
        单个数据接口
        :param user: 
        :param pwd: 
        :return: 
        '''

    def fetch_all_by_shell_command(self, *args, **kwargs):
        '''
        所有的用户数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def update_shell_command(self, *args, **kwargs):
        '''
        修改Users表的数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def add_shell_command(self, *args, **kwargs):
        '''
        增加新用户
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def del_shell_command(self, *args, **kwargs):
        '''
        删除用户
        :param args: 
        :param kwargs: 
        :return: 
        '''

class IFile_uploadrepository():
    def fetch_one_by_file_upload(self, *args, **kwargs):
        '''
        单个数据接口
        :param user: 
        :param pwd: 
        :return: 
        '''

    def fetch_all_by_file_upload(self, *args, **kwargs):
        '''
        所有的用户数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def update_file_upload(self, *args, **kwargs):
        '''
        修改Users表的数据
        :param user: 
        :param pwd: 
        :return: 
        '''

    def add_file_upload(self, *args, **kwargs):
        '''
        增加新用户
        :param args: 
        :param kwargs: 
        :return: 
        '''

    def del_file_upload(self, *args, **kwargs):
        '''
        删除用户
        :param args: 
        :param kwargs: 
        :return: 
        '''
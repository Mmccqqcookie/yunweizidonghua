#/usr/bin/env python
#-*- coding:utf-8 -*-
import tornado.web
from Service.User.Service import UserService
import Common.Session as CSession
from Service.Host.Service import HostsService
from Service.Host.Service import AddhostuserService
from webssh.ssh_connect import Webssh_exe_command
import os,sys
import json


class BaseHandler(tornado.web.RequestHandler):
    def prepare(self):
        pass

    def write_error(self, status_code, **kwargs):
        pass

    def set_default_headers(self):
        pass

    def initialize(self):
        self.userservice = UserService()
        self.hostservice = HostsService()
        self.addhostuserservice = AddhostuserService()

    def get_current_user(self):
        csession = CSession.seesion(self)
        if self.get_cookie('__ranstr__'):
            if csession['__login']:
                login = csession['__login']
                return login
            else:
                return False
        else:
            return False

class LoginHandler(BaseHandler):
    __message = ''

    def get(self, *args, **kwargs):
        if self.current_user:
            self.redirect('/index')
        else:
            self.render('login_logout/login.html',message=LoginHandler.__message)

    def post(self, *args, **kwargs):
        response = self.userservice.check_login(self)
        if response.status == False:
            LoginHandler.__message = response.message
            self.redirect('/')
        elif response.status == True:
            csession = CSession.seesion(self)
            csession['__login'] = self.get_argument('email')
            self.redirect('/index')


class LogoutHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        cession = CSession.seesion(self)
        del cession['del']
        if not cession['__login']:
            self.redirect('/')



class IndexHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self,*args,**kwargs):
        self.render('index/index.html',login_user=self.current_user)

    def post(self, *args, **kwargs):
        pass


class UsersHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self,*args,**kwargs):
        response = self.userservice.fetch_all_by_user()
        self.render('users/users.html',user_list=response.model_view, login_user=self.current_user)


class AddUserHandler(BaseHandler):
    __message = ''
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        self.render('users/add_users.html', login_user=self.current_user,message=AddUserHandler.__message)

    def post(self, *args, **kwargs):
        response = self.userservice.check_base_usermessage(self)
        if response.status == False:
            AddUserHandler.__message = response.message
            self.redirect('/add_users')

        else:
            self.userservice.Create_User(self)
            self.redirect('/users')


class HostHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        response = self.hostservice.fetch_all_by_host()
        self.render('hosts/hosts.html',host_list = response.model_view, login_user=self.current_user)


class AddHostHandler(BaseHandler):
    __message = ''
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        self.render('hosts/add_hosts.html', login_user=self.current_user,message=AddHostHandler.__message)

    def post(self, *args, **kwargs):
        response = self.hostservice.check_host_exist(self)
        if response.status == False:
            AddHostHandler.__message = response.message
            self.redirect('/add_host')
        else:
            self.hostservice.Create_host(self)
            self.redirect('/hosts')


class HostUsernameHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        reponse = self.addhostuserservice.fetch_all_by_user()
        print(reponse.model_view)
        self.render('hosts/host_user.html',login_user=self.current_user,host_username_list=reponse.model_view)


class AddHostUsernameHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        self.render('hosts/add_host_username.html',login_user=self.current_user,message='')

    def post(self, *args, **kwargs):
        reponse = self.addhostuserservice.add_user(self)
        if reponse.status:
            self.redirect('/host_user')
        else:
            self.render('hosts/add_host_username.html',login_user=self.current_user,message = reponse.message)

class DownloadHandler(BaseHandler):
    __upload_file_path = {'user_model':'UploadFiles/Download/user_model.xlsx',
                          'host_model':'UploadFiles/Download/host_model.xlsx'}

    @tornado.web.authenticated
    def get(self, download_file):
        if download_file in DownloadHandler.__upload_file_path.keys():
            filename_path = DownloadHandler.__upload_file_path[download_file]
            filename = os.path.basename(filename_path)
            # http头 浏览器自动识别为文件下载
            self.set_header('Content-Type', 'application/octet-stream')
            self.set_header('Content-Disposition', 'attachment; filename=%s' % filename)
            with open(filename_path, 'rb') as f:
                while True:
                    data = f.read(1024)
                    if not data:
                        break
                    self.write(data)
            # # 记得有finish哦
            self.finish()

class ImportHandler(BaseHandler):
    __import_model = {'users':'用户模板导入',
                      'hosts':'主机模板导入'}

    @tornado.web.authenticated
    def get(self,import_model):
        self.render('base/import.html',login_user=self.current_user,title=ImportHandler.__import_model[import_model],import_model_type=import_model)

class UpdateEditHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self,update_type,update_type_id):
        if update_type == 'user':
            reponse = self.userservice.fetch_one_by_id(update_type_id)
            if reponse.status:
                self.render('users/update_users.html',login_user=self.current_user,user=reponse.model_view)
        elif update_type == 'host':
            reponse = self.hostservice.fetch_one_by_id(update_type_id)
            if reponse.status:
                self.render('hosts/update_hosts.html',login_user=self.current_user,host=reponse.model_view)
        elif update_type == 'add_host_user':
            reponse = self.addhostuserservice.fetch_one_by_id(update_type_id)
            if reponse.status:
                self.render('hosts/update_host_user.html',login_user=self.current_user,host_user=reponse.model_view)

    def post(self,update_type,update_type_id):
        if update_type == 'user':
            reponse = self.userservice.update_user_message(self)
            if reponse.status:
                self.redirect('/users')
            else:
                self.redirect('/update_edit/{0}/{1}'.format(update_type,update_type_id))
        elif update_type == 'host':
            reponse = self.hostservice.update_host_message(self)
            if reponse.status:
                self.redirect('/hosts')
            else:
                self.redirect('/update_edit/{0}/{1}'.format(update_type, update_type_id))

        elif update_type == 'add_host_user':
            reponse = self.addhostuserservice.update_host_user(self)
            if reponse.status:
                self.redirect('/host_user')
            else:
                self.redirect('/update_edit/{0}/{1}'.format(update_type,update_type_id))

class DelHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self,del_type,del_type_id):
        if del_type == 'user':
            reponse = self.userservice.del_user_id(del_type_id)
            if reponse.status:
                self.redirect('/users')
        elif del_type == 'host':
            reponse = self.hostservice.del_host_id(del_type_id)
            if reponse.status:
                self.redirect('/hosts')
        elif del_type == 'add_host_user':
            reponse = self.addhostuserservice.del_user(del_type_id)
            if reponse.status:
                self.redirect('/host_user')


class UploadFileHandler(BaseHandler):
    def post(self,upload_type):
        file_metas = self.request.files[upload_type]
        for meta in file_metas:
            filename = meta['filename']
            Base_dir = os.path.dirname(__file__)
            if upload_type in ['users','hosts']:
                upload_file = os.path.join(os.path.join(os.path.join(os.path.join(Base_dir,'UploadFiles'),'Upload'),'model'),filename)
            elif upload_type == 'import_project':
                upload_file = os.path.join(
                    os.path.join(os.path.join(os.path.join(Base_dir, 'UploadFiles'), 'Upload'), 'project_distribution'), filename)
            with open(upload_file,'wb') as bak:
                bak.write(meta['body'])
        from Common.import_execl import open_read_xls
        if upload_type == 'users':
            users = open_read_xls(upload_file,upload_type)
            users_add_message = []
            for user in users:
                reponse = self.userservice.check_usermessage_and_add(user['username'],user['password'],user['email'],
                                                           user['tel'],user['user_type'])
                data = {'status':reponse.status,'message': reponse.message}
                users_add_message.append(data)
            datalist = {'reponse_list':users_add_message}
            self.write(datalist)

        elif upload_type == 'hosts':
            hosts = open_read_xls(upload_file,upload_type)
            hosts_add_message = []
            for host in hosts:
                reponse = self.hostservice.check_hostmessage_and_add(host['hostname'],host['ip'],host['memory'],
                                                                     host['disk'],host['status'])
                data = {'status': reponse.status, 'message': reponse.message}
                hosts_add_message.append(data)
            datalist = {'reponse_list': hosts_add_message}
            self.write(datalist)
        elif upload_type == 'import_project':
            exe_host = self.get_argument('exe_host')
            print(exe_host,type(exe_host))
            if exe_host:
                if int(exe_host) == 1:
                    host = self.get_argument('host')
                    host_user = self.get_argument('host_user').split('-')[0]
                    host_password = self.get_argument('host_password')
                    remotepath = self.get_argument('remotepath')
                    if not remotepath.endswith('/'):
                        remotepath = remotepath + '/' + filename
                    else:
                        remotepath = remotepath + filename
                    print(host_password,host_user)
                    webssh = Webssh_exe_command(host, host_user, host_password)
                    webssh.Upload_file(upload_file,remotepath)
                    data = {'status': True, 'message': '已上传到{0}-{1}'.format(host,remotepath)}
                    self.write(data)
                else:
                    data = {'status':True,'message':'已上传到服务器后台'}
                    self.write(data)
        else:
            datalist = {'reponse_list':[{'status':'false','message':'已经上传成功'}]}
            self.write(datalist)


class ImportbashProjectHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        host = self.hostservice.fetch_all_by_host()
        host_user = self.addhostuserservice.fetch_all_by_user()
        self.render('CommandUpload/import_project.html',login_user=self.current_user,host=host.model_view,host_user=host_user.model_view)

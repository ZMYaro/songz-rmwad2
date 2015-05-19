#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class MainPage(webapp.RequestHandler):
	def get(self, page):
	
		user = users.get_current_user()
		
		if user:
			signOutURL = users.create_logout_url(self.request.uri)
			
			path = os.path.join(os.path.dirname(__file__), 'templates/head.html')
			self.response.out.write(template.render(path, {'signOutURL': signOutURL}))
			path = os.path.join(os.path.dirname(__file__), 'templates/main.html')
			self.response.out.write(template.render(path, {}))
			path = os.path.join(os.path.dirname(__file__), 'templates/foot.html')
			self.response.out.write(template.render(path, {}))
		else:
			self.redirect(users.create_login_url(self.request.uri))

class RobotsTxt(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/plain'
		self.response.out.write('User-agent: *\nDisallow: /')

#class FaviconHandler(webapp.RequestHandler):
#	def get(self):
#		self.response.set_status(301)
#		self.redirect('/static/images/favicon.ico')

class OtherPage(webapp.RequestHandler):
	def get(self, page):
		path = os.path.join(os.path.dirname(__file__), 'templates/head.html')
		self.response.out.write(template.render(path, {'title':'Error'}))
		path = os.path.join(os.path.dirname(__file__), 'templates/404.html')
		self.response.out.write(template.render(path, {}))
		path = os.path.join(os.path.dirname(__file__), 'templates/foot.html')
		self.response.out.write(template.render(path, {}))
		self.response.set_status(404);

site = webapp.WSGIApplication([('/(index\.html)?', MainPage),
                               ('/robots.txt', RobotsTxt),
                               #('/favicon.ico', FaviconHandler),
                               ('/(.*)', OtherPage)],
                              debug=True)

def main():
	run_wsgi_app(site)

if __name__ == '__main__':
	main()

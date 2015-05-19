#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import json
import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

from models import Playlist, PlaylistUser, PlaylistItem

def error404(response):
	response.headers['Content-Type'] = 'text/plain'
	response.out.write('Error 404')
	response.set_status(404)

class PlaylistsHandler(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'application/json'
		
		user = users.get_current_user()
		
		playlistData = []
		
		if user:
			playlistUserMaps = PlaylistUser.gql('WHERE user = :1', user).fetch(limit=None)
			for playlistUserMap in playlistUserMaps:
				playlist = Playlist.gql('WHERE playlistId = :1', playlistUserMap.playlistId).get()
				playlistData.append({
					'playlistId': playlist.playlistId,
					'name': playlist.name
				})
			
			# Convert the dictionaries to JSON and print.
			self.response.out.write(json.dumps(playlistData))
		else:
			error404(self.response)

class OtherPage(webapp.RequestHandler):
	def get(self):
		error404(self.response)

site = webapp.WSGIApplication([('/api/playlists', PlaylistsHandler),
                               ('/.*', OtherPage)],
                              debug=True)

def main():
	run_wsgi_app(site)

if __name__ == '__main__':
	main()

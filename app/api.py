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

def errorOut(response, code):
	response.headers['Content-Type'] = 'application/json'
	response.out.write('[]')
	response.set_status(code)

class PlaylistsHandler(webapp.RequestHandler):
	def get(self):
		
		user = users.get_current_user()
		
		if not user:
			errorOut(self.response, 403)
			return
		
		playlistData = []
		playlistUserMaps = PlaylistUser.gql('WHERE user = :1', user).fetch(limit=None)
		for playlistUserMap in playlistUserMaps:
			playlist = Playlist.gql('WHERE playlistId = :1', playlistUserMap.playlistId).get()
			playlistData.append({
				'playlistId': playlist.playlistId,
				'name': playlist.name
			})
		
		# Convert the dictionaries to JSON and output it.
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps(playlistData))

class PlaylistHandler(webapp.RequestHandler):
	def get(self, listId):
		self.response.headers['Content-Type'] = 'application/json'
		
		if not listId:
			errorOut(self.response, 404)
			return
		
		user = users.get_current_user()
		
		if not user:
			errorOut(self.response, 403)
			return
		
		playlist = Playlist.gql('WHERE playlistId = :1', listId).get()
		
		if not playlist:
			errorOut(self.response, 404)
			return
		
		playlistUserMap = PlaylistUser.gql('WHERE user = :1 AND playlistId = :2', user, listId).get()
		
		if not playlistUserMap:
			errorOut(self.response, 403)
			return
		
		songData = []
		listSongs = PlaylistItem.gql('WHERE playlistId = :1', listId).order('timeAdded').fetch(limit=None)
		for song in listSongs:
			songData.append({
				'title': song.title,
				'album': song.album,
				'artist': song.artist
			})
		
		# Convert the dictionaries to JSON and output it.
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps(playlistData))

class OtherPage(webapp.RequestHandler):
	def get(self):
		errorOut(self.response, 404)

site = webapp.WSGIApplication([('/api/playlists', PlaylistsHandler),
                               ('/api/playlist/(.*)', PlaylistHandler),
                               ('/.*', OtherPage)],
                              debug=True)

def main():
	run_wsgi_app(site)

if __name__ == '__main__':
	main()

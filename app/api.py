#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import json
import os

from uuid import uuid4

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
			errorOut(self.response, 401)
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

class SongsHandler(webapp.RequestHandler):
	def get(self):
		# Ensure a list was requested.
		listId = self.request.get('list')
		if not listId:
			errorOut(self.response, 404)
			return
		
		# Ensure the user is signed in.
		user = users.get_current_user()
		if not user:
			errorOut(self.response, 401)
			return
		
		# Ensure the playlist exists.
		playlist = Playlist.gql('WHERE playlistId = :1', listId).get()
		if not playlist:
			errorOut(self.response, 404)
			return
		
		# Ensure the user has permission to access the playlist.
		playlistUserMap = PlaylistUser.gql('WHERE user = :1 AND playlistId = :2', user, listId).get()
		if not playlistUserMap:
			errorOut(self.response, 403)
			return
		
		songData = []
		listSongs = PlaylistItem.gql('WHERE playlistId = :1', listId).order(PlaylistItem.timeAdded).fetch(limit=None)
		for song in listSongs:
			songData.append({
				'songId': song.songId,
				'title': song.title,
				'album': song.album,
				'artist': song.artist
			})
		
		# Convert the dictionaries to JSON and output it.
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps(songData))

class PlaylistMaker(webapp.RequestHandler):
	def post(self):
		listName = self.request.get('name')
		
		if not listName:
			errorOut(self.response, 400)
			return
		
		user = users.get_current_user()
		
		if not user:
			errorOut(self.response, 401)
			return
		
		# Generate a unique ID for the new list.
		listId = ''
		while True:
			listId = uuid4().hex
			if not Playlist.gql('WHERE playlistId = :1', listId).get():
				break
		
		# Create and store a the playlist.
		newList = Playlist()
		newList.playlistId = listId
		newList.name = listName
		newList.put()
		
		# Identify the user as the owner of that playlist.
		playlistUserMap = PlaylistUser()
		playlistUserMap.playlistId = listId
		playlistUserMap.user = user
		playlistUserMap.owner = True
		playlistUserMap.put()
		
		# Output the playlist's metadata as JSON.
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps({
			'playlistId': listId,
			'name': listName
		}))

class SongMaker(webapp.RequestHandler):
	def post(self):
		# TODO: Implement this.
		errorOut(self.response, 404)
		
class OtherPage(webapp.RequestHandler):
	def get(self):
		errorOut(self.response, 404)

site = webapp.WSGIApplication([('/api/playlists', PlaylistsHandler),
                               ('/api/songs', SongsHandler),
							   ('/api/add/playlist', PlaylistMaker),
							   ('/api/add/song', SongMaker),
                               ('/.*', OtherPage)],
                              debug=True)

def main():
	run_wsgi_app(site)

if __name__ == '__main__':
	main()

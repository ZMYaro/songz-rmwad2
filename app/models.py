#!/usr/bin/python
# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

class Playlist(ndb.Model):
	playlistId = ndb.StringProperty()
	name = ndb.StringProperty()

class PlaylistItem(ndb.Model):
	songId = ndb.StringProperty()
	playlistId = ndb.StringProperty()
	timeAdded = ndb.DateTimeProperty()
	title = ndb.StringProperty()
	artist = ndb.StringProperty()
	album = ndb.StringProperty()

class PlaylistUser(ndb.Model):
	playlistId = ndb.StringProperty()
	user = ndb.UserProperty()
	owner = ndb.BooleanProperty()

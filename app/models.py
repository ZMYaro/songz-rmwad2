#!/usr/bin/python
# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

class Playlist(ndb.Model):
	playlistId = ndb.StringProperty()
	name = ndb.StringProperty()

class PlaylistItem(ndb.Model):
	playlistId = ndb.StringProperty()
	timeAdded = ndb.DateTimeProperty()
	title = ndb.StringProperty()
	album = ndb.StringProperty()
	artist = ndb.StringProperty()

class PlaylistUser(ndb.Model):
	playlistId = ndb.StringProperty()
	user = ndb.UserProperty()
	owner = ndb.BooleanProperty()

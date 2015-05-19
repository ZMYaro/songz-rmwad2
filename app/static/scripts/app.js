'use strict';

function init() {
	document.getElementById('newListButton').onclick = createPlaylist;
	
	loadLists();
}

/**
 * Load the user's playlists.
 */
function loadLists() {
	request('GET', '/api/playlists', null, populateListsPane);
}

/**
 * Populate the lists pane.
 * @param {Array<Object>} listsData - The user's playlists
 */
function populateListsPane(listsData) {
	listsData.forEach(addPlaylistButton);
}

/**
 * Create a button in the list pane for a button.
 * @param {Object} listData - The playlist's metadata
 */
function addPlaylistButton(listData) {
	var listList = document.getElementById('listList'),
		listItem = document.createElement('li'),
		listButton = document.createElement('button');
	listButton.innerText = listButton.textContent = listData.name;
	listButton.id = 'playlist-button-' + listData.playlistId;
	listButton.dataset.playlistId = listData.playlistId;
	listButton.onclick = handlePlaylistButtonClick;
	listItem.appendChild(listButton);
	listList.appendChild(listItem);
}

/**
 * Handle a playlist button being pressed.
 * @param {MouseEvent} e
 */
function handlePlaylistButtonClick(e) {
	document.getElementById('listTitle').innerText =
		document.getElementById('listTitle').textContent = (this.innerText || this.textContent);
	
	document.getElementById('songList').innerHTML = '';
	
	loadSongs(this.dataset.playlistId);
}

/**
 * Load a playlist and populate the songs pane.
 * @param {String} listId - The ID of the playlist to load
 */
function loadSongs(listId) {
	request('GET', '/api/songs?list=' + listId, null, populateSongsPane, function () {
		alert('That playlist could not be loaded.  Please try again later.');
	});
}

/**
 * Add a playlist's songs to the songs pane.
 */
function populateSongsPane(songsData) {
	songsData.forEach(addSongItem);
}

function addSongItem(songData) {
	var songList = document.getElementById('songList'),
		listItem = document.createElement('li');
	listItem.innerText = listItem.textContent =
		songData.title + ' - ' + songData.artist + ' - ' + songData.album;
	listItem.id = 'song-' + songData.songId;
	listItem.dataset.songId = songData.songId;
	songList.appendChild(listItem);
}

/**
 * Create a new playlist at the user's request.
 */
function createPlaylist() {
	var listName = prompt('Please enter a name for the new playlist.');
	if (!listName) {
		return;
	}
	var postData = 'name=' + encodeURIComponent(listName);
	request('POST', '/api/add/playlist', postData, addPlaylistButton, function () {
		alert('Your new playlist could not be created.  Please try again later.');
	});
}

init();

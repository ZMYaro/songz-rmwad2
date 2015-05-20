'use strict';

function init() {
	document.getElementById('newListButton').onclick = createPlaylist;
	document.getElementById('newSongButton').onclick = addSong;
	
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
 * Create a button in the list pane for a playlist.
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
	
	document.getElementById('songsPane').style.display = 'none';
	document.getElementById('usersPane').style.display = 'none';
	document.getElementById('newSongButton').dataset.playlistId = this.dataset.playlistId;
	
	loadSongs(this.dataset.playlistId);
	loadUsers(this.dataset.playlistId);
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
 * @param {Array<Object>} songsData - The playlist's songs
 */
function populateSongsPane(songsData) {
	songsData.forEach(addSongItem);
	document.getElementById('songsPane').style.display = null;
}

/**
 * Create a list item in the songs pane for a song.
 * @param {Object} songData - The song's metadata
 */
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
 * Load a playlist's users and populate the users pane.
 * @param {String} listId - The ID of the playlist
 */
function loadUsers(listId) {
	request('GET', '/api/users?list=' + listId, null, populateUsersPane);
}

/**
 * Add a playlist's users to the users pane.
 * @param {Array<Object>} usersData - The playlist's users
 */
function populateUsersPane(usersData) {
	// TODO: Implement this.
	document.getElementById('usersPane').style.display = null;
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
	request('POST', '/api/playlists', postData, addPlaylistButton, function () {
		alert('Your new playlist could not be created.  Please try again later.');
	});
}

/**
 * Add a song to the current playlist when the button is clicked.
 */
function addSong() {
	var songTitle = prompt('Please enter the title of the song.');
	if (!songTitle) {
		return;
	}
	var songArtist = prompt('Please enter the artist of the song.');
	if (typeof songArtist !== 'string') {
		return;
	}
	var songAlbum = prompt('Please enter the album of the song.');
	if (typeof songAlbum !== 'string') {
		return;
	}
	
	var postData = 'list=' + this.dataset.playlistId +
		'&title=' + encodeURIComponent(songTitle) +
		'&artist=' + encodeURIComponent(songArtist) +
		'&album=' + encodeURIComponent(songAlbum);
	request('POST', '/api/songs', postData, addSongItem, function () {
		alert('Your song could not be added.  Please try again later.');
	});
}

init();

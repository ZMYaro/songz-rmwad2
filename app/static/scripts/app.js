'use strict';

function init() {
	document.getElementById('newListButton').onclick = createPlaylist;
	
	loadLists();
}

/**
 * Load the user's playlists.
 */
function loadLists() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/api/playlists', true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				// Parse and pass on the response data.
				populateListsPane(JSON.parse(xhr.responseText));
			}
		}
	};
	xhr.send();
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
	loadSongs(this.dataset.playlistId);
}

/**
 * Load a playlist and populate the songs pane.
 * @param {String} listId - The ID of the playlist to load
 */
function loadSongs(listId) {
	// TODO: Implement this.
	alert('This has not yet been implemented.');
}

/**
 * Create a new playlist at the user's request.
 */
function createPlaylist() {
	var listName = prompt('Please enter a name for the new playlist.');
	if (!listName) {
		return;
	}
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/api/add/playlist', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				addPlaylistButton(JSON.parse(xhr.responseText));
			} else {
				alert('Your new playlist could not be created.  Please try again later.');
			}
		}
	};
	xhr.send('name=' + encodeURIComponent(listName));
}

init();

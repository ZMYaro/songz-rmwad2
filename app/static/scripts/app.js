'use strict';

function init() {
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
	var listList = document.getElementById('listList');
	listsData.forEach(function (list) {
		var listButton = document.createElement('button');
		listButton.innerText = listButton.textContent = list.name;
		listButton.id = 'playlist-button-' + list.playlistId;
		listButton.dataset.playlistId = list.playlistId;
		listButton.onclick = handlePlaylistButtonClick;
		listList.appendChild(listButton);
	});
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

init();

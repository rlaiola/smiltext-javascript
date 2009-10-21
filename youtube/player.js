/**
 * This file is part of the smilText parser implemented in JavaScript,
 *
 * Copyright (C) 2003-2009 Stichting CWI, 
 * Science Park 123, 1098 XG Amsterdam, The Netherlands.
 *
 * smilText parser in JavaScript is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * smilText parser in JavaScript is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with smilText parser in JavaScript; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 @version 1.0
 @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
*/

var currentPosition = 0; 
var currentState = 'NONE';
var previousState = 'NONE';
var currentLoaded = 0;
var currentRemain = 0;
var currentItem = null;

var currentMute = false; 

var currentTitle = "";
var currentAuthor = "";
var currentDescription = "";
var currentURL = "";

var player = null;
var currentExpanded = false;

var placeHolder = null;


function playerReady(thePlayer) {
	player = window.document[thePlayer.id];
	addListeners();
}

function addListeners() {
	if (player) { 
		player.addModelListener("LOADED", "loadedListener");
		player.addModelListener("STATE", "stateListener");
		player.addModelListener("TIME", "positionListener");

		player.addModelListener("TIME", "updateNormalPlayerInfo");
	} else {
		setTimeout("addListeners()",100);
	}
}

function stateListener(obj) { //IDLE, BUFFERING, PLAYING, PAUSED, COMPLETED
	currentState = obj.newstate; 
	previousState = obj.oldstate; 

	updateHTML("playerstate", currentState);
}

function positionListener(obj) { 
	currentPosition = obj.position; 
	
	updateHTML("durationTimeBar", formatTime(getDuration()));
    updateHTML("timeTimeBar", formatTime(currentPosition));
    
	updateHTML("videotime", formatTime(currentPosition));
}

function loadedListener(obj) { 
	updateHTML("bytesloaded", 0);
    updateHTML("bytesremain", 0);
    
	currentLoaded = obj.loaded; 
	currentRemain = obj.total - currentLoaded;
	updateHTML("bytesloaded", currentLoaded);
    updateHTML("bytesremain", currentRemain);
    
    updateHTML("videodur", formatTime(getDuration()));
}

function deletePlayer(theWrapper, thePlaceholder, thePlayerId) { 
    swfobject.removeSWF(thePlayerId);
    var tmp=document.getElementById(theWrapper);
    if (tmp) { tmp.innerHTML = "<div id='" + thePlaceholder + "'></div>"; }
}

function createPlayer(theFile, theAutostart) {
	var flashvars = {
            file: theFile, 
            autostart: theAutostart
    }
    var params = {
            allowfullscreen:"true", 
            allowscriptaccess:"always",
            wmode:"opaque"
    }
    var attributes = {
            id:"player1",  
            name:"player1"
    }
    
    swfobject.embedSWF("player.swf", placeHolder, "100%", "100%", "9.0.115", false, flashvars, params, attributes);
    
    stDoc.play();
}

var currentFile;

function initPlayer(theFile, theAutostart) {
	currentFile = theFile;
    
	// Reset variables
    currentPosition = 0; 
	currentState = 'NONE';
	previousState = 'NONE';
	currentLoaded = 0;
	currentRemain = 0;
	currentItem = null;
	
    deletePlayer('wrapper', placeHolder, 'player');
    createPlayer(theFile, theAutostart);
    setSize('wrapper');
}

function setSize(theWrapper) { 
    var tmp = document.getElementById(theWrapper);
    if (tmp) { 
    	if (!currentExpanded) {
	        var theWidth = 456;
	        var theHeight = 285;
	        var unitStr = "px";
    	} else {
    		var theWidth = 684;
	        var theHeight = 428;
	        var unitStr = "px";
    	}
    }
    sizeWrap(theWrapper, theWidth, theHeight, unitStr);	                       
}

function sizeWrap(theWrapper, theWidth, theHeight, unitStr) { 
    var tmp = document.getElementById(theWrapper);
    if (tmp) { 
        if (! unitStr) { var unitStr = 'px'; }
        tmp.style.width = parseInt(theWidth)+unitStr; 
        tmp.style.height = parseInt(theHeight)+unitStr; 
    }
}

// Player functions

function getDuration() {
	if (player) {
	  	if (player.getPlaylist()) {
	  		var plst = player.getPlaylist();
	  		return plst[0].duration;
	  	}
	}
	return 0;
}

function getCurrentTime() {
	if (player) {
	  	if (player.getPlaylist()) {
	  		return currentPosition;
	  	}
	}
	return 0;
}

function getPlayerState() {
	switch (currentState) // which state?
	{
		case "PLAYING":
			return 1;
		case "PAUSED":
			return 2;
		case "IDLE":
		case "NONE":
		case "BUFFERING":
		case "COMPLETED":
		default:
			return 0;
	}
}

function getCurrentVideoURL() {
	if (currentItem) {
		return currentURL;
	}
	return null;
}

function mute() {
  if (player) {
    player.sendEvent('MUTE');
    currentMute = true;
  }
}

function unMute() {
  if (player) {
    player.sendEvent('MUTE');
    currentMute = false;
  }
}





/* Player functions */

/* Hold the subtitle entries */
var stDoc = null;

function embedPlayer() {

	// Specify unique player id
	placeHolder = "placeholder1";
	document.getElementById('placeholder1').id = placeHolder;
	
	stDoc = cwi.smilText.Parser.parseFile("subtitles.xml", 'sub');
	// Set youtube clock
	stDoc.setExternalClock(true);
	
	// JW Call
	initPlayer('http://osaddict.com/files/elephantsdream-480-h264-st-aac.mov', true);
}

function updateNormalPlayerInfo() {
	// update smilText timing
    stDoc.setTime(getCurrentTime() * 1000);
}





// Util

function getPercent(all, part) {
   return (all > 0) ? (100 / all) * part : 0;
}

function formatTime(time) {
	var hours = getHours(time);
	var mins = getMins(time);
   	var secs = getSecs(time);
    
    return timestamp = hours + ':' + mins + ':' + secs;
}

function getSecs(time) {
	var secs = parseInt(time%60);
	var mili = parseInt(((time%60.0) * 10.0)%10.0);
	secs = secs >= 0 ? secs : 0;
	mili = mili >= 0 ? mili : 0;
	return "" + (secs < 10 ?'0'+secs : secs) + "." + mili;
}

function getMins(time) {
	var mins = parseInt((time/60)%60);
	mins = mins >= 0 ? mins : 0;
	return "" + (mins < 10 ?'0'+ mins : mins);
}

function getHours(time) {
	var hours = parseInt(time/3600);
	hours = hours >= 0 ? hours : 0;
	return "" + (hours < 10 ? hours : hours);
}

function updateHTML(elmId, val) {
  	if (document && document.getElementById(elmId))
  		document.getElementById(elmId).innerHTML = val;
}

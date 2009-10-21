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
 @name cwi.smilText
 @namespace Hold all smilText functionalities.
 @version 1.0
 @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
*/
Namespace("cwi.smilText");





/* Solve library dependencies */
Import("cwi.adt.Hashtable");
Import("cwi.adt.PriorityQueue");
Import("cwi.adt.DoubleLinkedList");
Import("cwi.util");
Import("cwi.smilText.Time.Playable");

/**
 * Implementation of a SmilText Document
 * @constructor
 * @augments cwi.smilText.Time.Playable
 * @param {string} region the id of the region where the smilText document will be rendered.
 * @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
 */
cwi.smilText.STDocument = function(region)
{
	var self = JSINER.extend(this, "Playable");
	
	/** 
	* Variables
	* @private
	*/
	this.layout = region;					// Hold the rendering region
	this.stylingHash = new Hashtable();		// Hold styling attributes
	
	this.translateFunc = null;				// Keep translation function.
	this.dictionary = null;					// Keep translated sentences.
	
	this.hasFillSemantics = true;			// Keep the Fill semantics associated to the display of text when duration ends.
	
	this.timingQueue = new PriorityQueue();	// Keep a priority queue of timing occurrencies.
	this.doneQueue = new PriorityQueue();	// Keep a priority queue of occurred statements.
	
	return self;
}

/**
 * Return the value of a stored style attribute.
 * @param {string} layout the region id
 * @param {string} attr the attribute name
 * @return {string} val the attribute value
 */
cwi.smilText.STDocument.prototype.getStoredAttribute = function(layout, attr)
{
	return this.stylingHash.get(layout + attr);
}

/**
 * Save a style attribute of a given layout element.
 * @param {string} layout the region id
 * @param {string} attr the attribute name
 * @param {string} val the attribute value
 */
cwi.smilText.STDocument.prototype.updateAttribute = function(layout, attr, val)
{
	this.stylingHash.put(layout + attr, val);
}

/**
 * Transfer the properties from a given style to a layout.
 * @private
 */
cwi.smilText.STDocument.prototype.applyStyle = function(typeLayout, id, style)
{
	switch(typeLayout)
	{
		case 'smiltext':
			this.updateAttribute(id, 'dur', this.getStoredAttribute(style, 'dur'));
			this.updateAttribute(id, 'width', this.getStoredAttribute(style, 'width'));
			this.updateAttribute(id, 'height', this.getStoredAttribute(style, 'height'));
		case 'textstyle':
			this.updateAttribute(id, 'textmode', this.getStoredAttribute(style, 'textmode'));
			this.updateAttribute(id, 'textplace', this.getStoredAttribute(style, 'textplace'));
			this.updateAttribute(id, 'textconceal', this.getStoredAttribute(style, 'textconceal'));
			this.updateAttribute(id, 'textrate', this.getStoredAttribute(style, 'textrate'));
		case 'div':
			this.updateAttribute(id, 'textalign', this.getStoredAttribute(style, 'textalign'));
		case 'p':
			this.updateAttribute(id, 'xml:space', this.getStoredAttribute(style, 'xml:space'));
			this.updateAttribute(id, 'textwrapoption', this.getStoredAttribute(style, 'textwrapoption'));
			this.updateAttribute(id, 'textwritingmode', this.getStoredAttribute(style, 'textwritingmode'));
		case 'span':
			this.updateAttribute(id, 'textbackgroundcolor', this.getStoredAttribute(style, 'textbackgroundcolor'));
			this.updateAttribute(id, 'textcolor', this.getStoredAttribute(style, 'textcolor'));
			this.updateAttribute(id, 'textfontfamily', this.getStoredAttribute(style, 'textfontfamily'));
			this.updateAttribute(id, 'textfontsize', this.getStoredAttribute(style, 'textfontsize'));
			this.updateAttribute(id, 'textfontstyle', this.getStoredAttribute(style, 'textfontstyle'));
			this.updateAttribute(id, 'textfontweight', this.getStoredAttribute(style, 'textfontweight'));
			this.updateAttribute(id, 'textstyle', this.getStoredAttribute(style, 'textstyle'));

			if (typeLayout != 'span' && typeLayout != 'textstyle')
				this.updateAttribute(id, 'textdirection', this.getStoredAttribute(style, 'textdirection'));
	}
}

/**
* Return the string representation of the smilText document.
* @return {string}
*/
cwi.smilText.STDocument.prototype.getXML = function()
{
	var str = "";
	var endTag = "";
	var smilTextFound = false;
	var lastType = -1;	// 0: tag; 1: text
	var currentTime = 0;
	
	this.pause();
	
	var tempQ = new PriorityQueue();
	while (this.doneQueue && !this.doneQueue.isEmpty()) 
	{
		var t = this.doneQueue.lookFirst();
		var st = this.doneQueue.pop();

		switch(st[0]) 
		{
			case cwi.smilText.Render.appendContainer:
				var id = st[1][1].charAt(0);
			 	if (st[1][1].length > 8 && st[1][1].substring(0,8) == 'smiltext') {
					id = 'smiltext';
					smilTextFound = true;
			 	}
								
				if (smilTextFound) {	
				 	switch(id)
				 	{
				 		case 'smiltext':  // smiltext tag
				 			str += "<smilText ";
				 			endTag = "\n</smilText>" + endTag;
				 			break;
				 		case 'd': // div 
				 			str += "\n<div ";
				 			endTag = "\n</div>" + endTag;
				 			break;
				 		case 'p': // p
				 			str += "\n<p ";
				 			endTag = "\n</p>" + endTag;
				 			break;
				 		case 's': // span
				 			str += "\n<span ";
				 			endTag = "\n</span>" + endTag;
				 			break;
				 	}
				 	
				 	str += "id=\'" + st[1][1] + "\' >\n";
				 	lastType = 0;
				}
				
				break;
			case cwi.smilText.Render.appendLineBreak:
				if (smilTextFound) {
					str += "<br/>";
					lastType = 0;
				}
				break;
			case cwi.smilText.Render.appendText:
				if (smilTextFound && t != currentTime) {
					currentTime = t;
					str += "\n<tev begin=\'" + t/1000.0 + "s\' />\n";
					lastType = 0;
				}
				
				if (smilTextFound) {
					if (lastType == 1)
		 				str += " ";	// Add white space
					str += st[1][1];
					lastType = 1;
				}
				break;
			case cwi.smilText.Render.clearLayout:
				if (smilTextFound) {
					str += "\n<clear begin=\'" + t/1000.0 + "s\' />\n";
					lastType = 0;
					currentTime = t;
				}
				break;
		}
		
		tempQ.push(t, st);
	}
	this.doneQueue = tempQ;
	tempQ = new PriorityQueue();
	
	while (this.timingQueue && !this.timingQueue.isEmpty()) 
	{
		var t = this.timingQueue.lookFirst();
		var st = this.timingQueue.pop();

		switch(st[0]) 
		{
			case cwi.smilText.Render.appendContainer:
				var id = st[1][1].charAt(0);
			 	if (st[1][1].length > 8 && st[1][1].substring(0,8) == 'smiltext') {
					id = 'smiltext';
					smilTextFound = true;
			 	}
								
				if (smilTextFound) {	
				 	switch(id)
				 	{
				 		case 'smiltext':  // smiltext tag
				 			str += "<smilText ";
				 			endTag = "\n</smilText>" + endTag;
				 			break;
				 		case 'd': // div 
				 			str += "<div ";
				 			endTag = "\n</div>" + endTag;
				 			break;
				 		case 'p': // p
				 			str += "<p ";
				 			endTag = "\n</p>" + endTag;
				 			break;
				 		case 's': // span
				 			str += "<span ";
				 			endTag = "\n</span>" + endTag;
				 			break;
				 	}
				 	
				 	str += "id=\'" + st[1][1] + "\' >\n";
				 	lastType = 0;
				}
				
				break;
			case cwi.smilText.Render.appendLineBreak:
				if (smilTextFound) {
					str += "<br/>";
					lastType = 0;
				}
				break;
			case cwi.smilText.Render.appendText:
				if (smilTextFound && t != currentTime) {
					currentTime = t;
					str += "\n<tev begin=\'" + t/1000.0 + "s\' />\n";
					lastType = 0;
				}
		
				if (smilTextFound) {
					str += st[1][1];
					lastType = 1;
				}
				break;
			case cwi.smilText.Render.clearLayout:
				if (smilTextFound) {
					str += "\n<clear begin=\'" + t/1000.0 + "s\' />\n";
					lastType = 0;
					currentTime = t;
				}
				break;
		}
		// st[0] : function	| st[1] : array of arguments
		//str = st[0] + st[1];
		
		tempQ.push(t, st);
	}
	this.timingQueue = tempQ;
	
	// Issue end tag
	if (endTag) {
		str += endTag;
	}

	return str;
}

/******************************************************************
 * Time Engine 
 ******************************************************************/

/**
 * Add a rendering primitive to the scheduler.
 * @param {string} entry The smilText rendering primitive.
 * @param {Array[]} args An array of arguments to the rendering primitive.
 * @param {integer} t The occurring time (in milliseconds) relative to the smilText container.
 * @see cwi.smilText.Render.appendContainer
 * @see cwi.smilText.Render.appendLineBreak
 * @see cwi.smilText.Render.appendText
 * @see cwi.smilText.Render.clearLayout
 * @see cwi.smilText.Render.closeContainer
 */
cwi.smilText.STDocument.prototype.addTimingEntry = function(func, args, t)
{
	if (func == cwi.smilText.Render.scrollticker)
		this.motionEntry = new Array(0, func, args);
	else this.timingQueue.push(t, new Array(func, args));
}

/**
 * Remove all rendering primitives from the scheduler.
 * @see cwi.smilText.Render.appendContainer
 * @see cwi.smilText.Render.appendLineBreak
 * @see cwi.smilText.Render.appendText
 * @see cwi.smilText.Render.clearLayout
 * @see cwi.smilText.Render.closeContainer
 */
cwi.smilText.STDocument.prototype.clearTimingEntries = function()
{
	this.doneQueue.clear();
 	this.timingQueue.clear();
 	this.motionEntry = null;
}

/**
 * Return an array containing the timing entries. Each element of this array is an array containing: 
 * [the occurency time, the rendering function, array of parameters to the rendering function].
 * @return {Array[ [integer; string; args] ]}
 * @see cwi.smilText.Render.appendContainer
 * @see cwi.smilText.Render.appendLineBreak
 * @see cwi.smilText.Render.appendText
 * @see cwi.smilText.Render.clearLayout
 * @see cwi.smilText.Render.closeContainer
 */
cwi.smilText.STDocument.prototype.getTimingEntries = function()
{
	var l = new DoubleLinkedList();
	
	this.pause();
	
	var tempQ = new PriorityQueue();
	while (this.doneQueue && !this.doneQueue.isEmpty()) 
	{
		var t = this.doneQueue.lookFirst();
		var st = this.doneQueue.pop();

		l.insert(new Array(t, st));

		tempQ.push(t, st);
	}
	this.doneQueue = tempQ;
	tempQ = new PriorityQueue();
	
	while (this.timingQueue && !this.timingQueue.isEmpty()) 
	{
		var t = this.timingQueue.lookFirst();
		var st = this.timingQueue.pop();

		l.insert(new Array(t, st));
		
		tempQ.push(t, st);
	}
	this.timingQueue = tempQ;
	
	return l;
}

/**
* Update the current time of the smilText document.
* @param {integer} t new time moment (in milliseconds).
*/
cwi.smilText.STDocument.prototype.setTime = function(t)
{
	cwi.smilText.STDocument.superClass.setTime.call(this, t);
	
	this.processTimingQueue();
}

/**
 * Process all entries at once.
 * @private
 */
cwi.smilText.STDocument.prototype.batchAllEntries = function()
{
	// Return to the beginnig.
	this.mergeTimingQueues();
	
	while(true)
	{
		// Process command.
		if (!this.timingQueue.isEmpty()) {
			
			var t = this.timingQueue.lookFirst();
			var st = this.timingQueue.pop();
				
			// st[0] : function	| st[1] : array of arguments
			st[0].apply(this, st[1]);
				
			this.doneQueue.push(t, st);
		}
		else break;
	}
	
	// Return to the beginnig again.
	this.mergeTimingQueues();
}

/**
 * Process the timing queue based on a given time moment.
 * @private
 */
cwi.smilText.STDocument.prototype.processTimingQueue = function()
{
	while(true)
	{
		if (this.motionEntry && this.motionEntry[0] <= this.timeNow && this.isPlaying()) {
			// this.motionEntry[1] : function	| this.motionEntry[2] : array of arguments
			this.motionEntry[1].apply(this, this.motionEntry[2]);
			this.motionEntry[0] =+ 50;
		}
				
		// Process command.
		if (this.timingQueue && !this.timingQueue.isEmpty()) {
			var t = this.timingQueue.lookFirst();
			
			if (t <= this.timeNow) {

				var st = this.timingQueue.pop();

				// st[0] : function	| st[1] : array of arguments
				st[0].apply(this, st[1]);
				
				this.doneQueue.push(t, st);
			} else break;
		}
		else break;
	}
}

/** 
* @private
*/
cwi.smilText.STDocument.prototype.mergeTimingQueues = function()
{
	// Quick merging
	this.doneQueue.merge(this.timingQueue);
	this.timingQueue = this.doneQueue;
	this.doneQueue = new PriorityQueue();
}

/**
 * Perform the seek operation to a given time moment.
 * @param {integer} t The desired time instant (in milliseconds).
 */
cwi.smilText.STDocument.prototype.seekTo = function(t)
{
	cwi.smilText.STDocument.superClass.seekTo.call(this, t);
	
	// merge queues
	this.mergeTimingQueues();
}

/**
 * Stop the smilText object.
 */
cwi.smilText.STDocument.prototype.stop = function()
{
	cwi.smilText.STDocument.superClass.stop.call(this);
	
	cwi.smilText.Render.clearLayout(this, this.layout, true);
	if (this.motionEntry)
		this.motionEntry[0] = 0;	// reset time
}

/******************************************************************
 * Language Functions
 ******************************************************************/

/**
 * Return the translation of a sentence.
 * @param {string} s The original sentence.
 * @return {string} the translated equivalent. 
 */
cwi.smilText.STDocument.prototype.getTranslatedSentence = function(s)
{
	if (this.dictionary) {
		var t = this.dictionary.get(s);
		if (!t || t == "") {
			this.updateDictionary(s, s);
			if (this.translateFunc) this.translateFunc(s);
			return s;
		}
		return t;
	}
	return s;
}

/**
 * Save a sentence and its translation.
 * @param {string} k The original sentence.
 * @param {string} val The translation in some language.
 */
cwi.smilText.STDocument.prototype.updateDictionary = function(k, val)
{
	if (k && val)
		this.dictionary.put(k, val);
}

/**
 * Set the translation function.
 * @param {string} func A translation function.
 */
cwi.smilText.STDocument.prototype.setTranslateFunction = function(func)
{
	this.translateFunc = func;
	this.dictionary = new Hashtable();
	if (func) this.batchAllEntries();
}





/**
 @name cwi.smilText.Parser
 @namespace Hold all smilText parsing functionalities.
 @version 1.0
 @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
*/
Namespace("cwi.smilText.Parser");

/* Solve library dependency */
Import("cwi.smilText.STDocument");

/**
 * Parse the html source in order to find smilText tags, and render them 
 * into the respective enclosing regions.
 * @return {Array[cwi.smilText.STDocument]}
 * @see cwi.smilText.STDocument
 */
cwi.smilText.Parser.parseHTML = function()
{
	var docs = new Array();
	var doc = new STDocument(null); // created here just to hold styles' hash
	
	// Read textStyle elements.
	var style = document.getElementsByTagName("textstyle");
	
	for (var k=0; k<style.length; k++)
	{
		var id;
		
		for( var j = 0; j < style[k].attributes.length; j++ ) {
			if ( style[k].attributes[j].nodeName.toLowerCase() == 'id' ) {
				id = style[k].attributes[j].nodeValue;
				break;
			}
		}
		
		// check whether the attribute exists
		if (id == undefined) {
			alert("Error: a textStyle element must have an ID!");
		} else {
			cwi.smilText.Parser.parseAttributes(doc, id, style[k]);
		}
	}
	
	// Process smilText tags
	var ti;
	var t=document.getElementsByTagName("smiltext");
	for(ti=0; ti<t.length; ti++)
	{
		var dad = t[ti].parentNode;
		var layoutId;
		// check whether the attribute exists 
		for( var i = 0; i < dad.attributes.length; i++ ) {
			if ( dad.attributes[i].nodeName.toLowerCase() == 'id' ) {
				layoutId = dad.attributes[i].nodeValue;
				break;
			}
		}
		 
		if (layoutId == undefined) {
			alert("Error: All smilText containers must have an ID!");
		}
		
		// Trick code: process the smilText first, and then dont display specification in the html file.
		var stdoc = new STDocument(layoutId);
		stdoc.stylingHash = doc.stylingHash;		// Share styles
		cwi.smilText.Parser.parseSmilTextElem(stdoc, t[ti], layoutId, 0, undefined);
		docs[ti] = stdoc;
		
		// Keep smilText tag inside a hidden DIV
		var wrapper = document.createElement('div'); 
		wrapper.appendChild(t[ti].cloneNode(false));
		t[ti].parentNode.replaceChild(wrapper, t[ti]); 
		wrapper.style.visibility='hidden';
	}
	
	return docs;
}

/**
* Parse a smilText file and return a smilText object.
* @param {string} xmlFile The path of the file containing the smilText specification.
* @param {string} region The id of the rendering region.
* @return {cwi.smilText.STDocument}
* @see cwi.smilText.STDocument
*/
cwi.smilText.Parser.parseFile = function(xmlFile, region)
{
	var xmlDoc;

	if (document.getElementById(region) == null) 
		alert("Error: smilText content must be encapsulated in a container. Region \'" + region + "\' not found!");
	
	// FF, Opera, Safari, others
	if (document.implementation && document.implementation.createDocument)
	{
		xmlDoc = document.implementation.createDocument("", "", null);
		xmlDoc.async = false;
		var loaded = xmlDoc.load(xmlFile);
		if (loaded) {
			return cwi.smilText.Parser.parseDoc(xmlDoc, region);
		} else return null;
	}
	// IE
	else if (window.ActiveXObject)
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.preserveWhiteSpace = true;
		//xmlDoc.onreadystatechange = function () {if (xmlDoc.readyState == 4) cwi.smilText.Parser.parseDoc(xmlDoc, region); else return null;};
		xmlDoc.load(xmlFile);
		// Laiola: Added to make IE return a document.
		//return cwi.smilText.Parser.parseDoc(xmlDoc, region);
		while(xmlDoc.readyState != 4);
		return cwi.smilText.Parser.parseDoc(xmlDoc, region);
 	}
	else
	{
		alert('Your browser can\'t handle this script');
		return null;
	}
}

/**
 * Parse an XML string and return a smilText object.
 * @param {string} xmlStr The smilText string.
 * @param {string} region The id of the rendering region.
 * @return {cwi.smilText.STDocument}
 * @see cwi.smilText.STDocument
 */
cwi.smilText.Parser.parseString = function(xmlStr, region)
{
	var xmlDoc;
	
	if (document.getElementById(region) == null) 
		alert("Error: smilText content must be encapsulated in a container. Region \'" + region + "\' not found!");
	
	try //Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(xmlStr);
	}
	catch(e)
	{
		try //Firefox, Mozilla, Opera, etc.
		{
			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(xmlStr,"text/xml");
		}
		catch(e) {
			alert(e.message);
			return null;
		}
	}
	
	return cwi.smilText.Parser.parseDoc(xmlDoc, region);
}

/**
* Parse a given xml document. So far, the tags are case sensitive.
* @private
*/
cwi.smilText.Parser.parseDoc = function(xmlDoc, region)
{
	var stdoc = new STDocument(region);
	
	// Read textStyle elements
	var style = xmlDoc.getElementsByTagName('textStyle');
	
	for (var i=0;i<style.length;i++)
	{
		var id;
		
		for( var j = 0; j < style[i].attributes.length; j++ ) {
			if ( style[i].attributes[j].nodeName.toLowerCase() == 'id' ) {
				id = style[i].attributes[j].nodeValue;
				break;
			}
		}
		
		// It should be inside a textStyling tag
		if (style[i].parentNode.nodeName.toLowerCase() != 'textstyling') {
			alert("Warning: a textStyle element should be inside a textStyling tag");
		}
		
		// check whether the attribute exists
		if (id == undefined) {
			alert("Error: a textStyle element must have an ID!");
		} else {
			cwi.smilText.Parser.parseAttributes(stdoc, id, style[i]);
		}
	}
	
	// Process smilText elements
	var x = xmlDoc.getElementsByTagName('smilText');
	
	for (var i=0;i<x.length;i++)
	{
		cwi.smilText.Parser.parseSmilTextElem(stdoc, x[i], region, 0, undefined);
	}
	
	return stdoc;
}

/**
* Parse a smilText elem.
* @private
*/
cwi.smilText.Parser.parseSmilTextElem = function(doc, elem, layout, currentTime, dur)
{
	var setEnd = false;
	
	// Make sure that a tag will be inserted.
	var force;
	if (dur == undefined || currentTime <= dur)
		force = true;
	else force = false;
	
	// Put smilText in a DIV
	if (elem.nodeName.toLowerCase() == 'smiltext') {
		var smiltextID = "smiltext" + Math.random()*10000;

		// Clear parent container before hand.
		doc.addTimingEntry(cwi.smilText.Render.clearLayout, new Array(doc, layout, force), currentTime * 1000);
				  
		cwi.smilText.Parser.parseAttributes(doc, smiltextID, elem);
		doc.addTimingEntry(cwi.smilText.Render.appendContainer, new Array(doc, smiltextID, layout, force), currentTime * 1000);
		layout = smiltextID;
		
		if (doc.getStoredAttribute(smiltextID, 'dur') != undefined && doc.getStoredAttribute(smiltextID, 'dur') != null)
		{
			dur = parseFloat(doc.getStoredAttribute(smiltextID, 'dur'));
			doc.addTimingEntry(cwi.smilText.Render.closeContainer, new Array(doc), dur * 1000);
		}
	}
			
	for (var j=0;j<elem.childNodes.length;j++)
	{
		
		/* string */
		if (elem.childNodes[j].nodeType != 1) {
			
			var str;
			
			// follow xml:space
			if (doc.getStoredAttribute(layout, 'xml:space') == 'preserve')
			{
				str = elem.childNodes[j].nodeValue;
				
				var lines = str.split(/\n/g); // line breaks become <br/>
				for (var z = 0; z < lines.length; z++) {
					//lines[z] = lines[z].replace(new RegExp( "\\'", "g" ), "\\'");  // replace single quotation mark
					doc.addTimingEntry(cwi.smilText.Render.appendText, new Array(doc, lines[z], layout, force), currentTime * 1000);
					
					if (doc.getStoredAttribute(layout, 'textmode') != "crawl") {
						if (z != lines.length-1) doc.addTimingEntry(cwi.smilText.Render.appendLineBreak, new Array(doc, layout, force), currentTime * 1000);
					}
				}
			}
			else {
				str = (cwi.util.trim(elem.childNodes[j].nodeValue));
				str = str.replace(new RegExp( "\\n", "g" ), "");     // line breaks discarded.
				str = str.replace(new RegExp( "\\t", "g" ), "");     // tabs discarded.
				str = str.replace(new RegExp( "\ +", "g" ), " ");    // extra white-spaces discarded.
				//str = str.replace(new RegExp( "\\'", "g" ), "\\'");  // replace single quotation mark
				
				/* test if non-blank */
				if (str.length != 0) {
					doc.addTimingEntry(cwi.smilText.Render.appendText, new Array(doc, str, layout, force), currentTime * 1000);
				}
				else{	
					// Blank string
				}

			}
		}
		
		/* smilText tags */
		else {
			var tag = elem.childNodes[j].nodeName.toLowerCase();
					
			switch(tag)
			{
				
				/********************/
				/* Parse BasicText Module
				/********************/
				
				case 'tev':
				  var b = null;
				  var n = null;
				  
				  // All timing markup to be ignored according to text motion specification.
				  if ( (doc.getStoredAttribute(layout, 'textmode') == "crawl" ||
						doc.getStoredAttribute(layout, 'textmode') == "scroll" ||
						doc.getStoredAttribute(layout, 'textmode') == "jump") &&
					   (doc.getStoredAttribute(layout, 'textrate') == null ||
					    doc.getStoredAttribute(layout, 'textrate') == undefined ||
					    doc.getStoredAttribute(layout, 'textrate') == "auto") ) {
					break;
				  }
				
				  // check whether the attribute exists before setting a value 
				  for( var i = 0; i < elem.childNodes[j].attributes.length; i++ ) {
			  	  	  if ( elem.childNodes[j].attributes[i].nodeName.toLowerCase() == 'begin' ) {
			      		  b = parseFloat(elem.childNodes[j].attributes[i].nodeValue);
			      		  break;
			  		  }
			  		
			  		  else if ( elem.childNodes[j].attributes[i].nodeName.toLowerCase() == 'next' ) {
			      		  n = parseFloat(elem.childNodes[j].attributes[i].nodeValue);
			      		  break;
			  		  } 
				  }
				  
				  // test begin and next attributes.
				  if (n != null){
				  	  currentTime += n;
				  } 
				  else if (b != null){
				  	  // test whether the begin time has elapsed.
				  	  if (b > currentTime)
				  	  	  currentTime = b;
				  }
				  
				  // Update force variable
				  if (dur == undefined || currentTime <= dur)
					  force = true;
				  else force = false;
				  
				  // Apply append attribute.
				  if (doc.getStoredAttribute(layout, 'textmode') == "replace") {
				  	  doc.addTimingEntry(cwi.smilText.Render.clearLayout, new Array(doc, layout, force), currentTime * 1000);
				  }
				  
				  break;    
				case 'clear':
				  var b = null;
				  var n = null;
				
				  // All timing markup to be ignored according to text motion specification.
				  if ( (doc.getStoredAttribute(layout, 'textmode') == "crawl" ||
						doc.getStoredAttribute(layout, 'textmode') == "scroll" ||
						doc.getStoredAttribute(layout, 'textmode') == "jump") &&
					   (doc.getStoredAttribute(layout, 'textrate') == null ||
					    doc.getStoredAttribute(layout, 'textrate') == undefined ||
					    doc.getStoredAttribute(layout, 'textrate') == "auto") ) {
					break;
				  }
				  
				  // check whether the attribute exists before setting a value 
				  for( var i = 0; i < elem.childNodes[j].attributes.length; i++ ) {
			  	  	  if ( elem.childNodes[j].attributes[i].nodeName.toLowerCase() == 'begin' ) {
			      		  b = parseFloat(elem.childNodes[j].attributes[i].nodeValue);
			      		  break;
			  		  }
			  		
			  		  else if ( elem.childNodes[j].attributes[i].nodeName.toLowerCase() == 'next' ) {
			      		  n = parseFloat(elem.childNodes[j].attributes[i].nodeValue);
			      		  break;
			  		  } 
				  }
				  
				  // test begin and next attributes.
				  if (n != null){
				  	  currentTime += n;
				  } 
				  else if (b != null){
				  	  // test whether the begin time has elapsed.
				  	  if (b > currentTime)
				  	  	  currentTime = b;
				  }
				  
				  // Update force variable
				  if (dur == undefined || currentTime <= dur)
					  force = true;
				  else force = false;
				  
				  // Clear container.
				  doc.addTimingEntry(cwi.smilText.Render.clearLayout, new Array(doc, layout, force), currentTime * 1000);
				  
				  break;
				case 'br':
				  if (doc.getStoredAttribute(layout, 'textmode') != "crawl") {
					doc.addTimingEntry(cwi.smilText.Render.appendLineBreak, new Array(doc, layout, force), currentTime * 1000);
				  }
				  break;
				  
				/********************/
				/* Parse TextStyling Module
				/********************/
				
				case 'div':
				  // check whether attributes exist
				  
				  // a new div will be created to render the content
				  var divID = "div" + Math.random()*10000;
				  cwi.smilText.Parser.parseAttributes(doc, divID, elem.childNodes[j]);
				  
				  // Setup xml:space
			 	  if (doc.getStoredAttribute(divID, 'xml:space') == undefined || doc.getStoredAttribute(divID, 'xml:space') == null ||
			 	      (doc.getStoredAttribute(divID, 'xml:space') != 'default' && doc.getStoredAttribute(divID, 'xml:space') != 'preserve')) {
					  if (doc.getStoredAttribute(layout, 'xml:space') != undefined && doc.getStoredAttribute(layout, 'xml:space') != null && 
					     (doc.getStoredAttribute(layout, 'xml:space') == 'default' || doc.getStoredAttribute(layout, 'xml:space') == 'preserve'))
					  {
					  	  doc.updateAttribute(divID, 'xml:space', doc.getStoredAttribute(layout, 'xml:space'));
					  } else doc.updateAttribute(divID, 'xml:space', 'default');		
				  }
				  
				  doc.updateAttribute(divID, 'textmode', doc.getStoredAttribute(layout, 'textmode'));
				  doc.updateAttribute(divID, 'textrate', doc.getStoredAttribute(layout, 'textrate'));
				  doc.addTimingEntry(cwi.smilText.Render.appendContainer, new Array(doc, divID, layout, force), currentTime * 1000);
				  
				  currentTime = cwi.smilText.Parser.parseSmilTextElem(doc, elem.childNodes[j], divID, currentTime, dur);
				  break;
				case 'p':
				  // check whether attributes exist
				  
				  // a new p will be created to render the content
				  var pID = "p" + Math.random()*10000;
				  cwi.smilText.Parser.parseAttributes(doc, pID, elem.childNodes[j]);
				  
				  // Setup xml:space
			 	  if (doc.getStoredAttribute(pID, 'xml:space') == undefined || doc.getStoredAttribute(pID, 'xml:space') == null ||
			 	      (doc.getStoredAttribute(pID, 'xml:space') != 'default' && doc.getStoredAttribute(pID, 'xml:space') != 'preserve')) {
					  if (doc.getStoredAttribute(layout, 'xml:space') != undefined && doc.getStoredAttribute(layout, 'xml:space') != null && 
					     (doc.getStoredAttribute(layout, 'xml:space') == 'default' || doc.getStoredAttribute(layout, 'xml:space') == 'preserve'))
					  {
					  	  doc.updateAttribute(pID, 'xml:space', doc.getStoredAttribute(layout, 'xml:space'));
					  } else doc.updateAttribute(pID, 'xml:space', 'default');		
				  }
				  
				  doc.updateAttribute(pID, 'textmode', doc.getStoredAttribute(layout, 'textmode'));
				  doc.updateAttribute(pID, 'textrate', doc.getStoredAttribute(layout, 'textrate'));
				  doc.addTimingEntry(cwi.smilText.Render.appendContainer, new Array(doc, pID, layout, force), currentTime * 1000);
				  
				  currentTime = cwi.smilText.Parser.parseSmilTextElem(doc, elem.childNodes[j], pID, currentTime, dur);
				  break;
				case 'span':
				  // check whether attributes exist
				  
				  // a new span will be created to render the content
				  var spanID = "span" + Math.random()*10000;
				  cwi.smilText.Parser.parseAttributes(doc, spanID, elem.childNodes[j]);
				  				  
				  // Setup xml:space
			 	  if (doc.getStoredAttribute(spanID, 'xml:space') == undefined || doc.getStoredAttribute(spanID, 'xml:space') == null ||
			 	      (doc.getStoredAttribute(spanID, 'xml:space') != 'default' && doc.getStoredAttribute(spanID, 'xml:space') != 'preserve')) {
					  if (doc.getStoredAttribute(layout, 'xml:space') != undefined && doc.getStoredAttribute(layout, 'xml:space') != null && 
					     (doc.getStoredAttribute(layout, 'xml:space') == 'default' || doc.getStoredAttribute(layout, 'xml:space') == 'preserve'))
					  {
					  	  doc.updateAttribute(spanID, 'xml:space', doc.getStoredAttribute(layout, 'xml:space'));
					  } else doc.updateAttribute(spanID, 'xml:space', 'default');		
				  }
				  
				  doc.updateAttribute(spanID, 'textmode', doc.getStoredAttribute(layout, 'textmode'));
				  doc.updateAttribute(spanID, 'textrate', doc.getStoredAttribute(layout, 'textrate'));
				  doc.addTimingEntry(cwi.smilText.Render.appendContainer, new Array(doc, spanID, layout, force), currentTime * 1000);
				  
				  currentTime = cwi.smilText.Parser.parseSmilTextElem(doc, elem.childNodes[j], spanID, currentTime, dur);
				  break;
				default:
				  alert("Unknown smilText tag: " + tag);
			}
		}
	}
	
	return currentTime;
}

/**
 * Check the attributes of an element.
 * @private
 */
cwi.smilText.Parser.parseAttributes = function(doc, id, elem)
{
	var elemName = elem.nodeName.toLowerCase();

	// Make sure we can recover it on applyAttributes method.	
	if (elemName == 'textstyle') {
		id = 'textstyle' + id;
	}
	else {
		// check whether the textStyle attribute was defined.
		for( var i = 0; i < elem.attributes.length; i++ ) {
			var attr = elem.attributes[i].nodeName.toLowerCase();
			var val = elem.attributes[i].nodeValue;
			
			if (attr == 'textstyle') {
				doc.applyStyle(elemName, id, 'textstyle' + val);
				break;
			}
		}
	}
	
	// check whether the attribute exists before setting a value
	for( var i = 0; i < elem.attributes.length; i++ ) {
		
		var found = false;
		var attr = elem.attributes[i].nodeName.toLowerCase();
		var val = elem.attributes[i].nodeValue;
		
		switch(elemName)
		{
			case 'smiltext':
				switch(attr)
				{
					case 'dur':
						found = true;
						break;
					case 'width':
						found = true;
						break;
					case 'height':
						found = true;
						break;
					default:
				}
				if (found){
					doc.updateAttribute(id, attr, val);
					break;
				}
			case 'textstyle':
				switch(attr)
				{
					case 'textmode':
						found = true;
						break;
					case 'textplace':
						found = true;
						break;
					case 'textconceal':
						found = true;
						break;
					case 'textrate':
						found = true;
						break;
					default:
				}
				if (found){
					doc.updateAttribute(id, attr, val);
					break;
				}
			case 'div':
				switch(attr)
				{
					case 'textalign':
						found = true;
						break;
					default:
				}
				if (found){
					doc.updateAttribute(id, attr, val);
					break;
				}
			case 'p':
				switch(attr)
				{
					case 'xml:space':
					case 'textwrapoption':
					case 'textwritingmode':
					//case 'textstyle':
						found = true;
						break;
					default:
				}
				if (found){
					doc.updateAttribute(id, attr, val);
					break;
				}
			case 'span':
				switch(attr)
				{
					case 'textbackgroundcolor':
					case 'textcolor':
					case 'textfontfamily':
					case 'textfontsize':
					case 'textfontstyle':
					case 'textfontweight':
					case 'textstyle':
						found = true;
						break;
					case 'textdirection':
						// Confirm it is a span element. Otherwise jump out.
						if (elemName != 'span' && elemName != 'textstyle') break;
						found = true;
						break;
					default:
				}
				if (found){
					doc.updateAttribute(id, attr, val);
				}
				break;
			default:
				return;
		}
	}
	
}





/**
 @name cwi.smilText.Render
 @namespace Hold all smilText rendering functionalities.
 @version 1.0
 @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
*/
Namespace("cwi.smilText.Render");

/* Solve library dependency */
Import("cwi.smilText.STDocument");

/**
 * Append text to a given region.
 * @param {cwi.smilText.STDocument} doc the smilText document.
 * @param {string} str the string to be appended.
 * @param {string} layout the id of the rendering region.
 * @param {string} force true to guaratee that the primitive will be issued.
 * @see cwi.smilText.STDocument
 */
cwi.smilText.Render.appendText = function(doc, str, layout, force)
{
	if (doc == null || doc == undefined)
		return;
	
	// Test whether smilText duration has elapsed.
	if (!force)
		return;
			
	str = doc.getTranslatedSentence(str);
		
	// Apply textWrapOption
	switch(doc.getStoredAttribute(layout, 'textwrapoption'))
	{
		case 'noWrap':
			break;
		case 'inherit':
		    break;
		case 'wrap':
		default:
			str = str.replace(/(.*?)/g, "<wbr/>");
	}
	
	var wrapper = document.createElement('span');
	if (document.getElementById(layout) != null)
		document.getElementById(layout).appendChild(wrapper);
	wrapper.innerHTML = str;
	//document.getElementById(layout).innerHTML += str;
}

/**
 * Append a linebreak to a given region.
 * @param {cwi.smilText.STDocument} doc the smilText document.
 * @param {string} layout the id of the rendering region.
 * @param {string} force true to guaratee that the primitive will be issued.
 * @see cwi.smilText.STDocument
 */
cwi.smilText.Render.appendLineBreak = function(doc, layout, force)
{
	if (doc == null || doc == undefined)
		return;
		
	// Test whether smilText duration has elapsed.
	if (!force)
		return;
				
	var theData = document.createElement('BR');
	if (document.getElementById(layout) != null) 
		document.getElementById(layout).appendChild(theData);
}

/**
 * Clear a given region.
 * @param {cwi.smilText.STDocument} doc the smilText document.
 * @param {string} layout the id of the rendering region.
 * @param {string} force true to guaratee that the primitive will be issued.
 * @see cwi.smilText.STDocument 
 */
cwi.smilText.Render.clearLayout = function(doc, layout, force)
{
	if (doc == null || doc == undefined)
		return;
		
	// Test whether smilText duration has elapsed.
	if (!force)
		return;
			
	var layoutElem = document.getElementById(layout);
	if (layoutElem) {
		while (child = layoutElem.firstChild)
			layoutElem.removeChild(child);
	}
}

/**
 * Append a container to a given region.
 * @param {cwi.smilText.STDocument} doc the smilText document.
 * @param {string} containerName the name of the new container.	It must be unique 
 * and start with smiltext, div, p or span.
 * @param {string} layout the id of the rendering region.
 * @param {string} force true to guaratee that the primitive will be issued.
 * @see cwi.smilText.STDocument
 */
cwi.smilText.Render.appendContainer = function(doc, containerName, layout, force)
{
	if (doc == null || doc == undefined)
		return;
		
	// Test whether smilText duration has elapsed.
	if (!force)
		return;

	// create a new div to render the content
 	var wrapper;
 	var id = containerName.charAt(0);
 	if (containerName.length > 8 && containerName.substring(0,8) == 'smiltext') {
		id = 'smiltext';
 	}
		
 	switch(id)
 	{
 		case 'smiltext':  // smiltext tag
 		case 'd': // div 
 			wrapper = document.createElement('div');
 			try {
 				wrapper.style.display='block';
 			} catch (e) {}
 			break;
 		case 'p': // p
 			wrapper = document.createElement('div');
 			try {
 				wrapper.style.display='block';
 			} catch (e) {}
 			break;
 		case 's': // span
 			wrapper = document.createElement('div');
 			try {
 				wrapper.style.display='inline';
 			} catch (e) {}
 			break;
 	}
 	
 	// Setup text wrap option
 	if (doc.getStoredAttribute(containerName, 'textwrapoption') == undefined || 
 		doc.getStoredAttribute(containerName, 'textwrapoption') == null) 
 	{
		doc.updateAttribute(containerName, 'textwrapoption', 'wrap');
	}
	else if (doc.getStoredAttribute(containerName, 'textwrapoption') == 'inherit') 
	{
		if (doc.getStoredAttribute(layout, 'textwrapoption') != undefined && 
			doc.getStoredAttribute(layout, 'textwrapoption') != null)
		{
			doc.updateAttribute(containerName, 'textwrapoption', doc.getStoredAttribute(layout, 'textwrapoption'));
		} else doc.updateAttribute(containerName, 'textwrapoption', 'wrap');
	}
	
	// Crawl mode: disable line breaks
	if (doc.getStoredAttribute(containerName, 'textmode') == "crawl") {
		doc.updateAttribute(containerName, 'textwrapoption', 'noWrap');
	}
	
	// Apply textWrapOption
	if (doc.getStoredAttribute(containerName, 'xml:space') == 'preserve')
	{
		switch(doc.getStoredAttribute(containerName, 'textwrapoption'))
		{
			case 'noWrap':
				try {
					wrapper.style.whiteSpace='pre';
				} catch (e) {}
		  		break;
			case 'wrap':
			default:
				try {
					wrapper.style.whiteSpace='pre-wrap';
				} catch (e) {}
		}
	} else {
		switch(doc.getStoredAttribute(containerName, 'textwrapoption'))
		{
			case 'noWrap':
				try {
					wrapper.style.whiteSpace='nowrap';
				} catch (e) {}
		  		break;
			case 'wrap':
			default:
				try {
					wrapper.style.whiteSpace='normal';
				} catch (e) {}
		}	
	}
	
	// Discard implicit line breaks on crawl mode
 	if (doc.getStoredAttribute(containerName, 'textmode') == "crawl" && id != 'smiltext') {
 		try {
 			wrapper.style.display='inline';
 		} catch (e) {}
 	}
 	
 	if (document.getElementById(layout) != null)
 		document.getElementById(layout).appendChild(wrapper);
	id = document.createAttribute("id");
 	id.nodeValue=containerName;
	wrapper.setAttributeNode(id);
	
	cwi.smilText.Render.applyAttributes(doc, containerName, wrapper);
}

/**
 * Set the end of the life cycle of a smilText tag.
 * @param {cwi.smilText.STDocument} doc the smilText document.
 * @see cwi.smilText.STDocument
 */
cwi.smilText.Render.closeContainer = function(doc)
{
	if (!doc.hasFillSemantics) cwi.smilText.Render.clearLayout(doc, doc.layout, true);
}

/**
 * Apply the stored attributes in a given layout.
 * @private
 */
cwi.smilText.Render.applyAttributes = function(doc, id, layout)
{
	
	var elemName;
	if (id.length > 8 && id.substring(0,8) == 'smiltext'){
		elemName = 'smiltext';
	}
	else if (id.length > 9 && id.substring(0,9) == 'textstyle'){
		elemName = 'textstyle';
		
		// get the layout id
		for( var i = 0; i < layout.attributes.length; i++ ) {
			
	 		if ( layout.attributes[i].nodeName.toLowerCase() == 'id' ) {
	 			var container = layout.attributes[i].nodeValue;

	 			if (container.length > 8 && container.substring(0,8) == 'smiltext');
				else if (container.length > 3 && container.substring(0,3) == 'div')
					elemName += '1';
				else if (container.length > 1 && container.substring(0,1) == 'p')
					elemName += '2';
				else if (container.length > 4 && container.substring(0,4) == 'span')
					elemName += '3';	
					
	 			break;
	 		}
		 	
		}
		
	}
	else elemName = id.charAt(0);

	// Apply textStyle
	if (elemName != 'textstyle' && doc.getStoredAttribute(id, 'textstyle') != undefined &&
		doc.getStoredAttribute(id, 'textstyle') != null) {
		cwi.smilText.Render.applyAttributes(doc, 'textstyle'+ doc.getStoredAttribute(id, 'textstyle'), layout);
	}
	
	switch(elemName)
	{
		case 'smiltext':
			if (doc.getStoredAttribute(id, 'width') != undefined && doc.getStoredAttribute(id, 'width') != null)
			{
				try {
					layout.style.width = parseFloat(doc.getStoredAttribute(id, 'width'));
					layout.style.overflow='hidden';
				} catch (e) {}
			}
			if (doc.getStoredAttribute(id, 'height') != undefined && doc.getStoredAttribute(id, 'height') != null)
			{
				try {
					layout.style.height = parseFloat(doc.getStoredAttribute(id, 'height'));
					layout.style.overflow='hidden';
				} catch (e) {}
			}
		case 'textstyle':
			if (doc.getStoredAttribute(id, 'textplace') != undefined && doc.getStoredAttribute(id, 'textplace') != null)
			{
				// TODO	
			}
			if (doc.getStoredAttribute(id, 'textmode') != undefined && doc.getStoredAttribute(id, 'textmode') != null)
			{
				switch(doc.getStoredAttribute(id, 'textmode'))
				{
					case 'replace':
						break;
					case 'crawl':
						doc.addTimingEntry(cwi.smilText.Render.scrollticker, new Array(doc, id, '1'), 0);
						break;
					case 'scroll':
						doc.addTimingEntry(cwi.smilText.Render.scrollticker, new Array(doc, id, '2'), 0);
						break;
					case 'jump':
						// TODO
						break;
					case 'append':
					default:
				}
			}
			if (doc.getStoredAttribute(id, 'textconceal') != undefined && doc.getStoredAttribute(id, 'textconceal') != null)
			{
				switch(doc.getStoredAttribute(id, 'textconceal'))
				{
					case 'none':
						// TODO
						break;
					case 'initial':
						// TODO
						break;
					case 'final':
						// TODO
						break;
					case 'both':
						// TODO
						break;
					case 'inherit':
					default:
				}
			}
			if (doc.getStoredAttribute(id, 'textrate') != undefined && doc.getStoredAttribute(id, 'textrate') != null)
			{
				// TODO
			}
		case 'textstyle1':
		case 'd': // div
			if (doc.getStoredAttribute(id, 'textalign') != undefined && doc.getStoredAttribute(id, 'textalign') != null)
			{
				switch(doc.getStoredAttribute(id, 'textalign'))
				{
					case 'inherit':
					case 'start':
					case 'end':
					case 'left':
					case 'right':
					case 'center':
						try {
							layout.style.textAlign = doc.getStoredAttribute(id, 'textalign');
						} catch (e) {}
						break;
					default:
				}
			}
		case 'textstyle2':
		case 'p': // p
			if (doc.getStoredAttribute(id, 'textwritingmode') != undefined && doc.getStoredAttribute(id, 'textwritingmode') != null)
			{
				switch(doc.getStoredAttribute(id, 'textwritingmode'))
				{
					case 'lr-tb':
					case 'rl-tb':
					case 'tb-rl':
					case 'tb-lr':
					case 'rl':
					case 'lr':
					case 'inherit':
						try {
							layout.style.writingMode = doc.getStoredAttribute(id, 'textwritingmode');
						} catch (e) {}
						break;
					default:
				}
			}
		case 'textstyle3':
		case 's': // span
			if (doc.getStoredAttribute(id, 'textbackgroundcolor') != undefined && doc.getStoredAttribute(id, 'textbackgroundcolor') != null)
			{
				try {
					layout.style.backgroundColor = doc.getStoredAttribute(id, 'textbackgroundcolor');
				} catch (e) {}
			}
			if (doc.getStoredAttribute(id, 'textcolor') != undefined && doc.getStoredAttribute(id, 'textcolor') != null)
			{
				try {
					layout.style.color = doc.getStoredAttribute(id, 'textcolor');
				} catch (e) {}
			}
			if (doc.getStoredAttribute(id, 'textfontfamily') != undefined && doc.getStoredAttribute(id, 'textfontfamily') != null)
			{
				try {
					layout.style.fontFamily = doc.getStoredAttribute(id, 'textfontfamily');
				} catch (e) {}
			}
			if (doc.getStoredAttribute(id, 'textfontsize') != undefined && doc.getStoredAttribute(id, 'textfontsize') != null)
			{
				try {
					layout.style.fontSize = doc.getStoredAttribute(id, 'textfontsize');
				} catch (e) {}
			}
			if (doc.getStoredAttribute(id, 'textfontstyle') != undefined && doc.getStoredAttribute(id, 'textfontstyle') != null)
			{
				try {
					layout.style.fontStyle = doc.getStoredAttribute(id, 'textfontstyle');
				} catch (e) {}
			}
			if (doc.getStoredAttribute(id, 'textfontweight') != undefined && doc.getStoredAttribute(id, 'textfontweight') != null)
			{
				try {
					layout.style.fontWeight = doc.getStoredAttribute(id, 'textfontweight');
				} catch (e) {}
			}
			if (doc.getStoredAttribute(id, 'textdirection') != undefined && doc.getStoredAttribute(id, 'textdirection') != null)
			{
				// Confirm it is a span element. Otherwise jump out.
				if (elemName == 's')
				{
					if (doc.getStoredAttribute(id, 'textdirection') == 'rtlo' || 
						doc.getStoredAttribute(id, 'textdirection') == 'rtl') {
						try {
							layout.style.direction = 'rtl';
							layout.style.unicodeBidi = 'bidi-override';
						} catch (e) {}
					} else if (doc.getStoredAttribute(id, 'textdirection') == 'ltro' ||
						doc.getStoredAttribute(id, 'textdirection') == 'ltro') {
						try {
							layout.style.direction = 'ltr';
							layout.style.unicodeBidi = 'bidi-override';
						} catch (e) {}
					}
				}
			}
			break;
		default:
	}
	
}

/******************************************************************
 * Text Motion
 ******************************************************************/

/**
* @private
*/
cwi.smilText.Render.cps = 1; // 20px/s

/**
 * Move layout content in a given direction.
 * @private
 */
cwi.smilText.Render.scrollticker = function(doc, layout, dir)
{
	var mq = document.getElementById(layout).parentNode;
	mq.style.overflow='hidden';
	var mqPosition = mq.style.position;
	mq.style.position='relative';
	
	for (var j = 0; j < mq.childNodes.length; j++)
	{
		var moveElem = mq.childNodes[j];
		
		var direction;
		
		if (dir == '1') { // move against the first writing direction
			if (doc.getStoredAttribute(layout, 'textwritingmode') != undefined && doc.getStoredAttribute(layout, 'textwritingmode') != null)
			{
				switch(doc.getStoredAttribute(layout, 'textwritingmode'))
				{
					case 'lr-tb':
					case 'lr':
						direction = 'left';
						break;
					case 'rl-tb':
					case 'rl':
						direction = 'right';
						break;
					case 'tb-rl':
					case 'tb-lr':
						direction = 'up';
					case 'inherit':
						if (cwi.util.getStyleByElem(mq, 'writingMode') != undefined && 
							cwi.util.getStyleByElem(mq, 'writingMode') != null &&
							cwi.util.getStyleByElem(mq, 'writingMode').length > 0) {
							if (cwi.util.getStyleByElem(mq, 'writingMode').charAt(0) == 'r')
								direction = 'right';
							else if (cwi.util.getStyleByElem(mq, 'writingMode').charAt(0) == 't')
								direction = 'up';
							else direction = 'left';
						}
						else direction = 'left';
						break;
				}
			}
			else{
				if (cwi.util.getStyleByElem(mq, 'writingMode') != undefined && 
					cwi.util.getStyleByElem(mq, 'writingMode') != null && 
					cwi.util.getStyleByElem(mq, 'writingMode').length > 0) {
					if (cwi.util.getStyleByElem(mq, 'writingMode').charAt(0) == 'r')
						direction = 'right';
					else if (cwi.util.getStyleByElem(mq, 'writingMode').charAt(0) == 't')
						direction = 'up';
					else direction = 'left';
				}
				else direction = 'left';
			}
		}
		else if (dir == '2') { // move against the 2nd writing direction
			if (doc.getStoredAttribute(layout, 'textwritingmode') != undefined && doc.getStoredAttribute(layout, 'textwritingmode') != null)
			{
				switch(doc.getStoredAttribute(layout, 'textwritingmode'))
				{
					case 'lr-tb':
					case 'lr':
					case 'rl-tb':
					case 'rl':
						direction = 'up';
						break;
					case 'tb-rl':
						direction = 'right';
						break;
					case 'tb-lr':
						direction = 'left';
						break;
					case 'inherit':
						if (cwi.util.getStyleByElem(mq, 'writingMode') != undefined && 
							cwi.util.getStyleByElem(mq, 'writingMode') != null &&
							cwi.util.getStyleByElem(mq, 'writingMode').length > 0) {
							if (cwi.util.getStyleByElem(mq, 'writingMode').charAt(0) == 'r' ||
								cwi.util.getStyleByElem(mq, 'writingMode').charAt(0) == 'l')
								direction = 'up';
							else {
								if (cwi.util.getStyleByElem(mq, 'writingMode') == 'tb-lr')
									direction = 'left';
								else direction = 'right';
							}
						}	
						else direction = 'left';
						break;
				}
			}
			else{
				if (cwi.util.getStyleByElem(mq, 'writingMode') != undefined && 
					cwi.util.getStyleByElem(mq, 'writingMode') != null && 
					cwi.util.getStyleByElem(mq, 'writingMode').length > 0) {
					if (cwi.util.getStyleByElem(mq, 'writingMode').charAt(0) == 'r' ||
						cwi.util.getStyleByElem(mq, 'writingMode').charAt(0) == 'l')
						direction = 'up';
					else {
						if (cwi.util.getStyleByElem(mq, 'writingMode') == 'tb-lr')
							direction = 'left';
						else direction = 'right';
					}
				}
				else direction = 'up';
			}	
		}
			
		// has textRate?
		var currentCPS = cwi.smilText.Render.cps;
		if (doc.getStoredAttribute(layout, 'textrate') != undefined && 
			doc.getStoredAttribute(layout, 'textrate') != null &&
			doc.getStoredAttribute(layout, 'textrate') != 'auto')
		{
			currentCPS = 0.05 * parseInt(doc.getStoredAttribute(layout, 'textrate'));
		}
		
		if (moveElem.nodeType != 1);
		else
		{
			var w = parseInt(cwi.util.getStyleByElem(mq, 'width'));
			var h = parseInt(cwi.util.getStyleByElem(mq, 'height'));
			moveElem.style.position = 'absolute';
			var aw = moveElem.offsetWidth > w ? moveElem.offsetWidth : w;
			var ah = moveElem.offsetHeight;
			moveElem.style.position = 'relative';

			if (!aw)
			{
				aw = moveElem.offsetWidth;
			}
			
			if (!ah)
			{
				ah = moveElem.offsetHeight;
			}
			
			if (!w) {
				w = aw;
			}
			if (!h) {
				h = ah;
			}
			
			switch(direction)
			{
				case 'left':
					if (!moveElem.style.left)
					{
						moveElem.style.left = 0;
					}
					
					moveElem.style.left = parseInt(moveElem.style.left) > parseInt(-aw) ? 
						parseFloat(moveElem.style.left) - currentCPS : w;
					break;
				case 'up':
					if (!moveElem.style.top)
					{
						moveElem.style.top = 0;
					}
					
					moveElem.style.top = parseInt(moveElem.style.top) > parseInt(-ah) ? 
						parseFloat(moveElem.style.top) - currentCPS : h;
					break;
				case 'right':
					if (!moveElem.style.left)
					{
						//moveElem.style.left = parseInt(getStyleByElem(moveElem, 'left')) + w;
						moveElem.style.left = 0;
					}
					
					moveElem.style.left = parseInt(moveElem.style.left) < parseInt(w) ? 
						parseFloat(moveElem.style.left) + currentCPS : -aw;
					break;
				case 'down': // not used
					break;
			}
		}

	}
	
	mq.style.position=mqPosition;

}





/**
 * Hold the SmilText Document Style
 * @private
 * @constructor
 * @augments cwi.smilText.Style
 * @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
 */
cwi.smilText.Style = function()
{
	var self = JSINER.extend(this);
	
	/** 
	* Variables
	* @private
	*/
	this.stylingHash = new Hashtable();		// Hold styling attributes
	
	return self;
}

/**
 * Return the value of a stored style attribute.
 * @private
 * @param {string} layout the region id
 * @param {string} attr the attribute name
 * @return {string} val the attribute value
 */
cwi.smilText.Style.prototype.getAttribute = function(layout, attr)
{
	return this.stylingHash.get(layout + attr);
}

/**
 * Save a style attribute of a given layout element.
 * @private
 * @param {string} layout the region id
 * @param {string} attr the attribute name
 * @param {string} val the attribute value
 */
cwi.smilText.Style.prototype.updateAttribute = function(layout, attr, val)
{
	this.stylingHash.put(layout + attr, val);
}

/**
 * Transfer the properties from a given style to a layout.
 * @private
 */
cwi.smilText.Style.prototype.toXML = function(typeLayout, id, style)
{
	var str = "";
	
	switch(typeLayout)
	{
		case 'smiltext':
			this.updateAttribute(id, 'dur', this.getStoredAttribute(style, 'dur'));
			this.updateAttribute(id, 'width', this.getStoredAttribute(style, 'width'));
			this.updateAttribute(id, 'height', this.getStoredAttribute(style, 'height'));
		case 'textstyle':
			this.updateAttribute(id, 'textmode', this.getStoredAttribute(style, 'textmode'));
			this.updateAttribute(id, 'textplace', this.getStoredAttribute(style, 'textplace'));
			this.updateAttribute(id, 'textconceal', this.getStoredAttribute(style, 'textconceal'));
			this.updateAttribute(id, 'textrate', this.getStoredAttribute(style, 'textrate'));
		case 'div':
			this.updateAttribute(id, 'textalign', this.getStoredAttribute(style, 'textalign'));
		case 'p':
			this.updateAttribute(id, 'xml:space', this.getStoredAttribute(style, 'xml:space'));
			this.updateAttribute(id, 'textwrapoption', this.getStoredAttribute(style, 'textwrapoption'));
			this.updateAttribute(id, 'textwritingmode', this.getStoredAttribute(style, 'textwritingmode'));
		case 'span':
			this.updateAttribute(id, 'textbackgroundcolor', this.getStoredAttribute(style, 'textbackgroundcolor'));
			this.updateAttribute(id, 'textcolor', this.getStoredAttribute(style, 'textcolor'));
			this.updateAttribute(id, 'textfontfamily', this.getStoredAttribute(style, 'textfontfamily'));
			this.updateAttribute(id, 'textfontsize', this.getStoredAttribute(style, 'textfontsize'));
			this.updateAttribute(id, 'textfontstyle', this.getStoredAttribute(style, 'textfontstyle'));
			this.updateAttribute(id, 'textfontweight', this.getStoredAttribute(style, 'textfontweight'));
			this.updateAttribute(id, 'textstyle', this.getStoredAttribute(style, 'textstyle'));

			if (typeLayout != 'span' && typeLayout != 'textstyle')
				this.updateAttribute(id, 'textdirection', this.getStoredAttribute(style, 'textdirection'));
	}
	
	return str;
}

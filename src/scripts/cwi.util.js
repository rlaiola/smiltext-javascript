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
 @name cwi.util
 @namespace Hold some general-purpose functions.
 @version 1.0
 @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
*/
Namespace("cwi.util");





/**
 * Trim a given string.
 * @param {string} str string to be trimmed
 * @return {string}
 */
cwi.util.trim = function (str)
{
	var trimmed = str.replace(/^\s+|\s+$/g, '') ;
	return trimmed;
};

/**
 * Get a property value based on the current style.
 * @param {string} id the element id
 * @param {string} styleProp the style property
 * @return {string}
 */
cwi.util.getStyleByElemId = function (el,styleProp)
{
	var x = document.getElementById(el);
	if (x.currentStyle)
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
}

/**
 * Get a property value based on the current style.
 * @param {Object} el the HTML element
 * @param {string} styleProp the style property
 * @return {string}
 */
cwi.util.getStyleByElem = function(el,styleProp)
{
	var x = el;
	if (x.currentStyle)
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
}

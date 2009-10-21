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
 @name cwi.adt
 @namespace Hold abstract data types.
 @version 1.0
 @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
*/
Namespace("cwi.adt");





/**
 * Implementation of Hashtable
 * @constructor
 * @author Uzi Refaeli
 * @see <a href='http://code.google.com/p/magic-table/source/browse/trunk/magic-table/javascript/Hashtable.js?r=37'>reference</a>
*/
cwi.adt.Hashtable = function()
{
	JSINER.extend(this);
	
	//============= Propertiess =================
	this.hash	 	= new Array();
	this.keys		= new Array();
};

/**
 * Store an element related to a given key.
 * @param {string} key key name
 * @param {Object} value the object to be inserted
 */
cwi.adt.Hashtable.prototype.put = function (key, value)
{
	if (value == null)
		return;

	if (this.hash[key] == null)
		this.keys[this.keys.length] = key;

	this.hash[key] = value;
}

/**
 * Return an element related to a given key.
 * @param {string} key key name
 * @return {Object} The object related to the given key
 */
cwi.adt.Hashtable.prototype.get = function (key)
{
	return this.hash[key];
}

/**
 * Remove and return the element given its key.
 * @param {string} key key name
 * @return {Object}
 */
cwi.adt.Hashtable.prototype.remove = function (key) 
{
	var old = null;
	for (var i = 0; i < this.keys.length; i++){
		//did we found our key?
		if (key == this.keys[i]){
			// Store old value
			old = this.hash[this.keys[i]];
			//remove it from the hash
			this.hash[this.keys[i]] = null;
			//and throw away the key...
			this.keys.splice(i ,1);
			break;
		}
	}
	return old;
}

/**
 * Return the number of elements in the Hashtable.
 * @return {integer}
 */
cwi.adt.Hashtable.prototype.getSize = function ()
{
    return this.keys.length;
}

/**
 * Return a string representation of the Hashtable object in the form of a set of entries,
 * enclosed in braces and separated by the ASCII characters " ; " (semicolon and space).
 * Each entry is rendered as the key, an equals sign =, and the associated element,
 * where the toString method is used to convert the key and element to strings.
 * @return {string}
 */
cwi.adt.Hashtable.prototype.toString = function ()
{
	try {
		var s = new Array(this.keys.length);
		s[s.length] = " { ";

		for (var i = 0; i < this.keys.length; i++){
			s[s.length] = this.keys[i];
			s[s.length] = "=";
			var v = this.hash[this.keys[i]];
			if (v)
				s[s.length] = v.toString();
			else
				s[s.length] = "null";

			if (i != this.keys.length-1)
				s[s.length] = " ; ";
		}
	} catch(e) {
		//do nothing here :-)
	} finally{
		s[s.length] = " } ";
	}

	return s.join("");
}




/**
* Node Implementation
* @private
*/
var Node = function(d)
{
	this.data = d;		// Data
	this.prev = null;	// Previous node
	this.next = null;	// Next node
}

/**
 * DoubleLinkedList Implementation
 * @constructor
 * @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
 */
cwi.adt.DoubleLinkedList = function()
{
	JSINER.extend(this);
	
	/**
	* Variables
	* @private
	*/		
	this.firstNode = null;
	this.lastNode  = null;
	this.iterator  = null;
	this.size	   = 0;	
}

/**
* Insert newNode right before node and point iterator to the newNode.
* @private
*/
cwi.adt.DoubleLinkedList.prototype.insertBefore = function(node, newNode)
{
	newNode.prev = node.prev;
	newNode.next = node;
	
	if (node.prev == null)
		this.firstNode = newNode;
	else
		node.prev.next = newNode;
	node.prev = newNode;
	
	this.iterator = newNode;
	this.size++;
}

/**
* Insert newNode right after node and point iterator to the newNode.
* @private
*/
cwi.adt.DoubleLinkedList.prototype.insertAfter = function(node, newNode)
{
	newNode.prev = node;
	newNode.next = node.next;
	if (node.next == null)
	    this.lastNode = newNode;
	else
	    node.next.prev = newNode;
	node.next = newNode;
	
	this.iterator = newNode;
	this.size++;
}

/**
* Insert an object in the beginning of the list and change the iterator to this new element.
* @param {Object} data Element to be inserted
*/
cwi.adt.DoubleLinkedList.prototype.insertBegin = function(data)
{
	var newNode = new Node(data);
	
	if (this.firstNode == null) {
         this.firstNode = newNode;
         this.lastNode = newNode;
         newNode.prev = null;
         newNode.next = null;
         
         this.iterator = newNode;
         this.size++;
	} else {
         this.insertBefore(this.firstNode, newNode);
	}
}

/**
* Insert an object in the end of the list and change the iterator to this new element.
* @param {Object} data Element to be inserted
*/
cwi.adt.DoubleLinkedList.prototype.insertEnd = function(data)
{
	if (this.lastNode == null)
         this.insertBegin(data);
     else {
     	var newNode = new Node(data);
     	this.insertAfter(this.lastNode, newNode);
     }
}

/**
* Insert an object right after the element pointed by the iterator and change 
* the iterator to this new element. If the iterator is undefined, insert the
* object in the end of the list.
* @param {Object} data Element to be inserted
*/
cwi.adt.DoubleLinkedList.prototype.insert = function(data)
{	
	if (this.iterator != null) {
		var newNode = new Node(data);
		this.insertAfter(this.iterator, newNode);
	}
	else if (this.firstNode == null)
		this.insertBegin(data);
	else 
		this.insertEnd(data);
}

/**
* Remove a given node.
* @private
*/
cwi.adt.DoubleLinkedList.prototype.removeNode = function(node)
{
	if (!node)
		return;
		
	if (node.prev == null) {
       this.firstNode = node.next;
       if (node.next != null)
           node.next.prev = null;
	}
	else
	    node.prev.next = node.next;
	
	if (node.next == null) {
	    this.lastNode = node.prev;
	    if (node.prev != null)
	        node.prev.next = null;
	}
	else
	    node.next.prev = node.prev;
	    
	this.iterator = node.next;
	this.size--;
}

/**
* Remove and return the element before pointed by the iterator. Then, the iterator 
* is moved to the next element of the list.
* @return {Object}
*/
cwi.adt.DoubleLinkedList.prototype.remove = function()
{
	var result = null;
	if (this.iterator != null) {
		result = this.iterator.data;
		this.removeNode(this.iterator);
	}
	
	return result;
}

/**
* Point the iterator to the first element.
*/
cwi.adt.DoubleLinkedList.prototype.resetIterator = function()
{
	this.iterator = this.firstNode;
}

/**
* Move the iterator to the previous element.
*/
cwi.adt.DoubleLinkedList.prototype.moveToPrevious = function()
{
	if (this.iterator != null) {
		this.iterator = this.iterator.prev;
	}
}

/**
* Move the iterator to the next element.
*/
cwi.adt.DoubleLinkedList.prototype.moveToNext = function()
{
	if (this.iterator != null) {
		this.iterator = this.iterator.next;
	}
}

/**
* Return true if the iterator points to an element, otherwise, false.
* @return {boolean}
*/
cwi.adt.DoubleLinkedList.prototype.hasNext = function()
{
	return (this.iterator != null);
}

/**
* Return the element pointed by the iterator.
* @return {Object}
*/
cwi.adt.DoubleLinkedList.prototype.getCurrent = function()
{
	if (this.iterator) {
		return this.iterator.data;
	}
	return this.iterator;
}

/**
* Return the size of the list.
* @return {integer}
*/
cwi.adt.DoubleLinkedList.prototype.getSize = function()
{
	return this.size;
}

/**
* Return the string representation of the list.
* @return {string}
*/
cwi.adt.DoubleLinkedList.prototype.toString = function()
{
	var str = " { ";
	var firstTime = true;
	this.resetIterator();
	while(this.hasNext())
	{
		if (firstTime) {
			firstTime = false;
		} else {
			str += " ; "	
		}
		var data = this.getCurrent();
		str += data;
		this.moveToNext();
	}

	return str + " } ";
}

/**
* Add a given list after the current list.
* @param {cwi.adt.DoubleLinkedList} l the list that will be added after the current list
*/
cwi.adt.DoubleLinkedList.prototype.merge = function(l) 
{
	if (this.lastNode == null) {
        this.firstNode = l.firstNode;
		this.lastNode = l.lastNode;
		this.size = l.size;
	}
    else {
    	this.lastNode.next = l.firstNode;
    	if (l.lastNode) {
    		l.firstNode.prev = this.lastNode;
    		this.lastNode = l.lastNode;
    	}
    	this.size += l.size;
    }
}





/* Solve library dependency */ 
Import ("cwi.adt.DoubleLinkedList");

/**
* Elem Implementation
* @private
*/
var Elem = function(w, d)
{
	this.weight = w;	// Elem weight
	this.data = d;		// Data
}

/**
 * PriorityQueue Implementation
 * @constructor
 * @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
 */
cwi.adt.PriorityQueue = function()
{
	JSINER.extend(this);
	
	/** 
	* Variables
	* @private
	*/
	this.list = new DoubleLinkedList();	// List that implements PriorityQueue.	
}

/**
* Insert a given element in the PriorityQueue based on its weight.
* @param {number} w Element weight
* @param {Object} d Element data
*/
cwi.adt.PriorityQueue.prototype.push = function(w, d)
{
	// Try to save time
	if (this.list.getCurrent() == null || this.list.getCurrent().weight > w)
		this.list.resetIterator();
		
	while(this.list.hasNext())
	{
		var n = this.list.getCurrent();
		if (w < n.weight) {
			this.list.moveToPrevious();
			if (this.list.getCurrent() == null) // n is the first
				this.list.insertBegin(new Elem(w, d));
			else this.list.insert(new Elem(w, d));
			return;
		}
		this.list.moveToNext();
	}
	this.list.insertEnd(new Elem(w, d));
}

/**
* Remove and return the first element of the PriorityQueue.
* @return {Object}
*/
cwi.adt.PriorityQueue.prototype.pop = function()
{
	this.list.resetIterator();
	var res = this.list.remove();
	if (res)
		return res.data;
	else res;
}

/**
* Return the weight of the first element and the PriorityQueue keeps unchanged.
* @return {number}
*/
cwi.adt.PriorityQueue.prototype.lookFirst = function()
{
	this.list.resetIterator();
	var result = this.list.getCurrent();
	if (result)
		return result.weight;
	return result;
}

/**
* Remove all elements of the PriorityQueue.
*/
cwi.adt.PriorityQueue.prototype.clear = function()
{
	this.list = new DoubleLinkedList();
}
 
/**
* Return the number of elements of the PriorityQueue.
* @return {integer}
*/
cwi.adt.PriorityQueue.prototype.getSize = function()
{
 	return this.list.getSize();
}
 
/**
* Return true if the PriorityQueue is empty, otherwise, false.
* @return {boolean}
*/
cwi.adt.PriorityQueue.prototype.isEmpty = function()
{
 	return this.list.getSize() == 0;
}

/**
* Return the string representation of the PriorityQueue.
* @return {string}
*/
cwi.adt.PriorityQueue.prototype.toString = function()
{
 	var str = " { ";
	var firstTime = true;
	this.list.resetIterator();
	while(this.list.hasNext())
	{
		if (firstTime) {
			firstTime = false;
		} else {
			str += " ; "	
		}
		var w = this.list.getCurrent().weight;
		var d = this.list.getCurrent().data;
		str += w + ":" + d;
		this.list.moveToNext();
	}

	return str + " } ";
}

/**
* Add a given queue after the current queue.
* @param {cwi.adt.PriorityQueue} q the priority queue that will be added after the current queue
*/
cwi.adt.PriorityQueue.prototype.merge = function(q)
{
	if (this.list.lastNode != null && 
		q.list.firstNode != null &&
		this.list.lastNode.data.weight > q.list.firstNode.data.weight) {
		
		// tough work
		this.list.resetIterator();
		q.list.resetIterator();
		
		while(this.list.hasNext() && q.list.hasNext())
		{
			var c1 = this.list.getCurrent();
			var c2 = q.list.getCurrent();
			
			if (c1.weight <= c2.weight) {
				this.list.moveToNext();
			}
			else {
				if (this.list.firstNode == this.list.iterator) {
					this.list.insertBegin(q.list.remove());
				}
				else {
					this.list.moveToPrevious();
					this.list.insert(q.list.remove());
				}
			}
		}
		
	}
 	
 	return this.list.merge(q.list);
}

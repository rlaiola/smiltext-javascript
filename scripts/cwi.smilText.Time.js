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
 @name cwi.smilText.Time
 @namespace Hold classes and methods related to the smilText time engine.
 @version 1.0
 @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
*/
Namespace("cwi.smilText.Time");





/**
 * Define the Playable interface.
 * @constructor
 * @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
 */
cwi.smilText.Time.Playable = function()
{
	JSINER.extend(this);
	
	/**
	* Variables
	* @private
	*/
	this.timeNow = -1;				// Keep the current time.
	this.state = 0;					// state: 0 (stopped); 1 (playing); 2 (paused)
	this.externalClock = null;		// True whether the time is controlled by an external source. 
									// False, otherwise.
};

/**
* Return the current time (in milliseconds).
* @return {integer}
*/
cwi.smilText.Time.Playable.prototype.getTime = function() {
	return this.timeNow;
}

/**
* Set the current time. The seekTo method will be called whether the new time 
* is before the current time.
* @param {integer} t the new time (in milliseconds).
*/
cwi.smilText.Time.Playable.prototype.setTime = function(t) {
	if (this.isStopped() || this.isPaused())
		return;
		
	if (this.timeNow > t)
		this.seekTo(t);
	
	this.timeNow = t;
}

/**
* Play the Playable Object.
*/
cwi.smilText.Time.Playable.prototype.play = function() 
{
	if (this.externalClock == undefined || this.externalClock == null)
		this.setExternalClock(false);
	
	this.state = 1;
}

/**
* Return true whether the Playable Object is playing. Otherwise, false.
* @return {boolean}
*/
cwi.smilText.Time.Playable.prototype.isPlaying = function() 
{
	return this.state == 1;
}

/**
* Pause the Playable Object.
*/
cwi.smilText.Time.Playable.prototype.pause = function() 
{
	this.state = 2;
}

/**
* Return true whether the Playable Object is paused. Otherwise, false.
* @return {boolean}
*/
cwi.smilText.Time.Playable.prototype.isPaused = function() 
{
	return this.state == 2;
}

/**
* Stop the Playable Object.
*/
cwi.smilText.Time.Playable.prototype.stop = function() 
{
	this.state = 0;
	this.seekTo(0);
}

/**
* Return true whether the Playable Object is stopped. Otherwise, false.
* @return {boolean}
*/
cwi.smilText.Time.Playable.prototype.isStopped = function() 
{
	return this.state == 0;
}

/**
* Perform the seek operation to a given time moment. The current time is also updated.
* @param {integer} t the desired time instant (in milliseconds).
*/
cwi.smilText.Time.Playable.prototype.seekTo = function(t) {
	this.timeNow = t;
}

/**
 * Setup the timing source.
 * @param {string} flag true if an external clock source will be used. In this case,
 * the setTime method must be called by the external clock. Otherwise, false. 
 * And an internal clock will be used.
 */
cwi.smilText.Time.Playable.prototype.setExternalClock = function(flag)
{
	if (this.externalClock == flag)
		return;
	
	this.externalClock = flag;
	
	if (!this.externalClock)
	{
		cwi.smilText.Time.getInstance().register(this);
	} else {
		cwi.smilText.Time.getInstance().unregister(this);
	}
}





/* Solve library dependency */
Import("cwi.adt.DoubleLinkedList");
Import("cwi.smilText.Time.Playable");

/**
 * Hold the smilText time engine instance, which controls the documents' scheduling.
 */
cwi.smilText.Time.instance = new function()
{
	
	/** 
	* Variables
	* @private
	*/
	this.list = new DoubleLinkedList();		// Keep registered documents.
	this.timeInc = 100;						// Time increment.
	
	/**
	* Store a given document.
	* @private
	* @param {cwi.smilText.Time.Playable} doc the playable object to be registered
	* @see cwi.smilText.Time.Playable
	*/
	this.register = function(doc)
	{
		this.list.insertEnd(doc);
	}
	
	/**
	* Remove a given document from the time engine.
	* @private
	* @param {cwi.smilText.Time.Playable} doc the playable object to be unregistered
	* @return {boolean}
	* @see cwi.smilText.Time.Playable
	*/
	this.unregister = function(doc)
	{
		this.list.resetIterator();
		while(this.list.hasNext())
		{
			var d = this.list.getCurrent();
			if (d === doc) {
				this.list.remove();
				return true;
			}
			this.list.moveToNext();
		}
		
		return false;
	}
	
	/**
	 * Update the current time of registered playable objects.
	 * @private
	 */	
	this.updateTime = function()
	{
		this.list.resetIterator();
		while(this.list.hasNext())
		{
			var d = this.list.getCurrent();
			// update time
			d.setTime(d.getTime() + this.timeInc);
			this.list.moveToNext();
		}
		
		setTimeout("cwi.smilText.Time.getInstance().updateTime()", this.timeInc);
	}
	
	/* Make sure the time engine is started */
	this.updateTime();
};

/**
* Register a given playable object to be scheduled by the time engine.
* @param {cwi.smilText.Time.Playable} doc the playable object to be registered
* @see cwi.smilText.Time.Playable
*/
cwi.smilText.Time.register = function(doc) 
{
	cwi.smilText.Time.getInstance().register(doc);
};

/**
* Remove a given playable object from the time engine scheduler.
* @param {cwi.smilText.Time.Playable} doc the playable object to be unregistered
* @return {boolean}
* @see cwi.smilText.Time.Playable
*/
cwi.smilText.Time.unregister = function(doc)
{
	return cwi.smilText.Time.getInstance().unregister(doc);
};

/**
* Get the singleton instance of the time engine.
* @return {cwi.smilText.Time}
*/
cwi.smilText.Time.getInstance = function() {
	return cwi.smilText.Time.instance;
}

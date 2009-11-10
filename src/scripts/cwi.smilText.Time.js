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





/* Solve library dependencies */
Import("cwi.adt.Hashtable");
Import("cwi.adt.DoubleLinkedList");

/**
 * Stand for the play event of a Playable object.
 */
cwi.smilText.Time.EVENT_PLAY = 1;

/**
 * Stand for the pause event of a Playable object.
 */
cwi.smilText.Time.EVENT_PAUSE = 2;

/**
 * Stand for the stop event of a Playable object.
 */
cwi.smilText.Time.EVENT_STOP = 0;

/**
 * Stand for the natural end event of a Playable object.
 */
cwi.smilText.Time.EVENT_END = -1;

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
	this.timeNow = -1;							// Keep the current time.
	this.state = 0;								// state: 0 (stopped); 1 (playing); 2 (paused)
	this.externalClock = null;					// True whether the time is controlled by an external source. 
												// False, otherwise.
	this.eventListeners = new Hashtable();		// Keep event listeners
	
	// Creates a list for each type of event.
	this.eventListeners.put(cwi.smilText.Time.EVENT_STOP, new DoubleLinkedList());
	this.eventListeners.put(cwi.smilText.Time.EVENT_PLAY, new DoubleLinkedList());
	this.eventListeners.put(cwi.smilText.Time.EVENT_PAUSE, new DoubleLinkedList());
	this.eventListeners.put(cwi.smilText.Time.EVENT_END, new DoubleLinkedList());
};

/**
* Add a callback function as a listener of an event. Listeners are notified in the event transition.
* @param {integer} eventType The Playable event type.
* @param {function} callback THe callback function.
* @see cwi.smilText.Time.EVENT_PLAY
* @see cwi.smilText.Time.EVENT_PAUSE
* @see cwi.smilText.Time.EVENT_STOP
* @see cwi.smilText.Time.EVENT_END
*/
cwi.smilText.Time.Playable.prototype.addEventListener = function(eventType, callback) {
	var list = this.eventListeners.get(eventType);
	if (list && callback) {
		this.removeEventListener(eventType, callback);
		list.insertEnd(callback);
	}
}

/**
* Remove a callback function as an event listener.
* @param {integer} eventType The Playable event type.
* @param {function} callback THe callback function.
* @see cwi.smilText.Time.EVENT_PLAY
* @see cwi.smilText.Time.EVENT_PAUSE
* @see cwi.smilText.Time.EVENT_STOP
* @see cwi.smilText.Time.EVENT_END
*/
cwi.smilText.Time.Playable.prototype.removeEventListener = function(eventType, callback) {
	var list = this.eventListeners.get(eventType);
	if (list && callback) {
		list.resetIterator();
		while(list.hasNext()) {
			if (list.getCurrent() == callback) {
				list.remove();
				break;
			}
			list.moveToNext();
		}
	}
}

/**
* Fire an event and notify all associated listeners. 
* @param {integer} eventType The Playable event to be fired.
* @see cwi.smilText.Time.EVENT_PLAY
* @see cwi.smilText.Time.EVENT_PAUSE
* @see cwi.smilText.Time.EVENT_STOP
* @see cwi.smilText.Time.EVENT_END
*/
cwi.smilText.Time.Playable.prototype.fireEvent = function(eventType) {
	switch(eventType) {
		case cwi.smilText.Time.EVENT_PLAY:
			this.play();
			break;
		case cwi.smilText.Time.EVENT_PAUSE:
			this.pause();
			break;
		case cwi.smilText.Time.EVENT_STOP:
			this.stop();
			break;
		case cwi.smilText.Time.EVENT_END:
			if (this.isPlaying()) {
				this.state = cwi.smilText.Time.EVENT_END;
				this.notifyAll(eventType);
				this.notifyAll(cwi.smilText.Time.EVENT_STOP);
				//this.stop();
			}
			break;
	}
}

/**
* Notify all the event listeners of a given event. 
* @private
*/
cwi.smilText.Time.Playable.prototype.notifyAll = function(eventType) {
	var list = this.eventListeners.get(eventType);
	if (list) {
		list.resetIterator();
		while(list.hasNext()) {
			list.getCurrent().apply(this);
			list.moveToNext();
		}
	}
}

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
		
	if (this.state != cwi.smilText.Time.EVENT_PLAY) {
		if (this.state == cwi.smilText.Time.EVENT_STOP ||
			this.state == cwi.smilText.Time.EVENT_END) {
			this.seekTo(0);
		}
		
		this.notifyAll(cwi.smilText.Time.EVENT_PLAY);
	}
	
	this.state = cwi.smilText.Time.EVENT_PLAY;
}

/**
* Return true whether the Playable Object is playing. Otherwise, false.
* @return {boolean}
*/
cwi.smilText.Time.Playable.prototype.isPlaying = function() 
{
	return this.state == cwi.smilText.Time.EVENT_PLAY;
}

/**
* Pause the Playable Object.
*/
cwi.smilText.Time.Playable.prototype.pause = function() 
{
	if (this.state == cwi.smilText.Time.EVENT_PLAY) {
		this.notifyAll(cwi.smilText.Time.EVENT_PAUSE);
		this.state = cwi.smilText.Time.EVENT_PAUSE;
	}
}

/**
* Return true whether the Playable Object is paused. Otherwise, false.
* @return {boolean}
*/
cwi.smilText.Time.Playable.prototype.isPaused = function() 
{
	return this.state == cwi.smilText.Time.EVENT_PAUSE;
}

/**
* Stop the Playable Object.
*/
cwi.smilText.Time.Playable.prototype.stop = function() 
{
	if (this.state != cwi.smilText.Time.EVENT_STOP) {
		this.notifyAll(cwi.smilText.Time.EVENT_STOP);
	}
	
	//if (this.state != cwi.smilText.Time.EVENT_END) {
		this.seekTo(0);
	//}
	this.state = cwi.smilText.Time.EVENT_STOP;
}

/**
* Return true whether the Playable Object is stopped. Otherwise, false.
* @return {boolean}
*/
cwi.smilText.Time.Playable.prototype.isStopped = function() 
{
	return this.state == cwi.smilText.Time.EVENT_STOP;
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

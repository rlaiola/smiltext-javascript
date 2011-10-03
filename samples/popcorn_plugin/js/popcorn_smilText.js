/**
 * Copyright (C) 2003-2012 Stichting CWI,
 * Science Park 123, 1098 XG Amsterdam, The Netherlands.
 */

/**
 @version 2.0
 @author <a href="mailto:rlaiola@cwi.nl">Rodrigo Laiola Guimaraes</a>
 @author <a href="mailto:diogo.pedrosa@cwi.nl">Diogo Pedrosa</a>
*/

//TODO load dependencies: popcorn-complete.js
//
//TODO load jsoner.commons.js
//TODO com.iskitz.ajile.1.2.1.js
//TODO cwi.adt.js
//TODO cwi.util.js
//TODO cwi.smilText.Time.js
//TODO cwi.smilText.js
//
// PLUGIN: smilText

(function (Popcorn) {

  /**
   * smilText popcorn plug-in
   * Adds SMIL 3.0 smilText functionality to Popcorn framework.
   * Options parameter will need the id of the source element
   * (e.g. div) that contains the smilText code, the id of the
   * target element in which the smilText will be rendered (optional), 
   * the start time for the smilText container (optional), and the Porcorn 
   * master element (the one that controls the clock).
   *
   * @param {Object} options
   *
   * Example:

      var pop = Popcorn('#video');

      // add a smilText container starting at 10 seconds
      pop.smilText({
           source: "smilText-source",
           target: "smilText-target",
           start: "10s",
           master: pop // popcorn element
         });
   *
   */
  Popcorn.plugin( "smilText" , {

    manifest: {
      about:{
        name: "Popcorn smilText Plug-in",
        version: "0.1",
        author: "@rlaiola",
        website: "http://code.google.com/p/smiltext-javascript/"
      }
    },
    options:{
        source   : {elem:'input', type:'text', label:'Source'},
        target   : {elem:'input', type:'text', label:'Target'},
        start    : {elem:'input', type:'integer', label:'Start'},
        master   : {elem:'input', type:'object', label:'Popcorn'}
    },
    _setup: function(options) {
      if (options.source && document.getElementById(options.source) && options.master) {
            if (options.target && document.getElementById(options.target)){
                // create smilText render container only if it does not exist
                if (!document.getElementById(options.target + "_tmp")) {
                	options._container = document.createElement( 'div' );
                	options._container.id = options.target + "_tmp";
                	document.getElementById( options.target ) && document.getElementById( options.target ).appendChild( options._container );
                } else {
                	options._container = document.getElementById(options.target + "_tmp");
                }
                
                options._container.style.display = "none";
            } else {
                options._container = document.getElementById(options.source);
                options._container.style.display = "none";
            }
			
			// setup smilText document
            options._doc = cwi.smilText.Parser.parseHTMLElement(document.getElementById(options.source), options._container.id);
            options._doc.setExternalClock(true);
            
            if (!options.start) {
            	// set start and end times related to the master track
            	options.start = 0;
            }
            
            options.end = options.master.duration();
            
            // listen to popcorn timeupdate event;
            options.master.listen("timeupdate", function() {
                if (options.master.currentTime() >= options.start) {
                	options._doc.play();
                	options._container.style.display = "block";
                	options._doc.setTime((options.master.currentTime() - options.start) * 1000);
                } else {
                	options._container.style.display = "none";
                }
            });
            
            options._doc.addEventListener(cwi.smilText.Time.EVENT_END, function () {
            	options._container.style.display = "none";
            });
            options._doc.addEventListener(cwi.smilText.Time.EVENT_PLAY, function () {
            	options._container.style.display = "block";
            });
      } else {
            throw ("you must specify the source and popcorn master");
      }
    },
    /**
     * @member smilText
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function(event, options) {
        
    },
    /**
     * @member smilText
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function(event, options) {
    	  
	},
    _teardown: function( options ) {
    	
    }
  });

})( Popcorn );
The purpose of the smilText JavaScript engine is to provide an implementation of SMIL 3.0 smilText functionality within an HTML browser. This release has been tested with Firefox 3, IE-7, Opera and Safari.

The smilText engine has reasonably complete coverage of the features defined in the [SMIL 3.0 SmilText External Profile](http://www.w3.org/TR/2008/REC-SMIL3-20081201/smil-text-profile.html). The smilText JavaScript engine allows source content to reside within the HTML markup (NB: not supported by all browsers), in a local file or on a server. Access may be via file I/O, via http streaming or via an RTSP server.

The initial code for the project was developed by [Rodrigo Laiola Guimarães](http://www.rodrigolaiola.com) at [CWI](http://www.cwi.nl/en).

# Getting involved #

The HTML integrating the JavaScript engine must define the engine as follows:

```
<html ...>
  <head>
    ...
    <script language="JavaScript" type="text/javascript" src="scripts/cwi.smilText.Time.js"></script>
    <script language="JavaScript" type="text/javascript" src="scripts/cwi.smilText.js"></script>
    ...
  </head>
  <body>
    ...
  <body>
</html>
```

SmilText that is embedded within an HTML file should be placed within `<smilText>` tags, such as:

```
<div id="region01" style="background-color:red;width:500">
  <smilText textColor="green">
    This is an example of content in merry holiday colors.
    <tev begin="2s"></tev>
    This second sentence comes shortly after the first, based on an absolute offset.
    <tev next="3s"></tev>
    This third sentence get rendered three seconds after the previous, based on a relative offset.
    <clear begin="7s"></clear>
    Here we clear the rendering area, seven seconds into the presentation.
    <tev next="3s"></tev>
    Doei!
  </smilText>
</div>
<script>
  var docs = cwi.smilText.Parser.parseHTML();
  docs[0].play();
</script>
```

(Note that this functionality is NOT supported by Internet Explorer, but it is possible in Firefox, Opera and Safari.)

## External smilText format ##

The format of an external `<smilText>` fragment is shown below:

```
<smilText xmlns="http://www.w3.org/ns/SMIL" version="3.0" baseProfile="smilText">
  The is a bit of text.
  <tev begin="3s"/>
  Here, the line is continued after 3 seconds.
  <clear begin="2s"/>
  At 5 seconds into the text, the area is cleared and a new fragment starts.
  <clear begin="3s"/>
</smilText>
```

A smilText object placed in an external file should have its path placed in the HTML source text as follows:

```
<div id="region02">
  <script>
    var doc1 = cwi.smilText.Parser.parseFile('examples/example18.xml', 'region2');
    doc1.play();
  </script>
</div>
```

(Note that this functionality is NOT supported by Safari, but it is possible in Firefox, Opera and IE7+.)

## External smilText samples ##
Ten very techie pages illustrate a host of browser-embedded smilText examples. Note that some pages have many simultaneous smilText fragments active at once. Consider them eye tests for your mind. The samples are:

  1. A set of [simple external smilText file examples](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test1.html), including links to the sources.
  1. A set of [structured external smilText file examples](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test2.html), including links to the sources.
  1. A set of [motion-based embedded smilText file examples](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test3.html), including links to the sources.
  1. A set of browser-specific tests for [Firefox](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test%20firefox.html), [IE-7](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test%20ie.html), [Opera](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test%20opera.html) and [Safari](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test%20safari.html), all including links to the sources.
  1. This [demonstrator](http://smiltext-javascript.googlecode.com/svn/trunk/samples/youtube/index.html) shows how smilText JS can caption a YouTube video (NOT supported by Safari).
  1. This [example](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test%20events.html) shows how event listeners can be associated to the presentation of a smilText document.
  1. This [example](http://smiltext-javascript.googlecode.com/svn/trunk/samples/test%20on%20the%20fly.html) shows how to create smilText documents on the fly.
  1. This [demo](http://smiltext-javascript.googlecode.com/svn/trunk/samples/popcorn_plugin/smilText.html) uses the smilText JavaScript implementation bundled as a Popcorn plug-in.

For more information on composing a timed text file using smilText, see the <a href='http://xmediasmil.net/Chapters/SampleChapter.pdf'>chapter on smilText</a>, taken from the book <a href='http://xmediasmil.net/'>SMIL 3.0: Interactive Multimedia for the Web, Mobile Devices and Daisy Talking Books</a>.

# Documentation #

The [smilText JavaScript API](http://smiltext-javascript.googlecode.com/svn/trunk/docs/1.1/index.html) lets you embed SMIL 3.0 smilText functionalities in your own Web pages with JavaScript. The API provides a number of utilities for adding and manipulating timed text content, allowing you to create interesting applications such as the [Ambulant Captioner](http://www.ambulantplayer.org/smilTextWebApp/).

# Developers #

If you're planning to use smilText JavaScript in a Web-based application, then you'll want to join the [smilText JavaScript Developer Group](http://groups.google.com/group/smiltext-javascript). This is a useful place to ask questions, keep up-to-date on releases, and make suggestions for future versions.
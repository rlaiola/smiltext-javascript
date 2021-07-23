<h1>smiltext-javascript</h1>
<h6>The smilText JavaScript project</h6>
<p>The purpose of the smilText JavaScript engine is to provide an implementation of SMIL 3.0 smilText functionality within an HTML browser. This release has been tested with Firefox 3, IE-7, Opera and Safari.</p>
<p>The smilText engine has reasonably complete coverage of the features defined in the <a href="http://www.w3.org/TR/2008/REC-SMIL3-20081201/smil-text-profile.html">SMIL 3.0 SmilText External Profile</a>. The smilText JavaScript engine allows source content to reside within the HTML markup (NB: not supported by all browsers), in a local file or on a server. Access may be via file I/O, via http streaming or via an RTSP server.</p>
<p>The initial code for the project was developed by <a href="http://www.rodrigolaiola.com">Rodrigo Laiola Guimarães</a> at <a href="http://www.cwi.nl">CWI</a>.

<h3>Getting involved</h3>
<p>The HTML integrating the JavaScript engine must define the engine as follows:</p>
<pre>
&lt;html ...>
  &lt;head&gt;
    ...
    &lt;script language="JavaScript" type="text/javascript" src="scripts/cwi.smilText.Time.js"&gt;&lt;/script&gt;
    &lt;script language="JavaScript" type="text/javascript" src="scripts/cwi.smilText.js"&gt;&lt;/script&gt;
    ...
  &lt;/head&gt;
  &lt;body&gt;
    ...
  &lt;body&gt;
&lt;/html&gt;
</pre>

<p>SmilText that is embedded within an HTML file should be placed within <tt>&lt;smilText&gt;</tt> tags, such as:</p>
<pre>
&lt;div id="region01" style="background-color:red;width:500"&gt;
  &lt;smilText textColor="green"&gt;
    This is an example of content in merry holiday colors.
    &lt;tev begin="2s"&gt;&lt;/tev&gt;
    This second sentence comes shortly after the first, based on an absolute offset.
    &lt;tev next="3s"&gt;&lt;/tev&gt;
    This third sentence get rendered three seconds after the previous, based on a relative offset.
    &lt;clear begin="7s"&gt;&lt;/clear&gt;
    Here we clear the rendering area, seven seconds into the presentation.
    &lt;tev next="3s"&gt;&lt;/tev&gt;
    Doei!
  &lt;/smilText&gt;
&lt;/div&gt;
&lt;script&gt;
  var docs = cwi.smilText.Parser.parseHTML();
  docs[0].play();
&lt;/script&gt;
</pre>

<p>(Note that this functionality is NOT supported by Internet Explorer, but it is possible in Firefox, Opera and Safari.)</p>

<h3>External smilText format</h3>
<p>The format of an external <tt>&lt;smilText&gt;</tt> fragment is shown below:</p>
<pre>
&lt;smilText xmlns="http://www.w3.org/ns/SMIL" version="3.0" baseProfile="smilText"&gt;
  The is a bit of text.
  &lt;tev begin="3s"/&gt;
  Here, the line is continued after 3 seconds.
  &lt;clear begin="2s"/&gt;
  At 5 seconds into the text, the area is cleared and a new fragment starts.
  &lt;clear begin="3s"/&gt;
&lt;/smilText&gt;
</pre>
	
<p>A smilText object placed in an external file should have its path placed in the HTML source text as follows:</p>
<pre>
&lt;div id="region02"&gt;
  &lt;script&gt;
    var doc1 = cwi.smilText.Parser.parseFile('examples/example18.xml', 'region2');
    doc1.play();
  &lt;/script&gt;
&lt;/div&gt;
</pre>

<p>(Note that this functionality is NOT supported by Safari, but it is possible in Firefox, Opera and IE7+.)</p>

<h3>External smilText samples</h3>
<p>Ten very techie pages illustrate a host of browser-embedded smilText examples. Note that some pages have many simultaneous smilText fragments active at once. Consider them eye tests for your mind. The samples are:</p>
<ol>
  <li>A set of <a href="https://rlaiola.github.io/smiltext-javascript/samples/test1.html">simple external smilText file examples</a>, including links to the sources.</li>
  <li>A set of <a href="https://rlaiola.github.io/smiltext-javascript/samples/test2.html">structured external smilText file examples</a>, including links to the sources.</li>
  <li>A set of <a href="https://rlaiola.github.io/smiltext-javascript/samples/test3.html">motion-based embedded smilText file examples</a>, including links to the sources.</li>
  <li>A set of browser-specific tests for <a href="https://rlaiola.github.io/smiltext-javascript/samples/test%20firefox.html">Firefox</a>, <a href="https://rlaiola.github.io/smiltext-javascript/samples/test%20ie.html">IE-7</a>, <a href="https://rlaiola.github.io/smiltext-javascript/samples/test%20opera.html">Opera</a> and <a href="https://rlaiola.github.io/smiltext-javascript/samples/test%20safari.html">Safari</a>, all including links to the sources.</li>
  <li>This <a href="https://rlaiola.github.io/smiltext-javascript/samples/youtube/index.html">demonstrator</a> shows how smilText JS can caption a YouTube video (NOT supported by Safari).</li>
  <li>This <a href="https://rlaiola.github.io/smiltext-javascript/samples/test%20events.html">example</a> shows how event listeners can be associated to the presentation of a smilText document.</li>
  <li>This <a href="https://rlaiola.github.io/smiltext-javascript/samples/test%20on%20the%20fly.html">example</a> shows how to create smilText documents on the fly.</li>
  <li>This <a href="https://rlaiola.github.io/smiltext-javascript/samples/popcorn_plugin/smilText.html">demo</a> uses the smilText JavaScript implementation bundled as a Popcorn plug-in.</li>
</ol>

<p>For more information on composing a timed text file using smilText, see the chapter on smilText, taken from the book <a href="https://dl.acm.org/doi/10.5555/1481029">SMIL 3.0: Interactive Multimedia for the Web, Mobile Devices and Daisy Talking Books</a>.<p>

<h3>Documentation</h3>
<p>The <a href="https://rlaiola.github.io/smiltext-javascript/docs/1.1/index.html">smilText JavaScript API</a> lets you embed SMIL 3.0 smilText functionalities in your own Web pages with JavaScript. The API provides a number of utilities for adding and manipulating timed text content, allowing you to create interesting applications such as the Ambulant Captioner (discontinued).

<h3>Developers</h3>
<p>If you're planning to use smilText JavaScript in a Web-based application, then you'll want to join the <a href="http://groups.google.com/group/smiltext-javascript">smilText JavaScript Developer Group</a>. This is a useful place to ask questions, keep up-to-date on releases, and make suggestions for future versions.</p>

# Description
A jQuery plugin that highlights and attaches a tooltip to each word matching an array of keywords returned from the Alchemy API. Call the function on an DOM element to have it analyze the contents of that element against Alchemy results.

# Usage
```
<!-- Include jQuery first! -->
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>

<!-- This is just the copy / pasted JSON from the Alchemy demo. In a real environment this would be retrieved via an AJAX call -->
<script src="js/gothic-quarter.js"></script>

<!-- My jQuery Plugin -->
<script src="js/tb-tagible.js"></script>

<!-- Plugin initiation -->
<script>
  $(document).ready(function () {
    $('.tour-special').tagify(alchemyResponse, 0.285);
  });
</script>
```
### Usage Notes
**I developed the app locally by just opening `gothic-quarter.html` in the browser. I did not see a need to set up a server or any build processes.**

The `tagify()` function takes 2 arguments:

1. The API response from Alchemy. In a live app, this would be baked into the plugin via an AJAX call.
2. `0.285` is the relevance threshold from the Alchemy API. It basically means 'Don't look at any keywords with a relevance less than 0.285'. This is tailored to the specific results I was working with, so in production we would need a more elegant solution to decide our threshold. Maybe checking Google Maps / Google Places APIs to see if the entity exists.

### Assumptions
I made a few assumptions in my keyword algorithm:
* Longer keywords should override shorter keywords. I assumed longer keywords were more specific, thus should override any other keywords nested within it.  
    * e.g. `Barcelona` is overridden by `Gothic Centre of Barcelona`
* We would not need to track entities below a certain relevance. The correct number here would be determined by a team discussion plus some experimentation.

### Potential Improvements
* This may not work in an Angular single page application. It depends on when the page data is rendered. Ideally, `$(document).ready()` would solve this issue, but Angular does not always play nicely with other libraries. I believe a better solution for Angular would be to create an Angular directive. This directive would have the same logic but would follow 'The Angular Way'. Client's could then require our module and attach the directive to any element. For example, `<div tagify></div>` or even `<body tagify></body>`.
* Because the plugin parses the entire provided elements as a string, it could become very slow if you called `$('body').tagify()` on a very large page. I would need to do some testing to determine the exact performance hit of providing a broad DOM element.
* Keywords in many cases will need context that may not be provided by the Alchemy results. For example, what if one of the keywords was `Gothic Centre` rather than `Gothic Centre of Barcelona`? There may be more than one `Gothic Centre` result in the other APIs you are using to retrieve videos. To solve this I would find the highest relevant city (or cities) in the Alchemy results and pass that city along with `Gothic Centre` to the APIs. I.e. `Gothic Centre Barcelona`.

### Known Issues
* I did not have time to handle the use case where the keyword is on a line break. We would need to tweak the CSS to accomodate for that situation.
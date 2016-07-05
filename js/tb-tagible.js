(function ($) {
  // all matched indices are tracked in this object
  var matches = {};

  var matchCSS = {
    color: 'red',
    borderBottom: '2px dashed red',
    position: 'relative'
  };

  $.fn.tagify = function (alchemyObj, threshold) {
    if (!threshold) threshold = 0.285; // default to 0.285
    var self = this;
    alchemyObj.entities.forEach(function (entity) {
      if (entity.relevance > threshold) {
        _mapMatches($(self).html(), entity);
      }
    });

    var docText = $(this).get(0);
    // Wrap all mapped matches in <span class="alchemy-match"></span>
    docText.innerHTML = _attachSpans(matches, docText.innerHTML);

    _attachTooltips('.alchemy-match');
  };

  // TOOLTIP

  var tooltip = {
    html: '<div class="tooltip">' +
    '<div class="tooltip-item">' +
    '<img class="tooltip-item__img" src="http://placehold.it/100X60">' +
    '<p class="tooltip-item__p">VIDEOS</p>' +
    '</div>' +
    '<div class="tooltip-item">' +
    '<img class="tooltip-item__img" src="http://placehold.it/100X60">' +
    '<p class="tooltip-item__p">PHOTOS</p>' +
    '</div>' +
    '<div class="tooltip-item">' +
    '<img class="tooltip-item__img" src="http://placehold.it/100X60">' +
    '<p class="tooltip-item__p">3D VIEWS</p>' +
    '</div>' +
    '<div style="clear: both;"></div>' +
    '<div class="tooltip-triangle"></div>' +
    '</div>',
    getCSS: function (rightPosition) {
      var posLeft = 0;
      if (rightPosition < 330) {
        posLeft -= (330 - rightPosition);
      }
      return {
        fontFamily: 'sans-serif',
        borderRadius: '2px',
        backgroundColor: 'white',
        boxShadow: '0 0 15px black',
        position: 'absolute',
        fontWeight: 'normal',
        width: '330px',
        top: '-105px',
        left: posLeft,
        right: 0,
        display: 'inline',
        textAlign: 'center',
        zIndex: 100
      }
    },
    getTriangleCSS: function (rightPosition) {
      var posLeft = 20;
      if (rightPosition < 330) {
        posLeft += (330 - rightPosition);
      }

      return {
        width: '0px',
        left: posLeft,
        position: 'absolute',
        height: '0px',
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: '7px solid #fff'
      }
    },
    itemCSS: {
      float: 'left',
      margin: '5px'
    }
  };


  // PRIVATE FUNCTIONS

  function _attachSpans(matches, docHTML) {
    var offset = 0;
    // the amount the original index will change when each span is attached
    var dif = '<span class="alchemy-match"></span>'.length;

    Object.keys(matches).forEach(function (matchIndex) {
      if (matches[matchIndex]) {
        matchIndex = Number(matchIndex);
        var span = '<span class="alchemy-match">' + matches[matchIndex] + '</span>';
        docHTML = docHTML.replaceAt(matchIndex + offset, span, dif);
        offset += dif;
      }
    });

    return docHTML;
  }

  function _attachTooltips(className) {
    $(className).each(function () {
      $(this).css(matchCSS);

      $(this).hover(function () {
        var rightPosition = $(window).width() - ($(this).offset().left + $(this).width());

        // Append HTML to hovered element
        $(this).append(tooltip.html);

        // Apply CSS
        $('.tooltip').css(tooltip.getCSS(rightPosition));
        $('.tooltip-triangle').css(tooltip.getTriangleCSS(rightPosition));
        $('.tooltip-item').css(tooltip.itemCSS);

      }, function () {
        $('.tooltip').remove();
      })
    });
  }

  function _mapMatches(html, entity) {
    var index;
    var searchStr = entity.text;
    var startIndex = 0;
    var searchStrLen = searchStr.length;

    while ((index = html.indexOf(searchStr, startIndex)) > -1) {
      _removeNestedMatches(searchStr);
      matches[index] = searchStr;
      startIndex = index + searchStrLen;
    }
  }

  // if new keyword contains an old keyword,
  // remove the old one in favor of the newer, more specific keyword
  function _removeNestedMatches(keyword) {
    Object.keys(matches).forEach(function (matchIndex) {
      if (keyword.indexOf(matches[matchIndex]) > 0) {
        // set to undefined because `delete` is slow
        matches[matchIndex] = undefined;
        return;
      }
      if (matches[matchIndex]) {
        var nestedKeywordIndex = matches[matchIndex].indexOf(keyword);
        if (nestedKeywordIndex > 0) {
          matches[Number(matchIndex) + nestedKeywordIndex] = undefined;
        }
      }
    })
  }

  String.prototype.replaceAt = function(index, character, dif) {
    return this.substring(0, index) + character + this.substring(index + character.length - dif);
  }

}(jQuery));


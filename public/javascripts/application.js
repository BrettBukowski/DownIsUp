var app = (function() {
	var instance,
	    writeTo,
			startListening = function() {
				var frame = $('html').contentDocument,
				    md = $('markdown'),
						text = "", 
						converted = "";
				frame.open(); frame.writeln("<div id='content'></div>"); frame.close();
				writeTo = frame.getElementById('content'),
				setInterval(function(){
					text = md.value;
					if(text !== converted) {
						new Ajax.Request("/convert/all", {
							method: 'post',
							parameters: {text: text},
							onSuccess: function(transport) {
								converted = text;
								writeTo.innerHTML = transport.responseText;
							}
						});
					}
				}, 300);
			},
			handleTabs = function() {
				$('markdown').observe('keydown', function(evt) {
					var tab = "  ",
					    tabSize = tab.length,
				  		target = evt.target,
				    	selectStart = target.selectionStart,
				    	selectEnd = target.selectionEnd,
				    	keyCode = evt.keyCode;
			    if (keyCode === Event.KEY_TAB) {
						Event.stop(evt);
		        // multi line selection
		        if (selectStart !== selectEnd && target.value.slice(selectStart, selectEnd).indexOf("\n") !== -1) {
		           // In case selection was not of entire lines (e.g. selection begins in the middle of a line)
		           // tab at the beginning as well as at the start of every following line.
		          var pre = target.value.slice(0, selectStart),
		              sel = target.value.slice(selectStart, selectEnd).replace(/\n/g,"\n" + tab),
		           		post = target.value.slice(selectEnd, target.value.length);
		          target.value = pre.concat(tab).concat(sel).concat(post);
		          target.selectionStart = selectStart + tabSize;
		          target.selectionEnd = selectEnd + tabSize;
		        }
		        // normal case
		        else {
		           target.value = target.value.slice(0, selectStart).concat(tab).concat(target.value.slice(selectStart, target.value.length));
		           if (selectStart === selectEnd) {
		               target.selectionStart = target.selectionEnd = selectStart + tabSize;
		           }
		           else {
		               target.selectionStart = selectStart + tabSize;
		               target.selectionEnd = selectEnd + tabSize;
		           }
		        }
			    }
				  // Backspace key - delete preceding tab expansion, if exists
				  else if (keyCode === Event.KEY_BACKSPACE && target.value.slice(selectStart - tabSize,selectStart) === tab) {
						Event.stop(evt);
		        target.value = target.value.slice(0, selectStart - tabSize).concat(target.value.slice(selectStart, target.value.length));
		        target.selectionStart = target.selectionEnd = selectStart - tabSize;
			    }
			    // Delete key - delete following tab expansion, if exists
			    else if (keyCode === Event.KEY_DELETE && target.value.slice(selectEnd, selectEnd + tabSize) === tab) {
						Event.stop(evt);
		        target.value = target.value.slice(0,selectStart).concat(target.value.slice(selectStart + tabSize, target.value.length));
		        target.selectionStart = target.selectionEnd = selectStart;
			    }
			    // Left/right arrow keys - move across the tab
			    else if (keyCode == Event.KEY_LEFT && target.value.slice(selectStart - tabSize, selectStart) === tab) {
						Event.stop(evt);
		        target.selectionStart = target.selectionEnd = selectStart - tabSize;
			    }
			    else if (keyCode == Event.KEY_RIGHT && target.value.slice(selectStart, selectStart + tabSize) === tab) {
						Event.stop(evt);
		        target.selectionStart = target.selectionEnd = selectStart + tabSize;
			    }
				});
			},
			initClickToCopy = function() {
				var async = document.createElement('script');
				async.type = 'text/javascript';
				async.async = true;
				async.src = '/javascripts/zeroclipboard/ZeroClipboard.js';
				async.onload = function(){
					ZeroClipboard.setMoviePath('/javascripts/zeroclipboard/ZeroClipboard10.swf');
					var clip = new ZeroClipboard.Client();
					clip.addEventListener('mousedown', function() {
						clip.setText(writeTo.innerHTML);
					});
					clip.addEventListener('complete', function(client, text) {
						if(text) {
							alert("Yeah! Copied!");
						}
					});
					clip.glue('copy');
				};
				document.body.appendChild(async);
        $('html').observe('mouseover', function() {
          new Effect.Opacity('copy', {from: 0, to: 1, duration: .5});
        }).observe('mouseout', function() {
          new Effect.Opacity('copy', {from: 1, to: 0, duration: .5});
        });
			},
			showLabels = function() {
				if('localStorage' in window){
					if(!localStorage["explained"]) {
						var mdLabel = $('markdownLabel');
						mdLabel.toggle();
						mdLabel.removeClassName('hide');
						mdLabel.appear({duration: 2});
						var htmlLabel = $('htmlLabel');
						htmlLabel.toggle();
						htmlLabel.removeClassName('hide');
						htmlLabel.appear({duration: 2});
						$('markdown').observe('click', function() {
							mdLabel.fade({duration: 2.0});
							htmlLabel.fade({duration: 2.0});
						});
						localStorage["explained"] = "true";
					}
				}
			},
			handleHTMLPanelExpansion = function() {
			  $('html').observe('mouseover', function() {
          new Effect.Opacity('expand', {from: 0, to: 1, duration: .5});
        }).observe('mouseout', function() {
          new Effect.Opacity('expand', {from: 1, to: 0, duration: .5});
        });
        var expanded = false, dialog, dialogCap, content,
            toggleDialog = function() {
              expanded = !expanded;
              if(!dialog) {
                dialog = $(document.createElement("div")).addClassName("dialog").setStyle({
                  height: document.body.offsetHeight + "px"
                });
                content = $(document.createElement("div")).addClassName("content");
                dialogCap = $(document.createElement("div")).addClassName("dialogCap");
                var close = $(document.createElement("a").addClassName("close")).observe("click", function(e) {
                  Event.stop(e);
                  toggleDialog();
                });
                close.innerHTML = "close";
                close.href = "#";
                dialog.style.display = "none";
                dialogCap.appendChild(close);
                dialog.appendChild(dialogCap);
                dialog.appendChild(content);
                document.body.insertBefore(dialog, document.body.firstChild);
              }
              if(expanded) {
                var iframe = document.createElement('iframe');
                content.innerHTML = "";
                content.appendChild(iframe);
                iframe = iframe.contentDocument;
                iframe.open(); iframe.writeln(writeTo.innerHTML); iframe.close();
                dialog.appear({duration: .5});
              }
              else {
                dialog.fade({duration: .5});
              }
          };
        $('expand').observe('click', toggleDialog);
			};
	function constructor() {
		startListening();
		handleTabs();
		initClickToCopy();
		showLabels();
		handleHTMLPanelExpansion();
	}
	return function() {
		if(instance === undefined) {
			instance = new constructor();
		}
		return instance;
	};
})();
document.observe("dom:loaded", app);
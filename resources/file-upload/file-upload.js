
(function () {
	
	// import library
	eval( JELLY.unpack() );

	addDomReady( function () {
	
		
		// Create a reusable tweening object
		var tween = new Tween,
	
			// event handlers, including blur/focus to 
			// restore keyboard navigation
			onUploadChange = function ( e ) {

				var status = retrieveData( this, 'upload-status' );
				var existingStatus = Q("#"+this.id+'_status' );
				if (existingStatus.length>0) {
					var value = (this.value.indexOf("fakepath") != -1)? this.value.split('\\').pop() : this.value;
					existingStatus.each( function ( field ) {
						if (value!='') field.innerHTML = value;
					}
					);
				} else
				if ( this.value ) {
					// IE shows the whole system path, we're reducing it 
					// to the filename for consistency
					var value = (this.value.indexOf("fakepath") != -1)? this.value.split('\\').pop() : this.value;
					status.innerHTML = value;
					insertAfter( status, this.parentNode );
					
					// Only tween if we're responding to an event
					if ( e ) { 
						tween.setElement( status ).
							setOpacity( 0 ).
							start({ 
								opacity: 1, duration: 500 
							});
					}
				}
				else if ( status && status.parentNode ) {
					removeElement( status );
				}
			}, 
			onUploadFocus = function () { 
				addClass( this.parentNode, 'focus' ); 
			},
			onUploadBlur = function () { 
				removeClass( this.parentNode, 'focus' ); 
			};
		
		
		Q( '.file-upload input[type=file]' ).each( function ( field ) {
			
			// Create a status element, and store it
			storeData( field, 'upload-status', createElement( 'span.file-upload-status' ) );
			
			// Bind events
			addEvent( field, 'focus', onUploadFocus );
			addEvent( field, 'blur', onUploadBlur );
			addEvent( field, 'change', onUploadChange );
			
			// Set current state 
			onUploadChange.call( field );
			
			// Move the file input in Firefox / Opera so that the button part is
			// in the hit area. Otherwise we get a text selection cursor
			// which you cannot override with CSS
			if ( browser.firefox || browser.opera ) {
				field.style.left = '-800px';
			}
			else if ( browser.ie ) {
				// Minimizes the text input part in IE
				field.style.width = '0';
			}
		});
	});

})();
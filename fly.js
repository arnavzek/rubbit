

	

	function setup(element,off,routing){
		if (typeof element == 'string') element = document.querySelector(element)
		window._C = element
		window.active_page = element.children[0]
		window.prv = {s:1,x:0,y:0}
		window.config = {duration:0.5}
		window.off = off
		window.routing = routing
		window.translate = null

		_C.addEventListener('mousedown', lock, false);
		_C.addEventListener('touchstart', lock, false);
		_C.addEventListener('mousemove', drag, false);
		_C.addEventListener('mouseup', move, false);
		_C.addEventListener('touchend', move, false);
	}

	

	function open(newPath){


		//budge fix
		if (off && location.pathname.split('/').length <= 2){
			newPath = location.pathname.split('/')[off]+'/'+newPath
		}

		console.log(newPath)

		history.pushState({},"",newPath);
		onpushstate()
	}

	var onpushstate = function(){
	    	var urlPages = document.location.href.split("/")
	    	var page = urlPages[urlPages.length-1]
	        deck( '#'+page )
	        console.log( page )
	        document.title = page;
	}
	window.onpopstate = onpushstate



	//instantiate navigation bar in top level top, so that it will be uneffected by the chnages to interface




	function slide(command,element,steps){
		
		if(!element) element = active_page
		
		var des = element.parentElement.children[0]

		switch(command.toLowerCase()) {
		  case 'next':
		    if(element.nextElementSibling) des = element.nextElementSibling

		    break;
		  case 'previous':
		    if (element.previousElementSibling) des = element.previousElementSibling
		    break;
		  case 'jump':
		    des = element
		    break;
		  default:
		  	console.log('no changes')
		}

		if (!routing) return deck(des)

		open( des.getAttribute('id') )

	}
	


	function scroll(element){
		
		//
		var par = element.parentElement
		var dir = par.getAttribute('scroll')
		var offset = par.getAttribute('offset')

		par.style['transition-duration'] = config.duration+'s'
		par.style['transition-timing-function'] = 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'

		par.style['transform'] = 'translate'+dir.toUpperCase()+'('+element.getBoundingClientRect()[dir.toLowerCase()]+')'
	}

	//deck will transform globally
	function deck(element){

		//offset for navigation bar
		if (typeof element == 'string'){
			if (element.trim() == '#'){
				element = _C.children[0]
			}else{
				element = document.querySelector(element)
			}
		}

		if (!element){
			element = _C.children[0]
			console.log(element,'undefined element')
		} 

		if (element[0]) element = element[0]

		active_page = element

		// if (active_page.parentElement.getAttribute('type') == 'independent') live_parent = active_page.parentElement

		_C.style['transition-duration'] = config.duration+'s'
		_C.style['transition-timing-function'] = 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
		zoomin()
		
		function zoomin(){
			var destination = element.getBoundingClientRect()

			var s = window.innerWidth/destination.width;
			var x = -destination.x
			var y = -destination.y

			prv.s = prv.s*s
			prv.x = prv.x+x
			prv.y = prv.y+y

			_C.style['transform-origin'] = 0+'px '+0+'px';
			_C.style.transform = ' scale('+prv.s+') translateX('+prv.x+'px)  translateY('+prv.y+'px)';
			console.log(prv.s,prv.x,prv.y)
		}
	}

	let swipeMovement = {x:null,y:null};
	let direction = {d:null,sign:null,value:null}

	function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };
	function lock(e) {
		// _C.style['transition-duration'] = 'unset';
	 	swipeMovement.x = unify(e).clientX 
	 	swipeMovement.y = unify(e).clientY
		direction = {d:null,sign:null,value:null}


	};

	// active_page null bug

	function getSwipeDirection(e){
		let dx = unify(e).clientX - swipeMovement.x, dy = unify(e).clientY - swipeMovement.y ;

		console.log(unify(e).clientX,swipeMovement.x,dx,dy)
		// if (!direction.d){

		// }


		//because change x and y can be positive and negative we cant calculate which is which based on direct comparison because if chnage in x is negative that doesn't mean the change happend on y direction

	    direction = {value:dx, d:'x'}
	    if ( (dx*dx) < (dy*dy) ) direction = {value:dy, d:'y'}

	    var s = Math.sign(direction.value)
		direction.sign = s

	}

	//track direction globally

	function move(e) {
	  if(swipeMovement.x == null || swipeMovement.y == null) return
	  	swipeMovement = {x:null,y:null}  

	  	console.log('slide',direction)
	  	if (direction.d === null || direction.value === 0) return
	    
	  	//to do scroll
		// if ( direction.d == active_page.getAttribute('scroll') ){
		// 	var scroll_along = 'height'
		// 	if (direction.d == 'y') scroll_along = 'width'
		// 	var close_index = active_page.getBoundingClientRect()[direction.d]/active_page.children[0].getBoundingClientRect()[scroll_along]
		// 	scroll(active_page.children[ Math.round(close_index) ])
		// }else{
			direction.sign == -1? slide('next'):slide('previous')
		// }



		
	};

	//lock to a first direction
	function drag(e){
		if(swipeMovement.x == null || swipeMovement.y == null) return


		e.preventDefault()
		window.direction = getSwipeDirection(e)


		var style = window.getComputedStyle(_C);
  		var matrix = new WebKitCSSMatrix(style.webkitTransform);
  		var translate = {x:matrix['m41'],y:matrix['m42'],scale:matrix['d']}

  		//why is direction sign 0 and why does

  		var liveOffsetX = direction.value
  		var liveOffsetY = direction.value
  		direction.d == 'x'? liveOffsetY = 0: liveOffsetX = 0;

  		
  		liveOffsetY = 0

  		// _C.style.transition = 'none'
  		var liveAttribute = `scale(${translate.scale}) translateX(${translate.x+liveOffsetX}px) translateY(${translate.y+liveOffsetY}px)`
  		// console.log(direction)
  		_C.style.transform = liveAttribute
  		


  		swipeMovement.x = unify(e).clientX 
	 	swipeMovement.y = unify(e).clientY
		
	}





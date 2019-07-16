	function dynamicGridArea(numberOfRows,numberOfColums,sentences){

	  numberOfColums = Math.round(numberOfColums)
	  numberOfRows = Math.round(numberOfRows)

	  if(numberOfRows === 0) numberOfRows = 300 
	  if(numberOfColums === 0) numberOfColums = 300 

	  var verticalSenten = {} 
	  var virtualGrid = newMatrix(numberOfRows,numberOfColums,'.')
	  function newMatrix(m,n,efault){

	    var mat = []

	    for(let mx = 0; mx<m; mx++){

	      var column = []
	      for(let nx = 0; nx<n; nx++){
	        column.push(efault)
	      }

	      mat.push(column)
	    }

	    return mat

	  }
	  function findSeat(column,position){

	    var fromnTo = [position,0]
	    for(let i = position; i<=column.length; i++){

	      fromnTo[1] = i

	      if(column[i] !== '.')break
	    }

	    return fromnTo

	  }
	  function UpdateMatrix(matrix,type,pos,length,value){
	    if(type === 'vertical'){

	      for(let steps = 0; steps<length; steps++){
	        var q= pos[0]+steps
	        // console.log(q,matrix.length )
	        if(matrix.length > q) matrix[ pos[0]+steps ][pos[1]] = value
	        
	      }

	    }else{//if horizontal
	      for(let steps = 0; steps<length; steps++){
	        matrix[ pos[0] ][pos[1]+steps] = value
	      }
	    }
	  }



	  var SentencePosition = 0
	  var virtualGridPosition = [0,0]

	  for(let index of sentences){

	  //on an average two letters take one block
	  var sentenceLength = sentences[SentencePosition].length/2
	  var wordsPossibleRange = findSeat(virtualGrid[virtualGridPosition[0]],virtualGridPosition[1])
	  var lengthOfWPR = wordsPossibleRange[1] - wordsPossibleRange[0]

	  if(sentenceLength <= lengthOfWPR){
	    UpdateMatrix(virtualGrid,'horizontal',virtualGridPosition,sentenceLength,'S-'+SentencePosition)
	    //horizontal fill
	    incrementMatrix(virtualGrid, virtualGridPosition,sentenceLength)
	  }else{
	    verticalSenten['S-'+SentencePosition] = 'vertical'
	    UpdateMatrix(virtualGrid,'vertical',virtualGridPosition,sentenceLength,'S-'+SentencePosition)
	    //vertical fill
	    incrementMatrix(virtualGrid, virtualGridPosition,1)

	  }

	  //what if the new position is already filled

	  function incrementMatrix(matTobeWalked, pos,steps){

	    for(let s = 0;s<steps;s++){
	      if( matTobeWalked[pos[0]][pos[1] +1 ] ){
	        pos[1] += 1
	      }else{
	        
	      if(matTobeWalked.length >  pos[0]+1 ){
	        pos[0] += 1
	        pos[1] = 0
	      } 
	      //bounce if not dot
	      }

	      if(s === steps-1){
	        if(matTobeWalked[pos[0]][pos[1]] !== '.') incrementMatrix(matTobeWalked, pos,1)
	      }
	      //not for the already added value
	      // 
	    }
	  }

	  SentencePosition++
	  }

	  var cssAreaValue = ''

	  for (let index of virtualGrid){
	    
	    var rowD = ''

	    for(let coumex of index){
	      rowD += coumex+' '
	    }

	    cssAreaValue += "\'"+rowD+'\' '
	    
	  }

	  return {css:cssAreaValue,matrix:virtualGrid,verticals:verticalSenten}
	}

	function SetupCross(arSentences,template,container,fontSize){

	  
	  var gridSizeY = document.getElementById(container).offsetHeight
	  var gridSizeX = document.getElementById(container).offsetWidth
	  document.getElementById(container).style['display'] = 'grid'


	  var numberOfRows = gridSizeY/fontSize
	  var numberOfColums = gridSizeX/fontSize

	  console.log(numberOfRows,numberOfColums)
	  var newAreaCss = dynamicGridArea(numberOfRows,numberOfColums,arSentences)
	  document.getElementById(container).style['grid-template-areas'] = newAreaCss.css

	  // let temp = document.getElementsByTagName("template")[0]
	  let item = template.content.querySelector("div")


	  //templates don't get passed

	  for (let i = 0; i < arSentences.length; i++) {

	  	// console.log(item,'te',template)
	    let a = document.importNode(item, true);
	    a.textContent += arSentences[i];
	    a.id = 'S-'+i
	    document.getElementById(container).appendChild(a);
	    document.getElementById('S-'+i).style['grid-area'] = 'S-'+i
	    if(newAreaCss.verticals['S-'+i]) document.getElementById('S-'+i).style['writing-mode'] = 'vertical-rl'
	  }
	}
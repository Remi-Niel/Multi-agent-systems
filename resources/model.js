	// var startDates=[
	// 	['Apr','16','2000'],
	// 	['Mar','15','2000'],
	// 	['Apr','15','2000'],
	// 	['Apr','16','2001'],
	// 	['Mar','15','2001'],
	// 	['May','16','2001'],
	// 	['Apr','14','1999'],
	// 	['Mar','14','2000'],
	// 	['Apr','14','2001'],
	// 	['May','14','2001'],
	// 	['May','17','2002'],
	// 	['Feb','19','2000'],
	// 	['Feb','15','2001'],
	// 	['Feb','17','2002']
	// ]
	var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];	
	var steps={}
	var path=[];
	var s=[];
	var knows=[];

	var idx=0;

	var dates=[]
	var edges =[]

		// create an array with nodes
	var currentNodes = new vis.DataSet(dates);

	  // create an array with edges
	var currentEdges = new vis.DataSet(edges);

	var current = {
		nodes: currentNodes,
		edges: currentEdges
	};

	  // create a network
	var container = document.getElementById('mynetwork');
	var options = {
	  "edges": {
	    "smooth": {
	      "forceDirection": "none"
	    }
	  },
	  "physics": {
        forceAtlas2Based: {
            gravitationalConstant: -30,
            centralGravity: 0.005,
            springLength: 100,
            springConstant: 0.1
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: {iterations: 150}
	  }
	}
	var network = new vis.Network(container, current, options);

	function initialize(startDates){	
		steps={}
		path=determinePath(startDates,0);
		
		for (var key in steps){
		  if(key>=path.length-1){
			  delete steps[key];
		  }
		}

		s=genStory(steps);

		idx=0;


		console.log(path)
		console.log(steps)
		console.log(story);

		changeTo(idx);
	}

	function initDefault(){
		var startDates=[
			['Apr','16','2000'],
			['Mar','15','2000'],
			['Apr','15','2000'],
			['Apr','16','2001'],
			['Mar','15','2001'],
			['May','16','2001'],
			['Apr','14','1999'],
			['Mar','14','2000'],
			['Apr','14','2001'],
			['May','14','2001'],
			['May','17','2002'],
			['Feb','19','2000'],
			['Feb','15','2001'],
			['Feb','17','2002']
		]

		var dates_ = document.getElementById("dates_");
		dates_.innerHTML="";		

		for(date of startDates){
			var p = document.createElement("li");
			p.className = 'active';
			p.id = date;
			var node = document.createTextNode(date[0]+" "+date[1]+" "+date[2]);
			p.appendChild(node);
			dates_.appendChild(p);
		}

	}

	function resetList(){
		var dates_ = document.getElementById("dates_");
		dates_.innerHTML="";	
	}

	function checkUniqueDay(dates, date){
		if (dates.filter(x => x[1]===date[1]).length===1){
			return true;
		}
		else {
			return false;
		}
	}

	function checkUniqueMonth(dates, date){
		if (dates.filter(x => x[0]===date[0]).length===1){
			return true;
		}
		else {
			return false;
		}
	}

	function checkUniqueYear(dates, date){
		if (dates.filter(x => x[2]===date[2]).length===1){
			return true;
		}
		else {
			return false;
		}
	}

	function checkPossibleReduction(dates,date, i){
		if(date[i]!=dates[0][i]){
			return true;
		}
		else {
			return false;
		}
	}

	function reduceModel(unique_dates, dates, i){
		prel=dates.length;
		for (date of unique_dates){
			dates = dates.filter(x => x[i]!=date[i]);
		}

		if(prel===dates.length){
			x=[];
			return [];
		}
		return dates;
	}

	function setText(idx) {
		var dates=path[idx];
		document.getElementById("dates_").innerHTML = "";
		var arrayLength = dates.length;
		for(var i = 0; i < arrayLength; i++){
			var p = document.createElement("li");
			p.className = 'active';
			var node = document.createTextNode(dates[i][0]+" "+dates[i][1]+" "+dates[i][2]);
			p.appendChild(node);
			var element = document.getElementById("dates_");
			element.appendChild(p);
		}

	}

	function removeNode(i) {
        currentNodes.remove({id:i});
    }
	
	function removeEdge(i) {
        currentEdges.remove({id:i});
    }
	
	function addNode(data) {
        currentNodes.add(data);
    }
	function addEdge(data) {
        currentEdges.add(data);
    }
	
	function containsObject(obj, list) {
		var x;
		for (x in list) {
			if (list[x] == obj) {
				return true;
			}
		}

		return false;
	}

	function getMonth(month){
		switch(month) {
		    case 'Jan':
		        return 1;
		        break;
		    case 'Feb':
		        return 2;
		        break;
		    case 'Mar':
		        return 3;
		        break;
		    case 'Apr':
		        return 4;
		        break;
		    case 'May':
		        return 5;
		        break;
		    case 'Jun':
		        return 6;
		        break;
		    case 'Jul':
		        return 7;
		        break;
		    case 'Aug':
		        return 8;
		        break;
		    case 'Sep':
		        return 9;
		        break;
		    case 'Oct':
		        return 10;
		        break;
		    case 'Nov':
		        return 11;
		        break;
		    case 'Dec':
		        return 12;
		        break;
		}
	}



	function add_date() {
		var dates_ = document.getElementById("dates_");
		var x = document.getElementById("date_input");
		var dates_list = dates_.getElementsByTagName("li");

		identity_unique = true;
		for (var i=0; i < dates_list.length; i++) {
			if (dates_list[i].id == x.value){
				identity_unique = false;
				break;
			}
		}

		if (identity_unique){
			var p = document.createElement("li");
			p.className = 'active';
			p.id = x.value;
			var d=new Date(p.id);
			var node = document.createTextNode(months[d.getMonth()]+" "+String(d.getDate())+" "+String(d.getFullYear()));
			p.appendChild(node);
			dates_.appendChild(p);
		}
	}

	function submit() {

		var dates_ = document.getElementById("dates_");
		var dates_list = dates_.getElementsByTagName("li");
		if(dates_list.length==0){
			return;
		}

		dates = []
		for (var i=0; i < dates_list.length; i++) {
			var d = new Date(dates_list[i].id)
			dates.push([months[d.getMonth()],String(d.getDate()),String(d.getFullYear())])
		}

		var x = document.getElementById("submit_dates");
		x.style.display = "none"

		var y = document.getElementById("story_steps");
		y.style.display = "block"

		if(dates_list.length===1){
			dates=[dates];
		}

		initialize(dates)
	}


	function genStory(listSteps){
		var info=["month","day","year"]
		var names=["Albert","Bernard","Cheryl"]
		story=["Charlie tells Albert the month, Bernard the day and Cheryl the month. All the world are still considered at this point, but not everyone considers every world."]

		for(var key in listSteps){
			s=listSteps[key];
			switch(s[0]){
				case -2:
					story.push(names[s[1]]+" says: 'I know the date', since there is only one date with a unique "+info[s[1]]+" everyone now knows the answer.")
					break;
				case -1:
					story.push(names[s[1]]+" says: 'I know the date', so the correct date must be one with a unique "+info[s[1]]+" hence everyone discards the dates without a unique "+info[s[1]]+".")
					break;
				case s[1]:
					story.push(names[s[1]]+" says: 'I don't know the date', since he doesn't know the date all dates with unique "+[info[s[0]]]+"s can't be the correct date hence everyone discards those from the possible dates.")
					break;
				default: 
					story.push(names[s[1]]+" says: '"+names[s[0]]+" does not know the date', since "+names[s[0]]+" does not know the answer all dates with a unique "+info[s[0]]+" can be discarded, also since "+names[s[1]]+" knows that "+names[s[0]]+" does not know the answer it follows that he knows that every date with a unique "+info[s[0]]+" is false, hence all "+info[s[1]]+"s which occur in a date with a unique "+info[s[0]]+" are also false and dates with these "+info[s[1]]+"s can be removed from the list of possible dates.")
			}
		}
		return story;
	}

	function hash(str){
		var hash = 0;
			if (str.length == 0) return hash;
			for (i = 0; i < str.length; i++) {
				char = str.charCodeAt(i);
				hash = ((hash<<5)-hash)+char;
				hash = hash & hash; // Convert to 32bit integer
			}
		return hash;
	}

	function getEdges(dates,Apossible,Bpossible,Cpossible){
		
		edges=[]
		var i=0;

		for(var i1 in dates){
			for(var i2 in dates){
				d1=(dates[i1]);
				d2=(dates[i2]);


				i=d1.id+100000000*d2.id


				if(d1.id === d2.id){
					edges.push({id: i, from: d1.id, to: d2.id ,arrows:'to'})
				}else if(d1.id < d2.id){

					l=""
					if(d1.month===d2.month && ((Apossible.includes(d1.id)&&Apossible.includes(d2.id))||(!Apossible.includes(d1.id)&&!Apossible.includes(d2.id)))){
						l=l+"A";
					}
					if(d1.day===d2.day && ((Bpossible.includes(d1.id)&&Bpossible.includes(d2.id))||(!Bpossible.includes(d1.id)&&!Bpossible.includes(d2.id)))){
						l=l+"B";
					}	
					if(d1.year===d2.year && ((Cpossible.includes(d1.id)&&Cpossible.includes(d2.id))||(!Cpossible.includes(d1.id)&&!Cpossible.includes(d2.id)))){
						l=l+"C";
					}	

					if(l!==""){
						if(d1.color === 'red'){
							edges.push({id: i, from: d2.id, to: d1.id ,label: l});
						}else{
							edges.push({id: i, from: d1.id, to: d2.id ,label: l});
						}
					}
				}
			}
		}
		return edges;
	}
	
	function setKnowledge(Apossible,Bpossible,Cpossible){
		var knowledge_ = document.getElementById("knowledge_");
		knowledge_.innerHTML="";
		console.log(Bpossible)
		
		var p = document.createElement("li");
		p.className = 'active';
		p.id = "Albert";
		if(Apossible.length===1){
			var node = document.createTextNode("Albert knows the date");
		}else{
			var node = document.createTextNode("Albert does not know the date");
		}
		p.appendChild(node);
		knowledge_.appendChild(p);
		
		var p = document.createElement("li");
		p.className = 'active';
		p.id = "Bernard";
		if(Bpossible.length===1){
			var node = document.createTextNode("Bernard knows the date");
		}else{
			var node = document.createTextNode("Bernard does not know the date");
		}
		p.appendChild(node);
		knowledge_.appendChild(p);
		
		var p = document.createElement("li");
		p.className = 'active';
		p.id = "Cheryl";
		if(Cpossible.length===1){
			var node = document.createTextNode("Cheryl knows the date");
		}else{
			var node = document.createTextNode("Cheryl does not know the date");
		}
		p.appendChild(node);
		knowledge_.appendChild(p);
		
	}
	
	function changeTo(idx) {

		nextNodes=[];
		nextEdges=[];
		document.getElementById("story").innerHTML = s[idx];

		setText(idx);

		next=path[idx];
		i=0;
		for(date of next){
			month=getMonth(date[0]);
			day=parseInt(date[1]);
			year=parseInt(date[2]);
			id=day+100*month+10000*year;
			label=date[0]+" "+date[1]+" "+date[2];
			if(i===0){
				nextNodes.push({id:id,label:label,month:month,day:day,year:year,color:'green'})
				i++;
			}else{
				nextNodes.push({id:id,label:label,month:month,day:day,year:year})
			}
		}

		var A=nextNodes[0].month;
		var Apossible=[];

		var B=nextNodes[0].day;
		var Bpossible=[];

		var C=nextNodes[0].year;
		var Cpossible=[];
		

		for(var i in next){
			d=nextNodes[i];
			var flag=true;
			if(d.month === A){
				Apossible.push(d.id);
				flag=false;
			}
			if(d.day === B){
				Bpossible.push(d.id);
				flag=false;
			}
			if(d.year === C){
				Cpossible.push(d.id);
				flag=false;
			}
			if(flag){	
				nextNodes[i].color='red';
			}
		} 
		
		setKnowledge(Apossible,Bpossible,Cpossible);

		nextEdges=getEdges(nextNodes,Apossible,Bpossible,Cpossible);

		edgeIds=Array.from(nextEdges,x=>x.id)
		nodeIds=Array.from(nextNodes,x=>x.id)

		curNodes=JSON.parse(JSON.stringify(currentNodes.getIds()));
		curEdges=JSON.parse(JSON.stringify(currentEdges.getIds()));
		
		
		for (var i in curNodes) {
		    if(!containsObject(curNodes[i],nodeIds)){
				removeNode(curNodes[i])
			}
		}
		for (var i in curEdges) {
		    if(!containsObject(curEdges[i],edgeIds)){
				removeEdge(curEdges[i])
			}
		}
		for (var i in nextNodes) {
			if(!containsObject(nodeIds[i],curNodes)){
				n=nextNodes[i];
				addNode(n)
			}
		}
		
		for (var i in nodeIds) {
			nLabel=nextNodes[i].label;
			cNode=currentNodes.get(nodeIds[i]);
			if(!(nLabel === cNode.label)){
				currentNodes.update([{id:1, label: nLabel}]);
			}
		}
		
		for (var i in edgeIds) {
			if(!containsObject(edgeIds[i],curEdges)){
				e=nextEdges[i];
				addEdge(e)
			}
		}
		
		for (var i in edgeIds) {
			nLabel=nextEdges[i].label;
			cEdge=currentEdges.get(nextEdges[i]);
			if(!(nLabel === cEdge.label)){
				currentEdges.update([{id:1, label: nLabel}]);
			}
		}
		// document.getElementById("text").innerHTML = 'Set '+ String(idx+1)
		
	}

	function nextSet(){
		idx=(idx+1)%path.length;
		changeTo(idx);
	}

	function previousSet(){
		idx=(idx-1);
		if(idx<0){
			idx=path.length-1;
		}
		changeTo(idx);
	}

	function determinePath(dates,depth){
		var bestLength=dates.length;
		var bestCase=[JSON.parse(JSON.stringify(dates))];
		// var dates = [["Apr","16","2000"],["Apr","15","2000"],["Apr","15","2000"],["May","16","2001"]];
		var unique_days = [];
		var unique_months = [];
		var unique_years = [];

		if(dates.length===0){
			return [];
		}
		if(dates.length===1){
			return dates;
		}

		for (date of dates) {
			// check whether the day occurs only once
			if(checkUniqueYear(dates,date)){
				unique_years.push(date);
			}
			if(checkUniqueDay(dates,date)){
				unique_days.push(date);
			}
			if(checkUniqueMonth(dates,date)){
				unique_months.push(date);
			}
		}
		
		// check whether the single unique date is the birthday
		if (unique_days.length==1){
			var date = unique_days[0];
			if(date[1]==(dates[0])[1]){
				x=[];
				x.push(dates,[date]);
				steps[depth]=[-2,1];

				return x;
			}
		}
		// check whether the single unique date is the birthday
		if (unique_months.length==1){
			var date = unique_months[0];
			if(date[0]==(dates[0])[0]){

				x=[];
				x.push(dates,[date]);
				steps[depth]=[-2,0];

				return x;
			}
		}
		// check whether the single unique date is the birthday
		if (unique_years.length==1){
			var date = unique_years[0];
			if(date[2]==(dates[0])[2]){

				x=[];
				x.push(dates,[date]);
				steps[depth]=[-2,2];

				return x;
			}
		}
		
		if (unique_days.length>=1) {
			var flag1 = true;
			var flag2 = true;
			var flag3 = true;
			for (date of unique_days) {
				
				if(date[1]==dates[0][1] && dates.length != unique_days.length){
					var y=[];
					var y=y.concat(determinePath(unique_days,depth+1));
				
					bool=true;
					if (y.length>0){
						if(y[y.length-1].length===1){
							bool=false;
							x=[dates]
						x = x.concat(y)

						steps[depth]=[1,0];
						return x;
						}
					}
					if(bool){
						if(new_dates.length>0 && new_dates.length<bestLength){
							x=[JSON.parse(JSON.stringify(dates))];
							x.push(new_dates);
							
							steps[depth]=[1,0]
							bestCase=x;		
						}					
					}
				}
				
				if (!checkPossibleReduction(dates,date,0)) {
					var flag1 = false;
				}
				if (!checkPossibleReduction(dates,date,2)) {
					var flag2 = false;
				}
				if (!checkPossibleReduction(dates,date,1)) {
					var flag3 = false;
				}
			}
			var new_dates=[]
			if (flag1) {
				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_days, new_dates, 0);
				var test=JSON.parse(JSON.stringify(new_dates));
				
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));

				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false;
						x=[dates]
					x = x.concat(y)

					steps[depth]=[1,0];
					return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
						
						steps[depth]=[1,0]
						bestCase=x;		
					}					
				}
			}

			if (flag2) {
				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_days, new_dates, 2);
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));

				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false;
						x=[dates]
					x = x.concat(y)

					steps[depth]=[1,2];
					return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
						
						steps[depth]=[1,2]
						bestCase=x;		
					}					
				}
			}

			if (flag3) {
				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_days, new_dates, 1);
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));

				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false;
						x=[dates]
						x = x.concat(y)

						steps[depth]=[1,1];
						return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
						
						steps[depth]=[1,1]
						bestCase=x;	
					}					
				}
			}
		}
	
		if (unique_months.length>=1) {
			var flag1 = true;
			var flag2 = true;
			var flag3 = true;
			for (date of unique_months) {
				if(date[0]==dates[0][0] && dates.length != unique_months.length){
					y=[];
					y=y.concat(determinePath(unique_months,depth+1));
				
					bool=true;
					if (y.length>0){
						if(y[y.length-1].length===1){
							bool=false;
							x=[dates]
						x = x.concat(y)

						steps[depth]=[1,0];
						return x;
						}
					}
					if(bool){
						if(new_dates.length>0 && new_dates.length<bestLength){
							x=[JSON.parse(JSON.stringify(dates))];
							x.push(new_dates);
							
							steps[depth]=[1,0]
							bestCase=x;		
						}					
					}
				}
				if (!checkPossibleReduction(dates,date,1)) {
					flag1 = false;
				}
				if (!checkPossibleReduction(dates,date,2)) {
					flag2 = false;
				}
				if (!checkPossibleReduction(dates,date,0)) {
					flag3 = false;
				}
			}
			new_dates=[]
			if (flag1) {
				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_months, new_dates, 1);
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));
				
				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false;
						x=[dates]
					x = x.concat(y)

					steps[depth]=[0,1];
					return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
						
						steps[depth]=[0,1]
						bestCase=x;		
					}					
				}
			}

			if (flag2) {
				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_months, new_dates, 2);
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));
				
				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false;
						x=[dates]
					x = x.concat(y)

					steps[depth]=[0,2];
					return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
						
						steps[depth]=[0,2]
						bestCase=x;			
					}					
				}
			}

			if (flag3) {
				local=JSON.parse(JSON.stringify(bestCase))				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_months, new_dates, 0);
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));
				
				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false;
						x=[dates]
						x = x.concat(y)

						steps[depth]=[0,0];
						return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
						
						steps[depth]=[0,0]
						bestCase=x;				
					}
				}
			}
		}
		
		if (unique_years.length>=1) {
			var flag1 = true;
			var flag2 = true;
			var flag3 = true;
			for (date of unique_years) {
				if([2]==dates[0][2] && dates.length != unique_years.length){
					bool=true;
					if (y.length>0){
						if(y[y.length-1].length===1){
							bool=false;
							x=[dates]
						x = x.concat(y)

						steps[depth]=[1,0];
						return x;
						}
					}
					if(bool){
						if(new_dates.length>0 && new_dates.length<bestLength){
							x=[JSON.parse(JSON.stringify(dates))];
							x.push(new_dates);
							
							steps[depth]=[1,0]
							bestCase=x;		
						}					
					}
				}
				if (!checkPossibleReduction(dates,date,0)) {
					flag1 = false;
				}
				if (!checkPossibleReduction(dates,date,1)) {
					flag2 = false;
				}
				if (!checkPossibleReduction(dates,date,2)) {
					flag3 = false;
				}
			}
			new_dates=[]
			if (flag1) {
				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_years, new_dates, 0);
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));

				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false;
						x=[dates]
						x = x.concat(y)

						steps[depth]=[2,0];
						return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
					
						steps[depth]=[2,0]
						bestCase=x;	
						bestLength=y[y.length-1].length;
					}
				}
			}

			if (flag2) {
				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_years, new_dates, 1);
				
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));

				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false
						x=[dates]
						x = x.concat(y)

						steps[depth]=[2,1];
						return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
						
						steps[depth]=[2,1]
						bestCase=x;	
						bestLength=y[y.length-1].length;		
					}
				}
			}

			if (flag3) {
				
				var new_dates = JSON.parse(JSON.stringify(dates));
				new_dates = reduceModel(unique_years, new_dates,2);
				y=[];
				y=y.concat(determinePath(new_dates,depth+1));

				bool=true;
				if (y.length>0){
					if(y[y.length-1].length===1){
						bool=false
						x=[dates]
						x = x.concat(y)

						steps[depth]=[2,2];
						return x;
					}
				}
				if(bool){
					if(new_dates.length>0 && new_dates.length<bestLength){
						x=[JSON.parse(JSON.stringify(dates))];
						x.push(new_dates);
						
						steps[depth]=[2,2]
						bestCase=x;	
						bestLength=y[y.length-1].length;		
					}				
				}
			}
		}
		return bestCase;
	}
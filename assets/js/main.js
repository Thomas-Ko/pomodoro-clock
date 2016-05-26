// running : true

model = {
	break : 1,
	session: 25,
	currentBreak: {
		minutes: 1,
		seconds: 2,
	},
	currentSession: {
		minutes: 5,
		seconds: 10,
	},
	
};

controller = {
	init: function(){
		window.setInterval(function(){
			controller.countDown("currentBreak");
		}, 1000);
		view.init();
	},

	addTime : function(timeType){
		model[timeType]++;
	},
	subtractTime: function(timeType){
		if(model[timeType]>1){
			model[timeType]--;
		}
	},

	retrieveTime: function(timeType){
		return model[timeType];
	},

	countDown: function(timeType){
		// var elem = document.getElementById("breakSecondsDisplay");
		// var currentDisplayTime = parseFloat(countdown.textContent);
		
		// elem.textContent = currentDisplayTime - 1;

		// currentSeconds = model.currentBreak.seconds;
		if(model[timeType].seconds>0){
			model[timeType].seconds --;

		} else if (model[timeType].seconds===0){
			model[timeType].seconds=2;
			model[timeType].minutes--;
		} 

		if (model[timeType].minutes===0 && model[timeType].seconds===0){
			console.log("hello");
		}
		
		$("#breakSecondsDisplay").text(model.currentBreak.seconds);
		$("#breakDisplay").text(model.currentBreak.minutes);
	}

	// var countItDown = function() {
 //    	countdown.textContent = parseFloat(countdown.textContent) - 1;  
 //  	};
};

view = {
	init: function(){
		this.displayInitalSetTimes();
		// this.buttons.addBreakBtn();
		this.break.addTime();
		this.break.subtractTime();
		this.session.addTime();
		this.session.subtractTime();
	},
	displayInitalSetTimes: function(){
		var breakTime = controller.retrieveTime("break");
		var sessionTime = controller.retrieveTime("session");
		$("#breakLength").text(breakTime);
		$("#breakDisplay").text(breakTime);
		$("#sessionLength").text(sessionTime);
		$("#sessionDisplay").text(sessionTime);
	},


	setTime: function(timeType, addOrMinus, func){
		var btnId = "#" + addOrMinus + timeType.charAt(0).toUpperCase() + timeType.slice(1) +"Btn";

		$(btnId).on("click", function(){
			func(timeType);
			var time = controller.retrieveTime(timeType);
			$("#"+timeType+"Length").text(time);
			$("#"+timeType+"Display").text(time);
		});

	},

	break: {
		addTime: function(){
			view.setTime("break", "add", controller.addTime);
		},
		subtractTime: function(){
			view.setTime("break", "subtract", controller.subtractTime);
		}
	},

	session: {
		addTime: function(){
			view.setTime("session", "add", controller.addTime);
		},
		subtractTime: function(){
			view.setTime("session", "subtract", controller.subtractTime);
		}
	},

	// buttons: {
	// 	addBreakBtn : function(){
	// 		$("#addBreakBtn").on("click",function(){
	// 			controller.addTime("break");
	// 			var time = controller.retrieveTime("break");
	// 				console.log(time);
	// 			$("#breakLength").text(time);
	// 		});
	// 	},
	// 	addSessionBtn : function(){
	// 		$("#addSessionBtn").on("click",function(){
	// 			controller.addTime("session");
	// 			var time = controller.retrieveTime("session");
	// 				console.log(time);
	// 			$("#sessionLength").text(time);
	// 		});
	// 	},
	// }
};

controller.init();
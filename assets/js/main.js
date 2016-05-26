// running : true

model = {
	break : 3,
	session: 3,
	breakCurrent: {
		minutes: 3,
		seconds: 3,
	},
	sessionCurrent: {
		minutes: 3,
		seconds: 3,
	},
	currentRunning: "session",
};

controller = {
	init: function(){
		this.countDownClick();
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

	countDownClick: function(){

		var timer;

		if (model.currentRunning==="session"){
			timer = window.setInterval(function(){
				controller.countDown("session", timer);
			}, 1000);
		} else if (model.currentRunning==="break"){
			timer = window.setInterval(function(){
				controller.countDown("break", timer);
			}, 1000);
		}

		$("#stop").on("click", function(){
			window.clearInterval(timer);
		});

	},

	stopCountDown: function(){
		window.clearInterval(function(){
			controller.startCountDown("session");
		});
	},


	countDown: function(timeType, timer){
		// var elem = document.getElementById("breakSecondsDisplay");
		// var currentDisplayTime = parseFloat(countdown.textContent);
		
		// elem.textContent = currentDisplayTime - 1;

		// currentSeconds = model.currentBreak.seconds;

		var current = timeType+"Current";
		if(model[current].seconds>0){
			model[current].seconds --;

		} else if (model[current].seconds===0){
			model[current].seconds=3;
			model[current].minutes--;
		} 

		if (model[current].minutes===0 && model[current].seconds===0){
			console.log("hello");
			
			if (model.currentRunning==="session"){
				model.currentRunning="break";
			} else if (model.currentRunning==="break"){
				model.currentRunning="session";
			}
			window.clearInterval(timer);
			controller.countDownClick();
			model[current].seconds = 3;
			model[current].minutes = model[timeType];
		}
		
		var minutesDisplay= "#"+timeType+"Display";
		var secondsDisplay= "#"+timeType+"SecondsDisplay";
		$(secondsDisplay).text(model[current].seconds);
		$(minutesDisplay).text(model[current].minutes);
		
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
		this.start();
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

	start: function(){
		$("#start").on("click", controller.countDownClick);
	}

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
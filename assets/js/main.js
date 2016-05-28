/*====================
	MODEL 
====================*/

model = {
	break : 5,
	session: 25,
	
	//the Current objects keep track of the current timer; seconds must be 0 and minutes must be the same as what is in the model
	breakCurrent: {
		minutes: 5,
		seconds: 0,
	},
	sessionCurrent: {
		minutes: 25,
		seconds: 0,
	},

	//stores which timeType is currently running ("session" or "break"); Do not change this. Initially, it must be set to "session"
	currentRunning: "session",
	//stores whether the timer is currently running
	timerRunning: false,
};


/*====================
	CONTROLLER 
====================*/

controller = {
	init: function(){
		view.init();
	},

	addTime : function(timeType){
		if(model[timeType]<99){
			model[timeType]++;
		}
		controller.resetTime();
		model.currentRunning = "session";
	},
	subtractTime: function(timeType){
		if(model[timeType]>1){
			model[timeType]--;
		}
		controller.resetTime();
		model.currentRunning = "session";
	},

	retrieveTime: function(timeType){
		return model[timeType];
	},

	/*this function starts up the timer; inside this function are other functions that are invoked when the user presses a certain button; These functions
	need to be inside here because they can't clear the timer out of scope*/
	countDownClick: function(){
		controller.resetTime();
		var timer;

		if (model.currentRunning==="session"){
			timer = window.setInterval(function(){
				controller.countDown("session", timer);
			}, 1000);
			//the class current-time-type is just a lightly opaque container that goes over the currently running time-type section to help the user
			$("#sessionDisplayContainer").addClass("current-time-type");
			$("#breakDisplayContainer").removeClass("current-time-type");
		} else if (model.currentRunning==="break"){
			timer = window.setInterval(function(){
				controller.countDown("break", timer);
			}, 1000);
			$("#breakDisplayContainer").addClass("current-time-type");
			$("#sessionDisplayContainer").removeClass("current-time-type");
		}

		//pressing any of these buttons, stops the timer
		$("#stop,  #subtractSessionBtn, #addBreakBtn, #subtractBreakBtn, #addSessionBtn").on("click", function(){
			window.clearInterval(timer);
			model.timerRunning = false;
		});

		//pressing the start button, activates the timer again
		$("#start").on("click", function(){
			if(!model.timerRunning){
				window.clearInterval(timer);
				timer = window.setInterval(function(){
				controller.countDown("session", timer);
				}, 1000);
				model.timerRunning = true;
				$("#breakDisplayContainer").removeClass("current-time-type");
				$("#sessionDisplayContainer").addClass("current-time-type");
			}
		});

		//resets the timer
		$("#reset").on("click", function(){
			$("#breakDisplayContainer, #sessionDisplayContainer").removeClass("current-time-type");
			window.clearInterval(timer);
			controller.resetTime();
			model.currentRunning = "session";
			view.displayInitalSetTimes();
		});

	},

	//resets the time
	resetTime: function(){
		model.timerRunning = false;
		model.sessionCurrent.seconds = 0;
		model.breakCurrent.seconds = 0;
		model.breakCurrent.minutes = model.break;
		model.sessionCurrent.minutes = model.session;
		view.displayInitalSetTimes();
	},

	//invoked inside the controller.CountDownClick function, this is the brains of the countdown
	countDown: function(timeType, timer){
		var current = timeType+"Current";
		if(model[current].seconds>0){
			model[current].seconds --;

		} else if (model[current].seconds===0){
			model[current].seconds=59;
			model[current].minutes--;
		}

		var minutesDisplay= "#"+timeType+"Display";
		var secondsDisplay= "#"+timeType+"SecondsDisplay";

		//when the timer reaches 0
		if (model[current].minutes===0 && model[current].seconds===0){
			
			//switch to other timeType countdown
			if (model.currentRunning==="session"){
				model.currentRunning="break";	
			} else if (model.currentRunning==="break"){
				model.currentRunning="session";
			}
			window.clearInterval(timer);
			controller.countDownClick();
			model[current].seconds = 0;
			model[current].minutes = model[timeType];

			$(secondsDisplay).text("00");
			$(minutesDisplay).text(model[timeType]);

			//a metal gong plays
			var audio = document.getElementById("audio");
			audio.play();

		} else {
			var secondsNumber = model[current].seconds;
			//numbers 0 - 9 will appear with a zero before them; example: 9 becomes 09
			if(secondsNumber>=0 && secondsNumber<=9){
				secondsNumber = "0" + secondsNumber;
			}
			$(secondsDisplay).text(secondsNumber);
			$(minutesDisplay).text(model[current].minutes);
		}	
	}
};


/*====================
	VIEW 
====================*/

view = {
	init: function(){
		this.displayInitalSetTimes();
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
		$("#sessionSecondsDisplay").text("00");
		$("#breakSecondsDisplay").text("00");
	},

	setTime: function(timeType, addOrMinus, func){
		var btnId = "#" + addOrMinus + timeType.charAt(0).toUpperCase() + timeType.slice(1) +"Btn";

		$(btnId).on("click", function(){
			func(timeType);
			var time = controller.retrieveTime(timeType);
			$("#"+timeType+"Length").text(time);
			$("#"+timeType+"Display").text(time);

			$("#breakDisplayContainer, #sessionDisplayContainer").removeClass("current-time-type");
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
		if(model.timerRunning===false){
			model.timerRunning = true;
			//the below is a sort of hackish way I got around being able to have the timer not start right after a page load
			$("#startBeginning").one("click", function(){
				$("#startBeginning").attr("id","start");
				controller.countDownClick();
			});
		}
	}
};


/*====================
	INITIALIZATION 
====================*/
controller.init();
function Game() {

	var game = this;
	var param = {
		time: 1000,
		money: 0,
		moneyTarget: document.getElementById('moneyVal'),
		profitTarget: document.getElementById('profitVal'),
		clickerTarget: document.getElementById('clicker'),
		win: false
	}
	var dataTarget = document.getElementById('dataVal');

	game.click = function () {
		param.money += game.factories.clicker.moneyClick();
		game.update();
	}
	//adds coins per click per level
	game.factories = {
		clicker: {
			title: 'Gold Finder',
			level: 1,
			moneyClick: function () {
				return Math.round(game.checkFactories() / 100 * this.level + this.level);
			},
			cost: function () {
				return Math.pow(this.level, 3);
			}
		},
		//adds the auto clickers and how many clicks per upgrade
		//adds gold drill
		goldDrill: {
			title: 'Gold Drill',
			level: 0,
			money: function () {
				return this.level;
			},
			cost: function () {
				return (this.level + 1) * 10;
			}
		},
		//adds bank interest
		bankInt: {
			title: 'Bank Interest',
			level: 0,
			money: function () {
				return this.level * 15;
			},
			cost: function () {
				return (this.level + 1) * 300;
			}
		},
		//adds stock market
		stockMar: {
			title: 'Stock Market',
			level: 0,
			money: function () {
				return this.level * 50;
			},
			cost: function () {
				return (this.level + 1) * 3000;
			}
		},
		//adds sonar tracking
		sonarTra: {
			title: 'Sonar Tracking',
			level: 0,
			money: function () {
				return this.level * 120;
			},
			cost: function () {
				return (this.level + 1) * 7500;
			}
		},
		//adds satilite tracker
		satiliteTra: {
			title: 'Satilite Tracking',
			level: 0,
			money: function () {
				return this.level * 300;
			},
			cost: function () {
				return (this.level + 1) * 25000;
			}
		}
	};
//adds total amounts of money and displays it
	game.checkFactories = function () {

		var totalMoney = 0;

		for (var f in game.factories) {
			if (game.factories[f].money) {
				totalMoney += game.factories[f].money();
			}
		}
		return totalMoney;

	}
//updates money ammount
	game.update = function () {
		param.profitTarget.innerHTML = game.checkFactories();
		param.moneyTarget.innerHTML = param.money;

		for (var f in game.factories) {

			if (game.factories[f].moneyClick) {
				game.factories[f].moneyClickTarget.innerHTML = game.factories[f].moneyClick();
			}

			if (param.money >= game.factories[f].cost()) {
				game.factories[f].target.className = 'factory';
			} else {
				game.factories[f].target.className = 'factory deactive';
			}
		}
	}
//adds an alert when you reach 1000000 gold
	game.interval = function () {
		var dataStart = Date.now();
		if (param.money >= 1000000 && !param.win) {
			alert('Congragulations you win!');
			param.win = true;
		}

		param.money += game.checkFactories();
		game.update();

		var dataEnd = Date.now();
		dataTarget.innerHTML = dataEnd - dataStart;
		setTimeout(game.interval, param.time);
	}
//checks to make sure you have enough money for an upgrade and adds visual affect
	function find(obj, childrenClass) {
		for (var i = 0; i < obj.childNodes.length; i++) {
			if (obj.childNodes[i].className == childrenClass) {
				return obj.childNodes[i];
				break;
			}
		}
		return null;
	}
	function factoryUpgrade(factory) {
		if (param.money >= factory.cost()) {
			param.money -= factory.cost();
			factory.level++;

			param.moneyTarget.innerHTML = param.money;
			if (factory.money) {
				factory.moneyTarget.innerHTML = factory.money();
			}
			if (factory.moneyClick) {
				factory.moneyClickTarget.innerHTML = factory.moneyClick();
			}

			factory.titleTarget.innerHTML = factory.title + ' [' + factory.level + ']'
			factory.costTarget.innerHTML = factory.cost();
			//factory.levelTarget.innerHTML = factory.level();

			game.update();
		}
	}
//updates the auto clickers and clicker levels
	function init() {
		for (var f in game.factories) {
			var factory = game.factories[f],
				container = document.createElement('div'),
				elm = document.createElement('p').cloneNode(true);

			container.id = f;
			container.className = 'factory deactive';

			elm.className = 'factory-title';
			elm.innerHTML = game.factories[f].title + ' [' + factory.level + ']';
			factory.titleTarget = elm.cloneNode(true);
			container.appendChild(factory.titleTarget);

			if (factory.money) {
				elm.className = 'factory-money';
				elm.innerHTML = game.factories[f].money();
				factory.moneyTarget = elm.cloneNode(true);
				container.appendChild(factory.moneyTarget);
			}
			if (factory.moneyClick) {
				elm.className = 'factory-money money-click';
				elm.innerHTML = game.factories[f].moneyClick();
				factory.moneyClickTarget = elm.cloneNode(true);
				container.appendChild(factory.moneyClickTarget);
			}


			elm.className = 'factory-cost';
			elm.innerHTML = game.factories[f].cost();
			factory.costTarget = elm.cloneNode(true);
			container.appendChild(factory.costTarget);

			container.onclick = function () {
				factoryUpgrade(game.factories[this.id]);
			}

			factory.target = container;

			document.getElementById('factoriesContainer').appendChild(container);
		}
//changes the computer pointer
		var eventType;
		if ('ontouchstart' in window) {
			eventType = 'touchstart';
		} else if (window.navigator.pointerEnabled) {
			eventType = "pointerdown";
		} else if (window.navigator.msPointerEnabled) {
			eventType = "MSPointerDown";
		} else {
			eventType = "click";
		}
		param.clickerTarget.addEventListener(eventType, function (event) {
			game.click();
		}, false);


		game.interval();
	}
	return init();
}


var gold = new Game();

$(document).ready(function(){
	Inputmask().mask(document.querySelectorAll("input"));
});

function DynamicAdapt(type) {
	this.type = type;
}


DynamicAdapt.prototype.init = function () {
	const _this = this;
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	this.nodes = document.querySelectorAll("[data-da]");

	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

let formValidate = function(){
	$('form').each(function(){
	 $(this).on('submit', function(){
	  $(this).validate({
	   rules: {
		name: 'required',
		phone: 'required',
		email: "required",
		password: 'required',
		textreq: 'required',
		check: 'required'
	   },
	   messages: {
		name: 'Введите корректное имя',
		phone: 'Введите корректный номер',
		email: 'Введите корректный email',
		password: 'Введите корректный пароль',
		textreq: 'Заполните это поле'
	   },
	   errorPlacement: function (error, element) {
		if($('form').hasClass("error__inside")){
			element.attr("placeholder", error[0].outerText);
		} else {
			error.insertAfter(element);
        }
	   } 
	  });
	  if ($(this).valid()){
	   	let wrap = $(this)[0].closest('.hide-on-success');
		if (wrap) {
			$(wrap).addClass("show-on-success");
			$(wrap).next('.show-on-success').addClass("hide-on-success");
			$(wrap).next('.show-on-success').removeClass("show-on-success");
		}
	  }
	  return false;
	})
  });
};


formValidate();

let select = function () {
    let selectHeader = document.querySelectorAll('.popup-select__header');
    let selectItem = document.querySelectorAll('.popup-select__item');

      selectHeader.forEach(item => {
        item.addEventListener('click', selectToggle)
    });

      selectItem.forEach(item => {
        item.addEventListener('click', selectChoose)
    });

      function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }

      function selectChoose() {
        let text = this.innerText,
            select = this.closest('.popup-select__content'),
            currentText = select.querySelector('.popup-select__current');
            icon = this.closest(".popup-select__header");
        currentText.innerText = text;
        select.classList.remove('is-active');
    }
};

select();

$(".burger").click(function(){
	$("html, body").animate({scrollTop:0},500);
	$(this).toggleClass("burger--active")
	$(".menu").toggleClass("menu--active")
	$("body").toggleClass("lock")
	event.preventDefault()
});


$(".weight__link").click(function(){
	$(this).siblings(".weight__link").removeClass("weight__link--active")
	$(this).toggleClass("weight__link--active")
	event.preventDefault()
});


$(document).ready(function() {
	$('.product__amount-minus').click(function () {
		var $input = $(this).parent().find('input');
		var count = parseInt($input.val()) - 1;
		if(count > 0){
			let start = $(this).closest(".account-inquiries__item").find(".account-inquiries__item-start-price").text();
			let total = $(this).closest(".cart-data").find(".account-inquiries__item-total").text();
			let sum = Number(total)-Number(start)
			$(this).closest(".cart-data").find(".account-inquiries__item-total").text(sum + "");
		}
		count = count < 1 ? 1 : count;
		$input.val(count);
		$input.change();
		return false;
	});
	$('.product__amount-plus').click(function () {
		var $input = $(this).parent().find('input');
		let start = $(this).closest(".account-inquiries__item").find(".account-inquiries__item-start-price").text();
		let total = $(this).closest(".cart-data").find(".account-inquiries__item-total").text();
		let sum = Number(total)+Number(start)
		$(this).closest(".cart-data").find(".account-inquiries__item-total").text(sum + "");
		$input.val(parseInt($input.val()) + 1);
		$input.change();
		return false;
	});
});

$('.product-slider--first').slick({
	infinite: true,
	slidesToShow: 4,
	slidesToScroll: 1,
	prevArrow: $('.product-slider__first-arrow--prev'),
	nextArrow: $('.product-slider__first-arrow--next'),
	responsive: [
		{
		  breakpoint: 768,
		  settings: {
			slidesToShow: 2,
		  }
		}
	]
});

$('.product-slider--second').slick({
	infinite: true,
	slidesToShow: 4,
	slidesToScroll: 1,
	prevArrow: $('.product-slider__second-arrow--prev'),
	nextArrow: $('.product-slider__second-arrow--next'),
	responsive: [
		{
		  breakpoint: 768,
		  settings: {
			slidesToShow: 2,
		  }
		}
	]
});

$(".header-account__link").click(function(){
	$(this).siblings(".header-account__menu").toggleClass("header-account__menu--active")
	$(this).toggleClass("header-account__link--active");
	event.preventDefault()
});

$('.header-account__button--login').magnificPopup({
	type:'inline',
  	midClick: true,
	closeOnBgClick: false 
});
$('.header-account__button--registration').magnificPopup({
	type:'inline',
  	midClick: true,
	closeOnBgClick: false 
});
$('.account-account__edit-link').magnificPopup({
	type:'inline',
  	midClick: true,
	closeOnBgClick: false 
});
$('.footer__link').magnificPopup({
	type:'inline',
  	midClick: true,
	closeOnBgClick: false 
});
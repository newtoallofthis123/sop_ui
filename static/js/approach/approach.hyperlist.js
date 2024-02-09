addScopeJS(["Approach", "Hyperlist"], {});

Approach.Hyperlist = function(config = {}) {
	let $elf = this;

	$elf.config = {
		component: {
			name: null,
			selector: null,
			container: ".EndlessScroll"
		},
		range: {
			increment: 16,
			begin: null,
			end: null,
		},
		url: {
			base: null,
			component: null,
			range: null
		},
		debug: true
	};

	$elf.managed = {
		isLoading: false,
		componentType: null,
		trigger: {
			el: null
		},
	};

	overwriteDefaults(config, $elf.config);

	$elf.init = () => {
		if ($elf.config.debug) console.groupCollapsed("endless scroller");

		$elf.config.component.container = $($elf.config.component.container);
		$elf.managed.trigger.el = $elf.config.component.container.children().last();

		// define or find component name
		if ($elf.config.component.name === null) {
			// html element with data-component will supply the component name and is required
			$elf.config.component.name = $elf.config.component.container.data("component");
			let component = $elf.config.component.name;
		}
		$elf.config.url.component = `[${$elf.config.component.name}]`;
		if ($elf.config.debug) console.log(`Component type: ${$elf.config.url.component}`);

		// check if the container has scroll-page-size attribute to overwrite config
		if ($elf.config.component.container.data("scroll-page-size")) {
			$elf.config.range.increment = $elf.config.component.container.data("scroll-page-size");
		}

		$elf.config.range.end = $elf.config.range.begin + $elf.config.range.increment;

		if ($elf.config.url.base === null) {
			$elf.config.url.base = dispatch.getCleanUrl();
		}

		// attach scroll event listener
		$(window).scroll(call.onScroll);

		if ($elf.config.debug) console.groupEnd();
	};


	$elf.call = {
		onScroll: (e) => {
			if ($elf.config.debug) console.log("scroll trigger");

			// if the last element is in screen & we're not loading a new set already
			if (!$elf.managed.isLoading && dispatch.isElementScrolled($elf.managed.trigger.el)) {
				if ($elf.config.debug) console.log("last child scrolled in screen");

				// set loading state to prevent duplicate loading
				$elf.managed.isLoading = true;

				// stringify for url syntax e.g. "[16..32]"
				$elf.config.url.range = `[${$elf.config.range.begin}..${$elf.config.range.end}]`;

				// create url syntax e.g. "https://example.com/alias[ComponentName][16..32]"
				let url = $elf.config.url.base + $elf.config.url.component + $elf.config.url.range;

				if ($elf.config.debug) console.log(`created url for ajax call: ${url}`);

				ServeComposedRange(url, $elf.call.onLoad);
			}
		},
		onLoad: (json) => {
			// Handle return json
			// loop over SERVE array and append elements to given wrapper
			if ($elf.config.debug) console.log(json);

			json.SERVE.forEach((el) => {
				// append the new container after the previous one
				$(el).insertAfter($elf.config.component.container);
				// assign the new last container
				$elf.config.component.container = $(el);
			});

			$elf.config.range.begin = $elf.config.range.end;
			$elf.config.range.end = $elf.config.range.begin + $elf.config.range.increment;

			// define new scroll trigger element
			dispatch.setTrigger();
			$elf.managed.isLoading = false;
		},
	};

	let dispatch = {
		fetch: () => {},
		isElementScrolled: (el) => {
			let docViewTop = $(window).scrollTop();
			let docViewBottom = docViewTop + $(window).height();
			let elTop = el.offset().top;
			return ((elTop <= docViewBottom) && (elTop >= docViewTop));
		},
		getCleanUrl: () => {
			let pathnodes = window.location.pathname.split("/");

			let lastnode = pathnodes[pathnodes.length - 1];
			// console.log("lastnode: ", {"lastnode":lastnode});
			if (lastnode == "" && pathnodes.length > 1) {
				pathnodes.pop(); // in case of trailing / slash in url
				lastnode = pathnodes[pathnodes.length - 1]
				console.log("yes", pathnodes);
			} else {
				console.log('no', pathnodes);
			}
			let last_path_clean = lastnode.split("/\[|\;/", 1);
			console.log(last_path_clean);
			pathnodes[pathnodes.length - 1] = last_path_clean;
			console.log("test: ", (window.location.origin + pathnodes.join("/")));
			return window.location.origin + pathnodes.join("/");
		},
		setTrigger: () => {
			$elf.managed.trigger.el = $elf.config.component.container.children().last();
		}
	}

	$elf.init();
	return $elf;
};

// Use Approach Reflection to ask the Composition at any URL for part of its ComponentList
function ServeComposedRange(url, successFunction, mode = "publish_api") {
	// access_mode = publish_full | publish_api | publish_json | publish_embed | publish_silent
	let ReqData = {};
	url = url + "?test=123&access_mode=" + mode;

	let errorFunction = function(jqXHR, textStatus, errorThrown) {
		console.log("Something went wrong with the endless scroller ajax call");
		console.log(textStatus);
	}

	return $.ajax({
		url: url,
		type: "post",
		data: ReqData, //the json data
		dataType: "json",
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: successFunction,
		error: errorFunction
	});
}

export let Hyperlist = Approach.Hyperlist;

addScopeJS(["Approach", "Displacer"], {});

Approach.Displacer = function(config = {}) {
	let $elf = this;
	// config default
	$elf.config = {
		what: ".displaceable", // thing being moved
		where: ".displaceTo", // where it can be moved to
		how: {
			handle: ".displaceHandle", // something selectable from within the "what" element which can be targetted by the displace_trigger event to move the "what" element
			remain_in_source: false, // should it disappear with displacing is active or only on success
			visual: true, // visual placeholder should be generated
			hold_while_displacing: true, // this plugin owns the object during displacement
			hold_original: true, // visual should be the real object not the placeholder
			emit: "Displacer_Displaced", // event to emit when complete
			preview: "mirror", // One of: none, space, ghost, mirror, indicator
			// preview_parent_class: "",        // CSS class added to the preview container temporarily
			// preview_generator: buildPreview, // function to create ghost, mirror or indicator, if set
			displace_trigger: "mousedown", // event that starts displacement
			displace_finalize: "mouseup", // event that ends displacement
			slot_class: "slot", // subclass of "where" containers that hold a single displaceable, optional
			snap_sensitivity: 8, // how close the "what" is to a "where" slot before snapping occurs
			dragover_class: "displaceDragover" // class to that is added to the where container when dragged over
		},

		callbacks: {}, // override default call functions
		allow: [],
		deny: [],
		cooldown: 30,
		debug: true
	};

	// TODO: Split up config <-> state objects
	$elf.state = {
		what: $(config.what),
		where: $(config.where).not($elf.config.deny),
		displacing: false,
		displaced: false,
		mouseover: false,
		displaceable: null,
		displaceableCopy: null,
		preview: null,
		visual: null,
		visualContainer: $("#DisplacerVisualContainer"),
		target: null,
		dragentered: true,
		dragleft: false,
		cooldown: 0
	};

	// overwrite any config defaults
	overwriteDefaults(config, $elf.config);

	$elf.init = () => {
		// Attach to the "what" DOM elements
		$elf.state.what.each(function(i, el) {
			let displaceable = $(this);

			// check for a handle
			let handle = displaceable.find($elf.config.how.handle);
			// no handle found: use the displaceable node as handle
			if (!handle.length) {
				handle = displaceable;
				if ($elf.config.debug) {
					console.log("info: no handle found for " + $elf.config.how.handle);
					console.log(displaceable);
				}
			}

			//TODO: ADD to css class instead
			$elf.state.original_cursor = handle.css("cursor");
			handle.css("cursor", "grab");

			let data = {
				displaceable: displaceable,
				handle: handle
			};

			displaceable.attr("draggable", "true");
			displaceable.on("mousedown", data, dispatch.displaceable.mousedown);
			displaceable.on("dragstart", data, dispatch.displaceable.dragstart);
			displaceable.on("dragend", data, dispatch.displaceable.dragend);
		});

		// init where (displaceableTo containers)
		$elf.state.where.each(function(i) {
			let where = $(this);

			let data = {
				where: where
			};

			// TODO: change to generic previewTrigger?
			where.on("dragenter", data, dispatch.where.dragenter);
			where.on("dragleave", data, dispatch.where.dragleave);
			where.on("dragover", data, dispatch.where.dragover);
			where.on("drop", data, dispatch.where.drop);
		})

	}

	$elf.call = {
		start: (e, state) => {},
		complete: (e, state) => {},
		preview: (e, displaceable, $elf) => {
			let preview = null;

			switch ($elf.config.how.preview) {
				case "none":
					preview = new Node(); //empty text
					break;
				case "ghost":
					preview = $elf.state.displaceableCopy;
					preview.addClass("ghost");
					break;
				case "mirror":
					preview = $elf.state.displaceableCopy;
					break;

				default:
					throw new Error("Unsupported preview method supplied to Displacer");
			}

			return preview;
		},
		visual: (displaceable) => {
			// $elf.state.visualContainer.empty();
			// $elf.state.visualContainer.find("img")[0].src = displaceable.data("visual");
			// $elf.state.visualContainer.append(displaceable.clone());
		},
		reload: () =>  {
			$elf.init();
		}
	};

	let dispatch = {
		displaceable: {
			mousedown: e => {
				$elf.state.target = $(e.target);
			},

			dragstart: e => {
				// prevent the drag if it didnt start from the given handle
				if (!dispatch.isValidHandle($elf.state.target, e.data.handle)) {
					e.preventDefault();
					return;
				}

				let displaceable = e.data.displaceable;

				// update state
				$elf.state.displacing = true;
				$elf.state.displaceable = displaceable;
				$elf.state.displaceableCopy = getCopy(displaceable);
				$elf.state.dragentered = true;
				if ($elf.config.how.preview) {
					// make the preview el
					$elf.state.preview = $elf.call.preview(e, displaceable, $elf);
				}

				// add a class to visualize the targets better
				$elf.state.where.addClass("displaceableTarget");

				if (!$elf.config.how.remain_in_source) {
					setTimeout(() => {
						displaceable.hide();
					}, 0);
				}
			},

			dragend: e => {
				console.log("dragend");
				if (!$elf.state.displacing) return;

				// dispatch.displaceComplete(e);
			},
		},

		// drop function must be able to find its drag element
		displaceComplete: e => {
			if (debug) console.log("displaceComplete");

			// update state
			$elf.state.displaceable = null;
			$elf.state.displaceableCopy = null;
			$elf.state.displacing = false;
			$elf.call.complete(e, $elf);
		},

		where: {
			dragenter: e => {
				e.preventDefault();
				if (!$elf.state.displacing) return;

				// if (debug) console.log("dragenter");

				$elf.state.dragentered = true;
			},
			dragleave: e => {
				if (!$elf.state.displacing) return

				// if (debug) console.log("dragleave");

				$elf.state.dragleft = true;
			},
			dragover: e => {
				e.preventDefault();
				if (!$elf.state.displacing || $elf.state.cooldown) {
					$elf.state.cooldown--;
					return;
				}  else {
					$elf.state.cooldown = $elf.config.cooldown;
				}

				// if the container already contains the original displaceable then skip
				// if ($.contains(e.data.where[0], $elf.state.displaceableCopy[0])) return;

				// console.log("dragover");

				$elf.state.dragentered = false;

				$elf.state.where.removeClass($elf.config.how.dragover_class);

				e.data.where.addClass($elf.config.how.dragover_class);

				let closest_displaceable = $(e.target).closest($elf.config.what,e.data.where);
				if (closest_displaceable.is($elf.state.displaceableCopy)) {

					return;
				}

				if (closest_displaceable.length) {
					let distance = measureDistance(closest_displaceable, e.pageX, e.pageY);
					// console.log(distance);
					if (distance.y >= 0) {
						$elf.state.displaceableCopy.insertBefore(closest_displaceable);
					} else {
						$elf.state.displaceableCopy.insertAfter(closest_displaceable)
					}
				} else {
					e.data.where.append($elf.state.displaceableCopy);
				}


				// if ($elf.config.how.preview) {
				// e.data.where.append($elf.state.preview);
				// dispatch.chooseDropSpot(e.target, {pageX: e.pageX, pageY: e.pageY}, e.data.where);
				// }
			},

			drop: e => {
				// cancel if currently not displacing anything
				console.log("drop");

				if (!$elf.state.displacing) return;

				$elf.state.displaceableCopy.replaceWith($elf.state.displaceable);
				$elf.state.displaceable.show();

				// remove dragging classes
				$elf.state.where.removeClass("displaceableTarget");
				$elf.state.where.removeClass($elf.config.how.dragover_class);


				dispatch.displaceComplete(e);
			}
		},

		// visual: {
		// 	start: e => {
		// 		dispatch.visual.create(e);
		//
		// 		$(document).on("mousemove", e.data, dispatch.visual.mousemove);
		// 		$(document).on("mouseup", e.data, dispatch.visual.destroy);
		//
		// 		dispatch.visual.mousemove(e);
		// 		dispatch.visual.show();
		//
		// 		// $elf.call.visual(e.data.displaceable);
		// 	},
		//
		// 	create: e => {
		// 		$elf.state.visual = getCopy(e.data.displaceable);
		// 		$elf.state.visual.width(e.data.displaceable.width());
		// 		$elf.state.visual.height(e.data.displaceable.height());
		// 		$elf.state.visual.insertBefore(e.data.displaceable);
		// 	},
		//
		// 	show: e => {
		// 		$elf.state.visual.show(1000);
		// 	},
		// 	hide: e => {
		// 		$elf.state.visual.hide(500);
		// 	},
		//
		// 	mousemove: e => {
		// 		let css = {
		// 			"position": "fixed",
		// 			"left": `${e.pageX}px`,
		// 			"top": `${e.pageY}px`,
		// 			"z-index": 9999999999,
		// 		}
		//
		// 		$elf.state.visual.css(css);
		// 	},
		//
		// 	destroy: e => {
		// 		dispatch.visual.remove();
		//
		// 		$(document).off("mousemove", dispatch.visual.track);
		// 		$(document).off("mouseup", dispatch.visual.destroy);
		// 	}
		// },

		isValidHandle: (target, handle) => {
			if (target.is(handle) || $.contains(handle[0], target[0])) {
				return true;
			}
			return false;
		}
	};

	$elf.init();
	return $elf;
};

function measureDistance(target, mouseX, mouseY) {
	let a = mouseX - (target.offset().left + (target.width() / 2));
	let b = mouseY - (target.offset().top + (target.height() / 2));
	let c = Math.floor(
		Math.sqrt(a * a + b * b)
	);
	let x = a;
	let y = -1 * b;

	// if (Math.abs(x) >= target.width() / 2 || Math.abs(y) >= target.height() / 2)
	// 	outside = true;
	// swap y polarity to make it match standard cartesian graph quadrants

	return {
		c: c,
		x: x,
		y: y
	};
}


const generateVisualOnCursor = e => {
	// let displaceable = e.data.displaceable;
	// $elf.state.visualContainer.find("img")[0].src = displaceable.data("visual");

	let css = {
		position: "absolute",
		left: `${e.pageX}px`,
		top: `${e.pageY}px`,
		"z-index": 9999999999,
		"margin-top": "-100px",
		"margin-left": "-70px"
	}
	$elf.state.visualContainer.css(css);
}

function getCopy(displaceable) {
	// to do make switch on $elf.state
	return displaceable.clone();
}

function chooseDropSpot(
	target,
	mouse,
	container,
	what_selector = $elf.config.what,
	preview = $elf.state.preview
) {
	const scan_level = $(target).closest(" * ~ " + what_selector);
	let prev = $(scan_level).prevAll(what_selector).last().prev(what_selector);
	let next = $(scan_level).nextAll(what_selector).last().next(what_selector);
	if (prev.length === 0) prev = container;
	if (next.length === 0) next = container;

	const insert_target = resolveMouseNeighbor(mouse, prev, next);
	if (debug) console.log("resolveMouseNeighbor", "\n insert_target: ", insert_target, " \n mouse", mouse, "\n prev", prev, "\n next", next);

	if (insert_target.neighbor === container) {
		if (insert_target.direction === 0)
			container.prepend(preview);
		else
			container.append(preview);
	} else if (insert_target.direction === 0) {
		insert_target.neighbor.after(preview);
	} else {
		insert_target.neighbor.before(preview);
	}
}

function resolveMouseNeighbor(mouse, prev, next) {
	const prev_dist = pointToBoxDistance2({
		x: mouse.pageX,
		y: mouse.pageY
	}, {
		left: prev.offset().left,
		right: prev.offset().left + prev.outerWidth(),
		top: prev.offset().top,
		bottom: prev.offset().top + prev.outerHeight()
	});
	const next_dist = pointToBoxDistance2({
		x: mouse.pageX,
		y: mouse.pageY
	}, {
		left: next.offset().left,
		right: next.offset().left + next.outerWidth(),
		top: next.offset().top,
		bottom: next.offset().top + next.outerHeight()
	});

	if (prev_dist < next_dist || (prev_dist === next_dist && prev !== next)) return {
		dist: prev_dist,
		neighbor: prev,
		direction: 0 // backward
	};
	else if (prev_dist === next_dist && prev === next) return {
		dist: prev_dist,
		neighbor: prev,
		direction: 1 // append when both elements are the same, because we are in the container
	};
	else return {
		dist: next_dist,
		neighbor: next,
		direction: 1 // forward

	};
}

function pointToBoxDistance(
	p = {
		x: 0,
		y: 0
	},
	box = {
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	}) {

	if (p.x < box.left) { // Left of the box
		if (p.y < box.top) // Above the box
			return pyth_dist(box.left - p.x, box.top - p.y);
		if (p.y <= box.bottom) // Below the box
			return box.left - p.x;
		return pyth_dist(box.left - p.x, box.bottom - p.y); // In the box's vertical range
	} else if (p.x <= box.right) { // Right of the box
		if (p.y < box.top) // Above the box
			return box.top - p.y;
		if (p.y <= box.bottom) // Below the box
			return 0;
		return p.y - box.bottom; // In the box's vertical range
	} else { // In the box's horizontal range
		if (p.y < box.top) // Above the box
			return pyth_dist(box.right - p.x, box.top - p.y);
		if (p.y <= box.bottom) // Below the box
			return p.x - box.right;
		return pyth_dist(box.right - p.x, box.bottom - p.y); // Completely inside the box
	}
}

function pointToBoxDistance2(
	p = {
		x: 0,
		y: 0
	},
	box = {
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	}) {

	let corner = {};
	let centers = {};
	// let direction = undefined;
	corner.TL = pyth_dist(numeric_difference(box.left, p.x), numeric_difference(box.top, p.y)); //top left
	corner.BL = pyth_dist(numeric_difference(box.left, p.x), numeric_difference(box.bottom, p.y)); //bottom left
	corner.TR = pyth_dist(numeric_difference(box.right, p.x), numeric_difference(box.top, p.y)); //top right
	corner.BR = pyth_dist(numeric_difference(box.right, p.x), numeric_difference(box.bottom, p.y)); //bottom right

	corner.TL = pyth_dist(numeric_difference(box.left, p.x), numeric_difference(box.top, p.y)); //top left
	corner.BL = pyth_dist(numeric_difference(box.left, p.x), numeric_difference(box.bottom, p.y)); //bottom left
	corner.TR = pyth_dist(numeric_difference(box.right, p.x), numeric_difference(box.top, p.y)); //top right
	corner.BR = pyth_dist(numeric_difference(box.right, p.x), numeric_difference(box.bottom, p.y)); //bottom right

	let series = [corner.TL, corner.BL, corner.TR, corner.BR];
	let shortest = Math.min(...series);
	let longest = Math.max(...series);

	return shortest;
	// if(shortest === corner.TL )
	//     direction = 0;
	// else if(shortest === corner.BR)
	//     direction = 1;

	//else depends on position of prev and next

}

// Difference
const numeric_difference = (a, b) => Math.abs(a - b);
// Pythagorean Theorem, A*A + B*B = C*C
const pyth_dist = (A, B) => Math.sqrt(A ** 2 + B ** 2);



export let Displacer = Approach.Displacer;

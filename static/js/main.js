// The main entry point for the application
// Any and all javascript functions should be defined in the onReadyHandle function
// Approach is mapped to this wrapper function to allow for the same benefits as document ready
// This is a good place to put any global event handlers, or any other global functions

/**
 * onReadyHandle(element, selector, markup)
 * A function to give AJAX induced DOM mutations the same benefits as document ready
 *
 * Sometimes plugins have special delta functions separate from initialization -- in those
 * cases you will want to specialize this function with that updater function and leave init in the normal
 * document ready.
 *
 * @var element The element being altered
 * @var selector The selector (a query selector or a function) describing which DOM elements to alter
 * @markup the resulting payload of an Intent call. Usually HTML markup, could technically be JSON, raw text, etc
 *
 */
let onReadyHandle = function(element, selector, markup) {
    // this sets up any .Interface found inside the block changed by server responses
    // including doc ready
    $(element)
        .find('.Interface')
        .each(function(_, Markup) {
            let api = '/server.php';
            // Check if Markup has data-api attribute
            if ($(Markup).attr('data-api')) api = $(Markup).attr('data-api');

            Markup.Interface = new Interface({ Markup: Markup, api: api });
        });

    // account for when the element itself is the Interface
    if ($(element).hasClass('Interface')) {
        let api = '/service/api.json';
        if ($(element).attr('data-api')) api = $(element).attr('data-api');
        element.Interface = new Interface({ Markup: element, api: api });
    }

    // A utility function to animate elements
    const animateCSS = (element, animation, prefix = 'animate__') =>
        // We create a Promise and return it
        new Promise((resolve, _) => {
            const animationName = `${prefix}${animation}`;
            const node = document.querySelector(element);

            node.classList.add(`${prefix}animated`, animationName);

            // When the animation ends, we clean the classes and resolve the Promise
            function handleAnimationEnd(event) {
                event.stopPropagation();
                node.classList.remove(`${prefix}animated`, animationName);
                resolve('Animation ended');
            }

            node.addEventListener('animationend', handleAnimationEnd, { once: true });
        });


    // Normal document ready stuff, but relative to el
    // el.find(...).myPlugin(..)
    // ...

    $(element)
        .find('ul.Toolbar > li > .visual')
        .click(function() {
            $('ul.Toolbar > li').removeClass('active');
            $(this).parent().addClass('active');
            animateCSS('.active > ul', 'lightSpeedInRight');
        });

    $(element)
        .find('ul.Toolbar li .visual')
        .click(function() {
            if ($(this).parent().find('ul').length > 0) {
                $('.breadcrumbs').html('');
                $('ul.Toolbar li').removeClass('active');
                $(this).parent().addClass('active');
                $('ul.Toolbar li').removeClass('selected');
                $(this).parents('li').addClass('selected');

                animateCSS('.active > ul', 'lightSpeedInRight');

                var selectedEle = '';
                $(this)
                    .parents('li')
                    .each(function() {
                        if (!$(this).hasClass('active')) {
                            selectedEle += "<li><div class='visual'>";
                            selectedEle += $(this).find('.visual').html();
                            selectedEle += '</div></li>';
                        }
                    });
                selectedEle += "<li><div class='visual'>";
                selectedEle += $(this).html();
                selectedEle += '</div></li>';
                $('.breadcrumbs').append(selectedEle);
                var selectedOption = $(this).children('label').text();
                animateCSS('.breadcrumbs', 'fadeIn');
                $('#menuButtonText').text(selectedOption);
            }
        });

    //animateCSS('.Oyster', 'fadeIn');

    $(element)
        .find('.Oyster .breadcrumbs')
        .on('click', 'li', function(e) {
            $('.Oyster .breadcrumbs li').removeClass('active');
            e.stopPropagation();
            $(this).addClass('active');
        });
    $(element)
        .find('#menuButton')
        .click(function(e) {
            e.stopPropagation();
            $('.breadcrumbs').slideToggle();
            $(this).toggleClass('collapsed');
        });
    $(element)
        .find('.backBtn')
        .click(function(e) {
            if ($('li.active').parent('ul').parent('li').length > 0) {
                $('li.active')
                    .parent('ul')
                    .parent('li')
                    .children('.visual')
                    .trigger('click');
            }
        });

    // --> Add your custom event handlers here

    let req_gn = 1;
    $(element)
        .find('#add-input-group')
        .click(function() {
            req_gn++;
            $('#Requirements form').append(`
                <div id="input-group-${req_gn}" class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping-${req_gn}">${req_gn}</span>
                    <input type="text" name="requirements_${req_gn}" class="form-control" placeholder="Add a Requirement" aria-label="requirement" aria-describedby="addon-wrapping-${req_gn}">
                </div>
            `);
        });

    $(element)
        .find('#remove-input-group')
        // in future we try to avoid using id selectors and prefer relative to some active thing
        // you never know how many times a plugin will be used on same page
        .click(function() {
            if (req_gn > 1) {
                $(`#input-group-${req_gn}`).remove();
                req_gn--;
            }
        });

    let ob_gn = 1;
    $(element)
        .find('#add-obstacle')
        .click(function() {
            ob_gn++;
            $('#Survey form').append(`
            <div id="input-group-${ob_gn}" class="input-group flex-nowrap">
                <span class="input-group-text" id="addon-wrapping-${ob_gn}">${ob_gn}</span>
                <input type="text" class="form-control" name="obstruction_${ob_gn}" placeholder="Add a Requirement" aria-label="requirement" aria-describedby="addon-wrapping-${ob_gn}">
            </div>
            `);
        });

    $(element)
        .find('#remove-obstacle')
        .click(function() {
            if (ob_gn > 1) {
                $(`#input-group-${ob_gn}`).remove();
                ob_gn--;
            }
        });

    let group_no = 1;
    $(element)
        .find('#add-interest-group')
        .click(function() {
            group_no++;
            $('#Interests').append(`
                <div id="input-interest-${group_no}" class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping-${group_no}">${group_no}</span>
                    <input type="text" class="form-control" name="interest_${group_no}" placeholder="Add a Point of Interest" aria-label="interest" aria-describedby="addon-wrapping-${group_no}">
                </div>
            `);
        });

    $(element)
        .find('#remove-interest-group')
        .click(function() {
            if (group_no > 1) {
                $(`#input-interest-${group_no}`).remove();
                group_no--;
            }
        });

    let i_group_no = 1;
    $(element)
        .find('#add-interest-d-group')
        .click(function() {
            i_group_no++;
            $('#InterestsD').append(`
                <div id="input-interest-d-${i_group_no}" class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping-${i_group_no}">${i_group_no}</span>
                    <input type="text" class="form-control" name="d_interest_${i_group_no}" placeholder="Add a Point of Interest" aria-label="interest" aria-describedby="addon-wrapping-${i_group_no}">
                </div>
            `);
        });

    $(element)
        .find('#remove-interest-d-group')
        .click(function() {
            if (i_group_no > 1) {
                $(`#input-interest-d-${i_group_no}`).remove();
                i_group_no--;
            }
        });

    let hazard_group_no = 1;
    $(element)
        .find('#add-hazard-group')
        .click(function() {
            hazard_group_no++;
            $('#Hazards').append(`
                <div id="input-hazard-${hazard_group_no}" class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping-${hazard_group_no}">${hazard_group_no}</span>
                    <input type="text" class="form-control" name="hazard_${hazard_group_no}" placeholder="Add a Point of Interest" aria-label="interest" aria-describedby="addon-wrapping-${hazard_group_no}">
                </div>
            `);
        });

    $(element)
        .find('#remove-hazard-group')
        .click(function() {
            if (hazard_group_no > 1) {
                $(`#input-hazard-${hazard_group_no}`).remove();
                hazard_group_no--;
            }
        });

    $(element)
        .find('.tab-button')
        .click(function() {
            $('.tab-button').removeClass('active');
            $(this).addClass('active');

            $('.tab').removeClass('active');
            let tabId = $(this).attr('id');
            tabId = tabId.replace('tabBtn', 'tab');
            $('.' + tabId).addClass('active');

            animateCSS('.' + tabId, 'fadeIn');

            if (!window.location.href.includes('stage=')) {
                window.history.pushState(
                    '',
                    '',
                    window.location.href + '?stage=' + tabId.replace('tab', '')
                );
            }
            const newUrl = window.location.href.replace(
                /stage=\d/,
                'stage=' + tabId.replace('tab', '')
            );
            window.history.pushState('', '', newUrl);
        });

    // --> End DOM Ready stuff

};

$(document).ready(function() {
    Interface.prototype.RefreshComplete = onReadyHandle;
    onReadyHandle(document, null, null);
});

// for now, i'm just going to put this here

<?php

namespace ClimbUI;

global $menu;
require_once __DIR__ . '/support/lib/vendor/autoload.php';

require_once __DIR__ . '/layout.php';
require_once __DIR__ . '/head.php';

use Approach\Render\HTML;
use ClimbUI\Render\Intent;

$headerSection = new HTML(tag: 'section', classes: ['header']);

$headerSection[] = $backBtn = new HTML(tag: 'button', classes: ['backBtn']);

$backBtn[] = new HTML(tag: 'i', classes: ['expand ', 'fa ', 'fa-angle-left']);
$headerSection[] = $menuBtn = new HTML(tag: 'button', classes: ['btn ', 'btn-secondary ', 'current-state ', 'ms-2 ', 'animate__animated ', 'animate__slideInDown'], attributes: ['id' => 'menuButton']);

$menuBtn[] = new HTML(tag: 'span', attributes: ['id' => 'menuButtonText'], content: 'Location');
$menuBtn[] = new HTML(tag: 'i', classes: ['fa ', 'fa-caret-down']);

$headerSection[] = new HTML(tag: 'ul', classes: ['breadcrumbs'], attributes: ['style' => 'display: none']);

$toolBar = new HTML(tag: 'ul', classes: ['Toolbar']);

$signoutContent = <<<HTML
<button>
    <p>
        <i class="bi bi-box-arrow-right"></i> SignOut
    </p>
</button>
HTML;

$toolBar[] = new HTML(tag: 'div', classes: ['signOut'], content: $signoutContent);

$menu1 = new HTML(tag: 'li'); 
$visual = new HTML(tag: 'div', classes: ['visual']);
$visual->content = <<<HTML
    <i class="icon bi bi-list-check"></i>
    <label>Procedures</label>
    <i class="expand fa fa-angle-right"> </i>
HTML;
$menu1[] = $visual;

$childMenu1 = new HTML(tag: 'ul');
$childMenu1[] = $subMenu1 = new HTML(tag: 'li');

$subMenu1[] = $visual1 = new HTML(tag: 'div', classes: ['visual']);
$visual1->content = <<<HTML
    <i class="icon bi bi-list-check"></i>
    <label>View</label>
    <i class="expand fa fa-angle-right"> </i>
HTML;

$subMenu1[] = $controls1 = new HTML(tag: 'ul', classes: ['controls']);

// DANGER: DOESN'T WORK YET!
$controls1[] = $control1 = new HTML(tag: 'li', classes: ['control'], attributes: [
    'data-intent' => "{\"REFRESH\":{\"Sop\":\"View\"}}",
    'data-api' => '/server.php',
    'data-api-method' => 'POST',
    'data-content' => "{'_response_target':'#some_content > div', 'sop_id': 'cool_one'}"
]);

$visual1 = new HTML(tag: 'div', classes: ['visual']);
$visual1->content = <<<HTML
    <input class="checkbox" type="checkbox" data-task-complete="true" />
    <label>Cool One</label>
    <i class="expand fa fa-angle-right"></i>
HTML;
$control1[] = $visual1;

$menu1[] = $childMenu1;
$toolBar[] = $menu1;


$main = new HTML(tag: 'div', classes: ['Stage'], attributes: ['id' => 'main']);
$main[] = $oyster = new HTML(tag: 'div', classes: ['Oyster ', 'Interface ', 'animate__animated ', 'animate__fadeIn']);

$oyster[] = $headerSection;
$oyster[] = $toolBar;

$menu[] = $main;

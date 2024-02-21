<?php


namespace Tests\Acceptance;

use Tests\Support\AcceptanceTester;

class MenuCest
{
    public function checkMenuTest(AcceptanceTester $I):void
    {
        $I->amOnPage('/');
        $I->see('Location');

        $I->wantToTest("if the menu is rendered");
        $I->seeElement('.Interface > .Stage > .Screen > .Oyster');
    }

    public function checkHeader(AcceptanceTester $I):void{
        $I->amOnPage('/');
        $I->wantToTest("if the header is rendered");
        $I->seeElement('.header');
        $I->seeElement('.header > #menuButton');
        $I->seeElement('.header > .breadcrumbs');
    }
    public function checkControls(AcceptanceTester $I):void{
        $I->amOnPage('/');
        $ul = $I->grabMultiple('.control');
        $I->wantToTest("if the controls are rendered");        

        foreach($ul as $li){
            $I->seeElement('.controls');
        }
    }
}

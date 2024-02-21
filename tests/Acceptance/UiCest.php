<?php


namespace Tests\Acceptance;

use Tests\Support\AcceptanceTester;

class UiCest
{
    public function checkGeneralUI(AcceptanceTester $I):void
    {
        // Some basic page checks
        $I->amOnPage('/');
        $I->see('Location');
        $I->see('signout');

        // Check if the Interface class is where all the UI is rendered
        $I->wantToTest("if the stage is set");
        $I->seeElement('.Interface > .Stage');

    }

    public function checkContentBox(AcceptanceTester $I):void
    {
        $I->amOnPage('/');
        // The below checks if the content view box is rendered
        $I->wantToTest("if the content view box is rendered");
        $I->seeElement('.ViewPort > #some_content > div');
    }
}

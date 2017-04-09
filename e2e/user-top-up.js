'use strict';
describe('When a user clicks on Top-Up button', function(){
    it('his account becomes on 100 units more', function(){
        browser.get('http://localhost:8000/');
        var accountBeforeClick;
        var accountAfterClick;
        var topUpAmount = 100;
        element(by.model('vm.user.email')).sendKeys('test@test.com');
        element(by.model('vm.user.password')).sendKeys('123456');
        element(by.buttonText('Sign Up')).click();
        element(by.binding('vm.userData.account')).getText().then(function(text){
            accountBeforeClick = parseInt(text);

            element(by.buttonText('Top Up')).click();
            element(by.binding('vm.userData.account')).getText().then(function(text){
                accountAfterClick = parseInt(text);
                expect(accountAfterClick).toEqual(accountBeforeClick + topUpAmount);
                console.log('the difference is: ', accountAfterClick - accountBeforeClick);
            });
        });



    })
});
/**
 * Created by HP on 4/6/2017.
 */

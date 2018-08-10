/*jslint browser: true*/
/*global $, jQuery, alert*/

/*CLICKABLE PANELS*/

$(document).on('click', '.panel div.clickable', function (e) {
    'use strict';
    var $this = $(this),
        $panel = $this.parent('.panel'),
        $panel_body = $panel.children('.panel-body'),
        $display = $panel_body.css('display');

    if ($display === 'block') {
        $panel_body.slideUp();
    } else if ($display === 'none') {
        $panel_body.slideDown();
    }
});


/*AUTOCOLLAPSE OF PANELS*/

$(document).ready(function (e) {
    'use strict';
    var $classy = '.panel.autocollapse',
        $found = $($classy);
    $found.find('.panel-body').hide();
    $found.removeClass($classy);
});


/*STICKY MENU*/

$(document).ready(function () {
    'use strict';
    var stickyNavTop = $(".header__menu").offset().top,
        stickyNav = function () {
            var scrollTop = $(window).scrollTop(),
                menu_height = $(".header__menu").height();
            if (scrollTop > stickyNavTop + menu_height) {
                $('.sticky-menu').addClass('sticky');
            } else {
                $('.sticky-menu').removeClass('sticky');
            }
        };
    stickyNav();
    $(window).scroll(function () {
        stickyNav();
    });
});



/*BACKGROUND 12 MONTHS*/

window.onload = function () {
    'use strict';
    var date = new Date(),
        month = date.getMonth() + 1;
    $(".container-background").attr('id', "bg" + month);
};



/*SCROLL TO ANCHOR*/

$(function () {
    'use strict';
    $('.smoothScroll').click(function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000); // The number here represents the speed of the scroll in milliseconds
                return false;
            }
        }
    });
});



//CONTACT FORM SCRIPTS

$(document).ready(function () {
    'use strict';
    var form = $('#contact_subform');

    //SHOW STATUS MESSAGE
    function submitMSG(status, msg) {
        var msgClasses;
        if (status === 'success') {
            msgClasses = 'text-center text-success';
        } else if (status === 'warning') {
            msgClasses = 'text-center text-danger';
        }
        $('#msgSubmit').css('display', 'block');
        $('#msgSubmit').addClass(msgClasses).text(msg);
        window.setTimeout(function () {
            $('#msgSubmit').css('display', 'none');
        }, 1000);
    }

    //SEND MAIL
    function submitForm() {

        //FIND FORM CONTENT. PUT IT INTO VARIABLES
        var name = $('#name').val().replace(/<|>/g, ""),
            email = $('#email').val().replace(/<|>/g, ""),
            message = $('#message').val().replace(/<|>/g, ""),
            resp = grecaptcha.getResponse();

        $.ajax({
            type: 'POST',
            url: 'form.php',
            data: 'name=' + name + '&email=' + email + '&message=' + message + '&g-recaptcha-response=' + resp,
            success: function (text) {
                if (resp.length === 0) {
                    submitMSG('warning', 'Обязательно заполните поле reCAPTCHA!');
                } else {
                    $('#contact_subform')[0].reset();
                    grecaptcha.reset();
                    submitMSG('success', 'Ваше сообщение отправлено');
                }
            }
        });
    }

    //Validate form data and send form on success
    $('#contact_subform').validator().on('submit', function (event) {
        if (event.isDefaultPrevented()) {
            //INVALID DATA DETECTED
            submitMSG('warning', 'Ошибка! Проверьте, заполнили ли вы все поля и CAPTCHA');
        } else {
            //DATA IS OK
            event.preventDefault();
            submitForm();
            //submitMSG('success', 'Отправляем форму');
        }
    });
});

//CONTACT FORM PROGRESS

//SHOW/HIDE CAPTCHA
function showcaptcha() {
    'use strict';
    $('.g-recaptcha').removeClass('hidden fadeOutUp').addClass(' fadeInDown');
    $('#form-submit').removeClass('hidden fadeOutUp').addClass(' fadeInDown');
}

function hidecaptcha() {
    'use strict';
    $('.g-recaptcha').removeClass('fadeInDown').addClass('fadeOutUp');
    $('#form-submit').removeClass('fadeInDown').addClass('fadeOutUp');
}


//SHOW CAPTCHA WHEN ALL FIELDS WILL BE FILLED
function captchaappear() {
    'use strict';
    //FIND ALL FIELDS
    var $fval_name = $('#name'),
        $fval_email = $('#email'),
        $fval_message = $('#message');
    //SHOW CAPTCHA IF THEY ALL AREN'T EMPTY AND EMAIL IS CORRECT
    if (
        $fval_name !== null &&
            $fval_name.val() !== '' &&
            $fval_email !== null &&
            $fval_email.val() !== '' &&
            !$fval_email.parent().parent().parent().hasClass('has-error') &&
            $fval_message !== null &&
            $fval_message.val() !== ''
    ) {
        showcaptcha();
    } else {
        hidecaptcha();
    }
}

//ADD GREEN COLOR BORDERS AT FIELDS WITH DATA
function checkfill(id) {
    'use strict';
    var $v = $(id);
    if ($v !== null && $v.val() !== '') {
        //$v.css('border', '1px solid rgba(0, 255, 0, 0.2)');
        captchaappear();
    } else {
        //$v.css('border', '1px solid rgba(255, 255, 255, 0.2)');
        hidecaptcha();
    }
}

function checkfillemail() {
    'use strict';
    var $v = $('#email');
    if ($v !== null &&
            $v.val() !== '' &&
            !$v.parent().parent().parent().hasClass('has-error')
            ) {
        //$v.css('border', '1px solid rgba(0, 255, 0, 0.2)');
        captchaappear();
    } else if (
        $v !== null &&
            $v.val() !== '' &&
            $v.parent().parent().parent().hasClass('has-error')
    ) {
        //$v.css('border', '1px solid rgba(255, 0, 0, 0.2)');
        hidecaptcha();
    } else {
        //$v.css('border', '1px solid rgba(255, 255, 255, 0.2)');
        hidecaptcha();
    }
}

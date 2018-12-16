let timerOn = 0;

$(function () {
    showLoading(true);
    checkUserCookie();

    loadingTotalTime(true);
    fillMainTable();

    function onStart() {
        const collapseChild = $('.collapse-child');

        collapseChild.on('shown.bs.collapse', function (e) {

            loading($('#onWorkLoading'), true);
            const startDate = new Date();

            const obj = $('#' + this.id);
            obj.find('.current').text("Дата начала " + addLeadZeroToTime(startDate, false));

            timerOn++;

            const activityId = this.id.substring(this.id.lastIndexOf('-') + 1);

            startTime(startDate, obj.find('.timer'), activityId);

        });

        collapseChild.on('hide.bs.collapse', function () {
            timerOn--;
            loading($('#onWorkLoading'), false);
        });

        // interrupt activity
        // const collapseParent = $('.collapse-parent');
        // collapseParent.on('hide.bs.collapse', function (e) {
        //     if ($(this).is(e.target)) {
        //         const nested = $(this).find('.collapse-child');
        //
        //         $.each(nested, function (i, v) {
        //             if ($(v).hasClass('show')) {
        //                 $(v).collapse('hide');
        //             }
        //         });
        //     }
        // });

        $('.accordion-nested-btn').on('click', function (e) {
            const collapseChild = $('.collapse-child');
            $.each(collapseChild, function (i, v) {
                if (e.target.getAttribute('group-id') !== $(this)[0].getAttribute('group-id')) {
                    if ($(v).hasClass('show')) {
                        $(v).collapse('hide');
                    }
                }
            });

            const collapseElement = $('#' + e.target.getAttribute('collapse-child'));
            setTimeout(function () {
                if (!collapseElement.hasClass('show')) {
                    $(collapseElement).collapse('show');
                }

            }, 500);
        });

        showLoading(false);
    }

    $('#userName').on('click', function (e) {
        e.preventDefault();

        showUserAuthDialog(true);
    });

    $('#stopAllActivitiesBtn').on('click', function (e) {
        e.preventDefault();
        const collapseElement = $('.collapse-child');
        if (collapseElement.hasClass('show')) {
            $(collapseElement).collapse('hide');
        }
    });

    loadAccordion(onStart);
});

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function startTime(startDate, objTimer, activityId) {
    const today = new Date();

    const now = new Date(Math.abs(startDate - today));

    let hour = now.getUTCHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    if (timerOn) {

        // add a zero in front of numbers<10
        hour = checkTime(hour);
        minute = checkTime(minute);
        second = checkTime(second);
        objTimer.text("Время выполнеия " + hour + ":" + minute + ":" + second);
        t = setTimeout(function () {
            startTime(startDate, objTimer, activityId);
        }, 300);
    } else {
        const todayDateStr = addLeadZeroToDate(today, '-');
        const todayTimeStr = addLeadZeroToTime(now, true);

        checkUserCookie();
        let userId = getCookie('ui');

        loadingTotalTime(true);

        saveResult(activityId, todayDateStr, todayTimeStr, userId);

        return;
    }
}
let errorCounter = 0;
function saveResult(activityId, todayDateStr, todayTimeStr, userId) {
    $.post("index", {"activity": activityId, "date": todayDateStr, "time": todayTimeStr, "user": userId})
        .done(function () {
            tryAgainForError();
            $('#totalTimeInscription').css('color', 'darkgray');
        })
        .fail(function (xhr) {
            if (errorCounter <= 3){
                errorCounter++;
                saveResult(activityId, todayDateStr, todayTimeStr, userId)
            }
            errorCounter = 0;
            const notSavedActivityCookieValue = convertActivity(activityId, todayDateStr, todayTimeStr, userId);
            const currentNotSavedActivityValue = getCookie('ac');
            const newNotSavedActivityValue = addActivityValue(currentNotSavedActivityValue, notSavedActivityCookieValue);
            setCookie('ac', newNotSavedActivityValue);

            $('#totalTimeInscription').css('color', 'firebrick');

            showMessage('Ошибка ' + xhr.status, xhr.responseText);
        })
        .always(function () {
            fillMainTable();
        });
}

function convertActivity(activityId, todayDateStr, todayTimeStr, userId) {
    return activityId + '&' + todayDateStr + '&' + todayTimeStr + '&' + userId;
}

function addActivityValue(currentNotSavedActivityValue, notSavedActivityCookieValue) {
    return currentNotSavedActivityValue + '?' + notSavedActivityCookieValue;
}

function tryAgainForError() {
    const currentNotSavedActivityValue = getCookie('ac');
    if (currentNotSavedActivityValue !== null && currentNotSavedActivityValue.trim() !== '') {
        const currentNotSavedActivityArray = currentNotSavedActivityValue.split('?');
        let notSavedActivityValue = "";
        $.each(currentNotSavedActivityArray, function (i, v) {
            if (v.trim() !== '') {
                const entities = v.split('&');

                const cActivity = entities[0];
                const cTodayDateStr = entities[1];
                const cTodayTimeStr = entities[2];
                const cUserId = entities[3];

                $.post("index", {
                    "activity": cActivity,
                    "date": cTodayDateStr,
                    "time": cTodayTimeStr,
                    "user": cUserId
                }).fail(function () {
                    notSavedActivityValue = addActivityValue(notSavedActivityValue, v);
                }).done(function () {

                })
            }
        });
        eraseCookie('ac');
        setCookie('ac', '');

        if (notSavedActivityValue !== ""){
            setCookie('ac', notSavedActivityValue);
        }
    }
}

function addLeadZeroToTime(date, utc) {

    let h;
    if (utc) {
        h = date.getUTCHours().toString().length === 2 ? date.getUTCHours() : "0" + date.getUTCHours();
    } else {
        h = date.getHours().toString().length === 2 ? date.getHours() : "0" + date.getHours();
    }

    const m = date.getMinutes().toString().length === 2 ? date.getMinutes() : "0" + date.getMinutes();
    const s = date.getSeconds().toString().length === 2 ? date.getSeconds() : "0" + date.getSeconds();

    return h + ":" + m + ":" + s
}

function addLeadZeroToDate(date, del) {
    const d = date.getDate().toString().length === 2 ? date.getDate() : "0" + date.getDate();
    const m = (date.getMonth() + 1).toString().length === 2 ? date.getMonth() + 1 : "0" + date.getMonth() + 1;
    const y = date.getFullYear();

    return d + del + m + del + y
}

function fillMainTable() {
    const mainTable = $("#mainTable");
    const userId = getCookie('ui');


    mainTable.load("index/fragment/" + userId, function () {
        loadingTotalTime(false);
    });
}

function loading(loadObj, isRun) {
    if (isRun) {
        loadObj.removeClass('invisible');
    } else {
        loadObj.addClass('invisible');
    }
}

function loadingTotalTime(isRun) {
    const onSaveResultLoading = $('#onSaveResultLoading');
    const totalTime = $('#totalTime');
    if (isRun) {
        onSaveResultLoading.removeClass('invisible');
        onSaveResultLoading.css('display', 'inline');
        totalTime.css('display', 'none');
    } else {
        onSaveResultLoading.addClass('invisible');
        onSaveResultLoading.css('display', 'none');
        totalTime.css('display', 'inline');
    }
}

function loadAccordion(callBackFunc) {
    const accordion = $("#accordion");
    accordion.load("index/accordion", callBackFunc);
}

function showUserAuthDialog(hasCloseBtn) {
    const userAuthDialog = $('#userAuthDialog');
    // userAuthDialog.load("index/user", function() {
    //     $('#authDialog').modal();
    // });

    $.ajax({
        url: 'index/user',
        success: function (data) {
            userAuthDialog.html(data);

            const btnClose = $('#btn-close');
            if (hasCloseBtn) {
                btnClose.removeClass('invisible');
            } else {
                btnClose.addClass('invisible');
            }

            $("#modalTitle").html('Выбор пользователя');
            $('#authDialog').modal();
        },
        error: function (xhr) {
            showMessage('Ошибка ' + xhr.status, xhr.responseText);
        },
        complete: function () {
            // showLoadEffect(false);
        }
    });
}

function createUserCookie() {
    $('#authDialog').modal('hide');
    const user = $('#user option:selected');
    const userId = user.val();
    const userName = user.text().trim();

    setCookie('ui', userId, 365);
    setCookie('un', userName, 365);

    $('#userName').text("Пользователь : " + userName);

    loadingTotalTime(true);
    fillMainTable();
}

function setCookie(name, value, days) {
    eraseCookie(name);

    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function checkUserCookie() {
    const userCookie = getCookie('ui');

    if (userCookie === null || userCookie.trim() === '') {
        showUserAuthDialog(false);
    } else {
        let userName = getCookie('un');
        $('#userName').text("Пользователь " + userName);
    }
}
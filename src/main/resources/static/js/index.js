let timerOn = 0;

$(function () {


    showLoading(true);
    checkUserCookie();

    loadingTotalTime(true);
    fillTotalTime();

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

    $('#sentAllActivitiesBtn').on('click', function (e) {
        e.preventDefault();

        const onSaveResult = "onSaveResult()";
        showConfirm("Подтверждение", "Вы уверены, что хотите отправить результат?", onSaveResult);
    });

    loadAccordion(onStart);
});

function onSaveResult() {
    $('#confirmDialog').modal('hide');

    localStorage.removeItem("ac");

    const acc = localStorage.getItem("acc");
    if (acc !== null) {
        showLoading(true);

        const accParsed = JSON.parse(acc);
        $.each(accParsed, function (i, v) {
            const activityId = v.activityId;
            const todayDate = new Date(v.todayDate);
            const todayTime = new Date(v.todayTime);
            const userId = v.userId;

            saveResult(activityId, todayDate, todayTime, userId);
        });

        localStorage.removeItem("acc");
        const ac = localStorage.getItem("ac");
        if (ac !== null) {
            const acParsed = JSON.parse(ac);
            $.each(acParsed, function (i, v) {
                saveDataToLocalStorageArray(v);
            });
        }

        showLoading(false);
    }
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function startTime(startDate, objTimer, activityId) {
    const today = new Date();

    const now = new Date(Math.abs(startDate - today));

    if (timerOn) {
        objTimer.text(getFormattedTotalTime(now));
        t = setTimeout(function () {
            startTime(startDate, objTimer, activityId);
        }, 300);
    } else {

        checkUserCookie();
        let userId = getCookie('ui');

        loadingTotalTime(true);

        saveDataToLocalStorageArray(new MyDateTime(activityId, today.getTime(), now.getTime(), userId), "acc");
        fillTotalTime();

        return;
    }
}

function getFormattedTotalTime(now) {
    let hour = now.getUTCHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    // add a zero in front of numbers<10
    hour = checkTime(hour);
    minute = checkTime(minute);
    second = checkTime(second);

    return "Время выполнеия " + hour + ":" + minute + ":" + second;
}

let errorSaveResultCounter = 0;

function saveResult(activityId, todayDate, todayTime, userId) {
    const todayDateStr = addLeadZeroToDate(todayDate, '-');
    const todayTimeStr = addLeadZeroToTime(todayTime, true);


    // $.post("index", {"activity": activityId, "date": todayDateStr, "time": todayTimeStr, "user": userId})
    //     .done(function () {
    //         $('#totalTimeInscription').css('color', 'darkgray');
    //     })
    //     .fail(function (xhr) {
    //         if (errorSaveResultCounter <= 3) {
    //             errorSaveResultCounter++;
    //             saveResult(activityId, todayDate, todayTime, userId)
    //         } else {
    //             errorSaveResultCounter = 0;
    //
    //             saveDataToLocalStorageArray(new MyDateTime(activityId, todayDate.getTime(), todayTime.getTime(), userId), "ac");
    //
    //             $('#totalTimeInscription').css('color', 'firebrick');
    //
    //             showMessage('Ошибка ' + xhr.status, xhr.responseText);
    //         }
    //     })
    //     .always(function () {
    //         fillTotalTime();
    //     });

    $.ajax({
        type: "POST",
        async: false,
        url: 'index',
        data: {"activity": activityId, "date": todayDateStr, "time": todayTimeStr, "user": userId},
        success: function () {
            $('#totalTimeInscription').css('color', 'darkgray');
        },
        error: function (xhr) {
            if (errorSaveResultCounter <= 3) {
                errorSaveResultCounter++;
                saveResult(activityId, todayDate, todayTime, userId)
            } else {
                errorSaveResultCounter = 0;

                saveDataToLocalStorageArray(new MyDateTime(activityId, todayDate.getTime(), todayTime.getTime(), userId), "ac");

                $('#totalTimeInscription').css('color', 'firebrick');

                showMessage('Ошибка ' + xhr.status, xhr.responseText);
            }
        },
        complete: function () {
            fillTotalTime();
        },
    });

}


function saveDataToLocalStorageArray(data, itemName) {
    let localStorageValue = localStorage.getItem(itemName);
    let dateParsed;
    if (localStorageValue === null) {
        dateParsed = [];
        dateParsed.push(data);
        localStorage.setItem(itemName, JSON.stringify(dateParsed));
    } else {
        dateParsed = JSON.parse(localStorage.getItem(itemName));
        dateParsed.push(data);
        localStorage.setItem(itemName, JSON.stringify(dateParsed));
    }

}

function saveDataToCookieArray(data, cookieName) {
    let dateParsed = JSON.parse(getCookie(cookieName));
    dateParsed.push(data);
    setCookie(cookieName, JSON.stringify(dateParsed));
}
//
// class MyDateTime {
//     constructor(activityId, todayDate, todayTime, userId) {
//         this.activityId = activityId;
//         this.todayDate = todayDate;
//         this.todayTime = todayTime;
//         this.userId = userId;
//     }
// }

function MyDateTime(activityId, todayDate, todayTime, userId) {
    this.activityId = activityId;
    this.todayDate = todayDate;
    this.todayTime = todayTime;
    this.userId = userId;
}

function getActivityTotalTimeFromLocalStorage(userId) {
    let totalTime;
    const todayNum = new Date().getDay() + new Date().getMonth() + new Date().getFullYear();
    const myDateTimeFromCookieValue = localStorage.getItem("acc"); //getCookie("acc");
    if (myDateTimeFromCookieValue !== null && myDateTimeFromCookieValue.trim() !== "") {
        let myDateTimeFromCookie = JSON.parse(myDateTimeFromCookieValue);
        if (myDateTimeFromCookie !== null) {
            $.each(myDateTimeFromCookie, function (i, v) {
                const cActivity = v.activityId;
                const cTodayDate = new Date(v.todayDate);
                const cTodayTime = new Date(v.todayTime).getTime();
                const cUserId = v.userId;

                if (cUserId === userId) {
                    const dayNum = cTodayDate.getDay() + cTodayDate.getMonth() + cTodayDate.getFullYear();
                    if (todayNum === dayNum) {
                        if (totalTime === undefined) {
                            totalTime = cTodayTime;
                        } else {
                            totalTime = cTodayTime + totalTime;
                        }
                    }
                }
            })
        }
    }

    const totalTimeSpan = $("#totalTime");
    if (totalTime !== undefined) {
        totalTimeSpan.text(addLeadZeroToTime(new Date(totalTime), true));
    } else {
        totalTimeSpan.text("00:00:00");
    }
}


function getActivityTotalTimeFromCookie2(userId) {
    const currentNotSavedActivityValue = getCookie('acc');
    if (currentNotSavedActivityValue !== null && currentNotSavedActivityValue.trim() !== '') {
        const currentNotSavedActivityArray = currentNotSavedActivityValue.split('?');
        $.each(currentNotSavedActivityValue, function (i, v) {
            if (v.trim() !== '') {
                const entities = v.split('&');

                const cActivity = entities[0];
                const cTodayDateStr = entities[1];
                const cTodayTimeStr = entities[2];
                const cUserId = entities[3];

                if (cUserId === userId) {

                }
            }
        })
    }
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

        if (notSavedActivityValue !== "") {
            setCookie('ac', notSavedActivityValue);
        }
    }
}

function saveResultFromCookie() {
    const myDateTimeFromCookieValue = getCookie("acc");
    if (myDateTimeFromCookieValue !== null && myDateTimeFromCookieValue.trim() !== "") {
        let myDateTimeFromCookie = JSON.parse(myDateTimeFromCookieValue);
        if (myDateTimeFromCookie !== null) {
            $.each(myDateTimeFromCookie, function (i, v) {
                const cActivity = v.activityId;
                const cTodayDate = new Date(v.todayDate);
                const cTodayTime = new Date(v.todayTime);
                const cUserId = v.userId;


                saveResult(cActivity, todayDateStr, todayTimeStr, cUserId);
            })
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

function fillTotalTime() {
    const userId = getCookie('ui');

    setTimeout(function () {
        getActivityTotalTimeFromLocalStorage(userId);
        loadingTotalTime(false);
    }, 1000);


    // totalTime.load("index/fragment/" + userId, function () {
    //     loadingTotalTime(false);
    // });
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

let loadAccordionErrorCounter = 0;

function loadAccordion(callBackFunc) {
    const accordion = $("#accordion");

    let accordionFromLocalStorage = localStorage.getItem("accordion");
    if (accordionFromLocalStorage === null) {
        $.ajax({
            url: 'index/accordion',
            success: function (data) {
                accordionFromLocalStorage = data;
                localStorage.setItem("accordion", data);
                accordion.html(accordionFromLocalStorage);
            },
            error: function (xhr) {
                loadAccordionErrorCounter++;
                if (loadAccordionErrorCounter <= 3) {
                    loadAccordion(callBackFunc);
                }

                showMessage('Ошибка ' + xhr.status, xhr.responseText);
            },
            complete: function () {
                showLoading(false);
                callBackFunc();
            },
        });
    } else {
        accordion.html(accordionFromLocalStorage);
        callBackFunc();
    }


    // accordion.load("index/accordion", function (responseText, textStatus) {
    //     if (textStatus === "error") {
    //         loadAccordionErrorCounter++;
    //         if (loadAccordionErrorCounter <= 3) {
    //             loadAccordion(callBackFunc);
    //         }
    //     } else {
    //         loadAccordionErrorCounter = 0;
    //         callBackFunc();
    //     }
    // });
}

function showUserAuthDialog(hasCloseBtn) {
    const userAuthDialog = $('#userAuthDialog');
    // userAuthDialog.load("index/user", function() {
    //     $('#authDialog').modal();
    // });
    // localStorage.removeItem("users");
    let users = localStorage.getItem("users");

    if (users === null) {
        showLoading(true);

        $.ajax({
            async: false,
            url: 'index/user',
            success: function (data) {

                users = data;
                localStorage.setItem("users", data);

                const btnClose = $('#btn-close');
                if (hasCloseBtn) {
                    btnClose.removeClass('invisible');
                } else {
                    btnClose.addClass('invisible');
                }
            },
            error: function (xhr) {
                showMessage('Ошибка ' + xhr.status, xhr.responseText);
            },
            complete: function () {
                showLoading(false);
            },

        });
    }

    if (users) {
        userAuthDialog.html(users);

        $("#modalTitle").html('Выбор пользователя');
        $('#authDialog').modal();
    }
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
    fillTotalTime();
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

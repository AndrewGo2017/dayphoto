let timerOn = 0;

$(function () {
    showLoading(true);
    checkLocalStorage();

    loadingTotalTime(true);
    fillTotalTime();

    function onStart() {
        const collapseChild = $('.collapse-child');

        collapseChild.on('shown.bs.collapse', function () {

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


    $('#refreshAllBtn').on('click', function (e) {
        e.preventDefault();

        const onRefresh = "onRefresh()";
        showConfirm("Подтверждение", "Вы уверены, что хотите обновить данные приложения?", onRefresh);
    });

    loadAccordion(onStart);
});

function onRefresh() {
    localStorage.clear();
    $('#confirmDialog').modal('hide');
    showUserAuthDialog(false);
}

function onSaveResult() {
    $('#confirmDialog').modal('hide');

    // localStorage.removeItem("ac");

    const acc = localStorage.getItem("acc");
    if (acc !== null) {
        showLoading(true);

        const accParsedArray = [];
        const accParsed = JSON.parse(acc);
        $.each(accParsed, function (i, v) {
            const activityId = v.activity;
            const todayDate = addLeadZeroToDate(new Date(v.date), '-');
            const todayTime = addLeadZeroToTime(new Date(v.time), true);
            const userId = v.user;

            accParsedArray.push(new MyTotalTime(activityId, todayDate, todayTime, userId));
        });
        saveResultList(JSON.stringify(accParsedArray));
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

        checkLocalStorage();
        let userId = localStorage.getItem('ui');

        loadingTotalTime(true);

        saveDataToLocalStorageArray(new MyTotalTime(activityId, today.getTime(), now.getTime(), userId), "acc");
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

                saveDataToLocalStorageArray(new MyTotalTime(activityId, todayDate.getTime(), todayTime.getTime(), userId), "ac");

                $('#totalTimeInscription').css('color', 'firebrick');

                showMessage('Ошибка ' + xhr.status, xhr.responseText);
            }
        },
        complete: function () {
            fillTotalTime();
        },
    });

}

let errorSaveResultListCounter = 0;
function saveResultList(resultList) {
    $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: 'index/list',
        data: resultList,
        success: function () {
            $('#totalTimeInscription').css('color', 'darkgray');
            localStorage.removeItem("acc");
        },
        error: function (xhr) {
            if (errorSaveResultListCounter <= 3) {
                errorSaveResultListCounter++;
                saveResultList(resultList)
            } else {
                errorSaveResultListCounter = 0;

                $('#totalTimeInscription').css('color', 'firebrick');

                showMessage('Ошибка ' + xhr.status, xhr.responseText);
            }
        },
        complete: function () {
            fillTotalTime();
            showLoading(false);
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

// function saveDataToCookieArray(data, cookieName) {
//     let dateParsed = JSON.parse(localStorage.getItem(cookieName));
//     dateParsed.push(data);
//     localStorage.setItem(cookieName, JSON.stringify(dateParsed));
// }

function MyTotalTime(activityId, todayDate, todayTime, userId) {
    this.activity = activityId;
    this.date = todayDate;
    this.time = todayTime;
    this.user = userId;
}

function getActivityTotalTimeFromLocalStorage(userId) {
    let totalTime;
    const todayNum = new Date().getDay() + new Date().getMonth() + new Date().getFullYear();
    const myDateTimeLocalStorageValue = localStorage.getItem("acc");
    if (myDateTimeLocalStorageValue !== null && myDateTimeLocalStorageValue.trim() !== "") {
        let myDateTimeFromLocalStorage = JSON.parse(myDateTimeLocalStorageValue);
        if (myDateTimeFromLocalStorage !== null) {
            $.each(myDateTimeFromLocalStorage, function (i, v) {
                const cActivity = v.activity;
                const cTodayDate = new Date(v.date);
                const cTodayTime = new Date(v.time).getTime();
                const cUserId = v.user;

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

function addLeadZeroToTime(date, utc) {

    let h;
    if (utc) {
        h = date.getUTCHours().toString().length === 2 ? date.getUTCHours() : "0" + date.getUTCHours();
    } else {
        h = date.getHours().toString().length === 2 ? date.getHours() : "0" + date.getHours();
    }

    let m = date.getMinutes().toString().length === 2 ? date.getMinutes() : "0" + date.getMinutes();
    let s = date.getSeconds().toString().length === 2 ? date.getSeconds() : "0" + date.getSeconds();

    //weird behaviour on server...
    h = h.length === 2 ? h : h.toString().substring(1);
    m = m.length === 2 ? m : m.toString().substring(1);
    s = s.length === 2 ? s : s.toString().substring(1);

    return h + ":" + m + ":" + s
}

function addLeadZeroToDate(date, del) {
    const d = date.getDate().toString().length === 2 ? date.getDate() : "0" + date.getDate();
    const m = (date.getMonth() + 1).toString().length === 2 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    const y = date.getFullYear();

    return d + del + m + del + y
}

function fillTotalTime() {
    const userId = localStorage.getItem('ui'); //getCookie('ui');

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
                callBackFunc();
                showLoading(false);
            },
        });
    } else {
        accordion.html(accordionFromLocalStorage);
        callBackFunc();
        showLoading(false);
    }
}

function showUserAuthDialog(hasCloseBtn) {
    const userAuthDialog = $('#userAuthDialog');

    let users = localStorage.getItem("users");

    if (users === null) {
        showLoading(true);

        $.ajax({
            url: 'index/user',
            success: function (data) {

                users = data;
                localStorage.setItem("users", data);

                userAuthDialog.html(users);
                $("#modalTitle").html('Выбор пользователя');

                const btnClose = $('#btn-close');
                if (hasCloseBtn) {
                    btnClose.removeClass('invisible');
                } else {
                    btnClose.addClass('invisible');
                }

                $('#authDialog').modal();

            },
            error: function (xhr) {
                showMessage('Ошибка ' + xhr.status, xhr.responseText);
            },
            complete: function () {
                showLoading(false);
            },

        });
    } else{
        userAuthDialog.html(users);
        $("#modalTitle").html('Выбор пользователя');
        $('#authDialog').modal();
    }

}

function createUserLocalStorage() {
    $('#authDialog').modal('hide');
    const user = $('#user option:selected');
    const userId = user.val();
    const userName = user.text().trim();

    localStorage.setItem('ui', userId);
    localStorage.setItem('un', userName);

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
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function checkLocalStorage() {
    const userLocalStorage  = localStorage.getItem('ui');//

    if (userLocalStorage === null || userLocalStorage.trim() === '') {
        showUserAuthDialog(false);
    } else {
        let userName = localStorage.getItem('un');
        $('#userName').text("Пользователь " + userName);
    }
}

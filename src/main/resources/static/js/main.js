const entity = getValueFromUrl('/', true);

$(function () {
    $.ajaxSetup({
        timeout: 120000,
        cache: false
    });
    fillMainTable();
});

const tableCondition = $('#tableCondition').val(); // some condition if all data is not needed
function fillMainTable() {
    showLoading(true);
    const str = tableCondition !== undefined ? tableCondition : '';
    const mainTable = $("#mainTable");
    if (mainTable.length) {
        mainTable.load(entity + '/all' + str, function () {
            setMainTable();
        });
    } else {
        showLoading(false);
        // setMainTable(false, false);
    }
}

function setMainTable(isSearching, isPaging) {
    isSearching = typeof isSearching !== 'undefined' ? isSearching : true;
    isPaging = typeof isPaging !== 'undefined' ? isPaging : true;

    let id = 0;
    const elem = $('.main-table th');
    elem.each(function () {
        if ($(this).text() === 'Id') {
            id = elem.index(this);
        }
    });

    let searchValue = '';
    if (entity === 'statistic') {
        const userName = getCookie('un');
        if (userName !== null && userName !== '') {
            searchValue = userName;
        }
    }

    const table = $('.main-table');
    if (table.length) {
        table.DataTable({
            searching: isSearching,
            paging: isPaging,
            info: isPaging,
            language: {
                "processing": "Подождите...",
                "search": "Поиск:",
                "lengthMenu": "Показать _MENU_ записей",
                "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
                "infoEmpty": "Записи с 0 до 0 из 0 записей",
                "infoFiltered": "(отфильтровано из _MAX_ записей)",
                "infoPostFix": "",
                "loadingRecords": "Загрузка записей...",
                "zeroRecords": "Записи отсутствуют.",
                "emptyTable": "В таблице отсутствуют данные",
                "paginate": {
                    "first": "Первая",
                    "previous": "Предыдущая",
                    "next": "Следующая",
                    "last": "Последняя"
                }
            },
            "order": [[id, "asc"]],
            "scrollX": true,
            "columnDefs": [
                {"width": "100px", "targets": 0},
                {"width": "70px", "targets": 1}
            ]
        }).search(searchValue).draw();
        table.css('background-color', 'white');
    }

    showLoading(false);
}

function updateRow(id) {
    $.ajax({
        url: entity + '/' + id,
        success: function (data) {
            $("#dialog").html(data);

            if (id === 0) {
                $("#modalTitle").html('Создание');
            } else {
                $("#modalTitle").html('Редактирование');
            }

            $('#editRow').modal();
        },
        error: function (xhr) {
            showMessage('Ошибка ' + xhr.status, xhr.responseText);
        }
    });
}

function save() {
    const dialog_data = $('#detailsForm');
    $("#modalTitle").html("Создание");
    $.ajax({
        type: "POST",
        url: "",
        data: dialog_data.serialize()
    }).done(function () {
        $("#editRow").modal("hide");
        fillMainTable();
    });
}

function removeRow(id) {
    const deleteRow = "deleteRow('" + id + "')";
    showConfirm('Удаление', 'Вы уверены, что хотите удалить элемент?', deleteRow);
}

function showConfirm(header, text, onConfirm) {
    $('#confirmDialogHeader').text(header);
    $('#confirmDialogText').find('p').text(text);
    $('#btnYesConfirm').attr('onclick', onConfirm);
    $('#confirmDialog').modal();
}

function create() {
    updateRow(0);
}

function deleteRow(id) {
    $.ajax({
        url: entity + "/" + id,
        type: "DELETE"
    }).done(function () {
        fillMainTable();
    }).fail(function (xhr) {
        showMessage('Ошибка ' + xhr.status, xhr.responseText);
    }).always(function () {
        $('#confirmDialog').modal('hide');
    });
}

function getValueFromUrl(str, isAlphabetic) {
    const afterSymStr = location.href.substr(location.href.lastIndexOf(str) + str.length);
    if (isAlphabetic === true) {
        const indexOfNonCharSym = afterSymStr.search(/[^A-Za-z]/);
        return afterSymStr.substring(0, indexOfNonCharSym === -1 ? afterSymStr.length : indexOfNonCharSym);
    } else {
        return afterSymStr;
    }
}

function showMessage(header, text) {
    $('#messageDialogHeader').text(header);
    $('#messageDialogText').find('p').text(text);

    $('#messageDialog').modal();
}

function showLoading(isRunning) {
    const loadingDialog = $('#loadingDialog');
    if (isRunning) {
        console.log("show loading");
        loadingDialog.modal({
            backdrop: 'static',
            keyboard: false
        });
    } else {
        console.log("close loading");
        setTimeout(function () {
            loadingDialog.modal('hide')
        }, 500);
    }
}

function getDataFromLocalStarage() {

}



const entity = getValueFromUrl('/', true);

$(function () {
    fillMainTable();
});

const tableCondition = $('#tableCondition').val(); // some condition if all data is not needed
function fillMainTable() {
    const str = tableCondition !== undefined ? tableCondition : '';
    const mainTable = $("#mainTable");
    if (mainTable.length) {
        mainTable.load(entity + '/all' + str, function () {
            setMainTable();
        });
    } else{
        setMainTable(false, false);
    }
}

function setMainTable(isSearching, isPaging) {
    isSearching = typeof isSearching !== 'undefined' ? isSearching : true;
    isPaging = typeof isPaging !== 'undefined' ? isPaging : true;

    let id = 0;
    const elem = $('.main-table th');
    elem.each(function(){
        if( $(this).text()==='Id') {
            id = elem.index(this);
        }
    });

    const table = $('.main-table');
    table.DataTable({
        searching : isSearching,
        paging : isPaging,
        info : isPaging,
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
            { "width": "100px", "targets": 0 },
            { "width": "70px", "targets": 1 }
        ]
    });
    table.css('background-color', 'white');
    // $('body').removeClass('invisible');
}

function updateRow(id) {
    // showLoadEffect(true);

    $.ajax({
        url: entity + '/' + id,
        success: function (data) {
            $("#dialog").html(data);

            if (id === 0){
                $("#modalTitle").html('Создание');
            } else{
                $("#modalTitle").html('Редактирование');
            }

            $('#editRow').modal();
        },
        error:function (xhr) {
            const err = JSON.parse(xhr.responseText);
            showErrorMessage(err.message, 'Ошибка ' + err.status);
        },
        complete:function(){
            // showLoadEffect(false);
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

        // successNoty("common.saved");
    });
}

function removeRow(id) {
    var deleteRow = "deleteRow('" + id + "')";
    $('#btnDeleteContract').attr('onclick', deleteRow);

    $('#confirmDialog').modal();
}

function create() {

    updateRow(0);

    // $('#detailsForm').find(":input").val("");
    // $("#editRow").modal();
    //
    // $("#modalTitle").html(i18n["addTitle"]);
    // form.find(":input").val("");
    // $("#editRow").modal();
}

function deleteRow(id) {
    $.ajax({
        url: entity + "/" + id,
        type: "DELETE"
    }).done(function () {
        fillMainTable();
        // successNoty("common.deleted");
        $('#confirmDialog').modal('hide');
    });
}


function getValueFromUrl(str, isAlphabetic) {
    const afterSymStr = location.href.substr(location.href.lastIndexOf(str) + str.length);
    if (isAlphabetic === true){
        const indexOfNonCharSym = afterSymStr.search(/[^A-Za-z]/);
        return afterSymStr.substring(0, indexOfNonCharSym === -1 ? afterSymStr.length : indexOfNonCharSym);
    } else {
        return afterSymStr;
    }
}


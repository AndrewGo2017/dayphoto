$(function () {
    $('.date').datepicker({
        format: 'dd.mm.yyyy',
        language: 'ru',
        autoclose: true
    });

    $('#datetimepickerFromText').val(addLeadZeroToDate(new Date(), '.'));
    $('#datetimepickerToText').val(addLeadZeroToDate(new Date(), '.'));
});

function changeResult() {
    const type = $('#statisticType').val();
    const mainTable = $("#mainTable");

    const datetimepickerFrom = $('#datetimepickerFromText').val();
    const datetimepickerTo = $('#datetimepickerToText').val();

    console.log("datetimepickerFrom", datetimepickerFrom);
    console.log("datetimepickerTo", datetimepickerTo);

    if (datetimepickerFrom === '' || datetimepickerTo === '')
        return;

    if (mainTable.length) {

        showLoading(true);

        mainTable.load(entity + '/all/' + type + '/' + datetimepickerFrom + '/' + datetimepickerTo, function () {
            setMainTable();
        });
    } else {
        setMainTable(false, false);
    }
}

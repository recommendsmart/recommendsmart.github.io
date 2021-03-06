/**
 * @file
 * Simple Calculator js.
 */
(function ($) {
// Make sure our objects are defined.
Drupal.EMICalculator = Drupal.EMICalculator || {};

Drupal.behaviors.emiCalculator = {
    attach: function (context, settings) {
        $("#edit-calculate", context).click(function (event) {
            $('#table-box').html('');
            Drupal.EMICalculator.cmdCalc_Click(this.form);
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    }
};
/**
 * Calculation after a click
 */
Drupal.EMICalculator.cmdCalc_Click = function (form) {
    $('#table-box').html('');
    var principal = $('#edit-emicalculator-1-emi-value').val();
    var interest = $('#interest_rate').val();
    var period = $('#edit-emicalculator-3-emi-value').val();
    // To calculate rate percentage.
    var rate = interest / (12 * 100);
    // To calculate compound interest.
    var prate = (principal * rate * Math.pow((1 + rate), period)) / (Math.pow((1 + rate), period) - 1);
    // To parse emi amount.
    var emi = Math.ceil(prate * 100) / 100;
    var round_emi = Math.round(emi.toFixed(2));
    // To calculate total amount.
    var tot = Math.round(emi * period * 100) / 100;
    var round_total = Math.round(tot);
    var int_amt = round_total - principal;
    $('#edit-emicalculator-values-1-emi-value').val(round_emi);
    $('#edit-emicalculator-values-2-emi-value').val(int_amt);
    $('#edit-emicalculator-values-3-emi-value').val(round_total);
    var beginning_balance = principal;
    var i = 0;
    if (principal.length > 0 && interest.length > 0 && period.length > 0) {
        var content = "<table class='loan-table'><thead><tr><th># Month</th>" +
                "<th>Starting Balance</th><th>Rate of Interest</th><th>Amount to be paid</th>" +
                "<th>Closing Balance</th></tr></thead><tbody></tbody>";
        for (i = 1; i <= period; i++) {
            interest = Math.round(rate * beginning_balance);
            var start_balance = Math.round(beginning_balance);
            var remaining_balance = Math.abs(Math.round(beginning_balance - (round_emi - interest)));
            content += '<tr><td>' + i + '</td><td>' + start_balance + '</td><td>' + interest + '</td><td>' + round_emi + '</td><td>' + remaining_balance + '</td></tr>';
            beginning_balance -= round_emi - interest;
        }
        content += "</table>";
        $('#table-box').append(content);
     }
     // Print Emi.
    $('#edit-print').unbind().click(function () {
        var printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write($("#table-box").html());
        printWindow.document.close();
        printWindow.print();
    });
}
}(jQuery));

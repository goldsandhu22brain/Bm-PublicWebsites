/*--------------------------------------*/

/*Date Range
/*--------------------------------------*/
$(function() {
  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    startDate: moment().startOf('hour'),
    endDate: moment().startOf('hour').add(32, 'hour'),
    locale: {
      format: 'M/DD/YYYY hh:mm A'
    }
  });
});
/*--------------------------------------*/

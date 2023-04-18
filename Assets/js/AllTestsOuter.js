$(document).ready(function () {
    $(document).on('click', '.anchorClick', function () {
        
       // $("#dvModalTestsCat").css('display', 'none');
        $("#dvModalBodyTable").html(' Loading...');
        var catIDName = $(this).find('input:hidden.hdnCatIDSelect').val();

        var splitName = catIDName.split('^');
        var catID = splitName[0];
        var catName = splitName[1];

        $.ajax({
            type: 'POST',
            cache: false,
            async: true,
            contentType: 'application/json; charset=utf-8',
            url: '/tests.aspx/GetTestsDetailByCatID',
            data: JSON.stringify({ 'catID': catID }),
            dataType: 'json',
            success: function (response) {
                var result = response.d;

                if (result.length > 0) {

                  
                    var table = new TableCreation.Refer();
                    table.RowsCreate = result.length;
                    table.ColumnsCreate = 4;
                    table.TableContainer = document.getElementById("dvModalBodyTable");
                    var mainTable = table.CreateTable('table table-bordered', 'tblAvailableTime');
                    var colName = ['Sr No.', 'Test Name', 'Price', 'Action'];
                    var tableHead = table.CreateHead(colName, mainTable);
                    var tableBody = table.CreateBody();

                    for (i = 0; i < result.length; i++) {
                        var testDetail = new Array();
                        var crsDesc = '';
                        testDetail.push(['textNode', 'textNode:' + encodeHtmlEntity(result[i].TestName) + '']);
                        testDetail.push(['textNode', 'textNode:$' + result[i].Rate + '']);
                        //   testDetail.push(['a', 'href:#', 'textNode:' + encodeHtmlEntity("View Details")]);
                        if (result[i].CrsDescription != null) {
                            if (result[i].CrsDescription.indexOf(".html") >= 0 | result[i].CrsDescription.indexOf("index.aspx") >= 0) {
                                //alert(this.records[k].CrsDescription + " First");
                                crsDesc = "../courses/" + result[i].CrsDescription;
                            }
                            else {
                                crsDesc = "../" + result[i].CrsDescription;
                            }
                        }
                        else {
                            crsDesc = "../online/tests/" + result[i].Id + "/" + GenerateSEOFriendlyURL(result[i].TestName);
                        }

                        testDetail.push(['input', 'type:button', "data:" + encodeHtmlEntity(crsDesc) + "", "class:btn btn-md btn-block btn-my btnSelectViewTest", "value:View Details"]);
                        
                        var tableRowCell = table.CreateTbodyRow(testDetail, isSrNo = true, i);
                        tableBody.appendChild(tableRowCell);
                        mainTable.appendChild(tableHead);
                        mainTable.appendChild(tableBody);

                       // table.TableContainer.innerHTML = "";
                        table.TableContainer.appendChild(mainTable);

                        //alert($(mainTable).html());

                    }
                }
                else {
                    var divMain = document.getElementById("dvModalBodyTable");
                    var divChild = document.createElement('div');
                    divChild.appendChild(document.createTextNode('No Record(s) found.'));
                    divMain.innerHTML = '';
                    divMain.appendChild(divChild);
                }
                $("#bTestTitle").html(catName);
                //("#dvModalBodyTable").html('');
               // $("#dvModalTestsCat").show();
                $("#dvModalTestsCat").modal('show');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            }
        });

    });

    $(document).on('click', '.btnSelectViewTest', function () {

        var crsDesc = $(this).attr('data');
        //  alert(UserTestID);
        var apiUrl = '/';
        window.open('/' + crsDesc, '_blank');

    });
});
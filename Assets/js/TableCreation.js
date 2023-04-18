var TableCreation = {};
TableCreation.Refer = function () {
    this.RowsCreate = 10;
    this.ColumnsCreate = 3;
    this.TableContainer = "#dvTable";
    this.CreateTable = function (ClassAdd, tableId) {
        var tbl = (document.createElement("TABLE"));
        if (tableId != '')
            tbl.setAttribute('id', tableId);
        if (ClassAdd != '')
            tbl.setAttribute('class', ClassAdd);


        return tbl;

    };
    this.CreateHead = function (columnName, mainTable) {

        var thead = (document.createElement("thead"));

        this.ColumnsCreate = columnName.length;

        var headerRow = this.CreateRow();
        for (var i = 0; i < this.ColumnsCreate; i++) {

            var headerCell = (document.createElement('th'));
            headerCell.innerHTML = columnName[i];
            headerRow.appendChild(headerCell);
        }
        thead.appendChild(headerRow);
        //  mainTable.appendChild(thead);
        // alert(mainTable.innerHTML);

        return thead;
    };


    this.CreateBody = function (mainTable) {
        var tBody = (document.createElement('tbody'));
        return tBody;
    };
    this.CreateRow = function () {
        var tblRow = (document.createElement("tr"));
        return tblRow;
    };
    this.CreateCellForRow = function () { };
    this.CreateTbodyRow = function (tableBodyDetail, IsSrNo, srCount) {
        var cell;
        var inputElm;

        var tblRow = (document.createElement("tr"));
        //tBody.appendChild(tblRow);
        if (IsSrNo) {
            //Creating a cell fro Sr.No
            var srCell = document.createElement('td');
            srCell.appendChild(document.createTextNode(srCount + 1));

            // Appending a Sr.No. cell to the row.
            tblRow.appendChild(srCell);
        }
        for (var j = 0; j < tableBodyDetail.length; j++) {
            var cell = (document.createElement('td'));
            // cell.innerHTML = "<input type='text' class='form-control'  />";
            for (var k = 0; k < tableBodyDetail[j].length; k++) {

                if (k == 0) {
                    if (tableBodyDetail[j][k] != 'textNode') {
                        inputElm = document.createElement(tableBodyDetail[j][k]);
                    }

                }
                else {

                    var splitAttr = tableBodyDetail[j][k].split(':');


                    if (splitAttr[0].toLowerCase() == 'textNode'.toLowerCase()) {

                        inputElm = document.createTextNode(decodeHtmlEntity(splitAttr[1]));

                    }
                    else
                        inputElm.setAttribute(splitAttr[0], decodeHtmlEntity(splitAttr[1]));
                }
                // cell.html('<input id="' + className + '" type="' + inputField + '" class="form-control ' + className + '" placeholder="' + placeholder + '" >');


            }
            cell.appendChild(inputElm);

            tblRow.appendChild(cell);
        }


        return tblRow;
    };
};


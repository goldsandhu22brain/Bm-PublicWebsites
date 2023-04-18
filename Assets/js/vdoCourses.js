var pager = new Pager.Paging();//create object of Paging class
var records = null;
var showAllRecord=false;
$(document).ready(function () {
	 if (sessionStorage.getItem("filter")!=null)
	 {
		 sessionStorage.removeItem('filter');
	 }
	  if (sessionStorage.getItem("page")!=null)
	 {
		 sessionStorage.removeItem('page');
	 }
	 
    $("#ulCourseGrp a").click(function (e) {
       
        var id = $(this).attr("id");
        $("#ulCourseGrp a").removeClass("active");
        $(this).addClass("active");
        $("#courseGrpNameHeader").text("Category");
        $("#courseGrpName").text("");
        $("#courseGrpName").text($(this).find("h4").text());
       
        GetCoursesById(id, "", false);
		
        $('#txtSrch').val('');
       // $('#cmbFiltersByPrice').find('option:eq(0)').prop('selected', true);
       // $('#cmbFilters').find('option:eq(0)').prop('selected', true);
		
		         var filter ={vdoCatId:id,srch:'',isSearch:false	};
				var objFilter =JSON.stringify(filter);
				 sessionStorage.setItem("filter", objFilter);
				  if (e.originalEvent) {
					  sessionStorage.setItem("page", 1);
				  }
		
        e.preventDefault();
    });

    $("#ulPaging li").click(function (e) {
        var number = $(this).text();
        e.preventDefault();
    });
	
	
	
	 if (sessionStorage.getItem("filter")!=null)
 {
   var filter= JSON.parse(sessionStorage.getItem("filter"));
   console.log(filter);
  
  if(filter.isSearch==true)
  {
     var value=filter.srch;
    $("#txtSrch").val(value);
	setTimeout(function(){  $("#btnSrch").click() }, 1000);
	
  
  }
  else if(filter.vdoCatId>0)
  {
	 
       $("#ulCourseGrp a").eq(filter.vdoCatId).click();
  }
  else
  {
	  $("#ulCourseGrp a").eq(0).click();
  }
  
  
   if(sessionStorage.getItem("page") !=null)
 {
	 var page =sessionStorage.getItem("page");
	 //Pager.showPage(page);
	
	///setTimeout(function(){  pager.showPage(page); }, 4000);
 }
 }
 else
 {
	 $("#ulCourseGrp a").eq(0).click();
 }

    

    $("#btnSrch").click(function (e) {
        $("#ulCourseGrp a").removeClass("active");
        $("#ulCourseGrp a").eq(0).addClass("active");
        $("#courseGrpName").text($("#txtSrch").val());
        $("#courseGrpNameHeader").text("Search");
        GetCoursesById($("#ulCourseGrp a.active").attr("id"), $("#txtSrch").val(), true);
		
		        var filter ={vdoCatId:0,srch:$("#txtSrch").val(),isSearch:true				};
				var objFilter =JSON.stringify(filter);
				sessionStorage.setItem("filter", objFilter);
				  if (e.originalEvent) {
					  sessionStorage.setItem("page", 1);
				  }
        e.preventDefault();
    });
    $("#txtSrch").keypress(function (e) {
        if (e.which == 13) {
            $("#btnSrch").click();
            e.preventDefault();
        }
    });
    $("#cmbFilters").change(function () {
        $("#courseGrpNameHeader").text("Category");
        $("#courseGrpName").text($("#cmbFilters option:selected").attr('crstxt'));
        $("#ulCourseGrp li").removeClass("active");
        $("#ulCourseGrp li").eq(0).addClass("active");
        GetCoursesById($("#ulCourseGrp li.active").attr("id"), $("#txtSrch").val(), true);
    });
    $("#cmbFiltersByPrice").change(function () {
        $("#courseGrpNameHeader").text("Category");
        $("#courseGrpName").text($("#cmbFiltersByPrice option:selected").attr('crstxt'));
        $("#ulCourseGrp li").removeClass("active");
        $("#ulCourseGrp li").eq(0).addClass("active");
        GetCoursesById($("#ulCourseGrp li.active").attr("id"), $("#txtSrch").val(), true);
    });   
});

function paging() {
    pager.recordsPerPage = 15; // set amount elements per page
    pager.pagingContainer = '#ulPaging'; // set of main container
    pager.records = $(records, pager.pagingContainer); // set of required containers
    pager.pagingContainerPath = '#boxBody';//set paging container path    
    pager.showPage(1);
}

function showLoading(isLoad) {
    if (isLoad) {
        $("#pageloaddiv").css("display", "inherit");

    } else {
        $("#pageloaddiv").css("display", "none");
    }
}


function GetCoursesById(groupId, srch, isSearchTrue) {
    showLoading(true);
    $.ajax({
        type: 'POST',
        cache: false,
        async: true,
        contentType: 'application/json; charset=utf-8',
        url: 'VideoCourses.aspx/GetCoursesById',
        data: JSON.stringify({ 'vdoCatId': groupId, 'srch': srch, 'isSearch': isSearchTrue }),
        dataType: 'json',
        success: function (response) {
            if (response.d != "" && response.d != undefined && response.d.length > 0) {
                $("#boxBody").show();
                $("#ulPaging").show();
                $("#cmbFilters").prop('disabled', false);
                $("#emptysrchCourses").css("display", "none");
				
                records = response.d;
				 if(groupId=="0" && srch=="" && isSearchTrue==false)
				 {
					 showAllRecord=true;
				records= records.concat(records)
				records= records.concat(records)
				records= records.concat(records)
				 }
				 else{
					  showAllRecord=false;
			
				 }

				//$.extend( true, records, response.d );

                paging();
            }
            else {
                //Warning("No result found");
                $("#cmbFilters").prop('disabled', 'disabled');
                $("#boxBody").html('');
                $("#boxBody").hide();
                $("#ulPaging").hide();
                $("#emptysrchCourses").css("display", "inherit");
            }
          
			
			 if(sessionStorage.getItem("page") !=null)
 {
	 var page =sessionStorage.getItem("page");
	 //Pager.showPage(page);
	
	setTimeout(function(){  pager.showPage(page); }, 10);
 }
   showLoading(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        }
    });
}
var Pager = {};
Pager.Paging = function () {
    this.recordsPerPage = 3;
    this.currentPage = 1;
    this.pagingControlsContainer = '#ulPaging';
    this.pagingContainerPath = '#boxBody';

    this.numPages = function () {
        var numPages = 0;
        if (this.records != null && this.recordsPerPage != null) {
            numPages = Math.ceil(this.records.length / this.recordsPerPage);
        }

        return numPages;
    };

    this.showPage = function (page) {
        $("body").animate({
            scrollTop: 0
        }, 500);
        this.currentPage = page;
		 if(page !=1)
		 {
		sessionStorage.setItem("page", page);
		 }
        var html = '';
        $("#boxBody").text("");
		var htm='';
        var myindex = 1;
        $(this.pagingContainerPath).text("");
        this.records.slice((page - 1) * this.recordsPerPage,
            ((page - 1) * this.recordsPerPage) + this.recordsPerPage).each(function () {
                var replacestr = this.CourseName.replace(/ /g, "-");
				replacestr = replacestr.replace(/\+/g, "-");
				replacestr=GenerateSEOFriendlyURL1(replacestr);

                var dataplacement = myindex % 3 == 0 ? "left" : "right";

                var rat = this.CourseRating;
                var $starHtml=''
                for (var i = 0; i < 5; i++) {
                    if (i <= parseInt(rat) - 1) {
                        $starHtml += '<i class="glyphicon glyphicon-star"></i>';
                    }
                    else {
                        $starHtml += '<i class="glyphicon glyphicon-star-empty"></i>';
                    }
                }
                $starHtml += '(' + this.Rating + ')';
                html += '<div class="col-md-4 col-sm-6" >' +
                    '<div class="col-md-12 cbox vbox"   data-val="div' + this.Id + '">' +
                    '<a class="anchorClickUpper " style="display:block;"  data-toggle="popover" title="' + this.CourseName + '" data-placement="' + dataplacement + '" '
                    + 'data-content="<div class=vidduration><span><i class=&quot;glyphicon glyphicon-time&quot;></i>' + this.VideoDuration + ' total hours </span> <span class=enroled> <i class=&quot;glyphicon glyphicon-user&quot;></i>Tolal Enrolled:' + this.UserEnrolledCourses + ' </span> </div><br/><div class=bodytext>' + htmlEntities(this.AboutCourse) + '</div><br/><div class=popover-footer><a rel=&quot;noindex,nofollow&quot; class=&quot;btn btn-success pull-left&quot; href=&quot;/Individual/MyCart.aspx?vcid=' + this.Id +'%26uType%3Dind&quot;>Add to cart </a><a rel=&quot;noindex,nofollow&quot; class=popover-wishlist href=&quot;/Individual/wishlist.aspx?uType=ind%26vcid='+this.Id+'&quot; ><i class=&quot;glyphicon glyphicon-heart&quot;></i> </a></div>" > '
				if(parseInt(this.Id)>0)
				{
					//html += '<img src="/images/VideoCourse/Banner/245.jpg">'
					//html += '<img src="/images/VideoCourse/Banner/245.jpg">'
					html += '<img src="/images/VideoCourse/Banner/' +(parseInt(this.Id)) + '.jpg" alt="' +this.CourseName +'">'
					
				}
				else
				{
					html += '<img src="/images/VideoCourse/Banner/' +(parseInt(this.Id) % 5 + 1) + '.jpg" alt="' +this.CourseName +'">'
				}
                           
                html += '<p class="Cenroll"><i class="glyphicon glyphicon-king"></i>' + this.UserEnrolledCourses + ' Enrolled   </p>  ' +

                    '' +                   
                        '<h1><span class="hrefVideoTitle" href="/video/' + this.Id + '/' +replacestr + '-videocourses.aspx" style="text-decoration: none; color: black;">' + this.CourseName + '</span>' +
                    '</h1></a><a href="Reviews.aspx"  target="_blank"><span class="rat" > ' + $starHtml + ' </span ></a> ' +
                        '<div class="cboxfoot">' +
                    '<a id="hrefVideo" target="_blank" class="enroll" href="/video/' + this.Id + '/' + replacestr + '-videocourses.aspx">View Detail</a>' +
                    
                    '<p><span style="text-decoration: line-through;color:red;font-weight:bold;">$399</span> ' + ((this.Country == 'IN' ? '₹' : '$') + " " + this.Price) + ' </p>' +
                    
                        '</div>' +
                    '</div>' +
                    '</div></a>';
               

               //  htm +='<tr><td> &lt;url&gt;&lt;loc&gt; https://www.brainmeasures.com/video/' + this.Id + '/' +replacestr + '-videocourses.aspx&lt;/loc&gt; &lt;priority&gt;0.5&lt;/priority&gt;  &lt;/url&gt;</td></tr>'
              
                myindex++;


            });

        $(this.pagingContainerPath).append(html);
       //$("#tblRun").html(htm);
        renderControls(this.pagingControlsContainer, this.currentPage, this.numPages());

        $('[data-toggle="popover"]').popover({  trigger: "manual", html: true, animation: false })
            .on("mouseenter", function () {
                var _this = this;
                $(this).popover("show");
                $(".popover").on("mouseleave", function () {
                    $(_this).popover('hide');
                });
            }).on("mouseleave", function () {
                var _this = this;
                setTimeout(function () {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide");
                    }
                }, 300);
            });
    }

    var renderControls = function (container, currentPage, numPages) {
		 if(showAllRecord)
		 {
		var j=0;
        if (currentPage == 1) {
            var pagingControls = "<li><a href='#'>«</a></li>";
        }
        else {
            var pagingControls = "<li><a href='#' onClick='pager.showPage(" + (parseInt(currentPage) - 1) + ");return false'>«</a></li>";
        }
        for (var i = 1; i <= numPages; i++) {
            if (i != currentPage) {
				 if(i<=6)
				 {
                pagingControls += '<li><a href="#" onClick="pager.showPage(' + i + ');return false">' + i + '</a></li>';
				 }
				 else{
					  if(j==0)
					  {
					 pagingControls +='<li><a href="#">....</a></li>'
					  }
					  j++;
				 }
				 
				 
            } else {
                pagingControls += '<li class="active"><a href="#">' + i + '</a></li>';
            }
        }
        if (currentPage == numPages) {
            pagingControls += '<li><a href="#">»</a></li>';
        }
		
        else {
			  pagingControls += '<li><a href="#" onClick="pager.showPage(' + parseInt(i-1) + ');return false">' + parseInt(i-1)+ '</a></li>';
            pagingControls += '<li><a href="#" onClick="pager.showPage(' + (parseInt(currentPage) + 1) + ');return false">»</a></li>';
        }
        $(container).html(pagingControls);
		 }
		 
		 else
		 {
			  if (currentPage == 1) {
            var pagingControls = "<li><a href='#'>«</a></li>";
        }
        else {
            var pagingControls = "<li><a href='#' onClick='pager.showPage(" + (parseInt(currentPage) - 1) + ");return false'>«</a></li>";
        }
        for (var i = 1; i <= numPages; i++) {
            if (i != currentPage) {
                pagingControls += '<li><a href="#" onClick="pager.showPage(' + i + ');return false">' + i + '</a></li>';
            } else {
                pagingControls += '<li class="active"><a href="#">' + i + '</a></li>';
            }
        }
        if (currentPage == numPages) {
            pagingControls += '<li><a href="#">»</a></li>';
        }
        else {
            pagingControls += '<li><a href="#" onClick="pager.showPage(' + (parseInt(currentPage) + 1) + ');return false">»</a></li>';
        }
        $(container).html(pagingControls);
			 
			 
		 }
    }
}

function GenerateSEOFriendlyURL1(Title) {
    var strTitle = Title;
    strTitle = strTitle.trim();
    strTitle = strTitle.trim("-");
    strTitle = strTitle.toLowerCase();
    var char = "$%@!*?;:~`+=()[]{}|\'<>,/^&.".split("");
    strTitle = strTitle.replace(/c#(\S*)/g, "C-Sharp");
    strTitle = strTitle.replace(/\vb.net/g, "VB-Net");
    strTitle = strTitle.replace(/\asp.net/g, "Asp-Net");
    strTitle = strTitle.replace(/\./g, "-");
    for (var i = 0; i < char.length; i++) {
        var strchar = char[i];
        if (strTitle.indexOf(strchar) > -1) {
            strTitle = strTitle.replace(strchar, "");
        }
    }
    strTitle = strTitle.replace(/\s/g, "-");
    strTitle = strTitle.replace(/\--/g, "-");
    strTitle = strTitle.replace(/\---/g, "-");
    strTitle = strTitle.replace(/\----/g, "-");
    strTitle = strTitle.replace(/\-----/g, "-");
    strTitle = strTitle.replace(/\----/g, "-");
    strTitle = strTitle.replace(/\---/g, "-");
    strTitle = strTitle.replace(/\--/g, "-");
    strTitle = strTitle.trim();
   
    return strTitle;
}


 
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
 
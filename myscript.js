$(document).ready(function () {
    $('.toast_cancel').click(function () {
        $('.toast_msg').hide();
    });
    $('[data-toggle="tooltip"]').bttooltip(); // run tooltip
});
//cookie set and get function 
function setCookie(name, value, Exp_minutes,path="path=/") {
    var d = new Date();
    d.setTime(d.getTime() + (Exp_minutes*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";"+path;
}
//scroll focus change 
function result_focus(id){
    var elemOff = $("#"+id).offset().top;
    elemOff = elemOff-100;
    $("html, body").animate({ scrollTop: elemOff }, 500);
}
function selectText(id){
    window.getSelection().selectAllChildren(
        document.getElementById(id)
    );
}
function setTooltip(ev,message) {
    $(ev)
        .attr('data-original-title', message)
            .bttooltip('show');
}
function hideTooltip(ev){
    setTimeout(function() {
        $(ev).bttooltip('hide').attr('data-original-title', $(ev).attr('data-name'));
        $(ev).bttooltip('hide').attr('data-original-title', $(ev).attr('data-nameAttr'));
    }, 1000);
}
function br2nl(str) {
    return str.replace(/<br\s*\/?>/mg,"\n");
}
function remove_tags(html) {
    html = html.replace(/<br>/g, "$br$");
    html = html.replace(/(?:\r\n|\r|\n)/g, '$br$');
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    html = tmp.textContent || tmp.innerText;
    html = html.replace(/\s+/g,' ').trim();
    html = html.replace(/\$br\$/g, "\n");
    return html;
}
// clear elements text, value and html with tooltip status
function clear_elements(_array,ev,tool_tip){
    $.each(_array,function(key,value){
        $.each(value,function(nested_key,nested_value){
            if (key == 't') {
                $('#'+nested_key).text(nested_value);
            }else if(key == 'h'){
                $('#'+nested_key).html(nested_value);
            }else if(key == 'v'){
                $('#'+nested_key).val(nested_value);
            }
        });
    });
    setTooltip(ev,tool_tip);
    hideTooltip(ev);
}
//setup ajax header for 419 token
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
// light + dark theme function
function theme_change_f(){
    if ( $('#dark_theme').length === 0 ) {
        var dark_mode_text=$('#theme_mode_text').attr('data-dark');
        $('#theme_mode_text').text(dark_mode_text);
        var theme_file=base_url+'/css/dark-theme.css';
        var link='<link id="dark_theme" rel="stylesheet" href="'+theme_file+'">';
        $('head').append(link);
        $('body').attr('data-theme','dark');
        setCookie('check_theme','dark',60*24*360);
    } else {
        var light_mode_text=$('#theme_mode_text').attr('data-light');
        $('#theme_mode_text').text(light_mode_text);
        setCookie('check_theme','dark',-0);
        $('#dark_theme').remove();
        $('body').attr('data-theme','light');
    }
}
// show category dropdown function
function show_all_tools(){
    $('.all_tools_area').toggleClass('d-none d-flex');
}
//desktop search show
var search_tools_array=new Array();
var get_all_tools= 1;
$('#desktop_toggle_search').click(function(){
    $('.desk_search').slideToggle();
    $('.desk_search input').focus();
    if (get_all_tools == 1) {
        var search_method=$('.blog_search').find('[name="search_type"]:checked').val();
        if(!search_method){
            search_method='tool';
        }
        if(typeof blog_search_active != 'undefined'){
            search_method=blog_search_active;
        }
        $.post(base_url+'/search/', {blog:search_method}, function( data ){
            data=$.parseJSON(data);
            search_tools_array[0]=data;
        });
        get_all_tools=0;
    }
});
$('.blog_search [name="search_type"],#search_type1,#search_type2').change(function(){
    var search_method=$('.blog_search').find('[name="search_type"]:checked').val();
    if(!search_method){
        search_method='tool';
    }
    if(typeof blog_search_active != 'undefined'){
        search_method=blog_search_active;
    }
    $.post(base_url+'/search/', {blog:search_method}, function( data ){
        data=$.parseJSON(data);
        search_tools_array[0]=data;
    });
});
//dont hide some elemnt on spacific container
$(document).click(function(e){
    var container = $("#desktop_toggle_search,.desk_search,.search_output,#navb,button.navbar-toggler");
    // mobile search cross icon click clear vaslue 
    var container2 = $(".mob_search_img");
    if (container2.is(e.target)){
        $('#mob_cros_icon').val('');
        $(".search_output").slideUp();
        $(".search_output .row").html("");
        return;
    }
    var container3 = $('.all_tools_area,[onclick="show_all_tools()"]');
    if (!container3.is(e.target)){
        $('.all_tools_area').addClass('d-none');
        $('.all_tools_area').removeClass('d-flex');
        return;
    }
    if(!$(e.target).is('roshu')){
        if (!container.is(e.target) && container.has(e.target).length === 0){
            $('.desk_search').hide();
            $('.desk_search input').val('');
            $('.search_output .row').html('');
            $('.search_output,#desk_search').slideUp();
            $('#navb').removeClass('show');
            $('button.navbar-toggler').addClass('collapsed');
            return;
        }
    }
});
//search result starts here
$('[name="search_type"]').change(function(){
    setTimeout(function(){
        $('.search_inp').trigger('keyup');
    },500);
});
$('#mob_checked [name="search_type"]').change(function(){
    setTimeout(function(){
        $('.mob_search_inp').trigger('keyup');
    },500);
});
$('.search_inp,.mob_search_inp').keyup(function(){
    if (get_all_tools == 1) {
        var search_method=$('.blog_search').find('[name="search_type"]:checked').val();
        if(!search_method){
            search_method='tool';
        }
        if(typeof blog_search_active != 'undefined'){
            search_method=blog_search_active;
        }
        $.post(base_url+'/search/', {blog:search_method}, function( data ){
            data=$.parseJSON(data);
            search_tools_array[0]=data;
        });
        get_all_tools=0;
    }
    var get_match = 0;
    // var search_method=$(this).parent().find('[name="search_type"]:checked').val();
    var search_method=$(this).parent().parent().find('[name="search_type"]:checked').val();
    if(!search_method){
        search_method='tool';
    }
    var v=$(this).val();
    var search_type='d';
    if($(this).hasClass('mob_search_inp')){
        search_type='m';
    }
    $(".search_output .row,.sidebar_search_output .popular_tools").html("");
    if (v.length > 1){
        var search_counter_for_last = 0;
        if(typeof blog_search_active != 'undefined'){
            search_method=blog_search_active;
        }
        $.each(search_tools_array[0], function(i, item){
            ++search_counter_for_last;
            if(get_match > 6){
                return false;
            }
            
            if(search_method == 'blog'){
                var res=item.p_title.toLowerCase();
                if(res.match(v.toLowerCase())){
                    ++get_match;
                    var ad_profile_info=JSON.parse(item.ad_profile_info);
                    var admin_name=ad_profile_info.display_name;
                    var admin_pic=ad_profile_info.profile_pic;
                    var match=res.replace(new RegExp(v, "ig"),'<b>'+v.toLowerCase()+'</b>');
                    if(search_type == 'd'){
                        $(".search_output .row").append('<div class="col-md-12 py-2"><img src="https://cdn.smallseotools.com/admin-images/'+admin_pic+'" alt="'+admin_name+'" class="img-fluid aurthor_img"><a href="'+base_url+'blog/'+item.p_link+'" class="icon_sty px-1">'+match+'</a></div>');
                    }else{
                        $(".mob_search .search_output .row").append('<div class="col-md-12 py-2 d-flex"><img src="https://cdn.smallseotools.com/admin-images/'+admin_pic+'" alt="'+admin_name+'" class="img-fluid aurthor_img"><a href="'+base_url+'blog/'+item.p_link+'" class="icon_sty px-1">'+match+'</a></div>');
                    }
                }
            }else{
                if(typeof item.t_front_heading != 'object'){
                    var res=item.t_front_heading.toLowerCase();
                    if(res.match(v.toLowerCase())){
                        ++get_match;
                        var match=res.replace(new RegExp(v, "ig"),'<b>'+v.toLowerCase()+'</b>');
                        if(search_type == 'd'){
                            $(".sidebar_search_output .popular_tools,.search_output .row").append(`<div class="col p-0">
                                <a href="${item.t_url}" class="d-inline-block p-2">${match}</a>
                            </div>`);
                        }else{
                            $(".mob_search .search_output .row").append('<div class="col-md-12 py-2"><a href="'+item.t_url+'" class="icon_sty px-1"><div class="reverse_img d-none"></div>'+match+'</a></div>');
                        }
                    }
                }
            }
        });
        if(get_match < 1){
            if(search_type == 'd'){
                $(".sidebar_search_output .popular_tools").append('<div class="col-md-12 py-2 clr_fff" id="no_search_found">No result found related to your keyword..</div>');
            }else{
                $(".search_output .row").append('<div class="col-md-12 py-2 clr_fff" id="no_search_found">No result found related to your keyword..</div>');
            }
        }
        $(".search_output").slideDown();
    }else{
        $(".search_output").hide();
    }
});
$('.cross_icon_desktop').click(function(){
    $('.desk_search .search_inp').val('');
    $(".search_output").hide();
    $(".search_output .row").html("");
});
//search result end here
// Show and hide Loader
function showLoader(status){
    if(status){
        $("#loader_con").removeClass('d-none');
    }else{
        $("#loader_con").addClass('d-none');
    }
}

//stop form submission on enter
$('form input').keydown(function (e) {
    if($('form [data-callback]').length == 0){
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    }else{
        if (e.keyCode == 13) {
            e.preventDefault();
            $('form [data-callback]').trigger('click');
        }
    }
});
// mobile all tools show and hide
$('.alltools_area .mob_alltools').click(function(){
    $(this).toggleClass('active');
    $('.alltools_area .cus_scrollbar').toggleClass('d-none');
})
// mobile all Languages show and hide
$('.mob_lang_area .mob_languages').click(function(){
    $(this).find('.mob_languages2').toggleClass('active');
    $('.mob_lang_link').toggleClass('d-none');
})
// feeback captcha load on click
$("#feeback-icon").on('click', function(){
    if($('#rating_captcha_html').length == 0){
        var rating_captcha_html = "<script id='rating_captcha_html' src='https://www.google.com/recaptcha/api.js'><\/script>";
        $("head").append(rating_captcha_html);
    }
    $("#feedbackModal").modal('show');
})
// admin panel show message info
function toast_progress(type, msg) {
    $('.toast_msg').css('display', 'flex');
    $('.toast_msg').removeClass('red');
    $('.toast_msg').removeClass('green');
    if (type == 'error') {
        $('.toast_msg').addClass('red');
    } else if (type == 'success') {
        $('.toast_msg').addClass('green');
    }
    $('.toast_admin_msg').text(msg);
    var timerId, percent;
    percent = 0;
    timerId = setInterval(function () {
        percent += 3;
        $('.toast_progress_bar').css('width', percent + '%');
        if (percent >= 100) {
            clearInterval(timerId);
            $('.toast_msg').hide();
        }
    }, 200);
}
// print error messages
function show_messages(type, msg) {
    if(type == 'hide'){
        $('#messages_co').html('');
        $('#messages_co').hide();
    }else{
        $('#messages_co').show();
        var toast_html = '<div class="toast_msg rounded fixed-top alert-dismissible ' + type.toLowerCase() + '_msg alert p-0">' +
            '<div class="toast_progress_bar"></div>' +
            '<button type="button" class="close px-1 py-0" data-dismiss="alert">&times;</button>' +
            '<div class="d-flex align-items-center py-2">' +
            '<img src="'+base_url+'/webimages/' + type.toLowerCase() + '_msg.svg" alt="" class="img-fluid mx-3">' +
            '<div>' +
            '<div class="fw_600 fs14 pr-4">' + msg + '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $('#messages_co').html(toast_html);
        var percent = 0;
        if(typeof messages_co_timer != 'undefined'){
            clearInterval(messages_co_timer);
        }
        messages_co_timer = setInterval(function () {
            percent += 5;
            if (percent >= 100) {
                clearInterval(messages_co_timer);
                percent=0;
                $('#messages_co').hide();
            }
        }, 400);
    }
}
// lazy load all images 
window.LAZY={
    name:'',
    type:'',
    class:'',
    id:'',
    title:'',
    alt:'',
    width:'',
    height:'',
    element:'',
    fullpath:'false',
    viewport:function(){
        var elementTop = $(LAZY.element).offset().top;
        var elementBottom = elementTop + $(LAZY.element).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    },
    run:function(element){
        //RK-Lazy
        elements=$('['+element+']');
        for (var i =0; i < elements.length; i++) {
            LAZY.element=elements[i];
            if(LAZY.viewport()){
                var settings=JSON.parse($(LAZY.element).attr(element));
                LAZY.setVariable(settings);
                if(LAZY.isimage()){
                    LAZY.addImageTag();
                }else{
                    LAZY.addImageBackground(element);
                }
            }
        }
    },
    setVariable:function(variable){
        LAZY.name = "undefined" == typeof variable.name ? '' : variable.name;
        LAZY.type = "undefined" == typeof variable.type ? '' : variable.type;
        LAZY.class = "undefined" == typeof variable.class ? '' : variable.class;
        LAZY.id = "undefined" == typeof variable.id ? '' : variable.id;
        LAZY.title = "undefined" == typeof variable.title ? '' : variable.title;
        LAZY.alt = "undefined" == typeof variable.alt ? '' : variable.alt;
        LAZY.width = "undefined" == typeof variable.width ? '' : variable.width;
        LAZY.height = "undefined" == typeof variable.height ? '' : variable.height;
        LAZY.fullpath = "undefined" == typeof variable.fullpath ? '' : variable.fullpath;
    },
    isimage:function(){
        if(LAZY.type == 'img'){
            return true;
        }else{
            return false;
        }
    },
    addImageTag:function(){
        if(LAZY.fullpath == 'false'){
            path=base_url+'/webimages/'+LAZY.name;
        }else{
            path=LAZY.fullpath;
        }
        var attribute_style='';
        if(LAZY.width != ''){
            attribute_style+=' width="'+LAZY.width+'"';
        }
        if(LAZY.height != ''){
            attribute_style+=' height="'+LAZY.height+'"';
        }
        if(LAZY.class != ''){
            attribute_style+=' class="'+LAZY.class+'"';
        }
        if(LAZY.id != ''){
            attribute_style+=' id="'+LAZY.id+'"';
        }
        if(LAZY.title != ''){
            attribute_style+=' title="'+LAZY.title+'"';
        }
        if(LAZY.alt != ''){
            attribute_style+=' alt="'+LAZY.alt+'"';
        }
        render='<img src="'+path+'"'+attribute_style+'>';
        $(LAZY.element).after(render);
        $(LAZY.element).remove();
    },
    addImageBackground:function(element){
        $(LAZY.element).addClass(LAZY.name);
        $(LAZY.element).removeAttr(element);
    },
}
LAZY.run('RK-Lazy');
LAZY.run('data-rklazy');
$(window).on('resize scroll', function(){
    LAZY.run('RK-Lazy');
    LAZY.run('data-rklazy');
});
window.FITS ={
    img:base_url+'/over.png',
    css:'',
    anchor:'https://www.grammarly.com/?q=grammar&utm_source=placement&utm_medium=cpc&utm_content=sst_Popup2&utm_term=smallseotools',
    anchorAttr:{},
    imgAttr:{},
    cookie:'',
    expireDays:1,
    cookieValue:'FITS',
    width:'800px',
    setVariable:function(variable){
        this.anchor = "undefined" == typeof variable.anchor ? this.anchor : variable.anchor;
        this.anchorAttr = "undefined" == typeof variable.anchorAttr ? '' : variable.anchorAttr;
        this.img = "undefined" == typeof variable.img ? this.img : variable.img;
        this.css = "undefined" == typeof variable.css ? this.css : variable.css;
        this.cookie = "undefined" == typeof variable.cookie ? this.cookie :'FITS-'+variable.cookie;
        this.expireDays = "undefined" == typeof variable.expireDays ? this.expireDays : variable.expireDays;
        this.cookieValue = "undefined" == typeof variable.cookieValue ? this.cookieValue : variable.cookieValue;
        this.width = "undefined" == typeof variable.width ? this.width : variable.width;
    },
    banner_css:function(e){
        var css_style = document.createTextNode("#FITS_con{position:fixed;top:0;z-index:10001;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#acacac3d;}#FITS_conInner{position:relative}#FITS_close{position:absolute;right:2px;top:3px;;width:20px;line-height:20px;color:#fff;font-size:12px;font-weight:bold;text-align:center;border-radius:50%;background-color:#5c5c5c;cursor:pointer;}#FITS_banner img{max-width:"+this.width+";max-height:100vh;height:auto;}"+this.css),
        creat_tag = document.createElement("style");
        creat_tag.type = "text/css",creat_tag.appendChild(css_style), document.getElementsByTagName("head")[0].appendChild(creat_tag);
    },
    loadImg_first:function(e){
        var c = this.getcookie(e);
        if(!c){
            var imgload = new Image();
            imgload.src = this.img;
            var att = document.createAttribute("usemap");
            att.value = "#FITS_Map";
            imgload.setAttributeNode(att);
            imgload.onload = function(){
                FITS.img=imgload;
                FITS.ready(e);
            };
        }
    },
    ready:function(e){
        // make anchor tag 
        this.anchorAttr = Object.assign(this.anchorAttr,{'href':this.anchor,id:'FITS_banner',target:'_blank'});
        if(this.anchorAttr.title =='Semrush'){
            $('#FITS_Map area').removeAttr('title');
        }
        var make_anchor = document.createElement("a");
        this.setAttributes(make_anchor,this.anchorAttr);
        // make close button
        var makeCloseBtn=document.createElement("div");
        makeCloseBtn.id='FITS_close';
        makeCloseBtn.appendChild(document.createTextNode("X"));
        make_anchor.appendChild(this.img);
        var make_inner_parent=document.createElement("div");
        make_inner_parent.id='FITS_conInner';
        make_inner_parent.appendChild(makeCloseBtn);
        make_inner_parent.appendChild(make_anchor);
        var make_parent=document.createElement("div");
        make_parent.id='FITS_con';
        make_parent.appendChild(make_inner_parent);
        document.getElementsByTagName("body")[0].appendChild(make_parent);
        makeCloseBtn.addEventListener("click", function(e){e.preventDefault();FITS.FITSHIDE(make_parent)});
        this.addEvent(window, "resize", function() {
            // FITS.resize(FITS.anchor)
        })
        this.setcookie(e);
    },
    getcookie:function(e){
        var nameEQ = this.cookie + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    setcookie:function(e){
        var expires = "";
        if (this.expireDays) {
            var date = new Date();
            date.setTime(date.getTime() + (this.expireDays*24*60*60*1000));
            // date.setTime(date.getTime() + (1*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = this.cookie + "=" + this.cookieValue  + expires + "; path=/";
    },
    FITSHIDE:function(e){
        $(e).remove();
    },
    setAttributes:function(elem,obj){
        for (var prop in obj) {
            elem.setAttribute(prop,obj[prop]);
        }
    },
    addEvent: function(e, t, i) {
        e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent && e.attachEvent("on" + t, i)
    },
    Config:function(config){
        document.querySelector("body").addEventListener("mouseleave", function(e){
            if($('.fc-consent-root').length == 0){
                e = e ? e : window.event;
                var t = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                if (!(e.clientX >= t - 50 || e.clientY >= 50)){
                    FITS.setVariable(config),FITS.loadImg_first(config),FITS.banner_css(config);
                }
            }
        });
    },
}
$("#FITS_Map area").click(function(e){
	e.preventDefault();
    $("#FITS_close").click();
});
function FileDownload(url, fileName,LoaderText){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    };
    xhr.onprogress = function(pr) { //update downloading progressbar
        var percentage = Math.ceil(pr.loaded/pr.total*100);
        sst_loader(LoaderText+percentage+'%',true);
        // $("#down_statusbar").html(`Downloaded: ${bytesToSize(pr.loaded)}/${bytesToSize(pr.total)}`);
    };
    xhr.send();
}
function sst_loader(text,type){
    if(type){
        $('#loader_con11 p').text(text);
        $('#loader_con11').removeClass('d-none');
    }else{
        $('#loader_con11').addClass('d-none');
    }
}
function new_error_message(selector,type,message){
    type=type.toLowerCase();
    if(type == 'hide'){
        $(selector).html('');
        $(selector).hide();
    }else if(type == 'error'){
        $(selector).show();
        var toast_html = '<div id="error_message_" class="alert alert-danger alert-dismissible fade show text-left d-flex" role="alert">'+
                            '<strong class="mr-1 d-inline-block">Error!</strong>'+message +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
        $('#error_message_').remove('');
        $(toast_html).insertBefore(selector);
        result_focus('error_message_');	
    }else if(type == 'success'){
        $(selector).show();
        var toast_html = '<div id="error_message_" class="alert alert-success alert-dismissible fade show text-left d-flex" role="alert">'+
                            '<strong class="mr-1 d-inline-block">Success!</strong>'+message +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
        $('#error_message_').remove('');
        $(toast_html).insertBefore(selector);
        result_focus('error_message_');	
    }
}
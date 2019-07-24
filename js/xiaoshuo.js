//common.js

//ȡ��һ�������൱��getElementById()
function $() {
  var elements = new Array();
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string') element = document.getElementById(element);
	Method.Element.apply(element);
    if (arguments.length == 1) return element;
    elements.push(element);
  }
  return elements;
}

//�������յ��ĵ����Ĳ���ת����һ��Array����
function $A(list){
	var arr = [];
	for (var i=0,len=list.length; i<len; i++){arr[i] = list[i];}
	return arr;
}

//���ú�����չ
var Method = {
	Element	: function(){
		this.hide = function(){this.style.display="none"; return this;};
		this.show = function(){this.style.display=""; return this;};
		this.getValue = function(){if(this.value===undefined) return this.innerHTML; else return this.value;};
		this.setValue = function(s){if(this.value === undefined) this.innerHTML = s; else this.value = s;};
		this.subTag = function(){return $A(this.getElementsByTagName(arguments[0])).each(function(n){$(n);});};
		this.remove = function(){return this.parentNode.removeChild(this);};
		this.nextElement = function(){var n = this;	for(var i=0,n; n = n.nextSibling; i++) if(n.nodeType==1) return $(n); return null;};
		this.previousElement = function(){var n = this;	for (var i=0,n; n = n.previousSibling; i++) if(n.nodeType==1) return $(n); return null;};
		this.getPosition =  function(){var e = this; var t=e.offsetTop; var l=e.offsetLeft; while(e=e.offsetParent){if($(e).getStyle('position') == 'absolute' || $(e).getStyle('position') == 'relative') break; t+=e.offsetTop; l+=e.offsetLeft;} return {x:l, y:t};};
		this.getStyle = function(name){ if(this.style[name]) return this.style[name]; else if(this.currentStyle) return this.currentStyle[name]; else if(document.defaultView && document.defaultView.getComputedStyle){ name = name.replace(/([A-Z])/g,"-$1").toLowerCase(); var s = document.defaultView.getComputedStyle(this,""); return s && s.getPropertyValue(name); } else return null;};
		this.setInnerHTML = function(s){var ua = navigator.userAgent.toLowerCase();if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0){ s = '<div style="display:none">for IE</div>' + s;	s = s.replace(/<script([^>]*)>/gi,'<script$1 defer>');	this.innerHTML = '';
		this.innerHTML = s;	this.removeChild(this.firstChild);}else{var el_next = this.nextSibling; var el_parent = this.parentNode; el_parent.removeChild(this); this.innerHTML = s; if(el_next) el_parent.insertBefore(this, el_next); else el_parent.appendChild(this);}};
	},
	Array :	function(){
		this.indexOf = function(){for (i=0; i<this.length; i++) if (this[i]==arguments[0]) return i; return -1;};
		this.each = function(fn){for (var i=0,len=this.length; i<len; i++){	fn(this[i],i);} return this;};
	},
	String : function(){
		this.trim = function(){var _re,_argument = arguments[0] || " ";	typeof(_argument)=="string"?(_argument == " "?_re = /(^\s*)|(\s*$)/g : _re = new RegExp("(^"+_argument+"*)|("+_argument+"*$)","g")) : _re = _argument; return this.replace(_re,"");};
		this.stripTags = function(){return this.replace(/<\/?[^>]+>/gi, '');};
		this.cint = function(){return this.replace(/\D/g,"")*1;};
		this.hasSubString = function(s,f){if(!f) f="";return (f+this+f).indexOf(f+s+f)==-1?false:true;};
	}
};

Method.Array.apply(Array.prototype);
Method.String.apply(String.prototype);

//cookie����
var Cookie = {
    get : function(n){
	    var dc = "; "+document.cookie+"; ";
	    var coo = dc.indexOf("; "+n+"=");
	    if (coo!=-1){
		    var s = dc.substring(coo+n.length+3,dc.length);
		    return unescape(s.substring(0, s.indexOf("; ")));
	    }else{
		    return null;
	    }
    },

    set : function(name,value,expires,path,domain,secure){
        var expDays = expires*24*60*60*1000;
        var expDate = new Date();
        expDate.setTime(expDate.getTime()+expDays);
        var expString = expires ? "; expires="+expDate.toGMTString() : "";
        var pathString = "; path="+(path||"/");
		var domain = domain ? "; domain="+domain : "";
		expDate.setTime(expDate.getTime()+24*60*60*1000);
        document.cookie = name + "=" + escape(value) + expString + domain + pathString + (secure?"; secure":"");
    },
    del : function(n){
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval=this.get(n);
	    if(cval!=null) document.cookie= n + "="+cval+";expires="+exp.toGMTString();
    }
}

//form��غ���
var Form = {
	//�ѱ������ת����string
  serialize: function(form) {
    var elements = Form.getElements($(form));
    var queryComponents = new Array();
    for (var i = 0; i < elements.length; i++) {
      var queryComponent = Form.Element.serialize(elements[i]);
      if (queryComponent) queryComponents.push(queryComponent);
    }
    return queryComponents.join('&');
  },
  //ȡ�ñ�����Ϊ������ʽ
  getElements: function(form) {
    form = $(form);
    var elements = new Array();
    for (tagName in Form.Element.Serializers) {
      var tagElements = form.getElementsByTagName(tagName);
      for (var j = 0; j < tagElements.length; j++)
        elements.push(tagElements[j]);
    }
    return elements;
  },
  //disable����������
  disable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.blur();
      element.disabled = 'true';
    }
  },
  //enable����������
  enable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.disabled = '';
    }
  },
  //Reset��
  reset: function(form) {
    $(form).reset();
  }
}

//form����Ԫ�ض���
Form.Element = {
  serialize: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);
    if (parameter) {
      var key = encodeURIComponent(parameter[0]);
      if (key.length == 0) return;
      if (parameter[1].constructor != Array) return key + '=' + encodeURIComponent(parameter[1]);
	  tmpary = new Array();
	  for (var i = 0; i < parameter[1].length; i++) {
		  tmpary[i] = key + encodeURIComponent('[]') + '=' + encodeURIComponent(parameter[1][i]);
	  }
      return tmpary.join('&');
    }	
  },
  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);
    if (parameter) return parameter[1];
  }
}

Form.Element.Serializers = {
  input: function(element) {
    switch (element.type.toLowerCase()) {
      case 'submit':
      case 'hidden':
      case 'password':
      case 'text':
        return Form.Element.Serializers.textarea(element);
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element);
    }
    return false;
  },

  inputSelector: function(element) {
    if (element.checked) return [element.name, element.value];
  },

  textarea: function(element) {
    return [element.name, element.value];
  },

  select: function(element) {
    return Form.Element.Serializers[element.type == 'select-one' ? 'selectOne' : 'selectMany'](element);
  },

  selectOne: function(element) {
    var value = '', opt, index = element.selectedIndex;
    if (index >= 0) {
      opt = element.options[index];
      value = opt.value;
      if (!value && !('value' in opt))
        value = opt.text;
    }
    return [element.name, value];
  },

  selectMany: function(element) {
    var value = new Array();
    for (var i = 0; i < element.length; i++) {
      var opt = element.options[i];
      if (opt.selected) {
        var optValue = opt.value;
        if (!optValue && !('value' in opt))
          optValue = opt.text;
        value.push(optValue);
      }
    }
    return [element.name, value];
  }
}

//ajax����
function jieqi_ajax() {
	this.init = function() {
		this.handler = null;
		this.method = "POST";
  		this.queryStringSeparator = "?";
		this.argumentSeparator = "&";
		this.URLString = "";
		this.encodeURIString = true;
  		this.execute = false;
		this.requestFile = null;
		this.vars = new Object();
		this.responseStatus = new Array(2);
		this.failed = false;
		this.response = "";
		this.asynchronous = true;

		this.onLoading = function() { };
  		this.onLoaded = function() { };
  		this.onInteractive = function() { };
  		this.onComplete = function() { };
  		this.onError = function() { };
		this.onFail = function() { };

		try {
			this.handler = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				this.handler = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				this.handler = null;
			}
		}

		if (! this.handler) {
			if (typeof XMLHttpRequest != "undefined") {
				this.handler = new XMLHttpRequest();
			} else {
				this.failed = true;
			}
		}
  	};
	this.setVar = function(name, value, encoded){
		this.vars[name] = Array(value, encoded);
	};
	this.encVar = function(name, value, returnvars) {
		if (true == returnvars) {
			return Array(encodeURIComponent(name), encodeURIComponent(value));
		} else {
			this.vars[encodeURIComponent(name)] = Array(encodeURIComponent(value), true);
		}
	};
	this.processURLString = function(string, encode) {
		//regexp = new RegExp(this.argumentSeparator + "|" + encodeURIComponent(this.argumentSeparator));
		regexp = new RegExp(this.argumentSeparator);
		varArray = string.split(regexp);
		for (i = 0; i < varArray.length; i++){
			urlVars = varArray[i].split("=");
			if (true == encode){
				this.encVar(urlVars[0], urlVars[1], false);
			} else {
				this.setVar(urlVars[0], urlVars[1], true);
			}
		}
	};
	this.createURLString = function(urlstring) {
		if (urlstring) {
			if (this.URLString.length) {
				this.URLString += this.argumentSeparator + urlstring;
			} else {
				this.URLString = urlstring;
			}
		}
		this.setVar("ajax_request", new Date().getTime(), false);
		urlstringtemp = new Array();
		for (key in this.vars) {
			if (false == this.vars[key][1] && true == this.encodeURIString) {
				encoded = this.encVar(key, this.vars[key][0], true);
				delete this.vars[key];
				this.vars[encoded[0]] = Array(encoded[1], true);
				key = encoded[0];
			}
			urlstringtemp[urlstringtemp.length] = key + "=" + this.vars[key][0];
		}
		if (urlstring){
			this.URLString += this.argumentSeparator + urlstringtemp.join(this.argumentSeparator);
		} else {
			this.URLString += urlstringtemp.join(this.argumentSeparator);
		}
	};
	this.runResponse = function() {
		eval(this.response);
	};
	this.runAJAX = function(urlstring) {
		if (this.failed) {
			this.onFail();
		} else {
			if(this.requestFile.indexOf(this.queryStringSeparator) > 0){
				var spoint = this.requestFile.indexOf(this.queryStringSeparator);
				this.processURLString(this.requestFile.substr(spoint + this.queryStringSeparator.length), false);
				this.requestFile = this.requestFile.substr(0, spoint);
			}
			this.createURLString(urlstring);
			if (this.handler) {
				var self = this;
				
				if (this.method == "GET") {
					totalurlstring = this.requestFile + this.queryStringSeparator + this.URLString;
					this.handler.open(this.method, totalurlstring, this.asynchronous);
				} else {
					this.handler.open(this.method, this.requestFile, this.asynchronous);
					try {
						this.handler.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					} catch (e) { }
				}

				this.handler.onreadystatechange = function() {
					switch (self.handler.readyState) {
						case 1:
							self.onLoading();
							break;
						case 2:
							self.onLoaded();
							break;
						case 3:
							self.onInteractive();
							break;
						case 4:
							self.response = self.handler.responseText;
							self.responseXML = self.handler.responseXML;
							self.responseStatus[0] = self.handler.status;
							self.responseStatus[1] = self.handler.statusText;

							if (self.execute) {
								self.runResponse();
							}

							if (self.responseStatus[0] == "200") {
								self.onComplete();
							} else {
								self.onError();
							}

							self.URLString = "";
							break;
					}
				}
				this.handler.send(this.method == "GET" ? null : this.URLString);
			}
		}
	};
	this.submitForm = function(form) {
		if(this.requestFile == null) this.requestFile = $(form).attributes["action"].value;
		this.runAJAX(Form.serialize(form));
	};
	this.init();
}

var Ajax = {
	Request	: function(vname, vars){
		var ajax = new jieqi_ajax();
		var param = {method:"",parameters:"",asynchronous:true,onLoading:function(){},onLoaded:function(){},onInteractive:function(){},onComplete:function(){},onError:function(){},onFail:function(){}};
		for (var key in vars) param[key] = vars[key];
		if(param["parameters"] != "") ajax.processURLString(param["parameters"], false);
		ajax.asynchronous = param["asynchronous"];
		ajax.onLoading = param["onLoading"];
		ajax.onLoaded = param["onLoaded"];
		ajax.onInteractive = param["onInteractive"];
		ajax.onError = param["onError"];
		ajax.onFail = param["onFail"];
		ajax.onComplete = param["onComplete"];
		if($(vname) != null && $(vname).tagName.toLowerCase() == "form"){
			ajax.method = param["method"]=="" ? "POST" : param["method"];
			ajax.submitForm(vname);
		}else{
			ajax.method = param["method"]=="" ? "GET" : param["method"];
			ajax.requestFile = vname;
			ajax.runAJAX();
		}
	},
	Update : function(vname, vars){
		var param = {outid:"",tipid:"",onLoading:"", outhide:0, cursor:"wait", parameters:""};
		for (var key in vars) param[key] = vars[key];

		var isform = ($(vname) != null && $(vname).tagName.toLowerCase() == "form") ? true : false;

		if(typeof param["onLoading"] == 'function'){
			var doLoading = param["onLoading"];
		}else{
			var doLoading = function(){
				if(param["cursor"] != "") document.body.style.cursor=param["cursor"];
				if(param["tipid"] != "") {$(param["tipid"]).setValue(param["onLoading"]);$(param["tipid"]).show();}
				if(isform) Form.disable(vname);
			}
		}
		var doComplete = function(){
			if(param["cursor"] != "") document.body.style.cursor="auto";
			if(param["tipid"] != "") {$(param["tipid"]).setValue("");$(param["tipid"]).hide();}
			if(param["outid"] != "") {$(param["outid"]).setValue(this.response);$(param["outid"]).show();}
			if(param["outhide"] != "") {setTimeout(function(){$(param["outid"]).hide()},param["outhide"]);}
			if(isform) Form.enable(vname);
		}
		var doError = function(){
			if(param["outid"] != "")  $(param["outid"]).setValue("ERROR:"+this.responseStatus[1]+"("+this.responseStatus[0]+")");
			if(isform) Form.enable(vname);
		}
		var doFail = function() {
			alert("Your browser does not support AJAX!");
			if(isform) Form.enable(vname);
		}
		
		Ajax.Request(vname, {onLoading:doLoading, onComplete:doComplete, onError:doError, onFail:doFail, parameters:param["parameters"]});
	},
	Tip : function(event, url, timeout){
		event = event ? event : (window.event ? window.event : null);
		timeout = timeout ? timeout : 3000;
		var eid = event.srcElement ? event.srcElement.id : event.target.id;
		var tid = eid + "_tip";
		var ele = $(eid);
		var pos = ele.getPosition();
		var atip  = $(tid);
		if(!atip) {
			atip = document.createElement("div");
			atip.id = tid;
			atip.style.display = "none";
			atip.className = "ajaxtip";
			document.body.appendChild(atip);
			atip.onclick = function(){$(tid).hide();};
		}
		atip.style.top = (pos.y + ele.offsetHeight + 2)  + "px";
		atip.style.left = pos.x + "px";
		atip.innerHTML = "";
		atip.style.display="";
		this.Update(url, {outid:tid, tipid:tid, onLoading:"Loading...", outhide:timeout, cursor:"wait"});
	}
}

//���ù��ܺ���
function pageWidth(){
	return window.innerWidth != null ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;
}

function pageHeight(){
	return window.innerHeight != null? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null? document.body.clientHeight : null;
}

function pageTop(){
	return typeof window.pageYOffset != 'undefined' ? window.pageYOffset : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
}

function pageLeft(){
	return typeof window.pageXOffset != 'undefined' ? window.pageXOffset : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ? document.body.scrollLeft : 0;
}

function showMask(){
	var sWidth,sHeight;
	sWidth = document.body.scrollWidth;
	sWidth = window.screen.availWidth > document.body.scrollWidth ? window.screen.availWidth : document.body.scrollWidth;
	sHeight = window.screen.availHeight > document.body.scrollHeight ? window.screen.availHeight : document.body.scrollHeight;
	var mask = document.createElement("div");
	mask.setAttribute('id','mask');
	mask.style.width = sWidth + "px";
	mask.style.height = sHeight + "px";
	mask.style.zIndex = "5000";
	document.body.appendChild(mask);
}

function hideMask(){
	var mask = document.getElementById("mask");
	if(mask != null){
		if(document.body) document.body.removeChild(mask); 
		else document.documentElement.removeChild(mask); 
	}
}

var dialogs = new Array();

function displayDialog(html){
	var dialog;
	dialog = document.getElementById("dialog");
	if(dialog != null) closeDialog();
	dialog = document.createElement("div");
	dialog.setAttribute('id','dialog');
	dialog.style.zIndex = "6000";
	if(document.all){
		dialog.style.width = "400px";
		dialog.style.height = "330px";
	}
	document.body.appendChild(dialog);
	var close_btn='<a href="Javascript:void(0);" onclick="closeDialog()" class="dialogx"></a>';
	$('dialog').innerHTML =close_btn+html+"<div class='cl'></div>";
	//$('dialog').innerHTML = html + '<iframe src="" frameborder="0" style="position:absolute;visibility:inherit;top:0px;left:0px;width:expression(this.parentNode.offsetWidth);height:expression(this.parentNode.offsetHeight);z-index:-1;filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>';
	var dialog_w = parseInt(dialog.clientWidth);
	var dialog_h = parseInt(dialog.clientHeight);
	var page_w = pageWidth(); 
	var page_h = pageHeight();
	var page_l = pageLeft();
	var page_t = pageTop();

	var dialog_top = page_t + (page_h / 2) - (dialog_h / 2);
	if(dialog_top < page_t) dialog_top = page_t;
	var dialog_left = page_l + (page_w / 2) - (dialog_w / 2);
	if(dialog_left < page_l) dialog_left = page_l + page_w - dialog_w;

	dialog.style.left = dialog_left + "px";
	dialog.style.top =  dialog_top + "px";
	dialog.style.visibility = "visible";
}

function openDialog(url, mask){
	if(mask) showMask();
	if(typeof dialogs[url] == 'undefined') Ajax.Request(url,{onLoading:function(){dialogs[url]=this.response; displayDialog('Loading...');}, onComplete:function(){dialogs[url]=this.response; displayDialog(this.response);}});
	else displayDialog(dialogs[url]);
}

function closeDialog(){
	var dialog = document.getElementById("dialog");
	if(document.body){
		document.body.removeChild(dialog); 
	}else{
		document.documentElement.removeChild(dialog); 
	}
	hideMask();
}

function loadJs(url){
	if(arguments.length >= 2 && typeof arguments[1] == 'function') funload = arguments[1];
	if(arguments.length >= 3 && typeof arguments[2] == 'function') funerror = arguments[2];
	var ss=document.getElementsByTagName("script");
	for(i=0;i<ss.length;i++){
		if(ss[i].src && ss[i].src.indexOf(url) != -1){
			if(typeof funload == "function") funload();
			return;
		}
	}
	s=document.createElement("script");
	s.type="text/javascript";
	s.defer = "defer";
	s.src=url;
	document.getElementsByTagName("head")[0].appendChild(s);
	
	s.onload=s.onreadystatechange=function(){
		if(this.readyState && this.readyState=="loading") return;
		if(typeof funload == "function") funload();
	}
	s.onerror=function(){
		this.parentNode.removeChild(this);
		if(typeof funerror == "function") funerror();
	}
}



//end

//runme.js

function show_runme(){
document.writeln("<script type=\"text/javascript\">var flexlen=$(\"s_dd\").getElementsByTagName(\'dd\').length;var pershow=parseInt(flexlen/6);var showdiv=936;var perwidth=156;var playme;var nxper;function wamccshow(per){var minc;var mink=\'\';var no_l=$(\"s_dd\").style.left;per=per?per:0;for(var j=0;j<flexlen;j++){$(\"s_dd\").getElementsByTagName(\'dd\')[j].style.display=((j>=per*6)&&(j<(per+1)*6))?\"block\":\"none\"}for(var i=0;i<pershow;i++){minc=i!=per?\"\":\'class=\"current\"\';mink+=\'<a href=\"javascript:void(0);\" onclick=\"wamccshow(\'+i+\')\" \'+minc+\'></a>\'}$(\"s_dt\").innerHTML=mink;per++;nxper=per>=pershow?0:per;if(playme){clearInterval(playme)}playme=setInterval(function(){wamccshow(nxper)},3000)};$(\"s_dl\").onmouseover=function(){clearInterval(playme)};$(\"s_dl\").onmouseout=function(){playme=setInterval(function(){wamccshow(nxper)},3000)};wamccshow();</script>");
document.writeln('<script charset="gbk" src="https://www.baidu.com/js/opensug.js"></script>');
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?534ede4b11a35873e104d2b5040935e0";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
}
//end
//pagetop//

function show_pagetop(){
document.write('������ɫ<select name=bcolor id=bcolor onchange="javascript:document.body.style.background=this.options[this.selectedIndex].value;"><option style="background-color: #ffffff" value="#ffffff">��ɫ</option><option style="background-color: #f6f6f6" value="#f6f6f6">����</option><option style="background-color: #e4ebf1" value="#e4ebf1">����</option><option style="background-color: #e6f3ff" value="#e6f3ff">��ɫ</option> <option style="background-color: #eeeeee" value="#eeeeee">����</option><option style="background-color: #eaeaea" value="#eaeaea">��ɫ</option>  <option style="background-color: #e4e1d8" value="#e4e1d8">���</option><option style="background-color: #e6e6e6" value="#e6e6e6">����</option><option style="background-color: #eefaee" value="#eefaee">��ɫ</option><option style="background-color: #ffffed" value="#ffffed">����</option></select>&nbsp; ǰ����ɫ<select name=bccolor id=bccolor onchange="javascript:document.getElementById(\'amain\').style.background=this.options[this.selectedIndex].value;"><option style="background-color: #ffffff" value="#ffffff">��ɫ</option><option style="background-color: #f6f6f6" value="#f6f6f6">����</option><option style="background-color: #e4ebf1" value="#e4ebf1">����</option><option style="background-color: #e6f3ff" value="#e6f3ff">��ɫ</option> <option style="background-color: #eeeeee" value="#eeeeee">����</option><option style="background-color: #eaeaea" value="#eaeaea">��ɫ</option>  <option style="background-color: #e4e1d8" value="#e4e1d8">���</option><option style="background-color: #e6e6e6" value="#e6e6e6">����</option><option style="background-color: #eefaee" value="#eefaee">��ɫ</option><option style="background-color: #ffffed" value="#ffffed">����</option></select>&nbsp; ������ɫ<select name=txtcolor id=txtcolor onchange="javascript:document.getElementById(\'contents\').style.color=this.options[this.selectedIndex].value;"> <option value="#000000">��ɫ</option><option value="#ff0000">��ɫ</option><option value="#006600">��ɫ</option><option value="#0000ff">��ɫ</option><option value="#660000">��ɫ</option></select>&nbsp; �����С<select name=fonttype id=fonttype onchange="javascript:document.getElementById(\'contents\').style.fontSize=this.options[this.selectedIndex].value;"> <option value="16px" >С��</option> <option value="18px" >��С</option> <option value="22px" >�к�</option><option value="24px" >�ϴ�</option><option value="26px" >���</option></select>&nbsp;             ���˫������<input name=scrollspeed id=scrollspeed onchange="javascript:setSpeed();" size=2 value=5>            (1-10��1������10��죩             <input name=saveset id=saveset onclick="javascript:saveSet();" type=button value=��������><br /><br />');
}
function show_pagebottom(){
	document.writeln("<script type=\"text\/javascript\">var timer,speed=5,currentpos=1,d=document,$=function(x){return d.getElementById(x);},bcolor=$(\'bcolor\');var bccolor=$(\'bccolor\');var txtcolor=$(\'txtcolor\');var fonttype=$(\'fonttype\');var scrollspeed=$(\'scrollspeed\');function setSpeed(){speed=parseInt(scrollspeed.value);if(speed<1||speed>10){speed=5;scrollspeed.value=5;}}function stopScroll(){clearInterval(timer);}function beginScroll(){timer=setInterval(\"scrolling()\",300\/speed);}function scrolling(){var currentpos=window.pageYOffset||d.documentElement.scrollTop||d.body.scrollTop||0;window.scroll(0,++currentpos);var nowpos=window.pageYOffset||d.documentElement.scrollTop||d.body.scrollTop||0;if(currentpos!=nowpos)clearInterval(timer);}function setCookies(cookieName,cookieValue,expirehours){var today=new Date();var expire=new Date();expire.setTime(today.getTime()+3600000*356*24);d.cookie=cookieName+\'=\'+escape(cookieValue)+\';expires=\'+expire.toGMTString()+\'; path=\/\';}function ReadCookies(cookieName){var theCookie=\'\'+d.cookie;var ind=theCookie.indexOf(cookieName);if(ind==-1||cookieName==\'\')return\'\';var ind1=theCookie.indexOf(\';\',ind);if(ind1==-1)ind1=theCookie.length;return unescape(theCookie.substring(ind+cookieName.length+1,ind1));}function saveSet(){setCookies(\"bcolor\",bcolor.options[bcolor.selectedIndex].value);setCookies(\"bccolor\",bccolor.options[bccolor.selectedIndex].value);setCookies(\"txtcolor\",txtcolor.options[txtcolor.selectedIndex].value);setCookies(\"fonttype\",fonttype.options[fonttype.selectedIndex].value);setCookies(\"scrollspeed\",scrollspeed.value);}function loadSet(){var tmpstr;tmpstr=ReadCookies(\"bcolor\");bcolor.selectedIndex=0;if(tmpstr!=\"\"){for(var i=0;i<bcolor.length;i++){if(bcolor.options[i].value==tmpstr){bcolor.selectedIndex=i;break;}}}tmpstr=ReadCookies(\"bccolor\");bccolor.selectedIndex=0;if(tmpstr!=\"\"){for(var i=0;i<bccolor.length;i++){if(bccolor.options[i].value==tmpstr){bccolor.selectedIndex=i;break;}}}tmpstr=ReadCookies(\"txtcolor\");txtcolor.selectedIndex=0;if(tmpstr!=\"\"){for(var i=0;i<txtcolor.length;i++){if(txtcolor.options[i].value==tmpstr){txtcolor.selectedIndex=i;break;}}}tmpstr=ReadCookies(\"fonttype\");fonttype.selectedIndex=2;if(tmpstr!=\"\"){for(var i=0;i<fonttype.length;i++){if(fonttype.options[i].value==tmpstr){fonttype.selectedIndex=i;break;}}}tmpstr=ReadCookies(\"scrollspeed\");if(tmpstr==\'\')tmpstr=5;scrollspeed.value=tmpstr;setSpeed();d.body.style.background=bcolor.options[bcolor.selectedIndex].value;var contentsobj=$(\'contents\');contentsobj.style.fontSize=fonttype.options[fonttype.selectedIndex].value;contentsobj.style.color=txtcolor.options[txtcolor.selectedIndex].value;$(\'amain\').style.background=bcolor.options[bccolor.selectedIndex].value;}d.onmousedown=stopScroll;d.ondblclick=beginScroll;loadSet();<\/script>");
}
function closeEr(){
		document.getElementById("erwei").style.display = "none";
		Cookie.set('erwei',1,1);
} 
//�ٶ���������250*200�ٶȷ��� �ٶ�ͳ�ƴ���
function show_foot(){
	var is_erwei = Cookie.get("erwei");
	if(typeof(is_erwei)=='undefine' || is_erwei == '' || is_erwei == null){
document.writeln('<div id="erwei"><a href="https://m.x23us.com" target="_blank"><img src="/images/code.png" border="0" style="cursor:pointer;top:40px;position: fixed;right:20px;"></a><a href="javascript:;" onclick="closeEr()"><img src="/images/close.png" border="0" style="cursor:pointer;top:155px;position: fixed;right:20px;"></a></div>');
	}
//ͳ�ƴ���
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?534ede4b11a35873e104d2b5040935e0";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
document.writeln('<script charset="gbk" src="https://www.baidu.com/js/opensug.js"></script>');

}
//����Ŀ¼ҳ���01
function show_list(){
}
//����Ŀ¼ҳ���02
function show_list2(){
 }
//�����Ķ�ҳ�������360*300
function show_htm(){
}
//�����Ķ�ҳ�ײ����
function show_htm2(){
}
//��ҳ���01
function show_index(){
//document.writeln('<div style="border: 1px solid #E4E4E4;color:red;width:960px;line-height:25px;margin:5px auto;padding:0px;text-align:left;font-size: 18px;">&nbsp;&nbsp;&nbsp;&nbsp;���Ҽ�ס����С˵����www.x23us.com��лл��λ���ѵ�֧�֣�</div>');

}
//��ҳ���02
function show_index2(){
document.writeln("");
}
//��ҳ���03
function show_index3(){
document.writeln("");
}
//�б�ҳ���01
function show_class(){
document.writeln("");
}
//�б�ҳ���02
function show_class2(){
document.writeln("");
}

function show_book(){
document.writeln("")
}
function show_book2(){
}

//bd ����
function bd_index_panel(){
}
function show_search(){
/*document.writeln("<li style=\"float:right;\"><form target=\"_blank\" action=\"https://zhannei.baidu.com/cse/search\" method=\"get\"><input type=\"hidden\" name=\"s\" value=\"5592277830829141693\"><input type=\"hidden\" name=\"entry\" value=\"1\"><input type=\"text\" name=\"q\" baidusug=\"2\" placeholder=\"��ʾ:������,�����\" autocomplete=\"off\" style=\"width:200px\">  <input type=\"submit\" value=\"��  ��\"></form></li>");*/
document.writeln("<li style=\"float:right;\"><form target=\"_blank\" action=\"https://www.x23us.com/modules/article/search.php\" method=\"get\"><input name=\'searchtype\' type=\'hidden\' value=\'keywords\'/><input type=\"text\" name=\"searchkey\" placeholder=\"��ʾ:������,�����\" autocomplete=\"off\" style=\"width:200px\">  <input type=\"submit\" value=\"��  ��\"></form></li>");
}

function bd_search(){
/*document.writeln("<form target=\"_blank\" action=\"https://zhannei.baidu.com/cse/search\" method=\"get\"><input type=\"hidden\" name=\"s\" value=\"5592277830829141693\"><input type=\"hidden\" name=\"entry\" value=\"1\"><dl class=\"fl searchbox\"><dt><i></i><input type=\"text\" name=\"q\" baidusug=\"2\" placeholder=\"��ʾ:ֻ��������������,������,�����\" autocomplete=\"off\"> </dt><dd><button type=\"submit\" class=\"so_book\"></button></dd></dl></form>");*/
document.writeln("<form target=\"_blank\" action=\"https://www.x23us.com/modules/article/search.php\" method=\"get\"><input type=\"hidden\" name=\"searchtype\" value=\"keywords\"><dl class=\"fl searchbox\"><dt><i></i><input type=\"text\" name=\"searchkey\" placeholder=\"��ʾ:ֻ��������������,������,�����\" autocomplete=\"off\"> </dt><dd><button type=\"submit\" class=\"so_book\"></button></dd></dl></form>");
}

/******************�����ղأ���Ϊ��ҳ********************/
function addFavorite2() {
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
        alert("����360������������ƣ��밴 Ctrl+D �ֶ��ղأ�");
    }
    else if (ua.indexOf("msie 8") > -1) {
        window.external.AddToFavoritesBar(url, title); //IE8
    }
    else if (document.all) {
  try{
   window.external.addFavorite(url, title);
  }catch(e){
   alert('�����������֧��,�밴 Ctrl+D �ֶ��ղ�!');
  }
    }
    else {
		displayDialog('<!doctype html><html lang=\"en\"><head><meta charset=\"GBK\"><title>�ղ�</title></head><body><p style=\"color:red;width:360px;height:120px;line-height:30px;text-indent: 10px;font-size: 16px;padding-top: 30px;text-align:center;\">�����������֧��,�밴 Ctrl+D �ֶ��ղ�!<br><a href=\"https://www.x23us.com\">https://www.x23us.com&nbsp;&nbsp;&nbsp;����С˵</a><br><input type="button" style=\"border: 2px solid #8bcee4;font-size: 20px;width:60px;height:30px;margin-top:15px\"onclick="closeDialog()" value="ȷ&nbsp;��"></button></p></body></html>');
    }
}
function SetHome(obj,vrl){ 
	try{ 
		obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl); 
	} 
	catch(e){ 
		if(window.netscape) { 
			try { 
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
			} 
			catch (e) { 
				alert("�˲�����������ܾ���\n�����������ַ�����롰about:config�����س�\nȻ�� [signed.applets.codebase_principal_support]��ֵ����Ϊ'true',˫�����ɡ�"); 
			} 
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch); 
			prefs.setCharPref('browser.startup.homepage',vrl); 
		}else{ 
			alert("�����������֧�֣��밴�����沽�������1.����������á�2.���������ҳ��3.���룺"+vrl+"���ȷ����"); 
		} 
	}
}
/**********************************************/

function show_share(){
}
function info_top(){
}

function info_share(){
	//bd_index_panel();
}
function class_share(){
	//bd_index_panel();
}


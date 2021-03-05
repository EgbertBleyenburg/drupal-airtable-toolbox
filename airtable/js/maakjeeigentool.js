/*!
 * Created by egbert@overboord.nl for samenbeter.org/airtable connection
 **/
 var f = document.createElement("form");
 var origin=window.location.hostname;
 // maar wanneer we uit een iframe komen hebben de de moeder url als argument mee
 var param1 = getParamValue('origin');
 if (param1 && (param1 != '')) {
	 origin=param1;
 }
 var param2 = getParamValue('abuttontext');
 if (param2 && (param2 != '')) {
	 buttontext=decodeURI(param2);
 }
// alert(window.parent.location.hostname);
 f.setAttribute('target',"_blank");
 f.setAttribute('method',"post");
 f.setAttribute('action',"https://www.samenbeter.org/toolbox/maak-een-nieuwe-tool");
 var i = document.createElement("input"); //input element, text
 i.setAttribute('type',"hidden");
 i.setAttribute('name','origin');
 i.setAttribute('value',origin);
  var s = document.createElement("input"); //input element, Submit button
  s.setAttribute('type',"submit");
  s.setAttribute('value',buttontext);
  f.appendChild(i);
  f.appendChild(s);
  document.getElementById("Mxschdehrndeslendmmne").appendChild(f);
  
 // document.head.insertAdjacentHTML("beforeend", `<style>body{background:red}</style>`)
  
  function getParamValue(paramName)
  {
      var url = window.location.search.substring(1); //get rid of "?" in querystring
      var qArray = url.split('&'); //get key-value pairs
      for (var i = 0; i < qArray.length; i++) 
      {
          var pArr = qArray[i].split('='); //split key and value
          if (pArr[0] == paramName) 
              return pArr[1]; //return value
      }
  }
 
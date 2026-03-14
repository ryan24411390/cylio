(function($){$(function(){'use strict'
function setCookie(cname,cvalue,exdays){const d=new Date();d.setTime(d.getTime()+(exdays*24*60*60*1000));let expires="expires="+d.toUTCString();document.cookie=cname+"="+cvalue+";"+expires+";path=/"}
function getCookie(cname){let name=cname+"=";let ca=document.cookie.split(';');for(let i=0;i<ca.length;i++){let c=ca[i];while(c.charAt(0)==' '){c=c.substring(1)}
if(c.indexOf(name)==0){return c.substring(name.length,c.length)}}
return""}
function checkCookie(){let user=getCookie("username");if(user!=""){alert("Welcome again "+user)}else{user=prompt("Please enter your name:","");if(user!=""&&user!=null){setCookie("username",user,365)}}}
const urlParams=new URLSearchParams(window.location.search);let utm_source=urlParams.get('utm_source')||getCookie('envy_utm_source');let utm_medium=urlParams.get('utm_medium')||getCookie('envy_utm_medium');let utm_campaign=urlParams.get('utm_campaign')||getCookie('envy_utm_campaign');if(utm_source){$(`input.gform_hidden-utm_source`).val(utm_source)}
if(utm_campaign){$(`input.gform_hidden-utm_campaign`).val(utm_campaign)}
if(utm_medium){$(`input.gform_hidden-utm_medium`).val(utm_medium)}
setCookie('envy_utm_source',utm_source,365);setCookie('envy_utm_campaign',utm_campaign,365);setCookie('envy_utm_medium',utm_medium,365)})}(jQuery))
;
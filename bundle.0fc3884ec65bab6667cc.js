(()=>{"use strict";const t=60,e=10,i=400,n=2,o=40,r=500,s=5,h=50,u=200,a=-40,d=40,c=10,p=25;var l=function(){function t(t,e){this.x=t,this.y=e}return t.prototype.magnitude=function(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))},t.prototype.angle=function(){return 180*Math.atan2(this.y,this.x)/Math.PI},t}();const y=l;var f=function(t,e){return new l(t.x+e.x,t.y+e.y)},g=function(t,e){return new l(t.x*e,t.y*e)},m=function(t,e){var i=Math.PI/180*e;return new l(t*Math.cos(i),t*Math.sin(i))},v=function(e,i,n){var o=g(i,1/t),r=f(e,o);return n&&w(r),r},w=function(t){t.x=t.x%window.innerWidth,t.y=t.y%window.innerHeight,t.x<0&&(t.x=window.innerWidth),t.y<0&&(t.y=window.innerHeight)},b=function(t,e){return(t+e/60/60*360)%360};const I=function(){function t(e,i){this.position=e,this.velocity=m(r,i),this.hit=!1,this.bulletId=t.nextBulletId,t.nextBulletId+=1}return t.prototype.getIdString=function(){return"bullet"+this.bulletId},t.prototype.tick=function(){this.position=v(this.position,this.velocity,!1)},t.prototype.alive=function(){return!(this.hit||this.position.x>window.innerWidth||this.position.y>window.innerHeight||this.position.x<0||this.position.y<0)},t.prototype.collided=function(t){t.isAsteroid()&&(this.hit=!0)},t.prototype.remove=function(t){var e=document.getElementById(this.getIdString());e&&t.removeChild(e)},t.prototype.createElement=function(t){var e=document.createElementNS(t.namespaceURI,"circle");t.appendChild(e),e.classList.add("bullet"),e.setAttribute("id",this.getIdString()),e.setAttribute("r",String(s))},t.prototype.render=function(t){document.getElementById(this.getIdString())||this.createElement(t);var e=document.getElementById(this.getIdString()),i="translate("+this.position.x+", "+this.position.y+")";e.setAttribute("transform",i)},t.prototype.getRadius=function(){return s},t.prototype.getPosition=function(){return this.position},t.prototype.isAsteroid=function(){return!1},t.prototype.isBullet=function(){return!0},t.prototype.onDeadReturn=function(){return[]},t.nextBulletId=0,t}(),k=function(){function t(){this.reset(),this.remainingLives=3,this.dead=!1}return t.prototype.reset=function(){this.rotation=90,this.rpm=0,this.invulnerableTicksRemaining=60,this.center()},t.prototype.center=function(){this.position=new y(window.innerWidth/2,window.innerHeight/2),this.velocity=new y(0,0)},t.prototype.tick=function(){this.invulnerableTicksRemaining=this.invulnerableTicksRemaining<=0?0:this.invulnerableTicksRemaining-1,this.position=v(this.position,this.velocity,!0),this.rotation=b(this.rotation,this.rpm)},t.prototype.alive=function(){return!this.dead},t.prototype.thrust=function(){var t,n,o=m(e,this.rotation),r=new y(o.x,-o.y);this.velocity=f(this.velocity,r),this.velocity.magnitude()<=i||(this.velocity=(t=this.velocity,n=i,g(function(t){var e=t.magnitude();return g(t,1/e)}(t),n)))},t.prototype.turnLeft=function(){this.rpm+=n,this.handleMaxRpm()},t.prototype.turnRight=function(){this.rpm-=n,this.handleMaxRpm()},t.prototype.handleMaxRpm=function(){this.rpm>o?this.rpm=o:this.rpm<-o&&(this.rpm=-o)},t.prototype.shoot=function(){return new I(this.position,-this.rotation)},t.prototype.createElement=function(t){var e=document.createElementNS(t.namespaceURI,"polygon");t.appendChild(e),e.setAttribute("id","ship"),e.setAttribute("points","0,0 0,30 50,15")},t.prototype.getRemainingLives=function(){return this.remainingLives},t.prototype.render=function(t){document.getElementById("ship")||this.createElement(t);var e=document.getElementById("ship"),i="translate("+(this.position.x-25)+", "+(this.position.y-15)+") rotate("+-this.rotation+" 25 15) ";e.setAttribute("transform",i)},t.prototype.getPosition=function(){return this.position},t.prototype.getRadius=function(){return 15},t.prototype.isAsteroid=function(){return!1},t.prototype.isBullet=function(){return!1},t.prototype.collided=function(t){0===this.invulnerableTicksRemaining&&t.isAsteroid()&&(this.remainingLives-=1,this.dead=this.remainingLives<0,this.invulnerableTicksRemaining=60,this.remainingLives>=0&&this.center())},t.prototype.remove=function(t){var e=document.getElementById("ship");e&&t.removeChild(e)},t.prototype.onDeadReturn=function(){return[]},t}();var A=function(t,e){return t=Math.ceil(t),e=Math.floor(e),Math.floor(Math.random()*(e-t+1))+t};const E="20,20 35,5 55,20 85,20 90,60 60,70 35,90 10,60 20,40",x="10,10 16,3 26,10 42,10 45,30 30,35 17,45 5,30 10,20",R=function(){function t(e,i){void 0===i&&(i=null),this.small=e,this.velocity=m(A(h,u),A(0,360)),this.position=null===i?new y(window.innerWidth,window.innerHeight):i,this.rotation=0,this.rpm=A(a,d),this.asteroidId=t.nextAsteroidId,this.dead=!1,t.nextAsteroidId+=1}return t.prototype.getIdString=function(){return"asteroid"+this.asteroidId},t.prototype.getPoints=function(){return this.small?x:E},t.prototype.tick=function(){this.position=v(this.position,this.velocity,!0),this.rotation=b(this.rotation,this.rpm)},t.prototype.createElement=function(t){var e=document.createElementNS(t.namespaceURI,"polygon");t.appendChild(e),e.setAttribute("id",this.getIdString()),e.setAttribute("points",this.getPoints()),e.classList.add("asteroid")},t.prototype.getWidthHeight=function(){return this.small?50:100},t.prototype.render=function(t){document.getElementById(this.getIdString())||this.createElement(t);var e=document.getElementById(this.getIdString()),i="translate("+(this.position.x-this.getWidthHeight()/2)+", "+(this.position.y-this.getWidthHeight()/2)+") rotate("+-this.rotation+" "+this.getWidthHeight()/2+" "+this.getWidthHeight()/2+") ";e.setAttribute("transform",i)},t.prototype.remove=function(t){var e=document.getElementById(this.getIdString());e&&t.removeChild(e)},t.prototype.break=function(){if(this.small)return[];var e=[];return e.push(new t(!0,this.position)),e.push(new t(!0,this.position)),e.push(new t(!0,this.position)),e},t.prototype.getPosition=function(){return this.position},t.prototype.getRadius=function(){return this.getWidthHeight()/2*.8},t.prototype.isSmall=function(){return this.small},t.prototype.isAsteroid=function(){return!0},t.prototype.isBullet=function(){return!1},t.prototype.collided=function(t){t.isBullet()&&(this.dead=!0)},t.prototype.alive=function(){return!this.dead},t.addAsteroid=function(e,i){return i%e==0?[new t(!1)]:[]},t.prototype.onDeadReturn=function(t){this.break().forEach((function(e){return t.addAsteroid(e)})),t.addPoints(this.small?c:p)},t.nextAsteroidId=0,t}();const D=function(t,e){(function(t,e){var i,n;return(i=t.getPosition(),n=e.getPosition(),new l(i.x-n.x,i.y-n.y)).magnitude()-t.getRadius()-e.getRadius()<0})(t,e)&&(t.collided(e),e.collided(t))};var B=function(){var t=+window.localStorage.getItem("asteroids-high-score");return NaN===t?0:t},S=function(t){return"translate("+(window.innerWidth-60*t)+" "+(window.innerHeight-60)+") rotate(-90 25 15)"};const j=function(){function t(){this.resetState()}return t.prototype.resetState=function(){this.ship=new k,this.deadObjects=this.gameObjects||[],this.gameObjects=[this.ship],this.paused=!0,this.tickCount=0,this.over=!1,this.upDown=!1,this.leftDown=!1,this.rightDown=!1,this.points=0,this.asteroidFrequency=500},t.prototype.render=function(t){var e,i,n,o;e=this.ship.getRemainingLives(),i=document.getElementById("life1"),n=document.getElementById("life2"),o=document.getElementById("life3"),i.setAttribute("visibility",e<=0?"hidden":"visible"),n.setAttribute("visibility",e<=1?"hidden":"visible"),o.setAttribute("visibility",e<=2?"hidden":"visible"),i.setAttribute("transform",S(1)),n.setAttribute("transform",S(2)),o.setAttribute("transform",S(3)),this.gameObjects.forEach((function(e){return e.render(t)})),this.deadObjects.forEach((function(e){return e.remove(t)})),this.deadObjects=[],document.getElementById("high-score").textContent="High Score: "+B();var r=document.getElementById("message"),s="Points: "+this.points;this.over?s=s.concat("<br />Press &lt;r&gt; to restart"):this.paused&&(s=s.concat("<br />Press &lt;esc&gt; to unpause")),r.innerHTML=s},t.prototype.getDeadObjects=function(){return this.gameObjects.filter((function(t){return!t.alive()}))},t.prototype.removeDeadObjects=function(){this.deadObjects=this.gameObjects.filter((function(t){return!t.alive()})),this.gameObjects=this.gameObjects.filter((function(t){return t.alive()}))},t.prototype.tick=function(){var t,e=this;this.paused||this.over||(this.handleDownKeys(),this.removeDeadObjects(),this.deadObjects.forEach((function(t){t.onDeadReturn(e)})),this.gameObjects.forEach((function(t){return t.tick()})),this.gameObjects=this.gameObjects.concat(R.addAsteroid(this.asteroidFrequency,this.tickCount)),console.log(this.asteroidFrequency),this.tickCount%120==0&&(this.asteroidFrequency=Math.max(this.asteroidFrequency-5,60)),this.handleCollisions(),this.ship.alive()||(this.over=!0),(t=this.points)<=B()||window.localStorage.setItem("asteroids-high-score",String(t)),this.tickCount+=1)},t.prototype.handleCollisions=function(){for(var t=this.gameObjects,e=0;e<t.length;e++)for(var i=e;i<t.length;i++)D(t[e],t[i])},t.prototype.togglePaused=function(){this.paused=!this.paused},t.prototype.handleDownKeys=function(){this.upDown&&this.ship.thrust(),this.leftDown&&this.ship.turnLeft(),this.rightDown&&this.ship.turnRight()},t.prototype.keyDownHandler=function(t){if(!this.over&&("Escape"===t.key&&(this.paused=!this.paused),!this.paused))if("ArrowUp"===t.key||"w"===t.key)this.upDown=!0;else if("ArrowLeft"===t.key||"a"===t.key)this.leftDown=!0;else if("ArrowRight"===t.key||"d"===t.key)this.rightDown=!0;else if(" "===t.key){var e=this.ship.shoot();this.gameObjects.push(e)}},t.prototype.keyUpHandler=function(t){this.paused||this.over||("ArrowUp"===t.key||"w"===t.key?this.upDown=!1:"ArrowLeft"===t.key||"a"===t.key?this.leftDown=!1:"ArrowRight"!==t.key&&"d"!==t.key||(this.rightDown=!1))},t.prototype.addAsteroid=function(t){this.gameObjects.push(t)},t.prototype.addPoints=function(t){this.points+=t},t}();var O=document.getElementById("svg"),H=new j;H.render(O),setInterval((function(){H.tick(),H.render(O)}),1e3/t),window.addEventListener("keydown",(function(t){"r"===t.key&&(t.repeat||(H.resetState(),H.render(O)))})),window.addEventListener("keydown",(function(t){t.repeat||H.keyDownHandler(t)})),window.addEventListener("keyup",(function(t){H.keyUpHandler(t)}))})();
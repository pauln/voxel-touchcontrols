# voxel-touchcontrols

touch controls for Voxel Engine

a basic navigation pad is used for movement, with dragging on the main area to look in different directions

## install

step 1:

`npm install voxel-touchcontrols`

step 2: 

include some html in your page that looks like this (you probably want images or at least more appropriate characters):

```html
<nav class="touch-control left" id="touchcontrols">
  <ul>
    <li>FL</li>
    <li>F</li>
    <li>FR</li>
    <li>L</li>
    <li>J</li>
    <li>R</li>
    <li class="last">B</li>
  </ul>
</nav>
```

You probably want to include some CSS to arrange them and position them decently:

```css
.touch-control {
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.touch-control {z-index:10; position:absolute; bottom:10px; left:10px;}
.touch-control ul {margin:0; padding:0; width:150px; height:150px;}
.touch-control li {width:50px; height:50px; float:left; list-style: none; background: rgba(255,255,255,0.4); text-align:center; vertical-align: middle;}
.touch-control li.last {margin-left:50px;}
```

step 3:

```javascript
var touchcontrols = require('voxel-touchcontrols')
touchcontrols(document.getElementById('touchcontrols'), game.controls, container)
```

use [browserify](http://browserify.org/) to package voxel-touchcontrols for use in your client side app!

## license

BSD

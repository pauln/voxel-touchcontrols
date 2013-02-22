module.exports = function(el, state, container) {
  var ul = el.getElementsByTagName('ul')[0]
  var lastFlags = []
  var controlsTouch = -1
  var containerTouch = {"id":-1, "x":-1, "y":-1}
  el.addEventListener('touchstart', startTouchControls)
  el.addEventListener('touchmove', handleTouchControls)
  el.addEventListener('touchend', unTouchControls)
  container.addEventListener('touchstart', startTouchContainer)
  container.addEventListener('touchmove', handleTouchContainer)
  container.addEventListener('touchend', unTouchContainer)
  function startTouchControls(event) {
    if (controlsTouch === -1) {
      controlsTouch = event.targetTouches[0].identifier
    }
    handleTouchControls(event)
  }
  function handleTouchControls(event) {
    event.preventDefault()
    var touch = null
    if (event.targetTouches.length > 1) {
      for (t in event.targetTouches) {
        if (event.targetTouches[t].identifier === controlsTouch) {
          touch = event.targetTouches[t]
          break
        }
      }
    } else {
      touch = event.targetTouches[0]
    }
    if (touch === null) return
    var top=touch.clientY-el.offsetTop
    var left=touch.clientX-el.offsetLeft
    var flags=[]
    if (top < 50) flags.push('forward')
    if (left < 50 && top < 100) flags.push('left')
    if (left > 100 && top < 100) flags.push('right')
    if (top > 100 && left > 50 && left < 100) flags.push('backward')
    if (top > 50 && top < 100 && left > 50 && left < 100) flags.push('jump')

    if (flags.indexOf('jump') === -1) {
      for (flag in lastFlags) {
        if (flags.indexOf(lastFlags[flag]) !== -1) {
          lastFlags.splice(flag, 1)
        }
      }
      setState(lastFlags, 0)
      setState(flags, 1)
      lastFlags = flags
    } else if (lastFlags.indexOf('jump') === -1) {
      // Start jumping (in additional to existing movement)
      lastFlags.push('jump')
      setState(['jump'], 1)
    }
  }
  function unTouchControls() {
    setState(lastFlags, 0)
    lastFlags = []
    controlsTouch = -1
  }
  function setState(states, value) {
    var delta = {}
    for(s in states) {
      delta[states[s]] = value
    }
    state.write(delta)
  }
  function startTouchContainer(event) {
    if (containerTouch.id === -1) {
      containerTouch.id = event.targetTouches[0].identifier
      containerTouch.x = event.targetTouches[0].clientX
      containerTouch.y = event.targetTouches[0].clientY
    }
    handleTouchContainer(event)
  }
  function handleTouchContainer(event) {
    event.preventDefault()
    var touch = null, x = y = -1, delta = {}
    for (t in event.targetTouches) {
      if (event.targetTouches[t].identifier === containerTouch.id) {
        touch = event.targetTouches[t]
        break
      }
    }
    if (touch === null) return
    dx = containerTouch.x - touch.clientX
    dy = containerTouch.y - touch.clientY

    delta.x_rotation_accum = dy * 2
    delta.y_rotation_accum = dx * 8
    state.write(delta)

    containerTouch.x = touch.clientX
    containerTouch.y = touch.clientY
  }
  function unTouchContainer(event) {
    containerTouch = {"id":-1, "x":-1, "y":-1}
  }
}
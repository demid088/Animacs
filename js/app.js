// VAR *************************

const AURA_WIDTH = 46
const AURA_HEIGHT = 46

function cl(msg) {
  console.log(msg)
}

// EVENTs *****************************************************************

document.addEventListener('DOMContentLoaded', () => {
  
  // CARD

  const body = document.querySelector('body'),
        cx = window.innerWidth / 2,
        cy = window.innerHeight / 2

  body.addEventListener('mousemove', (e) => {
    clientX = e.pageX,
    clientY = e.pageY
    
    // CARD
    requestAnimationFrame(MouseUpdate)

    // CURSOR
    cursor.classList.remove('hidden')
    aura.classList.remove('hidden')

    MouseCoords(e)
  })

  function MouseUpdate() {
    let dx = clientX - cx
    let dy = -(clientY - cy)

    let tiltX = dy / cy
    let tiltY = dx / cx

    const radius = Math.sqrt(Math.pow(tiltX, 2) + Math.pow(tiltY, 2))
    const degree = radius * 36

    const targetAnimate = document.querySelector('#card-wrapper__content')

    RotateElem(targetAnimate, tiltX, tiltY, 0, degree)
  }

  // CURSOR **********************************************

  const cursor = document.getElementById('cursor'),
        aura   = document.getElementById('cursor-aura'),
        links  = document.getElementsByTagName('a')
  
  aura.style.width = AURA_WIDTH + 'px'
  aura.style.height = AURA_HEIGHT + 'px'
  aura.style.top = 1 + 'px'
  aura.style.left = 1 + 'px'

  mouseX = mouseY = 0

  function MouseCoords(e) {
    mouseX = e.pageX
    mouseY = e.pageY

    PositionElem(cursor, mouseX, mouseY)
    PositionElem(aura, mouseX - (AURA_WIDTH / 2), mouseY - (AURA_HEIGHT / 2), 500)
  }
  
  // CURSOR LINKS ************************************************

  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('mouseover', () => {
      cursor.classList.add('active')
      aura.classList.add('active')
    })

    links[i].addEventListener('mouseout', () => {
      cursor.classList.remove('active')
      aura.classList.remove('active')
    })
  }

  // CURSOR HIDDEN ************************************************

  body.addEventListener('mouseout', () => {
    cursor.classList.add('hidden')
    aura.classList.add('hidden')
  })
})


// FUNCTIONs *****************************************************

function RotateElem(elem, x = 0, y = 0, z = 0, a = 0) {
  a = parseFloat(a)
  a = a.toFixed(2)

  const transformText = `rotate3d(${x}, ${y}, ${z}, ${a}deg)`

  elem.style.transform = transformText
}

function PositionElem(elem, left = 0, top = 0, duration = 0) {
  if (duration <= 0) {
    elem.style.top = top + 'px'
    elem.style.left = left + 'px'
  } else {
    Animate(Timing, Draw, duration, elem, left, top)
  }
}

// ANIMACS *************************************************************

function Animate(timing, draw, duration, ...drawProp) {
  let start = performance.now()

  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration

    if (timeFraction > 1) timeFraction = 1
    if (timeFraction < 0) timeFraction = 0
    
    // вычисление текущего состояния анимации
    let progress = timing(timeFraction)
    
    // отрисовать её
    draw(progress, ...drawProp);

    // запускаем анимацию до конца duration
    if (timeFraction < 1) {
      requestAnimationFrame(animate)
    }
  })
}

function Draw(progress, elem, left = 0, top = 0) {
  const currentTop = parseInt(elem.style.top)
  const currentLeft = parseInt(elem.style.left)
  const resultTop = currentTop + (top - currentTop) * progress
  const resultLeft = currentLeft + (left - currentLeft) * progress

  elem.style.top = resultTop + 'px'
  elem.style.left = resultLeft + 'px'
}

function Timing(t) {
  // Плавное торможение
  return BezierCurves(0.2, 0.3, t)
}

// ГЕОМЕТР. ФОРМУЛЫ*******************************************************************

function BezierCurves(p1 = 0, p2 = 0, t = 1) {
  // Кривая Безье (cubic)
  // 0 <= t <= 1
  // R(t) = p0 * Math.pow(1 - t, 3) + 3 * p1 * t * Math.pow(1 - t, 2) + 3 * p2 * Math.pow(t, 2) * (1 - t) + p3 * Math.pow(t, 3)
  
  const p0 = 0
  const p3 = 1

  if (t >=0 && t <= 1)
    return p0 * Math.pow(1 - t, 3) + 3 * p1 * t * Math.pow(1 - t, 2) + 3 * p2 * Math.pow(t, 2) * (1 - t) + p3 * Math.pow(t, 3)

  return 1
}

function Pow(t = 0, pow = 2) {
  return Math.pow(t, pow)
}

function Back(t, x = 1) {
  return Math.pow(t, 2) * ((x + 1) * t - x);
}

function Bounce(t) {
  for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
     if (t >= (7 - 4 * a) / 11)
         return -Math.pow((11 - 6 * a - 11 * t) / 4, 2) + Math.pow(b, 2);
  }
}
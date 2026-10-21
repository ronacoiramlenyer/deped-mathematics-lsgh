/* Math 7 SimBook – shared helpers used by every simulation. */
(function () {
  "use strict";

  const SVGNS = "http://www.w3.org/2000/svg";

  function h(tag, attrs, ...kids) {
    const node = document.createElement(tag);
    setAttrs(node, attrs);
    append(node, kids);
    return node;
  }

  function s(tag, attrs, ...kids) {
    const node = document.createElementNS(SVGNS, tag);
    setAttrs(node, attrs);
    append(node, kids);
    return node;
  }

  function setAttrs(node, attrs) {
    if (!attrs) return;
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") node.setAttribute("class", v);
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    }
  }

  function append(node, kids) {
    for (const kid of kids.flat()) {
      if (kid === undefined || kid === null || kid === false) continue;
      node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // ------------------------------------------------------------ numbers

  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const round = (x, d = 2) => { const f = 10 ** d; return Math.round((x + Number.EPSILON) * f) / f; };
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

  function fmt(x, d = 2) {
    const r = round(x, d);
    return r.toLocaleString("en-PH", { maximumFractionDigits: d });
  }
  function peso(x) {
    return "₱" + round(x, 2).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  class Frac {
    constructor(n, d = 1) {
      if (d === 0) throw new Error("zero denominator");
      if (d < 0) { n = -n; d = -d; }
      const g = gcd(n, d);
      this.n = n / g; this.d = d / g;
    }
    static of(x) { return x instanceof Frac ? x : new Frac(x, 1); }
    add(o) { o = Frac.of(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Frac.of(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Frac.of(o); return new Frac(this.n * o.n, this.d * o.d); }
    div(o) { o = Frac.of(o); return new Frac(this.n * o.d, this.d * o.n); }
    value() { return this.n / this.d; }
    eq(o) { o = Frac.of(o); return this.n === o.n && this.d === o.d; }
    toString() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
    mixed() {
      if (this.d === 1) return String(this.n);
      const w = Math.trunc(this.n / this.d), r = Math.abs(this.n % this.d);
      return w === 0 ? `${this.n}/${this.d}` : `${w} ${r}/${this.d}`;
    }
  }

  /** Parses "3/4", "1 1/2", "0.75", "75%", or "2" into a Frac (null if invalid). */
  function parseNumber(text) {
    const t = String(text).trim().replace(/,/g, "").replace(/₱/g, "");
    if (!t) return null;
    let m;
    if ((m = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/))) {
      const w = +m[1], n = +m[2], d = +m[3];
      if (!d) return null;
      return new Frac(Math.abs(w) * d + n, d).mul(w < 0 ? -1 : 1);
    }
    if ((m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/))) return +m[2] ? new Frac(+m[1], +m[2]) : null;
    if ((m = t.match(/^(-?\d*\.?\d+)\s*%$/))) return decimalToFrac(m[1]).div(100);
    if ((m = t.match(/^-?\d*\.?\d+$/))) return decimalToFrac(t);
    return null;
  }
  function decimalToFrac(str) {
    const neg = str.startsWith("-");
    const [w, f = ""] = str.replace("-", "").split(".");
    const d = 10 ** f.length;
    const fr = new Frac(Number(w || 0) * d + Number(f || 0), d);
    return neg ? fr.mul(-1) : fr;
  }

  /** Long division of n/d: returns {whole, digits, repeatStart} (repeatStart = -1 if it ends). */
  function longDivision(n, d, maxDigits = 40) {
    const whole = Math.floor(n / d);
    let r = n % d;
    const seen = new Map();
    const digits = [];
    while (r !== 0 && digits.length < maxDigits) {
      if (seen.has(r)) return { whole, digits, repeatStart: seen.get(r) };
      seen.set(r, digits.length);
      r *= 10;
      digits.push(Math.floor(r / d));
      r %= d;
    }
    return { whole, digits, repeatStart: -1 };
  }

  function primeFactors(n) {
    const out = [];
    for (let p = 2; p * p <= n; p++) while (n % p === 0) { out.push(p); n /= p; }
    if (n > 1) out.push(n);
    return out;
  }

  // ------------------------------------------------------------ geometry

  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  /** Interior angle (degrees) at each vertex of a simple polygon, any orientation. */
  function interiorAngles(pts) {
    const n = pts.length;
    let area2 = 0;
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; area2 += a.x * b.y - b.x * a.y; }
    const orient = Math.sign(area2) || 1;
    return pts.map((p, i) => {
      const prev = pts[(i - 1 + n) % n], next = pts[(i + 1) % n];
      const u = { x: p.x - prev.x, y: p.y - prev.y }, v = { x: next.x - p.x, y: next.y - p.y };
      // Signed turn from the incoming side to the outgoing side; for the polygon's
      // orientation a positive turn is a convex corner, a negative one a reflex corner.
      const turn = toDeg(Math.atan2(u.x * v.y - u.y * v.x, u.x * v.x + u.y * v.y));
      return 180 - orient * turn;
    });
  }

  function segmentsIntersect(p1, p2, p3, p4) {
    const d = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
    return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
  }
  function isSimple(pts) {
    const n = pts.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) continue;
      if (segmentsIntersect(pts[i], pts[(i + 1) % n], pts[j], pts[(j + 1) % n])) return false;
    }
    return true;
  }

  function regularPolygon(n, cx, cy, r, rot = -90) {
    return Array.from({ length: n }, (_, i) => {
      const a = toRad(rot + (360 * i) / n);
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
  }

  /** SVG path for an angle arc at vertex v between directions to a and b (inside angle). */
  function arcPath(v, a, b, r, sweepDeg) {
    const a1 = Math.atan2(a.y - v.y, a.x - v.x);
    const start = { x: v.x + r * Math.cos(a1), y: v.y + r * Math.sin(a1) };
    const a2 = a1 + toRad(sweepDeg);
    const end = { x: v.x + r * Math.cos(a2), y: v.y + r * Math.sin(a2) };
    const large = Math.abs(sweepDeg) > 180 ? 1 : 0;
    const sweep = sweepDeg > 0 ? 1 : 0;
    return `M${v.x},${v.y} L${start.x},${start.y} A${r},${r} 0 ${large} ${sweep} ${end.x},${end.y} Z`;
  }

  // ------------------------------------------------------------ interaction

  /** Makes an SVG element draggable; onMove receives a point in SVG user units. */
  function draggable(svg, node, onMove, onEnd) {
    node.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      node.setPointerCapture(ev.pointerId);
      const move = (e) => onMove(svgPoint(svg, e));
      const up = (e) => {
        node.removeEventListener("pointermove", move);
        node.removeEventListener("pointerup", up);
        node.removeEventListener("pointercancel", up);
        if (onEnd) onEnd(svgPoint(svg, e));
      };
      node.addEventListener("pointermove", move);
      node.addEventListener("pointerup", up);
      node.addEventListener("pointercancel", up);
    });
  }
  function svgPoint(svg, ev) {
    const pt = svg.createSVGPoint();
    pt.x = ev.clientX; pt.y = ev.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: p.x, y: p.y };
  }

  function tabs(defs, onChange) {
    const bar = h("div", { class: "tabs", role: "tablist" });
    const buttons = defs.map((d, i) => h("button", {
      role: "tab", "aria-selected": i === 0 ? "true" : "false", type: "button",
      onclick: () => select(i),
    }, d));
    bar.append(...buttons);
    function select(i) {
      buttons.forEach((b, j) => b.setAttribute("aria-selected", j === i ? "true" : "false"));
      onChange(i);
    }
    return { el: bar, select };
  }

  function segmented(values, initial, onChange, label = (v) => String(v)) {
    const wrap = h("div", { class: "seg", role: "group" });
    const btns = values.map((v) => h("button", {
      type: "button", "aria-pressed": v === initial ? "true" : "false",
      onclick: () => { btns.forEach((b) => b.setAttribute("aria-pressed", "false")); btn(v).setAttribute("aria-pressed", "true"); onChange(v); },
    }, label(v)));
    const btn = (v) => btns[values.indexOf(v)];
    wrap.append(...btns);
    return wrap;
  }

  function stat(label, value) {
    const b = h("b", {}, value);
    return { el: h("span", { class: "stat" }, label + " ", b), set: (v) => { b.textContent = v; } };
  }

  function pill(ok, yes, no) { return h("span", { class: "pill " + (ok ? "yes" : "no") }, ok ? yes : no); }

  function animate(duration, step, done) {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { step(1); if (done) done(); return () => {}; }
    let raf, start;
    const tick = (t) => {
      if (start === undefined) start = t;
      const k = Math.min(1, (t - start) / duration);
      step(k);
      if (k < 1) raf = requestAnimationFrame(tick); else if (done) done();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }

  // ------------------------------------------------------------ motion

  const reducedMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /**
   * A damped spring that eases a number (or an array of numbers) toward a target.
   * Slightly under-damped, so values settle with a small elastic overshoot.
   * onUpdate(value) runs on every frame; set() retargets smoothly mid-flight.
   */
  class Spring {
    constructor(value, onUpdate, { stiffness = 210, damping = 19 } = {}) {
      this.isArray = Array.isArray(value);
      this.value = this.isArray ? value.slice() : value;
      this.target = this.isArray ? value.slice() : value;
      this.vel = this.isArray ? value.map(() => 0) : 0;
      this.k = stiffness; this.c = damping; this.onUpdate = onUpdate; this.raf = 0;
    }
    set(target) {
      this.target = this.isArray ? target.slice() : target;
      if (this.isArray && this.value.length !== target.length) { this.jump(target); return; }
      if (reducedMotion()) { this.jump(target); return; }
      if (!this.raf) { this.last = performance.now(); this.raf = requestAnimationFrame((t) => this.tick(t)); }
    }
    jump(v) {
      this.stop();
      this.value = this.isArray ? v.slice() : v; this.target = this.isArray ? v.slice() : v;
      this.vel = this.isArray ? v.map(() => 0) : 0;
      this.onUpdate(this.value);
    }
    stop() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; }
    tick(now) {
      const dt = Math.min(1 / 30, (now - this.last) / 1000); this.last = now;
      let moving = false;
      const step = (x, v, t) => {
        const a = -this.k * (x - t) - this.c * v;
        v += a * dt; x += v * dt;
        if (Math.abs(x - t) > 1e-3 || Math.abs(v) > 1e-3) moving = true;
        return [x, v];
      };
      if (this.isArray) {
        for (let i = 0; i < this.value.length; i++) [this.value[i], this.vel[i]] = step(this.value[i], this.vel[i], this.target[i]);
      } else [this.value, this.vel] = step(this.value, this.vel, this.target);
      if (!moving) { this.value = this.isArray ? this.target.slice() : this.target; this.raf = 0; this.onUpdate(this.value); return; }
      this.onUpdate(this.value);
      this.raf = requestAnimationFrame((t) => this.tick(t));
    }
  }

  const flat = (pts) => pts.flatMap((p) => [p.x, p.y]);
  const unflat = (arr) => { const out = []; for (let i = 0; i < arr.length; i += 2) out.push({ x: arr[i], y: arr[i + 1] }); return out; };

  /**
   * Regular polygon for a fractional number of sides: between n and n + 1, a new
   * vertex grows out of the last side, so changing the side count is a smooth morph.
   */
  function morphRegular(v, cx, cy, r, rot = -90) {
    const n = Math.floor(v + 1e-9), f = v - n;
    if (f < 1e-6) return regularPolygon(n, cx, cy, r, rot);
    const A = regularPolygon(n, cx, cy, r, rot); A.push({ ...A[0] });
    const B = regularPolygon(n + 1, cx, cy, r, rot);
    return A.map((p, i) => ({ x: p.x + (B[i].x - p.x) * f, y: p.y + (B[i].y - p.y) * f }));
  }

  /** Rubber-band a value that is dragged past [lo, hi]: it follows with resistance. */
  function rubber(x, lo, hi, give = 0.35) {
    if (x < lo) return lo - (lo - x) * give;
    if (x > hi) return hi + (x - hi) * give;
    return x;
  }

  /**
   * Elastic slider. While dragging, the value follows the pointer continuously
   * (onInput gets every in-between value). On release it springs to the nearest
   * allowed value – `step`, or the nearest entry of `snaps` – with a little overshoot.
   * Past either end it stretches like a rubber band and springs back.
   */
  function elasticSlider({ id, label, min, max, value, step = 0, snaps = null, format = (v) => fmt(v, 2), onInput, onChange }) {
    const wrap = h("div", { class: "eslider" });
    const name = h("span", { class: "eslider-label" }, label);
    const out = h("b", { class: "num eslider-value" });
    const track = h("div", { class: "eslider-track" });
    const fill = h("div", { class: "eslider-fill" });
    const thumb = h("div", { class: "eslider-thumb", role: "slider", tabindex: 0, id, "aria-label": label, "aria-valuemin": min, "aria-valuemax": max });
    track.append(fill, thumb);
    wrap.append(name, track, out);
    const snapTo = (x) => {
      x = clamp(x, min, max);
      if (snaps) return snaps.reduce((b, s) => (Math.abs(s - x) < Math.abs(b - x) ? s : b), snaps[0]);
      if (!step) return x;
      return clamp(Math.round((x - min) / step) * step + min, min, max);
    };
    let current = snapTo(value);
    const paint = (x) => {
      const k = (x - min) / (max - min);
      thumb.style.left = `${k * 100}%`;
      fill.style.width = `${clamp(k, 0, 1) * 100}%`;
      const shown = clamp(x, min, max);
      out.textContent = format(shown);
      thumb.setAttribute("aria-valuenow", String(round(shown, 4)));
      if (onInput) onInput(shown);
    };
    const spring = new Spring(current, paint, { stiffness: 260, damping: 16 });
    const fromPointer = (ev) => {
      const r = track.getBoundingClientRect();
      return min + ((ev.clientX - r.left) / r.width) * (max - min);
    };
    const settle = (target) => { current = snapTo(target); spring.set(current); if (onChange) onChange(current); };
    track.addEventListener("pointerdown", (ev) => {
      ev.preventDefault(); thumb.focus();
      track.setPointerCapture(ev.pointerId);
      spring.stop();
      const move = (e) => { const x = rubber(fromPointer(e), min, max); spring.value = x; spring.vel = 0; paint(x); };
      move(ev);
      const up = (e) => {
        track.removeEventListener("pointermove", move); track.removeEventListener("pointerup", up); track.removeEventListener("pointercancel", up);
        settle(fromPointer(e));
      };
      track.addEventListener("pointermove", move); track.addEventListener("pointerup", up); track.addEventListener("pointercancel", up);
    });
    thumb.addEventListener("keydown", (e) => {
      const delta = step || (snaps ? 0 : (max - min) / 100);
      let next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") next = snaps ? snaps[Math.min(snaps.length - 1, snaps.indexOf(current) + 1)] : current + delta;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = snaps ? snaps[Math.max(0, snaps.indexOf(current) - 1)] : current - delta;
      if (e.key === "Home") next = min;
      if (e.key === "End") next = max;
      if (next !== null) { e.preventDefault(); settle(next); }
    });
    paint(current);
    return { el: wrap, get value() { return current; }, set(v) { settle(v); }, jump(v) { current = snapTo(v); spring.jump(current); } };
  }

  /**
   * Persistent drag handles. The circles survive redraws (so a drag never loses its
   * pointer), and dragging past `bounds` rubber-bands, then springs back on release.
   * onMove(i, point) gets the live point; sync(points) repositions every handle.
   */
  function handleSet(svg, layer, { onMove, onEnd, bounds, label = "Point", r = 12 }) {
    let nodes = [];
    function make(i) {
      const c = s("circle", { r, class: "handle", tabindex: 0, "aria-label": `${label} ${i + 1}` });
      draggable(svg, c,
        (p) => onMove(i, bounds ? { x: rubber(p.x, bounds.x0, bounds.x1), y: rubber(p.y, bounds.y0, bounds.y1) } : p),
        (p) => { if (onEnd) onEnd(i, bounds ? { x: clamp(p.x, bounds.x0, bounds.x1), y: clamp(p.y, bounds.y0, bounds.y1) } : p); });
      return c;
    }
    return {
      sync(points) {
        while (nodes.length < points.length) { const c = make(nodes.length); nodes.push(c); layer.append(c); }
        while (nodes.length > points.length) nodes.pop().remove();
        points.forEach((p, i) => { nodes[i].setAttribute("cx", p.x); nodes[i].setAttribute("cy", p.y); });
      },
    };
  }

  // ------------------------------------------------------------ registry

  const lessons = [];
  function register(def) { lessons.push(def); }

  window.Sim = {
    h, s, clear, gcd, lcm, randInt, pick, shuffle, round, clamp, fmt, peso, Frac, parseNumber,
    longDivision, primeFactors, toRad, toDeg, dist, interiorAngles, isSimple, regularPolygon,
    arcPath, draggable, svgPoint, tabs, segmented, stat, pill, animate, register, lessons,
    Spring, flat, unflat, morphRegular, rubber, elasticSlider, reducedMotion, handleSet,
  };
})();

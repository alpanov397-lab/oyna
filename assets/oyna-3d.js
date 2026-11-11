/* OYNA 3D фон: компьютер, PlayStation геймпад, футбол добы.
   Таңдалған санатқа (PC / PS / Футбол) қарай ауысады. Басқа кодқа тиіспейді. */
(function () {
  if (!window.THREE) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'oyna3d';
  document.body.insertBefore(canvas, document.body.firstChild);

  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
  catch (e) { canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070418, 0.05);
  var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.6, 9);

  scene.add(new THREE.AmbientLight(0x9a8cff, 0.55));
  var l1 = new THREE.PointLight(0x22d3ee, 2.2, 30); l1.position.set(4, 4, 6); scene.add(l1);
  var l2 = new THREE.PointLight(0xf43f9e, 2.0, 30); l2.position.set(-5, 1, 2); scene.add(l2);
  var l3 = new THREE.DirectionalLight(0xffffff, 0.7); l3.position.set(0, 8, 5); scene.add(l3);

  function neon(c, i) { return new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i || 1.5 }); }
  var shell = new THREE.MeshStandardMaterial({ color: 0x1b1240, metalness: 0.55, roughness: 0.3 });
  var C = neon(0x22d3ee), P = neon(0xf43f9e), L = neon(0xa3e635, 1.3), V = neon(0x8b5cf6, 1.3);

  /* ---------- PC: монитор + пернетақта ---------- */
  function makePC() {
    var g = new THREE.Group();
    var frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.9, 0.12), shell); g.add(frame);
    var cv = document.createElement('canvas'); cv.width = 512; cv.height = 300;
    var x = cv.getContext('2d');
    var gr = x.createLinearGradient(0, 0, 512, 300); gr.addColorStop(0, '#3b0d8f'); gr.addColorStop(0.55, '#0e2a6b'); gr.addColorStop(1, '#0a5e74');
    x.fillStyle = gr; x.fillRect(0, 0, 512, 300);
    x.strokeStyle = 'rgba(34,211,238,.35)'; x.lineWidth = 2;
    for (var i = 0; i < 12; i++) { x.beginPath(); x.moveTo(0, 180 + i * 12); x.lineTo(512, 180 + i * 12); x.stroke(); }
    for (var j = -10; j < 20; j++) { x.beginPath(); x.moveTo(256, 170); x.lineTo(j * 40, 300); x.stroke(); }
    x.fillStyle = '#f43f9e'; x.beginPath(); x.arc(256, 120, 46, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ffffff'; x.font = 'bold 54px Arial'; x.textAlign = 'center'; x.fillText('OYNA', 256, 70);
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.72),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) }));
    screen.position.z = 0.065; g.add(screen);
    var glow = new THREE.Mesh(new THREE.BoxGeometry(3.24, 0.04, 0.05), C); glow.position.set(0, -0.97, 0.06); g.add(glow);
    var neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.14), shell); neck.position.set(0, -1.3, -0.05); g.add(neck);
    var base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.6), shell); base.position.set(0, -1.66, 0.05); g.add(base);
    var kb = new THREE.Group();
    kb.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 0.85), shell));
    var keyG = new THREE.BoxGeometry(0.16, 0.06, 0.16), mats = [C, V, P, L];
    for (var r = 0; r < 4; r++) for (var k = 0; k < 13; k++) {
      var key = new THREE.Mesh(keyG, mats[(k + r) % 4]); key.position.set(-1.14 + k * 0.19, 0.08, -0.29 + r * 0.19); kb.add(key);
    }
    kb.position.set(0, -1.75, 1.0); kb.rotation.x = 0.12; g.add(kb);
    g.userData.spin = 0.25;
    return g;
  }

  /* ---------- PlayStation геймпад ---------- */
  function makePad() {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), shell); body.scale.set(1.9, 1, 0.55); g.add(body);
    [-1.25, 1.25].forEach(function (px) {
      var h = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 24), shell); h.position.set(px, -0.55, 0); h.scale.set(1, 1.15, 0.6); g.add(h);
    });
    [[-0.65, -0.35], [0.65, -0.35]].forEach(function (p) {
      var s = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.25, 32), shell); s.rotation.x = Math.PI / 2; s.position.set(p[0], p[1], 0.5); g.add(s);
      var r = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 12, 48), C); r.position.set(p[0], p[1], 0.56); g.add(r);
    });
    [[1.25, 0.4, L], [1.6, 0.05, P], [0.9, 0.05, C], [1.25, -0.3, V]].forEach(function (b) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), b[2]); m.position.set(b[0], b[1], 0.46); g.add(m);
    });
    var d1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.17, 0.12), V), d2 = d1.clone(); d2.rotation.z = Math.PI / 2;
    [d1, d2].forEach(function (d) { d.position.set(-1.25, 0.05, 0.46); g.add(d); });
    var bar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.05), C); bar.position.set(0, 0.62, 0.42); g.add(bar);
    g.userData.bar = bar; g.userData.spin = 0.5;
    return g;
  }

  /* ---------- Футбол добы (ақ-қара бесбұрыштар) ---------- */
  function makeBall() {
    var g = new THREE.Group();
    var geo = new THREE.IcosahedronGeometry(1.25, 3);
    if (geo.index) geo = geo.toNonIndexed();
    var ico = new THREE.IcosahedronGeometry(1.25, 0);
    if (ico.index) ico = ico.toNonIndexed();
    var tips = [], ip = ico.attributes.position, v = new THREE.Vector3();
    for (var i = 0; i < ip.count; i++) {
      v.fromBufferAttribute(ip, i).normalize();
      if (!tips.some(function (t) { return t.distanceTo(v) < 1e-3; })) tips.push(v.clone());
    }
    var pos = geo.attributes.position, colors = [], a = new THREE.Vector3(), cen = new THREE.Vector3();
    for (var f = 0; f < pos.count; f += 3) {
      cen.set(0, 0, 0);
      for (var q = 0; q < 3; q++) { a.fromBufferAttribute(pos, f + q); cen.add(a); }
      cen.normalize();
      var dark = tips.some(function (t) { return t.angleTo(cen) < 0.36; });
      var c = dark ? [0.07, 0.06, 0.12] : [0.95, 0.96, 1.0];
      colors.push.apply(colors, c.concat(c, c));
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    var ball = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.45, metalness: 0.05 }));
    g.add(ball);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.02, 8, 120), L); ring.rotation.x = Math.PI / 2.3; g.add(ring);
    var pitch = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.6),
      new THREE.MeshBasicMaterial({ color: 0x0e5a34, transparent: true, opacity: 0.45 }));
    pitch.rotation.x = -Math.PI / 2; pitch.position.y = -1.9; g.add(pitch);
    var lines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(5.6, 3.2)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
    lines.rotation.x = -Math.PI / 2; lines.position.y = -1.88; g.add(lines);
    var mid = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.8, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
    mid.rotation.x = -Math.PI / 2; mid.position.y = -1.87; g.add(mid);
    g.userData.ball = ball; g.userData.spin = 0.6;
    return g;
  }

  var objs = { pc_club: makePC(), playstation: makePad(), football: makeBall() };
  var order = ['pc_club', 'playstation', 'football'];
  Object.keys(objs).forEach(function (k) { objs[k].scale.setScalar(0.001); objs[k].userData.s = 0; scene.add(objs[k]); });

  /* неон тор + бөлшектер */
  var grid = new THREE.GridHelper(60, 60, 0x22d3ee, 0x5b21b6);
  grid.position.y = -2.6; grid.material.transparent = true; grid.material.opacity = 0.28; scene.add(grid);
  var N = 600, pts = new Float32Array(N * 3);
  for (var n = 0; n < N * 3; n++) pts[n] = (Math.random() - 0.5) * (n % 3 === 1 ? 14 : 28);
  var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  var stars = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xc4b5fd, size: 0.035, transparent: true, opacity: 0.8 }));
  scene.add(stars);

  /* қазіргі санатты қолданбаның күйінен оқу */
  function currentCat() {
    try {
      if (typeof S === 'undefined') return 'all';
      if (S.mode === 'partner') return (S.f && S.f.category) || 'all';
      if (S.view === 'club' && typeof club === 'function') { var c = club(); if (c) return c.category; }
      return S.filter || 'all';
    } catch (e) { return 'all'; }
  }

  var mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', function (e) { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; }, { passive: true });

  function layout() {
    var w = innerWidth, h = innerHeight; renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    var wide = w > 900;
    Object.keys(objs).forEach(function (k) {
      objs[k].position.set(wide ? 3.6 : 0.2, wide ? 0.2 : -1.6, wide ? 0 : -1.5);
      objs[k].userData.base = wide ? 1 : 0.72;
    });
  }
  addEventListener('resize', layout); layout();

  var clock = new THREE.Clock(), running = true;
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) tick(); });

  function tick() {
    if (!running) return;
    var t = clock.getElapsedTime();
    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    var cat = currentCat();
    var focus = true;
    try { focus = (typeof S === 'undefined') || (S.mode === 'client' && S.view === 'list') || (S.mode === 'partner' && !S.session); } catch (e) {}
    var op = focus ? '1' : '0.28';
    if (canvas.style.opacity !== op) canvas.style.opacity = op;
    var active = objs[cat] ? cat : order[Math.floor(t / 5) % order.length];
    var sy = Math.min(scrollY / 900, 1);
    order.forEach(function (k) {
      var o = objs[k], target = (k === active ? o.userData.base : 0);
      o.userData.s += (target - o.userData.s) * 0.06;
      o.scale.setScalar(Math.max(o.userData.s, 0.001));
      o.visible = o.userData.s > 0.01;
      o.rotation.y = Math.sin(t * 0.5) * 0.45 + mx * 0.6 - 0.35 + sy * 0.8;
      o.rotation.x = 0.15 + Math.sin(t * 0.7) * 0.06 + my * 0.3;
      o.position.y += Math.sin(t * 1.3) * 0.002;
    });
    var ball = objs.football.userData.ball; ball.rotation.x = t * 0.9; ball.rotation.z = t * 0.4;
    objs.playstation.userData.bar.material.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.6;
    grid.position.z = (t * 0.6) % 1;
    stars.rotation.y = t * 0.012;
    camera.position.x = mx * 0.8; camera.position.y = 0.6 - my * 0.5 - sy * 0.6;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();

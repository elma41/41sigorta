/* 41 Sigorta — site betikleri (bağımlılık yok) */
(function(){
  'use strict';
  var PHONE_WA = '905404334141';

  /* header gölgesi */
  var header = document.querySelector('.header');
  function onScroll(){ if(header) header.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* mobil menü */
  var burger = document.querySelector('.burger'), nav = document.querySelector('.nav');
  if(burger && nav){
    burger.addEventListener('click', function(){ var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
    nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); }); });
  }

  /* hero slider */
  var hero = document.querySelector('.hero');
  if(hero){
    var slides = hero.querySelectorAll('.slide'), dots = hero.querySelectorAll('.dots button'), cur = 0, timer, DUR = 7000;
    hero.style.setProperty('--dur', DUR + 'ms');
    var counter = hero.querySelector('.counter .cur');
    function loadBg(k){ var b = slides[(k + slides.length) % slides.length].querySelector('.bg[data-bg]'); if(b){ b.style.backgroundImage = 'url(' + b.getAttribute('data-bg') + ')'; b.removeAttribute('data-bg'); } }
    function go(i){
      slides[cur].classList.remove('on'); dots[cur] && dots[cur].classList.remove('on');
      cur = (i + slides.length) % slides.length;
      loadBg(cur); loadBg(cur + 1);
      slides[cur].classList.add('on');
      dots.forEach(function(d, k){ d.classList.toggle('done', k < cur); });
      if(counter) counter.textContent = (cur < 9 ? '0' : '') + (cur + 1);
      if(dots[cur]){ var d = dots[cur]; d.classList.remove('on'); void d.offsetWidth; d.classList.add('on'); }
      clearTimeout(timer); timer = setTimeout(function(){ go(cur + 1); }, DUR);
    }
    dots.forEach(function(d, i){ d.addEventListener('click', function(){ go(i); }); });
    var prev = hero.querySelector('.prev'), next = hero.querySelector('.next');
    prev && prev.addEventListener('click', function(){ go(cur - 1); });
    next && next.addEventListener('click', function(){ go(cur + 1); });
    var sx = null;
    hero.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
    hero.addEventListener('touchend', function(e){ if(sx === null) return; var dx = e.changedTouches[0].clientX - sx; if(Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
    document.addEventListener('visibilitychange', function(){ if(document.hidden) clearTimeout(timer); else go(cur); });
    go(0);
  }

  /* logo bandı: sonsuz kaydırma için kopyala */
  document.querySelectorAll('.marquee').forEach(function(m){
    var t = m.querySelector('.track'); if(!t) return;
    var c = t.cloneNode(true); c.setAttribute('aria-hidden', 'true'); m.appendChild(c);
  });

  /* görünür olunca animasyon */
  var rv = document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    rv.forEach(function(el){ io.observe(el); });
  } else rv.forEach(function(el){ el.classList.add('in'); });

  /* ---------- teklif formu ---------- */
  var FIELDS = {
    trafik:  [['plaka','Araç plakası','Örn. 41 ABC 123'],['ruhsat','Ruhsat seri no','İsteğe bağlı'],['arac','Marka / model / yıl','Örn. Renault Clio 2021']],
    kasko:   [['plaka','Araç plakası','Örn. 41 ABC 123'],['arac','Marka / model / yıl','Örn. Toyota Corolla 2022'],['ruhsat','Ruhsat seri no','İsteğe bağlı']],
    dask:    [['adres','İl / ilçe','Örn. Kocaeli / İzmit'],['m2','Brüt m²','Örn. 120'],['yil','Bina yapım yılı','Örn. 2008']],
    konut:   [['adres','İl / ilçe','Örn. Kocaeli / Başiskele'],['m2','Brüt m²','Örn. 140'],['esya','Yaklaşık eşya bedeli','İsteğe bağlı']],
    isyeri:  [['faaliyet','Faaliyet konusu','Örn. Kafe, eczane, ofis'],['adres','İl / ilçe','Örn. Kocaeli / Gebze'],['m2','İşyeri m²','Örn. 90']],
    seyahat: [['ulke','Gidilecek ülke(ler)','Örn. Almanya, Fransa'],['tarih','Gidiş – dönüş tarihleri','Örn. 10–24 Ağustos'],['kisi','Kişi sayısı','Örn. 2']],
    tss:     [['kisi','Sigortalanacak kişi sayısı','Örn. 3 (eş ve çocuk dahil)'],['dogum','Doğum yılları','Örn. 1985, 1988, 2015'],['kurum','Tercih ettiğiniz hastane','İsteğe bağlı']],
    oss:     [['kisi','Sigortalanacak kişi sayısı','Örn. 2'],['dogum','Doğum yılları','Örn. 1979, 1981'],['kurum','Tercih ettiğiniz hastane','İsteğe bağlı']],
    bes:     [['katki','Aylık düşündüğünüz katkı','Örn. 2.000 TL'],['dogum','Doğum yılı','Örn. 1990'],['mevcut','Mevcut BES’iniz var mı?','Var / Yok']]
  };
  var NAMES = {trafik:'Trafik Sigortası',kasko:'Kasko',dask:'DASK (Zorunlu Deprem)',konut:'Konut Sigortası',isyeri:'İşyeri Sigortası',seyahat:'Seyahat Sağlık Sigortası',tss:'Tamamlayıcı Sağlık Sigortası',oss:'Özel Sağlık Sigortası',bes:'Bireysel Emeklilik (BES)'};

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function renderDyn(form){
    var sel = form.querySelector('input[name=hizmet]:checked'), box = form.querySelector('.dyn');
    if(!box) return;
    var k = sel ? sel.value : null;
    box.innerHTML = k ? FIELDS[k].map(function(f){ return '<div class="field"><label>' + esc(f[1]) + '</label><input name="' + f[0] + '" placeholder="' + esc(f[2]) + '" data-label="' + esc(f[1]) + '"></div>'; }).join('') : '';
  }
  function buildMsg(form){
    var sel = form.querySelector('input[name=hizmet]:checked');
    var lines = ['Merhaba, 41sigorta.com üzerinden teklif almak istiyorum.', '', '*Hizmet:* ' + (sel ? NAMES[sel.value] : '-')];
    var ad = form.querySelector('[name=ad]').value.trim(), tel = form.querySelector('[name=tel]').value.trim();
    lines.push('*Ad Soyad:* ' + ad, '*Telefon:* ' + tel);
    form.querySelectorAll('.dyn input').forEach(function(i){ if(i.value.trim()) lines.push('*' + i.dataset.label + ':* ' + i.value.trim()); });
    var not = form.querySelector('[name=not]');
    if(not && not.value.trim()) lines.push('*Not:* ' + not.value.trim());
    return lines.join('\n');
  }
  function validate(form){
    var err = form.querySelector('.err'), msg = '';
    if(!form.querySelector('input[name=hizmet]:checked')) msg = 'Lütfen teklif almak istediğiniz sigortayı seçin.';
    else if(form.querySelector('[name=ad]').value.trim().length < 3) msg = 'Lütfen adınızı ve soyadınızı yazın.';
    else if(form.querySelector('[name=tel]').value.replace(/\D/g,'').length < 10) msg = 'Lütfen geçerli bir telefon numarası yazın.';
    else if(!form.querySelector('[name=kvkk]').checked) msg = 'Devam etmek için aydınlatma metnini onaylayın.';
    err.textContent = msg; err.classList.toggle('show', !!msg);
    return !msg;
  }
  document.querySelectorAll('.quote-form').forEach(function(form){
    form.addEventListener('change', function(e){ if(e.target.name === 'hizmet') renderDyn(form); });
    renderDyn(form);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!validate(form)) return;
      window.open('https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(buildMsg(form)), '_blank', 'noopener');
    });
  });

  /* modal */
  var modal = document.getElementById('teklifModal');
  function openModal(svc){
    if(!modal) return;
    var form = modal.querySelector('.quote-form');
    if(svc){ var r = form.querySelector('input[name=hizmet][value="' + svc + '"]'); if(r){ r.checked = true; renderDyn(form); } }
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
    setTimeout(function(){ var f = form.querySelector('[name=ad]'); f && f.focus({preventScroll:true}); }, 300);
  }
  function closeModal(){ if(!modal) return; modal.classList.remove('open'); document.body.style.overflow = ''; }
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-teklif]');
    if(t){ e.preventDefault(); openModal(t.getAttribute('data-teklif')); return; }
    if(modal && (e.target === modal || e.target.closest('.x'))) closeModal();
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

  /* WhatsApp hızlı bağlantılar (hizmete özel mesaj) */
  document.querySelectorAll('[data-wa]').forEach(function(a){
    var s = a.getAttribute('data-wa');
    var txt = 'Merhaba, ' + (NAMES[s] ? NAMES[s] + ' için ' : '') + 'teklif almak istiyorum.';
    a.href = 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(txt);
    a.target = '_blank'; a.rel = 'noopener';
  });

  var y = document.getElementById('yil'); if(y) y.textContent = new Date().getFullYear();
})();

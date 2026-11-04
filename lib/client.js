/* ModuleLoader 握手：模块 id 必须等于包名 dsh-ui-cards */
;(function () {
  function uiCardsFactory(require) {
    if (window.__UI_CARDS_BOOTED__) return { name: 'dsh-ui-cards', inject: [], apply: function () {} }
    try { window.__UI_CARDS_BOOTED__ = true } catch (e) {}
    var name = 'dsh-ui-cards'
    var inject = ['slots']

    /* ══════════════════════════ CSS ══════════════════════════ */
    var CSS = [
      /* ── 黄金分割卡牌坞：占屏 ~20%，只有可滑动卡片，没有其他 UI ── */
      '#uix-pop{position:fixed;left:50%;top:10px;z-index:2147482700;width:var(--uix-pw);height:var(--uix-ph);',
      'transform:translate(-50%,-12px) scale(.985);opacity:0;pointer-events:none;',
      'transition:opacity .2s ease,transform .26s cubic-bezier(.22,.61,.36,1);',
      '--uix-radius:16px;--uix-accent:#7fd4ff;--uix-cw:230px;--uix-ch:372px;}',
      '#uix-pop[data-open="1"]{opacity:1;transform:translate(-50%,0) scale(1);pointer-events:auto;}',
      /* 关闭态彻底隐身：连卡片都不能吃点击（否则会“误点开设置”） */
      '#uix-pop[data-open="0"],#uix-pop[data-open="0"] *{pointer-events:none!important;}',
      '#uix-pop,#uix-pop *,#uix-set,#uix-set *,#uix-stage,#uix-stage *{box-sizing:border-box;}',
      '#uix-track{position:absolute;inset:0;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 14%,#000 86%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 14%,#000 86%,transparent 100%);}',
      /* 卡牌：中间实 · 两边虚 */
      '.uix-card{position:absolute;left:50%;top:50%;width:var(--uix-cw);height:var(--uix-ch);',
      'margin-left:calc(var(--uix-cw) / -2);margin-top:calc(var(--uix-ch) / -2);',
      'border-radius:var(--uix-radius);overflow:hidden;cursor:pointer;display:flex;flex-direction:column;',
      'align-items:center;justify-content:center;gap:12px;padding:16px 14px;text-align:center;',
      'background:linear-gradient(175deg,rgba(20,28,44,.86),rgba(10,15,26,.9));',
      'border:1px solid rgba(160,200,255,.18);box-shadow:0 22px 60px -22px rgba(0,0,0,.85);',
      'transition:transform .46s cubic-bezier(.22,.61,.36,1),opacity .46s ease,filter .46s ease,border-color .2s ease;}',
      '.uix-card[data-active="1"]{border-color:rgba(127,212,255,.42);}',
      '.uix-card[data-active="1"]:hover{border-color:rgba(127,212,255,.7);}',
      /* 卡片内部图（封面）：铺满卡面，图标/文字浮在上面 */
      '.uix-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;pointer-events:none;}',
      '.uix-card[data-has-image="1"]{justify-content:flex-end;}',
      '.uix-card[data-has-image="1"] .uix-ic{background:rgba(10,15,26,.66);backdrop-filter:blur(6px);}',
      '.uix-card[data-has-image="1"] .uix-tt,.uix-card[data-has-image="1"] .uix-sb{text-shadow:0 1px 6px rgba(0,0,0,.9);}',
      '.uix-ic{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;',
      'font-size:21px;line-height:1;color:#bfe9ff;background:linear-gradient(150deg,rgba(127,212,255,.22),rgba(91,139,255,.12));',
      'border:1px solid rgba(127,212,255,.32);box-shadow:inset 0 1px 0 rgba(255,255,255,.08);flex:0 0 auto;}',
      '.uix-tt{font-size:14px;font-weight:600;color:rgba(232,243,255,.95);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.uix-sb{font-size:10.5px;line-height:1.45;color:rgba(178,203,232,.62);max-width:100%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}',
      '.uix-badge{position:absolute;top:8px;right:8px;font-size:9px;padding:1px 6px;border-radius:5px;background:rgba(127,212,255,.16);color:#bfe9ff;}',
      /* 皮肤 */
      '.uix-card[data-skin="gold"]{border-color:rgba(226,186,96,.6);}',
      '.uix-card[data-skin="gold"]:before{content:"";position:absolute;inset:5px;border-radius:calc(var(--uix-radius) - 5px);border:1px solid rgba(226,186,96,.2);pointer-events:none;}',
      '.uix-card[data-skin="diamond"]:before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:repeating-linear-gradient(135deg,rgba(190,225,255,.10) 0 1px,transparent 1px 9px);}',
      '.uix-card[data-skin="ice"]:before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(120% 80% at 10% 0%,rgba(120,220,255,.18),transparent 60%),radial-gradient(90% 70% at 100% 100%,rgba(150,160,255,.14),transparent 60%);}',
      '.uix-card[data-skin="grid"]:before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background-image:linear-gradient(rgba(160,200,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(160,200,255,.09) 1px,transparent 1px);background-size:16px 16px;}',
      '.uix-hbtn{height:26px;min-width:26px;padding:0 9px;border-radius:8px;border:1px solid rgba(150,190,240,.2);',
      'background:rgba(255,255,255,.04);color:rgba(215,232,255,.82);font-size:11.5px;cursor:pointer;flex:0 0 auto;}',
      '.uix-hbtn:hover{background:rgba(120,190,255,.16);color:#fff;}',
      /* ── 通用弹窗 ── */
      '#uix-stage{position:fixed;inset:0;z-index:2147482750;display:none;align-items:center;justify-content:center;background:rgba(3,6,12,.5);}',
      '#uix-stage[data-open="1"]{display:flex;}',
      '#uix-stage .box{width:min(1020px,86vw);max-height:82vh;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;',
      'background:linear-gradient(165deg,rgba(14,21,35,.98),rgba(10,15,26,.98));border:1px solid rgba(140,190,255,.22);',
      'box-shadow:0 34px 90px -24px #000;}',
      '#uix-stage .bar{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(160,200,255,.1);flex:0 0 auto;}',
      '#uix-stage .bar .ic2{width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;',
      'background:rgba(127,212,255,.16);border:1px solid rgba(127,212,255,.3);}',
      '#uix-stage .bar .t{font-size:13px;font-weight:600;color:#eaf4ff;}',
      '#uix-stage .body{flex:1;position:relative;overflow:auto;padding:14px 16px;color:rgba(214,229,248,.88);font-size:12px;line-height:1.65;}',
      '#uix-stage .body::-webkit-scrollbar{width:6px;}',
      '#uix-stage .body::-webkit-scrollbar-thumb{background:rgba(150,190,240,.25);border-radius:3px;}',
      '.uix-hosted{position:relative!important;inset:auto!important;top:auto!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;max-width:100%!important;max-height:100%!important;margin:0!important;z-index:auto!important;}',
      /* ── 设置弹窗（自设计） ── */
      '#uix-set{position:fixed;inset:0;z-index:2147482760;display:none;align-items:center;justify-content:center;background:rgba(3,6,12,.5);}',
      '#uix-set[data-open="1"]{display:flex;}',
      '#uix-set .sheet{width:min(820px,92vw);max-height:84vh;border-radius:20px;overflow:hidden;display:flex;flex-direction:column;',
      'background:linear-gradient(165deg,rgba(14,21,35,.98),rgba(10,15,26,.98));border:1px solid rgba(140,190,255,.22);',
      'box-shadow:0 34px 90px -24px #000, inset 0 1px 0 rgba(255,255,255,.05);}',
      '#uix-set .shead{display:flex;align-items:center;gap:10px;padding:16px 20px 12px;border-bottom:1px solid rgba(160,200,255,.1);}',
      '#uix-set .shead .sk{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;',
      'background:linear-gradient(140deg,rgba(127,212,255,.28),rgba(91,139,255,.18));border:1px solid rgba(127,212,255,.35);font-size:13px;}',
      '#uix-set .shead .st{font-size:14px;font-weight:600;color:#eaf4ff;letter-spacing:.02em;}',
      '#uix-set .shead .sd{font-size:11px;color:rgba(170,196,226,.55);margin-left:2px;}',
      '#uix-set .sbody{flex:1;overflow:auto;padding:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:18px;}',
      '#uix-set .sbody::-webkit-scrollbar{width:6px;}',
      '#uix-set .sbody::-webkit-scrollbar-thumb{background:rgba(150,190,240,.25);border-radius:3px;}',
      '#uix-set .sect{border:1px solid rgba(160,200,255,.12);border-radius:14px;padding:12px 14px;background:rgba(255,255,255,.022);}',
      '#uix-set .sect h4{margin:0 0 10px;font-size:11.5px;font-weight:600;color:rgba(190,220,255,.82);letter-spacing:.06em;display:flex;align-items:center;gap:6px;}',
      '#uix-set .sect h4 em{font-style:normal;font-size:10px;color:rgba(150,180,215,.45);font-weight:400;}',
      '#uix-set .srow{display:flex;align-items:center;gap:8px;margin-bottom:9px;}',
      '#uix-set .srow:last-child{margin-bottom:0;}',
      '#uix-set .srow>label{flex:0 0 66px;font-size:11px;color:rgba(186,208,232,.66);}',
      '#uix-set .srow .seg{display:flex;gap:4px;flex-wrap:wrap;}',
      '#uix-set .srow .seg button{height:22px;padding:0 9px;border-radius:6px;border:1px solid rgba(150,190,240,.2);',
      'background:rgba(255,255,255,.03);color:rgba(206,224,246,.78);font-size:11px;cursor:pointer;}',
      '#uix-set .srow .seg button[data-on="1"]{background:rgba(127,212,255,.2);border-color:rgba(127,212,255,.55);color:#eaf7ff;}',
      '#uix-set .srow input[type=range]{flex:1;accent-color:#7fd4ff;height:3px;}',
      '#uix-set .srow .val{width:40px;text-align:right;font-size:10.5px;color:rgba(190,212,238,.6);font-variant-numeric:tabular-nums;}',
      '#uix-set .sfoot{display:flex;align-items:center;gap:10px;padding:12px 20px 16px;border-top:1px solid rgba(160,200,255,.1);}',
      '#uix-set .sfoot .lab{font-size:10.5px;color:rgba(160,186,216,.5);letter-spacing:.08em;}',
      '#uix-set .sfoot .btn{height:28px;padding:0 14px;border-radius:8px;border:1px solid rgba(127,212,255,.4);',
      'background:rgba(127,212,255,.14);color:#eaf7ff;font-size:11.5px;cursor:pointer;}',
      '#uix-set .sfoot .btn:hover{background:rgba(127,212,255,.26);}',
      '#uix-set .sfoot .btn.ghost{border-color:rgba(150,190,240,.22);background:rgba(255,255,255,.04);color:rgba(206,224,246,.82);}',
      /* 通用小件 */
      '.uix-btn{height:24px;padding:0 11px;border-radius:6px;border:1px solid rgba(127,212,255,.4);',
      'background:rgba(127,212,255,.14);color:#eaf7ff;font-size:11px;cursor:pointer;}',
      '.uix-btn:hover{background:rgba(127,212,255,.26);}',
      '.uix-btn.ghost{border-color:rgba(150,190,240,.22);background:rgba(255,255,255,.04);color:rgba(206,224,246,.8);}',
      '.uix-hint{color:rgba(160,186,216,.52);font-size:11px;line-height:1.6;}',
      '.uix-list{display:flex;flex-direction:column;gap:5px;}',
      '.uix-item{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;',
      'background:rgba(255,255,255,.04);border:1px solid rgba(150,190,240,.12);}',
      '.uix-item .nm{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(214,229,248,.82);font-size:11.5px;}',
      '.uix-b2{font-size:9.5px;padding:1px 6px;border-radius:5px;background:rgba(127,212,255,.16);color:#bfe9ff;flex:0 0 auto;}',
    ].join('')

    /* ══════════════════════════ 默认值 ══════════════════════════ */
    var DEFAULTS = {
      area: 0.25,            // 占屏高度（默认 25%），宽度 = 高度 × 1.618
      visible: 5,            // 一屏清晰可见的卡牌数（3–9）
      cardH: 0.86,           // 卡片高度 = 面板高 × 该比例（仅当宽度算出来的更矮时用）
      skin: 'none',          // 边框花纹：none/gold/diamond/ice/grid
      theme: 'dark',
      radius: 16,
      opacity: 0.55,         // 卡面明度
      autoSlide: true,
      autoSpeed: 5200,
      autoCollect: false,
      bypass: [],            // 放行名单（插件名 / 浮层标签）
      moved: [],             // 手动移入坞的插件名
    }
    var STORE_KEY = 'dsh-ui-extension:settings:v4'
    var BASE_KEY = 'dsh-ui-extension:baseline:v1'   // 老插件基线：只拦「以后」装的

    var state = Object.assign({}, DEFAULTS, loadJS())
    function loadJS() { try { return JSON.parse(window.localStorage.getItem(STORE_KEY) || '{}') } catch (e) { return {} } }
    function saveJS() { try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)) } catch (e) {} }
    function loadBaseline() { try { return JSON.parse(window.localStorage.getItem(BASE_KEY) || 'null') } catch (e) { return null } }
    function saveBaseline(list) { try { window.localStorage.setItem(BASE_KEY, JSON.stringify(list)) } catch (e) {} }

    var ui = {
      pop: null, track: null, dots: null, view: null, set: null, stage: null,
      cards: [], index: 0, open: false, bypass: false, anchor: null,
      hosted: {}, timer: null, filter: '', disposed: false, hostPlugins: null,
    }

    function el(tag, props, kids) {
      var n = document.createElement(tag)
      if (props) for (var k in props) {
        var v = props[k]
        if (k === 'class') n.className = v
        else if (k === 'text') n.textContent = v
        else if (k === 'style') n.setAttribute('style', v)
        else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2).toLowerCase(), v)
        else n.setAttribute(k, v)
      }
      ;(kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c) })
      return n
    }

    /* ══════════════════ 锚点：右上角「更多操作」 ══════════════════ */
    var ANCHOR_SELECTORS = [
      '[data-slot="conversation.session.header.utilities"] button[aria-label="更多操作"]',
      'button[aria-label="更多操作"]', 'button[aria-label="More actions"]', 'button[class*="moreButton"]',
    ]
    function findAnchor() {
      for (var i = 0; i < ANCHOR_SELECTORS.length; i++) {
        var f = document.querySelector(ANCHOR_SELECTORS[i])
        if (f) return f
      }
      return null
    }
    function markAnchor() {
      var a = findAnchor()
      if (!a) { document.documentElement.setAttribute('data-uix-anchor', 'missing'); ui.anchor = null; return null }
      if (a.getAttribute('data-uix-btn') !== '1') a.setAttribute('data-uix-btn', '1')
      ui.anchor = a
      document.documentElement.setAttribute('data-uix-anchor', 'ok')
      return a
    }

    /* ══════════════════ 原生菜单项（反馈 / 下载日志） ══════════════════ */
    function findMenuItem(keywords) {
      var nodes = document.querySelectorAll('[role="menuitem"],[role="menuitemradio"],[role="menu"] button,[role="menu"] [role="button"],[class*="menuItem"],[class*="MenuItem"]')
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i]
        if (!n.getClientRects().length) continue
        var t = (n.textContent || '').replace(/\s+/g, '')
        if (!t) continue
        for (var j = 0; j < keywords.length; j++) if (t.indexOf(keywords[j]) >= 0) return n
      }
      return null
    }
    function openNativeItem(keywords) {
      var a = markAnchor()
      if (!a) return false
      ui.bypass = true
      try { a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })) } finally { ui.bypass = false }
      var tries = 0
      var iv = setInterval(function () {
        tries++
        var hit = findMenuItem(keywords)
        if (hit) { clearInterval(iv); hit.click(); return }
        if (tries > 14) clearInterval(iv)
      }, 60)
      return true
    }

    /* ══════════════════════ 卡牌（纯入口） ══════════════════════ */
    /* opts.icon: 文本符 / emoji；opts.image: 图片 URL（卡片内部图／封面）；opts.skin: 该卡独立皮肤 */
    function addCard(id, title, opts) {
      opts = opts || {}
      var card = el('div', {
        class: 'uix-card', 'data-card': id, 'data-title': title, 'data-skin': opts.skin || state.skin,
        'data-empty': opts.empty ? '1' : '0',
        title: opts.tip || title,
      })
      if (opts.badge) card.appendChild(el('span', { class: 'uix-badge', text: opts.badge }))
      if (opts.image) {
        var img = el('img', { class: 'uix-img', src: opts.image, alt: '', draggable: 'false' })
        card.appendChild(img)
        card.setAttribute('data-has-image', '1')
      }
      card.appendChild(el('div', { class: 'uix-ic', text: opts.icon || '◆' }))
      card.appendChild(el('div', { class: 'uix-tt', text: title }))
      if (opts.sub) card.appendChild(el('div', { class: 'uix-sb', text: opts.sub }))
      card.addEventListener('click', function () {
        if (!ui.open) return   /* 关闭态彻底不吃点击（隐身不能是假的） */
        /* 点卡 = 立刻触发该插件（不再先居中、也不再套一层弹窗） */
        var idx = cardIndex(id)
        if (idx >= 0) ui.index = idx
        if (opts.onOpen) { try { opts.onOpen() } catch (e) { console.warn('[ui-extension] card open failed', e) } }
      })
      var rec = { id: id, kind: opts.kind || 'custom', el: card, title: title, node: null }
      ui.cards.push(rec)
      ui.track.appendChild(card)
      return rec
    }
    function cardIndex(id) { for (var i = 0; i < ui.cards.length; i++) if (ui.cards[i].id === id) return i; return -1 }
    function removeCard(id) {
      var i = cardIndex(id)
      if (i < 0) return
      var rec = ui.cards[i]
      if (rec.el.parentNode) rec.el.parentNode.removeChild(rec.el)
      ui.cards.splice(i, 1)
      layout()
    }

    function buildSettingsCard() {
      return addCard('uix-settings', '设置', {
        icon: '⚙', badge: '本机', kind: 'settings',
        sub: '尺寸 · 花纹 · 原生入口',
        onOpen: function () { openSettingsPanel() },
      })
    }

    /* 点一个节点：若它被我们藏起来了，先临时显形 → 派发 pointer/click → 700ms 后再藏回去 */
    function clickNode(node) {
      if (!node) return false
      var wasHidden = node.getAttribute('data-uix-hidden') === '1'
      if (wasHidden) {
        node.style.setProperty('display', 'block', 'important')
        node.style.setProperty('position', 'fixed', 'important')
        node.style.setProperty('left', '8px', 'important')
        node.style.setProperty('bottom', '8px', 'important')
        node.style.setProperty('opacity', '0.001', 'important')
        void node.offsetWidth
      }
      var r = node.getBoundingClientRect()
      var cx = r.left + Math.max(r.width, 16) / 2, cy = r.top + Math.max(r.height, 16) / 2
      var base = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, button: 0 }
      node.dispatchEvent(new PointerEvent('pointerdown', base))
      node.dispatchEvent(new PointerEvent('pointerup', base))
      node.dispatchEvent(new MouseEvent('click', base))
      try { node.click() } catch (e) {}
      if (wasHidden) {
        setTimeout(function () {
          if (node.getAttribute('data-uix-hidden') !== '1') return
          node.style.setProperty('position', 'fixed', 'important')
          node.style.setProperty('left', '-9999px', 'important')
          node.style.setProperty('top', '0px', 'important')
          node.style.setProperty('opacity', '0.001', 'important')
        }, 700)
      }
      return true
    }

    /* 点卡 = 直接点它自己的入口（找不到就提示） */
    function clickEntry(selectors, hint) {
      for (var i = 0; i < selectors.length; i++) {
        var node = document.querySelector(selectors[i])
        if (node) return clickNode(node)
      }
      console.warn('[ui-extension] 没找到入口：', hint)
      return false
    }

    /* 收进坞里的插件 → 主界面入口一律隐藏（工作流：带弹窗/页面的插件默认收纳 + 隐藏入口） */
    var hiddenEntries = []
    function hideEntry(selectors, note) {
      var found = false
      for (var i = 0; i < selectors.length; i++) {
        var els = document.querySelectorAll(selectors[i])
        for (var j = 0; j < els.length; j++) {
          var e0 = els[j]
          if (e0.getAttribute('data-uix-hidden') === '1') { found = true; continue }
          e0.setAttribute('data-uix-hidden', '1')
          /* 关键：不用 display:none 藏，改成「挪到屏幕外 + 近乎透明」——
             元素仍在布局里、仍有尺寸、仍能收合成事件，点卡时才点得动它。
             display:none 的元素很多插件不认合成点击（聊天就是这么打不开的）。 */
          e0.style.setProperty('position', 'fixed', 'important')
          e0.style.setProperty('left', '-9999px', 'important')
          e0.style.setProperty('top', '0px', 'important')
          e0.style.setProperty('opacity', '0.001', 'important')
          e0.style.setProperty('pointer-events', 'auto', 'important')
          hiddenEntries.push(e0)
          found = true
        }
      }
      if (!found && note) console.warn('[ui-extension] 入口没找到可隐藏的：' + note)
      return found
    }
    function restoreEntries() {
      hiddenEntries.forEach(function (e) {
        e.removeAttribute('data-uix-hidden')
        ;['position', 'left', 'top', 'opacity', 'pointer-events', 'display'].forEach(function (k) {
          e.style.removeProperty(k)
        })
      })
      hiddenEntries = []
    }

    /* 两个要移植进来的插件：聊天（dsh-agent-chat）+ pilot（左下角飞机） */
    var CHAT_ENTRY = ['#dac-fab']
    var PILOT_ENTRY = ['[title="浏览器驾驶舱"]', '[title*="驾驶舱"]']

    /* 按图标字符找最小的可点元素（pilot 的 ✈️ 没有稳定 id/class） */
    function findByGlyph(glyph) {
      var all = document.querySelectorAll('body *')
      var best = null
      var bestArea = Infinity
      for (var i = 0; i < all.length; i++) {
        var el0 = all[i]
        var t = (el0.textContent || '').trim()
        if (t !== glyph && t !== glyph + '\uFE0F') continue
        var r = el0.getBoundingClientRect()
        var area = Math.max(r.width, 1) * Math.max(r.height, 1)
        if (area < 60) continue
        if (area < bestArea) { best = el0; bestArea = area }
      }
      return best
    }
    function findPilotEntry() {
      var byTitle = document.querySelector(PILOT_ENTRY[0]) || document.querySelector(PILOT_ENTRY[1])
      if (byTitle) return byTitle
      return findByGlyph('✈️') || findByGlyph('✈')
    }
    function hideEl(el0, note) {
      if (!el0) return false
      if (el0.getAttribute('data-uix-hidden') === '1') return true
      el0.setAttribute('data-uix-hidden', '1')
      el0.style.setProperty('display', 'none', 'important')
      hiddenEntries.push(el0)
      return true
    }
    function hidePilot() {
      var el0 = findPilotEntry()
      if (!el0) return false
      /* 只藏那个按钮本身，别把整排 footer 一起藏了 */
      return hideEl(el0, 'pilot')
    }
    function openChat() {
      try {
        if (window.__DSHAgentChat__ && typeof window.__DSHAgentChat__.open === 'function') {
          window.__DSHAgentChat__.open()
          return true
        }
      } catch (e) { /* 退回点按钮 */ }
      return clickEntry(CHAT_ENTRY, 'agent-chat fab')
    }
    function openPilot() {
      var el0 = findPilotEntry()
      if (!el0) { console.warn('[ui-extension] 没找到 Pilot 入口（✈️ / title=驾驶舱）'); return false }
      return clickNode(el0)
    }
    function buildPluginCards() {
      /* 可扩展的「开门器」注册表：任何插件都能声明自己的开局方式，不依赖猜按钮 */
      ui.openers = ui.openers || {}
      ui.openers['plugin:agent-chat'] = ui.openers['plugin:agent-chat'] || openChat
      ui.openers['plugin:pilot'] = ui.openers['plugin:pilot'] || openPilot
      addCard('plugin:agent-chat', '聊天', {
        icon: '✉', badge: '插件', kind: 'plugin',
        sub: '会话间聊天 / 群聊',
        onOpen: function () { closePop(); setTimeout(function () { (ui.openers['plugin:agent-chat'] || openChat)() }, 120) },
      })
      addCard('plugin:pilot', 'Pilot', {
        icon: '✈', badge: '插件', kind: 'plugin',
        sub: '驾驶舱 / 浏览器驾驶',
        onOpen: function () { closePop(); setTimeout(function () { (ui.openers['plugin:pilot'] || openPilot)() }, 120) },
      })
      hideEntry(CHAT_ENTRY, 'chat')
      hidePilot()
    }
    function buildCollectorCard() {
      return addCard('uix-collector', '收容管控', {
        icon: '⛁', badge: '自动', kind: 'collector',
        sub: '被拦插件 / 注册密钥台账',
        onOpen: function () { openStage('收容管控', '⛁', function (body) { renderCollector(body) }) },
      })
    }

    /* ══════════════════ 收容管控弹窗内容 ══════════════════ */
    function renderCollector(body) {
      body.textContent = ''
      body.appendChild(el('div', { class: 'uix-hint', text: '扫到插件注入的浮层就塞进卡里；带注册密钥 / 放行名单的插件不拦。' }))
      body.appendChild(el('div', { class: 'uix-hint', style: 'margin-top:6px;opacity:.8', text: '① 页面浮层' }))
      var list = el('div', { class: 'uix-list', style: 'margin-top:6px' })
      body.appendChild(list)
      var roots = floatingRoots()
      if (!roots.length) list.appendChild(el('div', { class: 'uix-hint', text: '没扫到可收容的浮层。' }))
      roots.forEach(function (r) {
        var hosted = !!ui.hosted[r.id]
        var allowed = state.bypass.indexOf(r.label) >= 0
        list.appendChild(el('div', { class: 'uix-item' }, [
          el('span', { class: 'nm', text: r.label }),
          el('span', { class: 'uix-b2', text: hosted ? '已收容' : (allowed ? '放行' : '浮层') }),
          el('button', {
            class: 'uix-btn ghost', type: 'button', text: hosted ? '放回' : '收容',
            onclick: function () { hosted ? restoreHosted(r.id) : hostNode(r.id, r.label, r.node); renderCollector(body) },
          }),
          el('button', {
            class: 'uix-btn ghost', type: 'button', text: '放行',
            onclick: function () {
              if (state.bypass.indexOf(r.label) < 0) state.bypass.push(r.label)
              saveJS(); renderCollector(body)
            },
          }),
        ]))
      })

      body.appendChild(el('div', { class: 'uix-hint', style: 'margin-top:12px;opacity:.8', text: '② 插件台账（宿主扫描）' }))
      var hostList = el('div', { class: 'uix-list', style: 'margin-top:6px' })
      body.appendChild(hostList)
      if (ui.hostPlugins) renderHostList(hostList, ui.hostPlugins)
      else {
        hostList.appendChild(el('div', { class: 'uix-hint', text: '正在读台账…' }))
        fetchHostPlugins().then(function (data) {
          hostList.textContent = ''
          if (!data) hostList.appendChild(el('div', { class: 'uix-hint', text: '宿主台账未就绪（重启 DSH 后可用）' }))
          else renderHostList(hostList, data)
        })
      }
    }
    function renderHostList(container, plugins) {
      container.textContent = ''
      var base = ui.baseline || loadBaseline() || []
      var all = (plugins || []).filter(function (p) { return p.hasClient && !p.error })
      var fresh = all.filter(function (p) { return base.indexOf(p.name) < 0 })
      var old = all.length - fresh.length
      container.appendChild(el('div', { class: 'uix-hint', text: '只拦基线之后新装的插件；存量 ' + old + ' 个不拦。' }))
      if (!fresh.length) {
        container.appendChild(el('div', { class: 'uix-hint', text: '暂没有新装插件需要收容。' }))
        return
      }
      fresh.slice(0, 30).forEach(function (p) {
        var short = p.name.replace(/^@[^/]+\//, '')
        var keyed = !!p.keyed
        container.appendChild(el('div', { class: 'uix-item' }, [
          el('span', { class: 'nm', text: short, title: p.name }),
          el('span', { class: 'uix-b2', text: keyed ? '密钥·放行' : '待拦' }),
          keyed
            ? el('span', { class: 'uix-hint', text: p.keyHint || 'key' })
            : el('button', {
                class: 'uix-btn ghost', type: 'button', text: '放行',
                onclick: function () {
                  if (state.bypass.indexOf(p.name) < 0) state.bypass.push(p.name)
                  saveJS(); renderHostList(container, plugins)
                },
              }),
        ]))
      })
    }
    function fetchHostPlugins() {
      return fetch('/ui-extension/plugins', { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null })
        .then(function (d) {
          if (!(d && d.ok)) return null
          ui.hostPlugins = d.plugins || []
          /* 第一次运行：把当前已装插件全部记为基线（只拦以后新装的） */
          if (!loadBaseline()) {
            saveBaseline(ui.hostPlugins.map(function (p) { return p.name }))
          }
          ui.baseline = loadBaseline() || []
          return ui.hostPlugins
        })
        .catch(function () { return null })
    }

    /* ══════════════════ 收容（浮层 → 一张卡） ══════════════════ */
    /* 这些是 DSH 本体/常用插件的常驻浮层，永远不吞（迷你对话框、聊天、桌宠、插件坞…） */
    var DENY = ['dsh-mini-session', 'dsh-agent-chat', 'dac-', 'dshp-', 'dock-', 'dsh-plugin-dock',
      'we-rope', 'sgt-', 'msx-', 'dsh-live2d-pet', 'dsh-wallpaper', 'dsx-']
    function denied(label) {
      var s = String(label || '').toLowerCase()
      for (var i = 0; i < DENY.length; i++) if (s.indexOf(DENY[i]) >= 0) return true
      return false
    }

    function floatingRoots() {
      var out = []
      var kids = document.body.children
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i]
        if (n.id === 'uix-pop' || n.id === 'uix-set' || n.id === 'uix-stage' || n.id === 'root') continue
        var tag = n.tagName
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK') continue
        var cs = window.getComputedStyle(n)
        if (cs.position !== 'fixed' && cs.position !== 'absolute') continue
        if (cs.display === 'none' || cs.visibility === 'hidden') continue
        var label = n.id || (n.className && String(n.className).split(' ')[0]) || tag.toLowerCase()
        if (denied(label) || denied(n.className)) continue
        var unknown = /^(div|section|aside|span|main|nav)$/i.test(String(label))
        out.push({ id: n.id || 'anon-' + i, label: String(label).slice(0, 26), node: n, unknown: unknown })
      }
      return out
    }
    function hostNode(id, label, node) {
      if (ui.hosted[id] || ui.disposed) return
      var home = { parent: node.parentNode, next: node.nextSibling, style: node.getAttribute('style') }
      var rec = addCard('hosted:' + id, label, {
        icon: '⊞', badge: '已拦', kind: 'hosted', sub: '被拦下的插件入口 / 浮层',
        onOpen: function () { openHosted(id) },
      })
      rec.node = node
      ui.hosted[id] = { node: node, home: home, card: rec }
      layout()
    }
    function openHosted(id) {
      var h = ui.hosted[id]
      if (!h) return
      var rec = h.card
      closePop()
      openStage('收纳 · ' + rec.title, '⊞', function (body) {
        var wrap = el('div', { style: 'position:relative;min-height:320px;display:flex;align-items:center;justify-content:center;' })
        body.appendChild(wrap)
        h.node.classList.add('uix-hosted')
        wrap.appendChild(h.node)
      }, function () {
        if (h.home.parent) {
          if (h.home.next && h.home.next.parentNode === h.home.parent) h.home.parent.insertBefore(h.node, h.home.next)
          else h.home.parent.appendChild(h.node)
        } else document.body.appendChild(h.node)
      })
    }
    function restoreHosted(id) {
      var h = ui.hosted[id]
      if (!h) return
      h.node.classList.remove('uix-hosted')
      if (h.home.style == null) h.node.removeAttribute('style')
      else h.node.setAttribute('style', h.home.style)
      if (h.home.parent) {
        if (h.home.next && h.home.next.parentNode === h.home.parent) h.home.parent.insertBefore(h.node, h.home.next)
        else h.home.parent.appendChild(h.node)
      } else document.body.appendChild(h.node)
      removeCard('hosted:' + id)
      delete ui.hosted[id]
    }

    /* ══════════════════ 通用弹窗 ══════════════════ */
    function openStage(title, icon, fill, onClose) {
      if (!ui.stage) {
        ui.stage = el('div', { id: 'uix-stage', 'data-open': '0' })
        document.body.appendChild(ui.stage)
      }
      var stage = ui.stage
      stage.textContent = ''
      stage._onClose = onClose || null
      var body = el('div', { class: 'body' })
      var box = el('div', { class: 'box' }, [
        el('div', { class: 'bar' }, [
          el('span', { class: 'ic2', text: icon || '◆' }),
          el('span', { class: 't', text: title }),
          el('span', { style: 'flex:1' }),
          el('button', { class: 'uix-hbtn', type: 'button', text: '✕', onclick: function () { closeStage() } }),
        ]),
        body,
      ])
      stage.appendChild(box)
      stage.setAttribute('data-open', '1')
      if (fill) fill(body)
    }
    function closeStage() {
      if (!ui.stage) return
      var cb = ui.stage._onClose
      ui.stage.setAttribute('data-open', '0')
      ui.stage.textContent = ''
      ui.stage._onClose = null
      if (cb) { try { cb() } catch (e) {} }
    }

    /* ══════════════════ 设置弹窗（自设计） ══════════════════ */
    function openSettingsPanel() {
      if (!ui.set) {
        ui.set = el('div', { id: 'uix-set', 'data-open': '0' })
        ui.set.addEventListener('click', function (e) { if (e.target === ui.set) closeSettingsPanel() })
        document.body.appendChild(ui.set)
      }
      ui.set.setAttribute('data-open', '1')
      renderSettingsPanel()
    }
    function closeSettingsPanel() { if (ui.set) ui.set.setAttribute('data-open', '0') }

    function seg(items, cur, onPick) {
      var box = el('div', { class: 'seg' })
      items.forEach(function (it) {
        var value = Array.isArray(it) ? it[0] : it
        var text = Array.isArray(it) ? it[1] : String(it)
        box.appendChild(el('button', {
          type: 'button', text: text, 'data-on': String(value) === String(cur) ? '1' : '0',
          onclick: function () { onPick(value) },
        }))
      })
      return box
    }
    function srow(label, control) { return el('div', { class: 'srow' }, [el('label', { text: label }), control]) }
    function srange(min, max, step, cur, onInput, fmt) {
      var f = fmt || function (v) { return String(v) }
      var val = el('span', { class: 'val', text: f(cur) })
      var input = el('input', {
        type: 'range', min: String(min), max: String(max), step: String(step), value: String(cur),
        oninput: function (e) { var v = Number(e.target.value); val.textContent = f(v); onInput(v) },
      })
      return el('div', { style: 'display:flex;align-items:center;gap:8px;flex:1;' }, [input, val])
    }

    function renderSettingsPanel() {
      var set = ui.set
      if (!set) return
      set.textContent = ''
      var body = el('div', { class: 'sbody' })

      var look = el('div', { class: 'sect' }, [
        el('h4', {}, ['外观 ', el('em', { text: '卡牌长什么样' })]),
        srow('占屏高度', srange(10, 40, 1, Math.round((state.area || 0.25) * 100), function (v) { state.area = v / 100; saveJS(); layout() }, function (v) { return v + '%' })),
        srow('可见卡数', seg([3, 4, 5, 6, 7, 8, 9], state.visible || 5, function (v) { state.visible = v; saveJS(); layout(); renderSettingsPanel() })),
        srow('边框花纹', seg([['none', '无纹'], ['gold', '金线'], ['diamond', '刻纹'], ['ice', '冰晶'], ['grid', '网格']], state.skin, function (v) {
          state.skin = v; saveJS(); applySkin(); renderSettingsPanel()
        })),
        srow('卡片亮度', srange(0.25, 0.9, 0.05, state.opacity, function (v) { state.opacity = v; saveJS(); applyVars() }, function (v) { return Math.round(v * 100) + '%' })),
        srow('圆角', srange(6, 28, 2, state.radius, function (v) { state.radius = v; saveJS(); applyVars() }, function (v) { return v + 'px' })),
        srow('主题', seg([['dark', '暗玻璃'], ['light', '亮玻璃']], state.theme, function (v) {
          state.theme = v; saveJS(); if (ui.pop) ui.pop.setAttribute('data-theme', v); renderSettingsPanel()
        })),
      ])

      var beh = el('div', { class: 'sect' }, [
        el('h4', {}, ['行为 ', el('em', { text: '怎么翻、怎么拦' })]),
        srow('自动滑动', seg([['on', '开'], ['off', '关']], state.autoSlide ? 'on' : 'off', function (v) {
          state.autoSlide = v === 'on'; saveJS(); renderSettingsPanel(); restartAuto()
        })),
        srow('滑动间隔', seg([[3000, '3s'], [5200, '5s'], [8000, '8s']], state.autoSpeed, function (v) {
          state.autoSpeed = v; saveJS(); renderSettingsPanel(); restartAuto()
        })),
        srow('自动收纳', seg([['on', '开'], ['off', '关']], state.autoCollect ? 'on' : 'off', function (v) {
          state.autoCollect = v === 'on'; saveJS(); renderSettingsPanel(); if (v === 'on') autoCollectOnce()
        })),
        srow('注册密钥', el('div', { class: 'uix-hint', style: 'flex:1', text: '插件目录带 .ui-ext-key 或 package.json 声明即放行；没有就强制拦进本坞' })),
        srow('放行名单', el('div', { class: 'uix-hint', style: 'flex:1', text: (state.bypass && state.bypass.length) ? state.bypass.join('、') : '（空）' })),
      ])

      /* 单卡外观：给某张卡单独换皮肤 / 换卡面图 */
      var SKIN_OPTS = [['none', '无纹'], ['gold', '金线'], ['diamond', '刻纹'], ['ice', '冰晶'], ['grid', '网格']]
      var pickId = ui.lookCard || (ui.cards[0] && ui.cards[0].id) || 'uix-settings'
      var cur = (state.cards && state.cards[pickId]) || {}
      var sel = el('select', {
        style: 'flex:1;height:24px;border-radius:6px;background:rgba(255,255,255,.05);color:#dce9fb;border:1px solid rgba(150,190,240,.2);font-size:11px;',
        onchange: function (e) { ui.lookCard = e.target.value; renderSettingsPanel() },
      }, ui.cards.map(function (c) {
        return el('option', { value: c.id, text: c.title, selected: c.id === pickId ? 'selected' : null })
      }))
      var urlInput = el('input', {
        type: 'text', placeholder: '卡面图 URL（留空 = 无图）', value: cur.image || '',
        style: 'flex:1;height:24px;border-radius:6px;background:rgba(255,255,255,.05);color:#dce9fb;border:1px solid rgba(150,190,240,.2);font-size:11px;padding:0 8px;',
      })
      var per = el('div', { class: 'sect' }, [
        el('h4', {}, ['单卡外观 ', el('em', { text: '换皮 / 换卡面图' })]),
        srow('选卡', sel),
        srow('皮肤', seg(SKIN_OPTS, cur.skin || state.skin, function (v) {
          setCardLook(pickId, { skin: v === 'none' ? null : v }); renderSettingsPanel()
        })),
        srow('卡面图', el('div', { style: 'display:flex;gap:6px;flex:1;' }, [
          urlInput,
          el('button', {
            class: 'uix-btn', type: 'button', text: '应用',
            onclick: function () { setCardLook(pickId, { image: urlInput.value.trim() || null }); renderSettingsPanel() },
          }),
          el('button', {
            class: 'uix-btn ghost', type: 'button', text: '清除',
            onclick: function () { setCardLook(pickId, { image: null }); renderSettingsPanel() },
          }),
        ])),
      ])

      body.appendChild(look)
      body.appendChild(beh)
      body.appendChild(per)

      var foot = el('div', { class: 'sfoot' }, [
        el('span', { class: 'lab', text: '原生' }),
        el('button', {
          class: 'btn ghost', type: 'button', text: '反馈',
          onclick: function () { closeSettingsPanel(); setTimeout(function () { openNativeItem(['反馈', 'Feedback']) }, 100) },
        }),
        el('button', {
          class: 'btn ghost', type: 'button', text: '下载 Session 日志',
          onclick: function () { closeSettingsPanel(); setTimeout(function () { openNativeItem(['下载', '日志', 'Download', 'Log']) }, 100) },
        }),
        el('span', { style: 'flex:1' }),
        el('button', { class: 'btn', type: 'button', text: '完成', onclick: function () { closeSettingsPanel() } }),
      ])

      set.appendChild(el('div', { class: 'sheet' }, [
        el('div', { class: 'shead' }, [
          el('span', { class: 'sk', text: '⚙' }),
          el('span', { class: 'st', text: 'UI验牌 · 设置' }),
          el('span', { class: 'sd', text: '第二扩展坞 / 卡牌收纳' }),
          el('span', { style: 'flex:1' }),
          el('button', { class: 'uix-hbtn', type: 'button', text: '✕', onclick: function () { closeSettingsPanel() } }),
        ]),
        body,
        foot,
      ]))
    }

    /* ══════════════════════ 外壳（只有卡片） ══════════════════════ */
    function mount() {
      var pop = el('div', { id: 'uix-pop', 'data-open': '0', 'data-theme': state.theme })
      var track = el('div', { id: 'uix-track' })
      pop.appendChild(track)
      document.body.appendChild(pop)
      ui.pop = pop; ui.track = track

      track.addEventListener('wheel', onWheel, { passive: false })
      /* 右键 = 设置（不占界面） */
      pop.addEventListener('contextmenu', function (e) {
        e.preventDefault(); e.stopPropagation()
        openSettingsPanel()
      }, true)

      buildSettingsCard()
      buildPluginCards()
      buildCollectorCard()
      fetchHostPlugins()
      layout()
    }

    /* 面板尺寸：高度约占页面 area%（默认 20%），矩形黄金分割（1.618:1），贴顶 */
    function panelSize() {
      var vw = innerWidth, vh = innerHeight
      var pct = Math.max(0.08, Math.min(0.5, state.area || 0.2))
      var h = vh * pct
      var w = h * 1.618
      if (w > vw * 0.92) { w = vw * 0.92; h = w / 1.618 }
      return { w: Math.round(w), h: Math.round(h) }
    }

    function applyVars() {
      if (!ui.pop) return
      var p = panelSize()
      var vis = Math.max(3, Math.min(9, Math.round(state.visible || 5)))
      /* 卡高跟面板高走；卡宽按黄金比例；面板宽度 = 至少黄金比例，放不下就按卡数撑开 */
      var ch = Math.round(p.h * 0.86)
      var cw = Math.round(ch / 1.618)
      var gap = 10
      var needW = vis * cw + (vis - 1) * gap + 24
      var pw = Math.max(p.w, needW)
      if (pw > innerWidth * 0.94) pw = Math.round(innerWidth * 0.94)
      ui.pop.style.setProperty('--uix-pw', pw + 'px')
      ui.pop.style.setProperty('--uix-ph', p.h + 'px')
      ui.pop.style.setProperty('--uix-cw', cw + 'px')
      ui.pop.style.setProperty('--uix-ch', ch + 'px')
      ui.pop.style.setProperty('--uix-radius', state.radius + 'px')
      var kids = ui.track ? ui.track.children : []
      for (var i = 0; i < kids.length; i++) {
        kids[i].style.background = 'linear-gradient(175deg, rgba(20,28,44,' + (0.5 + state.opacity * 0.6).toFixed(2) + '), rgba(10,15,26,' + (0.6 + state.opacity * 0.6).toFixed(2) + '))'
      }
      ui.pop.setAttribute('data-geom', JSON.stringify([pw, p.h, cw, ch, vis]))
      return { w: pw, h: p.h, cw: cw, ch: ch, vis: vis, step: cw + gap }
    }
    function applySkin() {
      var per = state.cards || {}
      var kids = ui.track ? ui.track.children : []
      for (var i = 0; i < ui.cards.length; i++) {
        var rec = ui.cards[i]
        if (!rec || !rec.el) continue
        var o = per[rec.id] || {}
        rec.el.setAttribute('data-skin', o.skin || state.skin)
        var img = rec.el.querySelector('.uix-img')
        if (o.image) {
          if (!img) {
            img = el('img', { class: 'uix-img', alt: '', draggable: 'false' })
            rec.el.insertBefore(img, rec.el.firstChild)
          }
          if (img.getAttribute('src') !== o.image) img.setAttribute('src', o.image)
          rec.el.setAttribute('data-has-image', '1')
        } else if (img && img.parentNode) {
          img.parentNode.removeChild(img)
          rec.el.removeAttribute('data-has-image')
        }
      }
      for (var k = 0; k < kids.length; k++) {
        if (!kids[k].hasAttribute('data-card')) kids[k].setAttribute('data-skin', state.skin)
      }
    }

    /* 单卡外观：皮肤 / 卡面图（存 state.cards[id]） */
    function setCardLook(id, patch) {
      state.cards = state.cards || {}
      state.cards[id] = Object.assign({}, state.cards[id] || {}, patch)
      if (patch.skin === null) delete state.cards[id].skin
      if (patch.image === null) delete state.cards[id].image
      saveJS()
      applySkin()
    }

    /* 模糊循环：可见槽位 = min(vis, n-1)，永远留一张在视野外做「接棒」
       —— 换位只发生在完全透明处，杜绝「翻牌感」 */
    function layout() {
      if (!ui.track) return
      var m = applyVars()
      applySkin()
      var step = m.step
      var n = ui.cards.length
      if (!n) return
      /* 至少留一个槽位在视野外，否则绕回必然穿过屏幕 */
      var half = Math.max(1, Math.min(Math.floor(m.vis / 2), Math.floor((n - 1) / 2)))
      var delta = ui.delta || 0
      ui.delta = 0
      var teleported = false
      for (var i = 0; i < n; i++) {
        var rec = ui.cards[i]
        var rel
        if (rec.rel == null) {
          rel = i - ui.index
          if (rel > n / 2) rel -= n
          if (rel < -n / 2) rel += n
        } else {
          var prev = rec.rel
          rel = prev + delta
          /* 越过分界绕到另一端：这次位移跨越多格，且发生在透明区 —— 直接瞬移，不做补间 */
          if (rel > half + 1) rel -= n
          if (rel < -(half + 1)) rel += n
          if (Math.abs(rel - prev) > 1.5) {
            rec.teleport = true
          }
        }
        rec.rel = rel
        var abs = Math.abs(rel)
        var node = rec.el
        var scale, op, blur
        if (abs > half + 0.5) {
          scale = 0.86; op = 0; blur = 9
        } else {
          /* 从边界往中心：0 → 0.55 → 1 的连续渐变（模糊随之减弱） */
          var t = Math.max(0, Math.min(1, abs / (half + 0.5)))
          scale = 1 - 0.16 * t
          op = 1 - 0.72 * t
          blur = 5.5 * t
        }
        if (rec.teleport) {
          node.style.transition = 'none'
          node.style.transform = 'translateX(' + (rel * step) + 'px) scale(' + scale + ')'
          node.style.opacity = '0'
          node.style.filter = 'blur(9px)'
          void node.offsetWidth
          node.style.transition = ''
          rec.teleport = false
          teleported = true
        } else {
          node.style.transform = 'translateX(' + (rel * step) + 'px) scale(' + scale + ')'
          node.style.opacity = String(op)
          node.style.filter = blur > 0.05 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none'
        }
        node.style.pointerEvents = abs > 0.6 ? 'none' : 'auto'
        node.style.zIndex = String(40 - Math.round(abs * 4))
        node.setAttribute('data-active', abs < 0.5 ? '1' : '0')
        node.setAttribute('data-slot', String(rel))
      }
      /* 瞬移的那张这帧被压成 0，下一帧补回真实透明度 → 从透明里淡入，而不是永久隐形 */
      if (teleported) {
        if (ui.reflowTimer) clearTimeout(ui.reflowTimer)
        ui.reflowTimer = setTimeout(function () {
          ui.reflowTimer = null
          if (!ui.disposed && ui.track) layout()
        }, 24)
      }
    }

    /* ══════════════════════ 交互 ══════════════════════ */
    function go(d) {
      if (!ui.cards.length) return
      var maxIndex = ui.cards.length - 1
      var n = ui.index + d
      if (n < 0) n = maxIndex
      if (n > maxIndex) n = 0
      jump(n)
    }
    function jump(i) {
      var n = ui.cards.length || 1
      var old = ui.index
      var tgt = Math.max(0, Math.min(i, n - 1))
      var d = tgt - old
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
      ui.index = tgt
      /* 往下一张：整排向左挪一格（rel 减 1）；往回则向右 */
      ui.delta = -d
      layout()
      restartAuto()
    }
    function onWheel(e) {
      var d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(d) < 2) return
      e.preventDefault()
      var now = Date.now()
      if (now - (onWheel._t || 0) < 260) return
      onWheel._t = now
      go(d > 0 ? 1 : -1)
    }
    function restartAuto() {
      if (ui.timer) { clearInterval(ui.timer); ui.timer = null }
      if (!state.autoSlide || !ui.open) return
      ui.timer = setInterval(function () { if (ui.open) go(1) }, Math.max(1500, state.autoSpeed))
    }
    function onKey(e) {
      if (ui.stage && ui.stage.getAttribute('data-open') === '1') {
        if (e.key === 'Escape') { e.preventDefault(); closeStage() }
        return
      }
      if (ui.set && ui.set.getAttribute('data-open') === '1') {
        if (e.key === 'Escape') { e.preventDefault(); closeSettingsPanel() }
        return
      }
      if (!ui.open) return
      var t = e.target
      var tag = t && t.tagName ? t.tagName.toLowerCase() : ''
      if (tag === 'input' || tag === 'textarea' || (t && t.isContentEditable)) return
      if (e.key === 'Escape') { e.preventDefault(); closePop(); return }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); go(-1); return }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); go(1); return }
    }

    function openPop() {
      if (!ui.pop) mount()
      ui.open = true
      ui.pop.setAttribute('data-open', '1')
      document.documentElement.setAttribute('data-uix-open', '1')
      layout(); restartAuto()
      fetchHostPlugins()
    }
    function closePop() {
      if (!ui.pop) return
      ui.open = false
      ui.pop.setAttribute('data-open', '0')
      document.documentElement.setAttribute('data-uix-open', '0')
      if (ui.timer) { clearInterval(ui.timer); ui.timer = null }
    }
    function togglePop() { ui.open ? closePop() : openPop() }

    /* ══════════════════════ 点击拦截 ══════════════════════ */
    function onClickCapture(e) {
      if (ui.bypass) return
      var t = e.target
      if (!t || !t.closest) return
      /* 点主界面（面板外）→ 收起卡片坞；不吞掉这次点击，应用照常响应 */
      if (ui.open && !t.closest('#uix-pop')) {
        if (!(ui.stage && ui.stage.getAttribute('data-open') === '1') &&
            !(ui.set && ui.set.getAttribute('data-open') === '1')) {
          closePop()
        }
        return
      }
      var a = t.closest('[data-uix-btn]')
      if (!a) {
        var btn = t.closest('button')
        if (btn) {
          var label = btn.getAttribute('aria-label') || ''
          if (label === '更多操作' || label === 'More actions') a = btn
        }
      }
      if (!a) return
      if (a.getAttribute('data-uix-btn') !== '1') a.setAttribute('data-uix-btn', '1')
      e.preventDefault(); e.stopPropagation()
      if (e.stopImmediatePropagation) e.stopImmediatePropagation()
      if (ui.stage && ui.stage.getAttribute('data-open') === '1') { closeStage(); return }
      togglePop()
    }

    /* ══════════════════════ 自动收纳 ══════════════════════ */
    var autoCollected = {}
    function autoCollectOnce() {
      floatingRoots().forEach(function (r) {
        if (ui.hosted[r.id] || autoCollected[r.id]) return
        if (r.unknown) return                       // 认不出是谁的匿名浮层，绝不自动吞
        if (state.bypass.indexOf(r.label) >= 0) return
        var rect = r.node.getBoundingClientRect()
        if (rect.width > innerWidth * 0.6 || rect.height > innerHeight * 0.6) return
        if (rect.width < 24 || rect.height < 24) return
        autoCollected[r.id] = true
        hostNode(r.id, r.label, r.node)
      })
    }

    /* ══════════════════════ 启动 ══════════════════════ */
    function apply(ctx) {
      var styleEl = document.createElement('style')
      styleEl.id = 'dsh-ui-extension-style'
      styleEl.textContent = CSS
      document.head.appendChild(styleEl)
      document.documentElement.setAttribute('data-uix', 'booting')

      var onClick = function (e) { onClickCapture(e) }
      var onKeyDown = function (e) { onKey(e) }
      var onResize = function () { if (ui.pop) layout() }
      window.addEventListener('click', onClick, true)
      window.addEventListener('keydown', onKeyDown, true)
      window.addEventListener('resize', onResize)

      var tick = setInterval(function () {
        if (ui.disposed) return
        markAnchor()
        /* 被收纳插件的主界面入口可能被 React 重建 → 每 900ms 重新压一次 */
        hideEntry(CHAT_ENTRY, null)
        hidePilot()
      }, 900)
      var mo = null
      try {
        mo = new MutationObserver(function () { if (!document.querySelector('[data-uix-btn]')) markAnchor() })
        mo.observe(document.body, { childList: true, subtree: true })
      } catch (e) {}

      mount(); markAnchor()
      if (state.autoCollect) setTimeout(autoCollectOnce, 1200)
      document.documentElement.setAttribute('data-uix', 'ready')

      var api = {
        version: '0.4.0',
        open: openPop, close: closePop, toggle: togglePop,
        openSettings: openSettingsPanel, closeSettings: closeSettingsPanel,
        isOpen: function () { return ui.open },
        cards: function () { return ui.cards.map(function (c) { return { id: c.id, kind: c.kind, title: c.title } }) },
        register: function (id, spec) {
          spec = spec || {}
          /* 工作流：注册进来的插件可带 hide: ['选择器']，自动压掉它自己的主界面入口 */
          if (spec.hide) {
            var sels = Array.isArray(spec.hide) ? spec.hide : [spec.hide]
            hideEntry(sels, id)
          }
          addCard(id, spec.title || id, {
            icon: spec.icon || '◆', badge: spec.badge || '插件', kind: 'plugin',
            sub: spec.sub || '', empty: false,
            onOpen: function () {
              if (typeof spec.open === 'function') { try { spec.open() } catch (e) { console.warn('[ui-extension] open failed', e) } return }
              openStage(spec.title || id, spec.icon || '◆', function (body) {
                if (typeof spec.render === 'function') spec.render(body)
                else if (typeof spec.mount === 'function') spec.mount(body)
                else body.appendChild(el('div', { class: 'uix-hint', text: '这个卡片没有提供界面。' }))
              })
            },
          })
          layout()
          return function () { removeCard(id) }
        },
        host: function (id, node, label) { hostNode(id, label || id, node) },
        /* 给任何插件声明「怎么开」：setOpener('plugin:xxx', () => window.__XXX__.open()) */
        setOpener: function (id, fn) { ui.openers = ui.openers || {}; ui.openers[id] = fn },
        openCard: function (id) {
          var f = (ui.openers || {})[id]
          if (typeof f === 'function') { try { f(); return true } catch (e) { console.warn('[ui-extension] opener failed', e) } }
          return false
        },
        unhost: function (id) { restoreHosted(id) },
        scan: function () { return floatingRoots().map(function (r) { return r.label }) },
        state: function () { return state },
        _test: {
          menuPeek: function () {
            var a = markAnchor()
            if (!a) return Promise.resolve({ ok: false })
            ui.bypass = true
            try { a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })) } finally { ui.bypass = false }
            return new Promise(function (res) {
              setTimeout(function () {
                var nodes = document.querySelectorAll('[role="menuitem"],[role="menu"] button,[role="menu"] [role="button"],[class*="menuItem"],[class*="MenuItem"]')
                var texts = []
                for (var i = 0; i < nodes.length; i++) {
                  var t = (nodes[i].textContent || '').replace(/\s+/g, '')
                  if (t) texts.push(t.slice(0, 24))
                }
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
                res({ ok: true, items: texts })
              }, 420)
            })
          },
        },
      }
      window.__DSH_UI_EXT__ = api

      ctx.effect(function () {
        return function () {
          ui.disposed = true
          clearInterval(tick)
          if (mo) mo.disconnect()
          window.removeEventListener('click', onClick, true)
          window.removeEventListener('keydown', onKeyDown, true)
          window.removeEventListener('resize', onResize)
          if (ui.timer) clearInterval(ui.timer)
          Object.keys(ui.hosted).forEach(function (id) { restoreHosted(id) })
          restoreEntries()
          ;[ui.pop, ui.set, ui.stage, styleEl].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n) })
          if (window.__DSH_UI_EXT__ === api) delete window.__DSH_UI_EXT__
          document.documentElement.removeAttribute('data-uix')
        }
      })
    }

    return { name: name, inject: inject, apply: apply }
  }

  try { window.__ModuleLoader__.load({ id: 'dsh-ui-cards', factory: uiCardsFactory }) } catch (e) {}
})()

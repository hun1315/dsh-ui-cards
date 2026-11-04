/**
 * dsh-ui-cards · UI验牌 — host half.
 *
 * 职责：为卡牌坞提供**插件清单 + 注册密钥**判定。
 *
 * 默认规则：
 *   · 从官方 / 模型市场 / 直接拉取安装的插件，若**没带注册密钥**，它注册的前端入口
 *     一律被收容进本坞（变成一张卡牌）；
 *   · 插件目录里带了密钥（或在 package.json 的 dsh.uiExtension.key 里声明）→ 放行，
 *     允许它在别处自行注册。
 *
 * 密钥两种写法（二选一）：
 *   1) <插件包目录>/.ui-ext-key      内容一行任意字符串（非空即算）
 *   2) package.json → "dsh": { "uiExtension": { "key": "..." } }
 *
 * 路由（客户端拉取，宿主侧只读不写）：
 *   GET /ui-extension/plugins  → { ok, profile, dir, plugins: [...] }
 *   GET /ui-extension/health   → { ok, profile }
 */
import { readFileSync, existsSync, realpathSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'

function readJSON(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function profileDirOf(name) {
  if (process.env.DSH_PROFILE_DIR) return process.env.DSH_PROFILE_DIR
  return join(homedir(), '.dsh', 'profiles', name || process.env.DSH_PROFILE || 'web')
}

function readKey(pkgDir, manifest) {
  const declared = manifest && manifest.dsh && manifest.dsh.uiExtension && manifest.dsh.uiExtension.key
  if (typeof declared === 'string' && declared.trim()) return declared.trim()
  for (const f of ['.ui-ext-key', '.ui-extension.key']) {
    const p = join(pkgDir, f)
    if (!existsSync(p)) continue
    try {
      const v = readFileSync(p, 'utf8').trim()
      if (v) return v
    } catch {
      /* 忽略不可读 */
    }
  }
  return null
}

function realDir(p) {
  try {
    return realpathSync(p)
  } catch {
    return p
  }
}

export function scanProfile(profileName) {
  const dir = profileDirOf(profileName)
  const pkg = readJSON(join(dir, 'package.json')) || {}
  const deps = pkg.dependencies || {}
  const bundles = (pkg.dsh && pkg.dsh.profile && pkg.dsh.profile.bundles) || []
  const plugins = []
  for (const name of bundles) {
    const spec = typeof deps[name] === 'string' ? deps[name] : ''
    const manifestPath = join(dir, 'node_modules', name, 'package.json')
    const manifest = readJSON(manifestPath)
    if (!manifest) {
      plugins.push({ name, spec, error: 'manifest-not-found' })
      continue
    }
    const real = realDir(dirname(manifestPath))
    const key = readKey(real, manifest)
    plugins.push({
      name,
      title: (manifest.dsh && manifest.dsh.uiExtension && manifest.dsh.uiExtension.title) || manifest.description || name,
      version: manifest.version || '',
      dir: real,
      spec,
      bundled: true,
      hasClient: !!(manifest.dsh && manifest.dsh.client),
      keyed: !!key,
      keyHint: key ? String(key).slice(0, 3) + '***' : null,
    })
  }
  return { profile: profileName || process.env.DSH_PROFILE || 'web', dir, count: plugins.length, plugins }
}

export default {
  name: 'dsh-ui-cards',
  apply(ctx) {
    ctx.inject(['webServer'], (webCtx) => {
      webCtx.effect(() =>
        webCtx.webServer.register({
          kind: 'exact',
          path: '/ui-extension/plugins',
          async handler(req, res) {
            const json = (code, obj) => {
              res.writeHead(code, {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store',
              })
              res.end(JSON.stringify(obj))
            }
            if (req.method !== 'GET') return json(405, { ok: false, error: 'GET only' })
            try {
              const url = new URL(req.url || '/ui-extension/plugins', 'http://127.0.0.1')
              const profile = url.searchParams.get('profile') || undefined
              json(200, Object.assign({ ok: true }, scanProfile(profile)))
            } catch (e) {
              json(500, { ok: false, error: String((e && e.message) || e) })
            }
          },
        }),
      )
      webCtx.effect(() =>
        webCtx.webServer.register({
          kind: 'exact',
          path: '/ui-extension/health',
          async handler(req, res) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify({ ok: true, profile: process.env.DSH_PROFILE || 'web' }))
          },
        }),
      )
    })
  },
  scanProfile,
}

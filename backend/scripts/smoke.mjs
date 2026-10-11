// End-to-end check of auth, users and insights against a running API.
// Usage: API=http://localhost:4000 ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... node scripts/smoke.mjs
const API = process.env.API ?? "http://localhost:4000"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD")

let failed = 0
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : "  " + extra}`)
  if (!ok) failed++
}
const call = async (method, path, { token, body } = {}) => {
  const res = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, data: await res.json().catch(() => ({})) }
}

const stamp = Date.now()
const friendEmail = `friend+${stamp}@example.com`

// Public
check("public feed needs no login", (await call("GET", "/api/insights")).status === 200)
check("posting requires login", (await call("POST", "/api/insights", { body: { body: "hi" } })).status === 401)
check("admin API requires login", (await call("GET", "/api/admin/users")).status === 401)

// Admin login
const bad = await call("POST", "/api/auth/login", { body: { email: ADMIN_EMAIL, password: "wrong-password" } })
check("wrong password rejected", bad.status === 401)
const login = await call("POST", "/api/auth/login", { body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } })
check("admin can sign in", login.status === 200 && login.data.user?.role === "admin", JSON.stringify(login.data))
const admin = login.data.token

// Admin adds a user
const created = await call("POST", "/api/admin/users", { token: admin, body: { email: friendEmail, name: "Friend", role: "user" } })
check("admin can add a user", created.status === 201 && created.data.temporaryPassword, JSON.stringify(created.data))
const dup = await call("POST", "/api/admin/users", { token: admin, body: { email: friendEmail.toUpperCase(), name: "Dup" } })
check("duplicate email rejected", dup.status === 409)
const friendId = created.data.user?.id

// New user must change password first
const fLogin = await call("POST", "/api/auth/login", { body: { email: friendEmail, password: created.data.temporaryPassword } })
check("new user can sign in with temp password", fLogin.status === 200 && fLogin.data.user.mustChangePassword === true)
const blocked = await call("POST", "/api/insights", { token: fLogin.data.token, body: { body: "too early" } })
check("posting blocked until password changed", blocked.status === 403 && blocked.data.code === "PASSWORD_CHANGE_REQUIRED")
const weak = await call("POST", "/api/auth/change-password", { token: fLogin.data.token, body: { currentPassword: created.data.temporaryPassword, newPassword: "short" } })
check("weak new password rejected", weak.status === 400)
const changed = await call("POST", "/api/auth/change-password", { token: fLogin.data.token, body: { currentPassword: created.data.temporaryPassword, newPassword: "a-much-better-password" } })
check("password change works and returns a new token", changed.status === 200 && changed.data.token && !changed.data.user.mustChangePassword)
const oldTokenUse = await call("GET", "/api/auth/me", { token: fLogin.data.token })
check("old token stops working after password change", oldTokenUse.status === 401)
const friend = changed.data.token

// Insights
const post = await call("POST", "/api/insights", { token: friend, body: { body: "  First insight with a #tag and a link https://astrovexus.com\n\n\n\nsecond paragraph  " } })
check("user can post", post.status === 201 && post.data.item.author.name === "Friend", JSON.stringify(post.data))
check("post text is tidied", post.data.item.body === "First insight with a #tag and a link https://astrovexus.com\n\nsecond paragraph", JSON.stringify(post.data.item?.body))
const postId = post.data.item?.id
check("empty post rejected", (await call("POST", "/api/insights", { token: friend, body: { body: "   " } })).status === 400)
check("over-long post rejected", (await call("POST", "/api/insights", { token: friend, body: { body: "x".repeat(2001) } })).status === 400)
check("anyone can read a post", (await call("GET", `/api/insights/${postId}`)).data.item?.id === postId)
check("bad id gives 404", (await call("GET", "/api/insights/not-a-uuid")).status === 404)

const edit = await call("PATCH", `/api/insights/${postId}`, { token: friend, body: { body: "Edited insight" } })
check("author can edit", edit.status === 200 && edit.data.item.updatedAt)
const adminEdit = await call("PATCH", `/api/insights/${postId}`, { token: admin, body: { body: "Admin rewrite" } })
check("admin cannot edit someone else's words", adminEdit.status === 403)

// Paging
for (let i = 1; i <= 3; i++) await call("POST", "/api/insights", { token: admin, body: { body: `Admin post ${i}` } })
const p1 = await call("GET", "/api/insights?limit=2")
check("feed pages: first page has a cursor", p1.data.items.length === 2 && p1.data.nextCursor)
const p2 = await call("GET", `/api/insights?limit=2&cursor=${p1.data.nextCursor}`)
check("feed pages: second page continues without overlap", p2.data.items.length >= 1 && !p2.data.items.some((i) => p1.data.items.find((j) => j.id === i.id)))
check("feed is newest first", p1.data.items[0].createdAt >= p1.data.items[1].createdAt)
check("author filter works", (await call("GET", `/api/insights?author=${friendId}`)).data.items.every((i) => i.author.id === friendId))
check("bad cursor rejected", (await call("GET", "/api/insights?cursor=abc")).status === 400)

// Permissions
const adminPost = (await call("GET", "/api/insights?limit=1")).data.items[0]
check("user cannot delete an admin's post", (await call("DELETE", `/api/insights/${adminPost.id}`, { token: friend })).status === 403)
check("user cannot use admin API", (await call("GET", "/api/admin/users", { token: friend })).status === 403)
check("admin can delete anyone's post", (await call("DELETE", `/api/insights/${postId}`, { token: admin })).status === 200)
check("deleted post is gone", (await call("GET", `/api/insights/${postId}`)).status === 404)

// User management
const users = await call("GET", "/api/admin/users", { token: admin })
check("admin can list users with post counts", users.status === 200 && users.data.users.some((u) => u.id === friendId))
const me = login.data.user.id
check("admin cannot demote themselves", (await call("PATCH", `/api/admin/users/${me}`, { token: admin, body: { role: "user" } })).status === 400)
check("admin cannot disable themselves", (await call("PATCH", `/api/admin/users/${me}`, { token: admin, body: { active: false } })).status === 400)
const promote = await call("PATCH", `/api/admin/users/${friendId}`, { token: admin, body: { role: "admin" } })
check("admin can promote a user", promote.data.user?.role === "admin")
const disable = await call("PATCH", `/api/admin/users/${friendId}`, { token: admin, body: { active: false } })
check("admin can disable a user", disable.data.user?.active === false)
check("disabled user's token stops working", (await call("GET", "/api/auth/me", { token: friend })).status === 401)
const dLogin = await call("POST", "/api/auth/login", { body: { email: friendEmail, password: "a-much-better-password" } })
check("disabled user cannot sign in", dLogin.status === 403)
await call("PATCH", `/api/admin/users/${friendId}`, { token: admin, body: { active: true } })
const reset = await call("POST", `/api/admin/users/${friendId}/reset-password`, { token: admin })
check("admin can reset a password", reset.status === 200 && reset.data.temporaryPassword)
const rLogin = await call("POST", "/api/auth/login", { body: { email: friendEmail, password: reset.data.temporaryPassword } })
check("reset password forces a change again", rLogin.data.user?.mustChangePassword === true)

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed")
process.exit(failed ? 1 : 0)

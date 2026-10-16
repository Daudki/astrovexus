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

// Images (needs CLOUDINARY_* set on the API; set CLOUDINARY_API_SECRET here too to verify signatures)
check("upload signing requires login", (await call("POST", "/api/uploads/sign")).status === 401)
const adminToken = (await call("POST", "/api/auth/login", { body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } })).data.token
const ticket = await call("POST", "/api/uploads/sign", { token: adminToken })
if (ticket.status === 503) {
  console.log("SKIP  image checks: Cloudinary is not configured on this API")
} else {
  const t = ticket.data
  check("upload ticket has what the browser needs", ticket.status === 200 && t.uploadUrl?.includes("/image/upload") && t.apiKey && t.signature && t.folder && t.timestamp, JSON.stringify(t))
  const adminId = login.data.user.id
  check("uploads go to the person's own folder", t.folder?.endsWith(`/${adminId}`))
  if (process.env.CLOUDINARY_API_SECRET) {
    const { createHash } = await import("node:crypto")
    const payload = `allowed_formats=${t.allowed_formats}&folder=${t.folder}&timestamp=${t.timestamp}`
    const expected = createHash("sha1").update(payload + process.env.CLOUDINARY_API_SECRET).digest("hex")
    check("upload signature matches Cloudinary's rule", t.signature === expected)
  }

  const cloud = t.uploadUrl.split("/v1_1/")[1].split("/")[0]
  const ref = (folder, name, host = "res.cloudinary.com") => ({
    publicId: `${folder}/${name}`,
    url: `https://${host}/${cloud}/image/upload/v1700000000/${folder}/${name}.jpg`,
    width: 1200,
    height: 800,
  })
  const a = `a${stamp}`, b = `b${stamp}`, c = `c${stamp}`

  const two = await call("POST", "/api/insights", { token: adminToken, body: { body: "With two photos", images: [ref(t.folder, a), ref(t.folder, b)] } })
  check("post with two images", two.status === 201 && two.data.item.images.length === 2, JSON.stringify(two.data))
  check("images keep their order", two.data.item?.images[0].url.includes(a) && two.data.item?.images[1].url.includes(b))
  const only = await call("POST", "/api/insights", { token: adminToken, body: { images: [ref(t.folder, c)] } })
  check("image-only post works", only.status === 201 && only.data.item.body === "" && only.data.item.images.length === 1, JSON.stringify(only.data))
  check("no text and no image is rejected", (await call("POST", "/api/insights", { token: adminToken, body: { body: "  ", images: [] } })).status === 400)
  const five = Array.from({ length: 5 }, (_, i) => ref(t.folder, `five${stamp}${i}`))
  check("more than 4 images is rejected", (await call("POST", "/api/insights", { token: adminToken, body: { body: "x", images: five } })).status === 400)
  check("someone else's folder is rejected", (await call("POST", "/api/insights", { token: adminToken, body: { body: "x", images: [ref(t.folder.replace(adminId, "someone-else"), "z")] } })).status === 400)
  check("a non-Cloudinary address is rejected", (await call("POST", "/api/insights", { token: adminToken, body: { body: "x", images: [ref(t.folder, `h${stamp}`, "evil.example.com")] } })).status === 400)
  check("reusing an uploaded image is rejected", (await call("POST", "/api/insights", { token: adminToken, body: { body: "again", images: [ref(t.folder, a)] } })).status === 409)

  const feed = await call("GET", "/api/insights?limit=5")
  check("feed includes images", feed.data.items.some((i) => i.id === two.data.item.id && i.images.length === 2))
  check("a text-only post has an empty image list", (await call("GET", `/api/insights/${adminPost.id}`)).data.item?.images?.length === 0)

  check("an image post can have its text cleared", (await call("PATCH", `/api/insights/${only.data.item.id}`, { token: adminToken, body: { body: "" } })).status === 200)
  const plain = await call("POST", "/api/insights", { token: adminToken, body: { body: "plain" } })
  check("a text-only post cannot be emptied", (await call("PATCH", `/api/insights/${plain.data.item.id}`, { token: adminToken, body: { body: "" } })).status === 400)

  check("deleting a post with images works", (await call("DELETE", `/api/insights/${two.data.item.id}`, { token: adminToken })).status === 200)
  check("deleted post is gone", (await call("GET", `/api/insights/${two.data.item.id}`)).status === 404)
  await call("DELETE", `/api/insights/${only.data.item.id}`, { token: adminToken })
  await call("DELETE", `/api/insights/${plain.data.item.id}`, { token: adminToken })
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed")
process.exit(failed ? 1 : 0)

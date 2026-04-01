(async () => {
  try {
    const loginRes = await fetch('https://www.bytevora.in/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bytevora1tech@gmail.com', password: 'ChangeMe123!' }),
    })

    console.log('/api/auth/login status', loginRes.status)
    const loginJson = await loginRes.text()
    console.log('/api/auth/login body', loginJson)

    if (!loginRes.ok) return

    const parsed = JSON.parse(loginJson)
    const token = parsed?.accessToken
    if (!token) {
      console.error('No token received')
      return
    }

    const seedRes = await fetch('https://www.bytevora.in/api/admin/seed-defaults', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
    console.log('/api/admin/seed-defaults status', seedRes.status)
    console.log('body', await seedRes.text())
  } catch (err) {
    console.error('Error', err)
  }
})()

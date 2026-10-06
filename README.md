# User Controller Flow — Quick Revision

## 1. REGISTER USER

```text
Get name, email, password
        ↓
Validate with Joi
        ↓
Check user by email
        ↓
If exists → Error
        ↓
Hash password using bcrypt
        ↓
Create User
        ↓
Save to DB
        ↓
Success
```

---

## 2. LOGIN USER

```text
Get email, password
        ↓
Validate input
        ↓
Find user by email
        ↓
Compare password with bcrypt
        ↓
If wrong → Error
        ↓
Create JWT
        ↓
Store JWT in HTTP-only Cookie
        ↓
Success
```

---

## 3. UPDATE USER

```text
Get id from req.params
        ↓
Find user by ID
        ↓
If not found → Error
        ↓
Update user with req.body
        ↓
Return updated user
```

---

## 4. DELETE USER

```text
Get id from req.params
        ↓
Find user
        ↓
If not found → Error
        ↓
Delete user
        ↓
Success
```

---

## 5. FORGOT PASSWORD

```text
Get email
        ↓
Find user
        ↓
If not found → Error
        ↓
Generate JWT reset token
        ↓
Set expiry = 15 minutes
        ↓
Create reset link
        ↓
Send / Return reset link
```

---

## 6. RESET PASSWORD

```text
Get token from req.params
        ↓
Get new password from req.body
        ↓
Verify JWT
        ↓
Get userId from decoded token
        ↓
Find user by ID
        ↓
Hash new password
        ↓
Update password
        ↓
Save user
        ↓
Success
```

---

## 7. GET ALL USERS — PAGINATION

```text
Get page from req.query
        ↓
Set limit
        ↓
Calculate skip
        ↓
Count total users
        ↓
Calculate total pages
        ↓
Find users
        ↓
Apply skip + limit
        ↓
Return users + pagination info
```

---

## 🧠 Quick Revision

| Operation | Flow |
|---|---|
| **Register** | Validate → Check → Hash → Create → Save |
| **Login** | Validate → Find → Compare → JWT → Cookie |
| **Update** | ID → Find → Update → Return |
| **Delete** | ID → Find → Delete |
| **Forgot Password** | Email → Find → JWT → 15 min → Reset Link |
| **Reset Password** | Token → Verify → User ID → Hash → Update |
| **Pagination** | Page → Limit → Skip → Count → Find → Return |
```
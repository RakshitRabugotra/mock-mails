# 📬 Mail API Server

A lightweight Express.js REST API to manage mails using a file-based JSON database powered by `lowdb`.

## 🚀 Features

- 📩 Get a single mail by ID
- ✏️ Update mail by ID
- 🗑️ Delete mail by ID
- 📄 Paginated list of mails
- 🔍 Search mails by query
- 📦 JSON-based storage (no SQL or external DB needed)

## 🛠 Tech Stack

- Node.js
- Express
- [lowdb](https://github.com/typicode/lowdb) (with `JSONFilePreset`)

---

## 📦 Installation

```bash
git clone https://github.com/RakshitRabugotra/mock-mails
cd mock-mails
npm install
```

---

## ▶️ Run the Server

```bash
node index.js
```

Server will start on `http://localhost:3001` by default. You can set a custom port via `PORT` environment variable.

---

## 📂 API Endpoints

### 1. **GET /mails/:id**

Fetch a single mail by its ID.

**Example:**

```http
GET /mails/abc123
```

---

### 2. **PUT /mails/:id**

Update an existing mail with new data.

**Example:**

```http
PUT /mails/abc123
Content-Type: application/json

{
  "subject": "Updated Subject",
  "read": true
}
```

---

### 3. **DELETE /mails/:id**

Delete a mail by ID.

**Example:**

```http
DELETE /mails/abc123
```

---

### 4. **GET /mails?_page=1&_perPage=10**

Get a paginated list of mails.

**Example:**

```http
GET /mails?_page=2&_perPage=10
```

If no query params are provided, returns the **full list**.

---

### 5. **GET /search?q=yourQuery**

Search mails by sender, subject, or body.

**Example:**

```http
GET /search?q=meeting
```

---

## 🗃️ Database

All data is stored in `db.json` in this format:

```json
{
  "mails": [
    {
      "id": "abc123",
      "sender": "alice@example.com",
      "subject": "Hello",
      "body": "Just checking in!",
      "read": false
    }
  ]
}
```

The file is automatically created if it doesn’t exist.

---

## 🧪 Example with cURL

```bash
curl http://localhost:3001/mails/abc123
```

---

## 📜 License

MIT © [Your Name or Org]
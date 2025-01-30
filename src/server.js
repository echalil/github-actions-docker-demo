const express = require("express");
const { Client } = require("pg"); // 引入 PostgreSQL 连接库
const app = express();

// 连接数据库
// 连接数据库
const { Client } = require("pg");  // ✅ 确保正确导入

const client = new Client({  // ✅ 变量名小写
  connectionString: process.env.DATABASE_URL,  // 读取环境变量
  ssl: {
    rejectUnauthorized: false,  // 适用于 Railway 部署
  },
});

// 只需要一次连接
client.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Database connection error:", err));


// 确保 users 表存在
client.query(
  "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT)",
  (err) => {
    if (err) console.error(err);
  }
);

// 首页
app.get("/", (req, res) => res.send("Hello, GitHub Actions & Docker with Node.js!"));

// 获取用户列表
app.get("/users", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取时间
app.get("/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

// 监听端口
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;

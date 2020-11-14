# My Todo App

https://todo.xuchunyang.me/

实现一个 Todo 应用：

- [x] 用户注册新账户
- [x] 用户登陆
- [x] 记住登陆状态
- [x] 管理 Todo
- [x] 存储 Todo
- [x] 存储密码哈希，而不是明文
- [x] 用容器部署
- [ ] 美化界面
- [ ] 安全 CSRF [Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
  - [x] SameSite
  - [x] 改 GET 为 POST, DELETE, PUT（但是对于这个 JavaScript-free 网站没法发送 DELETE PUT）
  - [x] 检查 Referer, sec-fetch-site: same-origin, sec-fetch-site: cross-site
  - [ ] CSRF token
- [ ] 网站更新后如何自动部署
- [ ] 更新部署时如何不覆盖数据库
- [ ] 如何备份数据库
- [ ] 防止暴力破解密码 http://expressjs.com/en/advanced/best-practice-security.html#prevent-brute-force-attacks-against-authorization
- [ ] Rate limit

## 使用容器部署

    # 1. 构建镜像
    $ podman build -t todo .

    # 2. 运行容器
    $ podman run --rm -d -p 4777:4777 -e COOKIE_SECRET=change_me todo

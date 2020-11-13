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

## 使用容器部署

    # 1. 构建镜像
    $ podman build -t todo .

    # 2. 运行容器
    $ podman run --rm -d -p 4777:4777 -e COOKIE_SECRET=change_me todo

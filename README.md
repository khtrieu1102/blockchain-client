## 1. Cấu trúc thư mục

```
client
│   README.md
│   package.json
│   .gitignore
│
└───public
│   │   favicon.ico
│   │   index.html
│
└───src
    │   index.css
    │   index.js (run here)
    └───app
        └───components (JSX component, reusable things)
        └───httpClient (config http/axios, token, refresh)
        └───views (screens)
        └───routes (config routes for role/public/private)
            │   PrivateRoute.js (custom Route from react-route-dom)
            │   public_routes.js
            │   admin_routes.js
            │   employee_routes.js
            │   authenticating_routes.js
```

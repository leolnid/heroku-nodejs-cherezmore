## Исходные код сайта CherezMore
Онлайн версия - [cherezmore](https://cherezmore.leooo.ru/)

## Backend:
* [x] Create server folder
* [x] Basic express app
* [x] Catch errors
* [x] Catch 404
* [ ] Public REST API "/api"
    * [ ] User routes "/user"
        * [x] GET "/"
        * [ ] GET "/:id"
        * [ ] POST "/" (Admin only)
        * [ ] UPDATE "/:id" (Admin or Moderator only)
        * [ ] DELETE "/:id" (Admin only)
    * [ ] Auth routes "/auth"
        * [x] POST /register
        * [x] POST /login
        * [ ] POST /verfi/:id
        * [ ] POST /resend
        * [ ] POST /recover
        * [ ] POST /reset
    * [ ] Order routes "/order"
        * [ ] GET "/"
        * [ ] POST "/"
        * [ ] UPDATE "/"
    * [ ] Products routes "/products"
        * [ ] GET "/"
        * [ ] POST "/" (Admin or Moderator only)
        * [ ] UPDATE "/" (Admin or Moderator only)


#DevTinder APIs

## authRoutes
- POST /signUp
- POST /login
- POST /logout

## updateRoutes
- GET /profile/view
- PATCH /profie/edit
- PATCH /profile/password

## connectionRequestRoutes
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accept
- POST /request/review/reject

## userRoutes
- GET /user/connections
- GET /user/requests
- GET /user/feed
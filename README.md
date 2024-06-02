Auth routes:
- POST /auth/signIn (email, password) -> sign in for user
- POST /auth/signUp (name, password, email, phone_number) -> sign up user
- POST /auth/forgotPassword (emai) -> send OTP to user email to verify update password
- POST /auth/checkOTP (email, OTP) -> verify OTP and make new password for user

Booking routes:
- POST /booking/bookRoom (user_id, room_id, start_date, end_date) -> booking for user (date format: yyyy-mm-dd)
- GET /booking/getTrip (user_id) -> Get trips of user
- POST /booking/cancelTrip (trip_id) -> cancel user's trip

Room routes:
- POST /room/addRoom (name,summary,transit,house_rules,host_id,street,smart_location,country,latitude,longitude,room_type,bathRooms,bedRooms,beds,price,weekly_price) -> add room
- POST /room/addImageToRoom (image(file), room_id) -> add image to room
- GET /room/getRoomInfo (room_id) -> get info of the room
- GET /room/getRoom (room_type, smart_location, min_price, max_price, is_sort_price) -> search for rooms

User route:
- GET user/host(user_id) -> get user's owned rooms

Wish list routes:
- POST wishList/addWishList(user_id, room_id) -> add room to user's wish list
- GET wishList/getWishList(user_id) -> get user's wish list
- DELETE wishList/removeWishList(user_id, room_id) -> remove 1 room from user's wish list 

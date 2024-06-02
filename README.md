Auth routes:
- POST /auth/signIn (email, password) -> sign in for user
- POST /auth/signUp (name, password, email, phone_number) -> sign up user
- POST /auth/forgotPassword (emai) -> send OTP to user email to verify update password
- POST /auth/checkOTP (email, OTP) -> verify OTP and make new password for user
Booking routes:
- POST /booking/bookRoom (user_id, room_id, start_date, end_date) -> booking for user (date format: yyyy-mm-dd)
- GET /booking/getTrip (user_id) -> Get trips of user
- POST /booking/cancelTrip (trip_id) -> cancel user's trip

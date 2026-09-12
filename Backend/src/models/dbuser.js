import pool from "../config/db.js";
export const findUserByEmail = async(email)=>
{
    const result = await pool.query(`SELECT * FROM dbusers WHERE email = $1 `,[email]);
    return result.rows[0];
}
export const findUserById = async(id)=>
{
    const result = await pool.query(`SELECT id,email,name,image_url,created_at from dbusers WHERE id = $1`,[id]);
    return result.rows[0]
}
export const createUser  = async({email,name,passwordHash})=>
{
    const result = await pool.query(`INSERT INTO dbusers (email,name,password_hash) VALUES ($1,$2,$3) RETURNING id,email,name,image_url,created_at`,[email,name,passwordHash]);
    return result.rows[0]
}
export const createGoogleUser = async({email,name,googleId,imageUrl})=>
{
    const result = await pool.query(`INSERT INTO dbusers(email,name,google_id,image_url) VALUES($1,$2,$3,$4) RETURNING id,email,name,image_url,created_at`,[email,name,googleId,imageUrl])
    return result.rows[0]
}
export const forgetPassword = async({email,otp,otpExpiry})=>
{
    const result = await pool.query(`UPDATE dbusers SET otp =$1,otp_expiry = $2 WHERE email = $3 RETURNING email,otp,otp_expiry`,[otp,otpExpiry,email]);
    return result.rows[0]
}
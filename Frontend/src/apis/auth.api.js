export const signupUser = async(data)=>
{
    const response = await fetch("http://localhost:8080/api/auth/signup", 
        {
            method:"POST",
            headers:
            {
                "Content-Type":"application/json",
            },
            body:JSON.stringify(data)
        }
    )
    const result = await response.json();
    if(!response.ok)
    {
        throw new Error(result.message)
    }
    return result;
}
export const loginUser = async(data)=>
{
    const response = await fetch("http://localhost:8080/api/auth/login", 
        {
            method:"POST",
            headers:
            {
                "Content-Type":"application/json",
            },
            credentials:"include",
            body:JSON.stringify(data)
        }
    )
    const result = await response.json();
    if(!response.ok)
    {
        throw new Error(result.message)
    }
    return result;
}
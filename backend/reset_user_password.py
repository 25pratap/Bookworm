from database.supabase_client import supabase
from utils.security import hash_password


# User email
email = "itspratap23@gmail.com"


# New password
new_password = "pratap@123"


# Generate bcrypt hash
hashed_password = hash_password(new_password)


# Update password in profiles table
result = (
    supabase
    .table("profiles")
    .update({
        "password": hashed_password
    })
    .eq("email", email)
    .execute()
)


print("User password updated successfully")
print(result.data)
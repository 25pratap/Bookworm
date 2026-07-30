from database.supabase_client import supabase
from utils.security import hash_password


# Admin email
email = "admin@gmail.com"


# New password
new_password = "Admin@123"


# Create bcrypt password
hashed_password = hash_password(new_password)


# Update Supabase profiles table
result = (
    supabase
    .table("profiles")
    .update({
        "password": hashed_password
    })
    .eq("email", email)
    .eq("role", "admin")
    .execute()
)


print("Password updated successfully")
print(result.data)
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;

public static class PasswordHelper
{
    public static string HashPassword(string password)
    {
        var hasher=new PasswordHasher<object>();
        return hasher.HashPassword(null!,password);
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        var hasher= new PasswordHasher<object>();  
        var result=hasher.VerifyHashedPassword(null!,storedHash,password);
        return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}

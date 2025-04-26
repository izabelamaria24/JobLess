using System.ComponentModel.DataAnnotations;

public class LinkedInUrlAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string url && !string.IsNullOrEmpty(url))
        {
            if (!Uri.IsWellFormedUriString(url, UriKind.Absolute))
            {
                return new ValidationResult("Link-ul nu este un URL valid.");
            }

            if (!url.Contains("linkedin.com"))
            {
                return new ValidationResult("Trebuie sa fie un link catre LinkedIn (ex: https://linkedin.com/in/username)");
            }
        }
        return ValidationResult.Success!;
    }
}

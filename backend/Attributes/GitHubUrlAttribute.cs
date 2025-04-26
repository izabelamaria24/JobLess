using System.ComponentModel.DataAnnotations;

public class GitHubUrlAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string url && !string.IsNullOrEmpty(url))
        {
            if (!Uri.IsWellFormedUriString(url, UriKind.Absolute))
            {
                return new ValidationResult("Link-ul nu este un URL valid.");
            }

            if (!url.Contains("github.com"))
            {
                return new ValidationResult("Trebuie sa fie un link catre GitHub (ex: https://github.com/username)");
            }
        }
        return ValidationResult.Success!;
    }
}

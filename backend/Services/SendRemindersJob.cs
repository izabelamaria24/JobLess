using JoblessAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace JoblessAPI.Services
{    public class SendRemindersJob
    {
        private readonly EmailService _emailService;
        private readonly AppDbContext _db;

        public SendRemindersJob(EmailService emailService, AppDbContext db)
        {
            _emailService = emailService;
            _db = db;
        }

        public async Task Trigger()
        {
            Console.WriteLine("Hangfire job triggered at " + DateTime.Now);

            var now = DateTime.UtcNow;
            var threeDaysFromNow = now.AddDays(3);

            var responses = await _db.Responses
                .Where(r => r.Deadline >= now && r.Deadline <= threeDaysFromNow)
                .Include(r => r.Application)
                .ThenInclude(a => a.User)
                .ToListAsync();

            foreach (var response in responses)
            {
                var user = response.Application.User;
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    string subject = "Reminder: Upcoming Deadline";
                    string body = $@"
                    <html>
                        <body>
                            <p>Dear {user.FirstName},</p>
                            <p>This is a reminder that you have a deadline on <strong>{response.Deadline:dd MMM, yyyy}</strong>.</p>
                            <p>Please make sure to complete your action before the deadline.</p>
                            <br/>
                            <p>Best regards,<br>Jobless Team</p>
                        </body>
                    </html>";

                    await _emailService.SendEmailAsync(user.Email, subject, body);
                }
            }
        }
    }

}
